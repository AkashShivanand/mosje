import * as React from "react";
import type { Metadata } from "next";

import "./shape.css";
import { Callout, DoDont, FoundationDocPage } from "@/components/design-system/docs-kit/index";
import { FOUNDATIONS } from "@/lib/design-system/foundations-data.generated";

export const metadata: Metadata = {
  title: "Shape",
  description:
    "The SAMAVESH corner-radius ladder — value-named rungs, one fully-rounded sentinel, and the role tokens a component binds instead of a rung.",
};

/*
 * DS Audit: FoundationDocPage ✅ · Callout ✅ · DoDont ✅
 * Until 2026-09-04 this page carried its own twelve-row LADDER constant and typed every
 * pixel value beside the token it documented. Every number below is read from
 * foundations-data.generated.ts; the specimens draw each rung from the row's own value.
 */

const rows = FOUNDATIONS.shape.tokens;
const ref = rows.filter((r) => r.tier === "ref");
const sys = rows.filter((r) => r.tier === "sys");
const rungs = sys.filter((r) => r.path.startsWith("shape/"));
const numeric = rungs.filter((r) => /^shape\/\d+$/.test(r.path));
const sentinels = rungs.filter((r) => !/^shape\/\d+$/.test(r.path));
const full = rungs.find((r) => r.path === "shape/full");
const control = rows.find((r) => r.path === "control/radius");
const roles = sys.filter((r) => !r.path.startsWith("shape/"));
const rung = (path: string): string => path.split("/")[1] ?? "";
const largestNumeric = numeric[numeric.length - 1];

