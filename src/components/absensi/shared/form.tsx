"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";
import { ChevronDown } from "lucide-react";

/* Labeled input field with leading icon (matches design) */

export function Field({
  label,
  required,
  hint,
  icon: Icon,
  children,
}: {
  label: string;
  required?: boolean;
  hint?: string;
  icon?: LucideIcon;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <label className="block text-sm font-bold text-slate-800">
        {label} {required && <span className="text-rose-500">*</span>}
      </label>
      {children}
      {hint && <p className="text-xs text-slate-500">{hint}</p>}
    </div>
  );
}

export function TextInput({
  className,
  icon: Icon,
  defaultValue,
  placeholder,
  type = "text",
  readOnly,
  ...props
}: React.InputHTMLAttributes<HTMLInputElement> & { icon?: LucideIcon }) {
  return (
    <div className="relative rounded-xl shadow-xs">
      {Icon && (
        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
          <Icon className="h-5 w-5" />
        </div>
      )}
      <input
        className={cn(
          "block w-full rounded-xl border border-slate-300 bg-white py-3 pr-4 text-sm transition-colors placeholder:text-slate-400 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500",
          Icon ? "pl-11" : "pl-4",
          readOnly && "bg-slate-50 text-slate-600",
          className,
        )}
        defaultValue={defaultValue}
        placeholder={placeholder}
        type={type}
        readOnly={readOnly}
        {...props}
      />
    </div>
  );
}

export function SelectInput({
  className,
  options,
  defaultValue,
  value,
  onChange,
  placeholder,
  required,
}: {
  className?: string;
  options: { value: string; label: string }[];
  defaultValue?: string;
  value?: string;
  onChange?: (event: React.ChangeEvent<HTMLSelectElement>) => void;
  placeholder?: string;
  required?: boolean;
}) {
  return (
    <div className="relative">
      <select
        className={cn(
          "block w-full appearance-none rounded-xl border border-slate-300 bg-white py-3 pr-10 pl-4 text-sm font-medium text-slate-700 transition-colors focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500",
          className,
        )}
        {...(value !== undefined ? { value } : { defaultValue: defaultValue ?? "" })}
        onChange={onChange}
        required={required}
      >
        {placeholder && <option key="placeholder" value="">{placeholder}</option>}
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
      <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
    </div>
  );
}

export function TextArea({
  className,
  defaultValue,
  value,
  placeholder,
  rows = 4,
  onChange,
}: {
  className?: string;
  defaultValue?: string;
  value?: string;
  placeholder?: string;
  rows?: number;
  onChange?: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
}) {
  return (
    <textarea
      className={cn(
        "block w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm transition-colors placeholder:text-slate-400 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500",
        className,
      )}
      value={value !== undefined ? value : defaultValue ?? ""}
      placeholder={placeholder}
      rows={rows}
      onChange={onChange}
    />
  );
}

/* Map placeholder - reproduces the pale mint-green map background with geofence circle */

export function MapPlaceholder({
  inRadius = true,
  distance = 35,
}: {
  inRadius?: boolean;
  distance?: number;
}) {
  return (
    <div className="relative aspect-[16/10] w-full overflow-hidden rounded-2xl border border-emerald-100 bg-emerald-50">
      {/* Abstract road shapes */}
      <svg className="absolute inset-0 h-full w-full" viewBox="0 0 400 250" preserveAspectRatio="none">
        <path d="M0 80 Q100 60 200 100 T400 70" stroke="#bbf7d0" strokeWidth="6" fill="none" />
        <path d="M0 180 Q120 200 240 160 T400 180" stroke="#bbf7d0" strokeWidth="6" fill="none" />
        <path d="M50 0 L60 100 L40 200 L70 250" stroke="#dcfce7" strokeWidth="4" fill="none" />
        <path d="M280 0 L290 80 L270 160 L300 250" stroke="#dcfce7" strokeWidth="4" fill="none" />
        <rect x="80" y="120" width="40" height="30" rx="2" fill="#dcfce7" opacity="0.6" />
        <rect x="200" y="40" width="30" height="20" rx="2" fill="#dcfce7" opacity="0.6" />
        <rect x="320" y="180" width="35" height="25" rx="2" fill="#dcfce7" opacity="0.6" />
      </svg>

      {/* Geofence dashed circle */}
      <div className="absolute left-1/2 top-1/2 h-32 w-32 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-dashed border-emerald-500 bg-emerald-500/5" />

      {/* Center marker (building/institution pin) */}
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-full">
        <div className="relative flex flex-col items-center">
          <div className="flex h-9 w-9 items-center justify-center rounded-full rounded-bl-none bg-emerald-600 shadow-lg shadow-emerald-500/30">
            <svg className="h-5 w-5 text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 21h18M5 21V7l8-4v18M19 21V11l-6-4" />
            </svg>
          </div>
          <div className="h-2 w-2 -mt-1 rotate-45 bg-emerald-600" />
        </div>
      </div>

      {/* Zoom controls */}
      <div className="absolute right-3 top-3 flex flex-col gap-1">
        <button className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 shadow-sm hover:bg-slate-50">
          +
        </button>
        <button className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 shadow-sm hover:bg-slate-50">
          &minus;
        </button>
      </div>
    </div>
  );
}

/* Date chip (used in headers) */

export function DateChip({ date }: { date: string }) {
  return (
    <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1.5 text-sm font-semibold text-slate-700 shadow-sm">
      <svg className="h-4 w-4 text-blue-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <rect x="3" y="4" width="18" height="18" rx="2" />
        <path d="M16 2v4M8 2v4M3 10h18" strokeLinecap="round" />
      </svg>
      {date}
    </div>
  );
}

/* Empty state dash */

export function Dash() {
  return <span className="text-slate-300">&ndash;</span>;
}
