"use client";

import DashboardRoundedIcon from "@mui/icons-material/DashboardRounded";
import AddCircleOutlineRoundedIcon from "@mui/icons-material/AddCircleOutlineRounded";
import SettingsRoundedIcon from "@mui/icons-material/SettingsRounded";
import TourRoundedIcon from "@mui/icons-material/TourRounded";
import { usePathname } from "next/navigation";
import { LoadingLink } from "@/features/dashboard/components/LoadingLink";

function isActive(pathname: string, href: string) {
  if (href === "/") return pathname === "/";
  if (href === "/tours")
    return (
      pathname === "/tours" ||
      (pathname.startsWith("/tours/") && !pathname.endsWith("/new"))
    );
  if (href === "/tours/new") return pathname === "/tours/new";
  return pathname === href;
}

const navItems = [
  { href: "/", label: "Genel Bakış", icon: DashboardRoundedIcon },
  { href: "/tours", label: "Tur Listesi", icon: TourRoundedIcon },
  { href: "/tours/new", label: "Yeni Tur", icon: AddCircleOutlineRoundedIcon },
] as const;

export function SidebarNav() {
  const pathname = usePathname();

  return (
    <aside className="flex w-full shrink-0 flex-col gap-6 rounded-[28px] border border-line bg-[color:var(--sidebar-bg)] p-5 shadow-[0_12px_28px_rgba(15,23,42,0.04)] lg:sticky lg:top-6 lg:max-w-[296px] lg:self-start lg:min-h-[calc(100vh-3rem)]">
      <div className="space-y-3 rounded-[24px] border border-line bg-[color:var(--sidebar-surface)] p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.75)]">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-line bg-[color:var(--sidebar-active)] text-[color:var(--sidebar-text)]">
            <TourRoundedIcon fontSize="small" />
          </div>
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-ink-muted">
              Tour Show
            </p>
            <h1 className="text-lg font-semibold text-[color:var(--sidebar-text)]">
              Admin Workspace
            </h1>
          </div>
        </div>
      </div>

      <nav className="space-y-1.5">
        {navItems.map((item) => {
          const active = isActive(pathname, item.href);
          const Icon = item.icon;

          return (
            <LoadingLink
              key={item.href}
              href={item.href}
              loadingLabel="Geçiliyor..."
              className={[
                "group flex items-center gap-3 rounded-[20px] border px-3.5 py-3 text-sm font-medium transition",
                active
                  ? "border-[color:var(--sidebar-active-border)] bg-[color:var(--sidebar-active)] text-[color:var(--sidebar-text)] shadow-[inset_0_1px_0_rgba(255,255,255,0.65)]"
                  : "border-transparent text-[color:var(--sidebar-muted)] hover:border-line hover:bg-[color:var(--sidebar-hover)] hover:text-[color:var(--sidebar-text)]",
              ].join(" ")}
            >
              <span
                className={[
                  "flex h-9 w-9 items-center justify-center rounded-2xl border transition",
                  active
                    ? "border-[color:var(--sidebar-active-border)] bg-white text-[color:var(--sidebar-text)]"
                    : "border-line bg-[color:var(--sidebar-icon-bg)] text-[color:var(--sidebar-icon)] group-hover:bg-white group-hover:text-[color:var(--sidebar-text)]",
                ].join(" ")}
              >
                <Icon sx={{ fontSize: 20 }} />
              </span>
              <span className="flex-1 font-medium">{item.label}</span>
            </LoadingLink>
          );
        })}
      </nav>

      <div className="mt-auto rounded-[24px] border border-line bg-[color:var(--sidebar-surface)] p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.72)]">
        <div className="flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-2xl border border-line bg-white text-[color:var(--sidebar-text)]">
            <SettingsRoundedIcon sx={{ fontSize: 20 }} />
          </span>
          <div>
            <p className="text-sm font-semibold text-[color:var(--sidebar-text)]">
              Panel Ayarları
            </p>
            <p className="text-xs leading-5 text-[color:var(--sidebar-muted)]">
              Tercihler
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
}
