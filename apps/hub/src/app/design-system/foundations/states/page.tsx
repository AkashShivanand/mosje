import * as React from "react";
import type { Metadata } from "next";

import "./states.css";
import { Callout, DoDont, FoundationDocPage } from "@/components/design-system/docs-kit/index";
import { FOUNDATIONS } from "@/lib/design-system/foundations-data.generated";

export const metadata: Metadata = {
  title: "Interaction States",
  description:
    "The seven states a control can be in — default, hover, active, focus, selected, disabled, visited — and for each one which colour rung, which motion pair, which opacity and which ring it binds, so every component answers a press the same way.",
};

/*
 * DS Audit: FoundationDocPage ✅ · Callout ✅ · DoDont ✅
 * A NEW page. States were documented only as a grammar slot and one colour-page section;
 * the estate had no single place saying what "hover" MEANS across colour, motion, opacity
 * and the ring. This is that place.
 */

const rows = FOUNDATIONS.states.tokens;
const focus = rows.filter((r) => r.path.startsWith("focus/"));
const overlay = rows.filter((r) => r.path.startsWith("overlay/"));

const ms = (intent: string): string => FOUNDATIONS.motion.tokens.find((r) => r.path === `motion/${intent}/duration`)?.value ?? "";
const STATES: { state: string; means: string; colour: string; motion: string; other: string }[] = [
  { state: "default", means: "At rest. The state every other one is measured against.", colour: "…/default — the resting rung of the role", motion: "—", other: "" },
  { state: "hover", means: "The pointer is over it. A promise that a press will do something.", colour: "bg one rung darker (primary 600 → 700); a wash of overlay/brand/hover on a brand fill", motion: `motion/hover — ${ms("hover")} decelerate on colour, border and shadow`, other: "Never the only cue: hover does not exist on touch." },
  { state: "active", means: "Being pressed, right now.", colour: "two rungs darker (800); overlay/brand/active on a brand fill", motion: `motion/press — ${ms("press")} emphasized on transform`, other: "Named active, not pressed: active is the grammar's state word." },
  { state: "focus", means: "Has keyboard focus. The one state WCAG makes non-optional.", colour: "focus/ring — the solid brand key colour", motion: "motion/focus — instant; a ring never fades in", other: "focus/width 2px, focus/offset 2px, drawn as an outline so forced-colors mode keeps it." },
  { state: "selected", means: "Chosen, and stays chosen — a tab, a row, a chip.", colour: "bg/brand/primary/bold with on/bg/brand/primary/bold ink", motion: "motion/hover for the fill, motion/expand if the selection grows", other: "Selected and focused are different states and can coincide." },
  { state: "disabled", means: "Present but not available. Says why elsewhere, never here.", colour: "text/neutral/disabled (opaque) for text; neutral fills, never a washed intent colour", motion: "motion/instant — nothing animates", other: "alpha/disabled for a whole control. Exempt from 1.4.3 and 1.4.11, so it is the only state allowed under AA." },
  { state: "visited", means: "A link the reader has already followed.", colour: "text/link/visited/default — primaryScale/800", motion: "—", other: "Links only. The one word that is both a variant and a state in the grammar." },
];

