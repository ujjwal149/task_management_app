import {z} from "zod";

export const createProjectSchema = z.object({
    name: z
        .string()
        .min(3,"Project name must be at least 3 characters")
        .max(100,"Project name cannot exceed 100 characters"),
    
    description: z
        .string()
        .max(500,"Description cannot exceed 500 characters")
        .optional(),
});

export const updateProjectSchema = createProjectSchema.partial();