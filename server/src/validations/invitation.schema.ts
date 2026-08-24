

import { z } from "zod";

export const invitationIdSchema = z.object({
  invitationId: z
    .string()
    .min(1, "Invitation ID is required"),
});

export type InvitationIdInput =
  z.infer<typeof invitationIdSchema>;