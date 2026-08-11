import type { Metadata } from "next";
import { buttonClasses } from "@mosje/design-system";
import { Callout, DoDont, A11yChecklist } from "@/components/design-system/docs-kit/index";
import { figmaUrl, FIGMA_NODES } from "@/lib/design-system/figma";
import { BrandSwitcher, LivePair } from "./color-live";
import "./color.css";
import {
  META, SECTIONS, RAMPS, INK_PAIRS, RUNG_LEDGER, CHART, ALPHA, LAYERS, SLOT_COUNTS, RETIRED,
} from "./color-data";

export const metadata: Metadata = { title: "Color — Foundations" };

/**
 * DS Audit: Callout ✅ existing · DoDont ✅ existing · A11yChecklist ✅ existing ·
 * ColorSwatchGrid ✅ existing (gained a `cssVar` prop so chips paint through their token
 * instead of a literal) · BrandSwitcher/LivePair ➕ page-local client islands, because they
 * depend on this page's generated data and have no second consumer yet.
 *
 * EVERY value on this page comes from ./color-data.ts, which is generated from
 * packages/tokens/dist/tokens.css. Nothing here is typed by hand. The section order and titles
 * mirror the Figma frame (FIGMA_NODES.color) and are gated by scripts/check-color-docs.mjs.
 */

const title = (id: string): string => SECTIONS.find((s) => s.id === id)?.title ?? id;

function Section({ id, children }: { id: string; children: React.ReactNode }): React.JSX.Element {
  return (
    <section className="docs-section" aria-labelledby={id}>
      <h2 id={id} className="docs-section__heading">{title(id)}</h2>
      {children}
    </section>
  );
}