export default function StatesPage(): React.JSX.Element {
  return (
    <FoundationDocPage
      name="Interaction States"
      status="New"
      since="0.49.0"
      summary="A state is what a control is doing right now. SAMAVESH names seven, and each one has a defined answer in colour, motion, opacity and the focus ring, so a citizen learns the estate's behaviour once. Focus is the state the law makes non-optional; disabled is the only state allowed to fall below AA."
      figma={{ node: "color" }}
      glance={[
        { value: STATES.length, label: "states", note: "default · hover · active · focus · selected · disabled · visited" },
        { value: focus.length, label: "focus ring tokens", note: "colour · width · offset" },
        { value: overlay.length, label: "overlay washes", note: "scrim, hover, active" },
        { value: "2px", label: "ring width", note: "WCAG 2.4.11" },
        { value: ms("focus"), label: "ring delay", note: "motion/focus is instant" },
        { value: "1", label: "state below AA", note: "disabled — by WCAG's own exemption" },
      ]}
      sections={[
        {
          id: "matrix",
          keyword: "MATRIX",
          title: "Seven States, and Each One Has an Answer in Every Foundation",
          description:
            "Read a row to build a state. The colour column names the rung the grammar's state slot resolves to; the motion column names the pair; the last column carries the rule that most often gets missed.",
          content: (
            <div className="fdp__scroll">
              <table className="is-matrix">
                <thead>
                  <tr>
                    <th scope="col">State</th>
                    <th scope="col">Means</th>
                    <th scope="col">Colour</th>
                    <th scope="col">Motion</th>
                    <th scope="col">Also</th>
                  </tr>
                </thead>
                <tbody>
                  {STATES.map((s) => (
                    <tr key={s.state}>
                      <th scope="row">
                        <code>{s.state}</code>
                      </th>
                      <td>{s.means}</td>
                      <td>{s.colour}</td>
                      <td>{s.motion}</td>
                      <td>{s.other}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ),
        },
        {
          id: "specimen",
          keyword: "SPECIMEN",
          title: "The Same Control in Every State, Built Only From Tokens",
          description:
            "Hover, press and focus the live button; the other four are shown at rest. Every colour is a role, every transition a pair, and the ring is an outline — so what you see here is what every component in the estate does.",
          content: (
            <div className="is-specimens">
              <button type="button" className="is-btn">
                Live — hover, press, Tab to focus
              </button>
              <button type="button" className="is-btn is-btn--selected" aria-pressed="true">
                Selected
              </button>
              <button type="button" className="is-btn" disabled>
                Disabled
              </button>
              <a className="is-link is-link--visited" href="#specimen">
                Visited link
              </a>
            </div>
          ),
        },
        {
          id: "focus",
          keyword: "FOCUS",
          title: "The Ring Is Solid, 2px, Offset 2px, and Never Only a Shadow",
          description:
            "focus/ring is the solid brand key colour since 2026-09-04 — it was a 48% wash that flattened to 2.01:1 on white and failed 1.4.11. It is drawn with outline, because Windows High Contrast discards box-shadow and a ring drawn only as a shadow vanishes exactly where a keyboard user needs it.",
          content: (
            <>
              <ul>
                {focus.map((r) => (
                  <li key={r.path}>
                    <code>{r.css}</code> — {r.value}. {r.description}
                  </li>
                ))}
              </ul>
              <DoDont
                cards={[
                  { type: "do", preview: <code>:focus-visible {"{"} outline: var(--sa-focus-width) solid var(--sa-focus-ring); outline-offset: var(--sa-focus-offset); {"}"}</code>, label: "The ring, as every component draws it." },
                  { type: "dont", preview: <code>:focus {"{"} outline: none; box-shadow: 0 0 0 3px rgba(3,115,223,.4); {"}"}</code>, label: "Invisible in forced-colors mode, and 2.01:1 on white. tools/focus-ring/check.mjs fails it." },
                ]}
              />
            </>
          ),
        },
        {
          id: "disabled",
          keyword: "DISABLED",
          title: "Disabled Is the Only State Allowed Below AA, and It Is Still Legible",
          description:
            "WCAG exempts inactive controls from 1.4.3 and 1.4.11, and the estate uses that room carefully: disabled text is an opaque ink one rung darker than the wash it replaced, fills are neutral rather than a washed-out intent colour, and a whole control dims to alpha/disabled so its shape survives. The reason it is disabled is said in copy beside it, never inferred from grey.",
          content: (
            <>
              <ul>
                {overlay.map((r) => (
                  <li key={r.path}>
                    <code>{r.css}</code> — {r.description}
                  </li>
                ))}
              </ul>
              <Callout type="warning" title="Hover is not a cue">
                A state that only shows on hover does not exist on a phone. Selected, disabled and error must each be visible at rest —
                hover and active only confirm what is already true.
              </Callout>
            </>
          ),
        },
      ]}
      tokens={rows}
      tokensIntro="States are a SLOT in the colour grammar (<role>/<family>/…/<state>) rather than a token family of their own, so most state colours live on the Color page. The rows here are the cross-cutting ones: the focus ring, the overlay washes, and the two opacity intents."
      a11y={[
        {
          criterion: "2.4.7 Focus Visible",
          level: "AA",
          description: "Every focusable control shows the ring.",
          status: "verified",
          evidence: "focus/* bound in 112 outline rules; tools/focus-ring/check.mjs gates the 36 box-shadow rings (2026-09-04).",
        },
        {
          criterion: "2.4.11 Focus Appearance",
          level: "AA",
          description: "The ring has 2px-perimeter area and 3:1 against adjacent colours.",
          status: "verified",
          evidence: "focus/width = 2px; focus/ring is the solid key colour, 4.5:1 on white (colour audit 2026-09-04).",
        },
        {
          criterion: "1.4.1 Use of Color",
          level: "A",
          description: "No state is conveyed by colour alone.",
          status: "partial",
          evidence: "Selected carries aria-pressed / aria-selected in DS components; error carries an icon and text. No estate-wide gate.",
        },
        {
          criterion: "1.4.13 Content on Hover or Focus",
          level: "AA",
          description: "Hover-revealed content is dismissible, hoverable and persistent.",
          status: "untested",
        },
      ]}
      standards={[
        {
          clause: "UX4G 3.0 — Focus/Outline and Focus/Inverse",
          says: "A focus style modelled as its own object.",
          does: "focus/ring, focus/width, focus/offset as a group, not a role+state.",
          why: "Adopted as UX4G models it; the only change is the ring colour, which UX4G published at a translucency that fails 1.4.11 on white.",
        },
      ]}
      related={[
        { label: "Color", href: "/design-system/foundations/color", reason: "the state slot on every colour role" },
        { label: "Motion", href: "/design-system/foundations/motion", reason: "hover, press and focus pairs" },
        { label: "Opacity", href: "/design-system/foundations/opacity", reason: "alpha/disabled and alpha/muted" },
      ]}
    />
  );
}
