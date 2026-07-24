import { z } from "zod";

export const updateProfileSchema = z.object({
  name: z
    .string()
    .min(2, "Name must be at least 2 characters.")
    .max(50),
});

export const updatePasswordSchema = z.object({
  currentPassword: z.string().min(6),

  newPassword: z.string().min(6),
});