"use client";

import * as React from "react";
import {
  ShieldCheck,
  User,
  Users,
  Lock,
  Mail,
  Eye,
  EyeOff,
} from "lucide-react";
import { MosqueLogo } from "./MosqueIllustration";
import type { Role } from "./navigation";
import { cn } from "@/lib/utils";

interface LoginScreenProps {
  onLogin: (role: Role, user?: { id: string; name: string; email: string; role: Role }) => void;
}

export function LoginScreen({ onLogin }: LoginScreenProps) {
  const [role, setRole] = React.useState<Role>("admin");
  const [showPassword, setShowPassword] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    const identifier = formData.get("username") as string;
    const password = formData.get("password") as string;
    const rememberMe = formData.get("remember") === "on";
    const selectedRole = role;

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          identifier,
          password,
          rememberMe,
          expectedRole: selectedRole,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Login gagal");
        setIsLoading(false);
        return;
      }

      // Role is determined by server, not trusted from frontend
      const userRole = data.user.role as Role;
      onLogin(userRole, {
        id: data.user.id,
        name: data.user.name,
        email: data.user.email,
        role: userRole,
      });
    } catch (error) {
      setError("Terjadi kesalahan jaringan");
      setIsLoading(false);
    }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-x-hidden bg-slate-100 p-4 text-slate-800 sm:p-6 lg:p-10">
      {/* Ambient background glows */}
      <div className="pointer-events-none fixed left-1/4 top-0 -z-10 h-96 w-96 -translate-y-1/2 rounded-full bg-emerald-200/40 blur-3xl" />
      <div className="pointer-events-none fixed bottom-0 right-1/4 -z-10 h-[32rem] w-[32rem] translate-y-1/3 rounded-full bg-blue-200/40 blur-3xl" />

      <main className="relative w-full max-w-[1140px] overflow-hidden rounded-3xl border border-slate-200/80 bg-white shadow-card">
        <div className="grid min-h-[660px] grid-cols-1 lg:grid-cols-12">
          {/* Left branding panel */}
          <section className="relative flex flex-col justify-between overflow-hidden border-b border-slate-100 bg-gradient-to-b from-[#f0f9ff] via-[#ecfdf5] to-[#f0fdf4] p-8 sm:p-12 lg:col-span-6 lg:border-b-0 lg:border-r">
            {/* Decorative wave */}
            <svg
              className="pointer-events-none absolute right-0 top-0 -mr-1 hidden h-full w-36 text-emerald-200/40 lg:block"
              fill="currentColor"
              preserveAspectRatio="none"
              viewBox="0 0 100 800"
            >
              <path d="M0,0 Q60,200 40,400 T80,800 L100,800 L100,0 Z" />
            </svg>

            {/* Top header: logo & identity */}
            <div className="relative z-10">
              <div className="flex items-center space-x-4">
                <div className="flex h-24 w-24 shrink-0 items-center justify-center">
                  <MosqueLogo className="h-24 w-24" />
                </div>
                <div>
                  <h1 className="text-3xl font-extrabold leading-tight tracking-tight text-slate-900 sm:text-4xl">
                    Yayasan
                    <br />
                    <span className="text-blue-900 font-extrabold">Al-Maghfirah</span>
                  </h1>
                  <p className="mt-1 text-base font-bold tracking-wide text-slate-700">
                    Sistem Absensi Karyawan
                  </p>
                  <div className="mt-2.5 h-1.5 w-20 rounded-full bg-gradient-to-r from-emerald-500 to-green-600" />
                </div>
              </div>
              <div className="mt-6 max-w-sm">
                <p className="border-l-2 border-emerald-500/60 pl-3 text-base font-medium italic leading-relaxed text-slate-700 sm:text-lg">
                  &ldquo;Disiplin dalam Kehadiran,
                  <br />
                  Amanah dalam Tanggung Jawab.&rdquo;
                </p>
              </div>
            </div>

            {/* Mosque & Landscape Illustration Artboard */}
            <div className="pointer-events-none relative mt-6 flex h-72 w-full select-none items-end justify-center sm:h-80">
              {/* Clouds */}
              <div className="absolute left-8 top-6 h-6 w-20 rounded-full bg-white/70 opacity-80 shadow-xs backdrop-blur-xs" />
              <div className="absolute left-12 top-3 h-10 w-12 rounded-full bg-white/70 opacity-80" />
              <div className="absolute right-14 top-10 h-8 w-28 rounded-full bg-white/80 opacity-80 shadow-xs" />
              <div className="absolute right-20 top-6 h-12 w-16 rounded-full bg-white/80 opacity-80" />

              <div className="relative z-10 flex w-full max-w-lg items-end justify-center pb-3">
                <img
                  src="/mosque-photo.png"
                  alt="Ilustrasi Masjid Yayasan Al-Maghfirah"
                  className="max-h-60 w-full object-contain drop-shadow-md sm:max-h-64"
                  draggable={false}
                />
              </div>

              {/* Foreground waves */}
              <svg
                className="absolute -bottom-1 left-0 z-30 h-16 w-full text-emerald-600"
                fill="currentColor"
                preserveAspectRatio="none"
                viewBox="0 0 500 120"
              >
                <path d="M0,40 C150,110 350,10 500,70 L500,120 L0,120 Z" fill="#16a34a" />
              </svg>
              <svg
                className="absolute -bottom-2 left-0 z-40 h-14 w-full text-blue-600"
                fill="currentColor"
                preserveAspectRatio="none"
                viewBox="0 0 500 120"
              >
                <path d="M0,50 C120,0 280,100 500,20 L500,120 L0,120 Z" fill="#2563eb" />
              </svg>
              <svg
                className="absolute -bottom-3 left-0 z-50 h-8 w-full text-sky-400 opacity-90"
                fill="currentColor"
                preserveAspectRatio="none"
                viewBox="0 0 500 120"
              >
                <path d="M0,20 C180,80 320,-10 500,50 L500,120 L0,120 Z" fill="#38bdf8" />
              </svg>
            </div>
          </section>

          {/* Right auth form */}
          <section className="flex flex-col justify-center bg-white p-8 sm:p-12 lg:col-span-6 lg:p-14">
            <div className="mx-auto w-full max-w-md">
              <div className="mb-7 flex items-start space-x-4">
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-emerald-200/80 bg-emerald-50 text-emerald-600 shadow-xs">
                  <ShieldCheck className="h-7 w-7" />
                </div>
                <div>
                  <h2 className="text-2xl font-extrabold leading-snug tracking-tight text-slate-900 sm:text-[26px]">
                    Login ke Sistem Absensi
                  </h2>
                  <p className="mt-1 text-sm font-medium text-slate-500">
                    Pilih jenis akun dan masuk ke sistem.
                  </p>
                </div>
              </div>

              {/* Role switcher */}
              <div className="mb-7" data-purpose="role-selector">
                <div
                  aria-label="Tipe Pengguna"
                  className="grid grid-cols-2 gap-3 rounded-2xl border border-slate-200/70 bg-slate-100/90 p-1.5"
                  role="tablist"
                >
                  <button
                    aria-selected={role === "karyawan"}
                    className={cn(
                      "group relative flex items-center justify-center space-x-2.5 rounded-xl px-4 py-3 text-sm font-semibold transition-all duration-200 focus:outline-none focus:ring-2",
                      role === "karyawan"
                        ? "bg-emerald-600 text-white shadow-glow border border-emerald-600 focus:ring-emerald-500"
                        : "border border-slate-200/60 bg-white text-slate-700 shadow-sm hover:text-slate-900 focus:ring-emerald-500",
                    )}
                    onClick={() => setRole("karyawan")}
                    role="tab"
                    type="button"
                  >
                    <Users
                      className={cn(
                        "h-5 w-5 transition-colors",
                        role === "karyawan" ? "text-emerald-50" : "text-slate-500",
                      )}
                    />
                    <span>Karyawan</span>
                  </button>
                  <button
                    aria-selected={role === "admin"}
                    className={cn(
                      "group relative flex items-center justify-center space-x-2.5 rounded-xl px-4 py-3 text-sm font-semibold transition-all duration-200 focus:outline-none focus:ring-2",
                      role === "admin"
                        ? "bg-blue-600 text-white shadow-blue-glow border border-blue-600 focus:ring-blue-500"
                        : "border border-slate-200/60 bg-white text-slate-700 shadow-sm hover:text-slate-900 focus:ring-blue-500",
                    )}
                    onClick={() => setRole("admin")}
                    role="tab"
                    type="button"
                  >
                    <User
                      className={cn(
                        "h-5 w-5 transition-colors",
                        role === "admin" ? "text-blue-50" : "text-slate-500",
                      )}
                    />
                    <span>Administrator</span>
                  </button>
                </div>
              </div>

              {/* Error message */}
              {error && (
                <div className="mb-4 rounded-lg bg-rose-50 border border-rose-200 p-3 text-sm text-rose-700">
                  {error}
                </div>
              )}

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="space-y-1.5">
                  <label className="block text-sm font-bold text-slate-800" htmlFor="username">
                    Username atau Email <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative rounded-xl shadow-xs">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
                      <Mail className="h-5 w-5" />
                    </div>
                    <input
                      className="block w-full rounded-xl border border-slate-300 bg-white px-4 py-3.5 pl-11 text-sm transition-colors placeholder:text-slate-400 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500"
                      id="username"
                      name="username"
                      placeholder="Masukan Email"
                      required
                      type="text"
                      defaultValue=""
                      disabled={isLoading}
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="block text-sm font-bold text-slate-800" htmlFor="password">
                    Password <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative rounded-xl shadow-xs">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
                      <Lock className="h-5 w-5" />
                    </div>
                    <input
                      className="block w-full rounded-xl border border-slate-300 bg-white px-4 py-3.5 pl-11 pr-12 text-sm transition-colors placeholder:text-slate-400 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500"
                      id="password"
                      name="password"
                      placeholder="Masukan Password"
                      required
                      type={showPassword ? "text" : "password"}
                      defaultValue=""
                      disabled={isLoading}
                    />
                    <button
                      aria-label="Tampilkan atau sembunyikan password"
                      className="absolute inset-y-0 right-0 flex items-center pr-3.5 text-slate-400 transition-colors hover:text-slate-600 focus:outline-none"
                      onClick={() => setShowPassword((s) => !s)}
                      type="button"
                      disabled={isLoading}
                    >
                      {showPassword ? (
                        <Eye className="h-5 w-5" />
                      ) : (
                        <EyeOff className="h-5 w-5" />
                      )}
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-1">
                  <label className="flex cursor-pointer select-none items-center space-x-2.5">
                    <input
                      className="h-4 w-4 cursor-pointer rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
                      id="remember"
                      name="remember"
                      type="checkbox"
                      disabled={isLoading}
                    />
                    <span className="text-sm font-semibold text-slate-700">Ingat Saya</span>
                  </label>
                  <a
                    className="text-sm font-semibold text-blue-600 transition-colors hover:text-blue-700 hover:underline focus:outline-none"
                    href="#forgot"
                  >
                    Lupa Password?
                  </a>
                </div>

                <div className="pt-2">
                  <button
                    className="w-full flex items-center justify-center space-x-2.5 rounded-xl bg-gradient-to-r from-emerald-600 via-green-600 to-emerald-600 px-6 py-3.5 text-base font-bold text-white shadow-glow transition-all duration-200 hover:from-emerald-700 hover:to-green-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed"
                    type="submit"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <span className="flex items-center space-x-2">
                        <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        <span>Masuk...</span>
                      </span>
                    ) : (
                      <span>Login</span>
                    )}
                  </button>
                </div>
              </form>

              <footer className="mt-8 text-center">
                <p className="text-xs font-medium text-slate-400">
                  &copy; 2026 Yayasan Al-Maghfirah. Hak Cipta Dilindungi.
                </p>
              </footer>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}