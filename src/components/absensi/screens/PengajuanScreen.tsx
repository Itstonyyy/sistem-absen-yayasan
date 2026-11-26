"use client";

import * as React from "react";
import {
  User,
  Briefcase,
  CalendarDays,
  Upload,
  CheckCircle2,
  Calendar,
  Umbrella,
  Cross,
  ClipboardList,
  AlertCircle,
} from "lucide-react";
import {
  Card,
  CardBody,
  CardHeader,
  PrimaryButton,
} from "../shared/ui";
import { Field, TextInput, TextArea, SelectInput } from "../shared/form";
import { Modal } from "./AbsensiScreen";

type PengajuanJenis = "izin" | "sakit" | "cuti";

interface PengajuanScreenProps {
  jenis: PengajuanJenis;
}

const META: Record<
  PengajuanJenis,
  { label: string; icon: typeof ClipboardList; tone: "amber" | "blue" | "green" }
> = {
  izin: { label: "Pengajuan Izin", icon: ClipboardList, tone: "amber" },
  sakit: { label: "Pengajuan Sakit", icon: Cross, tone: "blue" },
  cuti: { label: "Pengajuan Cuti", icon: Umbrella, tone: "green" },
};

export function PengajuanScreen({ jenis }: PengajuanScreenProps) {
  const meta = META[jenis];
  const [showSuccess, setShowSuccess] = React.useState(false);
  const MetaIcon = meta.icon;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setShowSuccess(true);
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
              Pengajuan Terkirim!
            </h3>
            <p className="mt-1 text-sm text-slate-500">
              Pengajuan {meta.label.toLowerCase()} Anda telah dikirim ke Admin untuk
              ditinjau. Status dapat dipantau di halaman Riwayat Pengajuan.
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

      <div className="mx-auto max-w-3xl">
        <Card>
          <CardHeader title={meta.label} icon={MetaIcon} iconColor={meta.tone} />
          <CardBody>
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Auto-filled info */}
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <Field label="Nama">
                  <TextInput icon={User} defaultValue="Arif Fatoni" readOnly />
                </Field>
                <Field label="Posisi / Jabatan">
                  <TextInput icon={Briefcase} defaultValue="Staf Program" readOnly />
                </Field>
                <Field label="Tanggal Dibuat">
                  <TextInput
                    icon={Calendar}
                    defaultValue="09 November 2026"
                    readOnly
                  />
                </Field>
                <Field label="Jenis Pengajuan">
                  <div className="flex h-[46px] items-center rounded-xl border border-slate-200 bg-slate-50 px-4">
                    <MetaIcon className="h-5 w-5 text-slate-400" />
                    <span className="ml-2 text-sm font-bold capitalize text-slate-700">
                      {jenis}
                    </span>
                  </div>
                </Field>
              </div>

              {/* Jenis-specific fields */}
              {jenis === "izin" && (
                <>
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <Field label="Tanggal Izin" required>
                      <TextInput icon={CalendarDays} type="date" defaultValue="2026-11-12" />
                    </Field>
                    <Field label="Keperluan Izin" required>
                      <SelectInput
                        placeholder="Pilih keperluan"
                        options={[
                          { value: "keluarga", label: "Keluarga" },
                          { value: "pribadi", label: "Pribadi" },
                          { value: "mendesak", label: "Mendesak" },
                          { value: "lainnya", label: "Lainnya" },
                        ]}
                      />
                    </Field>
                  </div>
                  <Field label="Alasan" required hint="Maks. 500 karakter">
                    <TextArea
                      placeholder="Jelaskan alasan pengajuan izin..."
                      rows={4}
                    />
                  </Field>
                </>
              )}

              {jenis === "sakit" && (
                <>
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <Field label="Tanggal Mulai" required>
                      <TextInput icon={CalendarDays} type="date" defaultValue="2026-11-12" />
                    </Field>
                    <Field label="Tanggal Selesai" required>
                      <TextInput icon={CalendarDays} type="date" defaultValue="2026-11-12" />
                    </Field>
                  </div>
                  <Field
                    label="Upload Lampiran (Surat Dokter)"
                    hint="PDF/JPG/PNG, maks 5 MB. Wajib bila durasi > 3 hari."
                  >
                    <div className="rounded-xl border-2 border-dashed border-slate-300 bg-slate-50 p-5 text-center">
                      <Upload className="mx-auto h-7 w-7 text-slate-400" />
                      <p className="mt-1 text-sm font-semibold text-slate-600">
                        Klik untuk upload atau drag &amp; drop
                      </p>
                      <p className="text-xs text-slate-400">PDF/JPG/PNG, maks 5 MB</p>
                    </div>
                  </Field>
                  <Field label="Alasan" required hint="Maks. 500 karakter">
                    <TextArea
                      placeholder="Jelaskan kondisi sakit..."
                      rows={4}
                    />
                  </Field>
                </>
              )}

              {jenis === "cuti" && (
                <>
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                    <Field label="Jenis Cuti" required>
                      <SelectInput
                        defaultValue="tahunan"
                        options={[
                          { value: "tahunan", label: "Cuti Tahunan" },
                          { value: "melahirkan", label: "Cuti Melahirkan" },
                          { value: "lainnya", label: "Lainnya" },
                        ]}
                      />
                    </Field>
                    <Field label="Tanggal Mulai" required>
                      <TextInput icon={CalendarDays} type="date" defaultValue="2026-11-12" />
                    </Field>
                    <Field label="Tanggal Selesai" required>
                      <TextInput icon={CalendarDays} type="date" defaultValue="2026-11-14" />
                    </Field>
                  </div>
                  <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4">
                    <div className="flex items-center gap-2 text-sm font-bold text-emerald-800">
                      <AlertCircle className="h-4 w-4" />
                      Informasi Kuota Cuti
                    </div>
                    <p className="mt-1 text-xs text-emerald-700">
                      Sisa kuota cuti tahunan Anda:{" "}
                      <span className="font-extrabold">9 hari</span> dari 12 hari/tahun.
                    </p>
                  </div>
                  <Field label="Alasan" required hint="Maks. 500 karakter">
                    <TextArea
                      placeholder="Jelaskan alasan pengajuan cuti..."
                      rows={4}
                    />
                  </Field>
                </>
              )}

              <div className="flex flex-col gap-3 pt-2 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  className="rounded-xl border border-slate-300 bg-white px-5 py-3 text-sm font-bold text-slate-600 hover:bg-slate-50"
                >
                  Batal
                </button>
                <PrimaryButton icon={CheckCircle2} type="submit" className="sm:w-auto">
                  Kirim Pengajuan
                </PrimaryButton>
              </div>
            </form>
          </CardBody>
        </Card>
      </div>
    </div>
  );
}
