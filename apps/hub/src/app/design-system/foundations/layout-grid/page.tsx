import * as React from "react";
import type { Metadata } from "next";

import "./layout-grid.css";
import { Callout, DoDont, FoundationDocPage } from "@/components/design-system/docs-kit/index";
import { FOUNDATIONS } from "@/lib/design-system/foundations-data.generated";

export const metadata: Metadata = {
  title: "Layout Grid",
  description:
    "The SAMAVESH page container — twelve columns, a 24px gutter, a three-step cap and a margin ladder that steps with the cap, so content width only ever grows.",
};

/*
 * DS Audit: FoundationDocPage ✅ · Callout ✅ · DoDont ✅
 * Every number on this page is the shipped value, read from foundations-data.generated.ts:
 * the cap rungs from container/content | contentXl | contentWide, the margin rungs from
 * grid/margin/mobile | tablet | desktop, the columns and gutter from grid/*. The viewport
 * anchors are named in passing only — they have their own page at /foundations/breakpoints.
 *
 * LADDER below mirrors the media queries in packages/design-system/foundations/layout.css
 * by token PATH, never by value, so a rung moving in the build moves here without an edit.
 */

const all = FOUNDATIONS.breakpoints.tokens;
const rows = all.filter((r) => !r.path.startsWith("breakpoint/"));
const px = (v: string | null | undefined): number => Number((v ?? "0").replace("px", ""));
const value = (path: string): string => all.find((r) => r.path === path)?.value ?? "—";
const n = (path: string): number => px(all.find((r) => r.path === path)?.value);
const margins = rows.filter((r) => /^grid\/margin\/(mobile|tablet|desktop)$/.test(r.path));
const columns = rows.find((r) => r.path === "grid/columns");
const gutter = rows.find((r) => r.path === "grid/gutter");
const viewport = rows.filter((r) => r.figma?.startsWith("Viewport"));

const LADDER: { mode: string; from: string | null; cap: string; margin: string }[] = [
  { mode: "Mobile", from: "breakpoint/mobile", cap: "container/content", margin: "grid/margin/mobile" },
  { mode: "Tablet", from: "breakpoint/tablet", cap: "container/content", margin: "grid/margin/tablet" },
  { mode: "Laptop", from: "breakpoint/laptop", cap: "container/content", margin: "grid/margin/tablet" },
  { mode: "Desktop", from: "breakpoint/desktop", cap: "container/content", margin: "grid/margin/tablet" },
  { mode: "Desktop XL", from: "breakpoint/desktopXl", cap: "container/contentXl", margin: "grid/margin/tablet" },
  { mode: "Desktop Wide", from: "breakpoint/desktopWide", cap: "container/contentWide", margin: "grid/margin/desktop" },
];
const ladder = LADDER.map((r) => {
  const anchor = r.from ? n(r.from) : 0;
  const cap = n(r.cap);
  const margin = n(r.margin);
  // The cap binds once the viewport can hold the cap plus both margins; below that the viewport binds.
  const capBinds = anchor >= cap + 2 * margin;
  const content = capBinds ? cap - 2 * margin : anchor - 2 * margin;
  return { ...r, anchor, cap, margin, capBinds, content };
});
const bound = ladder.filter((r) => r.capBinds);
const contents = [...new Set(bound.map((r) => r.content))];
const capSteps = [...new Set(ladder.map((r) => r.cap))];
const [cap1 = 0, cap2 = 0, cap3 = 0] = capSteps;
const desktopMode = ladder.find((r) => r.mode === "Desktop");
const firstXl = ladder.find((r) => r.cap === cap2);
const firstWide = ladder.find((r) => r.cap === cap3);
const pct = (part: number, whole: number): string => `${((part / whole) * 100).toFixed(2)}%`;

