import { z } from "zod";
import { emailSchema, passwordSchema } from "./otp.schema";

export const signupSchema = z.object({
  name: z.string().trim().min(3).max(50),
  email: emailSchema,
  password: passwordSchema,
});
export type SignupInput = z.infer<typeof signupSchema>;
