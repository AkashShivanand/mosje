import * as React from "react";
import type { Metadata } from "next";
import { Icon } from "@mosje/design-system";

import "./iconography.css";
import { Callout, FoundationDocPage, TerminalCode } from "@/components/design-system/docs-kit/index";
import { FOUNDATIONS } from "@/lib/design-system/foundations-data.generated";
import { IconCatalogue } from "./icon-catalogue";
import { ICON_CATALOGUE } from "./icon-catalogue.data";

export const metadata: Metadata = {
  title: "Iconography",
  description:
    "The SAMAVESH icon system — one component holding any Material Symbols Rounded glyph, at weight 300, on a seven-step size scale.",
};

/*
 * DS Audit: FoundationDocPage ✅ · Callout ✅ · TerminalCode ✅ · Icon ✅ · IconCatalogue ✅ (page-local)
 *
 * SYNCED WITH FIGMA. The eight sections below are the eight of `Icons — Documentation`
 * on the Iconography page of the SAMAVESH library (node 2316:246 → 55031:695), in the
 * same order: 01 How it works · 02 The catalogue · 03 Sizes · 04 Weight · 05 Colour ·
 * 06 Bespoke marks · 07 Accessibility · 08 Handoff. Two surfaces documenting one system
 * must not say different things, so the prose is the Figma prose and the numbers come
 * from code.
 *
 * WHAT IS GENERATED RATHER THAN TYPED, and therefore cannot drift:
 *   - the size scale        → FOUNDATIONS.sizing (icon/size/*), read from the build
 *   - the catalogue         → icon-catalogue.data.ts, synced from Figma section 02
 *   - every colour swatch   → the live `--sa-icon-*` custom properties
 *
 * WHERE THE WEB DELIBERATELY GOES FURTHER: Figma's section 05 shows six colour roles;
 * the system defines nine. Documentation that under-reports the system it documents is
 * a defect, so all nine are shown and the three Figma is missing are recorded as
 * Figma-side drift in `docs/design-system/icon-audit.md`.
 */

/** The seven icon/size/* steps, from the generated data. Never typed here. */
const iconRows = FOUNDATIONS.sizing.tokens.filter((r) => r.path.startsWith("icon/size/"));
/** The px number in the path — `icon/size/24` → 24. */
const stepPx = (path: string): number => Number(path.split("/")[2]);
const SIZES: number[] = iconRows.map((r) => stepPx(r.path)).sort((a, b) => a - b);

/**
 * DBIM 3.0 §3.4 (Figure 9) publishes four icon sizes. This is a fact about the
 * STANDARD, not about the tokens, so it is stated once here.
 */
const DBIM_SIZES = new Set<number>([24, 32, 48, 64]);

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
const STANDARD_WEIGHT = 300;
const WEIGHTS: { w: 100 | 200 | 300 | 400 | 500 | 600 | 700; label: string }[] = [
  { w: 100, label: "Thin" },
  { w: 200, label: "ExtraLight" },
  { w: 300, label: "Light" },
  { w: 400, label: "Regular" },
  { w: 500, label: "Medium" },
  { w: 600, label: "SemiBold" },
  { w: 700, label: "Bold" },
];
const standardCut = WEIGHTS.find((x) => x.w === STANDARD_WEIGHT)?.label ?? "Light";

/**
 * Every `--sa-icon-*` colour role. `inFigma` marks the six Figma's section 05 renders;
 * `info`, `disabled` and `inverse` exist in the system and are shown because a colour
 * that ships undocumented gets reinvented as a literal.
 */
const COLOUR_ROLES: { label: string; token: string; inFigma: boolean; onDark?: boolean }[] = [
  { label: "Default", token: "neutral-base", inFigma: true },
  { label: "Secondary", token: "neutral-subtle", inFigma: true },
  { label: "Brand", token: "brand-primary-base", inFigma: true },
  { label: "Info", token: "status-info-base", inFigma: false },
  { label: "Success", token: "status-success-base", inFigma: true },
  { label: "Warning", token: "status-warning-base", inFigma: true },
  { label: "Error", token: "status-error-base", inFigma: true },
  { label: "Disabled", token: "neutral-disabled", inFigma: false },
  { label: "Inverse", token: "neutral-inverse", inFigma: false, onDark: true },
];
const rolesInFigma = COLOUR_ROLES.filter((r) => r.inFigma).length;

