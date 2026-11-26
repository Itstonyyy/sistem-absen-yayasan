"use client";

import * as React from "react";
import {
  Users,
  CheckCircle2,
  Clock,
  XCircle,
  FileText,
  Cross,
  Umbrella,
  Zap,
  Database,
  ClipboardCheck,
  CalendarCheck,
  BarChart3,
  BookOpen,
  ClipboardList,
  AlertTriangle,
  TriangleAlert,
} from "lucide-react";
import {
  Card,
  CardBody,
  CardHeader,
  KpiCard,
  StatusBadge,
} from "../shared/ui";
import { DateChip } from "../shared/form";
import {
  PENGAJUAN_LIST,
  AKTIVITAS_ABSENSI,
  STATistik_7_HARI,
} from "../shared/data";
import type { ScreenId } from "../navigation";

export function DashboardAdmin({
  onNavigate,
}: {
  onNavigate: (s: ScreenId) => void;
}) {
  return (
    <div className="space-y-6">
      {/* Welcome banner */}
      <div className="flex flex-col gap-4 rounded-2xl border border-emerald-200 bg-gradient-to-br from-emerald-50 via-teal-50 to-sky-50 p-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white shadow-sm">
            <Users className="h-6 w-6 text-emerald-600" />
          </div>
          <div>
            <h2 className="text-xl font-extrabold text-slate-900 sm:text-2xl">
              Selamat Datang, Admin
            </h2>
            <p className="text-sm text-slate-600">
              Kelola, pantau, dan analisis aktivitas kehadiran seluruh karyawan <br />
              <strong>Yayasan Al-Maghfirah</strong>.
            </p>
          </div>
        </div>
        <DateChip date="Senin, 09 November 2026" />
      </div>

      {/* KPI cards */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-4">
        <KpiCard label="Total Karyawan" value={72} icon={Users} tone="blue" />
        <KpiCard label="Hadir Hari Ini" value={58} icon={CheckCircle2} tone="green" highlight />
        <KpiCard label="Terlambat" value={6} icon={Clock} tone="amber" />
        <KpiCard label="Tidak Hadir" value={8} icon={XCircle} tone="red" />
        <KpiCard label="Pengajuan Izin" value={5} icon={FileText} tone="blue" />
        <KpiCard label="Pengajuan Sakit" value={3} icon={Cross} tone="green" />
        <KpiCard label="Pengajuan Cuti" value={4} icon={TriangleAlert} tone="blue" />
      </div>

      {/* Quick access */}
      <div>
        <div className="mb-3 flex items-center gap-2">
          <Zap className="h-4 w-4 text-blue-600" />
          <h3 className="text-base font-bold text-slate-900">Akses Cepat</h3>
        </div>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
          {[
            { label: "Kelola Karyawan", icon: Database, screen: "data-karyawan" as ScreenId, tone: "blue" },
            { label: "Persetujuan Pengajuan", icon: ClipboardCheck, screen: "persetujuan-pengajuan" as ScreenId, tone: "amber" },
            { label: "Monitoring Absensi", icon: CalendarCheck, screen: "monitoring-absensi" as ScreenId, tone: "green" },
            { label: "Rekap & Laporan", icon: BarChart3, screen: "laporan-rekap" as ScreenId, tone: "blue" },
            { label: "Input Soal Kuis Islam", icon: BookOpen, screen: "tambah-pertanyaan" as ScreenId, tone: "teal" },
          ].map((q) => {
            const Icon = q.icon;
            return (
              <button
                key={q.label}
                onClick={() => onNavigate(q.screen)}
                className="group flex flex-col items-start gap-2 rounded-2xl border border-slate-200 bg-white p-4 text-left shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md"
              >
                <div
                  className={`flex h-10 w-10 items-center justify-center rounded-xl ${
                    q.tone === "blue"
                      ? "bg-blue-50 text-blue-600"
                      : q.tone === "green"
                        ? "bg-emerald-50 text-emerald-600"
                        : q.tone === "amber"
                          ? "bg-amber-50 text-amber-600"
                          : "bg-teal-50 text-teal-600"
                  }`}
                >
                  <Icon className="h-5 w-5" />
                </div>
                <p className="text-sm font-bold leading-tight text-slate-800">
                  {q.label}
                </p>
              </button>
            );
          })}
        </div>
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Line chart - wider */}
        <Card className="lg:col-span-2">
          <CardHeader
            title="Grafik Statistik Kehadiran (7 Hari Terakhir)"
            icon={BarChart3}
            iconColor="green"
          />
          <CardBody>
            <LineChart7Days />
          </CardBody>
        </Card>

        {/* Donut chart */}
        <Card className="lg:col-span-1">
          <CardHeader title="Persentase Kehadiran (Hari Ini)" icon={CheckCircle2} iconColor="blue" />
          <CardBody>
            <DonutChart />
            <div className="mt-4 flex items-center justify-between text-xs">
              
            </div>
          </CardBody>
        </Card>
      </div>

      {/* Bottom row */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Pengajuan terbaru */}
        <Card className="lg:col-span-2">
          <CardHeader
            title="Pengajuan Terbaru (Menunggu Persetujuan)"
            icon={FileText}
            iconColor="blue"
            action={
              <button
                onClick={() => onNavigate("persetujuan-pengajuan")}
                className="inline-flex items-center gap-1 text-sm font-semibold text-emerald-600 hover:text-emerald-700"
              >
                Lihat Semua
              </button>
            }
          />
          <CardBody className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-blue-600 text-left text-xs font-bold uppercase tracking-wider text-white">
                    <th className="px-4 py-2.5">No</th>
                    <th className="px-4 py-2.5">Nama Karyawan</th>
                    <th className="px-4 py-2.5">Jenis</th>
                    <th className="px-4 py-2.5">Periode</th>
                    <th className="px-4 py-2.5">Tanggal Pengajuan</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {PENGAJUAN_LIST.filter((p) => p.status === "pending")
                    .slice(0, 5)
                    .map((p, i) => (
                      <tr key={p.id} className="hover:bg-slate-50">
                        <td className="px-4 py-3 font-medium text-slate-500">{i + 1}</td>
                        <td className="px-4 py-3 font-bold text-slate-900">{p.nama}</td>
                        <td className="px-4 py-3">
                          <span
                            className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-bold capitalize ${
                              p.jenis === "izin"
                                ? "bg-amber-100 text-amber-700"
                                : p.jenis === "sakit"
                                  ? "bg-sky-100 text-sky-700"
                                  : "bg-blue-100 text-blue-700"
                            }`}
                          >
                            {p.jenis}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-slate-600">{p.periode}</td>
                        <td className="px-4 py-3 text-slate-600">{p.tanggalPengajuan}</td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </CardBody>
        </Card>

        {/* Aktivitas absensi terbaru */}
        <Card className="lg:col-span-1">
          <CardHeader
            title="Aktivitas Absensi Terbaru"
            icon={Clock}
            iconColor="blue"
            action={
              <button
                onClick={() => onNavigate("monitoring-absensi")}
                className="inline-flex items-center gap-1 text-sm font-semibold text-emerald-600 hover:text-emerald-700"
              >
                Lihat Semua
              </button>
            }
          />
          <CardBody className="divide-y divide-slate-100 p-0">
            {AKTIVITAS_ABSENSI.map((a) => (
              <div key={a.id} className="flex items-center gap-3 px-5 py-3">
                <div
                  className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br ${a.avatarColor} text-white`}
                >
                  <Users className="h-4 w-4" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-bold text-slate-900">{a.nama}</p>
                  <p className="truncate text-xs text-slate-500">{a.lokasi}</p>
                </div>
                <div className="flex flex-col items-end gap-0.5">
                  <span
                    className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-bold ${
                      a.jenis === "masuk"
                        ? "bg-emerald-100 text-emerald-700"
                        : "bg-blue-100 text-blue-700"
                    }`}
                  >
                    {a.jenis === "masuk" ? "Masuk" : "Pulang"}
                  </span>
                  <span className="text-sm font-bold text-slate-900">{a.waktu}</span>
                </div>
              </div>
            ))}
          </CardBody>
        </Card>
      </div>
    </div>
  );
}

/* Simple inline line chart using SVG */
function LineChart7Days() {
  const data = STATistik_7_HARI;
  const max = 100;
  const min = 70;
  const width = 560;
  const height = 220;
  const padX = 30;
  const padY = 20;
  const range = max - min;

  const points = data.map((d, i) => {
    const x = padX + (i * (width - padX * 2)) / (data.length - 1);
    const y = height - padY - ((d.persen - min) / range) * (height - padY * 2);
    return { x, y, ...d };
  });

  const pathD = points
    .map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`)
    .join(" ");

  const areaD = `${pathD} L ${points[points.length - 1].x} ${height - padY} L ${points[0].x} ${height - padY} Z`;

  return (
    <div className="w-full">
      <svg viewBox={`0 0 ${width} ${height}`} className="w-full" preserveAspectRatio="xMidYMid meet">
        <defs>
          <linearGradient id="chartArea" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#10b981" stopOpacity="0.35" />
            <stop offset="100%" stopColor="#10b981" stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* Grid lines */}
        {[70, 80, 90, 100].map((g) => {
          const y = height - padY - ((g - min) / range) * (height - padY * 2);
          return (
            <g key={g}>
              <line
                x1={padX}
                y1={y}
                x2={width - padX}
                y2={y}
                stroke="#e2e8f0"
                strokeWidth="1"
                strokeDasharray="3 3"
              />
              <text x={5} y={y + 4} fontSize="10" fill="#94a3b8" fontWeight="600">
                {g}%
              </text>
            </g>
          );
        })}

        {/* Area */}
        <path d={areaD} fill="url(#chartArea)" />

        {/* Line */}
        <path
          d={pathD}
          fill="none"
          stroke="#10b981"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Dots + labels */}
        {points.map((p, i) => (
          <g key={i}>
            <circle cx={p.x} cy={p.y} r="4" fill="white" stroke="#10b981" strokeWidth="2" />
            <text
              x={p.x}
              y={p.y - 10}
              fontSize="11"
              fill="#047857"
              fontWeight="700"
              textAnchor="middle"
            >
              {p.persen}%
            </text>
            <text x={p.x} y={height - 5} fontSize="10" fill="#64748b" textAnchor="middle">
              {p.hari}
            </text>
            <text x={p.x} y={height - 18} fontSize="9" fill="#94a3b8" textAnchor="middle">
              {p.tgl}
            </text>
          </g>
        ))}
      </svg>
      <div className="mt-3 flex items-center justify-center gap-1.5 text-xs">
        <span className="h-2 w-2 rounded-full bg-emerald-500" />
        <span className="font-medium text-slate-600">Persentase Kehadiran</span>
      </div>
    </div>
  );
}

