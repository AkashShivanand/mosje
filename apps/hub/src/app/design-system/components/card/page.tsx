import * as React from "react";
import type { Metadata } from "next";
import { CardPlayground } from "./card-playground";
import { Playground } from "@/components/design-system/playground";
import { PropsTable, DoDont, A11yChecklist, Callout, StatusBadge } from "@/components/design-system/docs-kit";
import { buttonClasses } from "@mosje/design-system";
import { figmaUrl, FIGMA_NODES } from "@/lib/design-system/figma";

export const metadata: Metadata = {
  title: "Card",
  description:
    "Card is a surface for grouping related content — a styled container composed of header, body and footer sections, with outlined and elevated variants.",
};

const sectionStyle: React.CSSProperties = { marginBottom: "var(--sa-section-48)" };
const h2Style: React.CSSProperties = {
  fontSize: "var(--sa-type-headline-2-size)",
  fontWeight: 600,
  marginBottom: "var(--sa-stack-16)",
  scrollMarginTop: "var(--sa-section-48)",
};
const leadStyle: React.CSSProperties = {
  fontSize: "var(--sa-type-body-1-size)",
  color: "var(--sa-text-neutral-subtle)",
  lineHeight: "var(--sa-type-body-1-lh)",
  maxWidth: "64ch",
  marginBottom: "var(--sa-stack-16)",
};