/** The marks that survive the ligature test — none resolves to a Material glyph. */
const BESPOKE_MARKS = ["Aadhaar", "Indian flag", "certificate", "Facebook", "X"];

const HERO_ICONS = ["home", "search", "account_balance", "verified", "volunteer_activism", "school", "groups"];

const STEPS = [
  { n: 1, title: "Drop in an Icon", body: "Insert the Icon component. It arrives as home at 24px.", demo: "home" },
  { n: 2, title: "Type the Name", body: "Set the icon property to any Material Symbols name, in snake_case.", demo: "search" },
  { n: 3, title: "Pick the Size", body: `Pick a Size variant — ${SIZES[0]} to ${SIZES[SIZES.length - 1]}. Everything else follows.`, demo: "verified" },
];

const SIGNAL_CARDS = [
  {
    t: "Decorative Icons Are Hidden",
    b: "An icon beside a visible label adds nothing for a screen reader. Mark it aria-hidden so it is skipped rather than announced as a stray word.",
  },
  {
    t: "Icon-Only Controls Carry a Label",
    b: "A button with no visible text needs aria-label on the button, not on the glyph. Without it the control announces as nothing at all.",
  },
  {
    t: "Never Colour or Icon Alone",
    b: "Meaning conveyed by an icon must also exist in text or state. WCAG 1.4.1 — and a glyph that fails to load leaves nothing behind.",
  },
  {
    t: "Touch Targets Stay 44px",
    b: "A 16px icon is not a 16px target. The control around it holds the 44px minimum, whatever the glyph size.",
  },
  {
    t: "Contrast Applies to Icons",
    b: "Non-text contrast is 3:1 against the surface (WCAG 1.4.11). At weight 300 the strokes are thin — check the pairing rather than assuming.",
  },
  {
    t: "The One Failure Mode",
    b: "If the font does not resolve, glyphs render as the literal word. That is visible, not silent, which is why the ligature name is always a real word.",
  },
];

