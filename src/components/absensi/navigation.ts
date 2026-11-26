"use client";

import * as React from "react";
import {
  Home,
  Clock,
  CalendarDays,
  FileText,
  User,
  Lock,
  CalendarCheck,
  ClipboardCheck,
  PencilLine,
  Database,
  BookOpen,
  CalendarRange,
  BarChart3,
  Settings,
  Users,
  ChevronDown,
  ChevronRight,
  type LucideIcon,
} from "lucide-react";

export type Role = "karyawan" | "admin";

export type ScreenIdWithExtras = ScreenId & {
  // Extras for passing data through navigation
  employeeId?: string;
  holidayId?: string;
  locationId?: string;
  scheduleId?: string;
};

export type ScreenId =
  // Karyawan
  | "dashboard-karyawan"
  | "absensi-masuk"
  | "absensi-pulang"
  | "absensi-masuk-lembur"
  | "absensi-pulang-lembur"
  | "pengajuan-izin"
  | "pengajuan-sakit"
  | "pengajuan-cuti"
  | "riwayat-kehadiran"
  | "riwayat-pengajuan"
  | "profil-saya"
  | "ubah-password"
  // Admin
  | "dashboard-admin"
  | "monitoring-absensi"
  | "persetujuan-pengajuan"
  | "koreksi-absensi"
  | "data-karyawan"
  | "tambah-data-karyawan"
  | "edit-data-karyawan"
  | "manajemen-kuis"
  | "tambah-pertanyaan"
  | "statistik-kuis"
  | "manajemen-hari-libur"
  | "tambah-hari-libur"
  | "edit-hari-libur"
  | "laporan-rekap"
  | "detail-laporan"
  | "daftar-jadwal-kerja"
  | "tambah-jadwal-kerja"
  | "edit-jadwal-kerja"
  | "jadwal-kerja-default"
  | "pengaturan-lokasi-gps"
  | "tambah-lokasi-gps"
  | "edit-lokasi-gps"
  | "pengaturan-akun-admin"
  | "ubah-password-admin";


/** Daftar halaman yang boleh diakses oleh setiap role. */
const KARYAWAN_SCREEN_IDS = new Set<ScreenId>([
  "dashboard-karyawan",
  "absensi-masuk",
  "absensi-pulang",
  "absensi-masuk-lembur",
  "absensi-pulang-lembur",
  "pengajuan-izin",
  "pengajuan-sakit",
  "pengajuan-cuti",
  "riwayat-kehadiran",
  "riwayat-pengajuan",
  "profil-saya",
  "ubah-password",
]);

const ADMIN_SCREEN_IDS = new Set<ScreenId>([
  "dashboard-admin",
  "monitoring-absensi",
  "persetujuan-pengajuan",
  "koreksi-absensi",
  "data-karyawan",
  "tambah-data-karyawan",
  "edit-data-karyawan",
  "manajemen-kuis",
  "tambah-pertanyaan",
  "statistik-kuis",
  "manajemen-hari-libur",
  "tambah-hari-libur",
  "edit-hari-libur",
  "laporan-rekap",
  "detail-laporan",
  "daftar-jadwal-kerja",
  "tambah-jadwal-kerja",
  "edit-jadwal-kerja",
  "jadwal-kerja-default",
  "pengaturan-lokasi-gps",
  "tambah-lokasi-gps",
  "edit-lokasi-gps",
  "pengaturan-akun-admin",
  "ubah-password-admin",
]);

export function getDashboardForRole(role: Role): ScreenId {
  return role === "admin" ? "dashboard-admin" : "dashboard-karyawan";
}

export function canAccessScreen(role: Role, screenId: ScreenId): boolean {
  return role === "admin"
    ? ADMIN_SCREEN_IDS.has(screenId)
    : KARYAWAN_SCREEN_IDS.has(screenId);
}

export interface NavLeaf {
  id: ScreenId;
  label: string;
  icon: LucideIcon;
}

