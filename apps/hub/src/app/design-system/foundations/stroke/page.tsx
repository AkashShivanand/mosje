import * as React from "react";
import type { Metadata } from "next";

import "./stroke.css";
import { Callout, DoDont, FoundationDocPage } from "@/components/design-system/docs-kit/index";
import { FOUNDATIONS } from "@/lib/design-system/foundations-data.generated";

export const metadata: Metadata = {
  title: "Stroke",
  description:
    "Border widths as a value-named ladder — stroke/0 to stroke/4 — the hairline every rule and edge takes, the control border that follows every field, and the focus ring that must never be thinner than 2px.",
};

/*
 * DS Audit: FoundationDocPage ✅ · Callout ✅ · DoDont ✅
 * A NEW page. The tokens existed (stroke/0…4, added 2026-08-18) and had ZERO consumers in
 * the design system's CSS: 110 `1px solid` literals and 6 `2px solid` drew every edge. The
 * adoption pass on 2026-09-04 bound 126 of them; this page is where the rule now lives.
 */

const rows = FOUNDATIONS.stroke.tokens;
const ladder = rows.filter((r) => /^stroke\/\d$/.test(r.path));
const control = rows.filter((r) => r.path.startsWith("control/"));

export default function StrokePage(): React.JSX.Element {
  return (
    <FoundationDocPage
      name="Stroke"
      status="New"
      since="0.48.0"
      summary="A stroke is the width of an edge — a border, a rule, a focus ring. SAMAVESH keeps five value-named widths and two roles, and the hairline does almost all of the work: a thicker edge is a deliberate emphasis, and colour usually carries emphasis better than width."
      figma={{ node: "shape" }}
      glance={[
        { value: ladder.length, label: "widths", note: "0 · 1 · 2 · 3 · 4 px, value-named" },
        { value: control.length, label: "roles", note: "control/border/width" },
        { value: "126", label: "edges bound", note: "literal 1–4px solid → stroke/N, 2026-09-04" },
        { value: "2px", label: "focus ring floor", note: "WCAG 2.4.11 Focus Appearance" },
        { value: `${FOUNDATIONS.stroke.stats.figma}/${FOUNDATIONS.stroke.stats.total}`, label: "in Figma", note: "Static collection, STROKE_FLOAT scope" },
      ]}
      sections={[
        {
          id: "ladder",
          keyword: "LADDER",
          title: "Five Widths, and the Hairline Does Almost All of the Work",
          description:
            "stroke/1 is the default rule weight — dividers, table rules, card edges, the border of every field at rest. stroke/2 is a deliberate emphasis: the selected card, the focus ring, the tab indicator. stroke/3 and stroke/4 are rare enough that reaching for one is a signal to ask whether the emphasis belongs in colour instead.",
          content: (
            <div className="st-ladder" aria-label="Stroke widths">
              {ladder.map((r) => (
                <div key={r.path} className="st-step">
                  <div className="st-step__rule" style={{ borderTopWidth: r.value ?? undefined }} aria-hidden="true" />
                  <code className="st-step__name">{r.path}</code>
                  <span className="st-step__use">{r.description}</span>
                </div>
              ))}
            </div>
          ),
        },
        {
          id: "roles",
          keyword: "ROLES",
          title: "A Control's Edge Is a Role, So Every Field Agrees",
          description:
            "control/border/width is the edge of every input, select, textarea and outlined button. It aliases stroke/1 today; binding the role rather than the rung means a decision to thicken form borders is one change, not sixty.",
          content: (
            <>
              <ul>
                {control.map((r) => (
                  <li key={r.path}>
                    <code>{r.css}</code> — {r.value}. {r.description}
                  </li>
                ))}
              </ul>
              <Callout type="info" title="stroke/0 is a decision, not an omission">
                Bind it where an edge is deliberately absent — a flush card inside a panel, a table without rules — so a reviewer can
                tell a missing border from a chosen one.
              </Callout>
            </>
          ),
        },
        {
          id: "focus",
          keyword: "FOCUS",
          title: "The Focus Ring Is Never Thinner Than 2px, and Never a Shadow Alone",
          description:
            "focus/width aliases stroke/2 and focus/offset aliases space/2. WCAG 2.4.11 wants a ring whose area is at least that of a 2px perimeter; Windows High Contrast discards box-shadow entirely, so a ring drawn only as a shadow vanishes exactly where it is needed most.",
          content: (
            <DoDont
              cards={[
                { type: "do", preview: <code>outline: var(--sa-focus-width) solid var(--sa-focus-ring); outline-offset: var(--sa-focus-offset)</code>, label: "A real outline. Survives forced-colors mode and reads at 2px." },
                { type: "do", preview: <code>border: var(--sa-stroke-1) solid var(--sa-border-neutral-subtle)</code>, label: "The hairline, bound. It follows the ladder if the ladder ever moves." },
                { type: "dont", preview: <code>border: 1px solid #ddd</code>, label: "Two literals: a width the ladder cannot find and a colour the brand cannot repaint." },
              ]}
            />
          ),
        },
      ]}
      tokens={rows}
      tokensIntro="Bind stroke/<N> for a rule or edge, control/border/width for a form control, and focus/width for the ring. The Tier-1 border/width ladder beneath them is private and named by size (none · sm · md · lg · xl) — a legacy the Tier-2 value-naming corrected."
      a11y={[
        {
          criterion: "2.4.11 Focus Appearance",
          level: "AA",
          description: "The focus indicator has at least the area of a 2px perimeter and 3:1 against adjacent colours.",
          status: "verified",
          evidence: "focus/width = stroke/2 and focus/ring is the solid brand key colour (colour audit 2026-09-04); tools/focus-ring/check.mjs fails any ring drawn only with box-shadow.",
        },
        {
          criterion: "1.4.11 Non-text Contrast",
          level: "AA",
          description: "A control's boundary meets 3:1 where the boundary is the only cue.",
          status: "verified",
          evidence: "border/neutral/bolder/default is rung 500 at 3.06:1 on white (forms.css, colour audit 2026-09-04); width alone is not the cue.",
        },
      ]}
      standards={[
        {
          clause: "UX4G 3.0 — border widths",
          says: "Named steps (hairline, thin, thick).",
          does: "Value-named stroke/0…4 plus two roles.",
          why: "A name that is the value can be checked against what renders; the UX4G names survive as the private Tier-1 ladder.",
        },
      ]}
      related={[
        { label: "Shape", href: "/design-system/foundations/shape", reason: "the corner radius the same edge takes" },
        { label: "Interaction States", href: "/design-system/foundations/states", reason: "the focus ring's colour and offset" },
        { label: "Color", href: "/design-system/foundations/color", reason: "border/* colours — the other half of every edge" },
      ]}
    />
  );
}
