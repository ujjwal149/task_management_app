import {z}  from "zod";

export const createTaskSchema = z.object({
    title: z
        .string()
        .min(3,"Title must be atleast 3 characters"),

    description:z
        .string()
        .optional(),

    dueDate: z
        .string()
        .datetime()
        .optional(),
});

export type   CreateTaskInput = z.infer<typeof createTaskSchema>;