export default function LayoutGridPage(): React.JSX.Element {
  return (
    <FoundationDocPage
      name="Layout Grid"
      status="New"
      since="0.49.0"
      summary="One centred column, capped in three steps, with a side margin that steps with the cap rather than with the viewport. Everything on a SAMAVESH page sits inside it, and the class that applies it is .sa-container — content width is never a restated number."
      // The Figma page is "Layout Grid" (2140:295915). FIGMA_NODES registers it under the key
      // `spacing`, because that page has carried both the Space collection and the grid since
      // the library was imported; the key names the page's first occupant, not this foundation.
      figma={{ node: "layout" }}
      glance={[
        { value: capSteps.length, label: "cap steps", note: capSteps.join(" → ") },
        { value: margins.length, label: "margin rungs", note: margins.map((m) => px(m.value)).join(" / ") },
        { value: contents.join(" → "), label: "content width", note: "only ever grows" },
        { value: columns?.value ?? "—", label: "columns", note: `${gutter?.value} gutter` },
        { value: `${rows.filter((r) => r.figma).length}/${rows.length}`, label: "in Figma", note: `${viewport.length} carry a mode per viewport` },
      ]}
      sections={[
        {
          id: "rule",
          keyword: "RULE",
          title: "Content Width Is .sa-container, Never a Restated Number",
          description:
            ".sa-container caps the element and pads inside it. The cap is a ceiling; the margin is a floor that keeps content off the edge on any viewport narrower than the cap. Bind to the class and add no horizontal padding of your own — it owns the cap and the responsive margin together.",
          content: (
            <>
              <pre className="lg-formula">
                <code>content = min(cap, viewport) − 2 × margin</code>
              </pre>
              <DoDont
                cards={[
                  {
                    type: "do",
                    label: "Wrap section content in .sa-container and let it own both the cap and the margin.",
                    preview: <code>{`<div className="sa-container">…</div>`}</code>,
                  },
                  {
                    type: "dont",
                    label: "Add your own horizontal padding. The container already reserves the margin, and a second one double-insets the column.",
                    preview: <code>{`<div className="sa-container px-6">…</div>`}</code>,
                  },
                  {
                    type: "dont",
                    label: "Restate a width as a literal. It cannot follow the ladder, and it is how the estate came to run four different caps at once.",
                    // ds-exempt(code-sample): the 1280px is the literal being refused — the "don't"
                    // half of a do/don't trio, shown as the markup a reader must not write.
                    preview: <code>{`<div className="mx-auto max-w-[1280px]">…</div>`}</code>,
                  },
                ]}
              />
              <p>
                Where a media query is unavailable — an inline style, which is how <code>SiteHeader</code> caps its own column —
                bind <code>--sa-container-page</code> directly. It is the resolved cap at the
                current window size; the three rungs beneath it are fixed at every size and are not what a page skeleton binds.
              </p>
            </>
          ),
        },
        {
          id: "ladder",
          keyword: "LADDER",
          title: `A Three-Step Cap: ${cap1}, Then ${cap2} From ${firstXl?.anchor}, Then ${cap3} From ${firstWide?.anchor}`,
          description: `Below ${bound[0]?.anchor} the viewport binds and content is fluid. From ${bound[0]?.anchor} up the cap binds and content takes one of ${contents.length} fixed widths. The cap stops at ${cap3}: past that a twelve-column grid costs more in eye travel than it returns in density, and the line lengths inside it stop being scannable.`,
          content: (
            <>
              <div className="lg-viz" aria-label="Each viewport mode drawn to scale: the space outside the cap, the two margins and the content column">
                {ladder.map((r) => {
                  const outside = r.capBinds ? (r.anchor - r.cap) / 2 : 0;
                  return (
                    <div key={r.mode} className="lg-viz__row">
                      <span className="lg-viz__mode">{r.mode}</span>
                      {/* Segment widths are the token values as a share of the anchor — data-driven, nothing typed. */}
                      <div className="lg-viz__track" aria-hidden="true">
                        {outside > 0 ? <span className="lg-viz__seg lg-viz__seg--outside" style={{ width: pct(outside, r.anchor) }} /> : null}
                        <span className="lg-viz__seg lg-viz__seg--margin" style={{ width: pct(r.margin, r.anchor) }} />
                        <span className="lg-viz__seg lg-viz__seg--content" style={{ width: pct(r.content, r.anchor) }} />
                        <span className="lg-viz__seg lg-viz__seg--margin" style={{ width: pct(r.margin, r.anchor) }} />
                        {outside > 0 ? <span className="lg-viz__seg lg-viz__seg--outside" style={{ width: pct(outside, r.anchor) }} /> : null}
                      </div>
                      <span className="lg-viz__content">{r.capBinds ? r.content : "fluid"}</span>
                    </div>
                  );
                })}
              </div>
              <div className="fdp__scroll">
                <table className="lg-table">
                  <thead>
                    <tr>
                      <th scope="col">Viewport mode</th>
                      <th scope="col">Engages at</th>
                      <th scope="col">Cap</th>
                      <th scope="col">Margin</th>
                      <th scope="col">Content</th>
                    </tr>
                  </thead>
                  <tbody>
                    {ladder.map((r) => (
                      <tr key={r.mode}>
                        <td>{r.mode}</td>
                        <td className="lg-table__num">{r.mode === "Mobile" ? "—" : r.anchor}</td>
                        <td className="lg-table__num">
                          {r.cap} <code>{r.cap === cap1 ? "content" : r.cap === cap2 ? "contentXl" : "contentWide"}</code>
                        </td>
                        <td className="lg-table__num">{r.margin}</td>
                        <td className="lg-table__num">
                          <strong>{r.capBinds ? r.content : "fluid"}</strong>
                          {r.capBinds ? null : <span className="lg-table__note"> (viewport binds)</span>}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p>
                The anchors — {ladder.map((r) => r.anchor).join(" · ")} — are the estate&rsquo;s own, and each was set by measuring
                the page rather than by citing a ladder. They have their own foundation page; this one documents what the cap and
                the margin do at each of them.
              </p>
            </>
          ),
        },
        {
          id: "margin",
          keyword: "MARGIN",
          title: "Why the Margin Steps With the Cap, Not the Viewport",
          description: `The cap steps at ${firstXl?.anchor} and ${firstWide?.anchor}; the margin steps at ${ladder[1]?.anchor} and ${firstWide?.anchor}. That mismatch is deliberate, and it is the part most likely to look like a mistake.`,
          content: (
            <>
              <p>
                A wider margin buys breathing room only while the container is still fluid. Once the cap binds, the margin stops
                being air and starts being a tax on content. Stepping it at the desktop anchor did exactly that: crossing{" "}
                {desktopMode?.anchor} the cap was already {cap1}, so content went{" "}
                <strong>
                  {cap1 - 2 * (desktopMode?.margin ?? 0)}&nbsp;→&nbsp;{cap1 - 2 * n("grid/margin/desktop")}
                </strong>{" "}
                — narrower as the screen grew.
              </p>
              <p>
                Holding {value("grid/margin/tablet")} through Desktop&nbsp;XL is also what makes content there exactly{" "}
                <strong>{firstXl?.content}px</strong>, the width the Figma Handoff frame draws at {firstXl?.anchor}. Taking{" "}
                {value("grid/margin/desktop")} there would give {cap2 - 2 * n("grid/margin/desktop")} and miss it.
              </p>
              <p>
                The step at {ladder[1]?.anchor} is different in kind: the container is fluid there, so the margin is real breathing
                room rather than a tax on a fixed column. The result is monotonic — content only ever grows:{" "}
                <strong>{contents.join(" → ")}</strong>.
              </p>
            </>
          ),
        },
        {
          id: "columns",
          keyword: "COLUMNS",
          title: `${columns?.value === "12" ? "Twelve" : columns?.value} Columns and a ${gutter?.value} Gutter, Because 12 Divides by 2, 3, 4 and 6`,
          description: `${columns?.description ?? ""} ${gutter?.description ?? ""}`,
          content: (
            <>
              <div className="lg-cols" aria-label={`${columns?.value} columns separated by the gutter`}>
                {Array.from({ length: Number(columns?.value ?? 12) }, (_, i) => (
                  <span key={i} className="lg-cols__col" />
                ))}
              </div>
              <p>
                The gutter is the gap <em>between</em> columns and is bound as the layout grid&rsquo;s <code>gap</code>; Bootstrap
                applies half either side of each column, and an implementation is free to split it the same way so long as the
                distance between two columns stays <code>{gutter?.css}</code>.
              </p>
            </>
          ),
        },
        {
          id: "figma",
          keyword: "FIGMA",
          title: "The Viewport Collection Carries the Resolved Cap",
          description:
            "The Viewport collection carries six modes — Mobile, Tablet, Laptop, Desktop, Desktop XL, Desktop Wide — and both container/page and grid/margin/page resolve per mode. Switching a frame's Viewport mode moves the cap and the margin together, so the column in the file matches the column in the build without anyone transcribing a media query.",
          content: (
            <>
              <ul>
                {viewport.map((r) => (
                  <li key={r.path}>
                    <code>{r.figma}</code> — the resolved value of <code>{r.css}</code>; mobile-first base {r.value}, aliasing{" "}
                    <code>{r.raw.slice(1, -1)}</code>.
                  </li>
                ))}
              </ul>
              <Callout type="info" title="This was previously impossible to represent">
                The CSS derived the cap inside a media query, and a Figma variable cannot express one, so the page cap was the
                single layout value the library could not carry. The mode per viewport is the half Figma can hold; the media
                query in <code>foundations/layout.css</code> is the other half of the same ladder.
              </Callout>
            </>
          ),
        },
      ]}
      tokens={rows}
      tokensIntro="Bind container/page and grid/margin/page — the two that resolve per viewport — or, more usually, the .sa-container class that binds them for you. The rungs beneath (content, contentXl, contentWide; margin/mobile, tablet, desktop) are fixed at every window size and are shown so the ladder can be checked. The six viewport anchors are documented on the Breakpoints page."
      a11y={[
        {
          criterion: "1.4.10 Reflow",
          level: "AA",
          description: "Content reflows to 320 CSS pixels without two-dimensional scrolling.",
          status: "partial",
          evidence: `.sa-container is fluid below the cap with a ${value("grid/margin/mobile")} margin floor (foundations/layout.css); page-by-page reflow at 320px is not yet audited.`,
        },
        {
          criterion: "1.4.8 Visual Presentation",
          level: "AAA",
          description: "A run of body text is no wider than 80 characters.",
          status: "partial",
          evidence: `container/measure (${value("container/measure")}, about 68 characters of Noto Sans at 16px) exists and .ds-prose binds it; not every prose container in the estate does yet.`,
        },
        {
          criterion: "1.3.2 Meaningful Sequence",
          level: "A",
          description: "A twelve-column layout reads in DOM order when it collapses to one column.",
        },
      ]}
      standards={[
        {
          clause: "UX4G 3.0 §3 — Grid and layout",
          says: "A 12-column responsive grid, adapting mobile → desktop XL; max content width 1200px desktop, 1320px desktop XL. No breakpoints are published.",
          does: `Twelve columns and the ${gutter?.value} gutter as published. Both UX4G caps adopted as the first two steps, then a third at ${cap3} from ${firstWide?.anchor}; the anchors at which each engages are the estate's own.`,
          why: "UX4G fixes neither where its caps engage nor a third step, so both are the estate's decisions, each set by measuring the page: two steps left a 2560-wide monitor rendering a 1320 column between 620px margins. Recorded as divergence #6 in docs/guidelines/README.md; the anchors' own derivation is on the Breakpoints page.",
        },
        {
          clause: "UX4G 3.0 §3 — page margin",
          says: "No page-margin ladder is published.",
          does: `Three margin rungs — ${margins.map((m) => px(m.value)).join(" / ")} — stepping with the cap rather than with the viewport.`,
          why: "Where UX4G is silent the estate adds. Stepping the margin at the desktop anchor made content narrower as the screen grew; stepping it with the cap keeps content monotonic and lands Desktop XL on the width the Handoff frame draws.",
        },
      ]}
      related={[
        { label: "Breakpoints", href: "/design-system/foundations/breakpoints", reason: "the six viewport anchors and why each sits where it does" },
        { label: "Spacing", href: "/design-system/foundations/spacing", reason: "the ladder the gutter and margins are drawn from" },
        { label: "Typography", href: "/design-system/foundations/typography", reason: "the measure that keeps body text readable inside a wide column" },
      ]}
    />
  );
}
