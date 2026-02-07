import { z } from 'zod';

export const LoginSchema = z.object({
  identifier: z.string().min(1, 'Email/Username is required.').refine(val => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val) || /^[a-zA-Z0-9_]+$/.test(val), "Must be a valid email or username"),
  password: z.string().min(1, "Password is required.")
})

export const RegistrationSchema = z.object({
  fullname:z.string().min(1, "Full name is required."),
  username: z.string().min(3, "Username must be at least 3 characters").max(20, "Username must be at most 20 characters").regex(/^[a-zA-Z0-9_]+$/, "Username can only contain letters, numbers, and underscores"),
  email: z.string().email("Please enter a valid email"),
  currency: z.string().min(1, "Please select a currency"),
  password: z.string().min(8, "Password is required and must be at least 8 characters"),
  confirmPassword: z.string().min(8, "Confirm Password is required and must be at least 8 characters"),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

export const FindAccountSchema = z.object({
  identifier: z.string().min(1,"Please enter a valid email/username"),
});

export const ChangePasswordSchema = z.object({
  password: z.string().min(8, "Password is required and must be at least 8 characters"),
  confirmPassword: z.string().min(8, "Confirm Password is required and must be at least 8 characters"),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

export type LoginFormData = z.infer<typeof LoginSchema>;
export type RegistrationFormData = z.infer<typeof RegistrationSchema>;
export type FindAccountFormData = z.infer<typeof FindAccountSchema>;
export type ChangePasswordFormData = z.infer<typeof ChangePasswordSchema>;