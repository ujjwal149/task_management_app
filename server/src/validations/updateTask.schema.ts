import {z} from "zod";

export const    updateTaskSchema = z.object({
    status: z
        .enum(["TODO","IN_PROGRESS","DONE"])
        .optional(),
    dueDate: z
        .string()
        .datetime()
        .optional(),
});