export default function ShapePage(): React.JSX.Element {
  return (
    <FoundationDocPage
      name="Shape"
      status="Stable"
      since="0.49.0"
      summary="Every corner in the system comes from one ladder. A rung is named for its pixel value, so shape/8 is eight pixels and there is nothing to look up. What a rung is for is carried by its description and by the role tokens that resolve to it, which is what a component binds."
      figma={{ node: "shape" }}
      glance={[
        { value: ref.length, label: "rungs", note: `${ref[0]?.value} to ${largestNumeric?.value}, then full` },
        { value: sentinels.length, label: "sentinel", note: `${full?.path} · the only named rung` },
        { value: roles.length, label: "role token", note: `${control?.path} · what a control binds` },
        { value: control?.value ?? "—", label: "default control shape", note: `${control?.path} → ${control?.raw.slice(1, -1)}` },
        { value: `${FOUNDATIONS.shape.stats.figma}/${FOUNDATIONS.shape.stats.total}`, label: "in Figma", note: "Radius collection, one mode" },
      ]}
      sections={[
        {
          id: "ladder",
          keyword: "LADDER",
          title: "The Ladder Is Value-Named, and Full Is the Only Sentinel",
          description:
            "A radius token is a group and a number. shape/8 is 8px, permanently, and a new step can be added between any two without renaming anything above it. This is the convention the spacing ladder uses, on purpose: one rule across both means there is no second thing to learn.",
          content: (
            <>
              <div className="sh-ladder" aria-label="The radius ladder, each rung drawn at its own value">
                {ref.map((r) => (
                  <figure key={r.path} className="sh-rung">
                    {/* The ONE data-driven inline value on this page: the rung's resolved radius. */}
                    <div className="sh-rung__box" style={{ borderRadius: r.value ?? undefined }} aria-hidden="true" />
                    <figcaption className="sh-rung__cap">
                      <code className="sh-rung__name">shape/{rung(r.path)}</code>
                      <span className="sh-rung__value">{r.value}</span>
                    </figcaption>
                  </figure>
                ))}
              </div>
              <p>
                What a rung is <em>for</em> is not carried by its name. It is carried by the token&rsquo;s description, which a
                designer reads in the Figma picker and a developer reads in the Tokens tab, and by the component tokens that
                resolve to it. Roles live at Tier 3, which is exactly why the rungs themselves do not need role names.
              </p>
              <p>
                The rungs above <code>shape/24</code> are decorative and rarely correct in product UI. Reaching for{" "}
                <code>shape/32</code> or <code>shape/40</code> on a control or a card usually means the surface is the wrong size
                rather than the wrong shape.
              </p>
            </>
          ),
        },
        {
          id: "choosing",
          keyword: "CHOOSING",
          title: "Choose by What the Surface Is, and Take the Smaller Rung When Two Fit",
          description:
            "Two surfaces of the same kind must never disagree, and choosing by category is the reliable way to guarantee that. An over-rounded control reads as decorative; an over-rounded card reads as a toast.",
          content: (
            <>
              <ul>
                <li>
                  <strong>Controls</strong> — text-entry controls take <code>shape/6</code>. Everything else you press takes{" "}
                  <code>shape/8</code>, or better, <code>control/radius</code>.
                </li>
                <li>
                  <strong>Surfaces</strong> — a card or panel takes <code>shape/12</code>; a large container or modal takes{" "}
                  <code>shape/16</code>. The difference is whether it sits in the page or on top of it.
                </li>
                <li>
                  <strong>Small marks</strong> — chips, tags and inline badges take <code>shape/4</code>. Use <code>shape/2</code>{" "}
                  only where a visible curve would read as noise.
                </li>
                <li>
                  <strong>Flush</strong> — bind <code>shape/0</code>; do not leave the corner unset. An unbound zero cannot be told
                  apart from an oversight.
                </li>
              </ul>
              <Callout type="info" title="Each rung's own sentence is in the Tokens tab">
                The guidance above is the short form. The sentence beside each rung in the token table is the one Figma shows in
                the variable&rsquo;s description, generated from the same source, so the two surfaces cannot disagree.
              </Callout>
            </>
          ),
        },
        {
          id: "roles",
          keyword: "ROLES",
          title: "Prefer a Role Token Over a Rung",
          description:
            "If a component token exists for what you are drawing, bind that instead of a rung. A button that binds --sa-cmp-button-radius follows the system when controls are reshaped; one that binds --sa-shape-8 does not.",
          content: (
            <>
              <div className="sh-roles">
                {roles.map((r) => (
                  <div key={r.path} className="sh-role">
                    <code className="sh-role__name">{r.css}</code>
                    <span className="sh-role__alias">→ {r.raw.slice(1, -1)}</span>
                    <p className="sh-role__use">{r.description}</p>
                  </div>
                ))}
                <div className="sh-role">
                  <code className="sh-role__name">--sa-cmp-button-radius</code>
                  <span className="sh-role__alias">→ control/radius</span>
                  <p className="sh-role__use">A button. It follows control/radius rather than restating a rung.</p>
                </div>
                <div className="sh-role">
                  <code className="sh-role__name">--sa-cmp-card-radius</code>
                  <span className="sh-role__alias">→ shape/12</span>
                  <p className="sh-role__use">A card surface. Raised from 8px on 18 August 2026, when the token contradicted its own role.</p>
                </div>
              </div>
              <p>
                Never reach for <code>--sa-ref-radius-*</code>. That is Tier 1, hidden from publishing, and refused in application
                code by the token contract tests.
              </p>
              <DoDont
                cards={[
                  {
                    type: "do",
                    label:
                      "Bind the rung — or better, the component token. A literal that happens to equal a token is not the same as a binding.",
                    preview: (
                      <div className="sh-dd">
                        <div className="sh-dd__bar sh-dd__bar--do" />
                        <code>border-radius: var(--sa-cmp-button-radius)</code>
                      </div>
                    ),
                  },
                  {
                    type: "dont",
                    label:
                      "Don't type the number. 8px looks bound in any inspector that only shows the value, which is why this drifts unnoticed for a long time before anybody measures it.",
                    preview: (
                      <div className="sh-dd">
                        {/* ds-exempt-start(specimen): the raw 9px IS the demonstration — the "don't"
                            half of a do/don't pair showing an off-ladder, unbound radius. Binding it
                            would delete the thing being shown. */}
                        <div className="sh-dd__bar sh-dd__bar--dont" style={{ borderRadius: "9px" }} />
                        {/* ds-exempt-end */}
                        <code>border-radius: 9px</code>
                      </div>
                    ),
                  },
                ]}
              />
            </>
          ),
        },
        {
          id: "pills",
          keyword: "PILLS",
          title: "Pills and Circles Are Not the Same Shape",
          description: `${full?.css} resolves to ${full?.value}. That is a sentinel, not a measurement: any value exceeding half the shorter side renders fully rounded, and ${full?.value?.replace("px", "")} is that for every surface in the estate. There is no shape/${full?.value?.replace("px", "")} — naming the sentinel by its number would assert a precision it does not have.`,
          content: (
            <>
              <div className="sh-pills" aria-label="A wide box with shape/full beside the same box with a 50% radius">
                <figure className="sh-pill">
                  <div className="sh-pill__box sh-pill__box--full" aria-hidden="true" />
                  <figcaption className="sh-pill__cap">
                    <code>border-radius: var({full?.css})</code>
                    <span>A stadium at any size.</span>
                  </figcaption>
                </figure>
                <figure className="sh-pill">
                  <div className="sh-pill__box sh-pill__box--half" aria-hidden="true" />
                  <figcaption className="sh-pill__cap">
                    <code>border-radius: 50%</code>
                    <span>An ellipse on anything that is not square.</span>
                  </figcaption>
                </figure>
              </div>
              <p>
                <code>border-radius: 50%</code> is not a synonym. On a square box the two are identical; on any other box 50% gives
                an ellipse where <code>{full?.path}</code> gives a stadium. A 50% pill on a wide button is a defect, not a variant.
              </p>
            </>
          ),
        },
      ]}
      tokens={rows}
      tokensIntro="Bind a Tier-2 rung — shape/<value> — or the role token that resolves to one. Tier 1 is the value-named ladder beneath, shown so the alias chain can be checked and banned in app code by the tier-discipline gate. The full rung is the only non-numeric name at either tier; S7 in radius-linkage.test.mjs asserts it stays that way."
      a11y={[
        {
          criterion: "1.4.11 Non-text Contrast",
          level: "AA",
          description: "A rounded corner never removes the visible boundary a control depends on; the boundary is a stroke or a fill step, not the curve.",
        },
        {
          criterion: "2.5.8 Target Size (Minimum)",
          level: "AA",
          description: "A large radius clips the hit area at the corners. A fully rounded control still presents at least 24 by 24 CSS pixels inside the curve.",
        },
      ]}
      standards={[
        {
          clause: "UX4G 3.0 §3 — corner radius",
          says: "Five named sizes: None 0 · Small 4 · Medium 8 · Large 12 · Full.",
          does: `${numeric.length} value-named rungs plus the full sentinel. All four of UX4G's pixel values are rungs; the names are the values, and roles live in the description and at Tier 3.`,
          why: "A size name carries no role a number lacks — control/radius and the cmp radii already carry the role — and a T-shirt ramp has no slot between adjacent rungs, so every insertion renames everything above it. Value-naming is recorded in .claude/rules/design-system.md and matches the spacing ladder, so there is one rule to learn rather than two. UX4G's list is a floor: nothing it names is missing.",
        },
      ]}
      related={[
        { label: "Spacing", href: "/design-system/foundations/spacing", reason: "the same value-naming rule, on the ladder shape borrowed it from" },
        { label: "Stroke", href: "/design-system/foundations/stroke", reason: "the boundary that carries contrast when a corner does not" },
        { label: "Elevation", href: "/design-system/foundations/elevation", reason: "a card's shadow and its shape/12 corner arrive together" },
      ]}
    />
  );
}
