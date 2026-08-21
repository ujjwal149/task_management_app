import { z } from "zod";

export const createTaskSchema = z.object({
  title: z
    .string()
    .min(3, "Title must be at least 3 characters.")
    .max(100, "Title cannot exceed 100 characters."),

  description: z
    .string()
    .max(500, "Description cannot exceed 500 characters.")
    .optional(),

  dueDate: z
    .string()
    .optional(),

  priority: z
    .enum(["LOW", "MEDIUM", "HIGH"])
    .optional(),

  projectId: z
    .string()
    .min(1, "Project is required."),
  assignToId: z
    .string()
    .min(1, "Assignee is required."),
});

export type CreateTaskInput =
  z.infer<typeof createTaskSchema>;