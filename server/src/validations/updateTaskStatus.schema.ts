import { z } from "zod";

export const updateTaskStatusSchema = z.object({
  status: z.enum([
    "TODO",
    "IN_PROGRESS",
    "DONE",
  ]),
});

export type UpdateTaskStatusInput =
  z.infer<typeof updateTaskStatusSchema>;