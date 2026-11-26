"use client";

import type { StatusType } from "./ui";

export interface Karyawan {
  id: number;
  nip: string;
  nama: string;
  jabatan: string;
  email: string;
  telepon: string;
  jenisKelamin: "Laki-laki" | "Perempuan";
  tempatLahir: string;
  tanggalLahir: string;
  agama: string;
  alamat: string;
  avatarColor: string;
}

export const KARYAWAN_LIST: Karyawan[] = [
  { id: 1, nip: "YAM-0001", nama: "Arif Fatoni", jabatan: "Staf Program", email: "arif.fatoni@almaghfirah.or.id", telepon: "0812 3456 7890", jenisKelamin: "Laki-laki", tempatLahir: "Jakarta", tanggalLahir: "01 Januari 2000", agama: "Islam", alamat: "Jl. Melati No. 10, Kec. Senen, Kota Jakarta Pusat, DKI Jakarta 10410", avatarColor: "from-emerald-500 to-green-600" },
  { id: 2, nip: "YAM-0002", nama: "Naila Nasywa", jabatan: "Admin", email: "naila.nasywa@almaghfirah.or.id", telepon: "0813 1122 3344", jenisKelamin: "Perempuan", tempatLahir: "Bandung", tanggalLahir: "15 Maret 1999", agama: "Islam", alamat: "Jl. Mawar No. 5, Bandung Wetan, Kota Bandung 40117", avatarColor: "from-pink-500 to-rose-600" },
  { id: 3, nip: "YAM-0003", nama: "Reza Evriansyah", jabatan: "Operator", email: "reza.evriansyah@almaghfirah.or.id", telepon: "0857 9988 7766", jenisKelamin: "Laki-laki", tempatLahir: "Surabaya", tanggalLahir: "22 Juli 1998", agama: "Islam", alamat: "Jl. Kenanga No. 17, Genteng, Kota Surabaya 60281", avatarColor: "from-blue-500 to-indigo-600" },
  { id: 4, nip: "YAM-0004", nama: "Ramadhan", jabatan: "Staf Program", email: "ramadhan@almaghfirah.or.id", telepon: "0812 4455 6677", jenisKelamin: "Laki-laki", tempatLahir: "Bekasi", tanggalLahir: "10 Desember 1997", agama: "Islam", alamat: "Jl. Anggrek No. 22, Bekasi Barat, Kota Bekasi 17131", avatarColor: "from-amber-500 to-orange-600" },
  { id: 5, nip: "YAM-0005", nama: "Intan Maulida", jabatan: "Admin", email: "intan.maulida@almaghfirah.or.id", telepon: "0896 3344 5566", jenisKelamin: "Perempuan", tempatLahir: "Depok", tanggalLahir: "03 Mei 2001", agama: "Islam", alamat: "Jl. Cempaka No. 8, Sukmajaya, Kota Depok 16417", avatarColor: "from-violet-500 to-purple-600" },
  { id: 6, nip: "YAM-0006", nama: "Dedi Saputra", jabatan: "Operator", email: "dedi.saputra@almaghfirah.or.id", telepon: "0852 1122 3344", jenisKelamin: "Laki-laki", tempatLahir: "Tangerang", tanggalLahir: "18 September 1996", agama: "Islam", alamat: "Jl. Flamboyan No. 12, Tangerang Selatan 15224", avatarColor: "from-teal-500 to-cyan-600" },
  { id: 7, nip: "YAM-0007", nama: "Siti Aisyah", jabatan: "Staf Program", email: "siti.aisyah@almaghfirah.or.id", telepon: "0838 6655 4433", jenisKelamin: "Perempuan", tempatLahir: "Bogor", tanggalLahir: "27 Februari 2000", agama: "Islam", alamat: "Jl. Dahlia No. 3, Bogor Tengah 16111", avatarColor: "from-fuchsia-500 to-pink-600" },
  { id: 8, nip: "YAM-0008", nama: "Ahmad Fauzi", jabatan: "Admin", email: "ahmad.fauzi@almaghfirah.or.id", telepon: "0811 2233 4455", jenisKelamin: "Laki-laki", tempatLahir: "Jakarta", tanggalLahir: "08 Agustus 1995", agama: "Islam", alamat: "Jl. Teratai No. 15, Jakarta Timur 13620", avatarColor: "from-lime-500 to-green-600" },
  { id: 9, nip: "YAM-0009", nama: "Rina Septiani", jabatan: "Operator", email: "rina.septiani@almaghfirah.or.id", telepon: "0877 8899 0011", jenisKelamin: "Perempuan", tempatLahir: "Bekasi", tanggalLahir: "14 November 1999", agama: "Islam", alamat: "Jl. Tulip No. 9, Bekasi Timur 17111", avatarColor: "from-rose-500 to-red-600" },
  { id: 10, nip: "YAM-0010", nama: "Bagas Pratama", jabatan: "Staf Program", email: "bagas.pratama@almaghfirah.or.id", telepon: "0822 5566 7788", jenisKelamin: "Laki-laki", tempatLahir: "Depok", tanggalLahir: "30 Juni 1998", agama: "Islam", alamat: "Jl. Bougenville No. 4, Depok 16411", avatarColor: "from-sky-500 to-blue-600" },
];

