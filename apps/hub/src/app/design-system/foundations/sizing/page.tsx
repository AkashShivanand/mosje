import * as React from "react";
import type { Metadata } from "next";

import "./sizing.css";
import { Callout, DoDont, FoundationDocPage } from "@/components/design-system/docs-kit/index";
import { FOUNDATIONS } from "@/lib/design-system/foundations-data.generated";

export const metadata: Metadata = {
  title: "Sizing",
  description:
    "The shared dimension ladder in rem, the seven icon sizes that alias it, and the four pointer-target sizes named for the authority each one satisfies — WCAG 2.5.8, WCAG 2.5.5, Material and the gap between targets.",
};

/*
 * DS Audit: FoundationDocPage ✅ · Callout ✅ · DoDont ✅
 * A NEW page. The size ladder, icon sizes and target sizes were three unrelated tables on
 * three pages; they are one ladder with two role families on top of it.
 */

const rows = FOUNDATIONS.sizing.tokens;
const ladder = rows.filter((r) => r.tier === "ref");
const icons = rows.filter((r) => r.path.startsWith("icon/size/"));
const targets = rows.filter((r) => r.path.startsWith("target/"));
const pxOf = (r: (typeof rows)[number]): number => {
  const v = r.value ?? "0";
  return v.endsWith("rem") ? Number(v.replace("rem", "")) * 16 : Number(v.replace("px", ""));
};

