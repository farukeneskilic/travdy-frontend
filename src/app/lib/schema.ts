// src/lib/schema.ts
import {z} from 'zod';

export const loginSchema = z.object({
    email: z.string().email('Enter a valid email'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
    remember: z.boolean().optional(),
});

export type LoginValues = z.infer<typeof loginSchema>;

export const registerSchema = z.object({
    displayName: z.string().min(2, 'Name must be at least 2 characters'),
    email: z.string().email('Enter a valid email'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
    confirm: z.string(),
}).refine((d) => d.password === d.confirm, {
    path: ['confirm'],
    message: 'Passwords do not match',
});

export type RegisterValues = z.infer<typeof registerSchema>;
