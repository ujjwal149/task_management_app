import { z } from "zod";

export const forgotPasswordSchema = z.object({
  email: z
    .string()
    .trim()
    .toLowerCase()
    .email("Invalid email address"),
});

export const resetPasswordSchema = z.object({
  resetId: z
    .string()
    .uuid("Invalid reset request"),

  otp: z
    .string()
    .regex(/^\d{6}$/, "Enter a six-digit code"),

  newPassword: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .refine(
      (password) => Buffer.byteLength(password, "utf8") <= 72,
      "Password must be at most 72 bytes"
    ),
});

export type ForgotPasswordInput =
  z.infer<typeof forgotPasswordSchema>;

export type ResetPasswordInput =
  z.infer<typeof resetPasswordSchema>;