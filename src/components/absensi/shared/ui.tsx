"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";

/* Card primitives matching the design language */

export function Card({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-slate-200/80 bg-white shadow-sm",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardHeader({
  title,
  subtitle,
  icon: Icon,
  iconColor = "blue",
  action,
  className,
}: {
  title: string;
  subtitle?: string;
  icon?: LucideIcon;
  iconColor?: "blue" | "green" | "amber" | "red" | "slate";
  action?: React.ReactNode;
  className?: string;
}) {
  const colorMap: Record<string, string> = {
    blue: "bg-blue-50 text-blue-600 border-blue-100",
    green: "bg-emerald-50 text-emerald-600 border-emerald-100",
    amber: "bg-amber-50 text-amber-600 border-amber-100",
    red: "bg-rose-50 text-rose-600 border-rose-100",
    slate: "bg-slate-100 text-slate-600 border-slate-200",
  };
  return (
    <div
      className={cn(
        "flex items-center justify-between gap-3 border-b border-slate-100 px-5 py-4",
        className,
      )}
    >
      <div className="flex items-center gap-3">
        {Icon && (
          <div
            className={cn(
              "flex h-9 w-9 items-center justify-center rounded-xl border",
              colorMap[iconColor],
            )}
          >
            <Icon className="h-5 w-5" />
          </div>
        )}
        <div>
          <h3 className="text-base font-bold text-slate-900">{title}</h3>
          {subtitle && <p className="text-xs text-slate-500">{subtitle}</p>}
        </div>
      </div>
      {action}
    </div>
  );
}

export function CardBody({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("p-5", className)} {...props}>
      {children}
    </div>
  );
}

/* KPI Card */

export type KpiTone = "green" | "blue" | "amber" | "red" | "teal" | "slate";

