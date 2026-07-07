import {z} from "zod";

export const signinSchema = z.object({
    email: z
        .string()
        .email("Invalid email"),
    password: z
        .string()
        .min(8,"Password must be atleast 8 characters"),

});

export type SigninInput = z.infer<typeof signinSchema>;