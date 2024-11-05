import { z } from 'zod';

export const setupFormSchema = z.object({
    firstname: z.string(),
    lastname: z.string(),
    email: z.string()
        .email('Invalid email address'),
    password: z.string()
        .min(8, 'Password must be at least 8 characters long')
        .max(255, 'Password must be at most 255 characters long')
        .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/, 'Password must contain at least one lowercase letter, one uppercase letter, and one number')
});

export type SetupFormSchema = typeof setupFormSchema;