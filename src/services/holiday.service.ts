import { db } from '@/lib/db';
import { 
  CreateHolidayInput, 
  UpdateHolidayInput,
  HolidayJenis
} from '@/validations/holiday.validation';

/**
 * Get all holidays with pagination and filtering
 */
export async function getAllHolidays(
  page: number = 1, 
  limit: number = 10,
  jenis?: HolidayJenis,
  year?: string
) {
  const skip = (page - 1) * limit;
  
  const where: any = {
    deletedAt: null,
  };

  if (jenis) {
    where.jenis = jenis;
  }

  const whereClause = jenis || year ? where : { deletedAt: null };

  const [holidays, total] = await Promise.all([
    db.holiday.findMany({
      skip: jenis || year ? undefined : skip,
      take: jenis || year ? 50 : limit,
      where,
      orderBy: {
        tanggalMulai: 'asc',
      },
    }),
    db.holiday.count({
      where,
    }),
  ]);

  return {
    data: holidays,
    total,
    page,
    totalPages: Math.ceil(total / (jenis || year ? 50 : limit)),
  };
}

/**
 * Get holiday statistics
 */
export async function getHolidayStats() {
  const [total, nasional, khusus, rutin] = await Promise.all([
    db.holiday.count({ where: { deletedAt: null } }),
    db.holiday.count({ where: { jenis: 'nasional', deletedAt: null } }),
    db.holiday.count({ where: { jenis: 'khusus', deletedAt: null } }),
    db.holiday.count({ where: { jenis: 'rutin', deletedAt: null } }),
  ]);

  return {
    total,
    nasional,
    khusus,
    rutin,
  };
}

/**
 * Get holiday by ID
 */
export async function getHolidayById(id: string) {
  return await db.holiday.findUnique({
    where: { id },
  });
}

/**
 * Check for duplicate date overlap
 *
 * Hari libur "rutin" (mis. Sabtu & Minggu) adalah pola berulang mingguan,
 * bukan rentang tanggal yang benar-benar terpakai. Karena itu hari libur rutin
 * TIDAK ikut dihitung sebagai bentrok agar tidak memblokir pembuatan hari libur
 * nasional/khusus pada tanggal apa pun.
 */
export async function checkHolidayOverlap(
  tanggalMulai: Date,
  tanggalSelesai: Date,
  excludeId?: string
) {
  const overlapping = await db.holiday.findMany({
    where: {
      deletedAt: null,
      jenis: { not: 'rutin' },
      id: excludeId ? { not: excludeId } : undefined,
      OR: [
        {
          tanggalMulai: { gte: tanggalMulai, lte: tanggalSelesai },
        },
        {
          tanggalSelesai: { gte: tanggalMulai, lte: tanggalSelesai },
        },
        {
          tanggalMulai: { lte: tanggalMulai },
          tanggalSelesai: { gte: tanggalSelesai },
        },
      ],
    },
  });

  return overlapping;
}

/**
 * Create new holiday
 */
export async function createHoliday(input: CreateHolidayInput) {
  // Hari libur rutin adalah pola berulang (Sabtu & Minggu), tidak perlu dicek bentrok tanggal.
  if (input.jenis !== 'rutin') {
    // Check for overlapping holidays
    const overlapping = await checkHolidayOverlap(input.tanggalMulai, input.tanggalSelesai);
    if (overlapping.length > 0) {
      throw new Error(`Tanggal bertabrakan dengan hari libur: ${overlapping.map(h => h.nama).join(', ')}`);
    }
  }

  // Check for duplicate nama
  const existingName = await db.holiday.findFirst({
    where: {
      nama: input.nama,
      deletedAt: null,
    },
  });

  if (existingName) {
    throw new Error('Nama hari libur sudah ada');
  }

  return await db.holiday.create({
    data: input,
  });
}

/**
 * Update holiday
 */
export async function updateHoliday(id: string, input: UpdateHolidayInput) {
  const existing = await db.holiday.findUnique({ where: { id } });
  
  if (!existing) {
    throw new Error('Hari libur tidak ditemukan');
  }

  // Check for overlapping holidays if dates are provided
  // Hari libur rutin tidak dicek bentrok tanggalnya karena merupakan pola berulang
  if ((input.tanggalMulai && input.tanggalSelesai) && input.jenis !== 'rutin') {
    const overlapping = await checkHolidayOverlap(
      input.tanggalMulai, 
      input.tanggalSelesai,
      id
    );
    if (overlapping.length > 0) {
      throw new Error(`Tanggal bertabrakan dengan hari libur: ${overlapping.map(h => h.nama).join(', ')}`);
    }
  }

  return await db.holiday.update({
    where: { id },
    data: input,
  });
}

/**
 * Delete holiday permanently (hard delete)
 */
export async function deleteHoliday(id: string) {
  const existing = await db.holiday.findUnique({ where: { id } });

  if (!existing) {
    throw new Error('Hari libur tidak ditemukan');
  }

  return await db.holiday.delete({
    where: { id },
  });
}

/**
 * Get holidays by type
 */
export async function getHolidaysByType(jenis: HolidayJenis) {
  return await db.holiday.findMany({
    where: {
      jenis,
      deletedAt: null,
    },
    orderBy: {
      tanggalMulai: 'asc',
    },
  });
}

/**
 * Get holidays within year
 */
export async function getHolidaysByYear(year: string) {
  const startDate = new Date(`${year}-01-01`);
  const endDate = new Date(`${year}-12-31T23:59:59.999Z`);

  return await db.holiday.findMany({
    where: {
      deletedAt: null,
      OR: [
        {
          tanggalMulai: { gte: startDate, lte: endDate },
        },
        {
          tanggalSelesai: { gte: startDate, lte: endDate },
        },
        {
          tanggalMulai: { lte: startDate },
          tanggalSelesai: { gte: endDate },
        },
      ],
    },
    orderBy: {
      tanggalMulai: 'asc',
    },
  });
}