import type { Metadata } from "next";
import * as React from "react";

import {
  CodeBlock,
  ComponentDocPage,
  MatrixTable,
  type A11yItem,
  type PropDef,
} from "@/components/design-system/docs-kit";
import { ChartCard, DashboardGrid, Sparkline } from "@mosje/design-system";

export const metadata: Metadata = {
  title: "Chart Card — Design System",
  description:
    "The titled container a dashboard chart sits in. It owns the header, the grid span, the download control and every state the chart can be in — loading, empty, filtered to nothing, failed.",
};

/*
 * Read off `ChartCardProps` in packages/design-system/components/dashboard/chart-card.tsx.
 * The interface extends the native `<section>` attributes minus `title` and `children`,
 * so `id`, `data-*` and `aria-*` pass through and are not listed individually.
 */
const PROPS: PropDef[] = [
  {
    name: "title",
    type: "string",
    required: true,
    description:
      "The card's heading, rendered as an h3. Title Case, and it names what the figures are — not what the chart is.",
  },
  {
    name: "subtitle",
    type: "string",
    default: "undefined",
    description: "The reporting period and the selection the figures cover, e.g. \"FY 2025-26 · All States\".",
  },
  {
    name: "actions",
    type: "React.ReactNode",
    default: "undefined",
    description:
      "Header controls — a period toggle, a menu. Rendered before the download control, and hidden along with it while the card is loading or in a state.",
  },
  {
    name: "exportable",
    type: "boolean",
    default: "false",
    description:
      "Add the download control (PNG · SVG · CSV) to the header. It serialises the chart rendered inside this card; nothing needs wiring. It appears only once the card has settled on real content.",
  },
  { name: "exportName", type: "string", default: "title", description: "Filename stem and heading for the download menu." },
  {
    name: "exportFormats",
    type: "ChartExportFormat[]",
    default: "all available",
    description: "Restrict which of PNG, SVG and CSV the download control offers.",
  },
  {
    name: "span",
    type: "number",
    default: "undefined",
    description: "Column span (1–12) inside a DashboardGrid, applied at 768px and above. Full width below that.",
  },
  {
    name: "loading",
    type: "boolean",
    default: "false",
    description:
      "Draw the skeleton instead of the body, with a visually hidden `role=\"status\"` saying what is being loaded. It wins over `state`.",
  },
  {
    name: "state",
    type: "CardStateKind",
    default: "undefined",
    description:
      "Why the card has nothing to draw: empty · no-results · not-published · error · restricted · offline. Six reasons rather than two, because each wants a different next action and only some of those actions are the reader's to take.",
  },
  {
    name: "empty",
    type: "boolean",
    default: "false",
    description: "Deprecated — use state=\"empty\". Kept for call sites that predate `state`; `state` wins where both are given.",
  },
  { name: "emptyTitle", type: "string", default: "the state's own", description: "Overrides the headline for the empty-side states." },
  {
    name: "emptyLabel",
    type: "string",
    default: "the state's own",
    description: "One line saying WHY there is nothing — not that there is nothing, which the reader can already see.",
  },
  {
    name: "error",
    type: "boolean",
    default: "false",
    description: "Deprecated — use state=\"error\".",
  },
  { name: "errorTitle", type: "string", default: "the state's own", description: "Overrides the headline for the error state." },
  { name: "errorLabel", type: "string", default: "the state's own", description: "One sentence saying the request failed. Never a status code or an endpoint." },
  {
    name: "onRetry",
    type: "() => void",
    default: "undefined",
    description:
      "The one action that would resolve the state in front of the reader. Omit it where nothing the reader can do would help — the state decides whether an action is drawn at all.",
  },
  {
    name: "retryLabel",
    type: "string",
    default: "what the state can do",
    description: "\"Try again\" where retrying could work, \"Clear filters\" where widening the selection is the only thing that would.",
  },
  {
    name: "skeleton",
    type: "CardSkeletonShape",
    default: '"bars"',
    description:
      "The silhouette the loading placeholder draws: bars · line · donut · rows · region · figures. A donut card must not shimmer as a bar chart — a specific, wrong promise is worse than a plain grey block.",
  },
  {
    name: "footer",
    type: "React.ReactNode",
    default: "undefined",
    description:
      "A closing line under the body — usually the card's reading of its own figures. Removed while the card is loading or in a state, so it cannot contradict the body above it.",
  },
  { name: "children", type: "React.ReactNode", default: "undefined", description: "The chart, table or list the card contains." },
  { name: "className", type: "string", default: "undefined", description: "Merged onto the card element." },
  {
    name: "...rest",
    type: "React.ComponentPropsWithoutRef<\"section\">",
    description: "Every other section attribute lands on the card — an id for a deep link, a data-sa-reveal for scroll entry.",
  },
];

