import * as React from "react";
import type { Metadata } from "next";
import { buttonClasses } from "@mosje/design-system";
import { figmaUrl, FIGMA_NODES } from "@/lib/design-system/figma";

export const metadata: Metadata = {
  title: "Iconography",
  description:
    "The SAMAVESH icon system — lucide-react for UI, inline SVG for brand and social, and government emblems as dedicated SVG files.",
};

// lucide-style 24×24 stroke paths, rendered inline so this stays a server
// component. `aria-hidden` is set here because every icon in the grid is
// paired with a visible label below it.
const ICON_PATHS: Record<string, React.ReactNode> = {
  Search: (
    <>
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.3-4.3" />
    </>
  ),
  ChevronDown: <path d="m6 9 6 6 6-6" />,
  X: (
    <>
      <path d="M18 6 6 18" />
      <path d="m6 6 12 12" />
    </>
  ),
  Check: <path d="M20 6 9 17l-5-5" />,
  AlertCircle: (
    <>
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="8" x2="12" y2="12" />
      <line x1="12" y1="16" x2="12.01" y2="16" />
    </>
  ),
  Info: (
    <>
      <circle cx="12" cy="12" r="10" />
      <path d="M12 16v-4" />
      <path d="M12 8h.01" />
    </>
  ),
  Menu: (
    <>
      <line x1="4" y1="6" x2="20" y2="6" />
      <line x1="4" y1="12" x2="20" y2="12" />
      <line x1="4" y1="18" x2="20" y2="18" />
    </>
  ),
  ArrowRight: (
    <>
      <path d="M5 12h14" />
      <path d="m12 5 7 7-7 7" />
    </>
  ),
  Download: (
    <>
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <polyline points="7 10 12 15 17 10" />
      <line x1="12" y1="15" x2="12" y2="3" />
    </>
  ),
  Upload: (
    <>
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <polyline points="17 8 12 3 7 8" />
      <line x1="12" y1="3" x2="12" y2="15" />
    </>
  ),
  User: (
    <>
      <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </>
  ),
  Calendar: (
    <>
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
      <line x1="16" y1="2" x2="16" y2="6" />
      <line x1="8" y1="2" x2="8" y2="6" />
      <line x1="3" y1="10" x2="21" y2="10" />
    </>
  ),
  Phone: (
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
  ),
  Mail: (
    <>
      <rect x="2" y="4" width="20" height="16" rx="2" />
      <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
    </>
  ),
  ExternalLink: (
    <>
      <path d="M15 3h6v6" />
      <path d="M10 14 21 3" />
      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
    </>
  ),
  Eye: (
    <>
      <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
      <circle cx="12" cy="12" r="3" />
    </>
  ),
  EyeOff: (
    <>
      <path d="M9.88 9.88a3 3 0 0 0 4.24 4.24" />
      <path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68" />
      <path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61" />
      <line x1="2" y1="2" x2="22" y2="22" />
    </>
  ),
  Lock: (
    <>
      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </>
  ),
  Unlock: (
    <>
      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
      <path d="M7 11V7a5 5 0 0 1 9.9-1" />
    </>
  ),
  Filter: <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />,
};

function Icon({ name, size = 24 }: { name: keyof typeof ICON_PATHS | string; size?: number }): React.JSX.Element {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      {ICON_PATHS[name]}
    </svg>
  );
}

export default function IconographyPage(): React.JSX.Element {
  const names = Object.keys(ICON_PATHS);

  return (
    <article className="ds-prose">
      <h1>Iconography</h1>
      <p style={{ fontSize: "var(--ds-text-headline)", color: "var(--ds-ink-muted)", marginTop: "var(--ds-spacing-md)" }}>
        Icons help people scan and recognise actions quickly. SAMAVESH keeps the
        set small, consistent and always paired with a label.
      </p>
      <div style={{ marginTop: "var(--ds-spacing-lg)" }}>
        <a className={buttonClasses("primary", "outlined", "md")} href={figmaUrl(FIGMA_NODES.iconography)} target="_blank" rel="noopener noreferrer">
          View in Figma <span aria-hidden="true">↗</span>
        </a>
      </div>

      <section aria-labelledby="system" style={{ marginTop: "var(--ds-spacing-4xl)" }}>
        <h2 id="system">The icon system</h2>
        <ul style={{ marginTop: "var(--ds-spacing-lg)" }}>
          <li>
            <strong>lucide-react</strong> is the source for the vast majority of
            UI icons — one consistent 24×24 stroke style across every site and
            portal.
          </li>
          <li>
            <strong>Inline SVG</strong> is used for social and brand marks (X,
            YouTube, Facebook, etc.), because this version of lucide dropped the
            brand glyphs.
          </li>
          <li>
            <strong>Government emblems</strong> (the National Emblem, SAMAVESH
            and ministry crests) live as dedicated SVG files in the asset
            library and are never recoloured or redrawn.
          </li>
        </ul>
      </section>

      <section aria-labelledby="grid" style={{ marginTop: "var(--ds-spacing-4xl)" }}>
        <h2 id="grid">Most-used icons</h2>
        <div
          style={{
            marginTop: "var(--ds-spacing-2xl)",
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(120px, 1fr))",
            gap: "var(--ds-spacing-md)",
          }}
        >
          {names.map((name) => (
            <div
              key={name}
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "var(--ds-spacing-sm)",
                padding: "var(--ds-spacing-lg)",
                background: "var(--ds-surface-muted)",
                borderRadius: "var(--ds-radius-md)",
                color: "var(--ds-ink)",
              }}
            >
              <Icon name={name} size={24} />
              <span style={{ fontSize: "var(--ds-text-body-2)", color: "var(--ds-ink-muted)" }}>{name}</span>
            </div>
          ))}
        </div>
      </section>

      <section aria-labelledby="usage" style={{ marginTop: "var(--ds-spacing-4xl)" }}>
        <h2 id="usage">Usage rules</h2>
        <ul style={{ marginTop: "var(--ds-spacing-lg)" }}>
          <li>
            Decorative icons next to visible text must carry{" "}
            <code>aria-hidden=&quot;true&quot;</code> so screen readers
            don&apos;t announce them twice.
          </li>
          <li>
            An icon-only button must have an <code>aria-label</code> describing
            the action — for example a close button labelled
            &ldquo;Close&rdquo;.
          </li>
          <li>
            Never use an icon alone, with no label and no accessible name, for
            an interactive element. If a user cannot read the icon&apos;s
            meaning, the control is unusable.
          </li>
        </ul>
      </section>

      <section aria-labelledby="size" style={{ marginTop: "var(--ds-spacing-4xl)" }}>
        <h2 id="size">Size guidance</h2>
        <div
          style={{
            marginTop: "var(--ds-spacing-2xl)",
            display: "flex",
            flexWrap: "wrap",
            gap: "var(--ds-spacing-3xl)",
            alignItems: "flex-end",
            color: "var(--ds-ink)",
          }}
        >
          {[
            { size: 16, label: "16px — inline with body text" },
            { size: 20, label: "20px — list items and menu rows" },
            { size: 24, label: "24px — standalone controls" },
          ].map(({ size, label }) => (
            <div key={size} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "var(--ds-spacing-sm)" }}>
              <Icon name="Search" size={size} />
              <span style={{ fontSize: "var(--ds-text-body-2)", color: "var(--ds-ink-muted)", textAlign: "center", maxWidth: "120px" }}>
                {label}
              </span>
            </div>
          ))}
        </div>
      </section>
    </article>
  );
}