export interface RiwayatKehadiranRow {
  id: number;
  tanggal: string;
  hari: string;
  jamMasuk: string | null;
  jamPulang: string | null;
  jamMasukLembur: string | null;
  jamPulangLembur: string | null;
  status: StatusType;
  keterangan?: string;
  dikoreksi?: boolean;
}

export const RIWAYAT_KEHADIRAN: RiwayatKehadiranRow[] = [
  { id: 1, tanggal: "12 Nov 2026", hari: "Kamis", jamMasuk: "07:58", jamPulang: "17:02", jamMasukLembur: null, jamPulangLembur: null, status: "hadir" },
  { id: 2, tanggal: "11 Nov 2026", hari: "Rabu", jamMasuk: "08:05", jamPulang: "17:00", jamMasukLembur: null, jamPulangLembur: null, status: "terlambat", keterangan: "Terlambat 5 menit" },
  { id: 3, tanggal: "10 Nov 2026", hari: "Selasa", jamMasuk: "08:12", jamPulang: null, jamMasukLembur: "17:01", jamPulangLembur: "20:01", status: "lembur", keterangan: "Lembur penyelesaian laporan bulanan." },
  { id: 4, tanggal: "09 Nov 2026", hari: "Senin", jamMasuk: "07:55", jamPulang: "17:05", jamMasukLembur: null, jamPulangLembur: null, status: "hadir" },
  { id: 5, tanggal: "08 Nov 2026", hari: "Minggu", jamMasuk: null, jamPulang: null, jamMasukLembur: null, jamPulangLembur: null, status: "libur", keterangan: "Libur Akhir Pekan" },
  { id: 6, tanggal: "07 Nov 2026", hari: "Sabtu", jamMasuk: null, jamPulang: null, jamMasukLembur: null, jamPulangLembur: null, status: "libur", keterangan: "Libur Akhir Pekan" },
  { id: 7, tanggal: "06 Nov 2026", hari: "Jumat", jamMasuk: "08:00", jamPulang: "16:32", jamMasukLembur: null, jamPulangLembur: null, status: "izin", keterangan: "Izin keperluan keluarga" },
  { id: 8, tanggal: "05 Nov 2026", hari: "Kamis", jamMasuk: "08:18", jamPulang: "17:00", jamMasukLembur: null, jamPulangLembur: null, status: "terlambat", keterangan: "Terlambat 18 menit", dikoreksi: true },
];

export interface PengajuanRow {
  id: number;
  nama: string;
  jenis: "izin" | "sakit" | "cuti";
  periode: string;
  tanggalPengajuan: string;
  status: "pending" | "approved" | "rejected";
  catatan?: string;
  alasan?: string;
  durasiHari?: number;
}

