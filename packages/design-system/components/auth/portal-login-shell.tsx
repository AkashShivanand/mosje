"use client";

/**
 * PortalLoginShell — shared full-page login layout for all MoSJE portals.
 *
 * Layout: utility bar (full-width) → brand header (full-width) →
 *   two columns: left hero (SAMAVESH branding, 58%) + right panel (tabs + form, 42%).
 *
 * What changes per portal:
 *   - `emblemSrc`, `digitalIndiaSrc`, `samaveshLogoSrc` — asset paths from the portal's /public
 *   - `heroImageSrc` — the portal's photograph behind the hero (Figma: the Photograph swap)
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
import { Button } from "../actions/button";
import { OrgLogo } from "../brand/org-logo";
import { Icon } from "../utilities/icon";
// The chrome rows use the estate content container, so the emblem lines up with
// the same column every other page uses. Previously max-w-screen-2xl (1536).
import "../../foundations/layout.css";
import "./portal-login-template.css";
import "./portal-login-hero.css";

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
  /**
   * The photograph behind the desktop hero — the Figma organism's `Photograph`
   * swap. Drawn as a background so a phone, which never shows the column, never
   * downloads it. Defaults to the estate's SAMAVESH photograph (1200px JPEG,
   * 262 KB, exported from the library on 2026-09-05); a portal passes its own.
   * Decorative: it carries no text and sits under an alpha mask that leaves a
   * solid band on the left for the lockup and the Signing Into bar.
   */
  heroImageSrc?: string;

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
  heroImageSrc = "/portals/login-hero/samavesh-default.jpg",
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
              <div>
                <p className="text-label-2 font-semibold" style={{ color: "var(--sa-color-primaryScale-800)" }}>SAMAVESH</p>
                <p lang="hi" className="text-label-2" style={{ color: "var(--sa-text-neutral-subtle)" }}>समावेश</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Two-column body ──────────────────────────────────────────────────── */}
      <div className="flex flex-1">

        {/* Left hero — desktop only. One construction with the Figma organism
            `Auth / LoginHero`: the photograph under an alpha mask that leaves a
            solid band on the left, the SAMAVESH lockup on that band, and the
            Signing Into bar over a bottom scrim. The rules are in
            portal-login-hero.css beside the Figma node ids they transcribe. */}
        {/* 922 of 1440 — the handoff's hero/form split, which the Figma master draws. */}
        <div className="ds-plogin-hero hidden lg:flex lg:w-[64.03%]">
          <div
            className="ds-plogin-hero__photo"
            aria-hidden="true"
            style={{ backgroundImage: `url("${heroImageSrc}")` }}
          />

          {/*
            Lockup — decorative, so hidden from assistive technology. The
            `aria-hidden` used to sit on the whole column, which also hid the
            "Signing Into" strip below: a screen-reader user was never told which
            portal they were signing into, and the strip's Change link was a
            focusable control inside a hidden subtree (axe `aria-hidden-focus`,
            WCAG 4.1.2). Only the lockup is decorative; the strip is content.
          */}
          <div className="ds-plogin-hero__body" aria-hidden="true">
            <div className="ds-plogin-hero__head">
              <span className="ds-plogin-hero__ring">
                <img src={samaveshLogoSrc} alt="" />
              </span>
              <div>
                <p className="text-display-4">SAMAVESH</p>
                <p lang="hi" className="ds-plogin-hero__muted text-headline-3">समावेश</p>
              </div>
            </div>
            <div className="ds-plogin-hero__rule" />
            <div className="ds-plogin-hero__subtitle">
              <p className="text-headline-3">Justice. Equality. Dignity.</p>
              {/* The department's own expansion of SAMAVESH — the same sentence the
                  Figma master carries, so a designer and a developer read one strapline. */}
              <p className="ds-plogin-hero__muted text-body-1">
                Single Access Mechanism for All Verticals of Empowerment &amp; Social Harmony
                — one unified gateway for every social justice service in India.
              </p>
            </div>
          </div>

          {/* SIGNING INTO bar — content, not decoration */}
          <div className="ds-plogin-hero__footer">
            <div className="ds-plogin-hero__bar">
              <OrgLogo size="lg" />
              <div className="ds-plogin-hero__bar-text">
                <p className="ds-plogin-hero__eyebrow ds-plogin-hero__muted text-label-2">Signing Into</p>
                <p className="text-title-1">{signingInto}</p>
              </div>
              <Button
                href={changeHref}
                variant="neutral"
                appearance="outlined"
                tone="inverse"
                iconLeft={<Icon name="swap_horiz" size={16} aria-hidden />}
              >
                Change
              </Button>
            </div>
          </div>
        </div>

        {/* Right panel */}
        <div className="flex flex-1 flex-col" style={{ background: "var(--sa-bg-neutral-base)" }}>

          {/* ROLE TABS.
              Deliberately NOT the DS `Tabs` component, and the reason is in the
              markup: these are real `<a href>`s, so middle-click, "copy link
              address" and a shared URL all land on the right role. `Tabs`
              renders buttons and has no `href` on `TabDef`, so adopting it here
              would trade a working capability for a shared one. The right fix is
              to give `TabDef` an optional `href` — recorded, not done in this
              change, because that component is on ~95 pages.

              What HAS changed: the appearance now matches the reference
              (`56693:8704`) and is bound to tokens. It was drawn with inline
              `style={{ background: "var(--sa-…)" }}` objects, which no token gate
              can see and no brand mode can re-bind, and `rounded-full` where the
              reference draws a rounded rectangle. */}
          {tabs && tabs.length > 0 && (
            <div className="px-6 pb-0 pt-5">
              <div className="ds-plogin__roletabs" role="tablist" aria-label="Portal login type">
                {tabs.map((tab) => (
                  <a
                    key={tab.href}
                    href={tab.href}
                    onClick={tab.onClick}
                    role="tab"
                    aria-selected={tab.active}
                    className="ds-plogin__roletab"
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
              className="flex flex-wrap items-center justify-center gap-4 text-body-3"
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
