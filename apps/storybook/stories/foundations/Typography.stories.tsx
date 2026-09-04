import type { Meta, StoryObj } from "@storybook/react";
import * as React from "react";

/**
 * **Typography** foundation — the SAMAVESH 21-role type scale, every role bound to its
 * `--sa-type-<role>-size` / `-lh` pair. Five tiers: Display (500, the optical Display cut),
 * Headline (600), Title (600), Body (400) and Label (500). `label-3` is the CAPS role:
 * uppercase, with `--sa-type-caps-tracking`. Every role is fluid and surface-aware — the
 * same token is 32px on the website and 28px inside `[data-surface="portal"]` — which is
 * why the scale is rendered twice, once per surface.
 *
 * Multi-script ready: each specimen carries Latin and, inside `lang="hi"`, Devanagari, so
 * the `--sa-font-devanagari` binding and its leading are visible beside the Latin cut.
 */
const meta: Meta = { title: "Foundations/Typography" };
export default meta;
type Story = StoryObj;

type Tier = "display" | "headline" | "title" | "body" | "label";

interface Role {
  tier: Tier;
  name: string;
  /** Token stem, e.g. `display-1` → `--sa-type-display-1-size` / `-lh`. */
  stem: string;
  weight: 400 | 500 | 600;
  /** The website / portal desktop sizes, from the token build, for the caption. */
  sizes: string;
  use: string;
}

const TIER_WEIGHT: Record<Tier, 400 | 500 | 600> = {
  display: 500,
  headline: 600,
  title: 600,
  body: 400,
  label: 500,
};

const ROLES: Role[] = [
  { tier: "display", name: "Display 1", stem: "display-1", weight: 500, sizes: "80 / 56", use: "Hero and campaign headings only" },
  { tier: "display", name: "Display 2", stem: "display-2", weight: 500, sizes: "72 / 48", use: "Hero and campaign headings only" },
  { tier: "display", name: "Display 3", stem: "display-3", weight: 500, sizes: "64 / 40", use: "Hero and campaign headings only" },
  { tier: "display", name: "Display 4", stem: "display-4", weight: 500, sizes: "56 / 32", use: "Hero and campaign headings only" },
  { tier: "display", name: "Display 5", stem: "display-5", weight: 500, sizes: "48 / 28", use: "Hero and campaign headings only" },
  { tier: "display", name: "Display 6", stem: "display-6", weight: 500, sizes: "40 / 24", use: "Hero and campaign headings only" },
  { tier: "headline", name: "Headline 1", stem: "headline-1", weight: 600, sizes: "40 / 32", use: "The page h1" },
  { tier: "headline", name: "Headline 2", stem: "headline-2", weight: 600, sizes: "32 / 28", use: "Major section h2" },
  { tier: "headline", name: "Headline 3", stem: "headline-3", weight: 600, sizes: "28 / 24", use: "Section h2 / h3" },
  { tier: "headline", name: "Headline 4", stem: "headline-4", weight: 600, sizes: "24 / 20", use: "Sub-section h3 / h4; SectionTitle" },
  { tier: "headline", name: "Headline 5", stem: "headline-5", weight: 600, sizes: "20 / 18", use: "Minor heading h4 / h5" },
  { tier: "headline", name: "Headline 6", stem: "headline-6", weight: 600, sizes: "16 / 16", use: "Smallest heading h5 / h6" },
  { tier: "title", name: "Title 1", stem: "title-1", weight: 600, sizes: "22 / 22", use: "Card, panel and dialog title" },
  { tier: "title", name: "Title 2", stem: "title-2", weight: 600, sizes: "16 / 16", use: "List-item title, small card title, table caption" },
  { tier: "title", name: "Title 3", stem: "title-3", weight: 600, sizes: "14 / 14", use: "Dense table header, compact list title" },
  { tier: "body", name: "Body 1", stem: "body-1", weight: 400, sizes: "16 / 16", use: "Running text, form values, lead paragraphs" },
  { tier: "body", name: "Body 2", stem: "body-2", weight: 400, sizes: "14 / 14", use: "Secondary text, table cells, help text" },
  { tier: "body", name: "Body 3", stem: "body-3", weight: 400, sizes: "12 / 12", use: "Captions, timestamps, legal, footnotes" },
  { tier: "label", name: "Label 1", stem: "label-1", weight: 500, sizes: "14 / 14", use: "Form labels, button text, tabs, nav items" },
  { tier: "label", name: "Label 2", stem: "label-2", weight: 500, sizes: "12 / 12", use: "Badges, chips, small controls" },
  { tier: "label", name: "Label 3", stem: "label-3", weight: 500, sizes: "12 / 12", use: "Uppercase overlines and eyebrows only, with caps tracking" },
];

