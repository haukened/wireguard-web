import { z } from 'zod';

export const profileFormSchema = z.object({
    firstname: z.string().min(3).max(50),
    lastname: z.string().min(3).max(50),
    email: z.string().email('Invalid email address'),
});

export type ProfileFormSchema = typeof profileFormSchema;
