import { z } from "zod";

export const createProjectSchema = z.object({
  name: z
    .string()
    .min(3, "Project name must be at least 3 characters")
    .max(100, "Project name cannot exceed 100 characters"),

  description: z
    .string()
    .max(500, "Description cannot exceed 500 characters")
    .optional(),

  color: z
    .string()
    .regex(
      /^#[0-9A-Fa-f]{6}$/,
      "Invalid color format"
    )
    .optional(),
});

export const updateProjectSchema =
  createProjectSchema.partial();