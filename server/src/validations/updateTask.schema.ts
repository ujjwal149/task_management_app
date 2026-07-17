import { z } from "zod";

export const updateTaskSchema = z.object({
  title: z
    .string()
    .min(3)
    .optional(),

  description: z
    .string()
    .optional(),

  priority: z
    .enum(["LOW", "MEDIUM", "HIGH"])
    .optional(),

  status: z
    .enum(["TODO", "IN_PROGRESS", "DONE"])
    .optional(),

  dueDate: z
    .string()
    .optional(),
});

export type UpdateTaskInput = z.infer<
  typeof updateTaskSchema
>;