export const PENGAJUAN_LIST: PengajuanRow[] = [
  { id: 1, nama: "Rina Septiani", jenis: "cuti", periode: "12-14 Nov 2026", tanggalPengajuan: "09 Nov 2026", status: "pending", alasan: "Cuti tahunan - liburan keluarga", durasiHari: 3 },
  { id: 2, nama: "Ahmad Fauzi", jenis: "sakit", periode: "10 Nov 2026", tanggalPengajuan: "10 Nov 2026", status: "pending", alasan: "Demam tinggi", durasiHari: 1 },
  { id: 3, nama: "Reza Evriansyah", jenis: "izin", periode: "11 Nov 2026", tanggalPengajuan: "10 Nov 2026", status: "pending", alasan: "Mengurus dokumen keluarga", durasiHari: 1 },
  { id: 4, nama: "Euis Aisyah", jenis: "cuti", periode: "13-15 Nov 2026", tanggalPengajuan: "08 Nov 2026", status: "pending", alasan: "Cuti melahirkan", durasiHari: 3 },
  { id: 5, nama: "Bagas Pratama", jenis: "izin", periode: "12 Nov 2026", tanggalPengajuan: "08 Nov 2026", status: "pending", alasan: "Keperluan mendesak", durasiHari: 1 },
  { id: 6, nama: "Siti Aisyah", jenis: "sakit", periode: "05 Nov 2026", tanggalPengajuan: "05 Nov 2026", status: "approved", alasan: "Flu dan batuk", durasiHari: 1, catatan: "Disetujui, surat dokter valid." },
  { id: 7, nama: "Dedi Saputra", jenis: "izin", periode: "04 Nov 2026", tanggalPengajuan: "03 Nov 2026", status: "approved", alasan: "Keperluan pribadi", durasiHari: 1, catatan: "Disetujui." },
  { id: 8, nama: "Intan Maulida", jenis: "cuti", periode: "28-29 Okt 2026", tanggalPengajuan: "20 Okt 2026", status: "rejected", alasan: "Cuti tahunan", durasiHari: 2, catatan: "Ditolak - tumpang tindih dengan event yayasan." },
];

export interface MonitoringRow {
  id: number;
  nama: string;
  nip: string;
  jabatan: string;
  jamMasuk: string | null;
  jamPulang: string | null;
  jamMasukLembur: string | null;
  jamPulangLembur: string | null;
  status: StatusType;
  keterangan: string;
  lokasi: string;
  dikoreksi?: boolean;
}

