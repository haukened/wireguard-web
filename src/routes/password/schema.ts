import { z } from 'zod';

export const passwordFormSchema = z.object({
    password: z.string()
        .min(8, 'Password must be at least 8 characters long')
        .max(255, 'Password must be at most 255 characters long')
        .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/, 'Password must contain at least one lowercase letter, one uppercase letter, and one number')
        .optional(),
    confirm: z.string()
        .min(8, 'Password must be at least 8 characters long')
        .max(255, 'Password must be at most 255 characters long')
        .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/, 'Password must contain at least one lowercase letter, one uppercase letter, and one number')
        .optional()
}).superRefine(({password, confirm}, ctx) => {
    if (password !== confirm) {
        ctx.addIssue({
            code: "custom",
            message: "Passwords do not match",
            path: ["confirm"]
        })
    }
});

export type PasswordFormSchema = typeof passwordFormSchema;