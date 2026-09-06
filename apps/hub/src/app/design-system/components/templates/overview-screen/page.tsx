import type { Metadata } from "next";
import * as React from "react";
import { Callout, CodeBlock, ComponentDocPage, MatrixTable, type A11yItem } from "@/components/design-system/docs-kit";
import { OverviewSpecimen } from "../specimens";

export const metadata: Metadata = {
  title: "Overview Screen — Design System",
  description:
    "Many records aggregated into figures: a KPI row, a pair of chart cards, context panels and a recent list.",
};

const A11Y: A11yItem[] = [
  {
    criterion: "1.3.1 Info and Relationships",
    level: "A",
    description:
      "Each panel is a Card or ChartCard with its own heading, so the dashboard reads as a set of labelled regions rather than a wall of numbers.",
    status: "verified",
    evidence: "The template renders PageHeader's single h1 and places each panel as passed; ChartCard renders its title as a heading.",
  },
  {
    criterion: "4.1.3 Status Messages",
    level: "AA",
    description:
      "KpiRow's `loading` is a count, so the row holds its shape while figures arrive and nothing below it moves when they land.",
    status: "verified",
    evidence: "KpiRow renders that many placeholders in place of items.",
  },
  {
    criterion: "1.4.1 Use of Colour",
    level: "A",
    description:
      "A delta on a MetricCard carries a direction as well as a colour, so a rise is not signalled by green alone.",
    status: "verified",
    evidence: "Inherited from MetricCard's change prop, which renders a direction indicator.",
  },
];

export default function OverviewScreenPage(): React.JSX.Element {
  return (
    <ComponentDocPage
      name="Overview Screen"
      status="Beta"
      summary="Many records aggregated into figures. Headline KPIs, then charts, then context, then what moved recently — the reader's order, not the database's."
      figma={{
        absent:
          "Drawn once, as the orphan frame e-anudaan-dashboard (51326:6489), which sits in no section on the handoff page and is built almost entirely from layers named Frame.",
      }}
      specimen={<OverviewSpecimen />}
      propsFrom="OverviewScreenProps"
      a11y={A11Y}
      whenToUse={{
        use: [
          "A portal's landing page for a signed-in reader.",
          "A programme or scheme summary: how much, how it is going, what just moved.",
        ],
        avoid: [
          "A tabular statement meant to be printed and filed — use Report Screen.",
          "A list the reader acts on — use Worklist Screen; a dashboard is for reading.",
          "Anywhere a figure would have to be invented to fill a tile.",
        ],
      }}
      related={[
        { label: "Kpi Row", href: "/design-system/components/dashboard/kpi-row", reason: "the headline figures, and their loading shape" },
        { label: "Chart Card", href: "/design-system/components/dashboard/chart-card", reason: "each panel's own states and provenance" },
        { label: "Metric Card", href: "/design-system/components/data-display/metric-card", reason: "one tile" },
      ]}
      design={
        <>
          <section className="cdp__section" aria-labelledby="cdp-order">
            <h2 id="cdp-order" className="cdp__h2">The Order Is the Reader&rsquo;s</h2>
            <MatrixTable
              caption="What the handoff's dashboard puts where, and the question each answers"
              columns={["Band", "Holds", "Answers"]}
              rows={[
                ["Header", "Greeting, last-updated, New Application", "Where am I, how fresh is this"],
                ["KPI row", "Four tiles with deltas", "How much"],
                ["Panels", "Status donut, financial summary", "How is it going"],
                ["Panels", "Organisation profile, applications by scheme", "Who am I, split how"],
                ["Recent", "Six rows and a View All", "What just moved"],
              ]}
            />
          </section>

          <section className="cdp__section" aria-labelledby="cdp-two-rules">
            <h2 id="cdp-two-rules" className="cdp__h2">Two Rules This Template Cannot Enforce</h2>
            <Callout type="warning" title="A ratio takes both halves from one source">
              Mixing a numerator from the live feed with a denominator from the mirror published a{" "}
              <code>138%</code> on this estate. No component can catch that — only the person
              composing the figure can.
            </Callout>
            <p>
              And <strong>a figure the register does not publish is left off the design</strong>,
              not shown as &ldquo;Not yet reported&rdquo;. An absent KPI is one fewer tile.
            </p>
            <p>
              A zero is different from an absence. &ldquo;Needs Action 0&rdquo; is a real figure
              and belongs on the page; a metric whose group has no figure at all does not.
            </p>
          </section>

          <section className="cdp__section" aria-labelledby="cdp-panels">
            <h2 id="cdp-panels" className="cdp__h2">Each Panel Owns Its Own States</h2>
            <p>
              Pass <code>ChartCard</code>s. Each carries its own loading, empty, error, retry and
              provenance, which is the right granularity: one failing chart must not blank the
              page around it, and one arriving late must not hold the others back.
            </p>
          </section>
        </>
      }
      code={
        <section className="cdp__section" aria-labelledby="cdp-example">
          <h2 id="cdp-example" className="cdp__h2">Example</h2>
          <CodeBlock>{`<OverviewScreen
  title={greeting(user.firstName)}       // the caller's string, not the template's
  meta={\`Last updated \${format(updatedAt)}\`}
  actions={<Button iconLeft={<Icon name="add" />}>New Application</Button>}
  filters={<FilterBar title="Period"><SegmentedControl … /></FilterBar>}
  kpis={figures}            // MetricCardProps[] — omit a tile with no figure
  kpisLoading={isLoading ? 4 : undefined}
  panels={[
    <ChartCard key="status" title="Application Status" provenance={prov}>…</ChartCard>,
    <ChartCard key="funds" title="Financial Summary" provenance={prov}>…</ChartCard>,
  ]}
  recent={<Card>…</Card>}
/>`}</CodeBlock>
          <p>
            <code>kpisLoading</code> is a count rather than a boolean because the caller is the
            only one who knows how many tiles are coming. A row that shows nothing and then four
            tiles has moved everything below it once.
          </p>
        </section>
      }
      accessibility={
        <section className="cdp__section" aria-labelledby="cdp-numbers">
          <h2 id="cdp-numbers" className="cdp__h2">Numbers Are Read Aloud</h2>
          <p>
            Format figures for en-IN — lakh and crore, not millions — and pass them formatted.
            A screen reader announces what is in the DOM, so <code>24.37 Cr</code> must be the
            text, not a raw <code>243700000</code> styled to look like it.
          </p>
          <p>
            <strong>A chart must carry its figures in text as well as in marks</strong> (WCAG
            2.2 §1.1.1). The template does not know what is inside a panel, so it cannot claim
            that criterion — check each chart you pass against the data-visualisation guidance,
            which is why it is not listed above.
          </p>
        </section>
      }
    />
  );
}
