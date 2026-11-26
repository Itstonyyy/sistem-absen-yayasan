import { db } from '@/lib/db';
import { 
  CreateWorkScheduleInput, 
  UpdateWorkScheduleInput 
} from '@/validations/schedule.validation';

/**
 * Get all work schedules with pagination
 */
export async function getAllWorkSchedules(page: number = 1, limit: number = 10) {
  const skip = (page - 1) * limit;
  
  const [schedules, total] = await Promise.all([
    db.workSchedule.findMany({
      skip,
      take: limit,
      where: {
        deletedAt: null,
      },
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        employee: {
          select: {
            id: true,
            name: true,
            nip: true,
            jabatan: true,
          },
        },
      },
    }),
    db.workSchedule.count({
      where: {
        deletedAt: null,
      },
    }),
  ]);

  return {
    data: schedules,
    total,
    page,
    totalPages: Math.ceil(total / limit),
  };
}

/**
 * Get work schedule by ID
 */
export async function getWorkScheduleById(id: string) {
  return await db.workSchedule.findUnique({
    where: { id },
    include: {
      employee: {
        select: {
          id: true,
          name: true,
          nip: true,
          jabatan: true,
        },
      },
    },
  });
}

/**
 * Get default work schedule
 */
export async function getDefaultWorkSchedule() {
  return await db.workSchedule.findFirst({
    where: {
      isDefault: true,
      deletedAt: null,
    },
    include: {
      employee: {
        select: {
          id: true,
          name: true,
          nip: true,
          jabatan: true,
        },
      },
    },
  });
}

/**
 * Create new work schedule with single employee
 */
export async function createWorkSchedule(input: CreateWorkScheduleInput) {
  // Check for duplicate namaJadwal
  const existingName = await db.workSchedule.findUnique({
    where: { namaJadwal: input.namaJadwal },
  });

  if (existingName) {
    throw new Error('Nama jadwal sudah ada. Pilih nama yang berbeda.');
  }

  // Check if employee already has a special schedule
  const existingSpecial = await db.workSchedule.findFirst({
    where: {
      employeeId: input.employeeId,
      isDefault: false,
      deletedAt: null,
    },
  });

  if (existingSpecial) {
    throw new Error('Karyawan sudah memiliki jadwal kerja khusus. Hapus jadwal lama terlebih dahulu.');
  }

  return await db.workSchedule.create({
    data: {
      namaJadwal: input.namaJadwal,
      jamMasuk: input.jamMasuk,
      jamPulang: input.jamPulang,
      toleransiTerlambat: input.toleransiTerlambat,
      hariKerja: input.hariKerja,
      isDefault: input.isDefault,
      employee: {
        connect: { id: input.employeeId },
      },
    },
    include: {
      employee: {
        select: {
          id: true,
          name: true,
          nip: true,
          jabatan: true,
        },
      },
    },
  });
}

/**
 * Update work schedule
 */
export async function updateWorkSchedule(id: string, input: UpdateWorkScheduleInput) {
  const existing = await db.workSchedule.findUnique({ 
    where: { id },
    include: {
      employee: true
    }
  });
  
  if (!existing) {
    throw new Error('Jadwal kerja tidak ditemukan');
  }

  // Build update data
  const updateData: any = {};
  if (input.namaJadwal) {
    if (input.namaJadwal !== existing.namaJadwal) {
      const duplicate = await db.workSchedule.findUnique({
        where: { namaJadwal: input.namaJadwal },
      });
      if (duplicate) {
        throw new Error('Nama jadwal sudah ada. Pilih nama yang berbeda.');
      }
    }
    updateData.namaJadwal = input.namaJadwal;
  }
  if (input.jamMasuk) updateData.jamMasuk = input.jamMasuk;
  if (input.jamPulang) updateData.jamPulang = input.jamPulang;
  if (input.toleransiTerlambat !== undefined) updateData.toleransiTerlambat = input.toleransiTerlambat;
  if (input.hariKerja) updateData.hariKerja = input.hariKerja;
  if (input.isDefault !== undefined) updateData.isDefault = input.isDefault;

  // Handle employeeId update
  if (input.employeeId) {
    // Check if employee already has a special schedule (excluding current one)
    const existingSpecial = await db.workSchedule.findFirst({
      where: {
        id: { not: id },
        employeeId: input.employeeId,
        isDefault: false,
        deletedAt: null,
      },
    });

    if (existingSpecial) {
      throw new Error('Karyawan sudah memiliki jadwal kerja khusus. Hapus jadwal lama terlebih dahulu.');
    }

    updateData.employeeId = input.employeeId;
  }

  // If no other fields to update, just return
  if (Object.keys(updateData).length === 0) {
    return existing;
  }

  return await db.workSchedule.update({
    where: { id },
    data: updateData,
    include: {
      employee: {
        select: {
          id: true,
          name: true,
          nip: true,
          jabatan: true,
        },
      },
    },
  });
}