export const MONITORING_LIST: MonitoringRow[] = [
  { id: 1, nama: "Arif Fatoni", nip: "YAM-0001", jabatan: "Staf Program", jamMasuk: "07:58", jamPulang: null, jamMasukLembur: null, jamPulangLembur: null, status: "hadir", keterangan: "Tepat waktu", lokasi: "Kantor Pusat" },
  { id: 2, nama: "Naila Nasywa", nip: "YAM-0002", jabatan: "Admin", jamMasuk: "08:12", jamPulang: null, jamMasukLembur: null, jamPulangLembur: null, status: "terlambat", keterangan: "Terlambat 12 menit", lokasi: "Kantor Pusat" },
  { id: 3, nama: "Reza Evriansyah", nip: "YAM-0003", jabatan: "Operator", jamMasuk: "07:55", jamPulang: null, jamMasukLembur: null, jamPulangLembur: null, status: "hadir", keterangan: "Tepat waktu", lokasi: "Kantor Pusat" },
  { id: 4, nama: "Ramadhan", nip: "YAM-0004", jabatan: "Staf Program", jamMasuk: null, jamPulang: null, jamMasukLembur: null, jamPulangLembur: null, status: "izin", keterangan: "Izin keperluan keluarga", lokasi: "-" },
  { id: 5, nama: "Intan Maulida", nip: "YAM-0005", jabatan: "Admin", jamMasuk: "07:49", jamPulang: null, jamMasukLembur: null, jamPulangLembur: null, status: "hadir", keterangan: "Tepat waktu", lokasi: "Kantor Pusat" },
  { id: 6, nama: "Dedi Saputra", nip: "YAM-0006", jabatan: "Operator", jamMasuk: "08:25", jamPulang: null, jamMasukLembur: null, jamPulangLembur: null, status: "terlambat", keterangan: "Terlambat 25 menit", lokasi: "Kantor Pusat", dikoreksi: true },
  { id: 7, nama: "Siti Aisyah", nip: "YAM-0007", jabatan: "Staf Program", jamMasuk: null, jamPulang: null, jamMasukLembur: null, jamPulangLembur: null, status: "tidak-hadir", keterangan: "Tanpa keterangan", lokasi: "-" },
  { id: 8, nama: "Ahmad Fauzi", nip: "YAM-0008", jabatan: "Admin", jamMasuk: "08:01", jamPulang: null, jamMasukLembur: null, jamPulangLembur: null, status: "hadir", keterangan: "Tepat waktu", lokasi: "Kantor Cabang" },
  { id: 9, nama: "Rina Septiani", nip: "YAM-0009", jabatan: "Operator", jamMasuk: null, jamPulang: null, jamMasukLembur: null, jamPulangLembur: null, status: "sakit", keterangan: "Sakit - surat dokter", lokasi: "-" },
  { id: 10, nama: "Bagas Pratama", nip: "YAM-0010", jabatan: "Staf Program", jamMasuk: "07:45", jamPulang: null, jamMasukLembur: null, jamPulangLembur: null, status: "hadir", keterangan: "Tepat waktu", lokasi: "Kantor Pusat" },
];

export interface HariLiburRow {
  id: number;
  nama: string;
  tanggal: string;
  jenis: "rutin" | "nasional" | "khusus";
  keterangan?: string;
}

export const HARI_LIBUR_LIST: HariLiburRow[] = [
  { id: 1, nama: "Hari Raya Idul Fitri 1447 H", tanggal: "20-21 Mar 2026", jenis: "nasional", keterangan: "Libur nasional" },
  { id: 2, nama: "Hari Raya Idul Adha 1447 H", tanggal: "27 Mei 2026", jenis: "nasional", keterangan: "Libur nasional" },
  { id: 3, nama: "Tahun Baru Masehi", tanggal: "01 Jan 2026", jenis: "nasional", keterangan: "Libur nasional" },
  { id: 4, nama: "Hari Kemerdekaan RI", tanggal: "17 Agu 2026", jenis: "nasional", keterangan: "Libur nasional" },
  { id: 5, nama: "Maulid Nabi Muhammad SAW", tanggal: "04 Sep 2026", jenis: "nasional", keterangan: "Libur nasional" },
  { id: 6, nama: "Hari Besar Yayasan Al-Maghfirah", tanggal: "15 Okt 2026", jenis: "khusus", keterangan: "HUT Yayasan ke-25" },
  { id: 7, nama: "Libur Akhir Pekan", tanggal: "Setiap Sabtu & Minggu", jenis: "rutin", keterangan: "Libur rutin mingguan" },
];

export interface KuisRow {
  id: number;
  pertanyaan: string;
  opsiA: string;
  opsiB: string;
  opsiC: string;
  opsiD: string;
  kunci: "A" | "B" | "C" | "D";
  status: "aktif" | "nonaktif";
  pembahasan: string;
}

