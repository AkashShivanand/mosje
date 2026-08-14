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
// The chrome rows use the estate content container, so the emblem lines up with
// the same column every other page uses. Previously max-w-screen-2xl (1536).
import "../../foundations/layout.css";

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
        style={{ color: "var(--sa-color-primaryScale-800)" }}
      >
        Skip to Main Content
      </a>

      {/* ── Utility bar ─────────────────────────────────────────────────────── */}
      <div style={{ background: "var(--sa-bg-brand-primary-boldest)", color: "var(--sa-on-bg-brand-primary-boldest)" }}>
        <div
          className="sa-container flex items-center justify-between py-1.5"
        >
          {/* No flag emoji: 🇮🇳 falls back to the letters "IN" on Windows and
              several Android builds, so it renders inconsistently on a
              government property. The wordmark carries the attribution. */}
          <span className="flex items-center gap-1.5 text-xs">
            <span className="font-medium">Government of India</span>
          </span>

          <div className="flex items-center gap-2 text-xs" style={{ color: "color-mix(in oklab, var(--sa-on-bg-brand-primary-boldest) 75%, transparent)" }}>
            <a
              href="#login-form"
              className="hidden hover:text-white sm:inline"
              style={{ color: "inherit" }}
            >
              Skip to Main Content
            </a>
            <span className="hidden h-3.5 w-px sm:block" style={{ background: "color-mix(in oklab, var(--sa-on-bg-brand-primary-boldest) 30%, transparent)" }} aria-hidden="true" />

            {/* Text-size controls */}
            <div className="flex items-center" role="group" aria-label="Adjust text size">
              <button
                type="button"
                onClick={() => setScale(90)}
                aria-pressed={scale === 90}
                className="rounded px-1.5 py-0.5 hover:text-white"
                style={{ fontWeight: scale === 90 ? "700" : undefined, color: scale === 90 ? "var(--sa-on-bg-brand-primary-boldest)" : undefined }}
              >
                A-
              </button>
              <button
                type="button"
                onClick={() => setScale(100)}
                aria-pressed={scale === 100}
                className="rounded px-1.5 py-0.5 hover:text-white"
                style={{ fontWeight: scale === 100 ? "700" : undefined, color: scale === 100 ? "var(--sa-on-bg-brand-primary-boldest)" : undefined }}
              >
                A
              </button>
              <button
                type="button"
                onClick={() => setScale(115)}
                aria-pressed={scale === 115}
                className="rounded px-1.5 py-0.5 text-sm hover:text-white"
                style={{ fontWeight: scale === 115 ? "700" : undefined, color: scale === 115 ? "var(--sa-on-bg-brand-primary-boldest)" : undefined }}
              >
                A+
              </button>
            </div>

            <span className="h-3.5 w-px" style={{ background: "color-mix(in oklab, var(--sa-on-bg-brand-primary-boldest) 30%, transparent)" }} aria-hidden="true" />
            <button type="button" className="hover:text-white" aria-label="Toggle high contrast" title="Toggle high contrast">◑</button>
            <span className="h-3.5 w-px" style={{ background: "color-mix(in oklab, var(--sa-on-bg-brand-primary-boldest) 30%, transparent)" }} aria-hidden="true" />
            <button type="button" className="hover:text-white" aria-label="Accessibility options" title="Accessibility options">♿</button>
            <span className="h-3.5 w-px" style={{ background: "color-mix(in oklab, var(--sa-on-bg-brand-primary-boldest) 30%, transparent)" }} aria-hidden="true" />
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
      <div style={{ background: "var(--sa-bg-neutral-base)", borderBottom: "1px solid var(--sa-border-neutral-subtle)" }}>
        <div className="sa-container flex items-center justify-between py-3">
          {/* Left: National Emblem + ministry hierarchy */}
          <div className="flex items-center gap-3">
            <img src={emblemSrc} alt="National Emblem of India" className="h-14 w-auto" />
            <div className="leading-snug">
              <div className="flex items-center gap-2">
                <span className="text-xs font-medium" style={{ color: "var(--sa-text-neutral-subtle)" }}>
                  Government of India
                </span>
                <span
                  className="rounded px-1.5 py-0.5 font-bold uppercase tracking-wider"
                  style={{
                    fontSize: "var(--sa-type-label-3-size)",
                    background: "var(--sa-bg-brand-secondary-base)",
                    color: "var(--sa-on-bg-brand-secondary-base)",
                  }}
                >
                  Beta
                </span>
              </div>
              <p className="text-xs" style={{ color: "var(--sa-text-neutral-subtle)" }}>
                Ministry of Social Justice &amp; Empowerment
              </p>
              <p className="text-sm font-bold" style={{ color: "var(--sa-color-primaryScale-800)" }}>
                Department of Social Justice &amp; Empowerment
              </p>
            </div>
          </div>

          {/* Right: Digital India + SAMAVESH */}
          <div className="hidden items-center gap-4 md:flex">
            <img src={digitalIndiaSrc} alt="Digital India" className="h-10 w-auto opacity-90" />
            <span className="h-8 w-px" style={{ background: "var(--sa-border-neutral-subtle)" }} aria-hidden="true" />
            <div className="flex items-center gap-2.5">
              <img src={samaveshLogoSrc} alt="SAMAVESH" className="h-10 w-10" />
              <div className="leading-snug">
                <p className="text-xs font-bold" style={{ color: "var(--sa-color-primaryScale-800)" }}>SAMAVESH</p>
                <p lang="hi" style={{ fontSize: "var(--sa-type-label-3-size)", color: "var(--sa-text-neutral-subtle)" }}>समावेश</p>
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
            background:
              "linear-gradient(155deg, var(--sa-color-primaryScale-900) 0%, var(--sa-color-primaryScale-900) 38%, "
              + "var(--sa-color-primaryScale-800) 64%, var(--sa-color-primaryScale-900) 100%)",
          }}
          aria-hidden="true"
        >
          {/* Hero content */}
          <div className="flex flex-1 flex-col items-center justify-center px-12 py-16 text-center text-white">
            <img
              src={samaveshLogoSrc}
              alt=""
              className="mb-6 h-24 w-24 rounded-full"
              style={{ boxShadow: "0 0 0 4px color-mix(in oklab, var(--sa-on-bg-brand-primary-boldest) 20%, transparent)" }}
            />
            <p className="text-4xl font-extrabold tracking-tight">SAMAVESH</p>
            <p lang="hi" className="mt-1.5 font-medium" style={{ color: "color-mix(in oklab, var(--sa-on-bg-brand-primary-boldest) 80%, transparent)" }}>समावेश</p>
            <div className="mx-auto mt-6 h-px w-14" style={{ background: "var(--sa-color-secondaryScale-400)" }} />
            <p className="mt-6 text-2xl font-bold leading-snug" style={{ color: "color-mix(in oklab, var(--sa-on-bg-brand-primary-boldest) 90%, transparent)" }}>
              Justice. Equality. Dignity.
            </p>
            <p className="mt-4 max-w-xs text-sm leading-relaxed" style={{ color: "color-mix(in oklab, var(--sa-on-bg-brand-primary-boldest) 55%, transparent)" }}>
              A unified digital platform for social welfare schemes under the Ministry of Social
              Justice &amp; Empowerment, Government of India.
            </p>
          </div>

          {/* SIGNING INTO strip */}
          <div
            className="border-t px-8 py-4"
            style={{
              background: "color-mix(in oklab, var(--sa-color-primaryScale-900) 65%, transparent)",
              borderColor: "color-mix(in oklab, var(--sa-on-bg-brand-primary-boldest) 10%, transparent)",
            }}
          >
            <div className="flex items-center justify-between">
              <div>
                <p
                  className="font-semibold uppercase tracking-widest"
                  style={{
                    fontSize: "var(--sa-type-label-3-size)",
                    color: "color-mix(in oklab, var(--sa-on-bg-brand-primary-boldest) 70%, transparent)",
                  }}
                >
                  Signing Into
                </p>
                <p className="mt-0.5 text-sm font-bold" style={{ color: "var(--sa-color-secondaryScale-400)" }}>
                  {signingInto}
                </p>
              </div>
              <a
                href={changeHref}
                className="rounded-full px-3.5 py-1 text-xs font-semibold transition"
                style={{
                  border: "1px solid color-mix(in oklab, var(--sa-on-bg-brand-primary-boldest) 25%, transparent)",
                  color: "color-mix(in oklab, var(--sa-on-bg-brand-primary-boldest) 65%, transparent)",
                }}
              >
                Change
              </a>
            </div>
          </div>
        </div>

        {/* Right panel */}
        <div className="flex flex-1 flex-col" style={{ background: "var(--sa-bg-neutral-base)" }}>

          {/* Tab nav (pill segmented control) */}
          <div className="px-6 pb-0 pt-5">
            <div
              className="flex rounded-full p-1"
              role="tablist"
              aria-label="Portal login type"
              style={{ background: "var(--sa-bg-neutral-subtler)" }}
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
                      ? { background: "var(--sa-color-primaryScale-800)", color: "var(--sa-on-bg-brand-primary-boldest)" }
                      : { color: "var(--sa-text-neutral-subtle)" }
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
            style={{ borderTop: "1px solid var(--sa-border-neutral-subtle)" }}
          >
            <nav
              aria-label="Footer links"
              className="flex flex-wrap items-center justify-center gap-4 text-xs"
              style={{ color: "var(--sa-text-neutral-subtle)" }}
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
