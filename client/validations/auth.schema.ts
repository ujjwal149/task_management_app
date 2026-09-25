import {z} from "zod";


/* ------------------- Sign In Validation --------------------- */
export  const signInSchema = z.object({
    email: z
        .email("Invalid email address"),

    password: z
        .string()
        .min(8,"Password must be atleast 8 characters"),
});

export type SignInFormData = z.infer<typeof signInSchema>;


/* ------------------ Sign Up Validation ----------------------- */
export const signupSchema = z.object({
  name: z
    .string()
    .min(3, "Name must be at least 3 characters")
    .max(50, "Name must be less than 50 characters"),

  email: z
    .string()
    .email("Please enter a valid email"),

  password: z
    .string()
    .min(6, "Password must be at least 6 characters"),
});

export type SignUpFormData = z.infer<typeof signupSchema>;

//-------------Forgot Password Validation --------------------//
export const forgotPasswordSchema = z.object({
  email: z
    .string()
    .trim()
    .toLowerCase()
    .email("Please enter a valid email address"),
});

export type ForgotPasswordFormData =
  z.infer<typeof forgotPasswordSchema>;

//-------------- Reset Password Validation --------------------//
export const resetPasswordSchema = z
  .object({
    otp: z
      .string()
      .regex(/^\d{6}$/, "Enter the six-digit code"),

    newPassword: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .refine(
        (password) =>
          new TextEncoder().encode(password).length <= 72,
        "Password must be at most 72 bytes"
      ),

    confirmPassword: z
      .string()
      .min(1, "Please confirm your new password"),
  })
  .refine(
    (data) => data.newPassword === data.confirmPassword,
    {
      message: "Passwords do not match",
      path: ["confirmPassword"],
    }
  );

export type ResetPasswordFormData =
  z.infer<typeof resetPasswordSchema>;



 