export const KUIS_LIST: KuisRow[] = [
  { id: 1, pertanyaan: "Pada tahun berapa Hijriah dimulai?", opsiA: "622 M", opsiB: "632 M", opsiC: "642 M", opsiD: "652 M", kunci: "A", status: "aktif", pembahasan: "Kalender Hijriah dimulai pada tahun 622 M, bertepatan dengan peristiwa Hijrah Nabi Muhammad SAW dari Mekkah ke Madinah." },
  { id: 2, pertanyaan: "Siapakah khalifah pertama dalam sejarah Islam?", opsiA: "Umar bin Khattab", opsiB: "Utsman bin Affan", opsiC: "Abu Bakar Ash-Shiddiq", opsiD: "Ali bin Abi Thalib", kunci: "C", status: "aktif", pembahasan: "Abu Bakar Ash-Shiddiq adalah khalifah pertama yang dipilih oleh umat Islam setelah wafatnya Nabi Muhammad SAW." },
  { id: 3, pertanyaan: "Pertempuran pertama dalam sejarah Islam adalah?", opsiA: "Perang Badar", opsiB: "Perang Uhud", opsiC: "Perang Khandaq", opsiD: "Perang Hunain", kunci: "A", status: "aktif", pembahasan: "Perang Badar terjadi pada tahun 2 Hijriah (624 M) dan merupakan pertempuran besar pertama umat Islam." },
  { id: 4, pertanyaan: "Al-Quran pertama kali diturunkan di gua?", opsiA: "Tsur", opsiB: "Hira", opsiC: "Uhud", opsiD: "Badr", kunci: "B", status: "aktif", pembahasan: "Wahyu Al-Quran pertama kali diturunkan kepada Nabi Muhammad SAW di Gua Hira, Jabal Nur, Mekkah." },
  { id: 5, pertanyaan: "Kota Madinah dahulu bernama?", opsiA: "Yatsrib", opsiB: "Thaif", opsiC: "Khaibar", opsiD: "Fadak", kunci: "A", status: "nonaktif", pembahasan: "Kota Madinah sebelumnya bernama Yatsrib, kemudian diubah menjadi Madinah an-Nabi (Kota Nabi) setelah Hijrah." },
];

export interface GpsPointRow {
  id: number;
  nama: string;
  latitude: string;
  longitude: string;
  radius: number;
  status: "aktif" | "nonaktif";
}

export const GPS_POINTS: GpsPointRow[] = [
  { id: 1, nama: "Kantor Pusat", latitude: "-6.2087634", longitude: "106.8455984", radius: 100, status: "aktif" },
  { id: 2, nama: "Kantor Cabang Bekasi", latitude: "-6.2382700", longitude: "106.9756000", radius: 100, status: "aktif" },
  { id: 3, nama: "TPQ Al-Maghfirah", latitude: "-6.1987000", longitude: "106.8300000", radius: 80, status: "aktif" },
];

export interface JadwalKerjaRow {
  id: number;
  nama: string;
  nip: string;
  jabatan: string;
  jamMasuk: string;
  jamPulang: string;
  hariKerja: string;
}

export const JADWAL_KERJA: JadwalKerjaRow[] = [
  { id: 1, nama: "Arif Fatoni", nip: "YAM-0001", jabatan: "Staf Program", jamMasuk: "08:00", jamPulang: "17:00", hariKerja: "Senin - Jumat" },
  { id: 2, nama: "Naila Nasywa", nip: "YAM-0002", jabatan: "Admin", jamMasuk: "08:00", jamPulang: "17:00", hariKerja: "Senin - Jumat" },
  { id: 3, nama: "Reza Evriansyah", nip: "YAM-0003", jabatan: "Operator", jamMasuk: "07:30", jamPulang: "16:30", hariKerja: "Senin - Jumat" },
  { id: 4, nama: "Ramadhan", nip: "YAM-0004", jabatan: "Staf Program", jamMasuk: "08:00", jamPulang: "17:00", hariKerja: "Senin - Jumat" },
  { id: 5, nama: "Intan Maulida", nip: "YAM-0005", jabatan: "Admin", jamMasuk: "09:00", jamPulang: "18:00", hariKerja: "Senin - Jumat" },
];

export interface LaporanRow {
  id: number;
  nama: string;
  nip: string;
  jabatan: string;
  hadir: number;
  terlambat: number;
  tidakHadir: number;
  izin: number;
  sakit: number;
  cuti: number;
  lembur: number;
}

