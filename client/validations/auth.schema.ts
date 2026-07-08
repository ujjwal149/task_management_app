import {z} from "zod";

export  const signInSchema = z.object({
    email: z
        .email("Invalid email address"),

    password: z
        .string()
        .min(8,"Password must be atleast 8 characters"),
});

export type SignInFormData = z.infer<typeof signInSchema>;