export default function IconographyPage(): React.JSX.Element {
  return (
    <FoundationDocPage
      name="Iconography"
      status="Beta"
      since="0.48.0"
      summary="Material Symbols Rounded, at weight 300. One component holds every glyph, so there is no icon library to maintain: an instance becomes any icon in the catalogue by typing its name, on a seven-step size scale that carries DBIM's four sizes and the three that interface work needs."
      figma={{ node: "iconography" }}
      glance={[
        { value: ICON_CATALOGUE.length, label: "icons in the starter set", note: "synced from Figma section 02, alphabetical" },
        { value: iconRows.length, label: "sizes", note: `${SIZES[0]}–${SIZES[SIZES.length - 1]}px · ${DBIM_SIZES.size} of them DBIM §3.4` },
        { value: STANDARD_WEIGHT, label: "weight", note: `the Figma style named ${standardCut}` },
        { value: COLOUR_ROLES.length, label: "colour roles", note: `${rolesInFigma} swatched in Figma, ${COLOUR_ROLES.length - rolesInFigma} recorded as drift` },
        { value: BESPOKE_MARKS.length, label: "bespoke marks", note: "everything else resolved to a ligature" },
        { value: `${iconRows.filter((r) => r.figma).length}/${iconRows.length}`, label: "sizes in Figma", note: "Space collection, icon/size/*" },
      ]}
      sections={[
        {
          id: "component",
          keyword: "COMPONENT",
          title: "One Component Holds Any Icon",
          description:
            "There is no icon library to maintain. The component holds a Material Symbols glyph and exposes the icon name as a text property, so an instance becomes any of the ~3,000 icons in the catalogue by typing its name.",
          content: (
            <>
              <div className="ico-panel">
                <div className="ico-hero" aria-hidden="true">
                  {HERO_ICONS.map((name) => (
                    <Icon key={name} name={name} size={32} aria-hidden />
                  ))}
                </div>
              </div>
              <div className="ico-panel">
                <div className="ico-cards">
                  {STEPS.map((step) => (
                    <div key={step.n} className="ico-card">
                      <p className="ico-card__step">Step {step.n}</p>
                      <p className="ico-card__title">{step.title}</p>
                      <p className="ico-card__body">{step.body}</p>
                      <p className="ico-card__demo">
                        <Icon name={step.demo} size={20} aria-hidden />
                        <code>icon = &quot;{step.demo}&quot;</code>
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </>
          ),
        },
        {
          id: "catalogue",
          keyword: "CATALOGUE",
          title: `The ${ICON_CATALOGUE.length} Icons in the Starter Set Are a Starting Point, Not a Limit`,
          description:
            "Every icon the estate and the Portal DS between them call for, rendered live from the component — not redrawn. A text property cannot be browsed visually, so this is the browser: filter by name, then select a tile to copy it. Anything else in Material works too.",
          content: <IconCatalogue />,
        },
        {
          id: "sizes",
          keyword: "SIZES",
          title: "Seven Sizes: DBIM's Four, Plus What Interface Work Needs",
          description:
            "DBIM 3.0 §3.4 (Figure 9) publishes four icon sizes and all four are here. The other three are kept deliberately: §3.4 governs the downloadable asset bank, it does not forbid a smaller inline glyph, and 16px is the right size beside 14px body text. A standard's list is a floor, not a ceiling.",
          content: (
            <>
              <div className="ico-panel">
                <div className="ico-strip">
                  {SIZES.map((size) => (
                    <div key={size} className="ico-specimen">
                      <span className="ico-specimen__glyph ico-specimen__glyph--ladder">
                        <Icon name="settings" size={size} aria-hidden />
                      </span>
                      <span className="ico-specimen__label">{size}px</span>
                      <span className={DBIM_SIZES.has(size) ? "ico-specimen__meta ico-specimen__meta--standard" : "ico-specimen__meta"}>
                        {DBIM_SIZES.has(size) ? `DBIM · live area ${size - 4}` : "Interface"}
                      </span>
                      <code className="ico-specimen__token">icon/size/{size}</code>
                      <span className="ico-specimen__meta">{SIZE_USE[size]}</span>
                    </div>
                  ))}
                </div>
              </div>
              <Callout type="info" title="Quality first, then the standard">
                An earlier pass narrowed this scale to DBIM&rsquo;s four and deleted 16, 20 and 40, reading §3.7.i as exclusive.
                That was withdrawn: it would have enlarged icons in every dense table, button and form row to satisfy a clause
                about an asset bank. The order of authority is current design-craft standards first, then DBIM, GIGW and UX4G
                fitted in wherever they do not hamper quality — with{" "}
                <strong>accessibility never traded, because accessibility IS quality</strong>. When a standard specifies a set,{" "}
                <strong>add what is missing; do not delete what quality needs</strong>. See{" "}
                <code>.claude/rules/standards-precedence.md</code>.
              </Callout>
            </>
          ),
        },
        {
          id: "weight",
          keyword: "WEIGHT",
          title: `Weight ${STANDARD_WEIGHT} Is the Style Named ${standardCut}`,
          description:
            "Material Symbols is a variable font with a wght axis, but Figma exposes it as named styles rather than a live axis. The MoSJE standard is therefore the style Light — the identical asymmetry the text styles carry, where CSS needs a number and Figma selects a cut by name.",
          content: (
            <>
              <div className="ico-panel">
                <div className="ico-strip">
                  {WEIGHTS.map(({ w, label }) => (
                    <div key={w} className="ico-specimen">
                      <span className="ico-specimen__glyph">
                        <Icon name="settings" size={32} weight={w} aria-hidden />
                      </span>
                      <span className={w === STANDARD_WEIGHT ? "ico-specimen__label ico-specimen__label--standard" : "ico-specimen__label"}>{label}</span>
                      <span className="ico-specimen__meta">wght {w}</span>
                      {w === STANDARD_WEIGHT ? <span className="ico-specimen__meta ico-specimen__meta--standard">MoSJE standard</span> : null}
                    </div>
                  ))}
                </div>
              </div>
              <p>
                Both halves are a token rather than a literal: <code>--sa-font-weight-light</code> holds the number and its Figma
                counterpart <code>font/weight/light</code> holds the style name <em>{standardCut}</em>, so the seven{" "}
                <code>Icon/*</code> text styles bind their cut the same way the Noto Sans ramp does. The face is bound the same
                way, to <code>font/icon</code>. Both are Tier-2 tokens: nothing in the library binds a Tier-1 <code>ref/*</code>{" "}
                any more.
              </p>
            </>
          ),
        },
        {
          id: "colour",
          keyword: "COLOUR",
          title: "Icons Take icon/* Tokens, Never a Raw Colour",
          description:
            "The glyph is text, so it takes a text fill — but it binds to an icon/* variable, not a text/* one. DBIM constrains this further: icons use the key colour or white, nothing else.",
          content: (
            <>
              <div className="ico-panel">
                <div className="ico-strip">
                  {COLOUR_ROLES.map(({ label, token, onDark }) => (
                    <div
                      key={token}
                      className={onDark ? "ico-specimen ico-specimen--on-dark" : "ico-specimen"}
                      /* The colour is the role's own custom property, computed from the row — the swatch cannot show a colour the system does not ship. */
                      style={{ color: `var(--sa-icon-${token})` }}
                    >
                      <span className="ico-specimen__glyph">
                        <Icon name="verified" size={24} aria-hidden />
                      </span>
                      <span className="ico-specimen__label">{label}</span>
                      <code className="ico-specimen__token">icon/{token.replace(/-/g, "/")}</code>
                    </div>
                  ))}
                </div>
              </div>
              <Callout type="info" title={`${COLOUR_ROLES.length} roles in code, ${rolesInFigma} in Figma`}>
                <code>info</code>, <code>disabled</code> and <code>inverse</code> exist as <code>--sa-icon-*</code> custom
                properties but are not yet swatched on the Figma page. They are shown here because a colour that ships
                undocumented gets reinvented as a literal. Recorded as Figma-side drift in{" "}
                <code>docs/design-system/icon-audit.md</code>.
              </Callout>
            </>
          ),
        },
        {
          id: "marks",
          keyword: "MARKS",
          title: "Almost Nothing Needs to Be a Vector",
          description:
            "A mark only stays a drawn vector when Material Symbols genuinely has no equivalent. Each mark carries an MI: annotation naming its Material counterpart — where that name resolves to a real glyph, the vector is a duplicate and goes. That test removed nearly all of them.",
          content: (
            <>
              <div className="ico-panel">
                <div className="ico-cards">
                  <div className="ico-card">
                    <p className="ico-card__title">What Stays</p>
                    <p className="ico-card__body">
                      {BESPOKE_MARKS.length} bespoke marks — {BESPOKE_MARKS.join(", ")} — plus the state and UT emblems, the
                      government and programme marks, and the organisation logos, which sit in their own sections. Material
                      draws none of these.
                    </p>
                  </div>
                  <div className="ico-card">
                    <p className="ico-card__title">What Goes</p>
                    <p className="ico-card__body">
                      Everything whose <code>MI:</code> name resolves to a glyph — <code>gavel</code> for Court Judgments,{" "}
                      <code>quiz</code> for FAQ, <code>home</code> for the navigation home pair. Use{" "}
                      <code>&lt;Icon name=&quot;…&quot; /&gt;</code> with that name.
                    </p>
                  </div>
                  <div className="ico-card">
                    <p className="ico-card__title">The Test</p>
                    <p className="ico-card__body">
                      Render the <code>MI:</code> name as a Material ligature. If it collapses to a single glyph the icon exists
                      and the vector is redundant. Names of one or two characters cannot be tested this way — a single letter
                      measures the same as a glyph.
                    </p>
                  </div>
                </div>
              </div>
              <Callout type="tip" title={`${BESPOKE_MARKS.length} marks remain, and the test is what keeps it at ${BESPOKE_MARKS.length}`}>
                <strong>Aadhaar</strong>, <strong>Indian flag</strong>, <strong>certificate</strong>, <strong>Facebook</strong> and{" "}
                <strong>X</strong>. None resolves to a Material ligature, which is the only reason each is still a vector. The
                last three that <em>did</em> — <code>external-link</code>, <code>language-switch</code> and <code>syllabus</code>,
                duplicating <code>open_in_new</code>, <code>translate_indic</code> and <code>auto_stories</code> — were migrated
                and deleted in v0.18.1. Apply the test above before adding a sixth.
              </Callout>
            </>
          ),
        },
        {
          id: "signal",
          keyword: "SIGNAL",
          title: "An Icon Is Never the Only Signal",
          description:
            "Icons here render as text glyphs, which means a screen reader will try to read them. Every icon is therefore either hidden from assistive technology or given a label — there is no third option.",
          content: (
            <>
              <div className="ico-panel">
                <div className="ico-cards">
                  {SIGNAL_CARDS.map((c) => (
                    <div key={c.t} className="ico-card">
                      <p className="ico-card__title">{c.t}</p>
                      <p className="ico-card__body">{c.b}</p>
                    </div>
                  ))}
                </div>
              </div>
              <Callout type="tip" title="The component defaults to hidden, so the common case is already correct">
                <code>&lt;Icon&gt;</code> sets <code>aria-hidden=&quot;true&quot;</code> on its own unless you pass an{" "}
                <code>aria-label</code>. A decorative icon therefore needs no ceremony, and an icon given a label is announced as
                an image. The rule above is still the rule — the component just makes the safe half of it the default rather
                than something 500-odd call sites each have to remember.
              </Callout>
            </>
          ),
        },
        {
          id: "handoff",
          keyword: "HANDOFF",
          title: "The Figma Property Is the Code Prop",
          description:
            "The component's text property is named icon, and it takes exactly the string the code takes. There is nothing to translate at handoff.",
          content: (
            <div className="ico-panel">
              <div className="ico-cards">
                <div className="ico-card">
                  <p className="ico-card__eyebrow">In Figma</p>
                  <p className="ico-card__title">Set the Icon Property</p>
                  <TerminalCode title="Figma" codeText={'icon = "search"\nSize = 16'}>
                    {'icon = "search"\nSize = 16'}
                  </TerminalCode>
                  <p className="ico-card__body">Any Material Symbols name, snake_case.</p>
                </div>
                <div className="ico-card">
                  <p className="ico-card__eyebrow">In Code</p>
                  <p className="ico-card__title">Same String, Same Name</p>
                  <TerminalCode title="tsx" codeText={'<Icon name="search" size={16} />'}>
                    {'<Icon name="search" size={16} />'}
                  </TerminalCode>
                  <p className="ico-card__body">
                    From <code>@mosje/design-system</code>. <code>weight</code> defaults to {STANDARD_WEIGHT}.
                  </p>
                </div>
                <div className="ico-card">
                  <p className="ico-card__eyebrow">Loaded Once</p>
                  <p className="ico-card__title">At the App Root</p>
                  <TerminalCode title="tsx" codeText={'import "@mosje/design-system/icons.css";'}>
                    {'import "@mosje/design-system/icons.css";'}
                  </TerminalCode>
                  <p className="ico-card__body">One variable font, all weights and sizes.</p>
                </div>
              </div>
            </div>
          ),
        },
      ]}
      tokens={iconRows}
      tokensIntro="Bind a size step — icon/size/<step> — never a raw number, so icons stay in proportion when the scale moves. Icon colour is not in this table: the nine icon/<role> tokens are colour roles and live on the Colour foundation, shown here in section 05 from the live custom properties. Weight binds font/weight/light and the face binds font/icon, both on the Typography foundation."
      a11y={[
        {
          criterion: "1.1.1 Non-text Content",
          level: "A",
          description:
            "Decorative glyphs are hidden from assistive technology; a meaningful icon-only control carries an aria-label naming the action, not the glyph.",
          status: "partial",
          evidence:
            "The Icon component sets aria-hidden=\"true\" unless an aria-label is passed (icon.tsx), so the decorative half holds by construction; icon-only controls depend on each caller and are not yet asserted by a gate.",
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
          criterion: "2.5.8 Target Size (Minimum)",
          level: "AA",
          description:
            "The interactive control around an icon, not the glyph, is the target: every control holds the 24×24px minimum, and form controls and the large button hold the 44×44px of 2.5.5 (Enhanced, AAA) — a 16px icon is not a 16px target.",
        },
      ]}
      standards={[
        {
          clause: "DBIM 3.0 §3.4 (Figure 9)",
          says: "Four icon sizes — 24, 32, 48 and 64 — for the downloadable asset bank.",
          does: `${iconRows.length} steps: DBIM's four plus 16, 20 and 40 for inline, list and tile work.`,
          why: "§3.4 governs an asset bank, not an inline glyph; 16px is the right size beside 14px body text, and enlarging every dense table and form row to satisfy it would trade quality for a clause. All four DBIM sizes are present.",
        },
      ]}
      related={[
        { label: "Color", href: "/design-system/foundations/color", reason: "the nine icon/* colour roles a glyph binds" },
        { label: "Typography", href: "/design-system/foundations/typography", reason: "font/weight/light and font/icon, the cut and the face" },
        { label: "Sizing", href: "/design-system/foundations/sizing", reason: "the size ladder icon/size/* aliases, and the target/* minimums around a glyph" },
        { label: "Icon", href: "/design-system/components/utilities/icon", reason: "the component's API" },
      ]}
    />
  );
}