/**
 * Delete (hard delete) work schedule
 */
export async function deleteWorkSchedule(id: string) {
  const existing = await db.workSchedule.findUnique({ where: { id } });
  
  if (!existing) {
    throw new Error('Jadwal kerja tidak ditemukan');
  }

  if (existing.isDefault) {
    // If deleting default, just return error - cannot delete default
    throw new Error('Tidak dapat menghapus jadwal default. Nonaktifkan terlebih dahulu.');
  }

  // Hard delete - permanent removal
  return await db.workSchedule.delete({
    where: { id },
  });
}

/**
 * Set default work schedule
 * If isDefault is true, sets the specified schedule as default and removes default from others
 */
export async function setDefaultSchedule(id: string, isDefault: boolean = true) {
  const schedule = await db.workSchedule.findUnique({ where: { id } });
  
  if (!schedule) {
    throw new Error('Jadwal kerja tidak ditemukan');
  }

  if (isDefault) {
    // Remove default from all other schedules
    await db.workSchedule.updateMany({
      where: {
        isDefault: true,
        id: { not: id },
      },
      data: { isDefault: false },
    });

    return await db.workSchedule.update({
      where: { id },
      data: { isDefault: true },
    });
  } else {
    return await db.workSchedule.update({
      where: { id },
      data: { isDefault: false },
    });
  }
}

/**
 * Get work schedule for specific employee
 */
export async function getWorkScheduleByEmployeeId(employeeId: string) {
  // First try to get special schedule for this employee
  const specialSchedule = await db.workSchedule.findFirst({
    where: {
      employeeId,
      deletedAt: null,
    },
    orderBy: { isDefault: 'desc' },
    include: {
      employee: {
        select: {
          id: true,
          name: true,
          nip: true,
          jabatan: true,
        },
      },
    },
  });

  if (specialSchedule) {
    return specialSchedule;
  }

  // Fall back to default schedule
  const defaultSchedule = await getDefaultWorkSchedule();
  return defaultSchedule;
}

/**
 * Check if a date is a holiday
 */
export async function isHoliday(date: Date): Promise<boolean> {
  const dateStr = date.toISOString().split('T')[0];
  
  const holiday = await db.holiday.findFirst({
    where: {
      tanggalMulai: {
        lte: date,
      },
      tanggalSelesai: {
        gte: date,
      },
      deletedAt: null,
    },
  });

  return !!holiday;
}

/**
 * Check if day is weekend (Sabtu/Minggu)
 */
export function isWeekend(date: Date): boolean {
  const day = date.getDay(); // 0 = Minggu, 6 = Sabtu
  return day === 0 || day === 6;
}

/**
 * Get all holidays within a date range
 */
export async function getHolidaysInRange(startDate: Date, endDate: Date) {
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
    orderBy: { tanggalMulai: 'asc' },
  });
}

/**
 * Get holiday statistics
 */
export async function getHolidaysStats() {
  const now = new Date();
  const start = new Date(now.getFullYear(), 0, 1);
  const end = new Date(now.getFullYear(), 11, 31);

  const holidays = await db.holiday.findMany({
    where: {
      deletedAt: null,
      OR: [
        {
          tanggalMulai: { gte: start, lte: end },
        },
        {
          tanggalSelesai: { gte: start, lte: end },
        },
      ],
    },
  });

  return {
    total: holidays.length,
    nasional: holidays.filter(h => h.jenis === 'nasional').length,
    khusus: holidays.filter(h => h.jenis === 'khusus').length,
    rutin: holidays.filter(h => h.jenis === 'rutin').length,
  };
}