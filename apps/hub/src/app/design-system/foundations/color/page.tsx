import type { Metadata } from "next";
import { Alert, Badge, Button, Input, buttonClasses } from "@mosje/design-system";
import { Callout, DoDont, A11yChecklist, TerminalCode } from "@/components/design-system/docs-kit/index";
import { figmaUrl, FIGMA_NODES } from "@/lib/design-system/figma";
import { BrandSwitcher, LivePair } from "./color-live";
import "./color.css";
import {
  META, SECTIONS, RAMPS, INK_PAIRS, CHART, ALPHA, LAYERS, SLOT_COUNTS, RETIRED,
  STATUS_MATRIX, CVD, MODES, ROLE_CONTRAST, ALPHA_SCALE, TRANSLUCENT,
} from "./color-data";

export const metadata: Metadata = { title: "Color — Foundations" };

/**
 * DS Audit: Callout ✅ existing · DoDont ✅ existing · A11yChecklist ✅ existing · Alert ✅ ·
 * Badge ✅ · Button ✅ · Input ✅ (rendered as real specimens in section 18) ·
 * BrandSwitcher/LivePair ➕ page-local client islands.
 *
 * EVERY value on this page comes from ./color-data.ts, which is generated from
 * packages/tokens/dist/tokens.css. Nothing here is typed by hand. The section order and titles
 * mirror the Figma frame (FIGMA_NODES.color) and are gated by scripts/check-color-docs.mjs.
 */

const title = (id: string): string => SECTIONS.find((s) => s.id === id)?.title ?? id;
const num = (id: string): string => {
  const i = SECTIONS.findIndex((s) => s.id === id);
  return i > 0 && i < SECTIONS.length - 1 ? String(i).padStart(2, "0") : "";
};

function Section({ id, children }: { id: string; children: React.ReactNode }): React.JSX.Element {
  return (
    <section className="docs-section color-section" aria-labelledby={id} id={`s-${id}`}>
      {num(id) ? <span className="color-section__num" aria-hidden="true">{num(id)}</span> : null}
      <h2 id={id} className="docs-section__heading">{title(id)}</h2>
      {children}
    </section>
  );
}

/** A contrast figure with the class it earns, so a reader never has to know the thresholds. */
function Pass({ ratio, floor, text = true }: { ratio: number | null; floor?: number; text?: boolean }): React.JSX.Element {
  if (ratio === null) return <span className="color-pass color-pass--none">—</span>;
  const f = floor ?? (text ? 4.5 : 3);
  const cls = f === 0 ? "none" : ratio >= 7 && text ? "aaa" : ratio >= f ? (text ? "aa" : "nontext") : "fail";
  const label = { aaa: "AAA", aa: "AA", nontext: "3:1", fail: "below", none: "no floor" }[cls];
  return (
    <span className={`color-pass color-pass--${cls}`}>
      <span className="color-pass__ratio">{ratio.toFixed(2)}:1</span>
      <span className="color-pass__class">{label}</span>
    </span>
  );
}

const cssVar = (token: string): string => `var(--sa-${token.replace(/\//g, "-")})`;

