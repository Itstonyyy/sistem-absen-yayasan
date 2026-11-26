// API client utility
const API_BASE = '/api';

/**
 * Fetch with error handling
 */
async function fetchAPI<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const response = await fetch(`${API_BASE}${endpoint}`, {
    headers: {
      'Content-Type': 'application/json',
    },
    ...options,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Unknown error' }));
    throw new Error(error.error || 'API request failed');
  }

  return response.json();
}

/**
 * Holiday API helpers
 */
export const holidayApi = {
  /** Get all holidays with optional filtering */
  getAll: async (jenis?: 'rutin' | 'nasional' | 'khusus', year?: string) => {
    const params = new URLSearchParams();
    if (jenis) params.append('jenis', jenis);
    if (year) params.append('year', year);
    
    const url = `/admin/holidays${params.toString() ? `?${params.toString()}` : ''}`;
    return fetchAPI<{ data: any[]; total: number; page: number; totalPages: number }>(url);
  },

  /** Get holiday by ID */
  getById: async (id: string) => {
    // GET returns holiday object directly
    const response = await fetch(`${API_BASE}/admin/holidays/${id}`, {
      headers: { 'Content-Type': 'application/json' },
    });
    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: 'Unknown error' }));
      throw new Error(error.error || 'API request failed');
    }
    return response.json();
  },

  /** Create new holiday */
  create: async (holiday: {
    nama: string;
    tanggalMulai: string | Date;
    tanggalSelesai: string | Date;
    jenis: 'rutin' | 'nasional' | 'khusus';
    keterangan?: string;
  }) => {
    // Normalize dates to ISO strings
    const normalizedHoliday = {
      ...holiday,
      tanggalMulai: holiday.tanggalMulai instanceof Date ? holiday.tanggalMulai.toISOString() : holiday.tanggalMulai,
      tanggalSelesai: holiday.tanggalSelesai instanceof Date ? holiday.tanggalSelesai.toISOString() : holiday.tanggalSelesai,
    };
    return fetchAPI<any>('/admin/holidays', {
      method: 'POST',
      body: JSON.stringify(normalizedHoliday),
    });
  },

  /** Update holiday */
  update: async (id: string, data: Partial<{
    nama: string;
    tanggalMulai: Date;
    tanggalSelesai: Date;
    jenis: 'rutin' | 'nasional' | 'khusus';
    keterangan: string;
  }>) => {
    // Convert Date objects to ISO strings for API compatibility
    const normalizedData = {
      ...data,
      ...(data.tanggalMulai && { tanggalMulai: data.tanggalMulai.toISOString() }),
      ...(data.tanggalSelesai && { tanggalSelesai: data.tanggalSelesai.toISOString() }),
    };
    return fetchAPI<any>(`/admin/holidays/${id}`, {
      method: 'PUT',
      body: JSON.stringify(normalizedData),
    });
  },

  /** Delete holiday */
  delete: async (id: string) => {
    return fetchAPI<{ message: string }>(`/admin/holidays/${id}`, {
      method: 'DELETE',
    });
  },
};

/**
 * Employee API helpers (for admin employee management)
 */
export const employeeApi = {
  /** Get all employees */
  getAll: async () => {
    return fetchAPI<{ data: any[]; total: number; page: number; totalPages: number }>(
      '/admin/employees'
    );
  },

  /** Get employee by ID */
  getById: async (id: string) => {
    return fetchAPI<any>(`/admin/employees/${id}`);
  },
};

/**
 * Work Schedule API helpers
 */
export const scheduleApi = {
  /** Get all schedules */
  getAll: async () => {
    return fetchAPI<{ data: any[]; total: number; page: number; totalPages: number; default: any }>(
      '/admin/schedules'
    );
  },

  /** Get schedule by ID */
  getById: async (id: string) => {
    return fetchAPI<any>(`/admin/schedules/${id}`);
  },

  /** Create new schedule */
  create: async (schedule: {
    namaJadwal: string;
    jamMasuk: string;
    jamPulang: string;
    hariKerja: string;
    toleransiTerlambat?: number;
    employeeId?: string;
  }) => {
    return fetchAPI<any>('/admin/schedules', {
      method: 'POST',
      body: JSON.stringify(schedule),
    });
  },

  /** Update schedule */
  update: async (id: string, data: Partial<{
    namaJadwal: string;
    jamMasuk: string;
    jamPulang: string;
    hariKerja: string;
    toleransiTerlambat: number;
    isDefault: boolean;
    employeeId?: string;
  }>) => {
    return fetchAPI<any>(`/admin/schedules/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  /** Delete schedule */
  delete: async (id: string) => {
    return fetchAPI<{ message: string }>(`/admin/schedules/${id}`, {
      method: 'DELETE',
    });
  },

  /** Set default schedule */
  setDefault: async (id: string, isDefault: boolean = true) => {
    return fetchAPI<any>(`/admin/schedules/${id}`, {
      method: 'PUT',
      body: JSON.stringify({ isDefault }),
    });
  },
};