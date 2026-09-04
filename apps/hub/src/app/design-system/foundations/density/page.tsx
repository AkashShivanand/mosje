import * as React from "react";
import type { Metadata } from "next";

import "./density.css";
import { Callout, FoundationDocPage } from "@/components/design-system/docs-kit/index";
import { FOUNDATIONS } from "@/lib/design-system/foundations-data.generated";

export const metadata: Metadata = {
  title: "Density",
  description:
    "Comfortable and compact — the two density modes SAMAVESH ships, the eight tokens that move between them, and the 24px target floor compact never drops below.",
};

/*
 * DS Audit: FoundationDocPage ✅ · Callout ✅
 * Until 2026-09-04 this page typed all sixteen values it documented ("40px → 32px") in a
 * hand-written table. The comfortable values below are read from
 * foundations-data.generated.ts. The generator reads :root only, so the COMPACT column is
 * the one set of values this page still states by hand — from the `[data-density="compact"]`
 * block in tokens.css, which is also the Compact mode of the Figma Density collection.
 * The side-by-side demo does not read this map at all: the compact panel resolves the
 * tokens in the browser, so what it draws is what the build ships.
 */

const rows = FOUNDATIONS.density.tokens;
const sizing = FOUNDATIONS.sizing.tokens;
const targetMin = sizing.find((r) => r.path === "target/min");
const targetComfortable = sizing.find((r) => r.path === "target/comfortable");
const COMPACT: Record<string, string> = {
  "density/control/height": "32px",
  "density/control/padding/x": "12px",
  "density/control/padding/y": "6px",
  "density/control/gap": "6px",
  "density/row/height": "36px",
  "density/row/padding/x": "12px",
  "density/row/padding/y": "8px",
  "density/section/gap": "16px",
};
const px = (v: string | null | undefined): number => Number((v ?? "0").replace("px", ""));
const controlHeight = rows.find((r) => r.path === "density/control/height");
const rowHeight = rows.find((r) => r.path === "density/row/height");
// Target tokens are authored in rem; 16px is the root size the estate designs at.
const remToPx = (v: string | null | undefined): number => Number((v ?? "0").replace("rem", "")) * 16;

function DemoControls(): React.JSX.Element {
  return (
    <div className="de-controls">
      <button type="button" className="de-button">
        Submit
      </button>
      <input type="text" readOnly defaultValue="Sample input" className="de-input" aria-label="Sample input" />
      <select defaultValue="one" className="de-select" aria-label="Sample select">
        <option value="one">Option one</option>
        <option value="two">Option two</option>
      </select>
      <ul className="de-rows" aria-label="Sample rows">
        <li className="de-row">Row one</li>
        <li className="de-row">Row two</li>
      </ul>
    </div>
  );
}

