"use client";

import * as React from "react";
import {
  User,
  IdCard,
  Briefcase,
  MapPin,
  Phone,
  Mail,
  PencilLine,
  Lock,
  Eye,
  EyeOff,
  CheckCircle2,
  Camera,
  ShieldCheck,
} from "lucide-react";
import {
  Card,
  CardBody,
  CardHeader,
  InfoRow,
  OutlineActionButton,
  PrimaryButton,
  BlueButton,
  SectionPill,
} from "../shared/ui";
import { Field, TextInput } from "../shared/form";
import { Modal } from "./AbsensiScreen";

export function ProfilSaya() {
  const [showEdit, setShowEdit] = React.useState<"pribadi" | "kontak" | null>(null);

  return (
    <div className="space-y-6">
      {showEdit && (
        <Modal onClose={() => setShowEdit(null)}>
          <div>
            <h3 className="mb-4 text-lg font-extrabold text-slate-900">
              {showEdit === "pribadi" ? "Edit Data Pribadi" : "Edit Kontak & Alamat"}
            </h3>
            <div className="space-y-3">
              {showEdit === "pribadi" ? (
                <>
                  <Field label="Nama Lengkap">
                    <TextInput icon={User} defaultValue="Arif Fatoni" />
                  </Field>
                  <Field label="Tempat Lahir">
                    <TextInput icon={MapPin} defaultValue="Jakarta" />
                  </Field>
                  <Field label="Tanggal Lahir">
                    <TextInput type="date" defaultValue="2000-01-01" />
                  </Field>
                </>
              ) : (
                <>
                  <Field label="No. HP / WhatsApp">
                    <TextInput icon={Phone} defaultValue="0812 3456 7890" />
                  </Field>
                  <Field label="Alamat">
                    <TextInput
                      icon={MapPin}
                      defaultValue="Jl. Melati No. 10, Kec. Senen, Jakarta Pusat"
                    />
                  </Field>
                </>
              )}
              <div className="flex gap-2 pt-2">
                <button
                  onClick={() => setShowEdit(null)}
                  className="flex-1 rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm font-bold text-slate-600"
                >
                  Batal
                </button>
                <BlueButton
                  onClick={() => setShowEdit(null)}
                  icon={CheckCircle2}
                  className="flex-1"
                >
                  Simpan
                </BlueButton>
              </div>
            </div>
          </div>
        </Modal>
      )}

      {/* Profile summary */}
      <Card>
        <CardBody className="flex flex-col items-start gap-5 sm:flex-row sm:items-center">
          <div className="relative shrink-0">
            <div className="flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-blue-700 text-white shadow-md">
              <User className="h-10 w-10" />
            </div>
            <button className="absolute bottom-0 right-0 flex h-8 w-8 items-center justify-center rounded-full border-2 border-white bg-emerald-500 text-white shadow-sm hover:bg-emerald-600">
              <Camera className="h-4 w-4" />
            </button>
          </div>
          <div className="flex-1">
            <h3 className="text-2xl font-extrabold text-slate-900">Arif Fatoni</h3>
            <div className="mt-1.5 flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center rounded-full bg-emerald-100 px-3 py-0.5 text-xs font-bold text-emerald-700">
                Staf Program
              </span>
              <span className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-600">
                <Briefcase className="h-4 w-4 text-blue-600" />
                Yayasan Al-Maghfirah
              </span>
            </div>
          </div>
        </CardBody>
      </Card>

      {/* Tab pill */}
      <div className="flex flex-wrap gap-2">
        <SectionPill icon={User} tone="blue" active>
          Data Profil
        </SectionPill>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Data Pribadi */}
        <Card className="lg:col-span-2">
          <CardHeader
            title="Data Pribadi"
            icon={IdCard}
            iconColor="blue"
            action={
              <OutlineActionButton
                icon={PencilLine}
                onClick={() => setShowEdit("pribadi")}
              >
                Edit Data
              </OutlineActionButton>
            }
          />
          <CardBody className="divide-y divide-slate-100">
            <InfoRow label="Nama Lengkap" value="Arif Fatoni" icon={User} />
            <InfoRow
              label="Tempat, Tanggal Lahir"
              value="Jakarta, 01 Januari 2000"
              icon={MapPin}
            />
            <InfoRow label="Jenis Kelamin" value="Laki-laki" icon={User} />
            <InfoRow label="Agama" value="Islam" icon={ShieldCheck} />
          </CardBody>
        </Card>

        {/* Data Kepegawaian */}
        <Card className="lg:col-span-1">
          <CardHeader title="Data Kepegawaian" icon={Briefcase} iconColor="blue" />
          <CardBody className="divide-y divide-slate-100">
            <InfoRow label="NIP / ID Karyawan" value="YAM-0001" icon={IdCard} />
            <InfoRow label="Jabatan" value="Staf Program" icon={Briefcase} />
          </CardBody>
        </Card>
      </div>

      {/* Kontak & Alamat */}
      <Card>
        <CardHeader
          title="Kontak & Alamat"
          icon={MapPin}
          iconColor="blue"
          action={
            <OutlineActionButton
              icon={PencilLine}
              onClick={() => setShowEdit("kontak")}
            >
              Edit Data
            </OutlineActionButton>
          }
        />
        <CardBody className="divide-y divide-slate-100">
          <InfoRow label="No. HP / WhatsApp" value="0812 3456 7890" icon={Phone} />
          <InfoRow label="Email" value="arif.fatoni@almaghfirah.or.id" icon={Mail} />
          <InfoRow
            label="Alamat"
            value="Jl. Melati No. 10, Kec. Senen, Kota Jakarta Pusat, DKI Jakarta 10410"
            icon={MapPin}
          />
        </CardBody>
      </Card>
    </div>
  );
}

