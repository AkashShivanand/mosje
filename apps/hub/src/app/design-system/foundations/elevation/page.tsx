import * as React from "react";
import type { Metadata } from "next";

import "./elevation.css";
import { Callout, DoDont, FoundationDocPage } from "@/components/design-system/docs-kit/index";
import { FOUNDATIONS } from "@/lib/design-system/foundations-data.generated";

export const metadata: Metadata = {
  title: "Elevation",
  description:
    "Six shadow roles that say what a surface is — flat, card, raised, dropdown, modal, toast — tinted toward the body ink and paired one-to-one with the layering ladder.",
};

/*
 * DS Audit: FoundationDocPage ✅ · Callout ✅ · DoDont ✅
 * Until 2026-09-04 this page documented three of the six roles, with values carrying an
 * ink the tokens had retired a month earlier, and labelled `card` as a pressed state and
 * `modal` as a dropdown. Every row below is read from the build.
 */

const rows = FOUNDATIONS.elevation.tokens;
const roles = rows.filter((r) => r.tier === "sys");
const ramp = rows.filter((r) => r.tier === "ref");
const layerFor: Record<string, string> = {
  flat: "z/base",
  card: "z/base",
  raised: "z/raised",
  dropdown: "z/dropdown",
  modal: "z/modal",
  toast: "z/toast",
};
const layers = (value: string | null): number => (!value || value === "none" ? 0 : value.split(/,(?![^(]*\))/).length);

export default function ElevationPage(): React.JSX.Element {
  return (
    <FoundationDocPage
      name="Elevation"
      status="Stable"
      since="0.49.0"
      summary="Elevation tells a reader what sits on top of what. SAMAVESH names six shadow roles by what the surface is, not by how deep the shadow looks, and tints every shadow toward the body ink so depth reads as depth rather than dirt on a light government page."
      figma={{ node: "elevation" }}
      glance={[
        { value: roles.length, label: "roles", note: "flat · card · raised · dropdown · modal · toast" },
        { value: ramp.length, label: "ramp steps", note: "none → xl, a superset of UX4G's l0–l4" },
        { value: "neutral/800", label: "shadow ink", note: "the body ink, retinted by the build" },
        { value: "18%", label: "heaviest alpha", note: "toast — arrives unannounced" },
        { value: "1:1", label: "with layering", note: "every role names its z rung" },
        { value: "effects", label: "in Figma", note: "effect styles, not variables" },
      ]}
      sections={[
        {
          id: "roles",
          keyword: "ROLES",
          title: "Six Roles, Chosen by What the Surface Is",
          description:
            "Pick by the surface's job, never by eye. Two dropdowns choosing different shadows is exactly the disagreement a role prevents. Each role also names the layer it sits on, because an elevated surface is a stacked one.",
          content: (
            <>
              <div className="el-grid">
                {roles.map((r) => {
                  const role = r.path.split("/")[1] ?? "";
                  return (
                    <div key={r.path} className="el-card" style={{ boxShadow: r.value === "none" ? undefined : (r.value ?? undefined) }}>
                      <span className="el-card__name">elevation/{role}</span>
                      <span className="el-card__meta">
                        {layers(r.value)} {layers(r.value) === 1 ? "layer" : "layers"} · {layerFor[role] ?? "z/base"}
                      </span>
                      <p className="el-card__use">{r.description}</p>
                    </div>
                  );
                })}
              </div>
              <Callout type="info" title="Flat is a decision, not an absence">
                Bind <code>elevation/flat</code> to reset an elevation something else applied — a card inside a modal, a table inside a
                card. Omitting the property leaves whatever cascaded in.
              </Callout>
            </>
          ),
        },
        {
          id: "ramp",
          keyword: "RAMP",
          title: "Higher Surfaces Cast Softer, Wider Shadows",
          description:
            "The Tier-1 ramp beneath the roles. As offset and blur grow, per-layer alpha falls — a surface far above the page throws a diffuse shadow, not a darker one. The exception is toast, which is heavier than modal because it has no scrim to do the suppressing.",
          content: (
            <div className="el-ramp">
              {ramp.map((r) => (
                <div key={r.path} className="el-ramp__row">
                  <div className="el-ramp__chip" style={{ boxShadow: r.value === "none" ? undefined : (r.value ?? undefined) }} aria-hidden="true" />
                  <div>
                    <code className="el-ramp__name">{r.css}</code>
                    <code className="el-ramp__value">{r.value}</code>
                  </div>
                </div>
              ))}
            </div>
          ),
        },
        {
          id: "ink",
          keyword: "INK",
          title: "One Ink, Derived, So the Shadow Follows the Brand",
          description:
            "Every layer's colour is neutral/800 — the body ink — at the layer's alpha. The build writes the RGB into the ramp from the brand's neutral ramp, so a brand pack that ships warmer greys gets warmer shadows without anyone editing a shadow.",
          content: (
            <>
              <p>
                The ramp is authored as DTCG composite shadows: each layer carries its own colour, offset, blur and spread, so the
                Figma effect-style writer and this page read the same object rather than parsing a CSS string. UX4G&rsquo;s ramp uses
                flat black; a black shadow on a white government page reads as a smudge, a tinted one as depth.
              </p>
              <DoDont
                cards={[
                  { type: "do", preview: <code>box-shadow: var(--sa-elevation-dropdown)</code>, label: "Bind the role. The menu gets the same shadow in every brand and at every density." },
                  { type: "dont", preview: <code>box-shadow: 0 4px 12px rgba(0,0,0,.15)</code>, label: "A literal shadow cannot follow the brand ink and will not match the menu beside it." },
                  { type: "dont", preview: <span className="el-text-shadow">Heading</span>, label: "Shadows are for surfaces. A text shadow fakes emphasis and fails the contrast measurement." },
                ]}
              />
            </>
          ),
        },
      ]}
      tokens={rows}
      tokensIntro="Bind a Tier-2 role — elevation/<role>. The Tier-1 ramp is shown so the alias can be checked. In Figma these are effect styles named after the roles, generated from the same source; there is no shadow variable because Figma models a shadow as a composite."
      a11y={[
        {
          criterion: "1.4.11 Non-text Contrast",
          level: "AA",
          description: "A shadow is never the only thing that identifies a surface's boundary.",
          status: "partial",
          evidence: "Every elevated component also carries a border or a fill step (card, dropdown, modal reviewed 2026-09-04); no gate asserts it for new components yet.",
        },
        {
          criterion: "1.4.1 Use of Color",
          level: "A",
          description: "Depth is not the only cue to stacking order.",
          status: "verified",
          evidence: "Modal and side sheet pair elevation with a scrim and focus containment; dropdowns are DOM-adjacent to their control.",
        },
      ]}
      standards={[
        {
          clause: "UX4G 3.0 — elevation l0–l4",
          says: "Five levels, flat black shadows.",
          does: "Six roles on a six-step ramp, tinted toward neutral/800.",
          why: "UX4G's five levels are all present (a superset); the tint is a quality decision because flat black reads as dirt on a light surface and the tint measures identically for boundary contrast.",
        },
      ]}
      related={[
        { label: "Layering", href: "/design-system/foundations/layering", reason: "the z rung each role names" },
        { label: "Color", href: "/design-system/foundations/color", reason: "layer/0–3 surfaces and the scrim that pairs with modal" },
        { label: "Motion", href: "/design-system/foundations/motion", reason: "a card that lifts on hover animates its shadow with the hover pair" },
      ]}
    />
  );
}
