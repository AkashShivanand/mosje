"use client";

/**
 * PortalLoginShell — shared full-page login layout for all MoSJE portals.
 *
 * Layout: utility bar (full-width) → brand header (full-width) →
 *   two columns: left hero (SAMAVESH branding, 58%) + right panel (tabs + form, 42%).
 *
 * What changes per portal:
 *   - `emblemSrc`, `digitalIndiaSrc`, `samaveshLogoSrc` — asset paths from the portal's /public
 *   - `signingInto` — the scheme/portal name shown in the hero's "SIGNING INTO" strip
 *   - `tabs` — tab labels and hrefs (e.g. Admin + Patient Monitoring for NMBA)
 *   - `children` — the form content (heading, fields, submit button)
 *
 * What stays the same:
 *   - Utility bar (Gov of India flag, A-/A/A+ text-size controls, contrast, accessibility, language)
 *   - Brand header (National Emblem, Beta badge, ministry/department names, Digital India, SAMAVESH)
 *   - Left hero (SAMAVESH identity: logo, name, tagline, description)
 *   - Footer (Privacy Policy · Contact Us · About Us)
 */

import * as React from "react";
import { cn } from "../../utils/cn";

// ── Types ─────────────────────────────────────────────────────────────────────

export interface PortalLoginTab {
  /** Display label shown in the tab pill */
  label: string;
  /** Navigation href — Next.js Link, basePath is automatically prepended */
  href: string;
  /** Whether this tab is currently active */
  active: boolean;
}

export interface PortalLoginShellProps {
  // ── Brand assets (portal-specific public/ paths) ──────────────────────────
  /** National Emblem SVG URL, e.g. `/portals/nmba/brand/national-emblem.svg` */
  emblemSrc: string;
  /** Digital India logo URL */
  digitalIndiaSrc: string;
  /** SAMAVESH circular logo URL */
  samaveshLogoSrc: string;

  // ── "SIGNING INTO" strip at the bottom of the hero ────────────────────────
  /** Portal / scheme name, e.g. "Nasha Mukt Bharat Abhiyaan" */
  signingInto: string;
  /** Href for the "Change" button — defaults to "/" (hub root) */
  changeHref?: string;

  // ── Right panel ───────────────────────────────────────────────────────────
  /** Tab navigation items rendered as a pill segmented control */
  tabs: PortalLoginTab[];
  /** Form content (heading + fields + submit) */
  children: React.ReactNode;

  // ── Callbacks ─────────────────────────────────────────────────────────────
  /** Called when a footer link (Privacy Policy / Contact Us / About Us) is clicked */
  onFooterLinkClick?: (link: "privacy" | "contact" | "about") => void;
}

// ── Component ─────────────────────────────────────────────────────────────────

