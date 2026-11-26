"use client";

import * as React from "react";
import {
  Filter,
  CalendarCheck,
  Clock,
  CalendarDays,
  Cross,
  Umbrella,
  XCircle,
  Briefcase,
  Info,
  Search,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import {
  Card,
  CardBody,
  CardHeader,
  KpiCard,
  StatusBadge,
  InfoRow,
  BlueButton,
} from "../shared/ui";
import { SelectInput, Dash } from "../shared/form";
import {
  RIWAYAT_KEHADIRAN,
  PENGAJUAN_LIST,
} from "../shared/data";
import { cn } from "@/lib/utils";

export function RiwayatKehadiran() {
  const [selectedId, setSelectedId] = React.useState<number>(3);
  const selected = RIWAYAT_KEHADIRAN.find((r) => r.id === selectedId);

  return (
    <div className="space-y-6">
      {/* Filter card */}
      <Card>
        <CardHeader title="Filter Data" icon={Filter} iconColor="blue" />
        <CardBody>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end">
            <div className="flex-1">
              <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-slate-500">
                Periode
              </label>
              <SelectInput
                defaultValue="2026-11"
                options={[
                  { value: "2026-11", label: "November 2026" },
                  { value: "2026-10", label: "Oktober 2026" },
                  { value: "2026-09", label: "September 2026" },
                ]}
              />
            </div>
            <div className="flex-1">
              <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-slate-500">
                Status
              </label>
              <SelectInput
                placeholder="Semua Status"
                options={[
                  { value: "hadir", label: "Hadir" },
                  { value: "terlambat", label: "Terlambat" },
                  { value: "izin", label: "Izin" },
                  { value: "sakit", label: "Sakit" },
                  { value: "cuti", label: "Cuti" },
                  { value: "tidak-hadir", label: "Tidak Hadir" },
                ]}
              />
            </div>
            <BlueButton icon={Search}>Tampilkan</BlueButton>
          </div>
        </CardBody>
      </Card>

      {/* Summary stats */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-4">
        <KpiCard label="Hadir" value={20} unit="Hari" icon={CalendarCheck} tone="green" />
        <KpiCard label="Terlambat" value={2} unit="Hari" icon={Clock} tone="blue" />
        <KpiCard label="Izin" value={1} unit="Hari" icon={CalendarDays} tone="blue" />
        <KpiCard label="Sakit" value={0} unit="Hari" icon={Cross} tone="blue" />
        <KpiCard label="Cuti" value={0} unit="Hari" icon={Umbrella} tone="blue" />
        <KpiCard label="Tidak Hadir" value={1} unit="Hari" icon={XCircle} tone="blue" />
        <KpiCard label="Lembur" value={2} unit="Hari" icon={Briefcase} tone="blue" />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Table - wider */}
        <Card className="lg:col-span-2">
          <CardHeader
            title="Detail Riwayat Kehadiran"
            icon={CalendarCheck}
            iconColor="blue"
            action={
              <span className="text-xs text-slate-500">
                Menampilkan <b className="text-slate-700">1 - 8</b> dari{" "}
                <b className="text-slate-700">20 data</b>
              </span>
            }
          />
          <CardBody className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-blue-600 text-left text-xs font-bold uppercase tracking-wider text-white">
                    <th className="px-4 py-2.5">No</th>
                    <th className="px-4 py-2.5">Tanggal</th>
                    <th className="px-4 py-2.5">Hari</th>
                    <th className="px-4 py-2.5">Jam Masuk</th>
                    <th className="px-4 py-2.5">Jam Pulang</th>
                    <th className="px-4 py-2.5">Masuk Lembur</th>
                    <th className="px-4 py-2.5">Pulang Lembur</th>
                    <th className="px-4 py-2.5 text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {RIWAYAT_KEHADIRAN.map((r, i) => (
                    <tr
                      key={r.id}
                      onClick={() => setSelectedId(r.id)}
                      className={cn(
                        "cursor-pointer transition-colors",
                        selectedId === r.id
                          ? "bg-blue-50"
                          : "hover:bg-slate-50",
                      )}
                    >
                      <td className="px-4 py-3 font-medium text-slate-500">{i + 1}</td>
                      <td className="px-4 py-3 font-bold text-slate-900">
                        {r.tanggal}
                        {r.dikoreksi && (
                          <span className="ml-1.5 rounded bg-amber-100 px-1.5 py-0.5 text-[10px] font-bold text-amber-700">
                            Dikoreksi
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-slate-600">{r.hari}</td>
                      <td className="px-4 py-3 font-medium text-slate-700">
                        {r.jamMasuk ?? <Dash />}
                      </td>
                      <td className="px-4 py-3 font-medium text-slate-700">
                        {r.jamPulang ?? <Dash />}
                      </td>
                      <td className="px-4 py-3 font-medium text-slate-700">
                        {r.jamMasukLembur ?? <Dash />}
                      </td>
                      <td className="px-4 py-3 font-medium text-slate-700">
                        {r.jamPulangLembur ?? <Dash />}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <StatusBadge status={r.status} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {/* Pagination */}
            <div className="flex items-center justify-between border-t border-slate-100 px-4 py-3">
              <span className="text-xs text-slate-500">
                Menampilkan <b className="text-slate-700">1 - 8</b> dari{" "}
                <b className="text-slate-700">20 data</b>
              </span>
              <div className="flex items-center gap-1.5">
                <button className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-500 hover:bg-slate-50">
                  <ChevronLeft className="h-4 w-4" />
                </button>
                <button className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600 text-sm font-bold text-white">
                  1
                </button>
                <button className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 bg-white text-sm font-bold text-slate-600 hover:bg-slate-50">
                  2
                </button>
                <button className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 bg-white text-sm font-bold text-slate-600 hover:bg-slate-50">
                  3
                </button>
                <button className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-500 hover:bg-slate-50">
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          </CardBody>
        </Card>

        {/* Detail card */}
        <Card className="lg:col-span-1">
          <CardHeader title="Detail Kehadiran" icon={Info} iconColor="blue" />
          <CardBody className="divide-y divide-slate-100">
            {selected && (
              <>
                <InfoRow label="Tanggal" value={selected.tanggal} icon={CalendarDays} />
                <InfoRow label="Hari" value={selected.hari} icon={CalendarCheck} />
                <div className="py-2.5">
                  <div className="mb-1.5 text-sm font-semibold text-slate-600">Status</div>
                  <StatusBadge status={selected.status} />
                </div>
                <InfoRow
                  label="Jam Masuk"
                  value={selected.jamMasuk ? `${selected.jamMasuk} WIB` : <Dash />}
                  icon={Clock}
                />
                <InfoRow
                  label="Jam Pulang"
                  value={selected.jamPulang ? `${selected.jamPulang} WIB` : <Dash />}
                  icon={Clock}
                />
                <InfoRow
                  label="Jam Masuk Lembur"
                  value={selected.jamMasukLembur ? `${selected.jamMasukLembur} WIB` : <Dash />}
                  icon={Clock}
                />
                <InfoRow
                  label="Jam Pulang Lembur"
                  value={selected.jamPulangLembur ? `${selected.jamPulangLembur} WIB` : <Dash />}
                  icon={Clock}
                />
                <InfoRow label="Lokasi Absensi" value="Kantor Pusat" icon={Briefcase} />
                <InfoRow label="Jarak dari Lokasi" value="35 meter" icon={Info} />
                {selected.keterangan && (
                  <div className="py-2.5">
                    <div className="mb-1 flex items-center gap-2 text-sm font-semibold text-slate-600">
                      <Info className="h-4 w-4 text-slate-400" />
                      Catatan
                    </div>
                    <p className="text-sm font-medium text-slate-700">
                      {selected.keterangan}
                    </p>
                  </div>
                )}
              </>
            )}
          </CardBody>
        </Card>
      </div>
    </div>
  );
}

export function RiwayatPengajuan() {
  return (
    <div className="space-y-6">
      {/* Summary */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <KpiCard label="Total Pengajuan" value={8} icon={CalendarDays} tone="blue" />
        <KpiCard label="Menunggu" value={5} icon={Clock} tone="amber" />
        <KpiCard label="Disetujui" value={2} icon={CalendarCheck} tone="green" />
        <KpiCard label="Ditolak" value={1} icon={XCircle} tone="red" />
      </div>

      <Card>
        <CardHeader
          title="Daftar Pengajuan"
          icon={Filter}
          iconColor="blue"
          action={
            <div className="flex items-center gap-2">
              <SelectInput
                className="w-40"
                placeholder="Semua Jenis"
                options={[
                  { value: "izin", label: "Izin" },
                  { value: "sakit", label: "Sakit" },
                  { value: "cuti", label: "Cuti" },
                ]}
              />
              <SelectInput
                className="w-40"
                placeholder="Semua Status"
                options={[
                  { value: "pending", label: "Menunggu" },
                  { value: "approved", label: "Disetujui" },
                  { value: "rejected", label: "Ditolak" },
                ]}
              />
            </div>
          }
        />
        <CardBody className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-blue-600 text-left text-xs font-bold uppercase tracking-wider text-white">
                  <th className="px-4 py-2.5">No</th>
                  <th className="px-4 py-2.5">Jenis</th>
                  <th className="px-4 py-2.5">Periode</th>
                  <th className="px-4 py-2.5">Durasi</th>
                  <th className="px-4 py-2.5">Tanggal Pengajuan</th>
                  <th className="px-4 py-2.5 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {PENGAJUAN_LIST.map((p, i) => (
                  <tr key={p.id} className="hover:bg-slate-50">
                    <td className="px-4 py-3 font-medium text-slate-500">{i + 1}</td>
                    <td className="px-4 py-3">
                      <span className="inline-flex items-center gap-1.5 font-bold capitalize text-slate-900">
                        <span
                          className={cn(
                            "flex h-6 w-6 items-center justify-center rounded-lg",
                            p.jenis === "izin"
                              ? "bg-amber-100 text-amber-700"
                              : p.jenis === "sakit"
                                ? "bg-sky-100 text-sky-700"
                                : "bg-teal-100 text-teal-700",
                          )}
                        >
                          {p.jenis === "izin" ? (
                            <CalendarDays className="h-3.5 w-3.5" />
                          ) : p.jenis === "sakit" ? (
                            <Cross className="h-3.5 w-3.5" />
                          ) : (
                            <Umbrella className="h-3.5 w-3.5" />
                          )}
                        </span>
                        {p.jenis}
                      </span>
                    </td>
                    <td className="px-4 py-3 font-medium text-slate-700">{p.periode}</td>
                    <td className="px-4 py-3 text-slate-600">{p.durasiHari} hari</td>
                    <td className="px-4 py-3 text-slate-600">{p.tanggalPengajuan}</td>
                    <td className="px-4 py-3 text-right">
                      <StatusBadge status={p.status} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="flex items-center justify-between border-t border-slate-100 px-4 py-3">
            <span className="text-xs text-slate-500">
              Menampilkan <b className="text-slate-700">1 - 8</b> dari{" "}
              <b className="text-slate-700">8 data</b>
            </span>
            <div className="flex items-center gap-1.5">
              <button className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-500">
                <ChevronLeft className="h-4 w-4" />
              </button>
              <button className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600 text-sm font-bold text-white">
                1
              </button>
              <button className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-500">
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </CardBody>
      </Card>
    </div>
  );
}