const A11Y: A11yItem[] = [
  {
    criterion: "1.3.1 Info and Relationships",
    level: "A",
    description:
      "The card is a `<section>` with a real `<h3>` heading, so the chart inside it is announced under a named heading rather than as a loose graphic.",
  },
  {
    criterion: "4.1.3 Status Messages",
    level: "AA",
    description:
      "The loading state carries a visually hidden `role=\"status\"` naming the card, so a screen-reader user is told the wait is deliberate. The states that a reader must notice are announced by CardState; the quiet ones are not.",
  },
  {
    criterion: "2.4.6 Headings and Labels",
    level: "AA",
    description:
      "The title says what the figures are and the subtitle says which period and selection, so a card read out of context still identifies its own data.",
  },
  {
    criterion: "2.3.3 Animation from Interactions",
    level: "AAA",
    description:
      "The body crossfades when it moves between loading, a state and its content. The stylesheet drops the transition under prefers-reduced-motion.",
  },
  {
    criterion: "GIGW 3.0 — Data presentation",
    level: "GIGW",
    description:
      "Where a figure cannot be drawn, the card says which of the six reasons applies rather than rendering a blank panel that reads as \"broken\".",
  },
];

/* A real chart, not a grey box: the card is documented by what it does to its
   content, so the content has to be content. Sparkline carries no heading of its
   own, so the card's `<h3>` stays the only heading in the specimen. */
const TREND = [412, 486, 455, 601, 640, 588, 712, 743];

