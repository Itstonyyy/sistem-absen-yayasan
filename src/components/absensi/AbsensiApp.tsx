"use client";

import * as React from "react";
import { AppShell } from "./AppShell";
import { LoginScreen } from "./LoginScreen";
import { canAccessScreen, getDashboardForRole, type Role, type ScreenId } from "./navigation";

import { DashboardKaryawan } from "./screens/DashboardKaryawan";
import { AbsensiScreen } from "./screens/AbsensiScreen";
import { PengajuanScreen } from "./screens/PengajuanScreen";
import { RiwayatKehadiran, RiwayatPengajuan } from "./screens/RiwayatScreens";
import { ProfilSaya, UbahPassword } from "./screens/ProfilScreens";
import { DashboardAdmin } from "./screens/DashboardAdmin";
import {
  MonitoringAbsensi,
  PersetujuanPengajuan,
  KoreksiAbsensi,
} from "./screens/AdminScreens1";
import {
  DataKaryawanList,
  DataKaryawanForm,
  ManajemenKuisList,
  TambahPertanyaanKuis,
  StatistikKuis,
} from "./screens/AdminScreens2";
import {
  HariLiburList,
  HariLiburForm,
  LaporanRekap,
  DetailLaporanPerkaryawan,
  GpsList,
  GpsForm,
  JadwalKerjaList,
  JadwalKerjaForm,
  PengaturanAkunAdmin,
  UbahPasswordAdmin,
} from "./screens/AdminScreens3";

interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
}

async function checkSession(): Promise<{ isLoggedIn: boolean; role?: Role; user?: User }> {
  try {
    const response = await fetch('/api/auth/me', {
      method: 'GET',
      credentials: 'include',
    });

    if (response.ok) {
      const data = await response.json();
      return {
        isLoggedIn: true,
        role: data.user.role,
        user: data.user,
      };
    }
    return { isLoggedIn: false };
  } catch (error) {
    return { isLoggedIn: false };
  }
}

async function logoutSession(): Promise<void> {
  try {
    await fetch('/api/auth/logout', {
      method: 'POST',
      credentials: 'include',
    });
  } catch (error) {
    // Ignore errors
  }
}

export default function AbsensiPage() {
  const [isLoggedIn, setIsLoggedIn] = React.useState<boolean | null>(null);
  const [role, setRole] = React.useState<Role>("karyawan");
  const [user, setUser] = React.useState<User | null>(null);
  const [activeScreen, setActiveScreen] = React.useState<ScreenId>("dashboard-karyawan");
  const [editingEmployeeId, setEditingEmployeeId] = React.useState<string | null>(null);
  const [editingScheduleId, setEditingScheduleId] = React.useState<string | null>(null);
  const [editingHolidayId, setEditingHolidayId] = React.useState<string | null>(null);

  // Check session on mount
  React.useEffect(() => {
    const doCheckSession = async () => {
      const session = await checkSession();
      setIsLoggedIn(session.isLoggedIn);
      if (session.isLoggedIn && session.role && session.user) {
        setRole(session.role);
        setUser(session.user);
        setActiveScreen(getDashboardForRole(session.role));
      }
    };
    doCheckSession();
  }, []);

  const handleLogin = (selectedRole: Role, userData?: { id: string; name: string; email: string; role: Role }) => {
    setRole(selectedRole);
    if (userData) {
      setUser(userData);
    }
    setActiveScreen(
      selectedRole === "admin" ? "dashboard-admin" : "dashboard-karyawan",
    );
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    logoutSession().then(() => {
      setIsLoggedIn(false);
      setRole("karyawan");
      setUser(null);
    });
  };

  const handleNavigate = (s: ScreenId, extras?: { employeeId?: string; holidayId?: string; scheduleId?: string; locationId?: string }) => {
    // Tolak navigasi ke halaman milik role lain, termasuk jika dipanggil dari UI.
    if (!canAccessScreen(role, s)) {
      setActiveScreen(getDashboardForRole(role));
      return;
    }

    // Set editing IDs BEFORE navigating to ensure data is available when the edit form renders
    if (extras?.employeeId && s === "edit-data-karyawan") {
      setEditingEmployeeId(extras.employeeId);
    }
    if (extras?.scheduleId && s === "edit-jadwal-kerja") {
      setEditingScheduleId(extras.scheduleId);
    }
    if (extras?.holidayId && s === "edit-hari-libur") {
      setEditingHolidayId(extras.holidayId);
    }

    setActiveScreen(s);
    // Scroll main content to top
    if (typeof window !== "undefined") {
      const main = document.querySelector("main");
      if (main) main.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  // Show loading state while checking session
  if (isLoggedIn === null) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-slate-100">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-emerald-500 border-t-transparent"></div>
      </div>
    );
  }

  if (!isLoggedIn) {
    return <LoginScreen onLogin={handleLogin} />;
  }

  const userName = role === "admin" ? user?.name || "Admin" : user?.name || "Karyawan";
  const userRoleLabel = role === "admin" ? "Administrator" : "Staf Program";

  return (
  <AppShell
      role={role}
      activeScreen={activeScreen}
      userName={userName}
      userRoleLabel={userRoleLabel}
      onNavigate={handleNavigate}
      onLogout={handleLogout}
      editingEmployeeId={editingEmployeeId}
      editingScheduleId={editingScheduleId}
      editingHolidayId={editingHolidayId}
    >
      <ScreenRenderer
        role={role}
        activeScreen={activeScreen}
        onNavigate={handleNavigate}
        editingEmployeeId={editingEmployeeId}
        editingScheduleId={editingScheduleId}
        editingHolidayId={editingHolidayId}
      />
    </AppShell>
  );
}

