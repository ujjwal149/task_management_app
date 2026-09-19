import { z }  from "zod";

export const verifySignupSchema = z.object({
    signupId: z
        .string()
        .uuid("Invalid signup request ID"),

    email: z
        .string()
        .trim()
        .toLowerCase()
        .email("Invalid email address"),
    otp: z
        .string()
        .regex(/^\d{6}$/, "OTP must contain exactly six digits"),
});

export type VerifySignupInput = z.infer<typeof verifySignupSchema>;