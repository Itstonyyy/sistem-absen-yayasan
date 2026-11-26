"use client";

import * as React from "react";
import {
  CalendarRange,
  Plus,
  PencilLine,
  Trash2,
  CheckCircle2,
  FileText,
  Download,
  Filter,
  Search,
  ChevronLeft,
  ChevronRight,
  MapPin,
  Navigation,
  CalendarDays,
  Clock,
  User,
  Mail,
  Phone,
  Lock,
  Eye,
  EyeOff,
  ShieldCheck,
  Settings,
  Briefcase,
  CalendarCheck,
  ClipboardList,
  Loader2,
} from "lucide-react";
import {
  Card,
  CardBody,
  CardHeader,
  KpiCard,
  OutlineActionButton,
  BlueButton,
  PrimaryButton,
  InfoRow,
  StatusBadge,
} from "../shared/ui";
import { Field, TextInput, TextArea, SelectInput, MapPlaceholder } from "../shared/form";
import { Modal } from "./AbsensiScreen";
import {
  LAPORAN_LIST,
  GPS_POINTS,
  DETAIL_LAPORAN_LIST,
} from "../shared/data";
import { holidayApi, scheduleApi, employeeApi } from "../shared/api";
import type { ScreenId } from "../navigation";
import { cn } from "@/lib/utils";

/* =============== Manajemen Hari Libur - List =============== */

