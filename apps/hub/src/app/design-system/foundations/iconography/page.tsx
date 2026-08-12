import * as React from "react";
import type { Metadata } from "next";
import { Icon, buttonClasses } from "@mosje/design-system";
import { iconSize } from "@mosje/design-system/tokens";
import { Callout } from "@/components/design-system/docs-kit/index";
import { figmaUrl, FIGMA_NODES } from "@/lib/design-system/figma";

export const metadata: Metadata = {
  title: "Iconography",
  description:
    "The SAMAVESH icon system — Material Symbols Rounded for UI, inline SVG for brand and social, and government emblems as dedicated SVG files.",
};

/**
 * The icons shown on this page are the real thing — Material Symbols Rounded
 * rendered through the DS `<Icon>`, not redrawn copies. A documentation page
 * that hand-draws its own icons drifts from the system it documents.
 */
/**
 * DBIM 3.0 §3.4 (Figure 9) publishes four icon sizes. This is a fact about the
 * STANDARD, not about our tokens, so it is stated once here — the sizes themselves
 * come from `iconSize`, which is generated from the stylesheet and cannot drift.
 */
const DBIM_SIZES = new Set<number>([24, 32, 48, 64]);

/** Generated from the stylesheet by @mosje/tokens — never hand-typed here. */
const SIZES: number[] = Object.values(iconSize);

const SIZE_USE: Record<number, string> = {
  16: "Beside body text",
  20: "List rows and menus",
  24: "Default — standalone controls",
  32: "Section headers",
  40: "Feature tiles",
  48: "Hero surfaces",
  64: "Largest step",
};

const COMMON_ICONS = [
  "search",
  "keyboard_arrow_down",
  "close",
  "check",
  "error",
  "info",
  "menu",
  "arrow_forward",
  "arrow_back",
  "download",
  "upload",
  "person",
  "group",
  "calendar_today",
  "call",
  "mail",
  "open_in_new",
  "visibility",
  "visibility_off",
  "lock",
  "key",
  "filter_alt",
  "edit",
  "delete",
  "add",
  "location_on",
  "description",
  "notifications",
  "settings",
  "logout",
];

export default function IconographyPage(): React.JSX.Element {
  return (
    <article className="ds-prose">
      <h1>Iconography</h1>
      <p style={{ fontSize: "var(--sa-type-headline-1-size)", lineHeight: "var(--sa-type-headline-1-lh)", color: "var(--sa-color-text-muted)", marginTop: "var(--sa-stack-s)" }}>
        Icons help people scan and recognise actions quickly. SAMAVESH keeps the
        set small, consistent and always paired with a label.
      </p>
      <div style={{ marginTop: "var(--sa-stack-m)" }}>
        <a className={buttonClasses("primary", "outlined", "md")} href={figmaUrl(FIGMA_NODES.iconography)} target="_blank" rel="noopener noreferrer">
          View in Figma <span aria-hidden="true">↗</span>
        </a>
      </div>

      <section aria-labelledby="system" style={{ marginTop: "var(--sa-stack-2xl)" }}>
        <h2 id="system">The icon system</h2>
        <ul style={{ marginTop: "var(--sa-stack-m)" }}>
          <li>
            <strong>Material Symbols Rounded</strong> is the source for every UI
            icon, rendered through the design system&rsquo;s{" "}
            <code>&lt;Icon name=&quot;…&quot; /&gt;</code> — one consistent
            24&times;24 style at weight 300 across every site and portal. Icons
            are named, not imported: <code>name</code> takes a snake_case
            ligature such as <code>arrow_forward</code> or{" "}
            <code>location_on</code>.
          </li>
          <li>
            <strong>Inline SVG</strong> is used for social and brand marks (X,
            YouTube, Facebook, etc.), which have no Material Symbols equivalent.
          </li>
          <li>
            <strong>Government emblems</strong> (the National Emblem, SAMAVESH
            and ministry crests) live as dedicated SVG files in the asset
            library and are never recoloured or redrawn.
          </li>
        </ul>
      </section>

      <section aria-labelledby="grid" style={{ marginTop: "var(--sa-stack-2xl)" }}>
        <h2 id="grid">Most-used icons</h2>
        <div
          style={{
            marginTop: "var(--sa-stack-l)",
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(120px, 1fr))",
            gap: "var(--sa-stack-s)",
          }}
        >
          {COMMON_ICONS.map((name) => (
            <div
              key={name}
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "var(--sa-stack-xs)",
                padding: "var(--sa-padding-m)",
                background: "var(--sa-bg-neutral-subtler)",
                borderRadius: "var(--sa-shape-md)",
                color: "var(--sa-text-neutral-base)",
              }}
            >
              <Icon name={name} size={24} aria-hidden />
              <code style={{ fontSize: "var(--sa-type-body-3-size)", color: "var(--sa-color-text-muted)" }}>{name}</code>
            </div>
          ))}
        </div>
      </section>

      <section aria-labelledby="usage" style={{ marginTop: "var(--sa-stack-2xl)" }}>
        <h2 id="usage">Usage rules</h2>
        <ul style={{ marginTop: "var(--sa-stack-m)" }}>
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

      <section aria-labelledby="size" style={{ marginTop: "var(--sa-stack-2xl)" }}>
        <h2 id="size">Sizes</h2>
        <p style={{ marginTop: "var(--sa-stack-s)", color: "var(--sa-color-text-muted)" }}>
          Seven steps. The four tagged <strong>DBIM</strong> are the sizes the Digital Brand Identity
          Manual publishes (§3.4, Figure 9) — those are <em>frames</em> that include 2px of padding on
          every edge, so their live area is 4px smaller. The other three are ours and are kept
          deliberately.
        </p>
        <div
          style={{
            marginTop: "var(--sa-stack-l)",
            display: "flex",
            flexWrap: "wrap",
            gap: "var(--sa-stack-xl)",
            alignItems: "flex-end",
            color: "var(--sa-text-neutral-base)",
          }}
        >
          {SIZES.map((size) => (
            <div
              key={size}
              style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "var(--sa-stack-2xs)", maxWidth: "14ch" }}
            >
              <Icon name="settings" size={size} aria-hidden />
              <span style={{ fontSize: "var(--sa-type-body-2-size)", fontWeight: 500 }}>{size}px</span>
              <span style={{ fontSize: "var(--sa-type-label-3-size)", color: DBIM_SIZES.has(size) ? "var(--sa-color-action-primary-default)" : "var(--sa-color-text-muted)" }}>
                {DBIM_SIZES.has(size) ? `DBIM · live area ${size - 4}` : "Interface"}
              </span>
              <code style={{ fontSize: "var(--sa-type-label-3-size)", color: "var(--sa-color-text-muted)" }}>
                --sa-icon-size-{size}
              </code>
              <span style={{ fontSize: "var(--sa-type-label-3-size)", color: "var(--sa-color-text-muted)", textAlign: "center" }}>
                {SIZE_USE[size]}
              </span>
            </div>
          ))}
        </div>
        <Callout type="info" title="Quality first, then the standard">
          A standard&rsquo;s list is a <strong>floor, not a ceiling</strong>. DBIM §3.4 governs the
          downloadable icon asset bank; it does not forbid a smaller inline glyph, and 16px beside 14px
          body text is the right size there. When a standard specifies a set, we <strong>add what is
          missing</strong> and never delete what quality needs — with accessibility the one thing never
          traded, because accessibility is quality. See{" "}
          <code>.claude/rules/standards-precedence.md</code>.
        </Callout>
      </section>

    </article>
  );
}
