"use client";

import * as React from "react";
import {
  Users,
  CheckCircle2,
  Clock,
  XCircle,
  Filter,
  Search,
  Eye,
  MapPin,
  ChevronLeft,
  ChevronRight,
  ClipboardCheck,
  Check,
  X,
  PencilLine,
  FileText,
  User,
  Briefcase,
  CalendarDays,
  AlertTriangle,
} from "lucide-react";
import {
  Card,
  CardBody,
  CardHeader,
  KpiCard,
  StatusBadge,
  OutlineActionButton,
  BlueButton,
  PrimaryButton,
  InfoRow,
} from "../shared/ui";
import { Field, TextInput, TextArea, SelectInput, Dash } from "../shared/form";
import { Modal } from "./AbsensiScreen";
import { MONITORING_LIST, PENGAJUAN_LIST } from "../shared/data";
import { cn } from "@/lib/utils";

/* =============== Monitoring Absensi =============== */

export function MonitoringAbsensi() {
  const stats = [
    { label: "Total Karyawan", value: 72, icon: Users, tone: "blue" as const },
    { label: "Hadir Hari Ini", value: 58, icon: CheckCircle2, tone: "green" as const, pill: "(80%)" },
    { label: "Terlambat", value: 6, icon: Clock, tone: "amber" as const, pill: "(8%)" },
    { label: "Tidak Hadir", value: 8, icon: XCircle, tone: "red" as const, pill: "(12%)" },
  ];

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {stats.map((s) => (
          <KpiCard key={s.label} {...s} />
        ))}
      </div>

      {/* Filter card */}
      <Card>
        <CardHeader title="Filter Monitoring" icon={Filter} iconColor="blue" />
        <CardBody>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end">
            <div className="flex-1">
              <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-slate-500">
                Tanggal
              </label>
              <SelectInput
                defaultValue="2026-11-09"
                options={[
                  { value: "2026-11-09", label: "09 Nov 2026" },
                  { value: "2026-11-08", label: "08 Nov 2026" },
                ]}
              />
            </div>
            <div className="flex-1">
              <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-slate-500">
                Status Kehadiran
              </label>
              <SelectInput
                placeholder="Semua Status"
                options={[
                  { value: "hadir", label: "Hadir" },
                  { value: "terlambat", label: "Terlambat" },
                  { value: "tidak-hadir", label: "Tidak Hadir" },
                ]}
              />
            </div>
            <BlueButton icon={Search}>Tampilkan</BlueButton>
          </div>
        </CardBody>
      </Card>

      {/* Table */}
      <Card>
        <CardHeader
          title="Daftar Kehadiran Karyawan"
          icon={Users}
          iconColor="blue"
          action={
            <span className="text-xs text-slate-500">
              Menampilkan <b className="text-slate-700">1 - 10</b> dari{" "}
              <b className="text-slate-700">72 data</b>
            </span>
          }
        />
        <CardBody className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-blue-600 text-left text-xs font-bold uppercase tracking-wider text-white">
                  <th className="px-3 py-2.5">No</th>
                  <th className="px-3 py-2.5">Nama Karyawan</th>
                  <th className="px-3 py-2.5">NIP</th>
                  <th className="px-3 py-2.5">Jabatan</th>
                  <th className="px-3 py-2.5">Status</th>
                  <th className="px-3 py-2.5">Jam Masuk</th>
                  <th className="px-3 py-2.5">Jam Pulang</th>
                  <th className="px-3 py-2.5">Keterangan</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {MONITORING_LIST.map((m, i) => (
                  <tr key={m.id} className="hover:bg-slate-50">
                    <td className="px-3 py-3 font-medium text-slate-500">{i + 1}</td>
                    <td className="px-3 py-3 font-bold text-slate-900">
                      {m.nama}
                      {m.dikoreksi && (
                        <span className="ml-1.5 rounded bg-amber-100 px-1.5 py-0.5 text-[10px] font-bold text-amber-700">
                          Dikoreksi
                        </span>
                      )}
                    </td>
                    <td className="px-3 py-3 text-slate-600">{m.nip}</td>
                    <td className="px-3 py-3 text-slate-600">{m.jabatan}</td>
                    <td className="px-3 py-3">
                      <StatusBadge status={m.status} />
                    </td>
                    <td className="px-3 py-3 font-medium text-slate-700">
                      {m.jamMasuk ?? <Dash />}
                    </td>
                    <td className="px-3 py-3 font-medium text-slate-700">
                      {m.jamPulang ?? <Dash />}
                    </td>
                    <td className="px-3 py-3 text-slate-600">{m.keterangan}</td>
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
              {[1, 2, 3, 4, 5].map((p) => (
                <button
                  key={p}
                  className={cn(
                    "flex h-8 w-8 items-center justify-center rounded-lg text-sm font-bold",
                    p === 1
                      ? "bg-blue-600 text-white"
                      : "border border-slate-200 bg-white text-slate-600 hover:bg-slate-50",
                  )}
                >
                  {p}
                </button>
              ))}
              <span className="px-1 text-slate-400">...</span>
              <button className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 bg-white text-sm font-bold text-slate-600">
                8
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

/* =============== Persetujuan Pengajuan =============== */

export function PersetujuanPengajuan() {
  const [selectedId, setSelectedId] = React.useState<number>(1);
  const [showApprove, setShowApprove] = React.useState(false);
  const [showReject, setShowReject] = React.useState(false);
  const [rejectNote, setRejectNote] = React.useState("");

  const pendingList = PENGAJUAN_LIST.filter((p) => p.status === "pending");
  const selected = PENGAJUAN_LIST.find((p) => p.id === selectedId);

  return (
    <div className="space-y-6">
      {showApprove && (
        <Modal onClose={() => setShowApprove(false)}>
          <div className="text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100">
              <CheckCircle2 className="h-9 w-9 text-emerald-600" />
            </div>
            <h3 className="mt-4 text-xl font-extrabold text-slate-900">
              Setujui Pengajuan?
            </h3>
            <p className="mt-1 text-sm text-slate-500">
              Pengajuan {selected?.jenis} oleh {selected?.nama} akan disetujui dan
              tercatat di kehadiran.
            </p>
            <div className="mt-5 flex gap-2">
              <button
                onClick={() => setShowApprove(false)}
                className="flex-1 rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm font-bold text-slate-600"
              >
                Batal
              </button>
              <BlueButton
                onClick={() => setShowApprove(false)}
                icon={Check}
                className="flex-1"
              >
                Ya, Setujui
              </BlueButton>
            </div>
          </div>
        </Modal>
      )}

      {showReject && (
        <Modal onClose={() => setShowReject(false)}>
          <div>
            <div className="mb-3 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-rose-100 text-rose-600">
                <X className="h-5 w-5" />
              </div>
              <h3 className="text-lg font-extrabold text-slate-900">
                Tolak Pengajuan
              </h3>
            </div>
            <Field label="Catatan Alasan Penolakan" required hint="Maks. 500 karakter">
              <TextArea
                rows={4}
                placeholder="Jelaskan alasan penolakan..."
              />
            </Field>
            <div className="mt-4 flex gap-2">
              <button
                onClick={() => setShowReject(false)}
                className="flex-1 rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm font-bold text-slate-600"
              >
                Batal
              </button>
              <button
                onClick={() => setShowReject(false)}
                className="flex-1 rounded-xl bg-rose-600 px-4 py-2.5 text-sm font-bold text-white hover:bg-rose-700"
              >
                Tolak Pengajuan
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* Stats */}
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <KpiCard label="Menunggu Persetujuan" value={pendingList.length} icon={Clock} tone="amber" />
        <KpiCard label="Izin Pending" value={3} icon={ClipboardCheck} tone="blue" />
        <KpiCard label="Sakit Pending" value={1} icon={FileText} tone="blue" />
        <KpiCard label="Cuti Pending" value={2} icon={Briefcase} tone="blue" />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* List - wider */}
        <Card className="lg:col-span-2">
          <CardHeader
            title="Daftar Pengajuan"
            icon={ClipboardCheck}
            iconColor="blue"
            action={
              <SelectInput
                className="w-40"
                placeholder="Semua Jenis"
                options={[
                  { value: "izin", label: "Izin" },
                  { value: "sakit", label: "Sakit" },
                  { value: "cuti", label: "Cuti" },
                ]}
              />
            }
          />
          <CardBody className="p-0">
            <div className="divide-y divide-slate-100">
              {pendingList.map((p) => (
                <button
                  key={p.id}
                  onClick={() => setSelectedId(p.id)}
                  className={cn(
                    "flex w-full items-center gap-3 px-5 py-3 text-left transition-colors",
                    selectedId === p.id ? "bg-blue-50" : "hover:bg-slate-50",
                  )}
                >
                  <div
                    className={cn(
                      "flex h-9 w-9 shrink-0 items-center justify-center rounded-xl",
                      p.jenis === "izin"
                        ? "bg-amber-100 text-amber-700"
                        : p.jenis === "sakit"
                          ? "bg-sky-100 text-sky-700"
                          : "bg-blue-100 text-blue-700",
                    )}
                  >
                    {p.jenis === "izin" ? (
                      <ClipboardCheck className="h-4 w-4" />
                    ) : p.jenis === "sakit" ? (
                      <FileText className="h-4 w-4" />
                    ) : (
                      <Briefcase className="h-4 w-4" />
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-bold text-slate-900">{p.nama}</p>
                    <p className="truncate text-xs text-slate-500">
                      Pengajuan {p.jenis} &middot; {p.periode}
                    </p>
                  </div>
                  <StatusBadge status={p.status} />
                </button>
              ))}
            </div>
          </CardBody>
        </Card>

        {/* Detail */}
        <Card className="lg:col-span-1">
          <CardHeader title="Detail Pengajuan" icon={FileText} iconColor="blue" />
          <CardBody className="space-y-3">
            {selected && (
              <>
                <InfoRow label="Nama Karyawan" value={selected.nama} icon={User} />
                <div className="border-t border-slate-100" />
                <InfoRow label="Jenis" value={<span className="capitalize">{selected.jenis}</span>} icon={ClipboardCheck} />
                <div className="border-t border-slate-100" />
                <InfoRow label="Periode" value={selected.periode} icon={CalendarDays} />
                <div className="border-t border-slate-100" />
                <InfoRow label="Durasi" value={`${selected.durasiHari} hari`} icon={Clock} />
                <div className="border-t border-slate-100" />
                <InfoRow label="Tanggal Pengajuan" value={selected.tanggalPengajuan} icon={CalendarDays} />
                <div className="border-t border-slate-100" />
                {selected.jenis === "cuti" && (
                  <>
                    <InfoRow label="Sisa Kuota Cuti" value="9 hari" icon={Briefcase} />
                    <div className="border-t border-slate-100" />
                  </>
                )}
                <div className="rounded-xl bg-slate-50 p-3">
                  <p className="text-xs font-bold text-slate-600">Alasan</p>
                  <p className="mt-1 text-sm text-slate-700">{selected.alasan}</p>
                </div>
                {selected.jenis === "sakit" && (
                  <div className="rounded-xl border border-slate-200 p-3 text-center">
                    <FileText className="mx-auto h-7 w-7 text-slate-400" />
                    <p className="mt-1 text-xs font-bold text-slate-600">
                      surat_dokter.pdf
                    </p>
                    <button className="mt-1 text-xs font-bold text-blue-600 hover:underline">
                      Lihat Lampiran
                    </button>
                  </div>
                )}
                <div className="flex gap-2 pt-2">
                  <button
                    onClick={() => setShowReject(true)}
                    className="flex flex-1 items-center justify-center gap-1.5 rounded-xl border border-rose-200 bg-white px-3 py-2.5 text-sm font-bold text-rose-600 hover:bg-rose-50"
                  >
                    <X className="h-4 w-4" /> Tolak
                  </button>
                  <button
                    onClick={() => setShowApprove(true)}
                    className="flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-emerald-600 px-3 py-2.5 text-sm font-bold text-white hover:bg-emerald-700"
                  >
                    <Check className="h-4 w-4" /> Setujui
                  </button>
                </div>
              </>
            )}
          </CardBody>
        </Card>
      </div>
    </div>
  );
}

/* =============== Koreksi Absensi =============== */

export function KoreksiAbsensi() {
  const [showSuccess, setShowSuccess] = React.useState(false);
  const [koreksiType, setKoreksiType] = React.useState("koreksi-masuk");
  const [waktuKoreksi, setWaktuKoreksi] = React.useState({
    masuk: "08:00",
    pulang: "17:00",
    masukLembur: "",
    pulangLembur: "",
  });

  // Pemetaan jenis koreksi ke field waktu yang harus ditampilkan.
  // - Waktu Masuk muncul pada: koreksi-masuk & koreksi-keduanya
  // - Waktu Pulang muncul pada: koreksi-pulang & koreksi-keduanya
  // - Waktu Masuk Lembur muncul pada: koreksi-masuk-lembur & koreksi-lembur-keduanya
  // - Waktu Pulang Lembur muncul pada: koreksi-pulang-lembur & koreksi-lembur-keduanya
  const tampilkanWaktuMasuk = ["koreksi-masuk", "koreksi-keduanya"].includes(koreksiType);
  const tampilkanWaktuPulang = ["koreksi-pulang", "koreksi-keduanya"].includes(koreksiType);
  const tampilkanWaktuMasukLembur = ["koreksi-masuk-lembur", "koreksi-lembur-keduanya"].includes(koreksiType);
  const tampilkanWaktuPulangLembur = ["koreksi-pulang-lembur", "koreksi-lembur-keduanya"].includes(koreksiType);

  const handleJenisKoreksiChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setKoreksiType(event.target.value);
    // Kosongkan nilai waktu sebelumnya agar nilai dari jenis koreksi lama
    // tidak ikut tersimpan ketika Admin mengganti jenis koreksi.
    setWaktuKoreksi({ masuk: "", pulang: "", masukLembur: "", pulangLembur: "" });
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
              Koreksi Berhasil Disimpan!
            </h3>
            <p className="mt-1 text-sm text-slate-500">
              Data absensi telah dikoreksi dan tercatat di audit log.
            </p>
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
        <div className="mb-5 flex items-start gap-3 rounded-2xl border border-amber-200 bg-amber-50 p-4">
          <AlertTriangle className="h-5 w-5 shrink-0 text-amber-600" />
          <div className="text-sm">
            <p className="font-bold text-amber-900">Catatan Koreksi Absensi</p>
            <p className="mt-0.5 text-xs text-amber-800">
              Koreksi hanya dilakukan oleh Admin. Setiap koreksi tercatat di audit log
              (nilai lama &rarr; nilai baru). Data asli tidak dihapus.
            </p>
          </div>
        </div>

        <Card>
          <CardHeader title="Form Koreksi Absensi" icon={PencilLine} iconColor="blue" />
          <CardBody>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                setShowSuccess(true);
              }}
              className="space-y-5"
            >
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <Field label="Nama Karyawan" required>
                  <SelectInput
                    placeholder="Pilih karyawan"
                    options={[
                      { value: "1", label: "Arif Fatoni - YAM-0001" },
                      { value: "2", label: "Naila Nasywa - YAM-0002" },
                      { value: "3", label: "Reza Evriansyah - YAM-0003" },
                    ]}
                  />
                </Field>
                <Field label="Posisi / Jabatan">
                  <TextInput icon={Briefcase} defaultValue="Staf Program" readOnly />
                </Field>
                <Field label="Tanggal Absen" required>
                  <TextInput icon={CalendarDays} type="date" defaultValue="2026-11-09" />
                </Field>
                <Field label="Jenis Koreksi" required>
                  <SelectInput
                    value={koreksiType}
                    onChange={handleJenisKoreksiChange}
                    options={[
                      { value: "koreksi-masuk", label: "Koreksi Absen Masuk" },
                      { value: "koreksi-pulang", label: "Koreksi Absen Pulang" },
                      { value: "koreksi-keduanya", label: "Koreksi Absen Keduanya" },
                      { value: "koreksi-masuk-lembur", label: "Koreksi Absen Masuk Lembur" },
                      { value: "koreksi-pulang-lembur", label: "Koreksi Absen Pulang Lembur" },
                      { value: "koreksi-lembur-keduanya", label: "Koreksi Absen Lembur Keduanya" },
                    ]}
                  />
                </Field>
              </div>

              {/* Field waktu ditampilkan sesuai Jenis Koreksi yang dipilih. */}
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {tampilkanWaktuMasuk && (
                  <Field label="Waktu Masuk Seharusnya" required>
                    <TextInput
                      icon={Clock}
                      type="time"
                      name="waktuMasukSeharusnya"
                      value={waktuKoreksi.masuk}
                      onChange={(event) =>
                        setWaktuKoreksi((prev) => ({ ...prev, masuk: event.target.value }))
                      }
                      required
                    />
                  </Field>
                )}
                {tampilkanWaktuPulang && (
                  <Field label="Waktu Pulang Seharusnya" required>
                    <TextInput
                      icon={Clock}
                      type="time"
                      name="waktuPulangSeharusnya"
                      value={waktuKoreksi.pulang}
                      onChange={(event) =>
                        setWaktuKoreksi((prev) => ({ ...prev, pulang: event.target.value }))
                      }
                      required
                    />
                  </Field>
                )}
                {tampilkanWaktuMasukLembur && (
                  <Field label="Waktu Masuk Lembur Seharusnya" required>
                    <TextInput
                      icon={Clock}
                      type="time"
                      name="waktuMasukLemburSeharusnya"
                      value={waktuKoreksi.masukLembur}
                      onChange={(event) =>
                        setWaktuKoreksi((prev) => ({ ...prev, masukLembur: event.target.value }))
                      }
                      required
                    />
                  </Field>
                )}
                {tampilkanWaktuPulangLembur && (
                  <Field label="Waktu Pulang Lembur Seharusnya" required>
                    <TextInput
                      icon={Clock}
                      type="time"
                      name="waktuPulangLemburSeharusnya"
                      value={waktuKoreksi.pulangLembur}
                      onChange={(event) =>
                        setWaktuKoreksi((prev) => ({ ...prev, pulangLembur: event.target.value }))
                      }
                      required
                    />
                  </Field>
                )}
              </div>

              <Field label="Alasan Koreksi" required hint="Maks. 500 karakter">
                <TextArea
                  rows={4}
                  placeholder="Jelaskan alasan koreksi absensi..."
                />
              </Field>

              <div className="flex flex-col gap-3 pt-2 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  className="rounded-xl border border-slate-300 bg-white px-5 py-3 text-sm font-bold text-slate-600 hover:bg-slate-50"
                >
                  Batal
                </button>
                <PrimaryButton icon={CheckCircle2} type="submit" className="sm:w-auto">
                  Simpan Koreksi
                </PrimaryButton>
              </div>
            </form>
          </CardBody>
        </Card>
      </div>
    </div>
  );
}