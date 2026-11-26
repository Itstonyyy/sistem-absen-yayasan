import { ReactNode } from "react";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { verifyToken } from "@/lib/auth";
import { DashboardAdmin } from "@/components/absensi/screens/DashboardAdmin";

export default async function AdminLayout({
  children,
}: {
  children: ReactNode;
}) {
  // Check authentication
  const cookieStore = await cookies();
  const token = cookieStore.get("auth-token")?.value;

  if (!token) {
    redirect("/login");
  }

  const payload = verifyToken(token);
  if (!payload || payload.role !== "admin") {
    redirect("/");
  }

  return (
    <div className="min-h-screen bg-slate-100">
      {/* Admin content */}
      {children}
    </div>
  );
}