import * as React from "react";
import type { Metadata } from "next";

import "./breakpoints.css";
import { Callout, DoDont, FoundationDocPage } from "@/components/design-system/docs-kit/index";
import { FOUNDATIONS } from "@/lib/design-system/foundations-data.generated";

export const metadata: Metadata = {
  title: "Breakpoints",
  description:
    "Six viewport anchors — 360 · 768 · 1024 · 1280 · 1440 · 1920 — what each one selects, why a media query cannot read a token, and how Figma's Viewport collection carries the resolved cap and margin.",
};

/*
 * DS Audit: FoundationDocPage ✅ · Callout ✅ · DoDont ✅
 * A NEW page. The anchors existed as Tier-1 tokens and were documented only inside the
 * Layout Grid page, where nobody searching for "breakpoints" found them.
 */

const rows = FOUNDATIONS.breakpoints.tokens;
const anchors = rows.filter((r) => r.path.startsWith("breakpoint/"));
const order = ["mobile", "tablet", "laptop", "desktop", "desktopXl", "desktopWide"];
const sorted = order.map((k) => anchors.find((a) => a.path === `breakpoint/${k}`)).filter((r): r is NonNullable<typeof r> => Boolean(r));
const px = (v: string | null) => Number((v ?? "0").replace("px", ""));
const maxPx = Math.max(...sorted.map((a) => px(a.value)));
const seg = (path: string, i: number): string => path.split("/")[i] ?? "";
const LABEL: Record<string, string> = { mobile: "Mobile", tablet: "Tablet", laptop: "Laptop", desktop: "Desktop", desktopXl: "Desktop XL", desktopWide: "Desktop Wide" };
const SELECTS: Record<string, { cap: string; margin: string }> = {
  mobile: { cap: "fluid", margin: "16" },
  tablet: { cap: "fluid", margin: "24" },
  laptop: { cap: "fluid", margin: "24" },
  desktop: { cap: "1200", margin: "24" },
  desktopXl: { cap: "1320", margin: "24" },
  desktopWide: { cap: "1440", margin: "32" },
};

