import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

const jakartaSans = Plus_Jakarta_Sans({
  variable: "--font-jakarta",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Sistem Absensi Karyawan - Yayasan Al-Maghfirah",
  description:
    "Sistem Absensi Karyawan Yayasan Al-Maghfirah - Disiplin dalam Kehadiran, Amanah dalam Tanggung Jawab.",
  keywords: [
    "Yayasan Al-Maghfirah",
    "Sistem Absensi",
    "Absensi Karyawan",
    "Kehadiran",
    "Yayasan",
  ],
  authors: [{ name: "Yayasan Al-Maghfirah" }],
  icons: {
    icon: "/logo-almaghfirah.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" suppressHydrationWarning>
      <body
        className={`${jakartaSans.variable} font-sans antialiased bg-slate-100 text-slate-800 selection:bg-emerald-500 selection:text-white`}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}