export function PortalLoginShell({
  emblemSrc,
  digitalIndiaSrc,
  samaveshLogoSrc,
  signingInto,
  changeHref = "/",
  tabs,
  children,
  onFooterLinkClick,
}: PortalLoginShellProps) {
  const [scale, setScale] = React.useState(100);

  return (
    <div className="flex min-h-screen flex-col" style={{ fontSize: `${scale}%` }}>
      {/* Skip link */}
      <a
        href="#login-form"
        className="sr-only focus:not-sr-only focus:absolute focus:left-2 focus:top-2 focus:z-50 focus:rounded focus:bg-white focus:px-4 focus:py-2 focus:shadow-md"
        style={{ color: "var(--color-navy, #13366b)" }}
      >
        Skip to Main Content
      </a>

      {/* ── Utility bar ─────────────────────────────────────────────────────── */}
      <div style={{ background: "var(--color-navy-900, #0a2452)", color: "#fff" }}>
        <div
          className="mx-auto flex max-w-screen-2xl items-center justify-between px-4 py-1.5"
        >
          {/* No flag emoji: 🇮🇳 falls back to the letters "IN" on Windows and
              several Android builds, so it renders inconsistently on a
              government property. The wordmark carries the attribution. */}
          <span className="flex items-center gap-1.5 text-xs">
            <span className="font-medium">Government of India</span>
          </span>

          <div className="flex items-center gap-2 text-xs" style={{ color: "rgba(255,255,255,0.75)" }}>
            <a
              href="#login-form"
              className="hidden hover:text-white sm:inline"
              style={{ color: "inherit" }}
            >
              Skip to Main Content
            </a>
            <span className="hidden h-3.5 w-px sm:block" style={{ background: "rgba(255,255,255,0.3)" }} aria-hidden="true" />

            {/* Text-size controls */}
            <div className="flex items-center" role="group" aria-label="Adjust text size">
              <button
                type="button"
                onClick={() => setScale(90)}
                aria-pressed={scale === 90}
                className="rounded px-1.5 py-0.5 hover:text-white"
                style={{ fontWeight: scale === 90 ? "700" : undefined, color: scale === 90 ? "#fff" : undefined }}
              >
                A-
              </button>
              <button
                type="button"
                onClick={() => setScale(100)}
                aria-pressed={scale === 100}
                className="rounded px-1.5 py-0.5 hover:text-white"
                style={{ fontWeight: scale === 100 ? "700" : undefined, color: scale === 100 ? "#fff" : undefined }}
              >
                A
              </button>
              <button
                type="button"
                onClick={() => setScale(115)}
                aria-pressed={scale === 115}
                className="rounded px-1.5 py-0.5 text-sm hover:text-white"
                style={{ fontWeight: scale === 115 ? "700" : undefined, color: scale === 115 ? "#fff" : undefined }}
              >
                A+
              </button>
            </div>

            <span className="h-3.5 w-px" style={{ background: "rgba(255,255,255,0.3)" }} aria-hidden="true" />
            <button type="button" className="hover:text-white" aria-label="Toggle high contrast" title="Toggle high contrast">◑</button>
            <span className="h-3.5 w-px" style={{ background: "rgba(255,255,255,0.3)" }} aria-hidden="true" />
            <button type="button" className="hover:text-white" aria-label="Accessibility options" title="Accessibility options">♿</button>
            <span className="h-3.5 w-px" style={{ background: "rgba(255,255,255,0.3)" }} aria-hidden="true" />
            <button
              type="button"
              className="flex items-center gap-1 hover:text-white"
              aria-label="Select language: English"
            >
              <span aria-hidden="true">🌐</span>
              <span>English</span>
              <span aria-hidden="true">▾</span>
            </button>
          </div>
        </div>
      </div>

      {/* ── Brand header ────────────────────────────────────────────────────── */}
      <div style={{ background: "#fff", borderBottom: "1px solid var(--color-line, #e2e8f0)" }}>
        <div className="mx-auto flex max-w-screen-2xl items-center justify-between px-4 py-3">
          {/* Left: National Emblem + ministry hierarchy */}
          <div className="flex items-center gap-3">
            <img src={emblemSrc} alt="National Emblem of India" className="h-14 w-auto" />
            <div className="leading-snug">
              <div className="flex items-center gap-2">
                <span className="text-xs font-medium" style={{ color: "var(--color-ink-hint, #94a3b8)" }}>
                  Government of India
                </span>
                <span
                  className="rounded px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wider"
                  style={{ background: "rgba(236,106,31,0.1)", color: "#d35912" }}
                >
                  Beta
                </span>
              </div>
              <p className="text-xs" style={{ color: "var(--color-ink-muted, #475569)" }}>
                Ministry of Social Justice &amp; Empowerment
              </p>
              <p className="text-sm font-bold" style={{ color: "var(--color-navy, #13366b)" }}>
                Department of Social Justice &amp; Empowerment
              </p>
            </div>
          </div>

          {/* Right: Digital India + SAMAVESH */}
          <div className="hidden items-center gap-4 md:flex">
            <img src={digitalIndiaSrc} alt="Digital India" className="h-10 w-auto opacity-90" />
            <span className="h-8 w-px" style={{ background: "var(--color-line, #e2e8f0)" }} aria-hidden="true" />
            <div className="flex items-center gap-2.5">
              <img src={samaveshLogoSrc} alt="SAMAVESH" className="h-10 w-10" />
              <div className="leading-snug">
                <p className="text-xs font-bold" style={{ color: "var(--color-navy, #13366b)" }}>SAMAVESH</p>
                <p lang="hi" className="text-[10px]" style={{ color: "var(--color-ink-hint, #64748b)" }}>समावेश</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Two-column body ──────────────────────────────────────────────────── */}
      <div className="flex flex-1">

        {/* Left hero — desktop only */}
        <div
          className="relative hidden flex-col lg:flex lg:w-[58%]"
          style={{
            background: "linear-gradient(155deg, #071a3d 0%, #0a2452 38%, #0d3070 64%, #0a2452 100%)",
          }}
          aria-hidden="true"
        >
          {/* Hero content */}
          <div className="flex flex-1 flex-col items-center justify-center px-12 py-16 text-center text-white">
            <img
              src={samaveshLogoSrc}
              alt=""
              className="mb-6 h-24 w-24 rounded-full"
              style={{ boxShadow: "0 0 0 4px rgba(255,255,255,0.2)" }}
            />
            <p className="text-4xl font-extrabold tracking-tight">SAMAVESH</p>
            <p lang="hi" className="mt-1.5 font-medium" style={{ color: "rgba(255,255,255,0.8)" }}>समावेश</p>
            <div className="mx-auto mt-6 h-px w-14" style={{ background: "var(--color-saffron, #ec6a1f)" }} />
            <p className="mt-6 text-2xl font-bold leading-snug" style={{ color: "rgba(255,255,255,0.9)" }}>
              Justice. Equality. Dignity.
            </p>
            <p className="mt-4 max-w-xs text-sm leading-relaxed" style={{ color: "rgba(255,255,255,0.55)" }}>
              A unified digital platform for social welfare schemes under the Ministry of Social
              Justice &amp; Empowerment, Government of India.
            </p>
          </div>

          {/* SIGNING INTO strip */}
          <div
            className="border-t px-8 py-4"
            style={{
              background: "rgba(7,26,61,0.65)",
              borderColor: "rgba(255,255,255,0.1)",
            }}
          >
            <div className="flex items-center justify-between">
              <div>
                <p
                  className="text-[10px] font-semibold uppercase tracking-widest"
                  style={{ color: "rgba(255,255,255,0.45)" }}
                >
                  Signing Into
                </p>
                <p className="mt-0.5 text-sm font-bold" style={{ color: "var(--color-saffron, #ec6a1f)" }}>
                  {signingInto}
                </p>
              </div>
              <a
                href={changeHref}
                className="rounded-full px-3.5 py-1 text-xs font-semibold transition"
                style={{
                  border: "1px solid rgba(255,255,255,0.25)",
                  color: "rgba(255,255,255,0.65)",
                }}
              >
                Change
              </a>
            </div>
          </div>
        </div>

        {/* Right panel */}
        <div className="flex flex-1 flex-col" style={{ background: "#fff" }}>

          {/* Tab nav (pill segmented control) */}
          <div className="px-6 pb-0 pt-5">
            <div
              className="flex rounded-full p-1"
              role="tablist"
              aria-label="Portal login type"
              style={{ background: "var(--color-surface-muted, #f5f7fb)" }}
            >
              {tabs.map((tab) => (
                <a
                  key={tab.href}
                  href={tab.href}
                  role="tab"
                  aria-selected={tab.active}
                  className={cn(
                    "flex-1 rounded-full py-2 text-center text-sm font-semibold transition-all",
                    tab.active ? "shadow" : "",
                  )}
                  style={
                    tab.active
                      ? { background: "var(--color-navy, #13366b)", color: "#fff" }
                      : { color: "var(--color-ink-muted, #475569)" }
                  }
                >
                  {tab.label}
                </a>
              ))}
            </div>
          </div>

          {/* Form area */}
          <div className="flex flex-1 flex-col items-center justify-center px-6 py-10">
            <div id="login-form" className="w-full max-w-sm" tabIndex={-1}>
              {children}
            </div>
          </div>

          {/* Footer */}
          <footer
            className="px-6 py-3.5"
            style={{ borderTop: "1px solid var(--color-line, #e2e8f0)" }}
          >
            <nav
              aria-label="Footer links"
              className="flex flex-wrap items-center justify-center gap-4 text-xs"
              style={{ color: "var(--color-ink-hint, #94a3b8)" }}
            >
              <button
                type="button"
                onClick={() => onFooterLinkClick?.("privacy")}
                className="hover:underline"
                style={{ color: "inherit" }}
              >
                Privacy Policy
              </button>
              <span aria-hidden="true">·</span>
              <button
                type="button"
                onClick={() => onFooterLinkClick?.("contact")}
                className="hover:underline"
                style={{ color: "inherit" }}
              >
                Contact Us
              </button>
              <span aria-hidden="true">·</span>
              <button
                type="button"
                onClick={() => onFooterLinkClick?.("about")}
                className="hover:underline"
                style={{ color: "inherit" }}
              >
                About Us
              </button>
            </nav>
          </footer>
        </div>
      </div>
    </div>
  );
}
