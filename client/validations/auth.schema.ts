import {z} from "zod";


/* -----------------------------
   Sign In Validation
------------------------------ */
export  const signInSchema = z.object({
    email: z
        .email("Invalid email address"),

    password: z
        .string()
        .min(8,"Password must be atleast 8 characters"),
});

export type SignInFormData = z.infer<typeof signInSchema>;


/* -----------------------------
   Sign Up Validation
------------------------------ */
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