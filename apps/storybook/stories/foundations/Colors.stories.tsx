import type { Meta, StoryObj } from "@storybook/react";
import * as React from "react";

/**
 * **Color** foundation.
 *
 * Use the **Color mode** toolbar to switch brand — that is the axis this page is really
 * about. A brand swap changes the PRIMARY ramp and the neutral greys, and nothing else:
 * secondary (India Saffron) and accent (India Green) are both SAMAVESH logo colours, so they
 * are constants of the identity rather than variants of it.
 *
 * That was not always true. Until 2026-08-11 the Navy brand rotated its secondary ramp about
 * 100 degrees into green — territory the success semantic already owned — landing the two
 * 0.3 L* apart with a contrast ratio between them of 1.00:1. A secondary-action chip and a
 * saved-state chip were the same object on screen. Flip to Navy on the **Brand axis** story
 * below and the two families now stay apart; a hue-separation gate makes the regression
 * unshippable.
 *
 * There is no light/dark toolbar. The appearance axis was retired — the UX4G accessibility
 * widget is the estate's single dark and high-contrast mechanism, and it drives its own class.
 *
 * **Bind to the semantic layer, never to a ramp step.** `bg/*`, `text/*`, `border/*` and
 * `icon/*` carry the measured contrast guarantee; `color/*Scale/*` is the raw ramp underneath
 * and carries none.
 */
const meta: Meta = { title: "Foundations/Color" };
export default meta;
type Story = StoryObj;

/* ------------------------------------------------------------------ shared bits */

const mono = "ui-monospace, SFMono-Regular, Menlo, monospace";

function Section({ title, blurb, children }: { title: string; blurb: string; children: React.ReactNode }) {
  return (
    <section style={{ marginBottom: 44 }}>
      <h3 style={{ margin: "0 0 4px", fontSize: 16, fontWeight: 650 }}>{title}</h3>
      <p style={{ margin: "0 0 16px", fontSize: 13.5, maxWidth: "70ch", color: "var(--sa-text-neutral-subtle)" }}>
        {blurb}
      </p>
      {children}
    </section>
  );
}

/** A ramp row. Steps are read from CSS, so this cannot drift from the tokens. */
const STEPS = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950] as const;