/* Donut chart using SVG */
function DonutChart() {
  const segments = [
    { label: "Hadir", value: 80, color: "#10b981" },
    { label: "Terlambat", value: 8, color: "#2563eb" },
    { label: "Tidak Hadir", value: 12, color: "#93c5fd" },
  ];
  const total = segments.reduce((a, s) => a + s.value, 0);
  const radius = 55;
  const stroke = 22;
  const cx = 75;
  const cy = 75;
  const circ = 2 * Math.PI * radius;

  let offset = 0;
  const arcs = segments.map((s) => {
    const fraction = s.value / total;
    const dash = fraction * circ;
    const arc = {
      ...s,
      dash,
      offset: circ - offset,
    };
    offset += dash;
    return arc;
  });

  return (
    <div className="flex w-full flex-col items-center gap-5">

      <div className="relative">
        <svg width="150" height="150" viewBox="0 0 150 150">
          {arcs.map((a, i) => (
            <circle
              key={i}
              cx={cx}
              cy={cy}
              r={radius}
              fill="none"
              stroke={a.color}
              strokeWidth={stroke}
              strokeDasharray={`${a.dash} ${circ - a.dash}`}
              strokeDashoffset={a.offset}
              transform={`rotate(-90 ${cx} ${cy})`}
              strokeLinecap="butt"
            />
          ))}
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-3xl font-extrabold text-slate-900">80%</span>
          <span className="text-xs font-bold text-slate-500">Hadir</span>
        </div>
      </div>
      <ul className="w-full max-w-[280px] space-y-3 text-sm">
        {segments.map((s) => (
          <li key={s.label} className="flex w-full items-center gap-2">
            <span
              className="h-2.5 w-2.5 shrink-0 rounded-full"
              style={{ backgroundColor: s.color }}
            />
            <span className="min-w-0 flex-1 font-semibold text-slate-700">
              {s.label}
            </span>
            <span className="shrink-0 font-bold tabular-nums text-slate-900">
              {s.value}%
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
