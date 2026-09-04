import * as React from "react";
import type { Metadata } from "next";

import "./spacing.css";
import { Callout, DoDont, FoundationDocPage } from "@/components/design-system/docs-kit/index";
import { FOUNDATIONS } from "@/lib/design-system/foundations-data.generated";

export const metadata: Metadata = {
  title: "Spacing",
  description:
    "The SAMAVESH spacing ladder — multiples of 8 with a 4px half-step below 24, value-named in four families, shared by every MoSJE site and portal.",
};

/*
 * DS Audit: FoundationDocPage ✅ · Callout ✅ · DoDont ✅
 * Until 2026-09-04 this page carried its own SCALE constant and a table that typed
 * "--sa-padding-<px>" beside a value it had also typed. Every number below is read from
 * foundations-data.generated.ts; the bars are drawn from each rung's own value.
 */

const rows = FOUNDATIONS.spacing.tokens;
const ref = rows.filter((r) => r.tier === "ref");
const sys = rows.filter((r) => r.tier === "sys");
const px = (v: string | null): number => Number((v ?? "0").replace("px", ""));
const family = (path: string): string => path.split("/")[0] ?? "";
const families = [...new Set(sys.map((r) => family(r.path)))];
const FAMILY_ROLE: Record<string, string> = {
  inline: "Horizontal gaps between items on one line.",
  stack: "Vertical gaps between stacked blocks, and vertical rhythm inside one.",
  padding: "Inset between a container's edge and its content.",
  section: "Vertical rhythm between page-level sections.",
};
const familyRows = (name: string) => sys.filter((r) => family(r.path) === name);
const range = (list: typeof sys): string => {
  const values = list.map((r) => px(r.value));
  return `${Math.min(...values)} … ${Math.max(...values)}`;
};
const halfSteps = ref.filter((r) => px(r.value) > 0 && px(r.value) % 8 !== 0);
const base = ref.find((r) => px(r.value) === 8);
const sixteen = sys.filter((r) => px(r.value) === 16);

