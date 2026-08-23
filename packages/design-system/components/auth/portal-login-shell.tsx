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
import { Divider } from "../layout/divider";
import { AccessibilityBar } from "../utilities/accessibility-bar";
import { BrandLockup } from "../navigation/header/brand-lockup";
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
  /** Optional click handler for tab switching */
  onClick?: (e: React.MouseEvent) => void;
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
  /** Optional content below form area (e.g. Portal Switcher Grid) */
  extraContent?: React.ReactNode;

  // ── Callbacks ─────────────────────────────────────────────────────────────
  /** Called when a footer link (Privacy Policy / Contact Us / About Us) is clicked */
  onFooterLinkClick?: (link: "privacy" | "contact" | "about") => void;
}

// ── Component ─────────────────────────────────────────────────────────────────

export function PortalLoginShell({
  emblemSrc = "/brand/national-emblem.svg",
  digitalIndiaSrc = "/brand/digital-india.svg",
  samaveshLogoSrc = "/brand/samavesh-logo.svg",
  signingInto,
  changeHref = "/",
  tabs,
  children,
  extraContent,
  onFooterLinkClick,
}: PortalLoginShellProps) {
  // No local text-size state. It used to scale THIS SHELL ONLY via an inline
  // font-size, which is why resizing text here did nothing on the page you landed
  // on afterwards. AccessibilityBar drives `--sa-font-scale` on :root, so the
  // reader's choice now applies estate-wide and survives navigation.
  return (
    <div className="flex min-h-screen flex-col">
      {/* ── Utility bar ──────────────────────────────────────────────────────
         The shared DS AccessibilityBar. This shell used to carry its OWN: two
         skip links to the same target, a bespoke A-/A/A+ stepper wired to local
         state that nothing else read, and ◑ ♿ 🌐 ▾ as literal emoji rather than
         Material Symbols. It was a second accessibility bar living inside the
         design system, free to drift from the real one — and it had. The bar also
         renders the skip link, so the duplicate pair is gone with it. */}
      <AccessibilityBar
        layout="wide"
        govLink={{ href: "https://india.gov.in/", label: "Government of India" }}
        skipTo="#login-form"
        showSkip
        fontSize
        accessibility
        language={{ label: "English" }}
      />

      {/* ── Brand header ────────────────────────────────────────────────────── */}
      <div style={{ background: "var(--sa-bg-neutral-base)", borderBottom: "1px solid var(--sa-border-neutral-subtle)" }}>
        <div className="sa-container flex items-center justify-between py-3">
          {/* Identity from the DS lockup — the emblem, the line order and the
              BETA badge are estate policy, not this shell's to retype. */}
          <BrandLockup
            emblemSrc={emblemSrc}
            lines={{
              org: "Government of India",
              ministry: "Ministry of Social Justice & Empowerment",
              department: "Department of Social Justice & Empowerment",
            }}
            href="/"
            beta
            compact
          />

          {/* Right: Digital India + SAMAVESH */}
          <div className="hidden items-center gap-4 md:flex">
            <img src={digitalIndiaSrc} alt="Digital India" className="h-10 w-auto opacity-90" />
            <Divider orientation="vertical" tone="default" length={32} />
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
              <div className="flex items-center gap-3">
                <img src={samaveshLogoSrc} alt="" className="h-8 w-8 rounded-full border border-white/20 bg-white/10 p-0.5" />
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
                  <p className="mt-0.5 text-sm font-bold text-white">
                    {signingInto}
                  </p>
                </div>
              </div>
              <a
                href={changeHref}
                className="flex items-center gap-1.5 rounded-full px-3.5 py-1 text-xs font-semibold transition hover:bg-white/10"
                style={{
                  border: "1px solid color-mix(in oklab, var(--sa-on-bg-brand-primary-boldest) 25%, transparent)",
                  color: "var(--sa-on-bg-brand-primary-boldest)",
                }}
              >
                <span aria-hidden="true">⇄</span>
                <span>Change</span>
              </a>
            </div>
          </div>
        </div>

        {/* Right panel */}
        <div className="flex flex-1 flex-col" style={{ background: "var(--sa-bg-neutral-base)" }}>

          {/* Tab nav (pill segmented control) — only render if tabs exist */}
          {tabs && tabs.length > 0 && (
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
                    onClick={tab.onClick}
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
          )}

          {/* Form area */}
          <div className="flex flex-1 flex-col items-center justify-center px-6 py-6">
            <div id="login-form" className="w-full max-w-sm" tabIndex={-1}>
              {children}
            </div>
          </div>

          {/* Extra content (e.g. Portal Switcher Grid) */}
          {extraContent && <div className="px-6 pb-6">{extraContent}</div>}

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