function ScreenRenderer({
  role,
  activeScreen,
  onNavigate,
  editingEmployeeId,
  editingScheduleId,
  editingHolidayId,
}: {
  role: Role;
  activeScreen: ScreenId;
  onNavigate: (s: ScreenId, extras?: { employeeId?: string; holidayId?: string; scheduleId?: string; locationId?: string }) => void;
  editingEmployeeId: string | null;
  editingScheduleId: string | null;
  editingHolidayId: string | null;
}) {
  // Perlindungan tambahan: halaman yang tidak sesuai role tidak pernah dirender.
  if (!canAccessScreen(role, activeScreen)) {
    return role === "admin" ? (
      <DashboardAdmin onNavigate={onNavigate} />
    ) : (
      <DashboardKaryawan onNavigate={onNavigate} />
    );
  }

  // Karyawan screens
  switch (activeScreen) {
    case "dashboard-karyawan":
      return <DashboardKaryawan onNavigate={onNavigate} />;
    case "absensi-masuk":
      return <AbsensiScreen jenis="masuk" />;
    case "absensi-pulang":
      return <AbsensiScreen jenis="pulang" />;
    case "absensi-masuk-lembur":
      return <AbsensiScreen jenis="masuk-lembur" />;
    case "absensi-pulang-lembur":
      return <AbsensiScreen jenis="pulang-lembur" />;
    case "pengajuan-izin":
      return <PengajuanScreen jenis="izin" />;
    case "pengajuan-sakit":
      return <PengajuanScreen jenis="sakit" />;
    case "pengajuan-cuti":
      return <PengajuanScreen jenis="cuti" />;
    case "riwayat-kehadiran":
      return <RiwayatKehadiran />;
    case "riwayat-pengajuan":
      return <RiwayatPengajuan />;
    case "profil-saya":
      return <ProfilSaya />;
    case "ubah-password":
      return <UbahPassword />;

    // Admin screens
    case "dashboard-admin":
      return <DashboardAdmin onNavigate={onNavigate} />;
    case "monitoring-absensi":
      return <MonitoringAbsensi />;
    case "persetujuan-pengajuan":
      return <PersetujuanPengajuan />;
    case "koreksi-absensi":
      return <KoreksiAbsensi />;
    case "data-karyawan":
      return <DataKaryawanList onNavigate={onNavigate} />;
    case "tambah-data-karyawan":
      return <DataKaryawanForm mode="tambah" />;
    case "edit-data-karyawan":
      return <DataKaryawanForm mode="edit" employeeId={editingEmployeeId || undefined} />;
    case "manajemen-kuis":
      return <ManajemenKuisList onNavigate={onNavigate} />;
    case "tambah-pertanyaan":
      return <TambahPertanyaanKuis />;
    case "statistik-kuis":
      return <StatistikKuis />;
    case "manajemen-hari-libur":
      return <HariLiburList onNavigate={onNavigate} />;
    case "tambah-hari-libur":
      return <HariLiburForm mode="tambah" />;
    case "edit-hari-libur":
      return <HariLiburForm mode="edit" holidayId={editingHolidayId || undefined} />;
    case "laporan-rekap":
      return <LaporanRekap onNavigate={onNavigate} />;
    case "detail-laporan":
      return <DetailLaporanPerkaryawan onNavigate={onNavigate} />;
    case "daftar-jadwal-kerja":
      return <JadwalKerjaList onNavigate={onNavigate} />;
    case "tambah-jadwal-kerja":
      return <JadwalKerjaForm mode="tambah" />;
    case "edit-jadwal-kerja":
      return <JadwalKerjaForm mode="edit" scheduleId={editingScheduleId || undefined} />;
    case "jadwal-kerja-default":
      return <JadwalKerjaForm mode="default" />;
    case "pengaturan-lokasi-gps":
      return <GpsList onNavigate={onNavigate} />;
    case "tambah-lokasi-gps":
      return <GpsForm mode="tambah" />;
    case "edit-lokasi-gps":
      return <GpsForm mode="edit" />;
    case "pengaturan-akun-admin":
      return <PengaturanAkunAdmin />;
    case "ubah-password-admin":
      return <UbahPasswordAdmin />;
    default:
      return role === "admin" ? (
        <DashboardAdmin onNavigate={onNavigate} />
      ) : (
        <DashboardKaryawan onNavigate={onNavigate} />
      );
  }
}