import { z } from 'zod';

// dont tell them errors, so not to disclose anything
export const userFormSchema = z.object({
    id: z.number().int().positive().optional(),
    firstname: z.string().min(3).max(50),
    lastname: z.string().min(3).max(50),
    email: z.string().email(),
    disabled: z.boolean().default(false).optional(),
});

export type UserFormSchema = typeof userFormSchema;