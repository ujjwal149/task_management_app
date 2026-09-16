import { z } from "zod";
import { emailSchema } from "./otp.schema";

export const signinSchema = z.object({
  email: emailSchema,
  password: z.string().min(1).max(1024),
});
export type SigninInput = z.infer<typeof signinSchema>;
