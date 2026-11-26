import { z } from 'zod';

// Login schema - accepts either email or NIP
export const loginSchema = z.object({
  identifier: z.string()
    .min(1, 'Username/email tidak boleh kosong')
    .max(100, 'Username/email terlalu panjang'),
  password: z.string()
    .min(1, 'Password tidak boleh kosong')
    .max(100, 'Password terlalu panjang'),
  rememberMe: z.boolean().optional().default(false),
  expectedRole: z.enum(['admin', 'karyawan']).optional(),
});

// Change password schema
export const changePasswordSchema = z.object({
  currentPassword: z.string()
    .min(1, 'Password lama tidak boleh kosong'),
  newPassword: z.string()
    .min(8, 'Password baru minimal 8 karakter')
    .max(100, 'Password baru terlalu panjang'),
  confirmPassword: z.string(),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: 'Password baru tidak cocok',
  path: ['confirmPassword'],
});

// Forgot password schema
export const forgotPasswordSchema = z.object({
  email: z.string()
    .email('Email tidak valid')
    .min(1, 'Email tidak boleh kosong'),
});

// Reset password schema
export const resetPasswordSchema = z.object({
  token: z.string()
    .min(1, 'Token tidak boleh kosong'),
  password: z.string()
    .min(8, 'Password minimal 8 karakter')
    .max(100, 'Password terlalu panjang'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Password tidak cocok',
  path: ['confirmPassword'],
});

// Update password schema (without current password - for admin)
export const updatePasswordSchema = z.object({
  employeeId: z.string().cuid('ID karyawan tidak valid'),
  newPassword: z.string()
    .min(8, 'Password baru minimal 8 karakter')
    .max(100, 'Password baru terlalu panjang'),
});

export type LoginInput = z.infer<typeof loginSchema>;
export type ChangePasswordInput = z.infer<typeof changePasswordSchema>;
export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>;
export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>;
export type UpdatePasswordInput = z.infer<typeof updatePasswordSchema>;