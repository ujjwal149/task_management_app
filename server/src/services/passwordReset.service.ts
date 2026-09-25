import type { PasswordReset } from "@prisma/client";
import { randomUUID } from "node:crypto";
import bcrypt from "bcryptjs";

import prisma from "../lib/prisma";

import {
  generateOtp,
  hashPasswordResetOtp,
  matchesPasswordResetOtp,
} from "../lib/otp";

import type {
  ForgotPasswordInput,
  ResetPasswordInput,
} from "../validations/passwordReset.schema";

import {
  disconnectUserSockets,
} from "../websocket/websocket.server";

import { sendEmail } from "./email.service";

// Determine whether another reset email may be sent.
export function getPasswordResetSendState(
  existing: PasswordReset | null,
  now: Date
) {
  if (!existing) {
    return {
      sendCount: 1,
      sendWindowStartedAt: now,
    };
  }

  const nextAllowedAt =
    existing.lastSentAt.getTime() + 60_000;

  if (now.getTime() < nextAllowedAt) {
    return null;
  }

  const windowEndsAt =
    existing.sendWindowStartedAt.getTime() +
    60 * 60 * 1000;

  if (now.getTime() >= windowEndsAt) {
    return {
      sendCount: 1,
      sendWindowStartedAt: now,
    };
  }

  if (existing.sendCount >= 5) {
    return null;
  }

  return {
    sendCount: existing.sendCount + 1,
    sendWindowStartedAt: existing.sendWindowStartedAt,
  };
}

// Create or replace a reset request.
// The returned OTP is for internal email sending only.
export async function createPasswordReset(
  input: ForgotPasswordInput
) {
  const email = input.email.trim().toLowerCase();

  return prisma.$transaction(async (tx) => {
    const user = await tx.user.findFirst({
      where: {
        email: {
          equals: email,
          mode: "insensitive",
        },
      },
      select: {
        id: true,
        email: true,
        password: true,
      },
    });

    // Google-only accounts cannot reset a local password.
    if (!user || !user.password) {
      return null;
    }

    const lockKey = `password-reset:${user.id}`;

    await tx.$queryRaw`
      SELECT pg_advisory_xact_lock(
        hashtext(${lockKey})::bigint
      )::text
    `;

    const existing = await tx.passwordReset.findUnique({
      where: { userId: user.id },
    });

    const now = new Date();

    const sendState = getPasswordResetSendState(
      existing,
      now
    );

    if (!sendState) {
      return null;
    }

    const resetId = randomUUID();
    const otp = generateOtp();

    const data = {
      id: resetId,
      userId: user.id,
      otpHash: hashPasswordResetOtp(
        resetId,
        user.id,
        otp
      ),
      expiresAt: new Date(
        now.getTime() + 10 * 60 * 1000
      ),
      attempts: 0,
      consumedAt: null,
      lastSentAt: now,
      ...sendState,
    };

    const reset = await tx.passwordReset.upsert({
      where: { userId: user.id },
      create: data,
      update: data,
    });

    return {
      resetId: reset.id,
      email: user.email,
      expiresAt: reset.expiresAt,
      otp,
    };
  });
}

// Send the code after request creation has committed.
export async function sendPasswordResetEmail(reset: {
  resetId: string;
  email: string;
  otp: string;
}) {
  try {
    await sendEmail({
      to: reset.email,
      subject: "Reset your TaskFlow password",
      text: [
        `Your password-reset code is ${reset.otp}.`,
        "This code expires in 10 minutes.",
        "If you did not request a password reset, ignore this email. Your password has not changed.",
      ].join("\n\n"),
    });
  } catch {
    // Invalidate only this request, preserving resend counters.
    await prisma.passwordReset.updateMany({
      where: {
        id: reset.resetId,
      },
      data: {
        expiresAt: new Date(0),
      },
    });

    throw new Error(
      "Unable to send password-reset email."
    );
  }
}

// Return the same public response structure for all account states.
export async function requestPasswordReset(
  input: ForgotPasswordInput
) {
  const response = {
    resetId: input.resetId ?? randomUUID(),
    message:
      "If this email belongs to an eligible account, a password-reset code will be sent. Check your inbox and spam folder.",
  };

  const reset = await createPasswordReset(input);

  if (!reset) {
    return response;
  }

  try {
    await sendPasswordResetEmail(reset);
  } catch {
    console.error(
      "Password-reset email delivery failed."
    );

    return response;
  }

  return {
    ...response,
    resetId: reset.resetId,
  };
}

// Verify the code, change the password, and consume the request.
export async function resetPassword(
  input: ResetPasswordInput
): Promise<boolean> {
  // Keep password hashing outside the transaction.
  const passwordHash = await bcrypt.hash(
    input.newPassword,
    10
  );

  let resetUserId: string | null = null;

  const success = await prisma.$transaction(async (tx) => {
    const initial = await tx.passwordReset.findUnique({
      where: { id: input.resetId },
      select: { userId: true },
    });

    if (!initial) {
      return false;
    }

    // Use the same lock as request creation and resending.
    const lockKey = `password-reset:${initial.userId}`;

    await tx.$queryRaw`
      SELECT pg_advisory_xact_lock(
        hashtext(${lockKey})::bigint
      )::text
    `;

    // Recheck after acquiring the lock.
    const reset = await tx.passwordReset.findUnique({
      where: { id: input.resetId },
      include: {
        user: {
          select: { password: true },
        },
      },
    });

    const now = new Date();

    if (
      !reset ||
      !reset.user.password ||
      reset.consumedAt !== null ||
      reset.expiresAt.getTime() <= now.getTime() ||
      reset.attempts >= 5
    ) {
      return false;
    }

    const matches = matchesPasswordResetOtp(
      reset.id,
      reset.userId,
      input.otp,
      reset.otpHash
    );

    if (!matches) {
      await tx.passwordReset.update({
        where: { id: reset.id },
        data: {
          attempts: { increment: 1 },
        },
      });

      // Returning lets the failed-attempt count commit.
      return false;
    }

    await tx.user.update({
      where: { id: reset.userId },
      data: {
        password: passwordHash,
        tokenVersion: {
          increment: 1,
        },
      },
    });

    await tx.passwordReset.update({
      where: { id: reset.id },
      data: {
        consumedAt: now,
        otpHash: "",
      },
    });

    resetUserId = reset.userId;

    return true;
  });

  // Disconnect sockets only after the transaction commits.
  if (success && resetUserId) {
    disconnectUserSockets(resetUserId);
  }

  return success;
}