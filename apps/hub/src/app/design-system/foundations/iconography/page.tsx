import * as React from "react";
import type { Metadata } from "next";
import { Icon, buttonClasses } from "@mosje/design-system";
import { iconSize } from "@mosje/design-system/tokens";
import { Callout, A11yChecklist, TerminalCode } from "@/components/design-system/docs-kit/index";
import { figmaUrl, FIGMA_NODES } from "@/lib/design-system/figma";
import { IconCatalogue } from "./icon-catalogue";
import { ICON_CATALOGUE } from "./icon-catalogue.data";
import "./iconography.css";

export const metadata: Metadata = {
  title: "Iconography",
  description:
    "The SAMAVESH icon system — one component holding any Material Symbols Rounded glyph, at weight 300, on a seven-step size scale.",
};

/**
 * Iconography — the web half of a single documented system.
 *
 * SYNCED WITH FIGMA. This page carries the same eight sections, in the same
 * order, as `Icons — Documentation` on the Iconography page of the SAMAVESH
 * library (node 2316:246 → 55031:695): 01 How it works · 02 The catalogue ·
 * 03 Sizes · 04 Weight · 05 Colour · 06 Bespoke marks · 07 Accessibility ·
 * 08 Handoff. Two surfaces documenting one system must not say different
 * things, so the prose is the Figma prose and the numbers come from code.
 *
 * WHAT IS GENERATED RATHER THAN TYPED, and therefore cannot drift:
 *   - the size scale        → `iconSize` from @mosje/tokens (read from the stylesheet)
 *   - the catalogue         → `icon-catalogue.data.ts`, synced from Figma section 02
 *   - every colour swatch   → the live `--sa-icon-*` custom properties
 *
 * WHERE THE WEB DELIBERATELY GOES FURTHER: Figma's section 05 shows six colour
 * roles; the system defines nine. Documentation that under-reports the system it
 * documents is a defect, so all nine are shown here and the three Figma is missing
 * are recorded as Figma-side drift in `docs/design-system/icon-audit.md`.
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

/** The wght axis, as Figma names its cuts. 300 is the MoSJE standard. */
const WEIGHTS: { w: 100 | 200 | 300 | 400 | 500 | 600 | 700; label: string }[] = [
  { w: 100, label: "Thin" },
  { w: 200, label: "ExtraLight" },
  { w: 300, label: "Light" },
  { w: 400, label: "Regular" },
  { w: 500, label: "Medium" },
  { w: 600, label: "SemiBold" },
  { w: 700, label: "Bold" },
];

/**
 * Every `--sa-icon-*` colour role. The first six are the ones Figma's section 05
 * renders; `info`, `disabled` and `inverse` exist in the system and are shown
 * because a colour that ships undocumented gets reinvented as a literal.
 */
const COLOUR_ROLES: { label: string; token: string; onDark?: boolean }[] = [
  { label: "Default", token: "neutral-base" },
  { label: "Secondary", token: "neutral-subtle" },
  { label: "Brand", token: "brand-primary-base" },
  { label: "Info", token: "status-info-base" },
  { label: "Success", token: "status-success-base" },
  { label: "Warning", token: "status-warning-base" },
  { label: "Error", token: "status-error-base" },
  { label: "Disabled", token: "neutral-disabled" },
  { label: "Inverse", token: "neutral-inverse", onDark: true },
];

const HERO_ICONS = [
  "home",
  "search",
  "account_balance",
  "verified",
  "volunteer_activism",
  "school",
  "groups",
];