export default function SpacingPage(): React.JSX.Element {
  return (
    <FoundationDocPage
      name="Spacing"
      status="Stable"
      since="0.48.0"
      summary="A consistent spacing rhythm is what makes an interface read as calm and trustworthy. SAMAVESH uses one shared ladder so every gap, inset and margin lines up across 13 websites and 20 portals. The rung is named for its pixel value, so padding/16 is sixteen pixels and there is nothing to look up."
      figma={{ node: "spacing" }}
      glance={[
        { value: ref.length, label: "rungs", note: `${ref[0]?.value} to ${ref[ref.length - 1]?.value}, value-named` },
        { value: families.length, label: "families", note: families.join(" · ") },
        { value: sys.length, label: "Tier-2 tokens", note: "what app code binds" },
        { value: base?.value ?? "—", label: "base unit", note: `${halfSteps.map((r) => r.value).join(", ")} sit between the multiples` },
        { value: `${FOUNDATIONS.spacing.stats.figma}/${FOUNDATIONS.spacing.stats.total}`, label: "in Figma", note: "Space collection, one mode" },
      ]}
      sections={[
        {
          id: "grid",
          keyword: "GRID",
          title: "Multiples of 8, With a 4px Half-Step Below 24",
          description:
            "Almost every rung is a multiple of eight. Below 24 the ladder also carries the half-steps a dense control needs — 4 for the tightest gap inside a chip, 2 and 6 for the cases between — and above 24 it does not, because at that size a half-step is a guess dressed as a decision. Working in fixed steps means nobody has to invent a number: reach for the next rung up or down.",
          content: (
            <>
              <div className="sp-ladder" aria-label="The spacing ladder, each rung drawn at its true pixel height">
                <div className="sp-ladder__bars">
                  {ref.map((r) => (
                    <div key={r.path} className="sp-bar">
                      {/* The ONE data-driven inline value on this page: the rung's resolved height. */}
                      <div className="sp-bar__fill" style={{ height: r.value ?? undefined }} aria-hidden="true" />
                      <span className="sp-bar__value">{px(r.value)}</span>
                    </div>
                  ))}
                </div>
              </div>
              <p>
                Each bar is rendered at its real pixel height, so the steps are shown literally to scale. The two outsized rungs
                at the top of the ladder exist for <code>padding</code> and <code>section</code> only, where a hero or a page-level
                band needs more air than any component does.
              </p>
              <DoDont
                cards={[
                  {
                    type: "do",
                    label: "Use spacing tokens for every gap, padding and margin so layouts stay on the 8px grid.",
                    preview: (
                      <div className="sp-dd">
                        <div className="sp-dd__bar sp-dd__bar--do" />
                        <div className="sp-dd__bar sp-dd__bar--do" />
                        <code>gap: var(--sa-stack-16)</code>
                      </div>
                    ),
                  },
                  {
                    type: "dont",
                    label: "Don't hardcode arbitrary pixel values like 13px or 27px — they break the grid and drift between screens.",
                    // ds-exempt(specimen): 13px and 11px are the POINT of this example — it is
                    // the "don't" half of a do/don't pair showing what falls off the 8px grid.
                    // Binding them to tokens would delete the thing being demonstrated.
                    preview: (
                      <div style={{ display: "flex", flexDirection: "column", gap: "13px", padding: "11px" }}>
                        <div className="sp-dd__bar sp-dd__bar--dont" />
                        <div className="sp-dd__bar sp-dd__bar--dont" />
                        <code>gap: 13px</code>
                      </div>
                    ),
                  },
                ]}
              />
            </>
          ),
        },
        {
          id: "families",
          keyword: "FAMILIES",
          title: "Four Families, One Ladder, and the Family Says the Direction",
          description:
            "The family says what the space is for; the number says how big it is. Every family carries the same rungs, so inline/16, stack/16, padding/16 and section/16 are all 16px. Reach past the family only when no role describes the gap — and never to --sa-ref-space-*, which is Tier 1, hidden from publishing, and refused by the token contract tests in application code.",
          content: (
            <div className="sp-families">
              {families.map((name) => {
                const list = familyRows(name);
                return (
                  <div key={name} className="sp-family">
                    <code className="sp-family__name">--sa-{name}-&lt;value&gt;</code>
                    <span className="sp-family__range">
                      {list.length} rungs · {range(list)}
                    </span>
                    <p className="sp-family__use">{FAMILY_ROLE[name] ?? list[0]?.description}</p>
                  </div>
                );
              })}
            </div>
          ),
        },
        {
          id: "naming",
          keyword: "NAMING",
          title: "The Name Is the Value",
          description: `Before 18 August 2026 the rungs carried T-shirt labels, and l meant 16 in inline, 24 in stack, 20 in padding and 56 in section — a collision inherited verbatim from UX4G 3.0. The rename made the label the value: ${sixteen.length} tokens are named 16 and every one of them is 16px.`,
          content: (
            <>
              <p>
                Two rules follow from value-naming, and <code>space-linkage.test.mjs</code> enforces both. A rung&rsquo;s name equals
                its resolved value — a <code>padding/16</code> that resolves to 20px fails the build. And no label carries two values
                across families, which is the defect the rename removed.
              </p>
              <p>
                The names are not coming back. A T-shirt ramp has no slot between adjacent rungs, so every insertion renames
                everything above it — which happened twice in a single day before the change. A value-named ladder takes a new step
                between any two without touching either.
              </p>
              <Callout type="info" title="UX4G conformance is unaffected">
                The <code>--ux4g-*</code> mapping is generated independently for the conformance measurement and never reads
                these names. It is a build output of <code>tools/ux4g-conformance/</code>, not something the estate ships or
                authors against.
              </Callout>
            </>
          ),
        },
        {
          id: "density",
          keyword: "DENSITY",
          title: "Mode-Varying Spacing Lives in Density, Never in the Ladder",
          description:
            "A value-name lies the moment a mode changes the value. Space has one mode. If a gap or an inset must differ between comfortable and compact, it is a density token with its own two modes, not a ladder rung — the single real trade-off of value-naming, mitigated by a boundary rather than by hope.",
          content: (
            <DoDont
              cards={[
                { type: "do", preview: <code>padding: var(--sa-density-control-padding-y) var(--sa-density-control-padding-x)</code>, label: "A control's inset changes with density, so it binds the density token." },
                { type: "dont", preview: <code>[data-density=&quot;compact&quot;] {"{"} --sa-padding-16: 12px; {"}"}</code>, label: "Re-pointing a ladder rung under a mode makes padding/16 mean 12px — the name stops being the value." },
              ]}
            />
          ),
        },
      ]}
      tokens={rows}
      tokensIntro="Bind a Tier-2 family token — inline/<value>, stack/<value>, padding/<value> or section/<value>. Tier 1 is the value-named ladder beneath, shown so the alias chain can be checked and banned in app code by the tier-discipline gate."
      a11y={[
        {
          criterion: "2.5.8 Target Size (Minimum)",
          level: "AA",
          description: "Adjacent targets are separated by at least target/spacing (0.5rem); the ladder's 8 rung is the same distance, so a gap bound to it satisfies the spacing exception.",
        },
        {
          criterion: "1.4.12 Text Spacing",
          level: "AA",
          description: "Layouts built on the ladder survive a reader raising line height to 1.5 and paragraph spacing to 2× without clipping.",
        },
        {
          criterion: "1.4.10 Reflow",
          level: "AA",
          description: "Insets on the ladder do not force two-dimensional scrolling at 320 CSS pixels.",
        },
      ]}
      standards={[
        {
          clause: "UX4G 3.0 §3 — semantic spacing roles",
          says: "Inline, Stack, Padding and Section, each on a T-shirt scale where L is 16 (inline), 24 (stack) and 20 (padding).",
          does: "The same four families, value-named: inline/16, stack/16, padding/16 and section/16 are all 16px, and every family carries the whole ladder.",
          why: "One label meaning four different sizes is a collision, and it reached the estate verbatim. The value-name removes it and lets a rung be inserted without renaming the ladder above it; the role UX4G's names carried is the family, which is kept. Recorded in .claude/rules/design-system.md (\"The spacing ladder is VALUE-NAMED\").",
        },
        {
          clause: "UX4G 3.0 §3 — base-4 scale, space-none to space-15",
          says: "Sixteen steps from 0 to 120px on a 4px rhythm with 2px fine steps.",
          does: `${ref.length} rungs: every UX4G step is a rung, and the ladder adds 72 and 360.`,
          why: "A superset. UX4G's scale is a floor, not a ceiling; nothing it publishes is missing, and the two additions are recorded in the token source beside the rung they extend.",
        },
      ]}
      related={[
        { label: "Density", href: "/design-system/foundations/density", reason: "where a gap that changes by mode belongs" },
        { label: "Shape", href: "/design-system/foundations/shape", reason: "the same value-naming rule on the radius ladder" },
        { label: "Layout Grid", href: "/design-system/foundations/layout-grid", reason: "the gutter and page margin the ladder supplies" },
      ]}
    />
  );
}