export const LAPORAN_LIST: LaporanRow[] = [
  { id: 1, nama: "Arif Fatoni", nip: "YAM-0001", jabatan: "Staf Program", hadir: 20, terlambat: 2, tidakHadir: 1, izin: 1, sakit: 0, cuti: 0, lembur: 3 },
  { id: 2, nama: "Naila Nasywa", nip: "YAM-0002", jabatan: "Admin", hadir: 22, terlambat: 0, tidakHadir: 0, izin: 0, sakit: 1, cuti: 0, lembur: 1 },
  { id: 3, nama: "Reza Evriansyah", nip: "YAM-0003", jabatan: "Operator", hadir: 21, terlambat: 1, tidakHadir: 1, izin: 0, sakit: 0, cuti: 0, lembur: 2 },
  { id: 4, nama: "Ramadhan", nip: "YAM-0004", jabatan: "Staf Program", hadir: 19, terlambat: 3, tidakHadir: 2, izin: 0, sakit: 0, cuti: 0, lembur: 0 },
  { id: 5, nama: "Intan Maulida", nip: "YAM-0005", jabatan: "Admin", hadir: 23, terlambat: 0, tidakHadir: 0, izin: 0, sakit: 0, cuti: 0, lembur: 4 },
];

export interface StatistikKuisRow {
  id: number;
  nama: string;
  tanggal: string;
  soal: string;
  jawaban: "A" | "B" | "C" | "D";
  benar: boolean;
}

export const STATISTIK_KUIS: StatistikKuisRow[] = [
  { id: 1, nama: "Arif Fatoni", tanggal: "12 Nov 2026", soal: "Pada tahun berapa Hijriah dimulai?", jawaban: "A", benar: true },
  { id: 2, nama: "Naila Nasywa", tanggal: "12 Nov 2026", soal: "Siapakah khalifah pertama dalam sejarah Islam?", jawaban: "B", benar: false },
  { id: 3, nama: "Reza Evriansyah", tanggal: "11 Nov 2026", soal: "Pertempuran pertama dalam sejarah Islam adalah?", jawaban: "A", benar: true },
  { id: 4, nama: "Intan Maulida", tanggal: "11 Nov 2026", soal: "Al-Quran pertama kali diturunkan di gua?", jawaban: "B", benar: true },
  { id: 5, nama: "Ahmad Fauzi", tanggal: "10 Nov 2026", soal: "Siapakah khalifah pertama dalam sejarah Islam?", jawaban: "C", benar: true },
  { id: 6, nama: "Bagas Pratama", tanggal: "10 Nov 2026", soal: "Pada tahun berapa Hijriah dimulai?", jawaban: "D", benar: false },
];

export interface AktivitasAbsensiRow {
  id: number;
  nama: string;
  lokasi: string;
  jenis: "masuk" | "pulang";
  waktu: string;
  avatarColor: string;
}

export const AKTIVITAS_ABSENSI: AktivitasAbsensiRow[] = [
  { id: 1, nama: "Arif Hidayat", lokasi: "Kantor Pusat - Masuk", jenis: "masuk", waktu: "07:56", avatarColor: "from-emerald-500 to-green-600" },
  { id: 2, nama: "Naila Saryaza", lokasi: "Kantor Pusat - Masuk", jenis: "masuk", waktu: "07:56", avatarColor: "from-pink-500 to-rose-600" },
  { id: 3, nama: "Reza Karyanyah", lokasi: "Kantor Pusat - Pulang", jenis: "pulang", waktu: "16:32", avatarColor: "from-blue-500 to-indigo-600" },
  { id: 4, nama: "Ramadhan", lokasi: "Kantor Pusat - Masuk", jenis: "masuk", waktu: "07:49", avatarColor: "from-amber-500 to-orange-600" },
  { id: 5, nama: "Intan Maulida", lokasi: "Kantor Cabang - Masuk", jenis: "masuk", waktu: "07:45", avatarColor: "from-violet-500 to-purple-600" },
];