function Ramp({ scale, note }: { scale: string; note?: string }) {
  return (
    <div style={{ marginBottom: 18 }}>
      <div style={{ display: "flex", gap: 12, alignItems: "baseline", marginBottom: 6 }}>
        <code style={{ fontFamily: mono, fontSize: 12.5, fontWeight: 600 }}>color/{scale}</code>
        {note ? (
          <span style={{ fontFamily: mono, fontSize: 11, color: "var(--sa-text-neutral-subtle)" }}>{note}</span>
        ) : null}
      </div>
      <div style={{ display: "flex", gap: 2 }}>
        {STEPS.map((step) => (
          <div key={step} style={{ flex: 1, minWidth: 0 }}>
            <div
              style={{
                height: 44,
                borderRadius: 2,
                background: `var(--sa-color-${scale}-${step})`,
                border: "1px solid var(--sa-border-neutral-subtle)",
              }}
            />
            <div
              style={{
                fontFamily: mono,
                fontSize: 9.5,
                textAlign: "center",
                marginTop: 4,
                color: "var(--sa-text-neutral-subtle)",
              }}
            >
              {step}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ stories */

/**
 * The eleven-step ramps. Eleven, not ten — step **950** joined on 2026-08-11 to match
 * UX4G 3.0, and it is the near-black shade a footer or a `boldest` fill wants without
 * falling back to pure black.
 *
 * Only `primaryScale` and `neutralScale` change when you switch brand.
 */
export const Ramps: Story = {
  render: () => (
    <div>
      <Section
        title="Brand ramps"
        blurb="primaryScale is the only ramp a brand swap repaints. secondaryScale and accentScale are the two SAMAVESH logo colours and are identical in every brand — switch the toolbar and watch them hold still."
      >
        <Ramp scale="primaryScale" note="brand-aware — changes with the toolbar" />
        <Ramp scale="secondaryScale" note="India Saffron #FF671F — anchored at 400, brand-invariant" />
        <Ramp scale="accentScale" note="India Green #046A38 — brand-invariant" />
      </Section>

      <Section
        title="Status ramps"
        blurb="Brand-invariant by design: a status must mean the same thing whichever brand a portal is themed with. successScale is deliberately the SAME green as accentScale — two greens nine degrees apart is a defect whichever token owns them."
      >
        <Ramp scale="successScale" note="= accentScale, on purpose" />
        <Ramp scale="dangerScale" />
        <Ramp scale="warningScale" />
        <Ramp scale="infoScale" />
      </Section>

      <Section
        title="Neutral"
        blurb="Thirteen steps, because pure white and pure black are achromatic and therefore belong here and nowhere else — a 'pure black red' is just black. 0 is #ffffff and 1000 is #000000; 950 is the near-black shade. Warm grey in Blue, cooler grey in Navy."
      >
        <div style={{ display: "flex", gap: 2 }}>
          {([0, 50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950, 1000] as const).map((step) => (
            <div key={step} style={{ flex: 1, minWidth: 0 }}>
              <div
                style={{
                  height: 44,
                  borderRadius: 2,
                  background: `var(--sa-color-neutralScale-${step})`,
                  border: "1px solid var(--sa-border-neutral-subtle)",
                }}
              />
              <div
                style={{
                  fontFamily: mono,
                  fontSize: 9.5,
                  textAlign: "center",
                  marginTop: 4,
                  color: "var(--sa-text-neutral-subtle)",
                }}
              >
                {step}
              </div>
            </div>
          ))}
        </div>
      </Section>
    </div>
  ),
};

/**
 * What a brand swap actually changes — the story this page exists for.
 *
 * Switch the **Color mode** toolbar between Blue, Navy and DBIM Blue. The primary row
 * repaints; the secondary and accent rows do not. Navy and DBIM Blue measure deltaE 1.9
 * apart, so that particular switch is expected to look like almost nothing happens.
 */
export const BrandAxis: Story = {
  render: () => {
    const ROWS = [
      { label: "primary", token: "bg-brand-primary-bolder", note: "repaints on a brand swap" },
      { label: "secondary", token: "bg-brand-secondary-bold", note: "brand-invariant — holds still" },
      // accent and success are the SAME green on purpose. Said here as well as in Ramps,
      // because side by side two identical rows read as a bug unless the page says otherwise.
      { label: "accent", token: "bg-brand-accent-bold", note: "brand-invariant — and deliberately the same green as success, below" },
      { label: "success", token: "bg-status-success-bold", note: "brand-invariant — identical to accent by design, not by accident" },
    ];
    return (
      <Section
        title="Brand axis"
        blurb="Only the primary row is brand-aware. The secondary and accent rows are SAMAVESH logo colours; the success row is a status. If secondary and success ever look alike again, the hue-separation gate has been bypassed."
      >
        <div style={{ display: "grid", gap: 10 }}>
          {ROWS.map((r) => (
            <div key={r.token} style={{ display: "flex", alignItems: "center", gap: 14 }}>
              <div
                style={{
                  width: 120,
                  height: 52,
                  borderRadius: 3,
                  flex: "none",
                  background: `var(--sa-${r.token})`,
                  border: "1px solid var(--sa-border-neutral-subtle)",
                }}
              />
              <div>
                <div style={{ fontWeight: 600, fontSize: 14 }}>{r.label}</div>
                <code style={{ fontFamily: mono, fontSize: 11.5, color: "var(--sa-text-neutral-subtle)" }}>
                  --sa-{r.token}
                </code>
                <div style={{ fontSize: 12, marginTop: 2, color: "var(--sa-text-neutral-subtle)" }}>
                  {r.note}
                </div>
              </div>
            </div>
          ))}
        </div>
      </Section>
    );
  },
};

/**
 * The semantic layer — what app code and Figma bindings actually consume.
 *
 * These are the canonical grammar names (`bg/`, `text/`, `border/`, `icon/`). The older
 * `--sa-color-*` spelling still resolves as a compatibility layer, but it is being retired;
 * prefer these.
 */
export const Semantic: Story = {
  render: () => {
    const GROUPS: { title: string; blurb: string; tokens: string[] }[] = [
      {
        title: "Backgrounds",
        blurb:
          "The prominence ladder: base -> subtler -> subtle -> bold -> bolder -> boldest. Each rung is a step on the ramp underneath, chosen so its declared ink stays readable.",
        tokens: [
          "bg-neutral-base",
          "bg-neutral-subtle",
          "bg-brand-primary-bolder",
          "bg-brand-secondary-bold",
          "bg-brand-accent-bold",
          "bg-status-success-bold",
          "bg-status-error-bold",
          "bg-status-warning-bold",
        ],
      },
      {
        title: "Text & borders",
        blurb: "Ink and boundaries. text/* carries a measured contrast class; border/* is a boundary, not text.",
        tokens: [
          "text-neutral-base",
          "text-neutral-subtle",
          "text-link-brand-default",
          "border-neutral-subtle",
          "border-neutral-base",
          "border-brand-primary-base",
        ],
      },
    ];
    return (
      <div>
        {GROUPS.map((g) => (
          <Section key={g.title} title={g.title} blurb={g.blurb}>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(230px, 1fr))", gap: 14 }}>
              {g.tokens.map((t) => (
                <div
                  key={t}
                  style={{
                    border: "1px solid var(--sa-border-neutral-subtle)",
                    borderRadius: 3,
                    overflow: "hidden",
                  }}
                >
                  <div style={{ height: 64, background: `var(--sa-${t})` }} />
                  <div style={{ padding: "8px 11px" }}>
                    <code style={{ fontFamily: mono, fontSize: 11.5 }}>--sa-{t}</code>
                  </div>
                </div>
              ))}
            </div>
          </Section>
        ))}
      </div>
    );
  },
};

/**
 * Every fill that carries content declares the ink that is readable on it.
 *
 * The pairing is chosen BY MEASUREMENT in the worst brand, not assumed from the rung name —
 * which is why accent flips to white ink at a different rung than primary does. A test
 * asserts every one of these clears 4.5:1, and that no fill carrying content lacks a pairing.
 */
export const OnPairs: Story = {
  render: () => {
    const FILLS = [
      "bg-brand-primary-bolder",
      "bg-brand-primary-subtle",
      "bg-brand-secondary-bold",
      "bg-brand-secondary-bolder",
      "bg-brand-accent-bold",
      "bg-brand-accent-bolder",
      "bg-status-success-bolder",
      "bg-status-error-bolder",
    ];
    return (
      <Section
        title="Fill and its guaranteed ink"
        blurb="Each swatch paints --sa-<fill> and sets its text to --sa-on-<fill>. If a label here is hard to read, the pairing is wrong and the on-pair test should be failing."
      >
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))", gap: 14 }}>
          {FILLS.map((f) => (
            <div
              key={f}
              style={{
                background: `var(--sa-${f})`,
                color: `var(--sa-on-${f})`,
                border: "1px solid var(--sa-border-neutral-subtle)",
                borderRadius: 3,
                padding: "18px 14px",
                minHeight: 84,
              }}
            >
              <div style={{ fontWeight: 650, fontSize: 14, marginBottom: 4 }}>Readable on its own fill</div>
              <code style={{ fontFamily: mono, fontSize: 11 }}>--sa-{f}</code>
            </div>
          ))}
        </div>
      </Section>
    );
  },
};

/**
 * Alpha overlay tiers — translucent washes for hovers, scrims and selection states.
 *
 * DERIVED from each family's base colour rather than hand-written. They were 42 rgba()
 * literals until 2026-08-11 and had rotted: after the palette rebuild they still carried the
 * retired saffron, the retired Material green and the retired navy. A literal has no
 * reference to break, so nothing caught it.
 */
export const AlphaTiers: Story = {
  render: () => {
    const FAMILIES = ["primary", "secondary", "accent", "neutral", "success", "danger", "warning"];
    const STOPS = [8, 16, 24, 32, 40, 48];
    return (
      <Section
        title="Alpha tiers"
        blurb="Shown over a mid grey so the lighter stops are visible. primary and neutral vary by brand; the rest do not."
      >
        <div style={{ display: "grid", gap: 10 }}>
          {FAMILIES.map((fam) => (
            <div key={fam} style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <code style={{ fontFamily: mono, fontSize: 11.5, width: 92, flex: "none" }}>{fam}</code>
              <div
                style={{
                  display: "flex",
                  gap: 2,
                  flex: 1,
                  background: "var(--sa-color-neutralScale-300)",
                  padding: 4,
                  borderRadius: 3,
                }}
              >
                {STOPS.map((s) => (
                  <div
                    key={s}
                    style={{
                      flex: 1,
                      height: 38,
                      borderRadius: 2,
                      background: `var(--sa-color-transparent-${fam}-${s})`,
                    }}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      </Section>
    );
  },
};