export default function CardPage(): React.JSX.Element {
  return (
    <>
      {/* ── Header ── */}
      <div style={{ marginBottom: "var(--sa-stack-32)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "var(--sa-stack-12)", marginBottom: "var(--sa-stack-12)" }}>
          <h1 style={{ fontSize: "var(--sa-type-display-1-size)", fontWeight: 500, lineHeight: 1.1 }}>Card</h1>
          <StatusBadge status="Stable" />
        </div>
        <p style={{ fontSize: "var(--sa-type-headline-2-size)", fontWeight: 400, color: "var(--sa-color-text-default)", maxWidth: "60ch", lineHeight: 1.5 }}>
          A surface for grouping related content into a single, scannable unit.
        </p>
        <div style={{ marginTop: "var(--sa-stack-16)" }}>
          <a className={buttonClasses("primary", "outlined", "md")} href={figmaUrl(FIGMA_NODES.card)} target="_blank" rel="noopener noreferrer">
            View in Figma <span aria-hidden="true">↗</span>
          </a>
        </div>
      </div>

      {/* ── Overview ── */}
      <section style={sectionStyle}>
        <h2 id="overview" style={h2Style}>Overview</h2>
        <p style={leadStyle}>
          A <strong>Card</strong> is a styled surface container that visually groups a piece of
          related content — a heading, supporting text, media, and actions — so it reads as one
          coherent block. Compose it from <code>CardHeader</code>, <code>CardBody</code> and{" "}
          <code>CardFooter</code>, with <code>CardTitle</code> and <code>CardSubtitle</code> for
          typographic hierarchy inside the header.
        </p>
        <p style={leadStyle}>
          Use cards to break a page into digestible regions: a scheme summary, a dashboard metric,
          a news item, or a settings panel. Keep each card focused on a single subject.
        </p>
      </section>

      {/* ── Playground ── */}
      <section style={sectionStyle}>
        <h2 id="playground" style={h2Style}>Playground</h2>
        <p style={leadStyle}>
          A card composed of a header (title + subtitle), a body, and a footer with one primary
          action. Switch the variant to compare the outlined and elevated surfaces.
        </p>
        <CardPlayground />
      </section>

      {/* ── Variants ── */}
      <section style={sectionStyle}>
        <h2 id="variants" style={h2Style}>Variants</h2>
        <p style={leadStyle}>
          The card surface comes in two built-in variants. A &ldquo;default&rdquo; flat surface (no
          border, no shadow) is achieved by removing the surface treatment — use{" "}
          <code>variant=&quot;outlined&quot;</code> on muted backgrounds and{" "}
          <code>variant=&quot;elevated&quot;</code> when a card should lift off the page.
        </p>
        <Playground
          code={`<div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
  <Card style={{ maxWidth: 220, background: "var(--sa-bg-neutral-base)" }}>
    <CardBody>
      <CardTitle>Default</CardTitle>
      <CardSubtitle>Flat surface — no border, no shadow.</CardSubtitle>
    </CardBody>
  </Card>

  <Card variant="elevated" style={{ maxWidth: 220 }}>
    <CardBody>
      <CardTitle>Elevated</CardTitle>
      <CardSubtitle>Raised with a shadow, no border.</CardSubtitle>
    </CardBody>
  </Card>

  <Card variant="outlined" style={{ maxWidth: 220 }}>
    <CardBody>
      <CardTitle>Outlined</CardTitle>
      <CardSubtitle>1px border, sits flat on the page.</CardSubtitle>
    </CardBody>
  </Card>
</div>`}
        />
        <Callout type="info" title="Default vs. outlined">
          The design system ships <code>outlined</code> and <code>elevated</code>. A truly
          border-less &ldquo;default&rdquo; card is just a Card with the border removed via{" "}
          <code>style</code>/<code>className</code> — reach for <code>outlined</code> in most
          layouts so card edges stay visible.
        </Callout>
      </section>

      {/* ── Do / Don't ── */}
      <section style={sectionStyle}>
        <h2 id="guidelines" style={h2Style}>Do &amp; Don&apos;t</h2>
        <DoDont
          cards={[
            {
              type: "do",
              label: "Keep one primary action per card so the next step is unambiguous.",
              preview: (
                <div style={{ border: "1px solid var(--sa-border-neutral-subtle)", borderRadius: "var(--sa-shape-md)", padding: "var(--sa-stack-16)", background: "var(--sa-bg-neutral-base)", width: 220 }}>
                  <div style={{ fontWeight: 600, marginBottom: 4, color: "var(--sa-color-text-default)" }}>NSFDC Loan</div>
                  <div style={{ fontSize: "var(--sa-type-body-3-size)", color: "var(--sa-color-text-muted)", marginBottom: "var(--sa-stack-16)" }}>Term loan for self-employment.</div>
                  <span style={{ display: "inline-block", padding: "var(--sa-padding-8) var(--sa-padding-16)", borderRadius: "var(--sa-shape-sm)", background: "var(--sa-bg-brand-primary-bolder)", color: "var(--sa-on-bg-brand-primary-bolder)", fontSize: "var(--sa-type-body-3-size)", fontWeight: 600 }}>Apply</span>
                </div>
              ),
            },
            {
              type: "dont",
              label: "Don't nest buttons (or other clickable controls) inside a card that is itself clickable — it creates nested interactive elements and ambiguous hit targets.",
              preview: (
                <div style={{ border: "2px solid var(--sa-border-status-error-base)", borderRadius: "var(--sa-shape-md)", padding: "var(--sa-stack-16)", background: "var(--sa-bg-neutral-base)", width: 220, cursor: "pointer" }}>
                  <div style={{ fontWeight: 600, marginBottom: "var(--sa-stack-12)", color: "var(--sa-color-text-default)" }}>Clickable card</div>
                  <div style={{ display: "flex", gap: 8 }}>
                    <span style={{ padding: "var(--sa-padding-8) var(--sa-padding-12)", borderRadius: "var(--sa-shape-sm)", background: "var(--sa-bg-brand-primary-bolder)", color: "var(--sa-on-bg-brand-primary-bolder)", fontSize: "var(--sa-type-body-3-size)" }}>Edit</span>
                    <span style={{ padding: "var(--sa-padding-8) var(--sa-padding-12)", borderRadius: "var(--sa-shape-sm)", border: "1px solid var(--sa-border-neutral-base)", color: "var(--sa-color-text-default)", fontSize: "var(--sa-type-body-3-size)" }}>Delete</span>
                  </div>
                </div>
              ),
            },
          ]}
        />
      </section>

      {/* ── Accessibility ── */}
      <section style={sectionStyle}>
        <h2 id="accessibility" style={h2Style}>Accessibility</h2>
        <Callout type="warning" title="Clickable cards must wrap, not listen">
          If a whole card navigates somewhere, wrap the entire card in an <code>&lt;a href&gt;</code>{" "}
          (or render the card <em>as</em> a link) so the full surface is a single, keyboard-focusable
          link. Do <strong>not</strong> attach <code>onClick</code> to a <code>&lt;div&gt;</code> — a
          div is not focusable, not announced as a link, and not keyboard-operable.
        </Callout>
        <div style={{ marginTop: "var(--sa-padding-20)" }}>
          <A11yChecklist
            items={[
              { criterion: "Whole-card links use a real anchor", level: "A", description: "If the card is clickable, wrap it in <a href> (not just the title). The entire surface becomes one focusable, keyboard-operable link." },
              { criterion: "No onClick on non-interactive elements", level: "A", description: "Never put onClick on a <div>. Divs are not focusable and screen readers don't announce them as actionable." },
              { criterion: "Single interactive target per card", level: "A", description: "Avoid nesting buttons or links inside a clickable card — nested interactive elements are an invalid, confusing pattern." },
              { criterion: "Title uses a heading element", level: "AA", description: "CardTitle renders an <h3>; ensure the heading level fits the surrounding document outline so structure stays logical." },
              { criterion: "Visible focus indicator", level: "AA", description: "A focusable card or its action must show a clear focus ring meeting AA contrast against the card surface." },
            ]}
          />
        </div>
      </section>

      {/* ── API ── */}
      <section style={sectionStyle}>
        <h2 id="api" style={h2Style}>API</h2>
        <h3 style={{ fontSize: "var(--sa-type-body-1-size)", fontWeight: 600, margin: "var(--sa-stack-16) 0 var(--sa-stack-8)" }}>Card</h3>
        <PropsTable
          props={[
            { name: "variant", type: '"outlined" | "elevated"', default: '"outlined"', description: "Surface style. Outlined draws a 1px border; elevated uses a shadow with no border." },
            { name: "orientation", type: '"vertical" | "horizontal"', default: '"vertical"', description: "Layout direction. Horizontal places media beside the content." },
            { name: "className", type: "string", description: "Additional classes merged onto the root element." },
            { name: "...rest", type: "HTMLAttributes<HTMLDivElement>", description: "All standard div props (style, id, data-*, etc.) are forwarded." },
          ]}
        />
        <h3 style={{ fontSize: "var(--sa-type-body-1-size)", fontWeight: 600, margin: "var(--sa-stack-24) 0 var(--sa-stack-8)" }}>
          CardHeader · CardBody · CardFooter · CardTitle · CardSubtitle
        </h3>
        <PropsTable
          props={[
            { name: "children", type: "ReactNode", required: true, description: "Section content. CardTitle renders an <h3>; CardSubtitle renders a muted <p>." },
            { name: "className", type: "string", description: "Additional classes merged onto the section element." },
            { name: "...rest", type: "HTMLAttributes", description: "Standard element props are forwarded to the underlying div/heading/paragraph." },
          ]}
        />
      </section>
    </>
  );
}