// Chart data for admin dashboard
export const STATistik_7_HARI = [
  { hari: "Sen", tgl: "03", persen: 82 },
  { hari: "Sel", tgl: "04", persen: 85 },
  { hari: "Rab", tgl: "05", persen: 88 },
  { hari: "Kam", tgl: "06", persen: 86 },
  { hari: "Jum", tgl: "07", persen: 90 },
  { hari: "Sab", tgl: "08", persen: 92 },
  { hari: "Min", tgl: "09", persen: 91 },
];

// Detail laporan perkaryawan - per-day attendance for a specific employee (November 2026)
export interface DetailLaporanRow {
  id: number;
  nama: string;
  tanggal: string;
  hari: string;
  jamMasuk: string | null;
  jamPulang: string | null;
  jamMasukLembur: string | null;
  jamPulangLembur: string | null;
  status: StatusType;
  keterangan: string;
}

export const DETAIL_LAPORAN_LIST: DetailLaporanRow[] = [
  { id: 1, nama: "Arif Fatoni", tanggal: "02 Nov 2026", hari: "Senin", jamMasuk: "08:00", jamPulang: "17:00", jamMasukLembur: null, jamPulangLembur: null, status: "hadir", keterangan: "Tepat waktu" },
  { id: 2, nama: "Arif Fatoni", tanggal: "03 Nov 2026", hari: "Selasa", jamMasuk: "08:05", jamPulang: "17:00", jamMasukLembur: null, jamPulangLembur: null, status: "hadir", keterangan: "Tepat waktu" },
  { id: 3, nama: "Arif Fatoni", tanggal: "04 Nov 2026", hari: "Rabu", jamMasuk: "08:00", jamPulang: "17:00", jamMasukLembur: null, jamPulangLembur: null, status: "hadir", keterangan: "Tepat waktu" },
  { id: 4, nama: "Arif Fatoni", tanggal: "05 Nov 2026", hari: "Kamis", jamMasuk: "08:00", jamPulang: null, jamMasukLembur: "19:05", jamPulangLembur: "21:00", status: "lembur", keterangan: "Lembur penyelesaian laporan" },
  { id: 5, nama: "Arif Fatoni", tanggal: "06 Nov 2026", hari: "Jumat", jamMasuk: "08:10", jamPulang: "17:05", jamMasukLembur: null, jamPulangLembur: null, status: "hadir", keterangan: "Tepat waktu" },
  { id: 6, nama: "Arif Fatoni", tanggal: "07 Nov 2026", hari: "Sabtu", jamMasuk: null, jamPulang: null, jamMasukLembur: null, jamPulangLembur: null, status: "libur", keterangan: "Hari Libur (Akhir Pekan)" },
  { id: 7, nama: "Arif Fatoni", tanggal: "08 Nov 2026", hari: "Minggu", jamMasuk: null, jamPulang: null, jamMasukLembur: null, jamPulangLembur: null, status: "libur", keterangan: "Hari Libur (Akhir Pekan)" },
  { id: 8, nama: "Arif Fatoni", tanggal: "09 Nov 2026", hari: "Senin", jamMasuk: "08:00", jamPulang: "17:00", jamMasukLembur: null, jamPulangLembur: null, status: "hadir", keterangan: "Tepat waktu" },
  { id: 9, nama: "Arif Fatoni", tanggal: "10 Nov 2026", hari: "Selasa", jamMasuk: "08:00", jamPulang: null, jamMasukLembur: "19:10", jamPulangLembur: "21:00", status: "lembur", keterangan: "Lembur persiapan event" },
  { id: 10, nama: "Arif Fatoni", tanggal: "11 Nov 2026", hari: "Rabu", jamMasuk: "08:05", jamPulang: "17:00", jamMasukLembur: null, jamPulangLembur: null, status: "terlambat", keterangan: "Terlambat 5 menit" },
];