export default function IconographyPage(): React.JSX.Element {
  return (
    <article className="ds-prose">
      <h1>Iconography</h1>
      <p
        style={{
          fontSize: "var(--sa-type-headline-1-size)",
          lineHeight: "var(--sa-type-headline-1-lh)",
          color: "var(--sa-color-text-muted)",
          marginTop: "var(--sa-stack-12)",
        }}
      >
        Material Symbols Rounded, at weight 300. One component holds every glyph,
        so there is no icon library to maintain.
      </p>

      <div
        className="icon-panel"
        style={{ display: "flex", flexWrap: "wrap", gap: "var(--sa-stack-32)", justifyContent: "center" }}
      >
        {HERO_ICONS.map((name) => (
          <Icon key={name} name={name} size={32} aria-hidden />
        ))}
      </div>

      <div style={{ marginTop: "var(--sa-stack-16)" }}>
        <a
          className={buttonClasses("primary", "outlined", "md")}
          href={figmaUrl(FIGMA_NODES.iconography)}
          target="_blank"
          rel="noopener noreferrer"
        >
          View in Figma <span aria-hidden="true">↗</span>
        </a>
      </div>

      {/* ── 01 How it works ─────────────────────────────────────────────── */}
      <section aria-labelledby="how-it-works" style={{ marginTop: "var(--sa-stack-40)" }}>
        <h2 id="how-it-works">One component, any icon</h2>
        <p style={{ marginTop: "var(--sa-stack-12)", color: "var(--sa-color-text-muted)" }}>
          There is no icon library to maintain. The component holds a Material
          Symbols glyph and exposes the icon name as a text property, so an
          instance becomes any of the ~3,000 icons in the catalogue by typing its
          name.
        </p>
        <div className="icon-panel">
          <div className="icon-cards">
            {[
              {
                n: 1,
                title: "Drop in an Icon",
                body: "Insert the Icon component. It arrives as home at 24px.",
                demo: "home",
              },
              {
                n: 2,
                title: "Type the name",
                body: "Set the icon property to any Material Symbols name, in snake_case.",
                demo: "search",
              },
              {
                n: 3,
                title: "Pick the size",
                body: "Pick a Size variant — 16 to 64. Everything else follows.",
                demo: "verified",
              },
            ].map((step) => (
              <div key={step.n} className="icon-card">
                <p className="icon-card__step">{step.n}</p>
                <p className="icon-card__title">{step.title}</p>
                <p className="icon-card__body">{step.body}</p>
                <p className="icon-card__demo">
                  <Icon name={step.demo} size={20} aria-hidden />
                  <code>icon = &quot;{step.demo}&quot;</code>
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 02 The catalogue ────────────────────────────────────────────── */}
      <section aria-labelledby="catalogue" style={{ marginTop: "var(--sa-stack-40)" }}>
        <h2 id="catalogue">The {ICON_CATALOGUE.length} icons in the starter set</h2>
        <p style={{ marginTop: "var(--sa-stack-12)", color: "var(--sa-color-text-muted)" }}>
          Every icon the estate and the Portal DS between them call for, rendered
          live from the component — not redrawn. A text property cannot be browsed
          visually, so this is the browser: filter by name, then click a tile to
          copy it. Anything else in Material works too; this is a starting point,
          not a limit.
        </p>
        <IconCatalogue />
      </section>

      {/* ── 03 Sizes ────────────────────────────────────────────────────── */}
      <section aria-labelledby="sizes" style={{ marginTop: "var(--sa-stack-40)" }}>
        <h2 id="sizes">Seven sizes — DBIM&rsquo;s four, plus what interface work needs</h2>
        <p style={{ marginTop: "var(--sa-stack-12)", color: "var(--sa-color-text-muted)" }}>
          DBIM 3.0 §3.4 (Figure 9) publishes four icon sizes and all four are here.
          The other three are kept deliberately: §3.4 governs the downloadable asset
          bank, it does not forbid a smaller inline glyph, and 16px is the right size
          beside 14px body text. A standard&rsquo;s list is a floor, not a ceiling.
        </p>
        <div className="icon-panel">
          <div className="icon-strip">
            {SIZES.map((size) => (
              <div key={size} className="icon-specimen">
                <span className="icon-specimen__glyph" style={{ height: "var(--sa-icon-size-64)" }}>
                  <Icon name="settings" size={size} aria-hidden />
                </span>
                <span className="icon-specimen__label">{size}px</span>
                <span
                  className={
                    DBIM_SIZES.has(size)
                      ? "icon-specimen__meta icon-specimen__meta--standard"
                      : "icon-specimen__meta"
                  }
                >
                  {DBIM_SIZES.has(size) ? `DBIM · live area ${size - 4}` : "Interface"}
                </span>
                <code className="icon-specimen__token">icon/size/{size}</code>
                <span className="icon-specimen__meta">{SIZE_USE[size]}</span>
              </div>
            ))}
          </div>
        </div>
        <Callout type="info" title="Quality first, then the standard">
          An earlier pass narrowed this scale to DBIM&rsquo;s four and deleted 16, 20
          and 40, reading §3.7.i as exclusive. That was withdrawn: it would have
          enlarged icons in every dense table, button and form row to satisfy a
          clause about an asset bank. The order of authority is current design-craft
          standards first, then DBIM, GIGW and UX4G fitted in wherever they do not
          hamper quality — with <strong>accessibility never traded, because
          accessibility IS quality</strong>. When a standard specifies a set,{" "}
          <strong>add what is missing; do not delete what quality needs</strong>. See{" "}
          <code>.claude/rules/standards-precedence.md</code>.
        </Callout>
      </section>

      {/* ── 04 Weight ───────────────────────────────────────────────────── */}
      <section aria-labelledby="weight" style={{ marginTop: "var(--sa-stack-40)" }}>
        <h2 id="weight">Weight 300 is the style named Light</h2>
        <p style={{ marginTop: "var(--sa-stack-12)", color: "var(--sa-color-text-muted)" }}>
          Material Symbols is a variable font with a <code>wght</code> axis, but Figma
          exposes it as named styles rather than a live axis. The MoSJE standard of
          <code> wght 300</code> is therefore the style <strong>Light</strong> — the
          identical asymmetry the text styles carry, where CSS needs a number and
          Figma selects a cut by name.
        </p>
        <div className="icon-panel">
          <div className="icon-strip">
            {WEIGHTS.map(({ w, label }) => (
              <div key={w} className="icon-specimen">
                <span className="icon-specimen__glyph">
                  <Icon name="settings" size={32} weight={w} aria-hidden />
                </span>
                <span
                  className={
                    w === 300 ? "icon-specimen__label icon-specimen__meta--standard" : "icon-specimen__label"
                  }
                >
                  {label}
                </span>
                <span className="icon-specimen__meta">wght {w}</span>
                {w === 300 ? (
                  <span className="icon-specimen__meta icon-specimen__meta--standard">MoSJE standard</span>
                ) : null}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 05 Colour ───────────────────────────────────────────────────── */}
      <section aria-labelledby="colour" style={{ marginTop: "var(--sa-stack-40)" }}>
        <h2 id="colour">Icons take <code>icon/*</code> tokens, never a raw colour</h2>
        <p style={{ marginTop: "var(--sa-stack-12)", color: "var(--sa-color-text-muted)" }}>
          The glyph is text, so it takes a text fill — but it binds to an{" "}
          <code>icon/*</code> variable, not a <code>text/*</code> one. DBIM constrains
          this further: icons use the key colour or white, nothing else.
        </p>
        <div className="icon-panel">
          <div className="icon-strip">
            {COLOUR_ROLES.map(({ label, token, onDark }) => (
              <div
                key={token}
                className="icon-specimen"
                style={
                  onDark
                    ? { background: "var(--sa-bg-neutral-inverse)", color: `var(--sa-icon-${token})` }
                    : { color: `var(--sa-icon-${token})` }
                }
              >
                <span className="icon-specimen__glyph">
                  <Icon name="verified" size={24} aria-hidden />
                </span>
                <span
                  className="icon-specimen__label"
                  style={onDark ? { color: "var(--sa-text-neutral-inverse)" } : undefined}
                >
                  {label}
                </span>
                <code className="icon-specimen__token">icon/{token.replace(/-/g, "/")}</code>
              </div>
            ))}
          </div>
        </div>
        <Callout type="info" title="Nine roles in code, six in Figma">
          <code>info</code>, <code>disabled</code> and <code>inverse</code> exist as{" "}
          <code>--sa-icon-*</code> custom properties but are not yet swatched on the
          Figma page. They are shown here because a colour that ships undocumented
          gets reinvented as a literal. Recorded as Figma-side drift in{" "}
          <code>docs/design-system/icon-audit.md</code>.
        </Callout>
      </section>

      {/* ── 06 Bespoke marks ────────────────────────────────────────────── */}
      <section aria-labelledby="bespoke" style={{ marginTop: "var(--sa-stack-40)" }}>
        <h2 id="bespoke">Almost nothing needs to be a vector</h2>
        <p style={{ marginTop: "var(--sa-stack-12)", color: "var(--sa-color-text-muted)" }}>
          A mark only stays a drawn vector when Material Symbols genuinely has no
          equivalent. Each mark carries an <code>MI:</code> annotation naming its
          Material counterpart — where that name resolves to a real glyph, the vector
          is a duplicate and goes. That test removed nearly all of them.
        </p>
        <div className="icon-panel">
          <div className="icon-cards">
            <div className="icon-card">
              <p className="icon-card__title">What stays</p>
              <p className="icon-card__body">
                Five bespoke marks — Aadhaar, the Indian flag, certificate, Facebook
                and X — plus the state and UT emblems, the government and programme
                marks, and the organisation logos, which sit in their own sections.
                Material draws none of these.
              </p>
            </div>
            <div className="icon-card">
              <p className="icon-card__title">What goes</p>
              <p className="icon-card__body">
                Everything whose <code>MI:</code> name resolves to a glyph —{" "}
                <code>gavel</code> for Court Judgments, <code>quiz</code> for FAQ,{" "}
                <code>home</code> for the navigation home pair. Use{" "}
                <code>&lt;Icon name=&quot;…&quot; /&gt;</code> with that name.
              </p>
            </div>
            <div className="icon-card">
              <p className="icon-card__title">The test</p>
              <p className="icon-card__body">
                Render the <code>MI:</code> name as a Material ligature. If it
                collapses to a single glyph the icon exists and the vector is
                redundant. Names of one or two characters cannot be tested this way —
                a single letter measures the same as a glyph.
              </p>
            </div>
          </div>
        </div>
        <Callout type="tip" title="Five marks remain, and the test is what keeps it at five">
          <strong>Aadhaar</strong>, <strong>Indian flag</strong>,{" "}
          <strong>certificate</strong>, <strong>Facebook</strong> and{" "}
          <strong>X</strong>. None resolves to a Material ligature, which is the only
          reason each is still a vector. The last three that <em>did</em> —{" "}
          <code>external-link</code>, <code>language-switch</code> and{" "}
          <code>syllabus</code>, duplicating <code>open_in_new</code>,{" "}
          <code>translate_indic</code> and <code>auto_stories</code> — were migrated
          and deleted in v0.18.1. Apply the test above before adding a sixth.
        </Callout>
      </section>

      {/* ── 07 Accessibility ────────────────────────────────────────────── */}
      <section aria-labelledby="a11y" style={{ marginTop: "var(--sa-stack-40)" }}>
        <h2 id="a11y">An icon is never the only signal</h2>
        <p style={{ marginTop: "var(--sa-stack-12)", color: "var(--sa-color-text-muted)" }}>
          Icons here render as text glyphs, which means a screen reader will try to
          read them. Every icon is therefore <strong>either hidden from assistive
          technology or given a label</strong> — there is no third option.
        </p>
        <div className="icon-panel">
          <div className="icon-cards">
            {[
              {
                t: "Decorative icons are hidden",
                b: "An icon beside a visible label adds nothing for a screen reader. Mark it aria-hidden so it is skipped rather than announced as a stray word.",
              },
              {
                t: "Icon-only controls carry a label",
                b: "A button with no visible text needs aria-label on the button, not on the glyph. Without it the control announces as nothing at all.",
              },
              {
                t: "Never colour or icon alone",
                b: "Meaning conveyed by an icon must also exist in text or state. WCAG 1.4.1 — and a glyph that fails to load leaves nothing behind.",
              },
              {
                t: "Touch targets stay 44px",
                b: "A 16px icon is not a 16px target. The control around it holds the 44px minimum, whatever the glyph size.",
              },
              {
                t: "Contrast applies to icons",
                b: "Non-text contrast is 3:1 against the surface (WCAG 1.4.11). At weight 300 the strokes are thin — check the pairing rather than assuming.",
              },
              {
                t: "The one failure mode",
                b: "If the font does not resolve, glyphs render as the literal word. That is visible, not silent, which is why the ligature name is always a real word.",
              },
            ].map((c) => (
              <div key={c.t} className="icon-card">
                <p className="icon-card__title">{c.t}</p>
                <p className="icon-card__body">{c.b}</p>
              </div>
            ))}
          </div>
        </div>

        <Callout type="tip" title="The component defaults to hidden, so the common case is already correct">
          <code>&lt;Icon&gt;</code> sets <code>aria-hidden=&quot;true&quot;</code> on
          its own unless you pass an <code>aria-label</code>. A decorative icon
          therefore needs no ceremony, and an icon given a label is announced as an
          image. The rule above is still the rule — the component just makes the safe
          half of it the default rather than something 500-odd call sites each have to
          remember.
        </Callout>

        <A11yChecklist
          items={[
            {
              criterion: "1.1.1 Non-text Content",
              level: "A",
              description:
                "Decorative glyphs are hidden from assistive technology; a meaningful icon-only control carries an aria-label naming the action, not the glyph.",
            },
            {
              criterion: "1.4.1 Use of Colour",
              level: "A",
              description:
                "An icon never carries meaning alone. Status is also in text or state, so the message survives a failed font load or a colour-blind reader.",
            },
            {
              criterion: "1.4.11 Non-text Contrast",
              level: "AA",
              description:
                "Icon strokes hold 3:1 against their surface. At weight 300 strokes are thin, so the pairing is measured rather than assumed.",
            },
            {
              criterion: "2.5.5 Target Size",
              level: "GIGW",
              description:
                "The interactive control around an icon holds the 44×44px minimum regardless of glyph size — a 16px icon is not a 16px target.",
            },
          ]}
        />
      </section>

      {/* ── 08 Handoff ──────────────────────────────────────────────────── */}
      <section aria-labelledby="handoff" style={{ marginTop: "var(--sa-stack-40)" }}>
        <h2 id="handoff">The Figma property is the code prop</h2>
        <p style={{ marginTop: "var(--sa-stack-12)", color: "var(--sa-color-text-muted)" }}>
          The component&rsquo;s text property is named <code>icon</code>, and it takes
          exactly the string the code takes. There is nothing to translate at handoff.
        </p>
        <div className="icon-panel">
          <div className="icon-cards">
            <div className="icon-card">
              <p className="icon-handoff__eyebrow">In Figma</p>
              <p className="icon-card__title">Set the icon property</p>
              <TerminalCode title="Figma" codeText={'icon = "search"\nSize = 16'}>
                {'icon = "search"\nSize = 16'}
              </TerminalCode>
              <p className="icon-card__body">Any Material Symbols name, snake_case.</p>
            </div>
            <div className="icon-card">
              <p className="icon-handoff__eyebrow">In code</p>
              <p className="icon-card__title">Same string, same name</p>
              <TerminalCode title="tsx" codeText={'<Icon name="search" size={16} />'}>
                {'<Icon name="search" size={16} />'}
              </TerminalCode>
              <p className="icon-card__body">
                From <code>@mosje/design-system</code>. <code>weight</code> defaults to 300.
              </p>
            </div>
            <div className="icon-card">
              <p className="icon-handoff__eyebrow">Loaded once</p>
              <p className="icon-card__title">At the app root</p>
              <TerminalCode title="tsx" codeText={'import "@mosje/design-system/icons.css";'}>
                {'import "@mosje/design-system/icons.css";'}
              </TerminalCode>
              <p className="icon-card__body">One variable font, all weights and sizes.</p>
            </div>
          </div>
        </div>
      </section>
    </article>
  );
}