export function UbahPassword() {
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
              Password Berhasil Diubah!
            </h3>
            <p className="mt-1 text-sm text-slate-500">
              Password akun Anda telah berhasil diperbarui. Sesi lain di perangkat
              lain tetap aktif.
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

      <div className="mx-auto max-w-2xl">
        {/* Info banner */}
        <div className="mb-5 flex items-start gap-3 rounded-2xl border border-amber-200 bg-amber-50 p-4">
          <ShieldCheck className="h-5 w-5 shrink-0 text-amber-600" />
          <div className="text-sm">
            <p className="font-bold text-amber-900">Tips Keamanan Password</p>
            <ul className="mt-1 space-y-0.5 text-xs text-amber-800">
              <li>&bull; Minimal 8 karakter, kombinasi huruf dan angka</li>
              <li>&bull; Jangan gunakan password yang sama dengan akun lain</li>
              <li>&bull; Ganti password secara berkala setiap 3 bulan</li>
            </ul>
          </div>
        </div>

        <Card>
          <CardHeader title="Ubah Password" icon={Lock} iconColor="blue" />
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
                  <TextInput
                    icon={Lock}
                    type={showOld ? "text" : "password"}
                    placeholder="Masukkan password lama"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowOld((s) => !s)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    {showOld ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
              </Field>

              <Field label="Password Baru" required hint="Min. 8 karakter, kombinasi huruf & angka">
                <div className="relative">
                  <TextInput
                    icon={Lock}
                    type={showNew ? "text" : "password"}
                    placeholder="Masukkan password baru"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowNew((s) => !s)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    {showNew ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
              </Field>

              <Field label="Konfirmasi Password Baru" required>
                <div className="relative">
                  <TextInput
                    icon={Lock}
                    type={showConfirm ? "text" : "password"}
                    placeholder="Ulangi password baru"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirm((s) => !s)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    {showConfirm ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
              </Field>

              <div className="flex flex-col gap-3 pt-2 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  className="rounded-xl border border-slate-300 bg-white px-5 py-3 text-sm font-bold text-slate-600 hover:bg-slate-50"
                >
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
