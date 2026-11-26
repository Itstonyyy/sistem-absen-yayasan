import { describe, it, expect, vi, afterEach, beforeEach } from 'vitest';
import { login, getUserById, changePassword, clearLoginAttempts } from './auth.service';
import { db } from '@/lib/db';
import * as auth from '@/lib/auth';

// Mock dependencies
vi.mock('@/lib/db');
vi.mock('@/lib/auth');

describe('Auth Service', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    clearLoginAttempts('test@example.com');
    clearLoginAttempts('12345');
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('login', () => {
    it('should authenticate user with valid credentials', async () => {
      const mockEmployee = {
        id: 'emp-1',
        email: 'admin@example.com',
        name: 'Admin User',
        role: 'admin',
        passwordHash: 'hashedPassword',
        isActive: true,
        nip: 'ADMIN-001',
        jabatan: 'Administrator',
      };

      vi.spyOn(db.employee, 'findFirst').mockResolvedValue(mockEmployee as any);
      vi.spyOn(auth, 'verifyPassword').mockResolvedValue(true);
      vi.spyOn(auth, 'generateToken').mockReturnValue('mock-token');

      const result = await login({
        identifier: 'admin@example.com',
        password: 'password123',
        rememberMe: false,
      });

      expect(result.user.id).toBe('emp-1');
      expect(result.user.role).toBe('admin');
      expect(result.token).toBe('mock-token');
    });

    it('should reject login with invalid password', async () => {
      const mockEmployee = {
        id: 'emp-1',
        email: 'user@example.com',
        name: 'User',
        role: 'karyawan',
        passwordHash: 'hashedPassword',
        isActive: true,
        nip: 'YAM-001',
        jabatan: 'Staf Program',
      };

      vi.spyOn(db.employee, 'findFirst').mockResolvedValue(mockEmployee as any);
      vi.spyOn(auth, 'verifyPassword').mockResolvedValue(false);

      await expect(login({
        identifier: 'user@example.com',
        password: 'wrongpassword',
        rememberMe: false,
      })).rejects.toThrow('Email/NIP atau password tidak valid');
    });

    it('should reject login for inactive user', async () => {
      const mockEmployee = {
        id: 'emp-1',
        email: 'inactive@example.com',
        name: 'Inactive User',
        role: 'karyawan',
        passwordHash: 'hashedPassword',
        isActive: false,
        nip: 'YAM-002',
        jabatan: 'Staf Program',
      };

      vi.spyOn(db.employee, 'findFirst').mockResolvedValue(mockEmployee as any);

      await expect(login({
        identifier: 'inactive@example.com',
        password: 'password123',
        rememberMe: false,
      })).rejects.toThrow('Akun tidak aktif. Mohon hubungi admin.');
    });

    it('should reject login when user not found', async () => {
      vi.spyOn(db.employee, 'findFirst').mockResolvedValue(null);

      await expect(login({
        identifier: 'nonexistent@example.com',
        password: 'password123',
        rememberMe: false,
      })).rejects.toThrow('Email/NIP atau password tidak valid');
    });

    it('should lock account after 5 failed attempts', async () => {
      // First, make 5 failed attempts
      for (let i = 0; i < 5; i++) {
        try {
          await login({
            identifier: 'test@example.com',
            password: 'wrongpassword',
            rememberMe: false,
          });
        } catch (e) {
          // Expected to fail
        }
      }

      // Now try with correct password (but account should be locked)
      const mockEmployee = {
        id: 'emp-1',
        email: 'test@example.com',
        name: 'Test User',
        role: 'karyawan',
        passwordHash: 'hashedPassword',
        isActive: true,
        nip: 'YAM-003',
        jabatan: 'Staf Program',
      };

      vi.spyOn(db.employee, 'findFirst').mockResolvedValue(mockEmployee as any);
      vi.spyOn(auth, 'verifyPassword').mockResolvedValue(true);

      await expect(login({
        identifier: 'test@example.com',
        password: 'correctpassword',
        rememberMe: false,
      })).rejects.toThrow('Terlalu banyak percobaan login. Silakan coba lagi setelah 15 menit.');
    });

    it('should allow NIP login for employees', async () => {
      const mockEmployee = {
        id: 'emp-1',
        email: 'user@example.com',
        name: 'User',
        role: 'karyawan',
        passwordHash: 'hashedPassword',
        isActive: true,
        nip: 'YAM-001',
        jabatan: 'Staf Program',
      };

      vi.spyOn(db.employee, 'findFirst').mockResolvedValue(mockEmployee as any);
      vi.spyOn(auth, 'verifyPassword').mockResolvedValue(true);
      vi.spyOn(auth, 'generateToken').mockReturnValue('mock-token');

      const result = await login({
        identifier: 'YAM-001',
        password: 'password123',
        rememberMe: false,
      });

      expect(result.user.id).toBe('emp-1');
    });
  });

  describe('getUserById', () => {
    it('should return user if found', async () => {
      const mockEmployee = {
        id: 'emp-1',
        email: 'user@example.com',
        name: 'User',
        role: 'karyawan',
        isActive: true,
      };

      vi.spyOn(db.employee, 'findUnique').mockResolvedValue(mockEmployee as any);

      const result = await getUserById('emp-1');

      expect(result).toEqual(mockEmployee);
    });

    it('should return null if user not found', async () => {
      vi.spyOn(db.employee, 'findUnique').mockResolvedValue(null);

      const result = await getUserById('nonexistent');

      expect(result).toBeNull();
    });
  });

  describe('changePassword', () => {
    it('should change password successfully', async () => {
      const mockEmployee = {
        id: 'emp-1',
        passwordHash: 'oldHash',
      };

      vi.spyOn(db.employee, 'findUnique').mockResolvedValue(mockEmployee as any);
      vi.spyOn(auth, 'verifyPassword').mockResolvedValue(true);
      vi.spyOn(auth, 'hashPassword').mockResolvedValue('newHash');
      vi.spyOn(db.employee, 'update').mockResolvedValue({} as any);

      await changePassword('emp-1', 'oldpassword', 'newpassword');

      expect(db.employee.update).toHaveBeenCalledWith({
        where: { id: 'emp-1' },
        data: { passwordHash: 'newHash' },
      });
    });

    it('should reject if current password is wrong', async () => {
      const mockEmployee = {
        id: 'emp-1',
        passwordHash: 'oldHash',
      };

      vi.spyOn(db.employee, 'findUnique').mockResolvedValue(mockEmployee as any);
      vi.spyOn(auth, 'verifyPassword').mockResolvedValue(false);

      await expect(changePassword('emp-1', 'wrongpassword', 'newpassword')).rejects.toThrow('Password lama tidak valid');
    });
  });
});