"use client";

import * as React from "react";
import { ChevronDown, LogOut, X, Menu } from "lucide-react";
import { MosqueLogo, MosqueIllustration } from "./MosqueIllustration";
import {
  KARYAWAN_NAV,
  ADMIN_NAV,
  isNavGroup,
  type NavItem,
  type Role,
  type ScreenId,
} from "./navigation";
import { cn } from "@/lib/utils";

interface SidebarProps {
  role: Role;
  activeScreen: ScreenId;
  onNavigate: (screen: ScreenId) => void;
  onLogout: () => void;
  mobileOpen: boolean;
  setMobileOpen: (open: boolean) => void;
}

export function Sidebar({
  role,
  activeScreen,
  onNavigate,
  onLogout,
  mobileOpen,
  setMobileOpen,
}: SidebarProps) {
  const nav: NavItem[] = role === "admin" ? ADMIN_NAV : KARYAWAN_NAV;
  const [expandedGroups, setExpandedGroups] = React.useState<Record<string, boolean>>(() => {
    // Auto-expand the group containing the active screen
    const map: Record<string, boolean> = {};
    for (const item of nav) {
      if (isNavGroup(item) && item.children.some((c) => c.id === activeScreen)) {
        map[item.id] = true;
      }
    }
    return map;
  });

  // Auto-expand active group whenever activeScreen changes
  React.useEffect(() => {
    setExpandedGroups((prev) => {
      const next = { ...prev };
      for (const item of nav) {
        if (isNavGroup(item) && item.children.some((c) => c.id === activeScreen)) {
          next[item.id] = true;
        }
      }
      return next;
    });
  }, [activeScreen, nav]);

  const toggleGroup = (id: string) =>
    setExpandedGroups((p) => ({ ...p, [id]: !p[id] }));

  return (
    <>
      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-sm lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex w-[320px] flex-col border-r border-slate-200 bg-white transition-transform duration-300 lg:static lg:translate-x-0",
          mobileOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        {/* Brand */}
        <div className="flex items-center justify-between gap-3 px-5 pt-5 pb-4">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center">
              <MosqueLogo className="h-12 w-12" />
            </div>
            <div>
              <h1 className="text-base font-extrabold leading-tight text-slate-900">
                Yayasan
                <br />
                <span className="text-blue-900">Al-Maghfirah</span>
              </h1>
              <p className="mt-0.5 text-[11px] font-semibold text-slate-500">
                Sistem Absensi Karyawan
              </p>
              <div className="mt-1.5 h-1 w-12 rounded-full bg-gradient-to-r from-emerald-500 to-green-600" />
            </div>
          </div>
          <button
            className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-500 hover:bg-slate-100 lg:hidden"
            onClick={() => setMobileOpen(false)}
            aria-label="Tutup menu"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="mx-5 mb-3 border-t border-slate-100" />

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto px-3 py-2 scrollbar-thin">
          <ul className="space-y-1">
            {nav.map((item) => {
              if (isNavGroup(item)) {
                const expanded = !!expandedGroups[item.id];
                const hasActiveChild = item.children.some((c) => c.id === activeScreen);
                const Icon = item.icon;
                return (
                  <li key={item.id}>
                    <button
                      onClick={() => toggleGroup(item.id)}
                      className={cn(
                        "group flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold transition-colors",
                        hasActiveChild
                          ? "bg-blue-600 text-white shadow-blue-glow"
                          : "text-slate-600 hover:bg-slate-100 hover:text-slate-900",
                      )}
                    >
                      <Icon
                        className={cn(
                          "h-5 w-5 shrink-0",
                          hasActiveChild ? "text-blue-50" : "text-slate-400 group-hover:text-slate-700",
                        )}
                      />
                      <span className="flex-1 text-left">{item.label}</span>
                      <ChevronDown
                        className={cn(
                          "h-4 w-4 transition-transform",
                          expanded ? "rotate-180" : "",
                          hasActiveChild ? "text-blue-50" : "text-slate-400",
                        )}
                      />
                    </button>
                    {expanded && (
                      <ul className="mt-1 ml-4 space-y-1 border-l border-slate-200 pl-3">
                        {item.children.map((child) => {
                          const ChildIcon = child.icon;
                          const active = child.id === activeScreen;
                          return (
                            <li key={child.id}>
                              <button
                                onClick={() => {
                                  onNavigate(child.id);
                                  setMobileOpen(false);
                                }}
                                className={cn(
                                  "flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-[13px] font-medium transition-colors",
                                  active
                                    ? "bg-emerald-50 text-emerald-700"
                                    : "text-slate-500 hover:bg-slate-50 hover:text-slate-800",
                                )}
                              >
                                <span
                                  className={cn(
                                    "h-1.5 w-1.5 rounded-full",
                                    active ? "bg-emerald-500" : "bg-slate-300",
                                  )}
                                />
                                {child.label}
                              </button>
                            </li>
                          );
                        })}
                      </ul>
                    )}
                  </li>
                );
              }
              const leaf = item;
              const Icon = leaf.icon;
              const active = leaf.id === activeScreen;
              return (
                <li key={leaf.id}>
                  <button
                    onClick={() => {
                      onNavigate(leaf.id);
                      setMobileOpen(false);
                    }}
                    className={cn(
                      "group flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold transition-colors",
                      active
                        ? "bg-blue-600 text-white shadow-blue-glow"
                        : "text-slate-600 hover:bg-slate-100 hover:text-slate-900",
                    )}
                  >
                    <Icon
                      className={cn(
                        "h-5 w-5 shrink-0",
                        active ? "text-blue-50" : "text-slate-400 group-hover:text-slate-700",
                      )}
                    />
                    <span className="flex-1 text-left">{leaf.label}</span>
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Illustration + Logout */}
        <div className="px-3 pb-4">
          <div className="relative mb-3 overflow-hidden rounded-2xl border border-emerald-100 bg-gradient-to-br from-emerald-50 via-sky-50 to-blue-50 p-2">
            <MosqueIllustration className="h-24 w-full" />
          </div>
          <button
            onClick={onLogout}
            className="flex w-full items-center justify-center gap-2 rounded-xl border border-blue-200 bg-white px-4 py-2.5 text-sm font-semibold text-blue-700 transition-colors hover:bg-blue-50"
          >
            <LogOut className="h-4 w-4" />
            Logout
          </button>
        </div>
      </aside>
    </>
  );
}

export function MobileSidebarToggle({
  onClick,
}: {
  onClick: () => void;
}) {
  return (
    <button
      className="flex h-10 w-10 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 lg:hidden"
      onClick={onClick}
      aria-label="Buka menu"
    >
      <Menu className="h-5 w-5" />
    </button>
  );
}
