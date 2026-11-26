import { z } from 'zod';

// Jabatan yang valid untuk jadwal khusus
const JABATAN_OPTIONS = ['takmir', 'imam', 'ga', 'finance', 'program', 'admin', 'staf'] as const;

// Schema untuk membuat work schedule baru
export const createWorkScheduleSchema = z.object({
  employeeId: z.string().cuid('ID karyawan tidak valid'),
  namaJadwal: z.string()
    .min(1, 'Nama jadwal tidak boleh kosong')
    .max(100, 'Nama jadwal terlalu panjang'),
  jamMasuk: z.string()
    .regex(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Format jam masuk harus HH:MM (00:00-23:59)'),
  jamPulang: z.string()
    .regex(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Format jam pulang harus HH:MM (00:00-23:59)'),
  toleransiTerlambat: z.number()
    .int()
    .min(0, 'Toleransi tidak boleh negatif')
    .max(120, 'Toleransi maksimal 120 menit')
    .default(15),
  hariKerja: z.string()
    .min(1, 'Hari kerja tidak boleh kosong')
    .max(100, 'Hari kerja terlalu panjang'),
  isDefault: z.boolean().default(false),
});

// Schema untuk update work schedule
export const updateWorkScheduleSchema = z.object({
  employeeId: z.string().cuid('ID karyawan tidak valid').optional(),
  namaJadwal: z.string()
    .min(1, 'Nama jadwal tidak boleh kosong')
    .max(100, 'Nama jadwal terlalu panjang')
    .optional(),
  jamMasuk: z.string()
    .regex(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Format jam masuk harus HH:MM (00:00-23:59)')
    .optional(),
  jamPulang: z.string()
    .regex(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Format jam pulang harus HH:MM (00:00-23:59)')
    .optional(),
  toleransiTerlambat: z.number()
    .int()
    .min(0, 'Toleransi tidak boleh negatif')
    .max(120, 'Toleransi maksimal 120 menit')
    .optional(),
  hariKerja: z.string()
    .min(1, 'Hari kerja tidak boleh kosong')
    .max(100, 'Hari kerja terlalu panjang')
    .optional(),
  isDefault: z.boolean().optional(),
  deletedAt: z.coerce.date().optional(),
}).refine(
  (data) => Object.values(data).some((val) => val !== undefined),
  { message: 'Setidaknya satu field harus diubah' }
);

// Schema untuk set default schedule
export const setDefaultScheduleSchema = z.object({
  isDefault: z.boolean().default(true),
});

// Export types
export type CreateWorkScheduleInput = z.infer<typeof createWorkScheduleSchema>;
export type UpdateWorkScheduleInput = z.infer<typeof updateWorkScheduleSchema>;