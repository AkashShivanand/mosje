import * as React from "react";
import type { Metadata } from "next";

import "./opacity.css";
import { Callout, DoDont, FoundationDocPage } from "@/components/design-system/docs-kit/index";
import { FOUNDATIONS } from "@/lib/design-system/foundations-data.generated";

export const metadata: Metadata = {
  title: "Opacity",
  description:
    "One thirteen-step opacity ladder, two named intents, and the rule that a translucent colour is always a colour reference plus an alpha reference — never a baked hex.",
};

/*
 * DS Audit: FoundationDocPage ✅ · Callout ✅ · DoDont ✅
 * A NEW page. The ladder existed (alpha/0…100, rationalised 2026-09-04) but was documented
 * only inside the colour page's translucency sections; the two whole-element intents —
 * disabled and muted — are new, replacing 0.5, 0.45, 0.6 and 0.7 literals across the DS.
 */

const rows = FOUNDATIONS.opacity.tokens;
const ladder = rows.filter((r) => r.tier === "sys" && /^alpha\/\d+$/.test(r.path));
const intents = rows.filter((r) => r.tier === "sys" && /^alpha\/[a-z]+$/.test(r.path));
const blur = rows.filter((r) => r.path.startsWith("blur/"));

export default function OpacityPage(): React.JSX.Element {
  return (
    <FoundationDocPage
      name="Opacity"
      status="New"
      since="0.48.0"
      summary="Opacity in SAMAVESH is one ladder of thirteen steps and two intents that name the only whole-element opacities the estate uses. A translucent colour is never an opacity on its own: it is a colour reference plus an alpha reference, so the brand can move under it and Figma can bind both halves."
      figma={{ node: "color" }}
      glance={[
        { value: ladder.length, label: "ladder steps", note: "0 · 4 · 8 · 16 · 24 · 32 · 40 · 48 · 64 · 72 · 80 · 88 · 100" },
        { value: intents.length, label: "intents", note: "disabled · muted" },
        { value: blur.length, label: "blur steps", note: "the companion ladder" },
        { value: `${FOUNDATIONS.opacity.stats.figma}/${FOUNDATIONS.opacity.stats.total}`, label: "in Figma", note: "Static collection, COLOR_OPACITY scope" },
        { value: "136", label: "alias-plus-alpha bindings", note: "every translucent colour token" },
      ]}
      sections={[
        {
          id: "ladder",
          keyword: "LADDER",
          title: "Thirteen Steps, and the Name Is the Percentage",
          description:
            "alpha/48 is 48%. The steps are dense at the quiet end — 4, 8, 16 — where a hover wash or a hairline on a dark surface lives, and sparse above 64 where the only uses are inverse-button fills. Figma reads the same number bound to an opacity as a percentage, so the code value (0.48) and the Figma value (48) are one token.",
          content: (
            <div className="op-ladder" aria-label="Opacity ladder">
              {ladder.map((r) => (
                <div key={r.path} className="op-step">
                  <div className="op-step__chip" style={{ opacity: Number(r.value) }} aria-hidden="true" />
                  <code className="op-step__name">{r.path.split("/")[1]}</code>
                </div>
              ))}
            </div>
          ),
        },
        {
          id: "intents",
          keyword: "INTENTS",
          title: "Two Intents Name the Only Whole-Element Opacities",
          description:
            "Before these existed the DS carried 0.5, 0.45, 0.48, 0.6 and 0.7 as literals for the same two meanings. A disabled control dims to alpha/disabled; an enabled but de-emphasised element sits at alpha/muted. Nothing else on the estate should set a layer's opacity.",
          content: (
            <>
              <div className="op-intents">
                {intents.map((r) => (
                  <div key={r.path} className="op-intent">
                    <div className="op-intent__demo" style={{ opacity: Number(r.value) }}>
                      <span className="op-intent__chip">Apply</span>
                    </div>
                    <code>{r.css}</code>
                    <p>{r.description}</p>
                  </div>
                ))}
              </div>
              <Callout type="info" title="Disabled text is opaque, on purpose">
                Text alone never dims through opacity — <code>text/neutral/disabled</code> is an opaque ink one rung darker than
                the 48% wash it replaced, so it can be measured. <code>alpha/disabled</code> is for a whole control, where the
                shape must stay legible while the state is unmistakable.
              </Callout>
            </>
          ),
        },
        {
          id: "translucency",
          keyword: "TRANSLUCENCY",
          title: "A Translucent Colour Is a Reference Plus a Reference, Never a Hex",
          description:
            "The modal scrim is neutral/800 at alpha/48. The hover wash on a brand surface is white at alpha/8. Each is authored as a colour token plus an alpha token, and Figma stores it the same way — an alias with an opacity — so a brand change repaints the scrim and a ladder change re-weights every wash at once.",
          content: (
            <DoDont
              cards={[
                { type: "do", preview: <code>color/transparent/neutral/48 → neutralScale/800 @ alpha/48</code>, label: "Two references. Both halves follow their source." },
                { type: "dont", preview: <code>rgba(30, 33, 36, 0.48)</code>, label: "A baked value cannot follow the brand ink and cannot be found by the ladder." },
                { type: "dont", preview: <code>opacity: 0.6</code>, label: "A literal on a layer is one of two intents in disguise. Name it." },
              ]}
            />
          ),
        },
        {
          id: "blur",
          keyword: "BLUR",
          title: "Backdrop Blur Is Rare, and Four Steps Are Enough",
          description:
            "Blur is the companion ladder — 2, 4, 8, 16 — for a backdrop behind a scrim. On a government surface the scrim usually does the job alone; blur is reserved for a panel that must keep the page legible behind it.",
          content: (
            <ul>
              {blur.map((r) => (
                <li key={r.path}>
                  <code>{r.css}</code> — {r.value}. {r.description}
                </li>
              ))}
            </ul>
          ),
        },
      ]}
      tokens={rows}
      tokensIntro="Bind alpha/<step> as the OPACITY of a colour alias in Figma, or write var(--sa-alpha-<step>) in CSS. The Tier-1 opacity/* ladder beneath it is private. alpha/disabled and alpha/muted are the only two alpha tokens meant for a layer's own opacity."
      a11y={[
        {
          criterion: "1.4.3 Contrast (Minimum)",
          level: "AA",
          description: "No text is dimmed below AA by opacity.",
          status: "verified",
          evidence: "Disabled text is opaque (text/neutral/disabled, colour audit 2026-09-04); alpha/muted at 64% of the body ink on white measures above 4.5:1.",
        },
        {
          criterion: "1.4.11 Non-text Contrast",
          level: "AA",
          description: "A disabled control is exempt from the boundary requirement; an enabled one never dims below 3:1.",
          status: "partial",
          evidence: "alpha/disabled is bound only on :disabled / aria-disabled selectors (adopt-css pass, 2026-09-04); no gate yet asserts alpha/muted is never applied to an interactive element.",
        },
      ]}
      standards={[
        {
          clause: "UX4G 3.0 — opacity scale",
          says: "A ramp of named steps carried over from Bootstrap (25 · 50 · 75 · 100).",
          does: "Thirteen value-named steps, denser at the quiet end.",
          why: "UX4G's four steps are all present; the additional rungs are where hover washes, hairlines and scrims actually sit, and a step that is not on the ladder is a value nobody can find.",
        },
      ]}
      related={[
        { label: "Color", href: "/design-system/foundations/color", reason: "the translucency sections, and every color/transparent/* token" },
        { label: "Interaction States", href: "/design-system/foundations/states", reason: "where disabled and hover washes are applied" },
      ]}
    />
  );
}
