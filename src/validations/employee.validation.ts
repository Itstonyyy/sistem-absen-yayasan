import { z } from 'zod';

// Jabatan yang valid sesuai data master
const JABATAN_OPTIONS = ['takmir', 'imam', 'ga', 'finance', 'program'] as const;

// Jenis kelamin yang valid
const JENIS_KELAMIN_OPTIONS = ['Laki-laki', 'Perempuan'] as const;

// Agama yang valid
const AGAMA_OPTIONS = ['Islam', 'Kristen', 'Katolik', 'Hindu', 'Buddha', 'Konghucu'] as const;

// Schema untuk membuat employee baru
export const createEmployeeSchema = z.object({
  nip: z.string()
    .min(1, 'NIP tidak boleh kosong')
    .max(50, 'NIP terlalu panjang'),
  name: z.string()
    .min(1, 'Nama tidak boleh kosong')
    .max(100, 'Nama terlalu panjang'),
  email: z.string()
    .email('Email tidak valid')
    .min(1, 'Email tidak boleh kosong')
    .max(100, 'Email terlalu panjang'),
  password: z.string()
    .min(8, 'Password minimal 8 karakter')
    .max(100, 'Password terlalu panjang'),
  jabatan: z.enum(JABATAN_OPTIONS),
  telepon: z.string()
    .min(1, 'No. telepon tidak boleh kosong')
    .max(20, 'No. telepon terlalu panjang')
    .optional(),
  jenisKelamin: z.enum(JENIS_KELAMIN_OPTIONS).optional(),
  tempatLahir: z.string().optional(),
  tanggalLahir: z.string().optional().transform((val) => val ? new Date(val) : undefined),
  agama: z.enum(AGAMA_OPTIONS).optional().default('Islam'),
  alamat: z.string().optional(),
});

// Schema untuk update employee (semua field optional kecuali validasi unik)
export const updateEmployeeSchema = z.object({
  name: z.string()
    .min(1, 'Nama tidak boleh kosong')
    .max(100, 'Nama terlalu panjang')
    .optional(),
  email: z.string()
    .email('Email tidak valid')
    .min(1, 'Email tidak boleh kosong')
    .max(100, 'Email terlalu panjang')
    .optional(),
  jabatan: z.enum(JABATAN_OPTIONS).optional(),
  telepon: z.string()
    .min(1, 'No. telepon tidak boleh kosong')
    .max(20, 'No. telepon terlalu panjang')
    .optional()
    .nullable(),
  jenisKelamin: z.enum(JENIS_KELAMIN_OPTIONS).optional().nullable(),
  tempatLahir: z.string().optional().nullable(),
  tanggalLahir: z.string().optional().nullable().transform((val) => val ? new Date(val) : undefined),
  agama: z.enum(AGAMA_OPTIONS).optional().nullable(),
  alamat: z.string().optional().nullable(),
  isActive: z.boolean().optional(),
});

// Schema untuk reset password oleh admin
export const resetPasswordSchema = z.object({
  newPassword: z.string()
    .min(8, 'Password baru minimal 8 karakter')
    .max(100, 'Password baru terlalu panjang'),
});

// Schema untuk pencarian/filter
export const employeeSearchParamsSchema = z.object({
  search: z.string().min(1).optional(),
  jabatan: z.enum(JABATAN_OPTIONS).optional(),
  isActive: z.boolean().optional(),
  page: z.number().min(1).default(1),
  pageSize: z.number().min(1).max(100).default(10),
});

// Types
export type CreateEmployeeInput = z.infer<typeof createEmployeeSchema>;
export type UpdateEmployeeInput = z.infer<typeof updateEmployeeSchema>;
export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>;
export type EmployeeSearchParams = z.infer<typeof employeeSearchParamsSchema>;

// Helper type untuk response
export interface Employee {
  id: string;
  nip: string;
  name: string;
  email: string;
  role: string;
  jabatan: string;
  telepon?: string | null;
  jenisKelamin?: string | null;
  tempatLahir?: string | null;
  tanggalLahir?: Date | null;
  agama?: string;
  alamat?: string | null;
  avatarColor?: string | null;
  sisaCuti: number;
  isActive: boolean;
  deletedAt?: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface EmployeeListResponse {
  data: Employee[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}