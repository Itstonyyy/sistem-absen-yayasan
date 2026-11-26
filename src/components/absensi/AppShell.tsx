"use client";

import * as React from "react";
import { LogOut, AlertTriangle, X } from "lucide-react";
import { Sidebar } from "./Sidebar";
import { TopHeader } from "./TopHeader";
import { PageFooter } from "./shared/ui";
import type { Role, ScreenId } from "./navigation";

interface AppShellProps {
  role: Role;
  activeScreen: ScreenId;
  userName: string;
  userRoleLabel: string;
  onNavigate: (s: ScreenId, extras?: { employeeId?: string; holidayId?: string; scheduleId?: string; locationId?: string }) => void;
  onLogout: () => void;
  children: React.ReactNode;
  editingEmployeeId: string | null;
  editingScheduleId: string | null;
  editingHolidayId: string | null;
}

export function AppShell({
  role,
  activeScreen,
  userName,
  userRoleLabel,
  onNavigate,
  onLogout,
  children,
  editingEmployeeId,
  editingScheduleId,
  editingHolidayId,
}: AppShellProps) {
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = React.useState(false);

  return (
    <div className="flex min-h-screen flex-col bg-slate-100">
      {/* Logout confirmation modal */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm"
            onClick={() => setShowLogoutConfirm(false)}
          />
          <div className="relative z-10 w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-card">
            <button
              onClick={() => setShowLogoutConfirm(false)}
              className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-600"
            >
              <X className="h-4 w-4" />
            </button>
            <div className="text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-amber-100">
                <AlertTriangle className="h-9 w-9 text-amber-600" />
              </div>
              <h3 className="mt-4 text-xl font-extrabold text-slate-900">
                Konfirmasi Logout
              </h3>
              <p className="mt-1 text-sm text-slate-500">
                Apakah Anda yakin ingin keluar dari sistem? Anda perlu login kembali
                untuk mengakses dashboard.
              </p>
              <div className="mt-5 flex gap-2">
                <button
                  onClick={() => setShowLogoutConfirm(false)}
                  className="flex-1 rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm font-bold text-slate-600 hover:bg-slate-50"
                >
                  Batal
                </button>
                <button
                  onClick={() => {
                    setShowLogoutConfirm(false);
                    onLogout();
                  }}
                  className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-rose-600 px-4 py-2.5 text-sm font-bold text-white hover:bg-rose-700"
                >
                  <LogOut className="h-4 w-4" />
                  Ya, Logout
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="flex flex-1 overflow-hidden">
        <Sidebar
          role={role}
          activeScreen={activeScreen}
          onNavigate={onNavigate}
          onLogout={() => setShowLogoutConfirm(true)}
          mobileOpen={mobileOpen}
          setMobileOpen={setMobileOpen}
        />

        <div className="flex min-w-0 flex-1 flex-col">
          <TopHeader
            role={role}
            screenId={activeScreen}
            userName={userName}
            userRole={userRoleLabel}
            onOpenMobileSidebar={() => setMobileOpen(true)}
          />
          <main className="flex flex-1 flex-col overflow-y-auto">
            <div className="flex-1 mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
              {children}
            </div>
            <PageFooter />
          </main>
        </div>
      </div>
    </div>
  );
}
