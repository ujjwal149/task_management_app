import { createHmac, randomInt, randomUUID, timingSafeEqual } from "node:crypto";
import { OtpPurpose, Prisma } from "@prisma/client";
import bcrypt from "bcryptjs";
import prisma from "../lib/prisma";
import { sendOtpEmail } from "./email.service";
import { SignupInput } from "../validations/signup.schema";

export class AuthError extends Error {
  constructor(public status: number, message: string, public retryAfter?: number) { super(message); }
}
const lifetime = 10 * 60 * 1000;
const hour = 60 * 60 * 1000;
const invalidCode = () => new AuthError(400, "Invalid or expired code. Request a new code if needed.");

// Serialize requests for one email across all server processes, including first use.
export async function lockEmail(tx: Prisma.TransactionClient, email: string) {
  await tx.$queryRaw`SELECT pg_advisory_xact_lock(hashtext(${`auth:${email}`})::bigint)::text`;
}
function digest(id: string, email: string, purpose: OtpPurpose, code: string) {
  const secret = process.env.OTP_SECRET;
  if (!secret || secret.length < 32) throw new Error("OTP_SECRET must have at least 32 characters");
  return createHmac("sha256", secret).update(`${id}:${email}:${purpose}:${code}`).digest("hex");
}
export async function requestOtp(email: string, purpose: OtpPurpose, signup?: SignupInput) {
  const challengeId = randomUUID();
  const code = randomInt(0, 1000000).toString().padStart(6, "0");
  const codeHash = digest(challengeId, email, purpose, code);
  const passwordHash = signup ? await bcrypt.hash(signup.password, 12) : null;
  const now = new Date();
  const shouldSend = await prisma.$transaction(async tx => {
    await lockEmail(tx, email);
    const previous = await tx.emailOtp.findUnique({ where: { email_purpose: { email, purpose } } });
    if (previous && previous.lastSentAt.getTime() + 60000 > now.getTime()) {
      throw new AuthError(429, "Please wait before requesting another code.",
        Math.ceil((previous.lastSentAt.getTime() + 60000 - now.getTime()) / 1000));
    }
    const sameWindow = previous && previous.windowStartedAt.getTime() + hour > now.getTime();
    if (sameWindow && previous.sendCount >= 5) {
      throw new AuthError(429, "Too many code requests. Please try again later.",
        Math.ceil((previous.windowStartedAt.getTime() + hour - now.getTime()) / 1000));
    }
    const user = await tx.user.findUnique({ where: { email } });
    const eligible = purpose === "SIGNUP" ? !user : Boolean(user);
    const data = {
      challengeId, codeHash: eligible ? codeHash : null,
      name: eligible ? signup?.name ?? null : null,
      passwordHash: eligible ? passwordHash : null,
      expiresAt: new Date(now.getTime() + lifetime), attempts: 0,
      lastSentAt: now, windowStartedAt: sameWindow ? previous.windowStartedAt : now,
      sendCount: sameWindow ? previous.sendCount + 1 : 1,
    };
    await tx.emailOtp.upsert({
      where: { email_purpose: { email, purpose } },
      create: { email, purpose, ...data }, update: data,
    });
    return eligible;
  });
  if (shouldSend) {
    try { await sendOtpEmail(email, code, purpose); }
    catch {
      // Preserve throttling counters, invalidate only this delivery attempt.
      await prisma.emailOtp.updateMany({
        where: { email, purpose, challengeId },
        data: { codeHash: null, name: null, passwordHash: null },
      });
      throw new AuthError(503, "Unable to send email right now. Please try again later.");
    }
  }
  return {
    challengeId, expiresIn: 600, retryAfter: 60,
    message: "If this email is eligible, a verification code has been sent. Check your inbox and spam folder.",
  };
}

export async function verifyOtp(email: string, purpose: OtpPurpose, challengeId: string, code: string, password?: string) {
  const expected = digest(challengeId, email, purpose, code);
  const passwordHash = password ? await bcrypt.hash(password, 12) : undefined;
  const result = await prisma.$transaction(async tx => {
    await lockEmail(tx, email);
    const otp = await tx.emailOtp.findUnique({ where: { email_purpose: { email, purpose } } });
    if (!otp || otp.challengeId !== challengeId || !otp.codeHash ||
      otp.expiresAt.getTime() <= Date.now() || otp.attempts >= 5) return null;
    if (!timingSafeEqual(Buffer.from(expected, "hex"), Buffer.from(otp.codeHash, "hex"))) {
      await tx.emailOtp.update({ where: { id: otp.id }, data: { attempts: { increment: 1 } } });
      return null; // Commit failed attempts; throwing here would roll them back.
    }
    let user = await tx.user.findUnique({ where: { email } });
    if (purpose === "SIGNUP") {
      if (user || !otp.name || !otp.passwordHash) return null;
      user = await tx.user.create({ data: {
        email, name: otp.name, password: otp.passwordHash, emailVerifiedAt: new Date(),
      } });
    } else {
      if (!user || (purpose === "RESET_PASSWORD" && !passwordHash)) return null;
      user = await tx.user.update({ where: { id: user.id }, data: {
        emailVerifiedAt: user.emailVerifiedAt ?? new Date(),
        // Legacy unverified accounts may contain an attacker-chosen password.
        ...(!user.emailVerifiedAt && purpose === "LOGIN" ? {
          password: null, tokenVersion: { increment: 1 },
        } : {}),
        ...(purpose === "RESET_PASSWORD" ? { password: passwordHash, tokenVersion: { increment: 1 } } : {}),
      } });
    }
    // Remove sensitive pending data, retaining the rate-limit window.
    await tx.emailOtp.updateMany({
      where: purpose === "RESET_PASSWORD" ? { email } : { id: otp.id },
      data: { codeHash: null, passwordHash: null, name: null },
    });
    return user;
  });
  if (!result) throw invalidCode();
  return result;
}