export function HariLiburList({ onNavigate }: { onNavigate?: (s: ScreenId, extras?: { holidayId?: string }) => void }) {
  const [showDelete, setShowDelete] = React.useState<number | null>(null);
  const [holidays, setHolidays] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [jenisFilter, setJenisFilter] = React.useState<'rutin' | 'nasional' | 'khusus' | undefined>(undefined);

  const jenisColor = (j: string) =>
    j === "rutin"
      ? "bg-slate-100 text-slate-700"
      : j === "nasional"
        ? "bg-blue-100 text-blue-700"
        : "bg-teal-100 text-teal-700";

  const fetchHolidays = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await holidayApi.getAll(jenisFilter);
      setHolidays(result.data);
    } catch (err: any) {
      setError(err.message || 'Gagal memuat data hari libur');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await holidayApi.delete(id.toString());
      await fetchHolidays();
    } catch (err: any) {
      // error handling
    }
  };

  const stats = React.useMemo(() => {
    const stats = { nasional: 0, khusus: 0, rutin: 0 };
    holidays.forEach(h => {
      if (h.jenis === 'nasional') stats.nasional++;
      if (h.jenis === 'khusus') stats.khusus++;
      if (h.jenis === 'rutin') stats.rutin++;
    });
    return stats;
  }, [holidays]);

  React.useEffect(() => {
    fetchHolidays();
  }, [jenisFilter]);

  return (
    <div className="space-y-6">
      {showDelete !== null && (
        <Modal onClose={() => setShowDelete(null)}>
          <div className="text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-rose-100">
              <Trash2 className="h-9 w-9 text-rose-600" />
            </div>
            <h3 className="mt-4 text-xl font-extrabold text-slate-900">
              Hapus Hari Libur?
            </h3>
            <p className="mt-1 text-sm text-slate-500">
              Hari libur akan dihapus dari sistem.
            </p>
            <div className="mt-5 flex gap-2">
              <button
                onClick={() => setShowDelete(null)}
                className="flex-1 rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm font-bold text-slate-600"
              >
                Batal
              </button>
              <button
                onClick={() => {
                  handleDelete(showDelete);
                  setShowDelete(null);
                }}
                className="flex-1 rounded-xl bg-rose-600 px-4 py-2.5 text-sm font-bold text-white hover:bg-rose-700"
              >
                Ya, Hapus
              </button>
            </div>
          </div>
        </Modal>
      )}

      {loading && (
        <div className="flex items-center justify-center py-8">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
        </div>
      )}

      {error && (
        <div className="rounded-lg bg-rose-50 p-4 text-sm text-rose-700">
          {error}
        </div>
      )}

      {!loading && !error && (
        <>
          {/* Stats */}
          <div className="grid grid-cols-3 gap-3">
            <KpiCard label="Libur Nasional" value={stats.nasional} icon={CalendarRange} tone="blue" />
            <KpiCard label="Libur Khusus" value={stats.khusus} icon={CalendarRange} tone="teal" />
            <KpiCard label="Libur Rutin" value={stats.rutin} icon={CalendarRange} tone="slate" />
          </div>

          <Card>
            <CardHeader
              title="Daftar Hari Libur"
              icon={CalendarRange}
              iconColor="blue"
              action={
                <div className="flex items-center gap-2">
                  <SelectInput
                    className="w-40"
                    value={jenisFilter}
                    onChange={(val) => setJenisFilter(val as any)}
                    placeholder="Semua Jenis"
                    options={[
                      { value: "", label: "Semua" },
                      { value: "rutin", label: "Rutin" },
                      { value: "nasional", label: "Nasional" },
                      { value: "khusus", label: "Khusus" },
                    ]}
                  />
                  <button
                    onClick={() => onNavigate?.("tambah-hari-libur")}
                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-bold text-white transition-colors hover:bg-blue-700"
                  >
                    <Plus className="h-4 w-4" />
                    Tambah Libur
                  </button>
                </div>
              }
            />
            <CardBody className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-blue-600 text-left text-xs font-bold uppercase tracking-wider text-white">
                      <th className="px-3 py-2.5">No</th>
                      <th className="px-3 py-2.5">Nama Hari Libur</th>
                      <th className="px-3 py-2.5">Tanggal</th>
                      <th className="px-3 py-2.5">Jenis</th>
                      <th className="px-3 py-2.5">Keterangan</th>
                      <th className="px-3 py-2.5 text-right">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {holidays.map((h, i) => (
                      <tr key={h.id} className="hover:bg-slate-50">
                        <td className="px-3 py-3 font-medium text-slate-500">{i + 1}</td>
                        <td className="px-3 py-3 font-bold text-slate-900">{h.nama}</td>
                        <td className="px-3 py-3 text-slate-600">
                          {typeof h.tanggalMulai === 'string' 
                            ? new Date(h.tanggalMulai).toLocaleDateString('id-ID') 
                            : new Date(h.tanggalMulai).toLocaleDateString('id-ID')}
                        </td>
                        <td className="px-3 py-3">
                          <span
                            className={cn(
                              "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-bold capitalize",
                              jenisColor(h.jenis),
                            )}
                          >
                            {h.jenis}
                          </span>
                        </td>
                        <td className="px-3 py-3 text-slate-600">{h.keterangan || '-'}</td>
                        <td className="px-3 py-3">
                          <div className="flex items-center justify-end gap-2">
                            <OutlineActionButton
                              icon={PencilLine}
                              tone="green"
                              onClick={() => onNavigate?.("edit-hari-libur", { holidayId: h.id })}
                            >
                              Edit
                            </OutlineActionButton>
                            <OutlineActionButton
                              icon={Trash2}
                              tone="red"
                              onClick={() => setShowDelete(h.id)}
                            >
                              Hapus
                            </OutlineActionButton>
                          </div>
                        </td>
                      </tr>
                    ))}
                    {holidays.length === 0 && (
                      <tr>
                        <td colSpan={6} className="px-3 py-3 text-center text-slate-500">
                          Tidak ada data hari libur
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </CardBody>
          </Card>
        </>
      )}
    </div>
  );
}

/* =============== Tambah/Edit Hari Libur =============== */

export function HariLiburForm({ mode, onNavigate, holidayId }: { mode: "tambah" | "edit"; onNavigate?: (s: ScreenId, extras?: { holidayId?: string }) => void; holidayId?: string }) {
  const [showSuccess, setShowSuccess] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const isEdit = mode === "edit" && holidayId;

  // Form state
  const [nama, setNama] = React.useState('');
  const [jenis, setJenis] = React.useState<'rutin' | 'nasional' | 'khusus'>('nasional');
  const [tanggalMulai, setTanggalMulai] = React.useState('');
  const [tanggalSelesai, setTanggalSelesai] = React.useState('');
  const [keterangan, setKeterangan] = React.useState('');

  // Fetch holiday data when editing
  React.useEffect(() => {
    if (mode === "edit" && holidayId) {
      let cancelled = false;
      setLoading(true);
      holidayApi
        .getById(holidayId)
        .then((holiday) => {
          if (cancelled || !holiday) return;
          setNama(holiday.nama || "");
          setJenis(holiday.jenis || "nasional");
          setKeterangan(holiday.keterangan || "");
          if (holiday.tanggalMulai) {
            const date = new Date(holiday.tanggalMulai);
            setTanggalMulai(date.toISOString().split("T")[0]);
          }
          if (holiday.tanggalSelesai) {
            const date = new Date(holiday.tanggalSelesai);
            setTanggalSelesai(date.toISOString().split("T")[0]);
          }
        })
        .catch((err: any) => {
          console.error("Gagal memuat data hari libur:", err);
          if (!cancelled) {
            setError(err?.message || "Gagal memuat data hari libur.");
          }
        })
        .finally(() => {
          if (!cancelled) setLoading(false);
        });
      return () => {
        cancelled = true;
      };
    }
  }, [mode, holidayId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (isEdit) {
        // Update existing holiday
        await holidayApi.update(holidayId!, {
          nama,
          jenis,
          tanggalMulai: new Date(tanggalMulai),
          tanggalSelesai: new Date(tanggalSelesai),
          keterangan,
        });
      } else {
        await holidayApi.create({
          nama,
          jenis,
          tanggalMulai: new Date(tanggalMulai),
          tanggalSelesai: new Date(tanggalSelesai),
          keterangan,
        });
      }
      setShowSuccess(true);
    } catch (err: any) {
      setError(err.message || 'Gagal menyimpan hari libur');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {showSuccess && (
        <Modal onClose={() => {
          setShowSuccess(false);
          onNavigate?.("manajemen-hari-libur");
        }}>
          <div className="text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100">
              <CheckCircle2 className="h-9 w-9 text-emerald-600" />
            </div>
            <h3 className="mt-4 text-xl font-extrabold text-slate-900">
              {isEdit ? "Hari Libur Diperbarui!" : "Hari Libur Ditambahkan!"}
            </h3>
            <button
              onClick={() => {
                setShowSuccess(false);
                onNavigate?.("manajemen-hari-libur");
              }}
              className="mt-5 w-full rounded-xl bg-gradient-to-r from-emerald-600 to-green-600 px-4 py-2.5 text-sm font-bold text-white shadow-glow"
            >
              Selesai
            </button>
          </div>
        </Modal>
      )}

      {error && (
        <div className="rounded-lg bg-rose-50 p-4 text-sm text-rose-700">
          {error}
        </div>
      )}

      <div className="mx-auto max-w-2xl">
        <Card>
          <CardHeader
            title={isEdit ? "Edit Hari Libur" : "Tambah Hari Libur"}
            icon={CalendarRange}
            iconColor="blue"
          />
          <CardBody>
            <form onSubmit={handleSubmit} className="space-y-5">
              <Field label="Nama Hari Libur" required>
                <TextInput
                  icon={CalendarRange}
                  value={nama}
                  onChange={(e) => setNama(e.target.value)}
                  placeholder="Contoh: Hari Raya Idul Fitri"
                  required
                />
              </Field>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <Field label="Jenis Libur" required>
                  <SelectInput
                    value={jenis}
                    onChange={(e) => setJenis(e.target.value as any)}
                    options={[
                      { value: "rutin", label: "Rutin (Setiap pekan)" },
                      { value: "nasional", label: "Nasional" },
                      { value: "khusus", label: "Khusus Yayasan" },
                    ]}
                  />
                </Field>
                <Field label="Tanggal Mulai" required>
                  <TextInput icon={CalendarDays} type="date" value={tanggalMulai} onChange={(e) => setTanggalMulai(e.target.value)} required />
                </Field>
              </div>

              <Field label="Tanggal Selesai" required hint="Untuk rutin: pilih hari dalam minggu">
                <TextInput icon={CalendarDays} type="date" value={tanggalSelesai} onChange={(e) => setTanggalSelesai(e.target.value)} required />
              </Field>

              <Field label="Keterangan" hint="Opsional">
                <TextArea
                  rows={3}
                  value={keterangan}
                  onChange={(e) => setKeterangan(e.target.value)}
                  placeholder="Tambahkan keterangan hari libur..."
                />
              </Field>

              <div className="flex flex-col gap-3 pt-2 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  className="rounded-xl border border-slate-300 bg-white px-5 py-3 text-sm font-bold text-slate-600 hover:bg-slate-50"
                  onClick={() => onNavigate?.("manajemen-hari-libur")}
                >
                  Batal
                </button>
                <PrimaryButton icon={CheckCircle2} type="submit" className="sm:w-auto" disabled={loading}>
                  {loading ? "Menyimpan..." : (isEdit ? "Simpan Perubahan" : "Tambah Hari Libur")}
                </PrimaryButton>
              </div>
            </form>
          </CardBody>
        </Card>
      </div>
    </div>
  );
}

/* =============== Laporan Rekap Kehadiran Bulanan =============== */

export function LaporanRekap({ onNavigate }: { onNavigate?: (s: ScreenId) => void }) {
  return (
    <div className="space-y-6">
      {/* Report type selector - same as Detail Laporan page */}
      <Card>
        <CardBody>
          <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:gap-8">
            {/* Jenis Laporan - simple vertical card selector */}
            <div className="lg:w-80 lg:shrink-0 lg:border-r lg:border-slate-200 lg:pr-8">
              <div className="mb-3 flex items-center gap-2">
                <ClipboardList className="h-4 w-4 text-emerald-600" />
                <p className="text-sm font-bold text-slate-700">Pilih Jenis Laporan</p>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {/* Kehadiran Bulanan - selected (current page) */}
                <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border-2 border-emerald-500 bg-emerald-50 p-5 text-center">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white text-emerald-600">
                    <CalendarDays className="h-6 w-6" />
                  </div>
                  <span className="text-sm font-bold leading-tight text-slate-900">
                    Kehadiran Bulanan
                  </span>
                </div>
                {/* Detail Laporan - click to navigate */}
                <button
                  onClick={() => onNavigate?.("detail-laporan")}
                  className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-slate-200 bg-white p-5 text-center transition-colors hover:border-slate-300"
                >
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-slate-50 text-slate-400">
                    <FileText className="h-6 w-6" />
                  </div>
                  <span className="text-sm font-bold leading-tight text-slate-500">
                    Detail Laporan
                  </span>
                </button>
              </div>
            </div>

            {/* Filter Laporan */}
            <div className="flex-1">
              <div className="mb-3 flex items-center gap-2">
                <Filter className="h-4 w-4 text-blue-600" />
                <p className="text-sm font-bold text-slate-700">Filter Laporan</p>
              </div>
              <div className="flex flex-col gap-4 sm:flex-row sm:items-end">
                <div className="flex-1">
                  <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-slate-500">
                    Bulan
                  </label>
                  <SelectInput
                    defaultValue="11"
                    options={[
                      { value: "1", label: "Januari" },
                      { value: "2", label: "Februari" },
                      { value: "3", label: "Maret" },
                      { value: "4", label: "April" },
                      { value: "5", label: "Mei" },
                      { value: "6", label: "Juni" },
                      { value: "7", label: "Juli" },
                      { value: "8", label: "Agustus" },
                      { value: "9", label: "September" },
                      { value: "10", label: "Oktober" },
                      { value: "11", label: "November" },
                      { value: "12", label: "Desember" },
                    ]}
                  />
                </div>
                <div className="flex-1">
                  <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-slate-500">
                    Tahun
                  </label>
                  <SelectInput
                    defaultValue="2026"
                    options={[
                      { value: "2026", label: "2026" },
                      { value: "2025", label: "2025" },
                    ]}
                  />
                </div>
                <button className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-bold text-white transition-colors hover:bg-blue-700">
                  <Search className="h-4 w-4" />
                  Tampilkan
                </button>
                <button className="inline-flex items-center justify-center gap-2 rounded-xl border border-rose-200 bg-white px-5 py-2.5 text-sm font-bold text-rose-600 transition-colors hover:bg-rose-50">
                  <Download className="h-4 w-4" />
                  Ekspor PDF
                </button>
              </div>
            </div>
          </div>
        </CardBody>
      </Card>

      {/* Report header */}
      <Card>
        <CardBody>
          <div className="flex flex-col items-center text-center">
            <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500 to-green-600 text-white shadow-sm">
              <ShieldCheck className="h-6 w-6" />
            </div>
            <h2 className="text-lg font-extrabold text-slate-900">
              Yayasan Al-Maghfirah
            </h2>
            <p className="text-sm font-semibold text-slate-600">
              Laporan Rekap Kehadiran Karyawan
            </p>
            <p className="text-xs text-slate-500">Periode: November 2026</p>
          </div>
        </CardBody>
      </Card>

      {/* Table */}
      <Card>
        <CardHeader
          title="Rekap Kehadiran"
          icon={FileText}
          iconColor="blue"
          action={
            <span className="text-xs text-slate-500">
              Total: <b className="text-slate-700">72 karyawan</b>
            </span>
          }
        />
        <CardBody className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-blue-600 text-left text-xs font-bold uppercase tracking-wider text-white">
                  <th className="px-3 py-2.5">No</th>
                  <th className="px-3 py-2.5">Nama</th>
                  <th className="px-3 py-2.5">NIP</th>
                  <th className="px-3 py-2.5">Jabatan</th>
                  <th className="px-3 py-2.5 text-center">Hadir</th>
                  <th className="px-3 py-2.5 text-center">Terlambat</th>
                  <th className="px-3 py-2.5 text-center">T. Hadir</th>
                  <th className="px-3 py-2.5 text-center">Izin</th>
                  <th className="px-3 py-2.5 text-center">Sakit</th>
                  <th className="px-3 py-2.5 text-center">Cuti</th>
                  <th className="px-3 py-2.5 text-center">Lembur</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {LAPORAN_LIST.map((l, i) => (
                  <tr key={l.id} className="hover:bg-slate-50">
                    <td className="px-3 py-3 font-medium text-slate-500">{i + 1}</td>
                    <td className="px-3 py-3 font-bold text-slate-900">{l.nama}</td>
                    <td className="px-3 py-3 text-slate-600">{l.nip}</td>
                    <td className="px-3 py-3 text-slate-600">{l.jabatan}</td>
                    <td className="px-3 py-3 text-center font-bold text-emerald-700">{l.hadir}</td>
                    <td className="px-3 py-3 text-center font-bold text-amber-700">{l.terlambat}</td>
                    <td className="px-3 py-3 text-center font-bold text-rose-700">{l.tidakHadir}</td>
                    <td className="px-3 py-3 text-center text-slate-700">{l.izin}</td>
                    <td className="px-3 py-3 text-center text-slate-700">{l.sakit}</td>
                    <td className="px-3 py-3 text-center text-slate-700">{l.cuti}</td>
                    <td className="px-3 py-3 text-center font-bold text-blue-700">{l.lembur}j</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="flex items-center justify-between border-t border-slate-100 px-4 py-3">
            <span className="text-xs text-slate-500">
              Dicetak: 09 Nov 2026, 08:45 WIB
            </span>
            <div className="flex items-center gap-1.5">
              <button className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-500">
                <ChevronLeft className="h-4 w-4" />
              </button>
              <button className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600 text-sm font-bold text-white">
                1
              </button>
              <button className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 bg-white text-sm font-bold text-slate-600">
                2
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

/* =============== Pengaturan Lokasi GPS =============== */

export function GpsList({ onNavigate }: { onNavigate?: (s: ScreenId) => void }) {
  const [showDelete, setShowDelete] = React.useState<number | null>(null);

  return (
    <div className="space-y-6">
      {showDelete !== null && (
        <Modal onClose={() => setShowDelete(null)}>
          <div className="text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-rose-100">
              <Trash2 className="h-9 w-9 text-rose-600" />
            </div>
            <h3 className="mt-4 text-xl font-extrabold text-slate-900">
              Hapus Titik GPS?
            </h3>
            <p className="mt-1 text-sm text-slate-500">
              Titik GPS akan dihapus. Data absensi historis tetap menyimpan snapshot
              koordinat.
            </p>
            <div className="mt-5 flex gap-2">
              <button
                onClick={() => setShowDelete(null)}
                className="flex-1 rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm font-bold text-slate-600"
              >
                Batal
              </button>
              <button
                onClick={() => setShowDelete(null)}
                className="flex-1 rounded-xl bg-rose-600 px-4 py-2.5 text-sm font-bold text-white hover:bg-rose-700"
              >
                Ya, Hapus
              </button>
            </div>
          </div>
        </Modal>
      )}

      <Card>
        <CardHeader
          title="Daftar Titik Lokasi GPS"
          icon={MapPin}
          iconColor="green"
          action={
            <button
              onClick={() => onNavigate?.("tambah-lokasi-gps")}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-bold text-white transition-colors hover:bg-blue-700"
            >
              <Plus className="h-4 w-4" />
              Tambah Lokasi
            </button>
          }
        />
        <CardBody className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-blue-600 text-left text-xs font-bold uppercase tracking-wider text-white">
                  <th className="px-3 py-2.5">No</th>
                  <th className="px-3 py-2.5">Nama Lokasi</th>
                  <th className="px-3 py-2.5">Latitude</th>
                  <th className="px-3 py-2.5">Longitude</th>
                  <th className="px-3 py-2.5">Radius</th>
                  <th className="px-3 py-2.5">Status</th>
                  <th className="px-3 py-2.5 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {GPS_POINTS.map((g, i) => (
                  <tr key={g.id} className="hover:bg-slate-50">
                    <td className="px-3 py-3 font-medium text-slate-500">{i + 1}</td>
                    <td className="px-3 py-3 font-bold text-slate-900">{g.nama}</td>
                    <td className="px-3 py-3 text-slate-600">{g.latitude}</td>
                    <td className="px-3 py-3 text-slate-600">{g.longitude}</td>
                    <td className="px-3 py-3 text-slate-600">{g.radius} m</td>
                    <td className="px-3 py-3">
                      <StatusBadge status={g.status === "aktif" ? "approved" : "rejected"} />
                    </td>
                    <td className="px-3 py-3">
                      <div className="flex items-center justify-end gap-2">
                        <OutlineActionButton
                          icon={PencilLine}
                          tone="green"
                          onClick={() => onNavigate?.("edit-lokasi-gps")}
                        >
                          Edit
                        </OutlineActionButton>
                        <OutlineActionButton
                          icon={Trash2}
                          tone="red"
                          onClick={() => setShowDelete(g.id)}
                        >
                          Hapus
                        </OutlineActionButton>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardBody>
      </Card>
    </div>
  );
}

export function GpsForm({ mode }: { mode: "tambah" | "edit" }) {
  const [showSuccess, setShowSuccess] = React.useState(false);
  const isEdit = mode === "edit";
  const [coords, setCoords] = React.useState<{ lat: string; lng: string } | null>(null);
  const [detecting, setDetecting] = React.useState(false);
  const [detectError, setDetectError] = React.useState<string | null>(null);

  const detectLocation = () => {
    setDetecting(true);
    setDetectError(null);
    if (typeof navigator === "undefined" || !navigator.geolocation) {
      setDetectError("Geolokasi tidak didukung browser ini.");
      setDetecting(false);
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setCoords({
          lat: pos.coords.latitude.toFixed(7),
          lng: pos.coords.longitude.toFixed(7),
        });
        setDetecting(false);
      },
      (err) => {
        setDetectError(
          err.code === err.PERMISSION_DENIED
            ? "Akses lokasi ditolak. Izinkan akses lokasi pada browser."
            : "Gagal mendeteksi lokasi. Pastikan GPS aktif.",
        );
        setDetecting(false);
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 },
    );
  };

  return (
    <div className="space-y-6">
      {showSuccess && (
        <Modal onClose={() => setShowSuccess(false)}>
          <div className="text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100">
              <CheckCircle2 className="h-9 w-9 text-emerald-600" />
            </div>
            <h3 className="mt-4 text-xl font-extrabold text-slate-900">
              {isEdit ? "Lokasi Diperbarui!" : "Lokasi Ditambahkan!"}
            </h3>
            <button
              onClick={() => setShowSuccess(false)}
              className="mt-5 w-full rounded-xl bg-gradient-to-r from-emerald-600 to-green-600 px-4 py-2.5 text-sm font-bold text-white shadow-glow"
            >
              Selesai
            </button>
          </div>
        </Modal>
      )}

      <div className="mx-auto max-w-4xl">
        <Card>
          <CardHeader
            title={isEdit ? "Edit Lokasi GPS" : "Tambah Lokasi GPS"}
            icon={MapPin}
            iconColor="green"
          />
          <CardBody>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                setShowSuccess(true);
              }}
              className="space-y-5"
            >
              {/* Deteksi Lokasi Terkini - only on tambah mode */}
              {!isEdit && (
                <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-emerald-600 shadow-sm">
                        <Navigation className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-slate-900">
                          Deteksi Lokasi Terkini
                        </p>
                        <p className="text-xs text-slate-600">
                          Ambil koordinat GPS perangkat secara otomatis tanpa input manual.
                        </p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={detectLocation}
                      disabled={detecting}
                      className={cn(
                        "inline-flex items-center justify-center gap-2 rounded-xl px-5 py-2.5 text-sm font-bold transition-colors",
                        detecting
                          ? "cursor-not-allowed bg-slate-300 text-slate-500"
                          : "bg-emerald-600 text-white hover:bg-emerald-700",
                      )}
                    >
                      <Navigation className="h-4 w-4" />
                      {detecting ? "Mendeteksi..." : "Deteksi Lokasi"}
                    </button>
                  </div>
                  {detectError && (
                    <p className="mt-3 rounded-lg bg-rose-100 px-3 py-2 text-xs font-semibold text-rose-700">
                      {detectError}
                    </p>
                  )}
                  {coords && (
                    <p className="mt-3 rounded-lg bg-white px-3 py-2 text-xs font-semibold text-emerald-700">
                      Lokasi terdeteksi - Latitude: {coords.lat}, Longitude: {coords.lng}
                    </p>
                  )}
                </div>
              )}

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <Field label="Nama Lokasi" required>
                  <TextInput
                    icon={MapPin}
                    defaultValue={isEdit ? "Kantor Pusat" : ""}
                    placeholder="Contoh: Kantor Pusat"
                    required
                  />
                </Field>
                <Field label="Radius (meter)" required>
                  <TextInput
                    icon={Navigation}
                    type="number"
                    defaultValue={isEdit ? "100" : "100"}
                    required
                  />
                </Field>
                <Field label="Latitude" required hint="Rentang -90 hingga 90">
                  <TextInput
                    icon={Navigation}
                    defaultValue={isEdit ? "-6.2087634" : coords?.lat ?? ""}
                    placeholder="-6.2087634"
                    required
                  />
                </Field>
                <Field label="Longitude" required hint="Rentang -180 hingga 180">
                  <TextInput
                    icon={Navigation}
                    defaultValue={isEdit ? "106.8455984" : coords?.lng ?? ""}
                    placeholder="106.8455984"
                    required
                  />
                </Field>
              </div>

              {/* Map picker */}
              <Field label="Pilih di Peta" hint="Klik peta untuk menentukan titik">
                <MapPlaceholder />
              </Field>

              <div className="flex flex-col gap-3 pt-2 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  className="rounded-xl border border-slate-300 bg-white px-5 py-3 text-sm font-bold text-slate-600 hover:bg-slate-50"
                >
                  Batal
                </button>
                <PrimaryButton icon={CheckCircle2} type="submit" className="sm:w-auto">
                  {isEdit ? "Simpan Perubahan" : "Tambah Lokasi"}
                </PrimaryButton>
              </div>
            </form>
          </CardBody>
        </Card>
      </div>
    </div>
  );
}

/* =============== Daftar Jadwal Kerja =============== */

export function JadwalKerjaList({ onNavigate }: { onNavigate?: (s: ScreenId, extras?: { scheduleId?: string }) => void }) {
  const [schedules, setSchedules] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [employeeList, setEmployeeList] = React.useState<any[]>([]);
  const [showDeleteModal, setShowDeleteModal] = React.useState<string | null>(null);

  const fetchSchedules = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await scheduleApi.getAll();
      setSchedules(result.data || []);
    } catch (err: any) {
      setError(err.message || 'Gagal memuat data jadwal kerja');
    } finally {
      setLoading(false);
    }
  };

  const fetchEmployees = async () => {
    try {
      const result = await employeeApi.getAll();
      setEmployeeList(result.data || []);
    } catch (err: any) {
      // fallback to empty list
    }
  };

  const getEmployeeInfo = (schedule: any) => {
    // First check if schedule has employee data included (from API with include)
    if (schedule.employee) {
      return {
        nama: schedule.employee.name || '-',
        nip: schedule.employee.nip || '-',
        jabatan: schedule.employee.jabatan || '-',
      };
    }
    // Otherwise lookup from employee list
    if (schedule.employeeId) {
      const emp = employeeList.find(e => e.id === schedule.employeeId);
      return emp || { nama: schedule.namaJadwal || 'Unknown', nip: '-', jabatan: '-' };
    }
    return { nama: schedule.namaJadwal || 'Default Schedule', nip: '-', jabatan: 'Default' };
  };

  const handleDelete = async (scheduleId: string) => {
    try {
      await scheduleApi.delete(scheduleId);
      fetchSchedules();
      setShowDeleteModal(null);
    } catch (err: any) {
      setError(err.message || 'Gagal menghapus jadwal kerja');
    }
  };

  React.useEffect(() => {
    fetchSchedules();
    fetchEmployees();
  }, []);

  return (
    <div className="space-y-6">
      {loading && (
        <div className="flex items-center justify-center py-8">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
        </div>
      )}

      {error && (
        <div className="rounded-lg bg-rose-50 p-4 text-sm text-rose-700">
          {error}
        </div>
      )}

      {!loading && !error && (
        <Card>
          <CardHeader
            title="Daftar Jadwal Kerja Karyawan"
            icon={Clock}
            iconColor="blue"
            action={
              <button
                onClick={() => onNavigate?.("tambah-jadwal-kerja")}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-bold text-white transition-colors hover:bg-blue-700"
              >
                <Plus className="h-4 w-4" />
                Tambah Jadwal
              </button>
            }
          />
          <CardBody className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-blue-600 text-left text-xs font-bold uppercase tracking-wider text-white">
                    <th className="px-3 py-2.5">No</th>
                    <th className="px-3 py-2.5">Nama</th>
                    <th className="px-3 py-2.5">NIP</th>
                    <th className="px-3 py-2.5">Jabatan</th>
                    <th className="px-3 py-2.5">Jam Masuk</th>
                    <th className="px-3 py-2.5">Jam Pulang</th>
                    <th className="px-3 py-2.5">Hari Kerja</th>
                    <th className="px-3 py-2.5 text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {schedules.map((j, i) => {
                    // Get employee data from single employee relation
                    const emp = j.employee || { name: '-', nip: '-', jabatan: '-' };
                    
                    return (
                      <tr key={j.id} className="hover:bg-slate-50">
                        <td className="px-3 py-3 font-medium text-slate-500">{i + 1}</td>
                        <td className="px-3 py-3 font-bold text-slate-900">{emp.name || '-'}</td>
                        <td className="px-3 py-3 text-slate-600">{emp.nip || '-'}</td>
                        <td className="px-3 py-3 text-slate-600">{emp.jabatan || '-'}</td>
                        <td className="px-3 py-3 font-medium text-slate-700">{j.jamMasuk}</td>
                        <td className="px-3 py-3 font-medium text-slate-700">{j.jamPulang}</td>
                        <td className="px-3 py-3 text-slate-600">{j.hariKerja || '-'}</td>
                        <td className="px-3 py-3">
                          <div className="flex items-center justify-end gap-2">
                            <OutlineActionButton icon={PencilLine} tone="green" onClick={() => onNavigate?.("edit-jadwal-kerja", { scheduleId: j.id })}>
                              Edit
                            </OutlineActionButton>
                            <OutlineActionButton
                              icon={Trash2}
                              tone="red"
                              onClick={() => setShowDeleteModal(j.id)}
                              className="ml-2"
                            >
                              Hapus
                            </OutlineActionButton>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                  {schedules.length === 0 && (
                    <tr>
                      <td colSpan={8} className="px-3 py-3 text-center text-slate-500">
                        Tidak ada data jadwal kerja
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </CardBody>
        </Card>
      )}
      {showDeleteModal && (
        <Modal onClose={() => setShowDeleteModal(null)}>
          <div className="text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-rose-100">
              <Trash2 className="h-9 w-9 text-rose-600" />
            </div>
            <h3 className="mt-4 text-xl font-extrabold text-slate-900">
              Yakin hapus jadwal kerja ini?
            </h3>
            <p className="mt-2 text-sm text-slate-500">
              Aksi ini tidak dapat dibatalkan.
            </p>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-end">
              <button
                onClick={() => setShowDeleteModal(null)}
                className="rounded-xl border border-slate-300 bg-white px-5 py-2.5 text-sm font-bold text-slate-600 hover:bg-slate-50"
              >
                Batal
              </button>
              <button
                onClick={async () => {
                  const schedule = schedules.find(s => s.id === showDeleteModal);
                  if (schedule) {
                    try {
                      await scheduleApi.delete(schedule.id);
                      fetchSchedules();
                    } catch (err: any) {
                      setError(err.message || 'Gagal menghapus jadwal kerja');
                    }
                  }
                  setShowDeleteModal(null);
                }}
                className="rounded-xl bg-rose-600 px-5 py-2.5 text-sm font-bold text-white hover:bg-rose-700"
              >
                Hapus
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}

export function JadwalKerjaForm({ mode, onNavigate, scheduleId }: { mode: "tambah" | "default" | "edit"; onNavigate?: (s: ScreenId) => void; scheduleId?: string }) {
  const [showSuccess, setShowSuccess] = React.useState(false);
  const [submitLoading, setSubmitLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [isEdit, setIsEdit] = React.useState(mode === "edit" || !!scheduleId);
  const isDefault = mode === "default";

  // Form state
  const [employees, setEmployees] = React.useState<{ id: string; nama: string; nip: string }[]>([]);
  const [selectedEmployee, setSelectedEmployee] = React.useState<string>('');
  const [namaJadwal, setNamaJadwal] = React.useState('');
  const [jamMasuk, setJamMasuk] = React.useState('08:00');
  const [jamPulang, setJamPulang] = React.useState('17:00');
  const [hariKerja, setHariKerja] = React.useState('Senin - Jumat');
  const [toleransiTerlambat, setToleransiTerlambat] = React.useState(15);
  const [checkedHari, setCheckedHari] = React.useState<{ [key: number]: boolean }>({
    1: true, 2: true, 3: true, 4: true, 5: true, 6: false, 7: false,
  });

  // Fetch employees from API
  React.useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const result = await employeeApi.getAll();
        setEmployees(result.data?.map((e: any) => ({
          id: e.id,
          nama: e.name || e.nama || '-',
          nip: e.nip || '-',
        })) || []);
      } catch (err: any) {
        setError(err.message || 'Gagal memuat data karyawan');
      }
    };
    if (!isDefault) {
      fetchEmployees();
    }
  }, [isDefault]);

  // Fetch schedule for editing (with loading state)
  React.useEffect(() => {
    if (isEdit && scheduleId) {
      scheduleApi.getById(scheduleId).then((schedule: any) => {
        if (schedule) {
          setNamaJadwal(schedule.namaJadwal || '');
          setJamMasuk(schedule.jamMasuk || '08:00');
          setJamPulang(schedule.jamPulang || '17:00');
          setHariKerja(schedule.hariKerja || 'Senin - Jumat');
          setToleransiTerlambat(schedule.toleransiTerlambat || 15);
          // Get employee ID from schedule.employee
          setSelectedEmployee(schedule.employee?.id || schedule.employeeId || '');
          // Set checked hari based on hariKerja
          const hariParts = schedule.hariKerja?.split(' - ') || ['Senin', 'Jumat'];
          const hariMap: { [key: string]: number } = { 'Senin': 1, 'Selasa': 2, 'Rabu': 3, 'Kamis': 4, 'Jumat': 5, 'Sabtu': 6, 'Minggu': 7 };
          const newChecked = { 1: false, 2: false, 3: false, 4: false, 5: false, 6: false, 7: false };
          hariParts.forEach((hari: string) => {
            const dayIndex = hariMap[hari];
            if (dayIndex) newChecked[dayIndex] = true;
          });
          setCheckedHari(newChecked);
        }
      }).catch((err: any) => {
        setError(err.message || 'Gagal memuat data jadwal kerja');
      });
    }
  }, [isEdit, scheduleId]);

  // Sync hariKerja display with checkedHari
  React.useEffect(() => {
    const hariNames = ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu', 'Minggu'];
    const activeDays = Object.entries(checkedHari)
      .filter(([_, v]) => v)
      .map(([k]) => hariNames[parseInt(k) - 1]);
    setHariKerja(activeDays.join(' - ') || 'Senin - Jumat');
  }, [checkedHari]);

  const handleHariChange = (dayIndex: number) => {
    setCheckedHari((prev) => ({
      ...prev,
      [dayIndex]: !prev[dayIndex],
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitLoading(true);
    setError(null);

    try {
      if (isDefault) {
        // Set default schedule (using hardcoded ID for now, would need to fetch)
        await scheduleApi.setDefault('default-schedule-id', true);
      } else if (isEdit && scheduleId) {
        // Edit existing schedule
        await scheduleApi.update(scheduleId, {
          namaJadwal,
          jamMasuk,
          jamPulang,
          hariKerja,
          toleransiTerlambat,
          employeeId: selectedEmployee || undefined,
        });
      } else {
        if (!selectedEmployee || !namaJadwal.trim()) {
          throw new Error('Nama jadwal dan karyawan harus diisi');
        }

        await scheduleApi.create({
          employeeId: selectedEmployee,
          namaJadwal,
          jamMasuk,
          jamPulang,
          hariKerja,
          toleransiTerlambat,
        });
      }
      setShowSuccess(true);
    } catch (err: any) {
      setError(err.message || 'Gagal menyimpan jadwal kerja');
    } finally {
      setSubmitLoading(false);
    }
  };

  const handleHariClick = (hariIndex: number) => {
    handleHariChange(hariIndex);
  };

  return (
    <div className="space-y-6">
      {showSuccess && (
        <Modal onClose={() => {
          setShowSuccess(false);
          onNavigate?.('daftar-jadwal-kerja');
        }}>
          <div className="text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100">
              <CheckCircle2 className="h-9 w-9 text-emerald-600" />
            </div>
            <h3 className="mt-4 text-xl font-extrabold text-slate-900">
              {isDefault ? "Jadwal Default Disimpan!" : (isEdit ? "Jadwal Kerja Diperbarui!" : "Jadwal Kerja Disimpan!")}
            </h3>
            <button
              onClick={() => {
                setShowSuccess(false);
                onNavigate?.('daftar-jadwal-kerja');
              }}
              className="mt-5 w-full rounded-xl bg-gradient-to-r from-emerald-600 to-green-600 px-4 py-2.5 text-sm font-bold text-white shadow-glow"
            >
              Selesai
            </button>
          </div>
        </Modal>
      )}

      {error && (
        <div className="rounded-lg bg-rose-50 p-4 text-sm text-rose-700">
          {error}
        </div>
      )}

      <div className="mx-auto max-w-2xl">
        <Card>
          <CardHeader
            title={isDefault ? "Set Default Schedule" : (isEdit ? "Edit Jadwal Kerja" : "Tambah Jadwal Kerja")}
            icon={Clock}
            iconColor="blue"
          />
          <CardBody>
            <form onSubmit={handleSubmit} className="space-y-5">
              {!isDefault && (
                <>
                  <Field label="Nama Jadwal" required>
                    <TextInput
                      icon={User}
                      value={namaJadwal}
                      onChange={(e) => setNamaJadwal(e.target.value)}
                      placeholder="Contoh: Jadwal Reguler"
                      required
                    />
                  </Field>

                  <Field label="Karyawan" required>
                    <SelectInput
                      value={selectedEmployee}
                      onChange={(e) => setSelectedEmployee(e.target.value)}
                      placeholder="Pilih karyawan"
                      options={
                        employees.map(emp => ({
                          value: emp.id,
                          label: `${emp.nama} - ${emp.nip}`,
                        }))
                      }
                      required
                    />
                  </Field>
                </>
              )}

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <Field label="Jam Masuk" required>
                  <TextInput icon={Clock} type="time" value={jamMasuk} onChange={(e) => setJamMasuk(e.target.value)} required />
                </Field>
                <Field label="Jam Pulang" required>
                  <TextInput icon={Clock} type="time" value={jamPulang} onChange={(e) => setJamPulang(e.target.value)} required />
                </Field>
              </div>

              {isDefault ? (
                <div className="rounded-xl bg-blue-50 p-3 text-sm">
                  <p className="font-bold text-blue-800">Hari Kerja Default</p>
                  <p className="mt-1 text-xs text-blue-700">
                    Senin, Selasa, Rabu, Kamis, Jumat (dapat diubah Admin). Sabtu &amp;
                    Minggu = Hari Libur Rutin.
                  </p>
                </div>
              ) : (
                <Field label="Hari Kerja" required>
                  <div className="grid grid-cols-7 gap-1.5">
                    {['Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab', 'Min'].map((h, i) => (
                      <button
                        key={h}
                        type="button"
                        onClick={() => handleHariClick(i + 1)}
                        className={cn(
                          'flex h-10 items-center justify-center rounded-lg border text-xs font-bold transition-colors',
                          checkedHari[i + 1]
                            ? 'bg-emerald-500 text-white border-emerald-500'
                            : 'border-slate-200 bg-white text-slate-500 hover:bg-slate-100'
                        )}
                      >
                        {h}
                      </button>
                    ))}
                  </div>
                  <p className="mt-1 text-xs text-slate-500">
                    Pilih: {Object.entries(checkedHari).filter(([_, v]) => v).map(([k]) => ['Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab', 'Min'][parseInt(k) - 1]).join(', ') || 'Tidak ada hari'}
                  </p>
                  <p className="text-xs text-slate-400">Hari kerja: {hariKerja}</p>
                </Field>
              )}

              <div className="flex flex-col gap-3 pt-2 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  className="rounded-xl border border-slate-300 bg-white px-5 py-3 text-sm font-bold text-slate-600 hover:bg-slate-50"
                  onClick={() => onNavigate?.('daftar-jadwal-kerja')}
                >
                  Batal
                </button>
                <PrimaryButton icon={CheckCircle2} type="submit" className="sm:w-auto" disabled={submitLoading}>
                  {submitLoading ? 'Menyimpan...' : 'Simpan'}
                </PrimaryButton>
              </div>
            </form>
          </CardBody>
        </Card>
      </div>
    </div>
  );
}

/* =============== Pengaturan Akun Admin & Ubah Password Admin =============== */

export function PengaturanAkunAdmin() {
  const [showSuccess, setShowSuccess] = React.useState(false);

  return (
    <div className="space-y-6">
      {showSuccess && (
        <Modal onClose={() => setShowSuccess(false)}>
          <div className="text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100">
              <CheckCircle2 className="h-9 w-9 text-emerald-600" />
            </div>
            <h3 className="mt-4 text-xl font-extrabold text-slate-900">
              Profil Admin Diperbarui!
            </h3>
            <button
              onClick={() => setShowSuccess(false)}
              className="mt-5 w-full rounded-xl bg-gradient-to-r from-emerald-600 to-green-600 px-4 py-2.5 text-sm font-bold text-white shadow-glow"
            >
              Selesai
            </button>
          </div>
        </Modal>
      )}

      <div className="mx-auto max-w-3xl">
        <Card>
          <CardHeader title="Pengaturan Akun Admin" icon={Settings} iconColor="blue" />
          <CardBody>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                setShowSuccess(true);
              }}
              className="space-y-5"
            >
              <div className="flex items-center gap-4 rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-blue-700 text-white shadow-md">
                  <User className="h-7 w-7" />
                </div>
                <div>
                  <p className="text-lg font-extrabold text-slate-900">Admin Pusat</p>
                  <p className="text-sm text-slate-500">Administrator</p>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <Field label="Nama Lengkap" required>
                  <TextInput icon={User} defaultValue="Admin Pusat" required />
                </Field>
                <Field label="Email" required hint="Unik, format valid">
                  <TextInput icon={Mail} type="email" defaultValue="admin@almaghfirah.or.id" required />
                </Field>
                <Field label="No. Telepon">
                  <TextInput icon={Phone} defaultValue="0811 0000 0000" />
                </Field>
              </div>

              <div className="flex flex-col gap-3 pt-2 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  className="rounded-xl border border-slate-300 bg-white px-5 py-3 text-sm font-bold text-slate-600 hover:bg-slate-50"
                >
                  Batal
                </button>
                <PrimaryButton icon={CheckCircle2} type="submit" className="sm:w-auto">
                  Simpan Perubahan
                </PrimaryButton>
              </div>
            </form>
          </CardBody>
        </Card>
      </div>
    </div>
  );
}

export function UbahPasswordAdmin() {
  const [showOld, setShowOld] = React.useState(false);
  const [showNew, setShowNew] = React.useState(false);
  const [showConfirm, setShowConfirm] = React.useState(false);
  const [showSuccess, setShowSuccess] = React.useState(false);

  return (
    <div className="space-y-6">
      {showSuccess && (
        <Modal onClose={() => setShowSuccess(false)}>
          <div className="text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100">
              <CheckCircle2 className="h-9 w-9 text-emerald-600" />
            </div>
            <h3 className="mt-4 text-xl font-extrabold text-slate-900">
              Password Admin Berhasil Diubah!
            </h3>
            <button
              onClick={() => setShowSuccess(false)}
              className="mt-5 w-full rounded-xl bg-gradient-to-r from-emerald-600 to-green-600 px-4 py-2.5 text-sm font-bold text-white shadow-glow"
            >
              Selesai
            </button>
          </div>
        </Modal>
      )}

      <div className="mx-auto max-w-2xl">
        <div className="mb-5 flex items-start gap-3 rounded-2xl border border-amber-200 bg-amber-50 p-4">
          <ShieldCheck className="h-5 w-5 shrink-0 text-amber-600" />
          <div className="text-sm">
            <p className="font-bold text-amber-900">Tips Keamanan Password Admin</p>
            <ul className="mt-1 space-y-0.5 text-xs text-amber-800">
              <li>&bull; Minimal 8 karakter, kombinasi huruf dan angka</li>
              <li>&bull; Admin wajib ganti password secara berkala</li>
              <li>&bull; Aktivitas perubahan tercatat di audit log</li>
            </ul>
          </div>
        </div>

        <Card>
          <CardHeader title="Ubah Password Admin" icon={Lock} iconColor="blue" />
          <CardBody>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                setShowSuccess(true);
              }}
              className="space-y-5"
            >
              <Field label="Password Lama" required>
                <div className="relative">
                  <TextInput icon={Lock} type={showOld ? "text" : "password"} placeholder="Masukkan password lama" required />
                  <button type="button" onClick={() => setShowOld((s) => !s)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                    {showOld ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
              </Field>

              <Field label="Password Baru" required hint="Min. 8 karakter, kombinasi huruf & angka">
                <div className="relative">
                  <TextInput icon={Lock} type={showNew ? "text" : "password"} placeholder="Masukkan password baru" required />
                  <button type="button" onClick={() => setShowNew((s) => !s)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                    {showNew ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
              </Field>

              <Field label="Konfirmasi Password Baru" required>
                <div className="relative">
                  <TextInput icon={Lock} type={showConfirm ? "text" : "password"} placeholder="Ulangi password baru" required />
                  <button type="button" onClick={() => setShowConfirm((s) => !s)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                    {showConfirm ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
              </Field>

              <div className="flex flex-col gap-3 pt-2 sm:flex-row sm:justify-end">
                <button type="button" className="rounded-xl border border-slate-300 bg-white px-5 py-3 text-sm font-bold text-slate-600 hover:bg-slate-50">
                  Batal
                </button>
                <PrimaryButton icon={CheckCircle2} type="submit" className="sm:w-auto">
                  Simpan Password Baru
                </PrimaryButton>
              </div>
            </form>
          </CardBody>
        </Card>
      </div>
    </div>
  );
}

/* =============== Detail Laporan Perkaryawan =============== */

export function DetailLaporanPerkaryawan({
  onNavigate,
}: {
  onNavigate?: (s: ScreenId) => void;
}) {
  return (
    <div className="space-y-6">
      {/* Report type + filter card */}
      <Card>
        <CardBody>
          <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:gap-8">
            {/* Jenis Laporan - simple vertical card selector */}
            <div className="lg:w-80 lg:shrink-0 lg:border-r lg:border-slate-200 lg:pr-8">
              <div className="mb-3 flex items-center gap-2">
                <ClipboardList className="h-4 w-4 text-emerald-600" />
                <p className="text-sm font-bold text-slate-700">Pilih Jenis Laporan</p>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {/* Kehadiran Bulanan - click to navigate */}
                <button
                  onClick={() => onNavigate?.("laporan-rekap")}
                  className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-slate-200 bg-white p-5 text-center transition-colors hover:border-slate-300"
                >
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-slate-50 text-slate-400">
                    <CalendarDays className="h-6 w-6" />
                  </div>
                  <span className="text-sm font-bold leading-tight text-slate-500">
                    Kehadiran Bulanan
                  </span>
                </button>
                {/* Detail Laporan - selected (current page) */}
                <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border-2 border-emerald-500 bg-emerald-50 p-5 text-center">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white text-emerald-600">
                    <FileText className="h-6 w-6" />
                  </div>
                  <span className="text-sm font-bold leading-tight text-slate-900">
                    Detail Laporan
                  </span>
                </div>
              </div>
            </div>

            {/* Filter Laporan */}
            <div className="flex-1">
              <div className="mb-3 flex items-center gap-2">
                <Filter className="h-4 w-4 text-blue-600" />
                <p className="text-sm font-bold text-slate-700">Filter Laporan</p>
              </div>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                <Field label="Karyawan">
                  <SelectInput
                    defaultValue="1"
                    options={[
                      { value: "1", label: "Arif Fatoni - YAM-0001" },
                      { value: "2", label: "Naila Nasywa - YAM-0002" },
                      { value: "3", label: "Reza Evriansyah - YAM-0003" },
                      { value: "4", label: "Ramadhan - YAM-0004" },
                      { value: "5", label: "Intan Maulida - YAM-0005" },
                    ]}
                  />
                </Field>
                <Field label="Bulan" required>
                  <SelectInput
                    defaultValue="11"
                    options={[
                      { value: "1", label: "Januari" },
                      { value: "2", label: "Februari" },
                      { value: "3", label: "Maret" },
                      { value: "4", label: "April" },
                      { value: "5", label: "Mei" },
                      { value: "6", label: "Juni" },
                      { value: "7", label: "Juli" },
                      { value: "8", label: "Agustus" },
                      { value: "9", label: "September" },
                      { value: "10", label: "Oktober" },
                      { value: "11", label: "November" },
                      { value: "12", label: "Desember" },
                    ]}
                  />
                </Field>
                <Field label="Tahun" required>
                  <SelectInput
                    defaultValue="2026"
                    options={[
                      { value: "2026", label: "2026" },
                      { value: "2025", label: "2025" },
                    ]}
                  />
                </Field>
              </div>
              <div className="mt-4 flex justify-end">
                <button
                  type="button"
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-5 py-2.5 text-sm font-bold text-white transition-colors hover:bg-emerald-700"
                >
                  <Search className="h-4 w-4" />
                  Tampilkan Laporan
                </button>
              </div>
            </div>
          </div>
        </CardBody>
      </Card>

      {/* Detail table card */}
      <Card>
        <CardHeader
          title="Rincian Kehadiran - November 2026"
          subtitle="Arif Fatoni - YAM-0001 - Staf Program"
          icon={CalendarCheck}
          iconColor="green"
          action={
            <button className="inline-flex items-center justify-center gap-2 rounded-xl border border-emerald-200 bg-white px-4 py-2 text-sm font-bold text-emerald-700 transition-colors hover:bg-emerald-50">
              <Download className="h-4 w-4" />
              Ekspor PDF
            </button>
          }
        />
        <CardBody className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-blue-600 text-left text-xs font-bold uppercase tracking-wider text-white">
                  <th className="px-3 py-2.5">No</th>
                  <th className="px-3 py-2.5">Nama Karyawan</th>
                  <th className="px-3 py-2.5">Tanggal</th>
                  <th className="px-3 py-2.5">Jam Masuk</th>
                  <th className="px-3 py-2.5">Jam Pulang</th>
                  <th className="px-3 py-2.5">Masuk Lembur</th>
                  <th className="px-3 py-2.5">Pulang Lembur</th>
                  <th className="px-3 py-2.5">Keterangan</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {DETAIL_LAPORAN_LIST.map((r, i) => (
                  <tr
                    key={r.id}
                    className={cn(
                      "hover:bg-slate-50",
                      r.status === "libur" && "bg-emerald-50/40",
                    )}
                  >
                    <td className="px-3 py-3 font-medium text-slate-500">{i + 1}</td>
                    <td className="px-3 py-3 font-bold text-slate-900">{r.nama}</td>
                    <td className="px-3 py-3">
                      <div className="font-semibold text-slate-900">{r.hari}</div>
                      <div className="text-xs text-slate-500">{r.tanggal}</div>
                    </td>
                    <td className="px-3 py-3 font-medium text-slate-700">
                      {r.jamMasuk ?? <span className="text-slate-300">&ndash;</span>}
                    </td>
                    <td className="px-3 py-3 font-medium text-slate-700">
                      {r.jamPulang ?? <span className="text-slate-300">&ndash;</span>}
                    </td>
                    <td className="px-3 py-3 font-medium text-slate-700">
                      {r.jamMasukLembur ?? (
                        <span className="text-slate-300">&ndash;</span>
                      )}
                    </td>
                    <td className="px-3 py-3 font-medium text-slate-700">
                      {r.jamPulangLembur ?? (
                        <span className="text-slate-300">&ndash;</span>
                      )}
                    </td>
                    <td className="px-3 py-3">
                      <div className="flex flex-col gap-1">
                        <StatusBadge status={r.status} />
                        <span
                          className={cn(
                            "text-xs",
                            r.status === "libur"
                              ? "font-semibold text-emerald-700"
                              : "text-slate-500",
                          )}
                        >
                          {r.keterangan}
                        </span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="flex flex-col gap-3 border-t border-slate-100 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-2 text-xs">
              <span className="text-slate-500">Tampilkan</span>
              <SelectInput
                className="w-20"
                options={[{ value: "10", label: "10" }]}
                defaultValue="10"
              />
              <span className="text-slate-500">data per halaman</span>
            </div>
            <div className="flex items-center gap-1.5">
              <button className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-500">
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
              <span className="px-1 text-slate-400">...</span>
              <button className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 bg-white text-sm font-bold text-slate-600">
                5
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
