import { z } from 'zod';

// Valid jenis hari libur
const HOLIDAY_JENIS_OPTIONS = ['rutin', 'nasional', 'khusus'] as const;

// Schema untuk membuat holiday baru
export const createHolidaySchema = z.object({
  nama: z.string()
    .min(1, 'Nama hari libur tidak boleh kosong')
    .max(100, 'Nama hari libur terlalu panjang'),
  tanggalMulai: z.coerce.date({
    required_error: 'Tanggal mulai harus diisi',
    invalid_type_error: 'Tanggal mulai tidak valid',
  }),
  tanggalSelesai: z.coerce.date({
    required_error: 'Tanggal selesai harus diisi',
    invalid_type_error: 'Tanggal selesai tidak valid',
  }),
  jenis: z.enum(HOLIDAY_JENIS_OPTIONS),
  keterangan: z.string()
    .max(500, 'Keterangan terlalu panjang')
    .optional(),
}).refine(
  (data) => data.tanggalMulai <= data.tanggalSelesai,
  { message: 'Tanggal mulai tidak boleh lebih dari tanggal selesai' }
);

// Schema untuk update holiday
export const updateHolidaySchema = z.object({
  nama: z.string()
    .min(1, 'Nama hari libur tidak boleh kosong')
    .max(100, 'Nama hari libur terlalu panjang')
    .optional(),
  tanggalMulai: z.coerce.date().optional(),
  tanggalSelesai: z.coerce.date().optional(),
  jenis: z.enum(HOLIDAY_JENIS_OPTIONS).optional(),
  keterangan: z.string()
    .max(500, 'Keterangan terlalu panjang')
    .optional(),
  deletedAt: z.coerce.date().optional(),
}).refine(
  (data) => {
    if (data.tanggalMulai && data.tanggalSelesai) {
      return data.tanggalMulai <= data.tanggalSelesai;
    }
    return true;
  },
  { message: 'Tanggal mulai tidak boleh lebih dari tanggal selesai' }
);

// Validasi untuk pencarian holiday
export const holidaySearchParamsSchema = z.object({
  jenis: z.enum(HOLIDAY_JENIS_OPTIONS).optional(),
  search: z.string().min(1).optional(),
  year: z.string().regex(/^\d{4}$/, 'Tahun harus 4 digit').optional(),
});

// Valid jenis rutin hari libur
export const RUTIN_HARI_LIBUR_OPTIONS = ['Sabtu', 'Minggu'] as const;

// Export types
export type CreateHolidayInput = z.infer<typeof createHolidaySchema>;
export type UpdateHolidayInput = z.infer<typeof updateHolidaySchema>;
export type HolidayJenis = typeof HOLIDAY_JENIS_OPTIONS[number];
export type RutinHariLibur = typeof RUTIN_HARI_LIBUR_OPTIONS[number];