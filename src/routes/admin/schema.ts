import { z } from 'zod';

// dont tell them errors, so not to disclose anything
export const userFormSchema = z.object({
    firstname: z.string(),
    lastname: z.string(),
    email: z.string().email(),
});

export type UserFormSchema = typeof userFormSchema;