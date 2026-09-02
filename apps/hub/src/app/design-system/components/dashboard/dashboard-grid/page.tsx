import type { Metadata } from "next";
import * as React from "react";

import {
  CodeBlock,
  ComponentDocPage,
  MatrixTable,
  type A11yItem,
} from "@/components/design-system/docs-kit";
import { ChartCard, DashboardGrid, KpiRow, Sparkline } from "@mosje/design-system";

export const metadata: Metadata = {
  title: "Dashboard Grid — Design System",
  description:
    "The 12-column grid a portal dashboard is laid out on. Children declare their own width with a span prop; every child is full width below 768px.",
};

const A11Y: A11yItem[] = [
  {
    criterion: "1.3.2 Meaningful Sequence",
    level: "A",
    description:
      "Cards are placed in source order — the grid sets spans, never explicit column or row starts, so the reading order and the visual order cannot diverge.",
  },
  {
    criterion: "1.4.10 Reflow",
    level: "AA",
    description:
      "Below 768px every child spans all 12 columns, so a dashboard reads as one column at 320px with no horizontal scrolling.",
  },
  {
    criterion: "1.3.1 Info and Relationships",
    level: "A",
    description:
      "The grid adds no role and no landmark. It is a layout, and announcing it would put a container between the reader and the cards, each of which is already a titled section.",
  },
];

const TREND = [412, 486, 455, 601, 640, 588, 712, 743];

export default function DashboardGridPage(): React.JSX.Element {
  return (
    <ComponentDocPage
      name="Dashboard Grid"
      status="Beta"
      summary="The 12-column grid a portal dashboard is laid out on. Children declare their own width with a span prop, and every child is full width below 768px, so a dashboard reflows to one column without a second layout being written."
      figma={{
        absent: "Not yet published in the Figma library. The layout grid the estate uses is documented on the Spacing foundation page.",
      }}
      specimen={
        <DashboardGrid>
          <KpiRow
            span={12}
            items={[
              { label: "Funds Released", value: "₹ 1,240 Cr" },
              { label: "Beneficiaries", value: "4,21,509" },
              { label: "States Reporting", value: "28" },
            ]}
          />
          <ChartCard span={8} title="Releases by Quarter" subtitle="FY 2025-26 · All States">
            <Sparkline data={TREND} height={72} fill label="Releases by quarter, rising from 412 to 743" />
          </ChartCard>
          <ChartCard span={4} title="Category Split" subtitle="FY 2025-26">
            <Sparkline data={[220, 190, 260, 240]} height={72} label="Category split across four categories" />
          </ChartCard>
        </DashboardGrid>
      }
      propsFrom="DashboardGridProps"
      a11y={A11Y}
      whenToUse={{
        use: [
          "A portal dashboard places several cards of different widths on one page.",
          "The cards must reflow to a single column on a phone without a second layout being written.",
          "A card's width is a property of the card rather than of the page, so it can be moved without its span being recalculated.",
        ],
        avoid: [
          "The page is a document rather than a dashboard — use Section and Container, which carry the estate's reading measure.",
          "The content is a table of like rows — use Data Table; a grid of cards is not a way to show a list.",
          "You need arbitrary placement, row starts or dense packing — the grid deliberately offers none of these, because they let the visual order diverge from the reading order.",
        ],
      }}
      related={[
        { label: "Chart Card", href: "/design-system/components/dashboard/chart-card", reason: "the card the grid is usually filled with; it takes the span prop" },
        { label: "KPI Row", href: "/design-system/components/dashboard/kpi-row", reason: "the headline figures, usually span 12 at the top" },
        { label: "Grid", href: "/design-system/components/layout/grid", reason: "for page layout outside a dashboard" },
        { label: "Container", href: "/design-system/components/layout/container", reason: "the content width the grid sits inside" },
      ]}
      design={
        <>
          <section className="cdp__section" aria-labelledby="cdp-spans">
            <h2 id="cdp-spans" className="cdp__h2">
              Spans, and the One Breakpoint
            </h2>
            <p>
              The grid is twelve equal columns with a <code>--sa-stack-24</code> gutter. A child
              spans all twelve unless it says otherwise, and what it says applies only from{" "}
              <strong>768px</strong> upward.
            </p>
            <MatrixTable
              caption="What a span does at each width"
              columns={["Width", "What every child spans", "What span={4} means"]}
              rows={[
                ["Below 768px", "All 12 columns", "Ignored — the card is full width"],
                ["768px and above", "12 columns unless a span is set", "One third of the row"],
              ]}
            />
            <p>
              One breakpoint rather than three is deliberate. A dashboard that re-flows twice
              between a phone and a desktop has two intermediate layouts nobody designed, and
              cards sized in twelfths already narrow smoothly between them.
            </p>
          </section>
          <section className="cdp__section" aria-labelledby="cdp-rows">
            <h2 id="cdp-rows" className="cdp__h2">
              Close Every Row
            </h2>
            <p>
              Spans in a row should add to twelve. A row that adds to ten leaves a sixth of the
              page blank, which reads as a card that failed to load rather than as a layout
              choice. This matters most on a dashboard offering live and illustrative data modes:
              a card that appears in two modes and not the third must not leave half a row of
              white in the third.
            </p>
          </section>
        </>
      }
      code={
        <section className="cdp__section" aria-labelledby="cdp-example">
          <h2 id="cdp-example" className="cdp__h2">
            Example
          </h2>
          <CodeBlock>{`import { ChartCard, DashboardGrid, KpiRow } from "@mosje/design-system";

<DashboardGrid>
  <KpiRow span={12} items={kpis} />
  <ChartCard span={8} title="Releases by Quarter">…</ChartCard>
  <ChartCard span={4} title="Category Split">…</ChartCard>
</DashboardGrid>`}</CodeBlock>
          <p>
            Anything that is not a DS card takes its span from the same custom property the cards
            set, so a bespoke widget sits in the grid without the grid learning about it.
          </p>
          <CodeBlock>{`<DashboardGrid>
  <section style={{ ["--cmp-card-span" as string]: "6" }}>…</section>
</DashboardGrid>`}</CodeBlock>
        </section>
      }
    />
  );
}
