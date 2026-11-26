"use client";

import * as React from "react";
import {
  CheckCircle2,
  Clock,
  CalendarDays,
  Cross,
  Umbrella,
  XCircle,
  MapPin,
  CalendarCheck,
  Briefcase,
  Navigation,
  LogIn,
  LogOut,
  FileText,
  ClipboardList,
  History,
} from "lucide-react";
import {
  Card,
  CardBody,
  CardHeader,
  KpiCard,
  StatusBadge,
  PrimaryButton,
  InfoRow,
} from "../shared/ui";
import { DateChip, Dash } from "../shared/form";
import {
  RIWAYAT_KEHADIRAN,
  PENGAJUAN_LIST,
  type PengajuanRow,
} from "../shared/data";
import type { ScreenId } from "../navigation";

export function DashboardKaryawan({
  onNavigate,
}: {
  onNavigate: (s: ScreenId) => void;
}) {
  return (
    <div className="space-y-6">
      {/* KPI cards */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
        <KpiCard label="Hadir" value={18} unit="Hari" icon={CheckCircle2} tone="green" />
        <KpiCard label="Terlambat" value={2} unit="Hari" icon={Clock} tone="amber" />
        <KpiCard label="Izin" value={1} unit="Hari" icon={CalendarDays} tone="blue" />
        <KpiCard label="Sakit" value={0} unit="Hari" icon={Cross} tone="blue" />
        <KpiCard label="Cuti" value={0} unit="Hari" icon={Umbrella} tone="teal" />
        <KpiCard label="Tidak Hadir" value={1} unit="Hari" icon={XCircle} tone="red" />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-5">
        {/* Absensi Hari Ini - wider */}
        <Card className="lg:col-span-3">
          <CardHeader
            title="Absensi Hari Ini"
            subtitle="Senin, 09 Nov 2026"
            icon={CalendarCheck}
            iconColor="green"
            action={
              <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-bold text-emerald-700">
                Hari Kerja
              </span>
            }
          />
          <CardBody>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {/* Masuk card - completed */}
              <div className="relative rounded-2xl border-2 border-emerald-500 bg-emerald-50 p-4">
                <div className="absolute right-3 top-3 flex h-6 w-6 items-center justify-center rounded-full bg-emerald-500 text-white">
                  <CheckCircle2 className="h-4 w-4" />
                </div>
                <div className="flex items-center gap-2 text-emerald-700">
                  <LogIn className="h-5 w-5" />
                  <span className="text-sm font-bold">Masuk</span>
                </div>
                <p className="mt-2 text-2xl font-extrabold text-emerald-900">
                  08:00 <span className="text-sm font-bold text-emerald-600">WIB</span>
                </p>
                <p className="mt-1 text-xs font-medium text-emerald-700">
                  Tepat waktu &middot; Kantor Pusat
                </p>
              </div>

              {/* Pulang card - not yet */}
              <div className="rounded-2xl border-2 border-dashed border-slate-300 bg-slate-50 p-4">
                <div className="flex items-center gap-2 text-slate-500">
                  <LogOut className="h-5 w-5" />
                  <span className="text-sm font-bold">Pulang</span>
                </div>
                <p className="mt-2 text-2xl font-extrabold text-slate-400">
                  Belum Absensi
                </p>
                <p className="mt-1 text-xs font-medium text-slate-500">
                  Batas pulang: 17:00 WIB
                </p>
              </div>
            </div>

            <div className="mt-4">
              <PrimaryButton icon={Navigation} onClick={() => onNavigate("absensi-pulang")}>
                Lakukan Absensi
              </PrimaryButton>
            </div>

            <div className="mt-4 flex flex-wrap gap-2">
              <button
                onClick={() => onNavigate("absensi-masuk")}
                className="inline-flex items-center gap-1.5 rounded-lg border border-emerald-200 bg-white px-3 py-1.5 text-xs font-bold text-emerald-700 hover:bg-emerald-50"
              >
                <LogIn className="h-3.5 w-3.5" /> Absen Masuk
              </button>
              <button
                onClick={() => onNavigate("absensi-pulang")}
                className="inline-flex items-center gap-1.5 rounded-lg border border-blue-200 bg-white px-3 py-1.5 text-xs font-bold text-blue-700 hover:bg-blue-50"
              >
                <LogOut className="h-3.5 w-3.5" /> Absen Pulang
              </button>
              <button
                onClick={() => onNavigate("pengajuan-izin")}
                className="inline-flex items-center gap-1.5 rounded-lg border border-amber-200 bg-white px-3 py-1.5 text-xs font-bold text-amber-700 hover:bg-amber-50"
              >
                <ClipboardList className="h-3.5 w-3.5" /> Izin
              </button>
              <button
                onClick={() => onNavigate("pengajuan-sakit")}
                className="inline-flex items-center gap-1.5 rounded-lg border border-sky-200 bg-white px-3 py-1.5 text-xs font-bold text-sky-700 hover:bg-sky-50"
              >
                <Cross className="h-3.5 w-3.5" /> Sakit
              </button>
              <button
                onClick={() => onNavigate("pengajuan-cuti")}
                className="inline-flex items-center gap-1.5 rounded-lg border border-teal-200 bg-white px-3 py-1.5 text-xs font-bold text-teal-700 hover:bg-teal-50"
              >
                <Umbrella className="h-3.5 w-3.5" /> Cuti
              </button>
            </div>
          </CardBody>
        </Card>

        {/* Informasi Hari Ini - narrower */}
        <Card className="lg:col-span-2">
          <CardHeader title="Informasi Hari Ini" icon={Briefcase} iconColor="blue" />
          <CardBody className="divide-y divide-slate-100">
            <InfoRow label="Jadwal Kerja" value="08:00 - 17:00 WIB" icon={Clock} />
            <InfoRow label="Lokasi Absensi" value="Kantor Pusat" icon={MapPin} />
            <InfoRow label="Radius Lokasi" value="100 meter" icon={Navigation} />
            <InfoRow label="Status Hari" value="Hari Kerja" icon={CalendarCheck} />
            <div className="flex items-center justify-between pt-3">
              <span className="text-xs font-medium text-slate-500">
                Presensi berbasis geolokasi aktif
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2 py-0.5 text-[11px] font-bold text-emerald-700">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                GPS Terhubung
              </span>
            </div>
          </CardBody>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Pengajuan Terakhir */}
        <Card>
          <CardHeader
            title="Pengajuan Terakhir"
            icon={FileText}
            iconColor="blue"
            action={
              <button
                onClick={() => onNavigate("riwayat-pengajuan")}
                className="inline-flex items-center gap-1 text-sm font-semibold text-blue-600 hover:text-blue-700"
              >
                Lihat Semua
              </button>
            }
          />
          <CardBody className="p-0">
            <div className="divide-y divide-slate-100">
              {PENGAJUAN_LIST.slice(0, 4).map((p: PengajuanRow) => (
                <div key={p.id} className="flex items-center gap-3 px-5 py-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                    {p.jenis === "izin" ? (
                      <ClipboardList className="h-4 w-4" />
                    ) : p.jenis === "sakit" ? (
                      <Cross className="h-4 w-4" />
                    ) : (
                      <Umbrella className="h-4 w-4" />
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-bold capitalize text-slate-900">
                      Pengajuan {p.jenis}
                    </p>
                    <p className="truncate text-xs text-slate-500">
                      {p.periode} &middot; {p.tanggalPengajuan}
                    </p>
                  </div>
                  <StatusBadge status={p.status} />
                </div>
              ))}
            </div>
          </CardBody>
        </Card>

        {/* Riwayat Kehadiran Terakhir */}
        <Card>
          <CardHeader
            title="Riwayat Kehadiran Terakhir"
            icon={History}
            iconColor="green"
            action={
              <button
                onClick={() => onNavigate("riwayat-kehadiran")}
                className="inline-flex items-center gap-1 text-sm font-semibold text-emerald-600 hover:text-emerald-700"
              >
                Lihat Semua
              </button>
            }
          />
          <CardBody className="p-0">
            <div className="overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-blue-600 text-left text-xs font-bold uppercase tracking-wider text-white">
                    <th className="px-4 py-2.5">Tanggal</th>
                    <th className="px-4 py-2.5">Masuk</th>
                    <th className="px-4 py-2.5">Pulang</th>
                    <th className="px-4 py-2.5 text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {RIWAYAT_KEHADIRAN.slice(0, 5).map((r) => (
                    <tr key={r.id} className="hover:bg-slate-50">
                      <td className="px-4 py-3 font-semibold text-slate-900">
                        {r.tanggal}
                      </td>
                      <td className="px-4 py-3 font-medium text-slate-700">
                        {r.jamMasuk ?? <Dash />}
                      </td>
                      <td className="px-4 py-3 font-medium text-slate-700">
                        {r.jamPulang ?? <Dash />}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <StatusBadge status={r.status} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardBody>
        </Card>
      </div>
    </div>
  );
}
