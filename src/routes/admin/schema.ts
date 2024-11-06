import { z } from 'zod';

// dont tell them errors, so not to disclose anything
export const userFormSchema = z.object({
    firstname: z.string().min(3).max(50),
    lastname: z.string().min(3).max(50),
    email: z.string().email(),
});

export type UserFormSchema = typeof userFormSchema;