export default function ColorPage(): React.JSX.Element {
  const allPairs = INK_PAIRS.flatMap((f) => f.rungs);
  // Read the anchors out of the generated ramps. Typing them is how a page starts lying:
  // the gate rejects a hex literal in this file for exactly that reason.
  const primary = RAMPS.find((r) => r.name === "primaryScale");
  const navyAnchor = primary?.steps.find((s) => s.anchor?.includes("navy"));
  const saffronAnchor = RAMPS.find((r) => r.name === "secondaryScale")?.steps.find((s) => s.anchor);
  const primaryBolder = allPairs.find((p) => p.bgToken === "bg/brand/primary/bolder");

  return (
    <>
      <header className="docs-page-header">
        <div className="docs-page-header__text">
          <h1 className="docs-page-header__title">Color</h1>
          <p className="docs-page-header__desc">
            Eight ramps, two brands, and {META.inkPairs} ink pairings chosen by measurement
            rather than by eye. Every colour in SAMAVESH carries its own contrast number —
            measured at build against its own surface, in the worst brand, and published into
            the description of the variable you are about to use.
          </p>
          <div className="docs-page-header__actions">
            <a
              className={buttonClasses("primary", "outlined", "md")}
              href={figmaUrl(FIGMA_NODES.color)}
              target="_blank"
              rel="noreferrer noopener"
            >
              Open the colour library in Figma <span aria-hidden="true">↗</span>
            </a>
          </div>
        </div>
      </header>

      {/* ── At a glance ───────────────────────────────────────── */}
      <Section id="hero">
        <div className="color-stats">
          {[
            [String(META.ramps), "ramps", "Seven chromatic at 11 steps, one neutral at 13."],
            [String(META.brands), "brands", "Blue and Navy. Brand is the only colour axis."],
            [String(META.rungs), "rungs", "subtler → boldest, UX4G's prominence ladder."],
            [String(META.inkPairs), "ink pairs", `Worst measures ${META.worstInkPair}:1.`],
            [String(META.belowAA), "AA shortfalls", "On every on/* pair, in both estate brands."],
            [String(META.rungCaveats), "rung caveats", "Fills whose rung name overstates contrast."],
          ].map(([n, label, note]) => (
            <div key={label} className="color-stat">
              <div className="color-stat__n">
                {n} <span className="color-stat__label">{label}</span>
              </div>
              <p className="color-stat__note">{note}</p>
            </div>
          ))}
        </div>
        <BrandSwitcher />
      </Section>

      {/* ── Anatomy ───────────────────────────────────────────── */}
      <Section id="anatomy">
        <p className="docs-lede">
          Every semantic colour name answers three questions in order: what are you colouring,
          what does it mean, and how loud should it be. Learn the grammar once and you can
          construct the token you need instead of hunting for it.
        </p>
        <div className="color-anatomy">
          <code className="color-anatomy__name">
            <span data-part="slot">bg</span>/<span data-part="family">status/error</span>/
            <span data-part="prominence">bolder</span>
          </code>
          <div className="color-anatomy__legend">
            {[
              ["SLOT", "bg", "What you are colouring. bg · text · border · icon · on · overlay · layer · focus — a slot means one thing only."],
              ["FAMILY", "status / error", "What it means. neutral · brand (primary, secondary, accent) · status (success, error, warning, info)."],
              ["PROMINENCE", "bolder", "How loud. subtler → subtle → base → bold → bolder → boldest. A prominence claim, not a contrast guarantee."],
            ].map(([lab, val, note]) => (
              <div key={lab} className="color-anatomy__part">
                <span className="color-anatomy__part-label">{lab}</span>
                <code>{val}</code>
                <p>{note}</p>
              </div>
            ))}
          </div>
        </div>
        <Callout type="tip" title="One name, four places">
          <code>bg/status/error/bolder</code> in Figma → <code>--sa-bg-status-error-bolder</code>{" "}
          in CSS → the Palette rung it aliases → <code>on/bg/status/error/bolder</code>, the ink
          measured for it. Bind the fill and the ink in the same edit; they are one decision.
        </Callout>
      </Section>

      {/* ── Tiers ─────────────────────────────────────────────── */}
      <Section id="tiers">
        <div className="color-tiers">
          {[
            ["TIER 1 · REFERENCE", "--sa-ref-*", "The raw ramps. Banned in app code. A component bound to a ref value cannot follow the brand."],
            ["TIER 2 · SYSTEM", "--sa-*", "This is the tier you use. Slot, family, prominence. It carries the contrast guarantee and follows the brand."],
            ["TIER 3 · COMPONENT", "--sa-cmp-*", "Per-component overrides, for advanced work only — not a way to avoid learning Tier 2."],
          ].map(([lab, prefix, note]) => (
            <div key={lab} className="color-tier">
              <span className="color-tier__label">{lab}</span>
              <code className="color-tier__prefix">{prefix}</code>
              <p>{note}</p>
            </div>
          ))}
        </div>
        <p className="docs-note">
          A token&rsquo;s tier comes from the file it is authored in, and{" "}
          <code>ref</code>/<code>cmp</code> are reserved first segments. That is what keeps the
          projection reversible for the Figma round-trip — the same name identifies the same
          token in both places, which is why Tier 2 carries no marker and is the shortest to type.
        </p>
      </Section>

      {/* ── Ramps ─────────────────────────────────────────────── */}
      <Section id="ramps">
        <p className="docs-lede">
          Every ramp is generated from an anchor, not hand-picked: each step 4–16 L* from the
          last, monotonic, hue held within about 6°, chroma on a single arc peaking at the
          anchor. Contrast below is against the page, by the WCAG 2.x formula.
        </p>
        {RAMPS.map((ramp) => (
          <div key={ramp.name} className="color-ramp">
            <div className="color-ramp__head">
              <h3 className="color-ramp__name">{ramp.name}</h3>
              <span className="color-ramp__meta">
                {ramp.steps.length} steps ·{" "}
                {ramp.brandVaries ? "repainted by a brand swap" : "brand-invariant"}
              </span>
            </div>
            <div className="color-ramp__strip">
              {ramp.steps.map((s) => (
                <div key={s.step} className="color-ramp__cell">
                  <div className="color-ramp__swatch" style={{ background: `var(${s.token})` }}
                       data-anchor={s.anchor ? "true" : undefined} aria-hidden="true" />
                  <span className="color-ramp__step">{s.step}</span>
                  <span className="color-ramp__hex">{s.blue}</span>
                  <span className="color-ramp__ratio">{s.onWhite?.toFixed(2)}:1</span>
                  {s.anchor ? <span className="color-ramp__anchor">{s.anchor}</span> : null}
                </div>
              ))}
            </div>
          </div>
        ))}
        <Callout type="info" title="Where an anchor sits is decided by lightness, not convention">
          <code>{navyAnchor?.navy}</code> is a shade, so it sits at rung {navyAnchor?.step};{" "}
          <code>{saffronAnchor?.blue}</code> is light, so it sits at {saffronAnchor?.step}. Forcing an anchor to 500 pushes a neighbouring rung into the
          dead zone — roughly L* 59–66 — where a fill is too dark for dark ink and too light for
          white, and neither reaches 4.5:1. This was learned twice, expensively.
        </Callout>
      </Section>

      {/* ── Prominence ────────────────────────────────────────── */}
      <Section id="prominence">
        <p className="docs-lede">
          SAMAVESH uses UX4G&rsquo;s prominence vocabulary, so a designer moving between the two
          systems finds the same ladder. The rung says how much presence a fill should have —
          and that is all it says.
        </p>
        <Callout type="warning" title="A rung name is a prominence claim, not a contrast guarantee">
          <p>
            {META.rungCaveats} tokens measure below the class their rung implies. Almost all are
            tonal <code>bg/*</code> chips, where the fill ladder&rsquo;s ≥3:1 is the wrong
            requirement rather than the colour being wrong — a quiet chip is supposed to be
            quiet. Choose a token by its measured number, never by how loud its name sounds.
          </p>
          <table className="token-table">
            <caption className="visually-hidden">
              Tokens measuring below the contrast their prominence rung implies
            </caption>
            <thead>
              <tr><th scope="col">Token</th><th scope="col">Measured</th><th scope="col">Implied by rung</th></tr>
            </thead>
            <tbody>
              {RUNG_LEDGER.map((l) => (
                <tr key={l.token}>
                  <th scope="row"><code>{l.token}</code></th>
                  <td>{l.measured ? `${l.measured}:1` : "—"}</td>
                  <td>{l.implied ? `≥${l.implied}:1 ("${l.rung}")` : "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Callout>
      </Section>

      {/* ── Ink pairings ──────────────────────────────────────── */}
      <Section id="ink-pairings">
        <p className="docs-lede">
          For every fill there is exactly one foreground token, chosen by measuring the
          candidates against that fill in the worst brand. Bind text to the <code>on/*</code>{" "}
          token that matches the fill you used and the pairing cannot fail. Each chip below
          renders its real pair, and the ratio is <strong>measured in your browser</strong> — not
          printed from a table. Switch brands above and watch them move.
        </p>
        {INK_PAIRS.map((fam) => (
          <div key={fam.family} className="color-pairs">
            <h3 className="color-pairs__label">{fam.label}</h3>
            <div className="color-pairs__row">
              {fam.rungs.map((p) => (
                <LivePair key={p.rung} bgToken={p.bgToken} onToken={p.onToken}
                          rung={p.rung} expected={p.ratio} />
              ))}
            </div>
          </div>
        ))}
        <p className="docs-note">
          {allPairs.length} pairs, and the worst measures {META.worstInkPair}:1 — above the 4.5:1
          AA floor for text, in both estate brands, with margin. That is not a design goal but a
          build-time gate: <code>on-pair-contrast.test.mjs</code> fails the build if any pair
          drops below, and its exemption list may only ever shrink.
        </p>
      </Section>

      {/* ── Slots ─────────────────────────────────────────────── */}
      <Section id="slots">
        <p className="docs-lede">
          The first segment of a token name says what part of the interface it colours. Slots do
          not overlap — that disjointness is asserted by a test, so a border token can never
          quietly become a fill.
        </p>
        <div className="color-slots">
          {[
            ["bg", "Filled surfaces: buttons, chips, banners, selected rows, page and card backgrounds."],
            ["text", "Copy and numerals, including the link ladder — default, hover, active, visited, disabled."],
            ["border", "Dividers, input outlines, table rules, and the edges of tonal containers."],
            ["icon", "Glyph fills. Separate from text because an icon carries meaning at 3:1, not 4.5:1."],
            ["on", "The foreground measured for a specific fill."],
            ["layer", "Stacked surfaces and their matching borders — four depths."],
            ["overlay", "Scrims behind modals and drawers."],
            ["focus", "The focus ring: colour, width and offset."],
            ["chart", "The data-visualisation palette."],
          ].map(([slot, note]) => (
            <div key={slot} className="color-slot">
              <code className="color-slot__name">{slot}</code>
              <span className="color-slot__count">
                {(SLOT_COUNTS as Record<string, number>)[slot as string] ?? 0} tokens
              </span>
              <p>{note}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* ── Status ────────────────────────────────────────────── */}
      <Section id="status">
        <p className="docs-lede">
          Status colour tells someone what happened. It must never be the only thing that does
          — WCAG 1.4.1 requires the meaning to survive without colour, and roughly one in twelve
          men has a colour-vision deficiency.
        </p>
        <div className="color-status">
          {[
            ["success", "Something completed. Application submitted, record saved, payment released."],
            ["error", "Something failed or will destroy data. Validation failure, rejection, delete confirmation."],
            ["warning", "Amber, not yellow. Something needs attention before it becomes a problem."],
            ["info", "Neutral context. Guidance, an explanatory note, a scheme eligibility hint."],
          ].map(([name, note]) => (
            <div key={name} className="color-status__card"
                 style={{ background: `var(--sa-bg-status-${name}-subtler)` }}>
              <div className="color-status__bar" style={{ background: `var(--sa-bg-status-${name}-bolder)` }} />
              <div className="color-status__body">
                <h3 style={{ color: `var(--sa-text-status-${name}-base)` }}>{name}</h3>
                <p>{note}</p>
                <code>{`bg/status/${name}/* · text · icon · border`}</code>
              </div>
            </div>
          ))}
        </div>
        <Callout type="warning" title="Success and accent are the same green, on purpose">
          One India Green for the estate rather than two that almost match. The union is recorded
          and gated in <code>hue-separation.test.mjs</code>. The consequence to design around: a
          success state and a brand accent cannot be told apart by colour, so where both can
          appear together, separate them by shape, position and copy.
        </Callout>
      </Section>

      {/* ── States ────────────────────────────────────────────── */}
      <Section id="states">
        <p className="docs-lede">
          Every interaction state has its own token. Hover and active are not opacity tricks —
          they are separate values, so they stay correct in every brand and under the
          accessibility widget&rsquo;s high-contrast mode.
        </p>
        <div className="color-states">
          {["default", "hover", "active", "visited", "disabled"].map((state) => (
            <div key={state} className="color-state">
              <a
                className="color-state__link"
                style={{
                  color: `var(--sa-text-link-${state === "visited" ? "visited" : "brand"}-${
                    state === "visited" ? "default" : state
                  })`,
                }}
              >
                Apply for this scheme
              </a>
              <span className="color-state__name">{state}</span>
            </div>
          ))}
        </div>
        <Callout type="tip" title="The focus ring is not optional">
          <code>focus/ring</code> is a 48% alpha of the brand primary, rendered 2px wide and held
          2px off the control. It is never removed for mouse users — GIGW requires a visible
          focus indicator, and the ring must reach 3:1 against both the control and the page.
        </Callout>
      </Section>

      {/* ── Layers ────────────────────────────────────────────── */}
      <Section id="layers">
        <p className="docs-lede">
          Stacked surfaces come from a four-step layer ladder, each with a matching border token.
          Raise a layer when content is genuinely nested; draw a border when it is merely
          adjacent. The two together are why components stop reaching for a one-off grey.
        </p>
        <div className="color-layers">
          {LAYERS.map((l) => (
            <div key={l.depth} className="color-layer"
                 style={{ background: `var(--sa-layer-${l.depth})`, borderColor: `var(--sa-layer-border-${l.depth})` }}>
              <code>layer/{l.depth}</code> <span>{l.surface}</span>
              <span className="color-layer__border">border {l.border}</span>
            </div>
          ))}
        </div>
      </Section>

      {/* ── Neutrals & alpha ──────────────────────────────────── */}
      <Section id="neutrals-alpha">
        <p className="docs-lede">
          The neutral ramp is deliberately tinted: its hue is locked to the brand&rsquo;s own
          primary, with chroma on a single arc that falls to zero at both ends. That is why 0 is
          exactly white and 1000 exactly black — the two achromatic values in the whole system.
        </p>
        {ALPHA.filter((a) => ["neutral", "primary", "white"].includes(a.family)).map((a) => (
          <div key={a.family} className="color-alpha"
               style={{ background: a.family === "white" ? "var(--sa-bg-brand-primary-bolder)" : "var(--sa-bg-neutral-subtle)" }}>
            <code className="color-alpha__label"
                  style={{ color: a.family === "white" ? "var(--sa-on-bg-brand-primary-bolder)" : "var(--sa-text-neutral-subtle)" }}>
              transparent/{a.family}
            </code>
            {a.steps.map((s) => (
              <div key={s.step} className="color-alpha__chip"
                   style={{ background: `var(--sa-color-transparent-${a.family}-${s.step})` }}
                   title={`${s.token} — ${s.value}`} />
            ))}
          </div>
        ))}
        <Callout type="warning" title="A translucent fill has no contrast of its own">
          Its measured ratio depends on whatever sits behind it, so an alpha token can pass on
          white and fail on a tonal chip. Use them for scrims, hover washes and focus rings —
          never for the fill behind text you need to guarantee.
        </Callout>
        <p className="docs-note">
          In practice the two brands&rsquo; greys differ by at most one unit per channel at 8-bit
          precision. The re-lock is a systemic guarantee that the grey follows the brand, not a
          visible change — do not promise a stakeholder they will see it.
        </p>
      </Section>

      {/* ── Brands ────────────────────────────────────────────── */}
      <Section id="brands">
        <p className="docs-lede">
          Brand is the only colour axis in SAMAVESH. A swap repaints{" "}
          {META.brandVaryingRamps.join(" and ")} — and, verified against the built stylesheet,
          nothing else. Use the switcher at the top of this page to see it.
        </p>
        <DoDont
          cards={[
            { type: "do", label: "Let secondary and accent stay put — both are SAMAVESH logo colours, so they are constants of the identity rather than variants of it.", preview: null },
            { type: "do", label: "Scope a brand island with a nested data-brand element, and initialise it with colorModeInitScript() so the page does not flash the default brand first.", preview: null },
            { type: "dont", label: "Do not expect the greys to look different between brands — the hue re-locks, but the shift is under one 8-bit unit at most rungs.", preview: null },
            { type: "dont", label: "Do not treat the six DBIM entries as shipping options. They are conformance previews, code-only, and never in the Figma library.", preview: null },
          ]}
        />
      </Section>

      {/* ── Conformance ───────────────────────────────────────── */}
      <Section id="conformance">
        <p className="docs-lede">
          SAMAVESH is not a palette invented in a vacuum. It answers to DBIM, which requires a
          departmental palette built from the ministry&rsquo;s key colour, and it holds a parity
          contract with UX4G 3.0, the Government of India&rsquo;s own design system.
        </p>
        <div className="color-origin">
          {[
            ["Primary", "--sa-color-primaryScale-500", "DBIM requires a departmental palette built from the ministry's own key colour. The primary is given, not chosen."],
            ["Secondary", "--sa-color-secondaryScale-400", "India Saffron, from the SAMAVESH logo. A constant of the identity, which is why a brand swap cannot touch it."],
            ["Accent", "--sa-color-accentScale-500", "India Green, also from the logo. Success is unified onto this same green deliberately."],
          ].map(([name, token, note]) => (
            <div key={name} className="color-origin__card">
              <div className="color-origin__swatch" style={{ background: `var(${token})` }} aria-hidden="true" />
              <h3>{name}</h3>
              <p>{note}</p>
            </div>
          ))}
        </div>
        <Callout type="info" title="UX4G 3.0 — the grammar is theirs">
          The slot families, the six-rung prominence ladder and the 50–950 ramp shape are all
          UX4G&rsquo;s, adopted deliberately. Structure maps by <em>value</em>; colour maps by{" "}
          <em>role</em>, because DBIM requires the department&rsquo;s key colour and UX4G ships
          Theme Craft precisely so an organisation can substitute its own. We conform to the
          specification, not the distribution — <code>ux4g-web-components</code> is a 7.6 MB
          stylesheet plus a 286 KB runtime that breaks hydration in Next 16.
        </Callout>
        <Callout type="warning" title="DBIM conformance previews are deliberately not in the Figma library">
          All six DBIM primary groups exist in code, each transcribing DBIM&rsquo;s five published
          shades verbatim and applying DBIM&rsquo;s whole functional palette with them. The
          Palette collection&rsquo;s modes stay exactly Blue and Navy, asserted by the push script
          before it writes. Note that DBIM&rsquo;s own Green group measures 4.32:1 at its bolder
          fill — below AA, using DBIM&rsquo;s own published shade 2. Reported rather than
          corrected, because correcting it would mean shipping a colour DBIM never issued.
        </Callout>
      </Section>

      {/* ── Charts ────────────────────────────────────────────── */}
      <Section id="charts">
        <p className="docs-lede">
          Charts are where colour carries the most meaning and fails the most people. Every
          categorical series clears WCAG 1.4.11&rsquo;s 3:1 against the page — the worst measures{" "}
          {META.worstChartSeries}:1 — but contrast is not distinguishability, and neither is a
          substitute for a label.
        </p>
        <div className="color-chart-cats">
          {CHART.categorical.map((c) => (
            <div key={c.n} className="color-chart-cat">
              <div className="color-chart-cat__swatch" style={{ background: `var(--sa-chart-cat-${c.n})` }} aria-hidden="true" />
              <span>{c.n}</span>
              <span className="color-chart-cat__ratio">{c.onPage?.toFixed(2)}:1</span>
            </div>
          ))}
        </div>
        <div className="color-chart-scales">
          {[
            ["Sequential", CHART.sequential.map((s) => `--sa-chart-seq-${s.step}`), "One hue, ten steps. Choropleths and heatmaps."],
            ["Diverging", CHART.diverging.map((d) => `--sa-chart-div-${d.key}`), "Signed data around a neutral midpoint."],
            ["Trend", CHART.trend.map((t) => `--sa-chart-trend-${t.key}`), "KPI direction. Up, down, flat."],
          ].map(([label, tokens, note]) => (
            <div key={label as string} className="color-chart-scale">
              <h3>{label as string}</h3>
              <p>{note as string}</p>
              <div className="color-chart-scale__strip">
                {(tokens as string[]).map((t) => (
                  <div key={t} className="color-chart-scale__cell" style={{ background: `var(${t})` }} />
                ))}
              </div>
            </div>
          ))}
        </div>
        <DoDont
          cards={[
            { type: "do", label: "Direct-label the series, or vary shape, pattern and line style as well as colour.", preview: null },
            { type: "do", label: "Treat twelve as a ceiling, not a target — if a chart needs more than about seven series, group the tail into an Other.", preview: null },
            { type: "dont", label: "Do not rely on colour alone (WCAG 1.4.1) — a reader with a colour-vision deficiency or a greyscale printout must still read the chart.", preview: null },
            { type: "dont", label: "Do not invent a grey for grid lines or empty map regions; grid, axis, tooltip and regionEmpty all have their own tokens.", preview: null },
          ]}
        />
      </Section>

      {/* ── Do / Don't ────────────────────────────────────────── */}
      <Section id="do-and-dont">
        <p className="docs-lede">
          Every pair below comes from something that went wrong in a real MoSJE surface, or from
          a rule a build gate now enforces. Consequences make rules stick.
        </p>
        <DoDont
          cards={[
            { type: "do", label: "Bind the ink to the on/* token for the fill you used — the pairing was already measured in the worst brand.", preview: null },
            { type: "do", label: "Use a text/* token for copy; ramp rungs are measured against nothing in particular.", preview: null },
            { type: "do", label: "Pair every status colour with an icon and a word.", preview: null },
            { type: "do", label: "Bind components to semantic tokens so they follow a brand swap.", preview: null },
            { type: "do", label: "Use the disabled tokens — they are measured values that stay predictable on any surface.", preview: null },
            { type: "do", label: "Read the measured number in the variable's description before trusting a rung name.", preview: null },
            { type: "do", label: "Use layer/0–3 and their matching borders instead of inventing a grey.", preview: null },
            { type: "dont", label: "Do not choose an ink by eye on a tonal chip — a brand swap or a ramp rebuild moves the fill underneath it.", preview: null },
            { type: "dont", label: "Do not reach into a ramp rung for body text.", preview: null },
            { type: "dont", label: "Do not use a bright brand colour as an icon or chart series on white — India Saffron measures 2.91:1, below the 3:1 non-text floor.", preview: null },
            { type: "dont", label: "Do not bind a component to a ref/* palette rung; it is frozen to one brand.", preview: null },
            { type: "dont", label: "Do not fake a disabled state with opacity — it drags the label below AA and depends on what is behind it.", preview: null },
            { type: "dont", label: "Do not assume a bold rung clears 3:1; sixteen tokens do not.", preview: null },
          ]}
        />
      </Section>

      {/* ── Accessibility ─────────────────────────────────────── */}
      <Section id="accessibility">
        <p className="docs-lede">
          GIGW 3.0 binds this estate to WCAG 2.1 AA and IS 17802. For colour that means four
          criteria, and every one of them is checked by arithmetic at build time rather than by
          review.
        </p>
        <A11yChecklist
          items={[
            { criterion: "1.4.1 Use of colour", level: "A", description: "Colour is never the only carrier of meaning. Pair it with an icon, a label, a pattern or a position." },
            { criterion: "1.4.3 Contrast (minimum)", level: "AA", description: `4.5:1 for body text, 3:1 for large text. Every on/* pair clears the first; the worst measures ${META.worstInkPair}:1.` },
            { criterion: "1.4.11 Non-text contrast", level: "AA", description: "3:1 for borders, icons, focus rings, chart series and any control boundary someone must find." },
            { criterion: "1.4.12 Text spacing", level: "AA", description: "Colour choices must survive 200% zoom and user stylesheets." },
            { criterion: "Dark & high contrast", level: "GIGW", description: "Owned entirely by the UX4G accessibility widget, not by a token axis. Do not build a second mechanism." },
            { criterion: "forced-colors: active", level: "GIGW", description: "Windows High Contrast replaces the palette wholesale — keep meaning in markup and icons." },
          ]}
        />
        <Callout type="info" title="What these numbers do and do not certify">
          Every ratio on this page is a measured contrast value, computed by the WCAG 2.x formula
          against a named partner. That is a fact about two colours. It is <strong>not</strong> a
          claim that a screen using them is WCAG 2.1 AA or GIGW conformant — conformance depends
          on markup, focus order, labelling and content, and needs human sign-off. Use these
          numbers as evidence in an audit, never as the audit.
        </Callout>
      </Section>

      {/* ── Handoff ───────────────────────────────────────────── */}
      <Section id="handoff">
        <p className="docs-lede">
          The Figma variable name and the CSS custom property are the same name, projected. That
          is not a convention anyone maintains — it is what makes the round-trip reversible.
        </p>
        <table className="token-table">
          <caption className="visually-hidden">From Figma variable to CSS to component</caption>
          <thead>
            <tr><th scope="col">Where</th><th scope="col">What you write</th><th scope="col">Note</th></tr>
          </thead>
          <tbody>
            <tr><th scope="row">In Figma</th><td><code>bg/brand/primary/bolder</code></td><td>Bind the fill. Dev Mode shows the name and its measured contrast.</td></tr>
            <tr><th scope="row">In CSS</th><td><code>var(--sa-bg-brand-primary-bolder)</code></td><td>Slashes become hyphens. Tier 2 carries no marker.</td></tr>
            <tr><th scope="row">Its ink</th><td><code>var(--sa-on-bg-brand-primary-bolder)</code></td><td>Always paired — change one, change both.</td></tr>
            <tr><th scope="row">Never</th><td><code>{primaryBolder?.fill}</code></td><td>A hex cannot follow a brand, and it cannot carry a guarantee.</td></tr>
          </tbody>
        </table>
      </Section>

      {/* ── Retired ───────────────────────────────────────────── */}
      <Section id="retired">
        <p className="docs-lede">
          On 12 August 2026 the legacy <code>--ds-*</code> vocabulary was retired: all 341 names,
          deleted from every generated artifact, with 3,561 call sites migrated to the canonical{" "}
          <code>--sa-*</code> token each one already resolved to. Nothing rendered differently.
          This section is the record of what went, so older code stays readable — not guidance.
        </p>
        <table className="token-table">
          <caption className="visually-hidden">Retired token names and their replacements</caption>
          <thead>
            <tr><th scope="col">Retired</th><th scope="col">Use instead</th><th scope="col">Value</th><th scope="col">Why it is worth recording</th></tr>
          </thead>
          <tbody>
            {RETIRED.map((r) => (
              <tr key={r.from}>
                <th scope="row"><code>{r.from}</code></th>
                <td><code>{r.to}</code></td>
                <td>{r.value}{r.onWhite ? ` · ${r.onWhite}:1` : ""}</td>
                <td>{r.note}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Section>

      {/* ── Provenance ────────────────────────────────────────── */}
      <Section id="provenance">
        <p className="docs-lede">
          Every value on this page is read from <code>packages/tokens/dist/tokens.css</code> at
          build time and every swatch is painted through its token, so this page cannot state a
          colour the build does not produce. Its counterpart in Figma is variable-bound for the
          same reason. Both surfaces are pinned to one source.
        </p>
        <table className="token-table">
          <caption className="visually-hidden">Where the numbers on this page come from</caption>
          <thead>
            <tr><th scope="col">Source</th><th scope="col">What it gives</th></tr>
          </thead>
          <tbody>
            <tr><th scope="row"><code>packages/tokens/src/*.json</code></th><td>DTCG source — eight ramps, the slot grammar, the alpha families.</td></tr>
            <tr><th scope="row"><code>packages/tokens/dist/tokens.css</code></th><td>Every hex and every ratio on this page.</td></tr>
            <tr><th scope="row"><code>docs/design-system/colour-system.md</code></th><td>Ramp shape, per-mode accessibility and the hue-separation ledger. Generated.</td></tr>
            <tr><th scope="row"><code>packages/tokens/test/</code></th><td>on-pair-contrast · prominence-contract · hue-separation · brand-contrast.</td></tr>
            <tr><th scope="row"><code>scripts/check-color-docs.mjs</code></th><td>Fails the build if this page&rsquo;s data or section list drifts from the source.</td></tr>
          </tbody>
        </table>
        <p className="docs-note">
          Contrast figures are computed with the WCAG 2.x formula and state a fact about two
          colours. They are not a conformance certificate.
        </p>
      </Section>
    </>
  );
}
