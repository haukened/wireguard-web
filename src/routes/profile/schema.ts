import { z } from 'zod';

export const profileFormSchema = z.object({
    firstname: z.string(),
    lastname: z.string(),
    email: z.string()
        .email('Invalid email address')
        .max(255, 'Email must be at most 255 characters long')
        .optional(),
});

export type ProfileFormSchema = typeof profileFormSchema;
