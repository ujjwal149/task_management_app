import { z } from "zod";

export const inviteMemberSchema = z.object({
  email: z
    .string()
    .email("Invalid email address"),

  role: z
    .enum(["USER", "ADMIN"]),

  projectId: z
    .string()
    .min(1, "Project ID is required"),
});

export type InviteMemberInput =
  z.infer<typeof inviteMemberSchema>;