export interface NavGroup {
  id: string;
  label: string;
  icon: LucideIcon;
  children: NavLeaf[];
}

export type NavItem = NavLeaf | NavGroup;

export function isNavGroup(item: NavItem): item is NavGroup {
  return (item as NavGroup).children !== undefined;
}

export const KARYAWAN_NAV: NavItem[] = [
  { id: "dashboard-karyawan", label: "Dashboard", icon: Home },
  {
    id: "absensi-group",
    label: "Absensi",
    icon: Clock,
    children: [
      { id: "absensi-masuk", label: "Masuk", icon: ChevronRight },
      { id: "absensi-pulang", label: "Pulang", icon: ChevronRight },
      { id: "absensi-masuk-lembur", label: "Masuk Lembur", icon: ChevronRight },
      { id: "absensi-pulang-lembur", label: "Pulang Lembur", icon: ChevronRight },
    ],
  },
  {
    id: "pengajuan-group",
    label: "Pengajuan",
    icon: CalendarDays,
    children: [
      { id: "pengajuan-izin", label: "Pengajuan Izin", icon: ChevronRight },
      { id: "pengajuan-sakit", label: "Pengajuan Sakit", icon: ChevronRight },
      { id: "pengajuan-cuti", label: "Pengajuan Cuti", icon: ChevronRight },
    ],
  },
  { id: "riwayat-kehadiran", label: "Riwayat Kehadiran", icon: FileText },
  { id: "riwayat-pengajuan", label: "Riwayat Pengajuan", icon: ClipboardCheck },
  { id: "profil-saya", label: "Profil Saya", icon: User },
  { id: "ubah-password", label: "Ubah Password", icon: Lock },
];

export const ADMIN_NAV: NavItem[] = [
  { id: "dashboard-admin", label: "Dashboard", icon: Home },
  { id: "monitoring-absensi", label: "Monitoring Absensi", icon: CalendarCheck },
  { id: "persetujuan-pengajuan", label: "Persetujuan Pengajuan", icon: ClipboardCheck },
  { id: "koreksi-absensi", label: "Koreksi Absensi", icon: PencilLine },
  {
    id: "data-karyawan-group",
    label: "Data Karyawan",
    icon: Database,
    children: [
      { id: "data-karyawan", label: "Lihat Data Karyawan", icon: Users },
      { id: "tambah-data-karyawan", label: "Tambah Data Karyawan", icon: ChevronRight },
      { id: "edit-data-karyawan", label: "Edit Data Karyawan", icon: ChevronRight },
    ],
  },
  {
    id: "kuis-group",
    label: "Kuis Sejarah Islam",
    icon: BookOpen,
    children: [
      { id: "manajemen-kuis", label: "Lihat Pertanyaan", icon: ChevronRight },
      { id: "tambah-pertanyaan", label: "Tambah Pertanyaan", icon: ChevronRight },
      { id: "statistik-kuis", label: "Statistik Hasil Kuis", icon: BarChart3 },
    ],
  },
  {
    id: "hari-libur-group",
    label: "Manajemen Hari Libur",
    icon: CalendarRange,
    children: [
      { id: "manajemen-hari-libur", label: "Daftar Hari Libur", icon: ChevronRight },
      { id: "tambah-hari-libur", label: "Tambah Hari Libur", icon: ChevronRight },
      { id: "edit-hari-libur", label: "Edit Hari Libur", icon: ChevronRight },
    ],
  },
  {
    id: "laporan-group",
    label: "Laporan & Rekap",
    icon: BarChart3,
    children: [
      { id: "laporan-rekap", label: "Laporan Kehadiran", icon: ChevronRight },
      { id: "detail-laporan", label: "Detail Laporan (perkaryawan)", icon: ChevronRight },
    ],
  },
  {
    id: "pengaturan-group",
    label: "Pengaturan",
    icon: Settings,
    children: [
      { id: "daftar-jadwal-kerja", label: "Daftar Jadwal Kerja", icon: ChevronRight },
      { id: "tambah-jadwal-kerja", label: "Tambah Jadwal Kerja", icon: ChevronRight },
      { id: "edit-jadwal-kerja", label: "Edit Jadwal Kerja", icon: ChevronRight },
      { id: "jadwal-kerja-default", label: "Jadwal Kerja Default", icon: ChevronRight },
      { id: "pengaturan-lokasi-gps", label: "Pengaturan Lokasi GPS", icon: ChevronRight },
      { id: "tambah-lokasi-gps", label: "Tambah Lokasi GPS", icon: ChevronRight },
      { id: "edit-lokasi-gps", label: "Edit Lokasi GPS", icon: ChevronRight },
      { id: "pengaturan-akun-admin", label: "Pengaturan Akun Admin", icon: ChevronRight },
      { id: "ubah-password-admin", label: "Ubah Password Admin", icon: ChevronRight },
    ],
  },
];

