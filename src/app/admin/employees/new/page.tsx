import { DataKaryawanForm } from "@/components/absensi/screens/AdminScreens2";

export const metadata = {
  title: "Tambah Karyawan - Admin",
  description: "Tambah data karyawan baru",
};

export default function NewEmployeePage() {
  return <DataKaryawanForm mode="tambah" />;
}