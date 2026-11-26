-- CreateTable
CREATE TABLE "employees" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "nip" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "role" TEXT NOT NULL DEFAULT 'karyawan',
    "jabatan" TEXT NOT NULL,
    "telepon" TEXT,
    "jenisKelamin" TEXT,
    "tempatLahir" TEXT,
    "tanggalLahir" DATETIME,
    "agama" TEXT DEFAULT 'Islam',
    "alamat" TEXT,
    "avatarColor" TEXT,
    "sisaCuti" INTEGER NOT NULL DEFAULT 12,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "deletedAt" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "gps_locations" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "nama" TEXT NOT NULL,
    "latitude" REAL NOT NULL,
    "longitude" REAL NOT NULL,
    "radius" INTEGER NOT NULL DEFAULT 100,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "deletedAt" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "work_schedules" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "employeeId" TEXT,
    "namaJadwal" TEXT NOT NULL,
    "jamMasuk" TEXT NOT NULL,
    "jamPulang" TEXT NOT NULL,
    "toleransiTerlambat" INTEGER NOT NULL DEFAULT 15,
    "hariKerja" TEXT NOT NULL DEFAULT 'Senin - Jumat',
    "isDefault" BOOLEAN NOT NULL DEFAULT false,
    "deletedAt" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "work_schedules_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES "employees" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "attendances" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "employeeId" TEXT NOT NULL,
    "gpsLocationId" TEXT,
    "tanggal" DATETIME NOT NULL,
    "jamMasuk" DATETIME,
    "jamPulang" DATETIME,
    "jamMasukLembur" DATETIME,
    "jamPulangLembur" DATETIME,
    "latMasuk" REAL,
    "longMasuk" REAL,
    "latPulang" REAL,
    "longPulang" REAL,
    "fotoMasukUrl" TEXT,
    "fotoPulangUrl" TEXT,
    "status" TEXT NOT NULL,
    "keterangan" TEXT,
    "dikoreksi" BOOLEAN NOT NULL DEFAULT false,
    "deletedAt" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "attendances_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES "employees" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "attendances_gpsLocationId_fkey" FOREIGN KEY ("gpsLocationId") REFERENCES "gps_locations" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "attendance_corrections" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "attendanceId" TEXT NOT NULL,
    "adminId" TEXT NOT NULL,
    "jamMasukLama" DATETIME,
    "jamMasukBaru" DATETIME,
    "jamPulangLama" DATETIME,
    "jamPulangBaru" DATETIME,
    "statusLama" TEXT,
    "statusBaru" TEXT,
    "alasanKoreksi" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "attendance_corrections_attendanceId_fkey" FOREIGN KEY ("attendanceId") REFERENCES "attendances" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "attendance_corrections_adminId_fkey" FOREIGN KEY ("adminId") REFERENCES "employees" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "leave_requests" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "employeeId" TEXT NOT NULL,
    "approvedById" TEXT,
    "jenis" TEXT NOT NULL,
    "tanggalMulai" DATETIME NOT NULL,
    "tanggalSelesai" DATETIME NOT NULL,
    "durasiHari" INTEGER NOT NULL,
    "alasan" TEXT NOT NULL,
    "lampiranUrl" TEXT,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "catatanAdmin" TEXT,
    "approvedAt" DATETIME,
    "deletedAt" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "leave_requests_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES "employees" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "leave_requests_approvedById_fkey" FOREIGN KEY ("approvedById") REFERENCES "employees" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "holidays" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "nama" TEXT NOT NULL,
    "tanggalMulai" DATETIME NOT NULL,
    "tanggalSelesai" DATETIME NOT NULL,
    "jenis" TEXT NOT NULL,
    "keterangan" TEXT,
    "deletedAt" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "quizzes" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "pertanyaan" TEXT NOT NULL,
    "opsiA" TEXT NOT NULL,
    "opsiB" TEXT NOT NULL,
    "opsiC" TEXT NOT NULL,
    "opsiD" TEXT NOT NULL,
    "kunci" TEXT NOT NULL,
    "pembahasan" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'aktif',
    "deletedAt" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "quiz_submissions" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "quizId" TEXT NOT NULL,
    "employeeId" TEXT NOT NULL,
    "attendanceId" TEXT,
    "jawaban" TEXT NOT NULL,
    "isBenar" BOOLEAN NOT NULL,
    "tanggal" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "quiz_submissions_quizId_fkey" FOREIGN KEY ("quizId") REFERENCES "quizzes" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "quiz_submissions_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES "employees" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "quiz_submissions_attendanceId_fkey" FOREIGN KEY ("attendanceId") REFERENCES "attendances" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "employees_nip_key" ON "employees"("nip");

-- CreateIndex
CREATE UNIQUE INDEX "employees_email_key" ON "employees"("email");

-- CreateIndex
CREATE UNIQUE INDEX "gps_locations_nama_key" ON "gps_locations"("nama");

-- CreateIndex
CREATE UNIQUE INDEX "work_schedules_namaJadwal_key" ON "work_schedules"("namaJadwal");

-- CreateIndex
CREATE INDEX "attendances_tanggal_status_idx" ON "attendances"("tanggal", "status");

-- CreateIndex
CREATE INDEX "attendances_employeeId_tanggal_idx" ON "attendances"("employeeId", "tanggal");

-- CreateIndex
CREATE UNIQUE INDEX "attendances_employeeId_tanggal_key" ON "attendances"("employeeId", "tanggal");

-- CreateIndex
CREATE INDEX "leave_requests_employeeId_status_idx" ON "leave_requests"("employeeId", "status");

-- CreateIndex
CREATE INDEX "leave_requests_status_idx" ON "leave_requests"("status");

-- CreateIndex
CREATE UNIQUE INDEX "holidays_nama_key" ON "holidays"("nama");

-- CreateIndex
CREATE UNIQUE INDEX "quizzes_pertanyaan_key" ON "quizzes"("pertanyaan");

-- CreateIndex
CREATE INDEX "quiz_submissions_employeeId_tanggal_idx" ON "quiz_submissions"("employeeId", "tanggal");