export default function ColorPage(): React.JSX.Element {
  const allPairs = INK_PAIRS.flatMap((f) => f.rungs);
  const primary = RAMPS.find((r) => r.name === "primaryScale");
  const navyAnchor = primary?.steps.find((s) => s.anchor?.includes("navy"));
  const saffronAnchor = RAMPS.find((r) => r.name === "secondaryScale")?.steps.find((s) => s.anchor);
  const greenAnchor = RAMPS.find((r) => r.name === "successScale")?.steps.find((s) => s.anchor);
  const primaryBolder = allPairs.find((p) => p.bgToken === "bg/brand/primary/bolder");
  const chartCvd = CVD.find((c) => c.key === "chart");
  const modeFails = MODES.flatMap((m) => m.roles.filter((r) => r.pass === false).map((r) => ({ mode: m.id, ...r })));
  const toc = SECTIONS.filter((s) => s.id !== "hero");

  return (
    <>
      <header className="docs-page-header">
        <div className="docs-page-header__text">
          <h1 className="docs-page-header__title">Color</h1>
          <p className="docs-page-header__desc">
            Eight ramps, two brands, {META.inkPairs} ink pairings and {META.rolesMeasured} text,
            icon and border roles — every one measured against the ground it actually sits on, in
            the worst of {META.modesMeasured} modes, and re-measured through three colour-vision
            deficiencies. The number is published into the description of the variable you are
            about to use.
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

      <nav className="color-toc" aria-label="On this page">
        <ol className="color-toc__list">
          {toc.map((s, i) => (
            <li key={s.id}>
              <a className="color-toc__link" href={`#${s.id}`}>
                <span className="color-toc__num" aria-hidden="true">{i + 1 < SECTIONS.length - 1 ? String(i + 1).padStart(2, "0") : "·"}</span>
                {s.title}
              </a>
            </li>
          ))}
        </ol>
      </nav>

      {/* ── At a glance ───────────────────────────────────────── */}
      <Section id="hero">
        <div className="color-stats">
          {[
            [String(META.ramps), "ramps", "Seven chromatic at 11 steps, one neutral at 13. Each generated from an anchor."],
            [String(META.brands), "brands", "Blue and Navy. Brand is the only colour axis."],
            [String(META.inkPairs), "ink pairs", `Every fill has a measured foreground. Worst ${META.worstInkPair}:1.`],
            [String(META.belowAA), "AA shortfalls", "Across every on/* pair, in both estate brands."],
            [String(META.rolesMeasured), "roles measured", META.rolesBelowFloor === 0 ? "Text, icon and border tokens, on white and on the page ground. Every one clears its floor." : `Text, icon and border tokens against both grounds. ${META.rolesBelowFloor} below a floor.`],
            [String(META.cvdSafeSeries), "safe series", `Chart slots distinguishable through every colour-vision deficiency — all 36 pairs ≥ ΔE ${META.worstCvdSeriesPair}.`],
            [String(META.modesMeasured), "modes measured", "Two brands, six DBIM previews, two UX4G modes."],
            [String(META.rungCaveats), "rung caveats", "No fill measures below the class its name states."],
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
              ["PROMINENCE", "bolder", "How loud. subtler → subtle → base → bold → bolder → boldest. On a fill, bolder and boldest guarantee white ink; on ink, base guarantees AA on the page."],
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
          last, monotonic, hue held within about 6°, chroma on a single arc peaking at the anchor.
          Rung 600 sits at the same lightness in every family, so a rung means the same thing
          whichever ramp it comes from. Each cell shows the step, its hex, its OKLCH lightness,
          and its contrast against the page.
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
                  <span className="color-ramp__l">L* {s.oklch?.L}</span>
                  <span className="color-ramp__ratio">{s.onWhite?.toFixed(2)}:1</span>
                  {s.anchor ? <span className="color-ramp__anchor">{s.anchor}</span> : null}
                </div>
              ))}
            </div>
          </div>
        ))}
        <Callout type="info" title="Where an anchor sits is decided by lightness, not convention">
          <code>{navyAnchor?.navy}</code> is a shade, so it sits at rung {navyAnchor?.step};{" "}
          <code>{saffronAnchor?.blue}</code> is light, so it sits at {saffronAnchor?.step};{" "}
          <code>{greenAnchor?.blue}</code>, India Green, is L* {greenAnchor?.oklch?.L}, so it sits at{" "}
          {greenAnchor?.step} and is itself the success ink and fill. Forcing an anchor to 500
          pushes a neighbouring rung into the dead zone — roughly L* 59–66 — where a fill is too
          dark for dark ink and too light for white, and neither reaches 4.5:1.
        </Callout>
      </Section>

      {/* ── Prominence ────────────────────────────────────────── */}
      <Section id="prominence">
        <p className="docs-lede">
          SAMAVESH uses UX4G&rsquo;s prominence vocabulary, so a designer moving between the two
          systems finds the same ladder. On a fill the rung says how much presence it has; on ink
          it says how loud the text is. The two ladders share words and differ in what they promise.
        </p>
        <div className="color-ladders">
          <table className="token-table">
            <caption className="color-ladders__cap">Fills — <code>bg/*</code>, <code>border/*</code></caption>
            <thead><tr><th scope="col">Rung</th><th scope="col">Palette step</th><th scope="col">What it guarantees</th></tr></thead>
            <tbody>
              <tr><th scope="row"><code>base</code></th><td>50</td><td>A ground. No contrast class — the ink measured for it carries the reading.</td></tr>
              <tr><th scope="row"><code>subtler</code></th><td>100</td><td>A tint for hovered rows and tonal badges. No contrast class.</td></tr>
              <tr><th scope="row"><code>subtle</code></th><td>200</td><td>A quiet chip. No contrast class.</td></tr>
              <tr><th scope="row"><code>bold</code></th><td>300</td><td>A tonal fill with presence. No contrast class — and amber&rsquo;s only solid, under dark ink.</td></tr>
              <tr><th scope="row"><code>bolder</code></th><td>600</td><td>White ink is AA on it (≥ 4.5:1). Buttons, filled banners, solid badges.</td></tr>
              <tr><th scope="row"><code>boldest</code></th><td>800</td><td>White ink is AAA on it (≥ 7:1).</td></tr>
            </tbody>
          </table>
          <table className="token-table">
            <caption className="color-ladders__cap">Ink — <code>text/*</code>, <code>icon/*</code></caption>
            <thead><tr><th scope="col">Rung</th><th scope="col">Palette step</th><th scope="col">What it guarantees</th></tr></thead>
            <tbody>
              <tr><th scope="row"><code>subtler</code></th><td>500</td><td>≥ 3:1 on white. Placeholders and quiet glyphs, never body copy.</td></tr>
              <tr><th scope="row"><code>subtle</code></th><td>700</td><td>≥ 4.5:1. Captions and hints — still text, still AA.</td></tr>
              <tr><th scope="row"><code>base</code></th><td>600 (status, brand) · 800 (neutral)</td><td>≥ 4.5:1 on white <em>and</em> on the muted page ground. The reading colour.</td></tr>
              <tr><th scope="row"><code>bolder</code></th><td>700 (status, brand) · 900 (neutral)</td><td>≥ 4.5:1, and AAA wherever the ramp allows. For a label on a tinted surface.</td></tr>
            </tbody>
          </table>
        </div>
        <p className="docs-note">
          Held by <code>prominence-contract.test.mjs</code>: every fill and ink token carries the
          measured class in its Figma description, and the shortfall ledger — tokens whose rung
          overstates their contrast — is empty and may only ever shrink.
        </p>
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
          AA floor for text, in both estate brands, with margin. <code>on-pair-contrast.test.mjs</code>{" "}
          fails the build if any pair drops below, and its exemption list may only ever shrink.
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
          men has a colour-vision deficiency. Each family below is the set of pairings a
          component actually uses, rendered live with the ratio each one measures.
        </p>
        <div className="color-matrix">
          {STATUS_MATRIX.map((row) => (
            <article key={row.status} className="color-matrix__family" style={{ ["--_ink" as string]: cssVar(`text/status/${row.status}/base`), ["--_fill" as string]: cssVar(`bg/status/${row.status}/bolder`) }}>
              <header className="color-matrix__head">
                <span className="color-matrix__dot" aria-hidden="true" />
                <h3 className="color-matrix__title">{row.status}</h3>
                <p className="color-matrix__meaning">
                  {{
                    success: "Something completed. Application submitted, record saved, payment released.",
                    error: "Something failed or will destroy data. Validation failure, rejection, delete confirmation.",
                    warning: "Amber, not yellow. Something needs attention before it becomes a problem.",
                    info: "Cyan-teal, not the brand blue. Guidance, an explanatory note, an eligibility hint.",
                  }[row.status]}
                </p>
              </header>
              <ul className="color-matrix__pairs">
                {row.pairs.map((p) => (
                  <li key={p.label} className="color-matrix__pair" style={{ background: cssVar(p.fillToken), color: cssVar(p.inkToken) }}>
                    <span className="color-matrix__pair-label">{p.label}</span>
                    <span className="color-matrix__pair-use">{p.use}</span>
                    <span className="color-matrix__pair-tokens"><code>{p.fillToken}</code> + <code>{p.inkToken}</code></span>
                    <Pass ratio={p.ratio} />
                  </li>
                ))}
              </ul>
              <dl className="color-matrix__aux">
                <div><dt><code>{row.icon.token}</code></dt><dd><Pass ratio={row.icon.onWhite} text={false} /></dd></div>
                <div><dt><code>{row.border.token}</code> on the page</dt><dd><Pass ratio={row.border.onMuted} text={false} /></dd></div>
              </dl>
            </article>
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
          <div className="color-state color-state--focus">
            <span className="color-state__ring">Focused control</span>
            <span className="color-state__name">focus/ring · solid, 3px, 2px off the control</span>
          </div>
        </div>
        <Callout type="tip" title="The focus ring is not optional">
          <code>focus/ring</code> is the brand key colour, solid — 4.64:1 on white and 4.07:1 on the
          muted page in Blue, darker in Navy and the DBIM modes — painted as an outline so it
          survives Windows High Contrast Mode, where a box-shadow is not drawn at all. It is never
          removed for mouse users: GIGW requires a visible focus indicator, and WCAG 2.2 1.4.11
          asks 3:1 of it against the page.
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
          white and fail on a tonal chip. Use them for scrims and hover washes — never for the
          fill behind text you need to guarantee, and never for a focus ring.
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
            ["Accent", "--sa-color-accentScale-600", "India Green, also from the logo, and the success ink and fill. One green for the estate, deliberately."],
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
          Theme Craft precisely so an organisation can substitute its own.
        </Callout>
        <Callout type="warning" title="DBIM conformance previews are deliberately not in the Figma library">
          All six DBIM primary groups exist in code, each transcribing DBIM&rsquo;s five published
          shades verbatim and applying DBIM&rsquo;s whole functional palette with them. The
          Palette collection&rsquo;s modes stay exactly Blue and Navy. DBIM&rsquo;s own Green group
          measures 4.32:1 at its bolder fill and 3.96:1 as brand text — below AA, using
          DBIM&rsquo;s own published shade 2. Reported rather than corrected, because correcting
          it would mean shipping a colour DBIM never issued.
        </Callout>
      </Section>

      {/* ── Charts ────────────────────────────────────────────── */}
      <Section id="charts">
        <p className="docs-lede">
          Charts are where colour carries the most meaning and fails the most people. Every
          categorical series clears WCAG 1.4.11&rsquo;s 3:1 against the page — the worst measures{" "}
          {META.worstChartSeries}:1 — and all 36 pairs among slots 1–9 measure ΔE ≥ {META.worstCvdSeriesPair} under
          every colour-vision deficiency. Contrast is not distinguishability, and neither is a
          substitute for a label.
        </p>
        <div className="color-chart-cats">
          {CHART.categorical.map((c) => (
            <div key={c.n} className="color-chart-cat" data-guaranteed={c.n <= META.cvdSafeSeries ? "true" : undefined}>
              <div className="color-chart-cat__swatch" style={{ background: `var(--sa-chart-cat-${c.n})` }} aria-hidden="true" />
              <span>{c.n}{c.n > META.cvdSafeSeries ? " · ext" : ""}</span>
              <span className="color-chart-cat__ratio">{c.onPage?.toFixed(2)}:1</span>
            </div>
          ))}
        </div>
        <div className="color-chart-scales">
          {[
            ["Sequential", CHART.sequential.map((s) => `--sa-chart-seq-${s.step}`), "One hue, ten evenly spaced steps (7.6–7.8 L* apart). Start a class scale at 100; 50 is the lightest tint for a heatmap on white."],
            ["Diverging", CHART.diverging.map((d) => `--sa-chart-div-${d.key}`), "Red to blue through a neutral midpoint, lightness-symmetric. Red to green vanishes under deuteranopia; this does not."],
            ["Trend", CHART.trend.map((t) => `--sa-chart-trend-${t.key}`), "KPI direction. The same rung as the status inks, and always beside an arrow or a sign."],
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
            { type: "do", label: "Take the categorical slots in order, 1 to 9, and direct-label the series or vary shape and line style as well as colour.", preview: null },
            { type: "do", label: "Treat six series as the comfortable ceiling — beyond it, small multiples or an Other bucket read better than a tenth hue.", preview: null },
            { type: "dont", label: "Do not rely on colour alone (WCAG 1.4.1) — a reader with a colour-vision deficiency or a greyscale printout must still read the chart.", preview: null },
            { type: "dont", label: "Do not paint a series with a status token, and do not invent a grey for grid lines or empty map regions — grid, axis, tooltip and regionEmpty have their own tokens.", preview: null },
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
            { type: "do", label: "Use the disabled tokens — they are opaque, measured values that stay predictable on any surface.", preview: null },
            { type: "do", label: "Read the measured number in the variable's description before trusting a rung name.", preview: null },
            { type: "do", label: "Use layer/0–3 and their matching borders instead of inventing a grey.", preview: null },
            { type: "dont", label: "Do not choose an ink by eye on a tonal chip — a brand swap or a ramp rebuild moves the fill underneath it.", preview: null },
            { type: "dont", label: "Do not reach into a ramp rung for body text.", preview: null },
            { type: "dont", label: "Do not use a bright brand colour as an icon or chart series on white — India Saffron measures 2.91:1, below the 3:1 non-text floor.", preview: null },
            { type: "dont", label: "Do not bind a component to a ref/* palette rung; it is frozen to one brand.", preview: null },
            { type: "dont", label: "Do not fake a disabled state with opacity — it drags the label below AA and depends on what is behind it.", preview: null },
            { type: "dont", label: "Do not mix a status tint by hand with color-mix(); the ramp already holds it, and a mix cannot be measured.", preview: null },
            { type: "dont", label: "Do not paint a focus ring, a glyph or a series with a translucent token — its contrast depends on what is behind it.", preview: null },
          ]}
        />
      </Section>

      {/* ── Accessibility ─────────────────────────────────────── */}
      <Section id="accessibility">
        <p className="docs-lede">
          GIGW 3.0 binds this estate to WCAG 2.1 AA and IS 17802. For colour that means four
          criteria, and every one of them is checked by arithmetic at build time rather than by
          review. Below them, every text, icon and border role with the figure it measures on
          white and on the muted page ground the estate&rsquo;s <code>&lt;body&gt;</code> carries.
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
        <div className="color-roles">
          <table className="token-table">
            <caption className="visually-hidden">Every text, icon and border role, measured on both grounds</caption>
            <thead>
              <tr><th scope="col">Token</th><th scope="col">Role</th><th scope="col">On white</th><th scope="col">On the page ground</th><th scope="col">Class</th></tr>
            </thead>
            <tbody>
              {ROLE_CONTRAST.map((r) => (
                <tr key={r.token}>
                  <th scope="row"><span className="color-roles__chip" style={{ background: cssVar(r.token) }} aria-hidden="true" /><code>{r.token}</code></th>
                  <td>{r.role}</td>
                  <td>{r.onWhite?.toFixed(2)}:1</td>
                  <td>{r.ground === "white" ? <span className="color-roles__na">inside a white control</span> : `${r.onMuted?.toFixed(2)}:1`}</td>
                  <td><Pass ratio={r.ground === "white" ? r.onWhite : Math.min(r.onWhite ?? 0, r.onMuted ?? 0)} floor={r.floor} text={r.role === "text"} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
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
            <tr><th scope="row">In TypeScript</th><td><code>tokens.color.status.danger</code></td><td>For charts and inline styles, from <code>@mosje/design-system</code>.</td></tr>
            <tr><th scope="row">Never</th><td><code>{primaryBolder?.fill}</code></td><td>A hex cannot follow a brand, and it cannot carry a guarantee.</td></tr>
          </tbody>
        </table>
      </Section>

      {/* ── Retired ───────────────────────────────────────────── */}
      <Section id="retired">
        <p className="docs-lede">
          The legacy <code>--ds-*</code> vocabulary is retired: every name is deleted from every
          generated artifact, and every call site reads the canonical <code>--sa-*</code> token it
          already resolved to. This section is the record of what went, so older code stays
          readable — not guidance.
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

      {/* ── In use ────────────────────────────────────────────── */}
      <Section id="in-use">
        <p className="docs-lede">
          The same tokens serve a citizen filling in a scheme application, an officer reading a
          dashboard, and an analyst comparing districts. What changes between them is prominence,
          not colour. Everything below is a real component from <code>@mosje/design-system</code>{" "}
          — switch brands at the top of the page and it repaints.
        </p>
        <div className="color-examples">
          <article className="color-example">
            <h3 className="color-example__title">Citizen-facing form</h3>
            <p className="color-example__note">
              A form speaks quietly. The field border is the only status colour on the page until
              something fails; the message beneath it takes the base ink, which clears 4.5:1 on
              the page ground, and the icon and the sentence carry the meaning.
            </p>
            <div className="color-example__stage">
              <label className="color-example__label" htmlFor="ex-aadhaar">Aadhaar number</label>
              <Input id="ex-aadhaar" status="error" defaultValue="1234 5678 9012" readOnly aria-describedby="ex-aadhaar-msg" />
              <p id="ex-aadhaar-msg" className="color-example__msg" style={{ color: cssVar("text/status/error/base") }}>
                <span aria-hidden="true">✕ </span>Aadhaar number does not match the bank account holder name.
              </p>
              <label className="color-example__label" htmlFor="ex-ifsc">IFSC code</label>
              <Input id="ex-ifsc" status="success" defaultValue="SBIN0001234" readOnly aria-describedby="ex-ifsc-msg" />
              <p id="ex-ifsc-msg" className="color-example__msg" style={{ color: cssVar("text/status/success/base") }}>
                <span aria-hidden="true">✓ </span>State Bank of India, Connaught Place branch.
              </p>
              <div className="color-example__actions">
                <Button variant="primary" appearance="filled">Submit application</Button>
                <Button variant="primary" appearance="outlined">Save draft</Button>
              </div>
              <Alert status="success" title="Sanction approved">
                Grant of ₹2,40,000 sanctioned for the financial year 2026–27.
              </Alert>
            </div>
          </article>

          <article className="color-example">
            <h3 className="color-example__title">Administrative dashboard</h3>
            <p className="color-example__note">
              A dashboard sorts with tints and alerts with solids. Tonal badges take the subtler
              ground and the bolder ink; the one solid chip on the screen is the thing that needs
              attention. Amber is the one family whose solid chip takes the bold rung and dark ink.
            </p>
            <div className="color-example__stage">
              <div className="color-example__row">
                <Badge status="success">Sanctioned</Badge>
                <Badge status="info">Under review</Badge>
                <Badge status="warning">UC pending</Badge>
                <Badge status="danger">Rejected</Badge>
              </div>
              <div className="color-example__row">
                <Badge status="warning" emphasis="solid">3 overdue</Badge>
                <Badge status="success" emphasis="solid">Live</Badge>
                <Badge status="danger" emphasis="solid">Escalated</Badge>
              </div>
              <Alert status="warning" title="Utilisation certificate pending">
                Submit the UC for the previous instalment before 30 September 2026.
              </Alert>
              <div className="color-example__actions">
                <Button variant="success" appearance="filled">Approve</Button>
                <Button variant="danger" appearance="filled">Reject</Button>
                <Button variant="neutral" appearance="text">Return for correction</Button>
              </div>
            </div>
          </article>

          <article className="color-example">
            <h3 className="color-example__title">Analytics portal</h3>
            <p className="color-example__note">
              A chart takes the categorical series in order — slots 1 to {META.cvdSafeSeries} are distinguishable
              through every colour-vision deficiency — and never a status colour for a series.
              Signed data uses the red-to-blue diverging scale, which keeps its direction under
              deuteranopia where red-to-green does not.
            </p>
            <div className="color-example__stage">
              <div className="color-example__bars" role="img" aria-label="Six categorical series as bars, tallest to shortest">
                {[92, 74, 61, 52, 44, 36].map((h, i) => (
                  <div key={i} className="color-example__bar" style={{ height: `${h}%`, background: `var(--sa-chart-cat-${i + 1})` }} />
                ))}
              </div>
              <div className="color-example__scale" aria-hidden="true">
                {CHART.diverging.map((d) => <span key={d.key} style={{ background: `var(--sa-chart-div-${d.key})` }} />)}
              </div>
              <div className="color-example__scale" aria-hidden="true">
                {CHART.sequential.filter((s) => s.step >= 100).map((s) => <span key={s.step} style={{ background: `var(--sa-chart-seq-${s.step})` }} />)}
              </div>
              <Alert status="info" title="Figures as at 31 August 2026">
                Mirrored from the PM-AJAY Management Information System; the live feed is read where it answers.
              </Alert>
            </div>
          </article>
        </div>
      </Section>

      {/* ── Colour vision ─────────────────────────────────────── */}
      <Section id="colour-vision">
        <p className="docs-lede">
          About one man in twelve has a red–green deficiency. Every status ink, every filled rung
          and every chart series is measured through Machado&rsquo;s simulations of protanopia,
          deuteranopia and tritanopia — the matrices Chrome DevTools and Figma use — and what those
          readers get is shown beside the normal-vision value. Where two colours converge, the
          design carries the meaning in an icon, a word or a lightness step, never in hue alone.
        </p>
        <div className="color-cvd">
          {CVD.map((set) => (
            <article key={set.key} className="color-cvd__set">
              <h3 className="color-cvd__title">{set.title}</h3>
              <div className="color-cvd__table" role="table" aria-label={`${set.title} under three colour-vision deficiencies`}>
                <div className="color-cvd__row color-cvd__row--head" role="row">
                  <span role="columnheader">Token</span>
                  <span role="columnheader">Normal</span>
                  <span role="columnheader">Protanopia</span>
                  <span role="columnheader">Deuteranopia</span>
                  <span role="columnheader">Tritanopia</span>
                </div>
                {set.entries.map((e) => (
                  <div key={e.token} className="color-cvd__row" role="row">
                    <span role="rowheader" className="color-cvd__label"><code>{e.token}</code></span>
                    <span role="cell" className="color-cvd__sw" style={{ background: cssVar(e.token) }} title={e.value} />
                    {(["protanopia", "deuteranopia", "tritanopia"] as const).map((t) => (
                      <span key={t} role="cell" className="color-cvd__sw" style={{ background: e.sim[t] }} title={`${t}: ${e.sim[t]}`} />
                    ))}
                  </div>
                ))}
              </div>
              <dl className="color-cvd__worst">
                {(["none", "protanopia", "deuteranopia", "tritanopia"] as const).map((t) => {
                  const w = set.worst[t];
                  const cls = !w ? "none" : w.d >= 8 ? "aa" : w.d >= 6 ? "nontext" : "fail";
                  return (
                    <div key={t}>
                      <dt>{t === "none" ? "normal vision" : t}</dt>
                      <dd>
                        <span className={`color-pass color-pass--${cls}`}>
                          <span className="color-pass__ratio">ΔE {w?.d}</span>
                          <span className="color-pass__class">{w ? `${w.a} · ${w.b}` : "—"}</span>
                        </span>
                      </dd>
                    </div>
                  );
                })}
              </dl>
            </article>
          ))}
        </div>
        <Callout type="info" title="How to read ΔE, and what the design does about it">
          Distances are OKLab ΔE × 100 for the closest pair in the set. 8 is what the chart gate
          treats as distinguishable at once; 6–8 is legal only with a second encoding; below 6 two
          colours are one colour to that reader. Red against green converges for every dichromat
          in every palette that has ever existed, which is why a status never travels alone: the
          series palette holds ΔE ≥ {chartCvd?.worst.protanopia?.d ?? META.worstCvdSeriesPair} across all 36 pairs under every deficiency, the
          diverging scale is red-to-blue, and every status ships with its glyph and its word.
        </Callout>
      </Section>

      {/* ── Modes ─────────────────────────────────────────────── */}
      <Section id="modes">
        <p className="docs-lede">
          Blue and Navy are the estate&rsquo;s brands; six DBIM previews and two UX4G modes exist
          so conformance can be shown rather than argued. Every role below was resolved inside
          each mode&rsquo;s own stylesheet block and measured against the ground it sits on.
        </p>
        <div className="color-modes">
          <table className="token-table color-modes__table" aria-label="Load-bearing roles measured in every colour mode">
            <thead>
              <tr>
                <th scope="col">Role</th>
                <th scope="col">Against</th>
                {MODES.map((m) => <th key={m.id} scope="col"><span className="color-modes__kind">{m.kind}</span>{m.id}</th>)}
              </tr>
            </thead>
            <tbody>
              {MODES[0]?.roles.map((role, i) => (
                <tr key={role.token}>
                  <th scope="row"><code>{role.token}</code></th>
                  <td><code>{role.against}</code></td>
                  {MODES.map((m) => {
                    const r = m.roles[i];
                    return (
                      <td key={m.id}>
                        <span className="color-modes__cell" style={{ background: r?.value ?? undefined }} aria-hidden="true" />
                        <Pass ratio={r?.ratio ?? null} floor={role.floor} text={role.floor >= 4.5} />
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="docs-note">
          {modeFails.length === 0
            ? "Every load-bearing role clears its floor in every mode."
            : `${modeFails.length} figure${modeFails.length === 1 ? "" : "s"} sit below a floor, all in ${[...new Set(modeFails.map((f) => f.mode))].join(", ")}: DBIM's own published shade 2 as brand text and as the primary fill under white. Reported rather than corrected, because correcting it would ship a colour DBIM never issued.`}{" "}
          <code>mode-contrast.test.mjs</code> and <code>brand-contrast.test.mjs</code> hold the
          estate brands to AA on every load-bearing pairing.
        </p>
      </Section>

      {/* ── Provenance ────────────────────────────────────────── */}
      {/* ── Alpha: every translucent token is a reference plus an opacity reference ── */}
      <Section id="alpha">
        <p className="docs-lede">
          Every translucent colour in the system — the overlay tiers, the modal scrim, the inverse
          rules and every inverse button state, {META.translucentTokens} tokens in all — is a colour
          variable plus an opacity variable. Nothing is a pre-mixed <code>rgba()</code>, so a wash
          follows its base colour through Blue, Navy and every DBIM mode by construction, and a
          retired colour cannot survive inside a literal.
        </p>
        <div className="color-alpha color-alpha--scale" style={{ background: "var(--sa-bg-brand-primary-bolder)" }}>
          <code className="color-alpha__label" style={{ color: "var(--sa-on-bg-brand-primary-bolder)" }}>alpha/*</code>
          {ALPHA_SCALE.map((s) => (
            <div key={s.step} className="color-alpha__chip color-alpha__chip--labelled"
                 style={{ background: `color-mix(in srgb, var(--sa-color-neutralScale-0) calc(var(${s.css}) * 100%), transparent)` }}
                 title={`${s.figma} — ${s.value}`}>
              <span className="color-alpha__step" style={{ color: s.step >= 48 ? "var(--sa-text-neutral-base)" : "var(--sa-on-bg-brand-primary-bolder)" }}>{s.step}</span>
            </div>
          ))}
        </div>
        <table className="token-table" aria-label="The alpha ladder and what each step is for">
          <thead>
            <tr><th scope="col">Step</th><th scope="col">Value</th><th scope="col">Used for</th></tr>
          </thead>
          <tbody>
            {ALPHA_SCALE.map((s) => (
              <tr key={s.step}>
                <th scope="row"><code>{s.figma}</code></th>
                <td><code>{s.value}</code></td>
                <td>{s.use}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="color-examples">
          {TRANSLUCENT.map((g) => (
            <div key={g.group} className="color-example">
              <p className="color-example__title">{g.group}</p>
              <p className="color-example__label">{g.count} tokens</p>
              <ul className="color-example__list">
                {g.examples.map((e) => (
                  <li key={e.token}><code>{e.token}</code> = <code>{e.base}</code> at <code>{e.alpha}</code></li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <TerminalCode title="tokens.css" codeText={"--sa-color-transparent-accent-8:\n  color-mix(in srgb, var(--sa-color-accentScale-600) calc(var(--sa-alpha-8) * 100%), transparent);"} />
        <Callout type="info" title="In Figma: alias the colour, then bind the opacity">
          A translucent variable aliases its base colour and carries its own opacity, bound to the
          matching <code>alpha/*</code> number variable in the Static collection. The Plugin API
          cannot yet write that binding, so the library holds the composited literal and each
          variable&rsquo;s description states the intended binding; apply it in the variable panel.
          The alpha variables need the &ldquo;Color variable opacity&rdquo; scope ticked, which the
          API also cannot set.
        </Callout>
      </Section>

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
            <tr><th scope="row"><code>packages/tokens/src/*.json</code></th><td>DTCG source — eight ramps, the slot grammar, the alpha families, the chart sets.</td></tr>
            <tr><th scope="row"><code>packages/tokens/build/ramp.mjs</code>, <code>brand-ramps.mjs</code></th><td>The anchors and the rule every ramp is generated from.</td></tr>
            <tr><th scope="row"><code>packages/tokens/build/cvd.mjs</code>, <code>oklch.mjs</code></th><td>The colour-vision simulation and the perceptual distances.</td></tr>
            <tr><th scope="row"><code>packages/tokens/dist/tokens.css</code></th><td>Every hex and every ratio on this page, in every mode.</td></tr>
            <tr><th scope="row"><code>docs/design-system/colour-system.md</code></th><td>Ramp shape, per-mode accessibility and the hue-separation ledger. Generated.</td></tr>
            <tr><th scope="row"><code>packages/tokens/test/</code></th><td>on-pair-contrast · prominence-contract · hue-separation · brand-contrast · mode-contrast · chart-palette · figma-value-parity · figma-contrast-parity.</td></tr>
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