export default function ChartCardPage(): React.JSX.Element {
  return (
    <ComponentDocPage
      name="Chart Card"
      status="Beta"
      summary="The titled container a dashboard chart sits in. It owns the header, the grid span, the download control and every state the chart can be in, so a portal composes a dashboard rather than rebuilding one."
      figma={{
        absent:
          "Not yet published in the Figma library. The card's states are specified in .claude/rules/data-state-completeness.md until a master exists.",
      }}
      specimen={
        <DashboardGrid>
          <ChartCard
            span={6}
            title="Releases by Quarter"
            subtitle="FY 2025-26 · All States"
            footer="Q4 is the largest quarter at 743 releases."
          >
            <Sparkline data={TREND} height={72} fill label="Releases by quarter, rising from 412 to 743" />
          </ChartCard>
          <ChartCard span={6} title="Beneficiaries by Category" subtitle="FY 2025-26 · All States" loading skeleton="donut">
            <Sparkline data={TREND} height={72} />
          </ChartCard>
          <ChartCard
            span={6}
            title="District Coverage"
            subtitle="Bihar · FY 2025-26"
            state="no-results"
            emptyLabel="No district in Bihar matches the selected category."
          >
            <Sparkline data={TREND} height={72} />
          </ChartCard>
          <ChartCard span={6} title="Hostels Sanctioned" subtitle="FY 2025-26 · All States" state="not-published">
            <Sparkline data={TREND} height={72} />
          </ChartCard>
        </DashboardGrid>
      }
      props={PROPS}
      a11y={A11Y}
      whenToUse={{
        use: [
          "A chart, map or ranked list is placed on a dashboard and needs a heading, a period and a grid span.",
          "The figures come from a feed, so the surface has to render a loading, empty, filtered-to-nothing and failed state as well as a populated one.",
          "A reader is expected to be able to download the figures behind the picture.",
        ],
        avoid: [
          "The content is a single number — use Metric Card, or a KPI Row for several.",
          "The content is a page section rather than a dashboard widget — use Section, which carries the page's own heading rhythm.",
          "The container is only there to draw a border — use Card, which makes no promises about states or spans.",
        ],
      }}
      related={[
        {
          label: "Dashboard Grid",
          href: "/design-system/components/dashboard/dashboard-grid",
          reason: "the 12-column grid the span prop is measured against",
        },
        { label: "KPI Row", href: "/design-system/components/dashboard/kpi-row", reason: "for the headline figures above the charts" },
        { label: "Filter Bar", href: "/design-system/components/dashboard/filter-bar", reason: "the row of controls that drives what the cards show" },
        { label: "Empty State", href: "/design-system/components/feedback/empty-state", reason: "for a whole page with nothing to show, rather than one card" },
      ]}
      design={
        <>
          <section className="cdp__section" aria-labelledby="cdp-states">
            <h2 id="cdp-states" className="cdp__h2">
              Six Reasons a Card Has Nothing to Draw
            </h2>
            <p>
              &ldquo;Empty&rdquo; and &ldquo;error&rdquo; fit all of these and help with none of
              them. Each wants a different next action, and only some of those actions are the
              reader&rsquo;s to take &mdash; so the state decides whether an action is drawn at all,
              and <code>onRetry</code> is ignored for the kinds that cannot use one. A
              &ldquo;Try again&rdquo; button under &ldquo;not published yet&rdquo; is a control that
              cannot possibly work, and a control that never changes anything teaches people to stop
              pressing controls.
            </p>
            <MatrixTable
              caption="CardStateKind — what each one means and what it offers"
              columns={["state", "What it means", "Action offered"]}
              rows={[
                ["empty", "The selection is valid and genuinely holds nothing.", "None"],
                ["no-results", "A filter matched nothing. The reader caused this and can undo it.", "Clear filters"],
                ["not-published", "The source does not publish this figure yet. Not a failure, and not the reader's to fix.", "None"],
                ["error", "The request failed. Local to this card; the rest of the page is unaffected.", "Try again"],
                ["restricted", "The figures exist but this viewer may not see them.", "None"],
                ["offline", "The device is offline. Nothing is wrong with the service.", "Try again"],
              ]}
            />
            <p>
              <strong>&ldquo;Filtered to nothing&rdquo; is not &ldquo;empty&rdquo;.</strong>{" "}
              <em>No district in Bihar matches the selected category</em> and <em>the feed published
              nothing</em> are different sentences with different remedies, and a card that renders
              one for both is lying about one of them.
            </p>
          </section>
          <section className="cdp__section" aria-labelledby="cdp-skeleton">
            <h2 id="cdp-skeleton" className="cdp__h2">
              The Skeleton Promises the Shape
            </h2>
            <p>
              A skeleton earns its place by sharing the silhouette of what is coming. Set{" "}
              <code>skeleton</code> to match the chart inside: <code>bars</code> for bar and column
              charts, <code>line</code> for line, area and combo, <code>donut</code> for donut, pie
              and gauge, <code>rows</code> for ranked lists and funnels, <code>region</code> for
              maps, <code>figures</code> for reference grids. The bar heights are fixed rather than
              random, because a skeleton that reshuffles reads as data arriving and being withdrawn.
            </p>
          </section>
          <section className="cdp__section" aria-labelledby="cdp-footer">
            <h2 id="cdp-footer" className="cdp__h2">
              A Card That Cannot Show Its Data Must Not Talk About Its Data
            </h2>
            <p>
              The footer carries the card&rsquo;s reading of its own figures. Left up while the body
              says the figures did not arrive, the card contradicts itself and the sentence is
              indistinguishable from a live finding &mdash; so the footer is removed in every
              loading and state case. The download control goes for the same reason: there is
              nothing to serialise, and offering the download implies there is.
            </p>
          </section>
        </>
      }
      code={
        <section className="cdp__section" aria-labelledby="cdp-example">
          <h2 id="cdp-example" className="cdp__h2">
            Example
          </h2>
          <CodeBlock>{`import { ChartCard } from "@mosje/design-system";

<ChartCard
  span={6}
  title="Releases by Quarter"
  subtitle="FY 2025-26 · All States"
  exportable
  skeleton="bars"
  loading={query.isLoading}
  state={query.error ? "error" : rows.length === 0 ? "no-results" : undefined}
  emptyLabel="No district in Bihar matches the selected category."
  onRetry={query.refetch}
  footer={summary}
>
  <BarChart data={rows} />
</ChartCard>`}</CodeBlock>
          <p>
            <strong>One request, one answer.</strong> The card&rsquo;s title, its body and its footer
            are three views of a single reading, so resolve that reading once and pass the result to
            all three. Deriving them separately is how a key came to print{" "}
            <code>0</code> above a map drawing 19,768 villages.
          </p>
        </section>
      }
      accessibility={
        <section className="cdp__section" aria-labelledby="cdp-sr">
          <h2 id="cdp-sr" className="cdp__h2">
            What a Screen Reader Hears
          </h2>
          <ul>
            <li>
              <strong>Loading</strong> &mdash; &ldquo;Loading Releases by Quarter&rdquo;, from a
              visually hidden <code>role=&quot;status&quot;</code>. The wait is announced as
              deliberate rather than left as silence.
            </li>
            <li>
              <strong>A state</strong> &mdash; the headline and the one-line reason, read under the
              card&rsquo;s own heading. States a reader must notice are announced; the quiet ones
              are not, so a dashboard of six cards does not interrupt six times.
            </li>
            <li>
              <strong>Populated</strong> &mdash; the heading, then whatever the chart itself exposes.
              The card makes no claim about the chart&rsquo;s accessible content; that is the
              chart&rsquo;s own page.
            </li>
          </ul>
          <p>
            The card never prints a status code, an endpoint or a stack trace. A feed being down is
            an expected state with a defined rendering, not an exception &mdash; the diagnostics
            belong in <code>docs/audit/*.md</code>.
          </p>
        </section>
      }
    />
  );
}
