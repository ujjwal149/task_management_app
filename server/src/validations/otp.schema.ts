import { z } from "zod";

export const emailSchema = z.string().trim().toLowerCase().email().max(254);
export const passwordSchema = z.string().min(8, "Password must be at least 8 characters")
  .refine(value => Buffer.byteLength(value, "utf8") <= 72, "Password must be at most 72 UTF-8 bytes");
export const otpRequestSchema = z.object({ email: emailSchema });
export const otpVerifySchema = otpRequestSchema.extend({
  challengeId: z.uuid(),
  code: z.string().regex(/^\d{6}$/, "Enter the six-digit code"),
});
export const resetPasswordSchema = otpVerifySchema.extend({ password: passwordSchema });
