"use client";

import * as React from "react";
import { Checkbox, SiteHeader, buttonClasses, type NavItem } from "@mosje/design-system";

const EMBLEM = "/design-system/national-emblem.svg";

/**
 * The masthead's props, switched one at a time on a live instance. The Figma
 * page's arrangements section draws the same list — every boolean on both
 * mastheads, the lockup and the account menu, plus the two props only code
 * has, `actions` and `brandDivider` — so a designer reading the library and a
 * developer reading this page see one set.
 */
interface Switches {
  portal: boolean;
  search: boolean;
  actions: boolean;
  account: boolean;
  beta: boolean;
  ministry: boolean;
  org: boolean;
  divider: boolean;
  hindi: boolean;
  a11y: boolean;
  longLabel: boolean;
}

const CONTROLS: { key: keyof Switches; label: string }[] = [
  { key: "portal", label: 'variant="portal"' },
  { key: "search", label: "search" },
  { key: "actions", label: "actions" },
  { key: "account", label: "account (portal)" },
  { key: "beta", label: "beta" },
  { key: "ministry", label: "brandLines.ministry" },
  { key: "org", label: "brandLines.org" },
  { key: "divider", label: "brandDivider (portal)" },
  { key: "hindi", label: "language: हिन्दी" },
  { key: "a11y", label: "accessibilityToolbar" },
  { key: "longLabel", label: "a long nav label" },
];

const NAV: NavItem[] = [
  { label: "Home", href: "#", active: true },
  { label: "Department", href: "#", children: [{ label: "About Us", href: "#" }] },
  { label: "Associated Organisations", href: "#", children: [{ label: "Commissions", href: "#" }] },
  { label: "Offerings", href: "#", children: [{ label: "Schemes & Services", href: "#" }] },
  { label: "Documents", href: "#", children: [{ label: "Acts & Rules", href: "#" }] },
  { label: "Connect", href: "#" },
];

export function SiteHeaderArrangementsPreview(): React.JSX.Element {
  const [s, setS] = React.useState<Switches>({
    portal: false,
    search: true,
    actions: true,
    account: true,
    beta: true,
    ministry: true,
    org: true,
    divider: false,
    hindi: false,
    a11y: true,
    longLabel: false,
  });
  const toggle = (k: keyof Switches) => setS((v) => ({ ...v, [k]: !v[k] }));

  const nav = s.longLabel
    ? NAV.map((n) => (n.label === "Associated Organisations" ? { ...n, label: "Associated Organisations & Autonomous Bodies" } : n))
    : NAV;

  return (
    <div className="cdp-stack">
      <fieldset
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "var(--sa-inline-16)",
          border: "1px solid var(--sa-border-neutral-subtle)",
          borderRadius: "var(--sa-shape-8)",
          padding: "var(--sa-padding-12) var(--sa-padding-16)",
          margin: 0,
        }}
      >
        <legend
          style={{
            fontSize: "var(--sa-type-label-3-size)",
            lineHeight: "var(--sa-type-label-3-lh)",
            textTransform: "uppercase",
            color: "var(--sa-text-brand-primary-base)",
            padding: "0 var(--sa-padding-4)",
          }}
        >
          Arrangements
        </legend>
        {CONTROLS.map((c) => (
          <Checkbox key={c.key} size="sm" label={c.label} checked={s[c.key]} onChange={() => toggle(c.key)} />
        ))}
      </fieldset>
      {/*
        The masthead lays out by VIEWPORT breakpoint, not by its container, so
        inside this 800px column it draws its desktop arrangement squeezed. The
        frame scrolls sideways and the masthead keeps a desktop width, which is
        what a reader switching the portal props on needs to see — the same
        limit the previews above live with, made explicit here.
      */}
      <div
        style={{
          border: "1px solid var(--sa-border-neutral-subtle)",
          borderRadius: "var(--sa-shape-8)",
          overflowX: "auto",
          background: "var(--sa-bg-neutral-base)",
        }}
      >
        <div style={{ minWidth: "var(--sa-container-page)" }}>
        <SiteHeader
          variant={s.portal ? "portal" : "website"}
          sticky={false}
          emblemSrc={EMBLEM}
          homeHref="#"
          brandLines={{
            org: s.org ? "Government of India" : undefined,
            ministry: s.ministry ? "Ministry of Social Justice & Empowerment" : undefined,
            department: "Department of Social Justice & Empowerment",
          }}
          beta={s.beta}
          brandDivider={s.portal && s.divider}
          accessibilityToolbar={s.a11y}
          language={s.hindi ? { label: "हिन्दी", lang: "hi" } : { label: "English" }}
          search={s.search ? { placeholder: "Search schemes and services", onSearch: () => {} } : undefined}
          account={s.portal && s.account ? { name: "Rajesh Kumar", role: "District Welfare Officer" } : undefined}
          accountMenu={
            s.portal && s.account
              ? [
                  { label: "Profile", onSelect: () => {} },
                  { label: "Sign out", danger: true, onSelect: () => {} },
                ]
              : undefined
          }
          onToggleNav={s.portal ? () => {} : undefined}
          navExpanded={s.portal ? true : undefined}
          nav={nav}
          actions={
            s.actions ? (
              <a className={buttonClasses("primary", "filled", "md")} href="#">
                {s.portal ? "Login" : "Apply Online"}
              </a>
            ) : undefined
          }
        />
        </div>
      </div>
    </div>
  );
}
