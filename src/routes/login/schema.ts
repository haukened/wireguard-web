import { z } from 'zod';

// dont tell them errors, so not to disclose anything
export const loginFormSchema = z.object({
    email: z.string().email(),
    password: z.string(),
});

export type LoginFormSchema = typeof loginFormSchema;