"use client";

import * as React from "react";
import {
  Users,
  UserPlus,
  Search,
  PencilLine,
  Trash2,
  ChevronLeft,
  ChevronRight,
  Database,
  Briefcase,
  User,
  Lock,
  Mail,
  Phone,
  MapPin,
  CalendarDays,
  CheckCircle2,
  Plus,
  BookOpen,
  HelpCircle,
  BarChart3,
  TrendingUp,
  Percent,
  Award,
  Info,
  X,
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
import { Field, TextInput, TextArea, SelectInput } from "../shared/form";
import { Modal } from "./AbsensiScreen";
import { KUIS_LIST, STATISTIK_KUIS } from "../shared/data";
import { cn } from "@/lib/utils";
import type { ScreenId } from "../navigation";

// Type definitions
interface Employee {
  id: string;
  nip: string;
  name: string;
  email: string;
  role: string;
  jabatan: string;
  telepon?: string | null;
  jenisKelamin?: string | null;
  tempatLahir?: string | null;
  tanggalLahir?: Date | null;
  agama?: string;
  alamat?: string | null;
  avatarColor?: string | null;
  sisaCuti: number;
  isActive: boolean;
  deletedAt?: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

interface EmployeeListResponse {
  data: Employee[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

// Helper function to get jabatan label
function getJabatanLabel(jabatan: string): string {
  const labels: Record<string, string> = {
    takmir: 'Takmir',
    imam: 'Imam Masjid',
    ga: 'General Affair',
    finance: 'Finance Controller',
    program: 'Program Development',
  };
  return labels[jabatan] || jabatan;
}

/* =============== Data Karyawan - List =============== */

export function DataKaryawanList({ onNavigate }: { onNavigate?: (s: ScreenId, extras?: { employeeId?: string }) => void }) {
  const [employees, setEmployees] = React.useState<Employee[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [showDelete, setShowDelete] = React.useState<string | null>(null);
  const [searchTerm, setSearchTerm] = React.useState('');
  const [selectedJabatan, setSelectedJabatan] = React.useState<JabatanOption | ''>('');
  const [currentPage, setCurrentPage] = React.useState(1);
  const [pageSize, setPageSize] = React.useState<number>(10);
  const [totalData, setTotalData] = React.useState(0);

  // Fetch employees from API
  React.useEffect(() => {
    const fetchEmployees = async () => {
      setLoading(true);
      setError(null);
      try {
        const params = new URLSearchParams();
        if (searchTerm) params.append('search', searchTerm);
        if (selectedJabatan) params.append('jabatan', selectedJabatan);
        params.append('page', currentPage.toString());
        params.append('pageSize', pageSize.toString());

        const response = await fetch(`/api/admin/employees?${params}`);
        if (!response.ok) {
          throw new Error('Gagal mengambil data karyawan');
        }
        const data: EmployeeListResponse = await response.json();
        setEmployees(data.data);
        setTotalData(data.total);
      } catch (err: any) {
        setError(err.message || 'Gagal mengambil data karyawan');
      } finally {
        setLoading(false);
      }
    };

    fetchEmployees();
  }, [searchTerm, selectedJabatan, currentPage, pageSize]);

  const handleDelete = async () => {
    if (!showDelete) return;
    
    try {
      const response = await fetch(`/api/admin/employees/${showDelete}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        throw new Error('Gagal menghapus karyawan');
      }
      
      // Refresh data
      fetchEmployees();
    } catch (err: any) {
      setError(err.message || 'Gagal menghapus karyawan');
    } finally {
      setShowDelete(null);
    }
  };

  const fetchEmployees = async () => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams();
      if (searchTerm) params.append('search', searchTerm);
      if (selectedJabatan) params.append('jabatan', selectedJabatan);
      params.append('page', currentPage.toString());
      params.append('pageSize', pageSize.toString());

      const response = await fetch(`/api/admin/employees?${params}`);
      if (!response.ok) {
        throw new Error('Gagal mengambil data karyawan');
      }
      const data: EmployeeListResponse = await response.json();
      setEmployees(data.data);
      setTotalData(data.total);
    } catch (err: any) {
      setError(err.message || 'Gagal mengambil data karyawan');
    } finally {
      setLoading(false);
    }
  };

  const totalPages = Math.ceil(totalData / pageSize);

  return (
    <div className="space-y-6">
      {/* Error Modal */}
      {error && (
        <Modal onClose={() => setError(null)}>
          <div className="text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-rose-100">
              <X className="h-9 w-9 text-rose-600" />
            </div>
            <h3 className="mt-4 text-xl font-extrabold text-slate-900">
              Terjadi Kesalahan
            </h3>
            <p className="mt-1 text-sm text-slate-500">
              {error}
            </p>
            <button
              onClick={() => setError(null)}
              className="mt-5 w-full rounded-xl bg-rose-600 px-4 py-2.5 text-sm font-bold text-white hover:bg-rose-700"
            >
              Tutup
            </button>
          </div>
        </Modal>
      )}

      {showDelete && (
        <Modal onClose={() => setShowDelete(null)}>
          <div className="text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-rose-100">
              <Trash2 className="h-9 w-9 text-rose-600" />
            </div>
            <h3 className="mt-4 text-xl font-extrabold text-slate-900">
              Hapus Data Karyawan?
            </h3>
            <p className="mt-1 text-sm text-slate-500">
              Anda akan menghapus permanen data karyawan{" "}
              <b className="text-slate-700">
                {employees.find((k) => k.id === showDelete)?.name || '...'}
              </b>
              . Data yang dihapus tidak dapat dikembalikan.
            </p>
            <div className="mt-5 flex gap-2">
              <button
                onClick={() => setShowDelete(null)}
                className="flex-1 rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm font-bold text-slate-600"
              >
                Batal
              </button>
              <button
                onClick={handleDelete}
                className="flex-1 rounded-xl bg-rose-600 px-4 py-2.5 text-sm font-bold text-white hover:bg-rose-700"
              >
                Ya, Hapus
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* Stats */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <KpiCard label="Total Karyawan" value={totalData} icon={Users} tone="blue" />
        <KpiCard label="Karyawan Aktif" value={employees.filter(e => e.isActive).length} icon={UserPlus} tone="green" />
      </div>

      {/* Filter + Table */}
      <Card>
        <CardHeader
          title="Daftar Karyawan"
          icon={Database}
          iconColor="blue"
          action={
            <span className="text-xs text-slate-500">
              Menampilkan <b className="text-slate-700">{employees.length > 0 ? (currentPage - 1) * pageSize + 1 : 0} - {employees.length > 0 ? (currentPage - 1) * pageSize + employees.length : 0}</b> dari{" "}
              <b className="text-slate-700">{totalData} data</b>
            </span>
          }
        />
        <CardBody className="space-y-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
            <div className="flex-1">
              <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-slate-500">
                Pencarian
              </label>
              <TextInput 
                icon={Search} 
                placeholder="Cari nama, NIP, atau email..." 
                value={searchTerm}
                onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
              />
            </div>
            <div className="sm:w-56">
              <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-slate-500">
                Jabatan
              </label>
              <SelectInput
                placeholder="Semua Jabatan"
                value={selectedJabatan}
                onChange={(e) => { setSelectedJabatan(e.target.value as JabatanOption); setCurrentPage(1); }}
                options={[
                  { value: "", label: "Semua Jabatan" },
                  { value: "takmir", label: "Takmir" },
                  { value: "imam", label: "Imam Masjid" },
                  { value: "ga", label: "General Affair" },
                  { value: "finance", label: "Finance Controller" },
                  { value: "program", label: "Program Development" },
                ]}
              />
            </div>
            <button
              onClick={() => onNavigate?.("tambah-data-karyawan")}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-bold text-white transition-colors hover:bg-blue-700"
            >
              <Plus className="h-4 w-4" />
              Tambah Karyawan
            </button>
          </div>

          {/* Loading and Error States */}
          {loading && (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
              <span className="ml-2 text-slate-500">Memuat data karyawan...</span>
            </div>
          )}

          {error && !loading && (
            <div className="rounded-lg bg-rose-50 p-4 text-rose-700">
              {error}
            </div>
          )}

          {!loading && !error && (
            <>
              {/* Empty State */}
              {employees.length === 0 && (
                <div className="text-center py-8">
                  <Users className="h-12 w-12 mx-auto text-slate-300" />
                  <p className="mt-2 text-slate-500">Tidak ada data karyawan yang ditemukan</p>
                </div>
              )}

              {/* Table */}
              {employees.length > 0 && (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-blue-600 text-left text-xs font-bold uppercase tracking-wider text-white">
                        <th className="px-3 py-2.5">No</th>
                        <th className="px-3 py-2.5">Nama Lengkap</th>
                        <th className="px-3 py-2.5">NIP</th>
                        <th className="px-3 py-2.5">Jabatan</th>
                        <th className="px-3 py-2.5">Email</th>
                        <th className="px-3 py-2.5 text-right">Aksi</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {employees.map((k, i) => (
                        <tr key={k.id} className="hover:bg-slate-50">
                          <td className="px-3 py-3 font-medium text-slate-500">
                            {(currentPage - 1) * pageSize + i + 1}
                          </td>
                          <td className="px-3 py-3">
                            <div className="flex items-center gap-2.5">
                              <div
                                className={cn(
                                  "flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br text-white",
                                  k.avatarColor || "from-slate-500 to-gray-600",
                                )}
                              >
                                <User className="h-4 w-4" />
                              </div>
                              <span className="font-bold text-slate-900">{k.name}</span>
                            </div>
                          </td>
                          <td className="px-3 py-3 text-slate-600 font-mono">{k.nip}</td>
                          <td className="px-3 py-3 text-slate-600">{getJabatanLabel(k.jabatan)}</td>
                          <td className="px-3 py-3 text-slate-600">{k.email}</td>
                          <td className="px-3 py-3">
                            <div className="flex items-center justify-end gap-2">
                              <OutlineActionButton
                                icon={PencilLine}
                                tone="green"
                                onClick={() => onNavigate?.("edit-data-karyawan", { employeeId: k.id })}
                              >
                                Edit
                              </OutlineActionButton>
                              <OutlineActionButton
                                icon={Trash2}
                                tone="red"
                                onClick={() => setShowDelete(k.id)}
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
              )}
            </>
          )}

          {/* Pagination */}
          {!loading && !error && employees.length > 0 && (
            <div className="flex flex-col gap-3 border-t border-slate-100 pt-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-2 text-xs">
                <span className="text-slate-500">Tampilkan</span>
                <SelectInput
                  className="w-20"
                  options={[
                    { value: "5", label: "5" },
                    { value: "10", label: "10" },
                    { value: "20", label: "20" },
                  ]}
                  defaultValue={pageSize.toString()}
                  onChange={(e) => {
                    const newSize = parseInt(e.target.value);
                    setPageSize(newSize);
                    setCurrentPage(1);
                  }}
                />
                <span className="text-slate-500">data per halaman</span>
              </div>
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                  className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-500 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-50"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  const pageNum = i + 1;
                  return (
                    <button
                      key={pageNum}
                      onClick={() => setCurrentPage(pageNum)}
                      className={cn(
                        "flex h-8 w-8 items-center justify-center rounded-lg text-sm font-bold",
                        pageNum === currentPage
                          ? "bg-blue-600 text-white"
                          : "border border-slate-200 bg-white text-slate-600 hover:bg-slate-50",
                      )}
                    >
                      {pageNum}
                    </button>
                  );
                })}
                {totalPages > 5 && currentPage < totalPages - 2 && (
                  <>
                    <span className="px-1 text-slate-400">...</span>
                    <button
                      onClick={() => setCurrentPage(totalPages)}
                      className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
                    >
                      {totalPages}
                    </button>
                  </>
                )}
                <button
                  onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                  disabled={currentPage === totalPages}
                  className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-500 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-50"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}
        </CardBody>
      </Card>
    </div>
  );
}

/* =============== Tambah/Edit Data Karyawan (shared form) =============== */

// Type definitions
interface Employee {
  id: string;
  nip: string;
  name: string;
  email: string;
  role: string;
  jabatan: string;
  telepon?: string | null;
  jenisKelamin?: string | null;
  tempatLahir?: string | null;
  tanggalLahir?: Date | null;
  agama?: string;
  alamat?: string | null;
  avatarColor?: string | null;
  sisaCuti: number;
  isActive: boolean;
  deletedAt?: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

const JABATAN_OPTIONS = ['takmir', 'imam', 'ga', 'finance', 'program'] as const;
type JabatanOption = typeof JABATAN_OPTIONS[number];

const GENDER_OPTIONS = ['Laki-laki', 'Perempuan'] as const;
const AGAMA_OPTIONS = ['Islam', 'Kristen', 'Katolik', 'Hindu', 'Buddha', 'Konghucu'] as const;

const JABATAN_LABELS: Record<JabatanOption, string> = {
  takmir: 'Takmir',
  imam: 'Imam Masjid',
  ga: 'General Affair',
  finance: 'Finance Controller',
  program: 'Program Development',
};

const GENDER_VALUES: Record<string, string> = {
  'L': 'Laki-laki',
  'P': 'Perempuan',
};

export function DataKaryawanForm({ mode, employeeId }: { mode: "tambah" | "edit", employeeId?: string }) {
  const [showSuccess, setShowSuccess] = React.useState(false);
  const [showError, setShowError] = React.useState(false);
  const [error, setError] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const [employee, setEmployee] = React.useState<Employee | null>(null);
  const isEdit = mode === "edit";

  // Form state
  const [nama, setNama] = React.useState('');
  const [nip, setNip] = React.useState('');
  const [jabatan, setJabatan] = React.useState<JabatanOption>('takmir');
  const [email, setEmail] = React.useState('');
  const [telepon, setTelepon] = React.useState('');
  const [jenisKelamin, setJenisKelamin] = React.useState<string>('');
  const [tempatLahir, setTempatLahir] = React.useState('');
  const [tanggalLahir, setTanggalLahir] = React.useState('');
  const [agama, setAgama] = React.useState<string>('Islam');
  const [alamat, setAlamat] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [confirmPassword, setConfirmPassword] = React.useState('');

  // Fetch employee data for edit mode
  React.useEffect(() => {
    if (isEdit && employeeId) {
      const fetchEmployee = async () => {
        try {
          const response = await fetch(`/api/admin/employees/${employeeId}`);
          if (!response.ok) throw new Error('Gagal mengambil data karyawan');
          const data = await response.json();
          const emp = data.data;
          setEmployee(emp);
          setNama(emp.name);
          setNip(emp.nip);
          setJabatan(emp.jabatan as JabatanOption);
          setEmail(emp.email);
          setTelepon(emp.telepon || '');
          setJenisKelamin(emp.jenisKelamin || '');
          setTempatLahir(emp.tempatLahir || '');
          setTanggalLahir(emp.tanggalLahir ? new Date(emp.tanggalLahir).toISOString().split('T')[0] : '');
          setAgama(emp.agama || 'Islam');
          setAlamat(emp.alamat || '');
        } catch (err: any) {
          setError(err.message);
          setShowError(true);
        }
      };
      fetchEmployee();
    }
  }, [isEdit, employeeId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isEdit && password !== confirmPassword) {
      alert('Password tidak cocok');
      return;
    }

    setLoading(true);
    try {
      const formData = {
        name: nama,
        nip: nip,
        jabatan: jabatan,
        email: email,
        telepon: telepon,
        jenisKelamin: jenisKelamin || null,
        tempatLahir: tempatLahir || null,
        tanggalLahir: tanggalLahir || null,
        agama: agama,
        alamat: alamat || null,
        ...(isEdit ? {} : { password: password }),
      };

      const response = await fetch(
        isEdit 
          ? `/api/admin/employees/${employeeId}` 
          : `/api/admin/employees`, 
        {
          method: isEdit ? 'PUT' : 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Gagal menyimpan data karyawan');
      }

      setShowSuccess(true);
    } catch (err: any) {
      setError(err.message);
      setShowError(true);
    } finally {
      setLoading(false);
    }
  };

  const getJabatanLabel = (j: JabatanOption) => JABATAN_LABELS[j];
  const getGenderValue = (g: string) => GENDER_VALUES[g] || g;

  return (
    <div className="space-y-6">
      {/* Success Modal */}
      {showSuccess && (
        <Modal onClose={() => {
          setShowSuccess(false);
          // Refresh would be handled by parent component
        }}>
          <div className="text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100">
              <CheckCircle2 className="h-9 w-9 text-emerald-600" />
            </div>
            <h3 className="mt-4 text-xl font-extrabold text-slate-900">
              {isEdit ? "Data Berhasil Diperbarui!" : "Karyawan Berhasil Ditambahkan!"}
            </h3>
            <p className="mt-1 text-sm text-slate-500">
              {isEdit
                ? "Data karyawan telah diperbarui."
                : "Password default: NIP karyawan. Disarankan mengganti password setelah login pertama."}
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

      {/* Error Modal */}
      {showError && (
        <Modal onClose={() => setShowError(false)}>
          <div className="text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-rose-100">
              <X className="h-9 w-9 text-rose-600" />
            </div>
            <h3 className="mt-4 text-xl font-extrabold text-slate-900">
              Terjadi Kesalahan
            </h3>
            <p className="mt-1 text-sm text-slate-500">
              {error}
            </p>
            <button
              onClick={() => setShowError(false)}
              className="mt-5 w-full rounded-xl bg-rose-600 px-4 py-2.5 text-sm font-bold text-white hover:bg-rose-700"
            >
              Tutup
            </button>
          </div>
        </Modal>
      )}

      <div className="mx-auto max-w-4xl">
        {isEdit && employee && (
          <div className="mb-5 flex items-center gap-4 rounded-2xl border border-slate-200 bg-white p-4">
            <div className={cn(
              "flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br text-white",
              employee.avatarColor || "from-slate-500 to-gray-600"
            )}>
              <User className="h-7 w-7" />
            </div>
            <div>
              <p className="text-lg font-extrabold text-slate-900">{employee.name}</p>
              <p className="text-sm text-slate-500">{employee.nip} &middot; {getJabatanLabel(employee.jabatan as JabatanOption)}</p>
            </div>
          </div>
        )}

        {loading && (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin text-blue-600 mr-2" />
            <span className="text-slate-500">Menyimpan...</span>
          </div>
        )}

        <Card>
          <CardHeader
            title={isEdit ? "Edit Data Karyawan" : "Form Tambah Karyawan"}
            icon={isEdit ? PencilLine : UserPlus}
            iconColor="blue"
          />
          <CardBody>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Data Pribadi */}
              <div>
                <h4 className="mb-3 flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-slate-700">
                  <User className="h-4 w-4 text-blue-600" />
                  Data Pribadi
                </h4>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <Field label="Nama Lengkap" required>
                    <TextInput 
                      icon={User} 
                      value={nama} 
                      onChange={(e) => setNama(e.target.value)} 
                      placeholder="Masukkan nama lengkap" 
                      required 
                    />
                  </Field>
                  <Field label="NIP" required hint="Unik, tidak boleh duplikat">
                    <TextInput 
                      icon={Briefcase} 
                      value={nip} 
                      onChange={(e) => setNip(e.target.value)} 
                      placeholder="Masukan NIP Karyawan" 
                      required 
                      readOnly={isEdit}
                    />
                  </Field>
                  <Field label="Jenis Kelamin" required>
                    <SelectInput
                      placeholder="Pilih jenis kelamin"
                      value={jenisKelamin}
                      onChange={(e) => setJenisKelamin(e.target.value)}
                      options={[
                        { value: "Laki-laki", label: "Laki-laki" },
                        { value: "Perempuan", label: "Perempuan" },
                      ]}
                    />
                  </Field>
                  <Field label="Agama" required>
                    <SelectInput
                      placeholder="Pilih agama"
                      value={agama}
                      onChange={(e) => setAgama(e.target.value)}
                      options={[
                        { value: "Islam", label: "Islam" },
                        { value: "Kristen", label: "Kristen" },
                        { value: "Katolik", label: "Katolik" },
                        { value: "Hindu", label: "Hindu" },
                        { value: "Buddha", label: "Buddha" },
                        { value: "Konghucu", label: "Konghucu" },
                      ]}
                    />
                  </Field>
                  <Field label="Tempat Lahir" required>
                    <TextInput 
                      icon={MapPin} 
                      value={tempatLahir} 
                      onChange={(e) => setTempatLahir(e.target.value)} 
                      placeholder="Kota kelahiran" 
                      required 
                    />
                  </Field>
                  <Field label="Tanggal Lahir" required>
                    <TextInput 
                      icon={CalendarDays} 
                      type="date" 
                      value={tanggalLahir} 
                      onChange={(e) => setTanggalLahir(e.target.value)} 
                      required 
                    />
                  </Field>
                </div>
              </div>

              {/* Data Kepegawaian */}
              <div>
                <h4 className="mb-3 flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-slate-700">
                  <Briefcase className="h-4 w-4 text-blue-600" />
                  Data Kepegawaian
                </h4>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <Field label="Jabatan" required>
                    <SelectInput
                      placeholder="Pilih jabatan"
                      value={jabatan}
                      onChange={(e) => setJabatan(e.target.value as JabatanOption)}
                      options={[
                        { value: "takmir", label: "Takmir" },
                        { value: "imam", label: "Imam Masjid" },
                        { value: "ga", label: "General Affair" },
                        { value: "finance", label: "Finance Controller" },
                        { value: "program", label: "Program Development" },
                      ]}
                    />
                  </Field>
                </div>
              </div>

              {/* Kontak & Akun */}
              <div>
                <h4 className="mb-3 flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-slate-700">
                  <Mail className="h-4 w-4 text-blue-600" />
                  Kontak &amp; Akun
                </h4>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <Field label="Email" required hint="Unik, format valid">
                    <TextInput 
                      icon={Mail} 
                      type="email" 
                      value={email} 
                      onChange={(e) => setEmail(e.target.value)} 
                      placeholder="nama@almaghfirah.or.id" 
                      required 
                    />
                  </Field>
                  <Field label="No. Telepon" required>
                    <TextInput 
                      icon={Phone} 
                      value={telepon} 
                      onChange={(e) => setTelepon(e.target.value)} 
                      placeholder="08xx xxxx xxxx" 
                      required 
                    />
                  </Field>
                  {!isEdit && (
                    <>
                      <Field label="Password" required hint="Default = NIP karyawan">
                        <TextInput 
                          icon={Lock} 
                          type="password" 
                          value={password} 
                          onChange={(e) => setPassword(e.target.value)} 
                          placeholder="Password default" 
                          required 
                        />
                      </Field>
                      <Field label="Konfirmasi Password" required>
                        <TextInput 
                          icon={Lock} 
                          type="password" 
                          value={confirmPassword} 
                          onChange={(e) => setConfirmPassword(e.target.value)} 
                          placeholder="Ulangi password" 
                          required 
                        />
                      </Field>
                    </>
                  )}
                  <div className="sm:col-span-2">
                    <Field label="Alamat" required>
                      <TextInput 
                        icon={MapPin} 
                        value={alamat} 
                        onChange={(e) => setAlamat(e.target.value)} 
                        placeholder="Alamat lengkap" 
                        required 
                      />
                    </Field>
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-3 pt-2 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  className="rounded-xl border border-slate-300 bg-white px-5 py-3 text-sm font-bold text-slate-600 hover:bg-slate-50 disabled:opacity-50"
                  disabled={loading}
                >
                  Batal
                </button>
                <PrimaryButton 
                  icon={CheckCircle2} 
                  type="submit" 
                  className="sm:w-auto"
                  disabled={loading}
                >
                  {isEdit ? "Simpan Perubahan" : "Simpan Data Karyawan"}
                </PrimaryButton>
              </div>
            </form>
          </CardBody>
        </Card>
      </div>
    </div>
  );
}

/* =============== Manajemen Kuis - List =============== */

export function ManajemenKuisList({ onNavigate }: { onNavigate?: (s: ScreenId) => void }) {
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
              Hapus Pertanyaan?
            </h3>
            <p className="mt-1 text-sm text-slate-500">
              Pertanyaan akan dihapus (soft delete). Jawaban historis tetap menampilkan
              teks soal (snapshot disimpan).
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

      {/* Stats */}
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <KpiCard label="Total Soal" value={5} icon={BookOpen} tone="blue" />
        <KpiCard label="Soal Aktif" value={4} icon={CheckCircle2} tone="green" />
        <KpiCard label="Soal Nonaktif" value={1} icon={Info} tone="amber" />
        <KpiCard label="Total Pengerjaan" value={120} icon={TrendingUp} tone="blue" />
      </div>

      <Card>
        <CardHeader
          title="Daftar Pertanyaan Kuis"
          icon={HelpCircle}
          iconColor="blue"
          action={
            <button
              onClick={() => onNavigate?.("tambah-pertanyaan")}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-bold text-white transition-colors hover:bg-blue-700"
            >
              <Plus className="h-4 w-4" />
              Tambah Pertanyaan
            </button>
          }
        />
        <CardBody className="space-y-3">
          {KUIS_LIST.map((q, i) => (
            <div
              key={q.id}
              className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <div className="mb-2 flex items-center gap-2">
                    <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-blue-600 text-xs font-bold text-white">
                      {i + 1}
                    </span>
                    <span className="text-xs font-bold text-slate-500">
                      Kunci: {q.kunci}
                    </span>
                  </div>
                  <p className="text-sm font-bold text-slate-900">{q.pertanyaan}</p>
                  <div className="mt-2 grid grid-cols-1 gap-1 sm:grid-cols-2">
                    {[
                      { k: "A", v: q.opsiA },
                      { k: "B", v: q.opsiB },
                      { k: "C", v: q.opsiC },
                      { k: "D", v: q.opsiD },
                    ].map((o) => (
                      <div
                        key={o.k}
                        className={cn(
                          "flex items-center gap-1.5 rounded-lg px-2 py-1 text-xs",
                          o.k === q.kunci
                            ? "bg-emerald-50 font-bold text-emerald-700"
                            : "text-slate-600",
                        )}
                      >
                        <span className="flex h-5 w-5 items-center justify-center rounded bg-slate-100 text-[10px] font-bold text-slate-600">
                          {o.k}
                        </span>
                        {o.v}
                        {o.k === q.kunci && <CheckCircle2 className="h-3.5 w-3.5" />}
                      </div>
                    ))}
                  </div>
                </div>
                <div className="flex shrink-0 gap-2">
                  <OutlineActionButton
                    icon={Trash2}
                    tone="red"
                    onClick={() => setShowDelete(q.id)}
                  >
                    Hapus
                  </OutlineActionButton>
                </div>
              </div>
            </div>
          ))}
        </CardBody>
      </Card>
    </div>
  );
}

/* =============== Tambah Pertanyaan Kuis =============== */

export function TambahPertanyaanKuis() {
  const [showSuccess, setShowSuccess] = React.useState(false);
  const [kunci, setKunci] = React.useState("A");

  return (
    <div className="space-y-6">
      {showSuccess && (
        <Modal onClose={() => setShowSuccess(false)}>
          <div className="text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100">
              <CheckCircle2 className="h-9 w-9 text-emerald-600" />
            </div>
            <h3 className="mt-4 text-xl font-extrabold text-slate-900">
              Pertanyaan Berhasil Disimpan!
            </h3>
            <p className="mt-1 text-sm text-slate-500">
              Pertanyaan baru telah ditambahkan ke bank soal kuis.
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
          <CardHeader title="Tambah Pertanyaan Kuis" icon={BookOpen} iconColor="blue" />
          <CardBody>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                setShowSuccess(true);
              }}
              className="space-y-5"
            >
              <Field label="Pertanyaan" required hint="Maks. 500 karakter">
                <TextArea
                  rows={3}
                  placeholder="Tulis pertanyaan kuis Sejarah Islam..."
                />
              </Field>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <Field label="Opsi A" required>
                  <TextInput defaultValue="" placeholder="Teks opsi A" required />
                </Field>
                <Field label="Opsi B" required>
                  <TextInput defaultValue="" placeholder="Teks opsi B" required />
                </Field>
                <Field label="Opsi C" required>
                  <TextInput defaultValue="" placeholder="Teks opsi C" required />
                </Field>
                <Field label="Opsi D" required>
                  <TextInput defaultValue="" placeholder="Teks opsi D" required />
                </Field>
              </div>

              <Field label="Kunci Jawaban" required>
                <div className="grid grid-cols-4 gap-2">
                  {["A", "B", "C", "D"].map((k) => (
                    <button
                      key={k}
                      type="button"
                      onClick={() => setKunci(k)}
                      className={cn(
                        "flex h-11 items-center justify-center rounded-xl border text-sm font-bold transition-colors",
                        kunci === k
                          ? "border-emerald-500 bg-emerald-50 text-emerald-700"
                          : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50",
                      )}
                    >
                      {k}
                    </button>
                  ))}
                </div>
              </Field>

              <Field label="Pembahasan" required hint="Maks. 1000 karakter">
                <TextArea
                  rows={4}
                  placeholder="Jelaskan pembahasan jawaban benar..."
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
                  Simpan Pertanyaan
                </PrimaryButton>
              </div>
            </form>
          </CardBody>
        </Card>
      </div>
    </div>
  );
}

/* =============== Statistik Hasil Kuis =============== */

export function StatistikKuis() {
  const correct = STATISTIK_KUIS.filter((s) => s.benar).length;
  const total = STATISTIK_KUIS.length;
  const persen = Math.round((correct / total) * 100);

  return (
    <div className="space-y-6">
      {/* Summary */}
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <KpiCard label="Total Pengerjaan" value={120} icon={TrendingUp} tone="blue" />
        <KpiCard label="Jawaban Benar" value={98} icon={CheckCircle2} tone="green" />
        <KpiCard label="Jawaban Salah" value={22} icon={X} tone="red" />
        <KpiCard label="Persentase Benar" value="82%" icon={Percent} tone="green" />
      </div>

      {/* Chart + insight */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader title="Tingkat Kesalahan per Soal" icon={BarChart3} iconColor="blue" />
          <CardBody>
            <div className="space-y-3">
              {KUIS_LIST.slice(0, 5).map((q, i) => {
                const salah = [12, 8, 5, 3, 2][i] ?? 1;
                const max = 12;
                return (
                  <div key={q.id}>
                    <div className="mb-1 flex items-center justify-between text-xs">
                      <span className="truncate font-semibold text-slate-700">
                        Soal #{i + 1}: {q.pertanyaan.slice(0, 50)}...
                      </span>
                      <span className="ml-2 font-bold text-rose-600">
                        {salah}x salah
                      </span>
                    </div>
                    <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-rose-400 to-rose-500"
                        style={{ width: `${(salah / max) * 100}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </CardBody>
        </Card>

        <Card className="lg:col-span-1">
          <CardHeader title="Insight" icon={Award} iconColor="green" />
          <CardBody className="space-y-3 text-sm">
            <div className="rounded-xl bg-emerald-50 p-3">
              <div className="flex items-center gap-2 font-bold text-emerald-800">
                <Award className="h-4 w-4" />
                Soal Paling Mudah
              </div>
              <p className="mt-1 text-xs text-emerald-700">
                &ldquo;Al-Quran pertama kali diturunkan di gua?&rdquo; - 95% benar
              </p>
            </div>
            <div className="rounded-xl bg-rose-50 p-3">
              <div className="flex items-center gap-2 font-bold text-rose-800">
                <Info className="h-4 w-4" />
                Soal Paling Sulit
              </div>
              <p className="mt-1 text-xs text-rose-700">
                &ldquo;Pada tahun berapa Hijriah dimulai?&rdquo; - 38% salah
              </p>
            </div>
          </CardBody>
        </Card>
      </div>

      {/* Detail table */}
      <Card>
        <CardHeader
          title="Detail Pengerjaan Kuis"
          icon={BookOpen}
          iconColor="blue"
          action={
            <span className="text-xs text-slate-500">
              Menampilkan <b className="text-slate-700">1 - 6</b> dari{" "}
              <b className="text-slate-700">120 data</b>
            </span>
          }
        />
        <CardBody className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-blue-600 text-left text-xs font-bold uppercase tracking-wider text-white">
                  <th className="px-3 py-2.5">No</th>
                  <th className="px-3 py-2.5">Karyawan</th>
                  <th className="px-3 py-2.5">Tanggal</th>
                  <th className="px-3 py-2.5">Soal</th>
                  <th className="px-3 py-2.5">Jawaban</th>
                  <th className="px-3 py-2.5 text-right">Hasil</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {STATISTIK_KUIS.map((s, i) => (
                  <tr key={s.id} className="hover:bg-slate-50">
                    <td className="px-3 py-3 font-medium text-slate-500">{i + 1}</td>
                    <td className="px-3 py-3 font-bold text-slate-900">{s.nama}</td>
                    <td className="px-3 py-3 text-slate-600">{s.tanggal}</td>
                    <td className="px-3 py-3 text-slate-600">{s.soal}</td>
                    <td className="px-3 py-3">
                      <span className="inline-flex h-6 w-6 items-center justify-center rounded-lg bg-slate-100 text-xs font-bold text-slate-600">
                        {s.jawaban}
                      </span>
                    </td>
                    <td className="px-3 py-3 text-right">
                      <span
                        className={cn(
                          "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-bold",
                          s.benar
                            ? "bg-emerald-100 text-emerald-700"
                            : "bg-rose-100 text-rose-700",
                        )}
                      >
                        {s.benar ? "Benar" : "Salah"}
                      </span>
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