const TIERS: { tier: Tier; heading: string; note: string }[] = [
  { tier: "display", heading: "Display", note: "500 on var(--sa-font-display), the optical Display cut. Never for document structure." },
  { tier: "headline", heading: "Headline", note: "600. Headings stop at semibold; 700 is for inline emphasis and KPI numerals." },
  { tier: "title", heading: "Title", note: "600. Titles of cards, panels, dialogs and list items." },
  { tier: "body", heading: "Body", note: "400. Running text at three sizes; nothing renders below 12px." },
  { tier: "label", heading: "Label", note: "500. Controls and eyebrows; label-3 is the only uppercase role and carries the caps tracking." },
];

const CAPTION: React.CSSProperties = {
  fontSize: "var(--sa-type-body-3-size)",
  lineHeight: "var(--sa-type-body-3-lh)",
  color: "var(--sa-text-neutral-subtle)",
  marginBottom: "var(--sa-stack-4)",
  fontVariantNumeric: "tabular-nums",
};

function specimenStyle(r: Role): React.CSSProperties {
  const base: React.CSSProperties = {
    margin: 0,
    fontSize: `var(--sa-type-${r.stem}-size)`,
    lineHeight: `var(--sa-type-${r.stem}-lh)`,
    fontWeight: TIER_WEIGHT[r.tier],
    color: "var(--sa-text-neutral-bolder)",
    overflowWrap: "anywhere",
  };
  if (r.tier === "display") {
    base.fontFamily = "var(--sa-font-display)";
    base.letterSpacing = `var(--sa-type-${r.stem}-tracking)`;
  } else if (r.stem === "label-3") {
    base.letterSpacing = "var(--sa-type-caps-tracking)";
    base.textTransform = "uppercase";
  } else {
    base.letterSpacing = `var(--sa-type-${r.tier === "headline" ? "heading" : r.tier}-tracking)`;
  }
  return base;
}

function ScaleList() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--sa-stack-32)" }}>
      {TIERS.map((t) => (
        <section key={t.tier}>
          <h2
            style={{
              margin: "0 0 var(--sa-stack-4)",
              fontSize: "var(--sa-type-title-2-size)",
              lineHeight: "var(--sa-type-title-2-lh)",
              fontWeight: 600,
              color: "var(--sa-text-neutral-bolder)",
            }}
          >
            {t.heading}
          </h2>
          <p
            style={{
              margin: "0 0 var(--sa-stack-16)",
              fontSize: "var(--sa-type-body-2-size)",
              lineHeight: "var(--sa-type-body-2-lh)",
              color: "var(--sa-text-neutral-subtle)",
              maxWidth: "68ch",
            }}
          >
            {t.note}
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: "var(--sa-stack-20)" }}>
            {ROLES.filter((r) => r.tier === t.tier).map((r) => (
              <div
                key={r.stem}
                style={{
                  borderBottom: "1px solid var(--sa-border-neutral-subtle)",
                  paddingBottom: "var(--sa-stack-16)",
                }}
              >
                <div style={CAPTION}>
                  <strong style={{ fontWeight: 600, color: "var(--sa-text-neutral-base)" }}>{r.name}</strong>
                  {" · "}
                  <code>--sa-type-{r.stem}-size</code> / <code>--sa-type-{r.stem}-lh</code>
                  {" · "}
                  {r.sizes}px website / portal · {TIER_WEIGHT[r.tier]}
                  {" · "}
                  {r.use}
                </div>
                <p style={specimenStyle(r)}>Social Justice &amp; Empowerment</p>
                <p style={specimenStyle(r)}>
                  <span lang="hi">सामाजिक न्याय और अधिकारिता</span>
                </p>
              </div>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}

/** All 21 roles at their website values. */
export const Scale: Story = {
  render: () => <ScaleList />,
};

/**
 * The same 21 roles inside `[data-surface="portal"]`, where the token build re-binds every
 * role to the denser portal ladder (headline-1 is 32px here against 40px on the website).
 */
export const PortalScale: Story = {
  render: () => (
    <div data-surface="portal">
      <ScaleList />
    </div>
  ),
};