export default function BreakpointsPage(): React.JSX.Element {
  return (
    <FoundationDocPage
      name="Breakpoints"
      status="New"
      since="0.49.0"
      summary="A breakpoint is a viewport width at which the layout changes. SAMAVESH has six, and they are anchors rather than a grid of their own: each one selects a content cap and a page margin. Every page is built for the narrowest first and gains columns above it."
      figma={{ node: "layout" }}
      glance={[
        { value: sorted.length, label: "anchors", note: `${sorted[0]?.value} to ${sorted.at(-1)?.value}` },
        { value: "3", label: "content caps", note: "1200 · 1320 · 1440" },
        { value: "3", label: "page margins", note: "16 · 24 · 32" },
        { value: "6", label: "Viewport modes in Figma", note: "one per anchor" },
        { value: "0", label: "px literals allowed", note: "in a media query, use the documented values" },
      ]}
      sections={[
        {
          id: "anchors",
          keyword: "ANCHORS",
          title: "Six Widths, Each Chosen for What It Selects",
          description:
            "Mobile-first: the 360 design is the base, and each anchor above it is where something changes — the margin at 768, the sidebar at 1280, the cap at 1440 and again at 1920. 1024 closes a 512px gap that used to leave a laptop rendering the tablet layout.",
          content: (
            <div className="bp-ladder" aria-label="Breakpoint anchors">
              {sorted.map((a) => {
                const key = seg(a.path, 1);
                const sel = SELECTS[key] ?? { cap: "—", margin: "—" };
                return (
                  <div key={a.path} className="bp-row">
                    <div className="bp-row__bar" style={{ width: `${(px(a.value) / maxPx) * 100}%` }}>
                      <span className="bp-row__label">{LABEL[key] ?? key}</span>
                      <span className="bp-row__value">{a.value}</span>
                    </div>
                    <span className="bp-row__selects">
                      cap {sel.cap} · margin {sel.margin}
                    </span>
                  </div>
                );
              })}
            </div>
          ),
        },
        {
          id: "selects",
          keyword: "SELECTION",
          title: "An Anchor Selects a Cap and a Margin, and Content Only Ever Grows",
          description:
            "The cap is a three-step ladder — 1200, then 1320 from 1440, then 1440 from 1920 — and the margin steps with the CAP, not the viewport, so content width only rises: 1152 → 1272 → 1376. Bind container/page and grid/margin/page, the resolved values, rather than an anchor.",
          content: (
            <>
              <p>
                In CSS the selection is a media query inside <code>.sa-container</code>. A media query cannot read a custom property,
                which is why the anchors are Tier 1 and consumed by the build, the TypeScript mirror (<code>breakpoint.desktop</code>
                for <code>matchMedia</code>) and Figma&rsquo;s Viewport collection — never by <code>var()</code>.
              </p>
              <Callout type="tip" title="Bind .sa-container, not a number">
                UX4G 3.0 publishes the 1200 and 1320 caps but no breakpoints at all; where each engages is the estate&rsquo;s own
                decision, and it is made once in the container class. A page that restates 1200 has copied a value that will move
                without it.
              </Callout>
            </>
          ),
        },
        {
          id: "figma",
          keyword: "FIGMA",
          title: "Figma Carries the Resolved Value, Not the Query",
          description:
            "A variable cannot express a media query, so the Viewport collection has six modes — one per anchor — and exactly two variables: container/page and grid/margin/page. Set the mode on a frame and the cap and margin resolve for that width; the anchors themselves stay out, because giving an anchor a per-viewport value is circular.",
          content: (
            <DoDont
              cards={[
                { type: "do", preview: <code>@media (min-width: 1280px) — inside layout.css only</code>, label: "One place owns the query. Everything else binds .sa-container." },
                { type: "do", preview: <code>breakpoint.desktop from @mosje/design-system/tokens</code>, label: "A JS consumer reads the anchor from the mirror, never retypes it." },
                { type: "dont", preview: <code>@media (min-width: 1200px)</code>, label: "1200 is a cap, not an anchor. Mixing the two is how a layout changes at a width nothing else does." },
              ]}
            />
          ),
        },
      ]}
      tokens={rows}
      tokensIntro="The six anchors are Tier 1 (ref/breakpoint/*) because nothing binds them in CSS; the caps (container/*) and margins (grid/margin/*) are Tier 2, and container/page and grid/margin/page are the two RESOLVED values that vary by viewport."
      a11y={[
        {
          criterion: "1.4.10 Reflow",
          level: "AA",
          description: "Content reflows to 320 CSS px without two-dimensional scrolling.",
          status: "partial",
          evidence: "The base design is 360; the visual regression suite captures at 375. No capture at 320 yet.",
        },
        {
          criterion: "1.4.4 Resize Text",
          level: "AA",
          description: "Text scales to 200% without loss of content — anchors are px, type is rem.",
          status: "verified",
          evidence: "build-output.test.mjs asserts the type scale is rem; anchors in px are correct per WCAG (media queries evaluate against the zoomed viewport).",
        },
      ]}
      standards={[
        {
          clause: "UX4G 3.0 — Grid and layout",
          says: "1200px desktop and 1320px desktop-XL caps; no breakpoints published.",
          does: "Both caps adopted, plus a 1440 cap from 1920; six anchors of the estate's own.",
          why: "Where the standard is silent the estate decides once and records it here; nothing UX4G publishes is removed.",
        },
      ]}
      related={[
        { label: "Layout Grid", href: "/design-system/foundations/layout-grid", reason: "the columns, gutter and container the anchors select" },
        { label: "Typography", href: "/design-system/foundations/typography", reason: "the fluid type scale is clamped between the same anchors" },
      ]}
    />
  );
}