export default function SizingPage(): React.JSX.Element {
  return (
    <FoundationDocPage
      name="Sizing"
      status="New"
      since="0.49.0"
      summary="Sizing is the width and height of a thing rather than the space around it. SAMAVESH keeps one dimension ladder in rem — so a raised browser font size scales an icon with its label — and two role families on top of it: icon sizes, and pointer targets named for the standard each one meets."
      figma={{ node: "iconography" }}
      glance={[
        { value: ladder.length, label: "ladder steps", note: `${pxOf(ladder[0]!)}px to ${pxOf(ladder.at(-1)!)}px, in rem` },
        { value: icons.length, label: "icon sizes", note: "16 · 20 · 24 · 32 · 40 · 48 · 64" },
        { value: targets.length, label: "target sizes", note: "each named for its authority" },
        { value: "24px", label: "target floor", note: "WCAG 2.2 SC 2.5.8, Level AA" },
        { value: `${FOUNDATIONS.sizing.stats.figma}/${FOUNDATIONS.sizing.stats.total}`, label: "in Figma", note: "Space collection, WIDTH_HEIGHT scope" },
      ]}
      sections={[
        {
          id: "ladder",
          keyword: "LADDER",
          title: "One Ladder in rem, Named by the Pixel It Is at a 16px Root",
          description:
            "size/24 is 1.5rem. Naming by pixel keeps the name checkable against a design; authoring in rem keeps the value honest under browser zoom — an icon beside 200% text must grow with it, or the pair breaks. Nothing binds the ladder directly; the roles below do.",
          content: (
            <div className="sz-ladder" aria-label="Dimension ladder">
              {ladder.map((r) => (
                <div key={r.path} className="sz-step">
                  <div className="sz-step__box" style={{ width: `${pxOf(r)}px`, height: `${pxOf(r)}px` }} aria-hidden="true" />
                  <code className="sz-step__name">{r.path.split("/")[1]}</code>
                </div>
              ))}
            </div>
          ),
        },
        {
          id: "icons",
          keyword: "ICONS",
          title: "Seven Icon Sizes — DBIM's Four, Plus What Interface Work Needs",
          description:
            "DBIM 3.0 §3.4 publishes 24, 32, 48 and 64. The estate adds 16, 20 and 40: a 16 for inline text glyphs, a 20 for dense controls and the accessibility bar, a 40 for a portal card. A standard's list is a floor, not a ceiling. The optical-size axis of Material Symbols tracks the bound size automatically.",
          content: (
            <div className="sz-icons" aria-label="Icon sizes">
              {icons.map((r) => (
                <div key={r.path} className="sz-icon">
                  <span className="material-symbols-rounded sz-icon__glyph" style={{ fontSize: `${pxOf(r)}px` }} aria-hidden="true">
                    verified
                  </span>
                  <code>{r.path.split("/")[2]}</code>
                </div>
              ))}
            </div>
          ),
        },
        {
          id: "targets",
          keyword: "TARGETS",
          title: "Four Target Sizes, Each Named for the Authority It Satisfies",
          description:
            "A number alone cannot be audited. target/min is WCAG 2.2 SC 2.5.8 (24×24, Level AA — the floor, for use only where the spacing exception applies); target/comfortable is SC 2.5.5 and Apple's 44pt; target/spacious is Material's 48dp for primary and one-handed actions; target/spacing is the 8px gap that keeps two adjacent targets from being one.",
          content: (
            <>
              <div className="sz-targets" aria-label="Pointer targets">
                {targets
                  .filter((r) => r.path !== "target/spacing")
                  .map((r) => (
                    <div key={r.path} className="sz-target">
                      <div className="sz-target__box" style={{ width: `${pxOf(r)}px`, height: `${pxOf(r)}px` }} aria-hidden="true" />
                      <code>{r.path}</code>
                      <span>{r.value}</span>
                    </div>
                  ))}
              </div>
              <Callout type="warning" title="24 is AA; 44 is AAA and a mobile recommendation">
                Getting these two confused in an audit is worse than not auditing. 2.5.8 Target Size (Minimum) is 24×24 at Level AA.
                44×44 is 2.5.5 Target Size (Enhanced), Level AAA, which UX4G recommends for mobile. Density&rsquo;s compact mode never
                drops a control below <code>target/min</code>.
              </Callout>
              <DoDont
                cards={[
                  { type: "do", preview: <code>min-height: var(--sa-target-comfortable)</code>, label: "A tappable row on a citizen-facing form. The name says which standard it meets." },
                  { type: "do", preview: <code>gap: var(--sa-target-spacing)</code>, label: "Adjacent icon buttons. The gap is what makes 2.5.8's spacing exception hold." },
                  { type: "dont", preview: <code>height: 44px</code>, label: "A literal that meets a standard by coincidence is one refactor from failing it." },
                ]}
              />
            </>
          ),
        },
      ]}
      tokens={rows}
      tokensIntro="Bind icon/size/<px> for a glyph and target/<authority> for anything a pointer must hit. The Tier-1 size/* ladder is private; both role families alias it, which is why an icon and a target of the same size are the same rem value."
      a11y={[
        {
          criterion: "2.5.8 Target Size (Minimum)",
          level: "AA",
          description: "Every pointer target is at least 24×24 CSS px, or has 24px of spacing to its neighbours.",
          status: "verified",
          evidence: "target/min = 24px; density compact keeps control height at 32 (density audit); target/spacing = 8px satisfies the spacing exception between icon buttons.",
        },
        {
          criterion: "2.5.5 Target Size (Enhanced)",
          level: "AAA",
          description: "Primary actions on citizen-facing forms reach 44×44.",
          status: "partial",
          evidence: "Buttons at md are 40px tall; target/comfortable exists but is not yet bound on every primary action.",
        },
        {
          criterion: "1.4.4 Resize Text",
          level: "AA",
          description: "Icons and targets scale with text at 200%.",
          status: "verified",
          evidence: "The ladder is rem (build-output.test.mjs asserts the type scale is rem; size/* is authored in rem in primitive.json).",
        },
      ]}
      standards={[
        {
          clause: "DBIM 3.0 §3.4, Figure 9 — icon sizes",
          says: "24 · 32 · 48 · 64.",
          does: "16 · 20 · 24 · 32 · 40 · 48 · 64.",
          why: "The four DBIM sizes are all present; the three additions are where inline glyphs, dense controls and portal cards actually render. Reading the list as exclusive once deleted 16/20/40 and broke both (standards-precedence.md).",
        },
        {
          clause: "UX4G 3.0 — 44px touch target",
          says: "44×44 on mobile.",
          does: "target/comfortable = 44 for citizen-facing primary actions; target/min = 24 elsewhere.",
          why: "44 is a AAA and mobile recommendation; 24 is the AA floor WCAG 2.2 sets. Both are named so an audit can tell which is being claimed.",
        },
      ]}
      related={[
        { label: "Iconography", href: "/design-system/foundations/iconography", reason: "the glyphs that take icon/size/*" },
        { label: "Density", href: "/design-system/foundations/density", reason: "control heights that must never drop below target/min" },
        { label: "Spacing", href: "/design-system/foundations/spacing", reason: "the space AROUND a thing, on the same 8px grid" },
      ]}
    />
  );
}
