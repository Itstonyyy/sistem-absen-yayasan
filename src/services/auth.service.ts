import { db } from '@/lib/db';
import { verifyPassword, generateToken } from '@/lib/auth';
import { LoginInput } from '@/validations/auth.validation';

// Login attempt tracking (in-memory, will be replaced with Redis/DB in production)
const loginAttempts = new Map<string, { count: number; lastAttempt: number }>();
const MAX_LOGIN_ATTEMPTS = 5;
const LOCKOUT_DURATION = 15 * 60 * 1000; // 15 minutes in milliseconds

/**
 * Authenticate user and return session data
 */
export async function login(input: LoginInput) {
  const { identifier, rememberMe, expectedRole } = input;

  // Check login attempts
  const attempts = loginAttempts.get(identifier);
  if (attempts && attempts.count >= MAX_LOGIN_ATTEMPTS) {
    if (Date.now() - attempts.lastAttempt < LOCKOUT_DURATION) {
      throw new Error('Terlalu banyak percobaan login. Silakan coba lagi setelah 15 menit.');
    }
    // Reset attempts after lockout period
    loginAttempts.set(identifier, { count: 0, lastAttempt: 0 });
  }

  // Find user by email or NIP
  const employee = await db.employee.findFirst({
    where: {
      OR: [
        { email: identifier },
        { nip: identifier },
      ],
    },
  });
  
  // Check if role matches expected role (if provided)
  if (expectedRole && employee?.role !== expectedRole) {
    recordFailedAttempt(identifier);
    throw new Error('Role tidak sesuai. Silakan coba login dengan peran yang benar.');
  }

  if (!employee) {
    // Record failed attempt
    recordFailedAttempt(identifier);
    throw new Error('Email/NIP atau password tidak valid');
  }

  // Check if account is active
  if (!employee.isActive) {
    throw new Error('Akun tidak aktif. Mohon hubungi admin.');
  }

  // Verify password
  const isValidPassword = await verifyPassword(input.password, employee.passwordHash);
  if (!isValidPassword) {
    recordFailedAttempt(identifier);
    throw new Error('Email/NIP atau password tidak valid');
  }

  // Reset failed attempts on successful login
  loginAttempts.delete(identifier);

  // Generate token
  const token = generateToken({
    id: employee.id,
    email: employee.email,
    role: employee.role as 'admin' | 'karyawan',
  });

  return {
    user: {
      id: employee.id,
      name: employee.name,
      email: employee.email,
      role: employee.role,
      nip: employee.nip,
      jabatan: employee.jabatan,
    },
    token,
  };
}

/**
 * Get user by ID (for session verification)
 */
export async function getUserById(id: string) {
  const employee = await db.employee.findUnique({
    where: { id },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      nip: true,
      jabatan: true,
      isActive: true,
    },
  });

  if (!employee) {
    return null;
  }

  return employee;
}

/**
 * Change password for authenticated user
 */
export async function changePassword(
  userId: string,
  currentPassword: string,
  newPassword: string
) {
  const employee = await db.employee.findUnique({
    where: { id: userId },
  });

  if (!employee) {
    throw new Error('Pengguna tidak ditemukan');
  }

  // Verify current password
  const isValidPassword = await verifyPassword(currentPassword, employee.passwordHash);
  if (!isValidPassword) {
    throw new Error('Password lama tidak valid');
  }

  // Hash new password
  const { hashPassword } = await import('@/lib/auth');
  const newPasswordHash = await hashPassword(newPassword);

  // Update password
  await db.employee.update({
    where: { id: userId },
    data: { passwordHash: newPasswordHash },
  });

  return true;
}

/**
 * Get current user profile
 */
export async function getCurrentUserProfile(userId: string) {
  const employee = await db.employee.findUnique({
    where: { id: userId },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      nip: true,
      jabatan: true,
      telepon: true,
      jenisKelamin: true,
      tempatLahir: true,
      tanggalLahir: true,
      agama: true,
      alamat: true,
      avatarColor: true,
      isActive: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  if (!employee) {
    return null;
  }

  return employee;
}

/**
 * Record a failed login attempt
 */
function recordFailedAttempt(identifier: string) {
  const existingAttempts = loginAttempts.get(identifier);
  const newCount = (existingAttempts?.count || 0) + 1;
  loginAttempts.set(identifier, {
    count: newCount,
    lastAttempt: Date.now(),
  });
}

/**
 * Clear login attempts (for testing/admin use)
 */
export function clearLoginAttempts(identifier: string) {
  loginAttempts.delete(identifier);
}