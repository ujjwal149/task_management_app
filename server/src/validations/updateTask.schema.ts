import { z } from "zod";

export const updateTaskSchema = z.object({

  title: z
    .string()
    .min(3)
    .max(100)
    .optional(),

  description: z
    .string()
    .max(500)
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

  projectId: z
    .string()
    .optional(),

});

export type UpdateTaskInput =
  z.infer<typeof updateTaskSchema>;