export default function DensityPage(): React.JSX.Element {
  return (
    <FoundationDocPage
      name="Density"
      status="Stable"
      since="0.48.0"
      summary="Density controls how tall interactive elements are and how tightly rows and sections sit. SAMAVESH ships two modes: comfortable for everyday public use and compact for screens that must show a great deal of data at once. Eight tokens move between the modes; type, icons, radius and colour do not."
      figma={{ node: "density" }}
      glance={[
        { value: 2, label: "modes", note: "comfortable · compact" },
        { value: rows.length, label: "values that vary", note: "type, icon, radius and colour do not" },
        { value: `${controlHeight?.value} → ${COMPACT["density/control/height"]}`, label: "control height", note: "the axis a reader notices first" },
        { value: `${remToPx(targetMin?.value)}px`, label: "target floor", note: `${targetMin?.path} · WCAG 2.5.8, never crossed` },
        { value: `${FOUNDATIONS.density.stats.figma}/${FOUNDATIONS.density.stats.total}`, label: "in Figma", note: "Density collection, two modes" },
      ]}
      sections={[
        {
          id: "modes",
          keyword: "MODES",
          title: `Two Modes, and Compact Never Drops Below the ${remToPx(targetMin?.value)}px Target`,
          description: `WCAG 2.2 asks that a target be at least 24 by 24 CSS pixels — success criterion 2.5.8, Target Size (Minimum), level AA — and the estate carries that floor as ${targetMin?.path}. A comfortable control is ${controlHeight?.value} high and a compact one ${COMPACT["density/control/height"]}, so both modes clear it, compact with less room to spare. The 44px often quoted as a minimum is 2.5.5, Target Size (Enhanced), level AAA (${targetComfortable?.path}); neither mode reaches it and this estate does not claim it.`,
          content: (
            <>
              <div className="de-demo">
                <div className="de-panel">
                  <p className="de-panel__title">
                    Comfortable <span className="de-panel__meta">· {controlHeight?.value}</span>
                  </p>
                  <DemoControls />
                </div>
                <div className="de-panel" data-density="compact">
                  <p className="de-panel__title">
                    Compact <span className="de-panel__meta">· {COMPACT["density/control/height"]}</span>
                  </p>
                  <DemoControls />
                </div>
              </div>
              <div className="fdp__scroll">
                <table className="de-table">
                  <caption className="de-table__caption">The eight values, comfortable then compact. The compact column is the Compact mode of the Density collection.</caption>
                  <thead>
                    <tr>
                      <th scope="col">Token</th>
                      <th scope="col">Comfortable</th>
                      <th scope="col">Compact</th>
                      <th scope="col">Change</th>
                    </tr>
                  </thead>
                  <tbody>
                    {rows.map((r) => {
                      const from = px(r.value);
                      const to = px(COMPACT[r.path]);
                      const pct = from ? Math.round(((from - to) / from) * 100) : 0;
                      return (
                        <tr key={r.path}>
                          <td>
                            <code>{r.css}</code>
                          </td>
                          <td className="de-table__num">{r.value}</td>
                          <td className="de-table__num">{COMPACT[r.path] ?? "—"}</td>
                          <td className="de-table__num">−{pct}%</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
              <Callout type="info" title="Height is only one axis">
                A control {COMPACT["density/control/height"]} high can still fail 2.5.8 on its width, and none of the density tokens
                sets a width. That stays the component&rsquo;s own responsibility.
              </Callout>
            </>
          ),
        },
        {
          id: "when",
          keyword: "WHEN",
          title: "When Compact Is Right, and When It Is Not",
          description:
            "Compact is a tighter layout, not a smaller design. It earns its place where a trained reader scans many rows repeatedly; it costs its place wherever a citizen is reaching for a control on a phone.",
          content: (
            <div className="de-when">
              <div className="de-when__col">
                <h3>Use compact for</h3>
                <ul>
                  <li>Data-dense portals — for example the PM-AJAY MIS dashboard.</li>
                  <li>Tables with many rows where vertical space is at a premium.</li>
                  <li>Expert tools used repeatedly by trained staff who value scanning speed.</li>
                </ul>
              </div>
              <div className="de-when__col">
                <h3>Stay comfortable for</h3>
                <ul>
                  <li>Public-facing forms, where larger targets reduce errors.</li>
                  <li>Mobile, where fingers need larger touch targets.</li>
                  <li>Accessibility-critical flows, where the extra reach matters most.</li>
                </ul>
              </div>
            </div>
          ),
        },
        {
          id: "activate",
          keyword: "ACTIVATE",
          title: "Activate It on a Subtree With data-density",
          description:
            "Set data-density=\"compact\" on any wrapper element. Every SAMAVESH control inside that wrapper picks up the compact values automatically, with no per-component change — the demo above is two copies of the same markup under two wrappers.",
          content: (
            <>
              <pre className="de-code">
                <code>{`<section data-density="compact">\n  <DataTable … />\n</section>`}</code>
              </pre>
              <p>
                The mode is a subtree, not a page: a dense table can sit compact inside a comfortable form. A component that binds
                the density tokens needs nothing else; one that types a height opts out of the axis entirely, which is the defect
                the tokens exist to prevent.
              </p>
            </>
          ),
        },
      ]}
      tokens={rows}
      tokensIntro={
        'All eight are Tier 2 with no Tier-1 ladder beneath them — a density value is a decision about a mode, not an alias of a rung. The value shown is the comfortable mode, which is what :root resolves; the compact mode is the [data-density="compact"] block in tokens.css and the second mode of the Density collection in Figma.'
      }
      a11y={[
        {
          criterion: "2.5.8 Target Size (Minimum)",
          level: "AA",
          description: "Every control height in either mode is at least 24 CSS pixels.",
          status: "verified",
          evidence: `Compact control height ${COMPACT["density/control/height"]} and compact row height ${COMPACT["density/row/height"]} (tokens.css, [data-density="compact"]) both exceed target/min (${targetMin?.css}, ${targetMin?.value}); comfortable is ${controlHeight?.value} and ${rowHeight?.value}. Height only — width is the component's, per the note above.`,
        },
        {
          criterion: "2.5.5 Target Size (Enhanced)",
          level: "AAA",
          description: "Targets are at least 44 by 44 CSS pixels.",
          status: "partial",
          evidence: `Not claimed. Comfortable control height ${controlHeight?.value} sits below target/comfortable (${targetComfortable?.css}, ${targetComfortable?.value}); components that must meet it bind that token directly rather than the density axis.`,
        },
        {
          criterion: "1.4.4 Resize Text",
          level: "AA",
          description: "A compact control still holds its label at 200% zoom without clipping.",
        },
      ]}
      standards={[
        {
          clause: "UX4G 3.0 §6 — 44×44px targets",
          says: "Interactive targets of 44 by 44 pixels.",
          does: `Control heights of ${controlHeight?.value} (comfortable) and ${COMPACT["density/control/height"]} (compact). The 44px floor is carried by target/comfortable and bound by components where a citizen taps on the move.`,
          why: "WCAG 2.2 AA (2.5.8, 24px) is the binding floor and both modes clear it. Density is a height axis for administrative screens read by trained staff at a desk; public forms stay comfortable, and a primary touch action binds target/comfortable regardless of mode. Recorded here rather than silently under-shooting the guideline.",
        },
      ]}
      related={[
        { label: "Sizing", href: "/design-system/foundations/sizing", reason: "the target/* floors the density values are measured against" },
        { label: "Spacing", href: "/design-system/foundations/spacing", reason: "the ladder a density value must never re-point" },
        { label: "Layout Grid", href: "/design-system/foundations/layout-grid", reason: "the container a compact table still sits inside" },
      ]}
    />
  );
}
