"use client";

import * as React from "react";
import { Home } from "lucide-react";
import { MobileSidebarToggle } from "./Sidebar";
import { getBreadcrumb, type Role, type ScreenId } from "./navigation";
import { cn } from "@/lib/utils";

interface TopHeaderProps {
  role: Role;
  screenId: ScreenId;
  userName: string;
  userRole: string;
  onOpenMobileSidebar: () => void;
}

export function TopHeader({
  role,
  screenId,
  userName,
  userRole,
  onOpenMobileSidebar,
}: TopHeaderProps) {
  const { crumbs, pageTitle, pageSubtitle, pageIcon } = getBreadcrumb(role, screenId);
  const PageIcon = pageIcon;

  return (
    <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/80">
      {/* Top utility bar */}
      <div className="flex items-center justify-between gap-3 px-4 py-3 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3">
          <MobileSidebarToggle onClick={onOpenMobileSidebar} />
          <nav className="hidden items-center gap-1.5 text-sm sm:flex">
            <Home className="h-4 w-4 text-blue-600" />
            <span className="text-slate-400">/</span>
            {crumbs.map((c, i) => (
              <React.Fragment key={i}>
                <span
                  className={cn(
                    "font-semibold",
                    i === crumbs.length - 1 ? "text-slate-900" : "text-slate-500",
                  )}
                >
                  {c}
                </span>
                {i < crumbs.length - 1 && <span className="text-slate-400">/</span>}
              </React.Fragment>
            ))}
          </nav>
        </div>
        <div className="flex items-center gap-2 sm:gap-3">
          <div
            className="flex items-center gap-2.5 rounded-full border border-transparent p-1 pr-2"
            aria-label={`Akun aktif: ${userName}, ${userRole}`}
            title="Akun yang sedang login"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-emerald-500 to-green-600 text-white shadow-sm">
              <svg
                className="h-5 w-5"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                />
              </svg>
            </div>
            <div className="hidden text-left sm:block">
              <p className="text-sm font-bold leading-tight text-slate-900">{userName}</p>
              <p className="text-[11px] font-medium leading-tight text-slate-500">{userRole}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Page title */}
      <div className="flex items-center gap-3 px-4 pb-4 pt-1 sm:px-6 lg:px-8">
        <div
          className={cn(
            "flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border",
            role === "admin"
              ? "border-blue-100 bg-blue-50 text-blue-600"
              : "border-emerald-100 bg-emerald-50 text-emerald-600",
          )}
        >
          <PageIcon className="h-6 w-6" />
        </div>
        <div className="min-w-0">
          <h2 className="truncate text-xl font-extrabold tracking-tight text-slate-900 sm:text-2xl">
            {pageTitle}
          </h2>
          {pageSubtitle && (
            <p className="truncate text-sm text-slate-500">{pageSubtitle}</p>
          )}
        </div>
      </div>
    </header>
  );
}
