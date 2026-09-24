import { randomUUID } from "node:crypto";
import bcrypt from "bcryptjs";

import prisma from "../lib/prisma";
import type {
   PendingSignup 
  } from "@prisma/client";

import { sendEmail } from "./email.service";

import {
    generateOtp,
    hashSignupOtp,
    matchesSignupOtp,
 } from "../lib/otp" ;

import {
    SignupInput
} from "../validations/signup.schema";

import type {
  VerifySignupInput,
} from "../validations/verifySignup.schema";

export async function preparePendingSignup(input: SignupInput){
    const signupId = randomUUID();
    const otp = generateOtp();

    const passwordHash = await bcrypt.hash(input.password, 10);

    const otpHash = hashSignupOtp(
        signupId,
        input.email,
        otp
    );

    const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

    return {
        otp,
        pendingData: {
            id: signupId,
            name: input.name,
            email: input.email,
            passwordHash,
            otpHash,
            expiresAt,
        },
    };
}

export async function createPendingSignup(input: SignupInput) {
  const email = input.email.trim().toLowerCase();

  const { otp, pendingData } = await preparePendingSignup({
    ...input,
    email,
  });

  return prisma.$transaction(async (tx) => {
    // Requests for the same email must take turns.
    const lockKey = `signup:${email}`;

    await tx.$queryRaw`
      SELECT pg_advisory_xact_lock(
        hashtext(${lockKey})::bigint
      )::text
    `;

    const existingUser = await tx.user.findFirst({
      where: {
        email: {
          equals: email,
          mode: "insensitive",
        },
      },
    });

    if (existingUser) {
      throw new SignupRequestError(
        "An account with this email already exists.",
        409
      );
    }

    const pending = await tx.pendingSignup.findUnique({
      where: { email },
    });

    const now = new Date();
    const sendState = getSignupSendState(pending, now);

    const data = {
      ...pendingData,
      ...sendState,
      attempts: 0,
      consumedAt: null,
      lastSentAt: now,
      expiresAt: new Date(now.getTime() + 10 * 60 * 1000),
    };

    const pendingSignup = await tx.pendingSignup.upsert({
      where: { email },
      create: data,
      update: data,
    });

    return {
      signupId: pendingSignup.id,
      email: pendingSignup.email,
      expiresAt: pendingSignup.expiresAt,
      otp,
    };
  });
}

export class SignupRequestError extends Error {
  constructor(
    message: string,
    public statusCode: number,
    public retryAfter?: number
  ) {
    super(message);
    this.name = "SignupRequestError";
  }
}

function getSignupSendState(
  pending: PendingSignup | null,
  now: Date
) {
  // First request for this email.
  if (!pending) {
    return {
      sendCount: 1,
      sendWindowStartedAt: now,
    };
  }

  const nextAllowedAt = pending.lastSentAt.getTime() + 60_000;

  if (now.getTime() < nextAllowedAt) {
    const secondsRemaining = Math.ceil(
      (nextAllowedAt - now.getTime()) / 1000
    );

    throw new SignupRequestError(
      "Please wait before requesting another code.",
      429,
      secondsRemaining
    );
  }

  const windowEndsAt =
    pending.sendWindowStartedAt.getTime() + 60 * 60 * 1000;

  // The previous one-hour window has ended.
  if (now.getTime() >= windowEndsAt) {
    return {
      sendCount: 1,
      sendWindowStartedAt: now,
    };
  }

  if (pending.sendCount >= 5) {
    const secondsRemaining = Math.ceil(
      (windowEndsAt - now.getTime()) / 1000
    );

    throw new SignupRequestError(
      "Too many code requests. Please try again later.",
      429,
      secondsRemaining
    );
  }

  return {
    sendCount: pending.sendCount + 1,
    sendWindowStartedAt: pending.sendWindowStartedAt,
  };
}

export async function requestSignupVerification(input: SignupInput) {
  const pending = await createPendingSignup(input);

  try {
    await sendEmail({
      to: pending.email,
      subject: "Verify your TaskFlow email",
      text: [
        `Your verification code is ${pending.otp}.`,
        "This code expires in 10 minutes.",
        "If you did not request this code, ignore this email.",
      ].join("\n\n"),
    });
  } catch {
    // Invalidate this code if email delivery reports a failure.
    // Keep the record so its resend limits remain in place.
    await prisma.pendingSignup.updateMany({
      where: {
        id: pending.signupId,
      },
      data: {
        expiresAt: new Date(0),
      },
    });

    throw new SignupRequestError(
      "Unable to send the verification email. Please try again later.",
      503
    );
  }

  // Only return information that can safely go into the API response.
  return {
    signupId: pending.signupId,
    email: pending.email,
    expiresAt: pending.expiresAt,
    message: "Verification code sent. Check your inbox and spam folder.",
  };
}

export async function verifyPendingSignup(input: VerifySignupInput) {
  const email = input.email.trim().toLowerCase();

  const user = await prisma.$transaction(async (tx) => {
    // Use the same lock as signup and resend.
    const lockKey = `signup:${email}`;

    await tx.$queryRaw`
      SELECT pg_advisory_xact_lock(
        hashtext(${lockKey})::bigint
      )::text
    `;

    const pending = await tx.pendingSignup.findUnique({
      where: { email },
    });

    const now = new Date();

    if (
      !pending ||
      pending.id !== input.signupId ||
      pending.consumedAt !== null ||
      pending.expiresAt.getTime() <= now.getTime() ||
      pending.attempts >= 5
    ) {
      return null;
    }

    const codeMatches = matchesSignupOtp(
      pending.id,
      pending.email,
      input.otp,
      pending.otpHash
    );

    if (!codeMatches) {
      await tx.pendingSignup.update({
        where: { id: pending.id },
        data: {
          attempts: { increment: 1 },
        },
      });

     
      return null;
    }

    const existingUser = await tx.user.findFirst({
      where: {
        email: {
          equals: email,
          mode: "insensitive",
        },
      },
    });

    if (existingUser) {
      return null;
    }

    const createdUser = await tx.user.create({
      data: {
        name: pending.name,
        email: pending.email,
        password: pending.passwordHash,
        emailVerifiedAt: now,
      },
      select: {
        id: true,
        name: true,
        email: true,
        avatar: true,
        role: true,
        tokenVersion: true,
      },
    });

    await tx.pendingSignup.update({
      where: { id: pending.id },
      data: {
        consumedAt: now,
        otpHash: "",
        passwordHash: "",
      },
    });

    return createdUser;
  });

  if (!user) {
    throw new SignupRequestError(
      "Invalid or unavailable verification code. Request a new code if needed.",
      400
    );
  }

  return user;
}