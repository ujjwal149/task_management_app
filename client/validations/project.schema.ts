import { z } from "zod";

export const createProjectSchema = z.object({
  name: z
    .string()
    .min(2, "Project name must be at least 2 characters.")
    .max(50, "Project name cannot exceed 50 characters."),

  description: z
    .string()
    .max(200, "Description cannot exceed 200 characters.")
    .optional(),

  color: z
    .string()
    .optional(),
});

export const updateProjectSchema =
  createProjectSchema.partial();

export type CreateProjectInput =
  z.infer<typeof createProjectSchema>;

export type UpdateProjectInput =
  z.infer<typeof updateProjectSchema>;