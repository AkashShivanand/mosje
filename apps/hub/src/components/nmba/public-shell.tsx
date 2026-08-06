"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutGrid,
  Activity,
  HandHeart,
  MapPin,
  ChevronsLeft,
  Globe,
  ChevronDown,
  Phone,
  LogIn,
  UserPlus,
} from "lucide-react";
import { buttonClasses } from "@mosje/design-system";
import { cn } from "@/lib/nmba/utils";

const BASE = "/portals/nmba";

const NAV_ITEMS = [
  { label: "Dashboard", href: BASE, icon: LayoutGrid },
  { label: "Activity Snapshot", href: `${BASE}/activities`, icon: Activity },
  { label: "E-Pledge", href: `${BASE}/epledge`, icon: HandHeart },
  { label: "Nasha Mukti Mitr", href: `${BASE}/register-mitr`, icon: UserPlus },
  { label: "Facilities", href: `${BASE}/facilities`, icon: MapPin },
  { label: "Helpline", href: `${BASE}/helpline`, icon: Phone },
];

const LANGUAGES = ["English", "हिंदी"];

export function PublicShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = React.useState(false);
  const [lang, setLang] = React.useState("English");
  const [langOpen, setLangOpen] = React.useState(false);
  const [fontScale, setFontScale] = React.useState<"small" | "default" | "large">("default");

  const isActive = (href: string) =>
    href === BASE ? pathname === BASE || pathname === `${BASE}/` : pathname.startsWith(href);

  return (
    <div
      className="flex min-h-screen flex-col"
      data-fontscale={fontScale}
    >
      {/* Government top bar */}
      <div className="bg-navy-950 text-white">
        <div className="flex h-9 items-center justify-between px-4 text-xs">
          <a className="flex items-center gap-1.5 font-medium" href="https://india.gov.in" target="_blank" rel="noreferrer">
            <span>Government of India</span>
          </a>
          <div className="flex items-center gap-3">
            <a href="#main-content" className="hidden sm:inline hover:underline">
              Skip to Main Content
            </a>
            <span className="hidden h-4 w-px bg-white/25 sm:block" />
            <div className="flex items-center gap-1">
              <button
                onClick={() => setFontScale("small")}
                className="rounded px-1 text-[11px] hover:bg-white/10"
                aria-label="Decrease text size"
              >
                A<sup>-</sup>
              </button>
              <button
                onClick={() => setFontScale("default")}
                className="rounded px-1 hover:bg-white/10"
                aria-label="Default text size"
              >
                A
              </button>
              <button
                onClick={() => setFontScale("large")}
                className="rounded px-1 text-[13px] hover:bg-white/10"
                aria-label="Increase text size"
              >
                A<sup>+</sup>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Masthead */}
      <header className="border-b border-line bg-white">
        <div className="flex items-center justify-between gap-4 px-4 py-3">
          <div className="flex items-center gap-3">
            <Image
              src={`${BASE}/brand/national-emblem.svg`}
              alt="National Emblem of India"
              width={44}
              height={62}
              className="h-14 w-auto"
            />
            <div className="leading-tight">
              <div className="text-[10px] text-ink-muted">Government of India</div>
              <div className="text-[11px] text-ink-muted">Ministry of Social Justice &amp; Empowerment</div>
              <div className="text-sm font-bold text-ink">Department of Social Justice &amp; Empowerment</div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {/* Language switcher */}
            <div className="relative">
              <button
                onClick={() => setLangOpen((o) => !o)}
                aria-haspopup="listbox"
                aria-expanded={langOpen}
                aria-label="Select language"
                className="flex items-center gap-1.5 rounded-lg border border-line px-3 py-1.5 text-sm font-medium text-ink hover:bg-surface-muted"
              >
                <Globe className="h-4 w-4 text-ink-muted" />
                <span>{lang}</span>
                <ChevronDown className="h-3 w-3 text-ink-muted" />
              </button>
              {langOpen && (
                <ul
                  role="listbox"
                  aria-label="Language Translator"
                  className="absolute right-0 top-full z-10 mt-1 w-32 rounded-lg border border-line bg-white py-1 shadow-pop"
                >
                  {LANGUAGES.map((l) => (
                    <li key={l}>
                      <button
                        role="option"
                        aria-selected={lang === l}
                        onClick={() => { setLang(l); setLangOpen(false); }}
                        className={cn(
                          "w-full px-3 py-2 text-left text-sm",
                          lang === l ? "bg-brandwash font-semibold text-navy" : "hover:bg-surface-muted text-ink"
                        )}
                      >
                        {l}
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
            {/* Admin login */}
            <Link
              href={`${BASE}/admin/login`}
              className={buttonClasses("primary", "outlined", "sm")}
              aria-label="Admin Login"
            >
              <span className="ds-btn__icon" aria-hidden="true">
                <LogIn className="h-4 w-4" />
              </span>
              <span className="hidden sm:inline">Admin Login</span>
            </Link>
            {/* Helpline */}
            <a
              href="tel:14446"
              className="flex items-center gap-2 rounded-lg bg-saffron px-3 py-1.5 text-sm font-semibold text-white hover:bg-saffron-600"
              aria-label="Call National De-addiction Helpline 14446"
            >
              <Phone className="h-4 w-4" />
              <span className="hidden sm:inline">Helpline 14446</span>
            </a>
          </div>
        </div>
      </header>

      <div className="flex flex-1">
        {/* Sidebar */}
        <aside
          className={cn(
            "sticky top-0 hidden h-[calc(100vh-8rem)] shrink-0 border-r border-line bg-white py-5 transition-all md:block",
            collapsed ? "w-[68px]" : "w-[220px]"
          )}
        >
          <nav aria-label="Main navigation" className="flex flex-col gap-1 px-3">
            {NAV_ITEMS.map(({ label, href, icon: Icon }) => {
              const active = isActive(href);
              return (
                <Link
                  key={href}
                  href={href}
                  title={collapsed ? label : undefined}
                  aria-current={active ? "page" : undefined}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors",
                    active
                      ? "bg-brandwash font-semibold text-navy"
                      : "text-ink-muted hover:bg-black/5"
                  )}
                >
                  <Icon className={cn("h-5 w-5 shrink-0", active && "text-navy")} />
                  {!collapsed && <span className="truncate">{label}</span>}
                </Link>
              );
            })}
          </nav>
          <div className={cn("mt-4 flex px-3", collapsed ? "justify-center" : "justify-start")}>
            <button
              onClick={() => setCollapsed((c) => !c)}
              aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
              className="flex h-8 w-8 items-center justify-center rounded-full border border-line text-ink-muted hover:bg-black/5"
            >
              <ChevronsLeft className={cn("h-4 w-4 transition-transform", collapsed && "rotate-180")} />
            </button>
          </div>
        </aside>

        {/* Main content */}
        <main id="main-content" className="min-w-0 flex-1 px-4 py-6 sm:px-6 lg:px-8">
          {children}
        </main>
      </div>
    </div>
  );
}