export function KpiCard({
  label,
  value,
  unit,
  icon: Icon,
  tone = "blue",
  highlight = false,
  pill,
}: {
  label: string;
  value: string | number;
  unit?: string;
  icon: LucideIcon;
  tone?: KpiTone;
  highlight?: boolean;
  pill?: string;
}) {
  const toneMap: Record<
    KpiTone,
    { tile: string; icon: string; ring: string }
  > = {
    green: {
      tile: "bg-emerald-100",
      icon: "text-emerald-600",
      ring: "border-emerald-200 bg-emerald-50/40",
    },
    blue: {
      tile: "bg-blue-100",
      icon: "text-blue-600",
      ring: "border-blue-200 bg-blue-50/40",
    },
    amber: {
      tile: "bg-amber-100",
      icon: "text-amber-600",
      ring: "border-amber-200 bg-amber-50/40",
    },
    red: {
      tile: "bg-rose-100",
      icon: "text-rose-600",
      ring: "border-rose-200 bg-rose-50/40",
    },
    teal: {
      tile: "bg-teal-100",
      icon: "text-teal-600",
      ring: "border-teal-200 bg-teal-50/40",
    },
    slate: {
      tile: "bg-slate-100",
      icon: "text-slate-600",
      ring: "border-slate-200",
    },
  };
  const t = toneMap[tone];
  return (
    <div
      className={cn(
        "flex items-center gap-3 rounded-2xl border bg-white p-4 shadow-sm transition-shadow hover:shadow-md",
        highlight ? t.ring : "border-slate-200/80",
      )}
    >
      <div
        className={cn(
          "flex h-11 w-11 shrink-0 items-center justify-center rounded-xl",
          t.tile,
        )}
      >
        <Icon className={cn("h-5 w-5", t.icon)} />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-xs font-bold tracking-normal text-slate-500 leading-tight min-h-[2rem]">
          {label}
        </p>
        <div className="flex items-baseline gap-1.5">
          <span className="text-2xl font-extrabold leading-none text-slate-900">
            {value}
          </span>
          {unit && <span className="text-xs font-medium text-slate-400">{unit}</span>}
          {pill && (
            <span
              className={cn(
                "ml-auto rounded-full px-2 py-0.5 text-[11px] font-bold",
                tone === "green" && "bg-emerald-100 text-emerald-700",
                tone === "amber" && "bg-amber-100 text-amber-700",
                tone === "red" && "bg-rose-100 text-rose-700",
                tone === "blue" && "bg-blue-100 text-blue-700",
              )}
            >
              {pill}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

/* Status badges */

export type StatusType =
  | "hadir"
  | "terlambat"
  | "izin"
  | "sakit"
  | "cuti"
  | "tidak-hadir"
  | "lembur"
  | "libur"
  | "pending"
  | "approved"
  | "rejected";

export function StatusBadge({ status }: { status: StatusType }) {
  const map: Record<
    StatusType,
    { label: string; cls: string }
  > = {
    hadir: { label: "Hadir", cls: "bg-emerald-100 text-emerald-700" },
    terlambat: { label: "Terlambat", cls: "bg-amber-100 text-amber-700" },
    izin: { label: "Izin", cls: "bg-blue-100 text-blue-700" },
    sakit: { label: "Sakit", cls: "bg-sky-100 text-sky-700" },
    cuti: { label: "Cuti", cls: "bg-teal-100 text-teal-700" },
    "tidak-hadir": { label: "Tidak Hadir", cls: "bg-rose-100 text-rose-700" },
    lembur: {
      label: "Lembur",
      cls: "bg-white text-emerald-700 border border-emerald-300",
    },
    libur: { label: "Libur", cls: "bg-slate-100 text-slate-600" },
    pending: { label: "Menunggu", cls: "bg-blue-100 text-blue-700" },
    approved: { label: "Disetujui", cls: "bg-emerald-100 text-emerald-700" },
    rejected: { label: "Ditolak", cls: "bg-rose-100 text-rose-700" },
  };
  const m = map[status];
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-bold",
        m.cls,
      )}
    >
      {m.label}
    </span>
  );
}

/* Section title pill */

export function SectionPill({
  icon: Icon,
  children,
  tone = "blue",
  active = true,
}: {
  icon?: LucideIcon;
  children: React.ReactNode;
  tone?: "blue" | "green" | "amber" | "red" | "slate";
  active?: boolean;
}) {
  const toneMap: Record<string, string> = {
    blue: active ? "bg-blue-600 text-white" : "bg-slate-100 text-slate-600",
    green: active ? "bg-emerald-600 text-white" : "bg-slate-100 text-slate-600",
    amber: active ? "bg-amber-500 text-white" : "bg-slate-100 text-slate-600",
    red: active ? "bg-rose-500 text-white" : "bg-slate-100 text-slate-600",
    slate: "bg-slate-100 text-slate-600",
  };
  return (
    <button
      className={cn(
        "inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-bold transition-colors",
        toneMap[tone],
      )}
    >
      {Icon && <Icon className="h-4 w-4" />}
      {children}
    </button>
  );
}

/* Page footer */

export function PageFooter() {
  return (
    <footer className="mt-auto border-t border-slate-200 bg-white px-4 py-4 sm:px-6 lg:px-8">
      <div className="flex flex-col items-center justify-between gap-2 text-xs text-slate-400 sm:flex-row">
        <p className="font-medium">
          &copy; 2026 Yayasan Al-Maghfirah. Hak Cipta Dilindungi.
        </p>
        <div className="flex items-center gap-3">
          <a href="#" className="font-medium hover:text-slate-600">
            Bantuan &amp; Dukungan
          </a>
          <span className="text-slate-300">&bull;</span>
          <a href="#" className="font-medium hover:text-slate-600">
            Kebijakan Privasi
          </a>
        </div>
      </div>
    </footer>
  );
}

/* Primary button (green gradient, matches Login "Lakukan Absensi" style) */

export function PrimaryButton({
  children,
  className,
  icon: Icon,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & { icon?: LucideIcon }) {
  return (
    <button
      className={cn(
        "inline-flex w-full items-center justify-center gap-2.5 rounded-xl bg-gradient-to-r from-emerald-600 via-green-600 to-emerald-600 px-6 py-3.5 text-base font-bold text-white shadow-glow transition-all hover:from-emerald-700 hover:to-green-700 active:scale-[0.99] focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2",
        className,
      )}
      {...props}
    >
      {Icon && <Icon className="h-5 w-5" />}
      {children}
    </button>
  );
}

/* Blue primary button (admin actions) */

export function BlueButton({
  children,
  className,
  icon: Icon,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & { icon?: LucideIcon }) {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-bold text-white shadow-sm transition-all hover:bg-blue-700 active:scale-[0.99] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2",
        className,
      )}
      {...props}
    >
      {Icon && <Icon className="h-4 w-4" />}
      {children}
    </button>
  );
}

/* Outlined action button (Edit/Hapus style) */

export function OutlineActionButton({
  children,
  className,
  icon: Icon,
  tone = "green",
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & {
  icon?: LucideIcon;
  tone?: "green" | "red" | "blue";
}) {
  const toneMap = {
    green: "border-emerald-200 text-emerald-700 hover:bg-emerald-50",
    red: "border-rose-200 text-rose-600 hover:bg-rose-50",
    blue: "border-blue-200 text-blue-700 hover:bg-blue-50",
  };
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center gap-1.5 rounded-lg border bg-white px-3 py-1.5 text-xs font-bold transition-colors",
        toneMap[tone],
        className,
      )}
      {...props}
    >
      {Icon && <Icon className="h-3.5 w-3.5" />}
      {children}
    </button>
  );
}

/* Info row (label : value) used in profile / detail cards */

export function InfoRow({
  label,
  value,
  icon: Icon,
}: {
  label: string;
  value: React.ReactNode;
  icon?: LucideIcon;
}) {
  return (
    <div className="flex items-start justify-between gap-3 py-2.5">
      <div className="flex items-center gap-2 text-sm font-semibold text-slate-600">
        {Icon && <Icon className="h-4 w-4 text-slate-400" />}
        {label}
      </div>
      <div className="text-right text-sm font-semibold text-slate-900">{value}</div>
    </div>
  );
}