export function findNavItem(
  items: NavItem[],
  screenId: ScreenId,
): { parent?: NavGroup; item: NavLeaf } | null {
  for (const item of items) {
    if (isNavGroup(item)) {
      const child = item.children.find((c) => c.id === screenId);
      if (child) return { parent: item, item: child };
    } else if ((item as NavLeaf).id === screenId) {
      return { item: item as NavLeaf };
    }
  }
  return null;
}

export function getBreadcrumb(
  role: Role,
  screenId: ScreenId,
): { crumbs: string[]; pageTitle: string; pageSubtitle?: string; pageIcon: LucideIcon } {
  const nav = role === "admin" ? ADMIN_NAV : KARYAWAN_NAV;
  const found = findNavItem(nav, screenId);
  if (!found) {
    return { crumbs: ["Dashboard"], pageTitle: "Dashboard", pageIcon: Home };
  }
  const crumbs: string[] = [];
  if (found.parent) crumbs.push(found.parent.label);
  const titleMap: Partial<Record<ScreenId, { title: string; subtitle?: string }>> = {
    "dashboard-karyawan": {
      title: "Dashboard Karyawan",
      subtitle: "Selamat datang, Arif Fatoni - Kelola absensi, pengajuan, dan aktivitas kehadiran Anda di sini.",
    },
    "absensi-masuk": {
      title: "Absensi Masuk",
      subtitle: "Lakukan absensi masuk sesuai lokasi kerja Anda.",
    },
    "absensi-pulang": {
      title: "Absensi Pulang",
      subtitle: "Lakukan absensi pulang sesuai lokasi kerja Anda.",
    },
    "absensi-masuk-lembur": {
      title: "Absensi Masuk Lembur",
      subtitle: "Catat masuk lembur sesuai lokasi kerja Anda.",
    },
    "absensi-pulang-lembur": {
      title: "Absensi Pulang Lembur",
      subtitle: "Catat pulang lembur sesuai lokasi kerja Anda.",
    },
    "pengajuan-izin": { title: "Pengajuan Izin", subtitle: "Ajukan izin ketidakhadiran Anda." },
    "pengajuan-sakit": { title: "Pengajuan Sakit", subtitle: "Ajukan ketidakhadiran karena sakit." },
    "pengajuan-cuti": { title: "Pengajuan Cuti", subtitle: "Ajukan cuti tahunan/melahirkan/lainnya." },
    "riwayat-kehadiran": {
      title: "Riwayat Kehadiran",
      subtitle: "Lihat dan pantau seluruh riwayat kehadiran Anda.",
    },
    "riwayat-pengajuan": {
      title: "Riwayat Pengajuan",
      subtitle: "Pantau status pengajuan izin, sakit, dan cuti Anda.",
    },
    "profil-saya": { title: "Profil Saya", subtitle: "Kelola dan perbarui informasi data diri Anda." },
    "ubah-password": { title: "Ubah Password", subtitle: "Perbarui password akun Anda." },
    "dashboard-admin": {
      title: "Dashboard Admin",
      subtitle: "Kelola, pantau, dan analisis aktivitas kehadiran seluruh karyawan.",
    },
    "monitoring-absensi": {
      title: "Monitoring Absensi",
      subtitle: "Pantau dan kelola data kehadiran karyawan secara real-time.",
    },
    "persetujuan-pengajuan": {
      title: "Persetujuan Pengajuan",
      subtitle: "Tinjau dan setujui/tolak pengajuan izin, sakit, dan cuti.",
    },
    "koreksi-absensi": {
      title: "Koreksi Absensi",
      subtitle: "Koreksi data absensi karyawan secara tercatat.",
    },
    "data-karyawan": {
      title: "Lihat Data Karyawan",
      subtitle: "Lihat dan kelola seluruh data karyawan yang terdaftar dalam sistem.",
    },
    "tambah-data-karyawan": {
      title: "Tambah Data Karyawan",
      subtitle: "Daftarkan karyawan baru ke dalam sistem.",
    },
    "edit-data-karyawan": {
      title: "Edit Data Karyawan",
      subtitle: "Perbarui informasi data karyawan.",
    },
    "manajemen-kuis": {
      title: "Bank Soal Kuis Sejarah Islam",
      subtitle: "Kelola bank soal kuis untuk absensi pulang.",
    },
    "tambah-pertanyaan": {
      title: "Tambah Pertanyaan Kuis",
      subtitle: "Tambahkan soal baru ke bank soal kuis.",
    },
    "statistik-kuis": {
      title: "Statistik Hasil Kuis",
      subtitle: "Pantau hasil pengerjaan kuis karyawan.",
    },
    "manajemen-hari-libur": {
      title: "Manajemen Hari Libur",
      subtitle: "Kelola hari libur rutin, nasional, dan khusus.",
    },
    "tambah-hari-libur": { title: "Tambah Hari Libur", subtitle: "Tambahkan hari libur baru." },
    "edit-hari-libur": { title: "Edit Hari Libur", subtitle: "Perbarui data hari libur." },
    "laporan-rekap": {
      title: "Laporan Rekap Kehadiran Bulanan",
      subtitle: "Hasilkan dan ekspor laporan kehadiran karyawan.",
    },
    "detail-laporan": {
      title: "Detail Laporan Perkaryawan",
      subtitle: "Rincian data kehadiran karyawan berdasarkan periode dan jenis laporan.",
    },
    "daftar-jadwal-kerja": {
      title: "Daftar Jadwal Kerja",
      subtitle: "Kelola jadwal kerja per karyawan.",
    },
    "tambah-jadwal-kerja": {
      title: "Tambah Jadwal Kerja",
      subtitle: "Atur jadwal kerja karyawan.",
    },
    "jadwal-kerja-default": {
      title: "Jadwal Kerja Default",
      subtitle: "Atur jam kerja default global.",
    },
    "pengaturan-lokasi-gps": {
      title: "Pengaturan Lokasi GPS",
      subtitle: "Kelola titik lokasi absensi GPS.",
    },
    "tambah-lokasi-gps": { title: "Tambah Lokasi GPS", subtitle: "Daftarkan titik lokasi baru." },
    "edit-lokasi-gps": { title: "Edit Lokasi GPS", subtitle: "Perbarui titik lokasi absensi." },
    "pengaturan-akun-admin": {
      title: "Pengaturan Akun Admin",
      subtitle: "Kelola profil akun administrator.",
    },
    "ubah-password-admin": {
      title: "Ubah Password Admin",
      subtitle: "Perbarui password akun administrator.",
    },
  };
  const meta = titleMap[screenId] ?? { title: found.item.label };
  return {
    crumbs: [...crumbs, found.item.label],
    pageTitle: meta.title,
    pageSubtitle: meta.subtitle,
    pageIcon: found.item.icon,
  };
}

export { ChevronDown };