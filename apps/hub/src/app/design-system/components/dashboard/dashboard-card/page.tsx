import type { Metadata } from "next";
import Link from "next/link";
import * as React from "react";

import {
  CodeBlock,
  ComponentDocPage,
  MatrixTable,
  PropsTable,
  type A11yItem,
  type PropDef,
} from "@/components/design-system/docs-kit";
import {
  CardIcon,
  DashboardCard,
  DashboardCardList,
  DescriptionList,
  HeadlineFigure,
  OrgLogo,
  compactCount,
  shownDate,
} from "@mosje/design-system";
import { FUND_SHARE, SCHOLARSHIPS } from "@/lib/website-shared/dashboard";
import { NMBA_STATES_SNAPSHOT } from "@/lib/kpi/feeds/nmba-states-snapshot";

export const metadata: Metadata = {
  title: "Dashboard Card — Design System",
  description:
    "One dashboard summarised on a page that lists several: its mark, its name, one lead figure, a few facts and a link to the dashboard. With Dashboard Card List, which lays the cards out by how many there are.",
};

/*
 * The specimen's figures are the Department's own, read from the shared record the website's
 * Beneficiary Dashboard draws (`lib/website-shared/dashboard.ts`, read 5 Oct 2026) and the
 * NMBA State/UT snapshot (`lib/kpi/feeds/nmba-states-snapshot.ts`, 7 Oct 2026). Nothing is
 * re-typed here, so the specimen cannot drift from the page it documents.
 */
const amount = (m: { value: string; unit?: string }) => (m.unit ? `${m.value} ${m.unit}` : m.value);
const fundTotal = Math.round(FUND_SHARE.slices.reduce((t, s) => t + s.value, 0)).toLocaleString("en-IN");

const ITEM_SHAPE: PropDef[] = [
  { name: "key", type: "React.Key", required: true, description: "React's key for the list item." },
  { name: "id", type: "string", required: false, description: "An anchor another part of the page can jump to — a Headline Band figure's href, for instance." },
  { name: "content", type: "React.ReactNode", required: true, description: "The card. Usually a DashboardCard." },
];

const A11Y: A11yItem[] = [
  {
    criterion: "2.4.4 Link Purpose (In Context)",
    level: "A",
    description:
      "Every card's visible link reads \"View Dashboard\", so each takes its own accessible name from `linkLabel` — \"View the NMBA Dashboard\". A list of cards does not read as five identical links.",
    status: "verified",
    evidence: "dashboard-card.tsx passes `aria-label={linkLabel}` to the footer Button whenever `href` is set.",
  },
  {
    criterion: "2.1.1 Keyboard",
    level: "A",
    description:
      "A linked card is one tab stop: its one link is stretched over the card. Anything interactive inside the card — a map's States, a chart's marks — sits above the stretch and keeps its own focus and behaviour.",
    status: "verified",
    evidence:
      "dashboard-card.css: the link's ::after is `position: absolute; inset: 0`; body descendants matching a, button, [tabindex] or .ds-chart__mark take `position: relative; z-index: var(--sa-z-raised)`.",
  },
  {
    criterion: "2.4.7 Focus Visible",
    level: "AA",
    description:
      "When the link takes keyboard focus the whole card is ringed, so the keyboard sees the same target the pointer does.",
    status: "verified",
    evidence:
      "dashboard-card.css: `.ds-dashboard-card:has(… .ds-dashboard-card__link:focus-visible)` sets `outline: var(--sa-focus-width) solid var(--sa-focus-ring)`.",
  },
  {
    criterion: "2.5.8 Target Size (Minimum)",
    level: "AA",
    description:
      "The link's target is the whole card. The coarse-pointer 44px target the design system draws on the same pseudo-element is reset, so it cannot pull the target off the card.",
    status: "verified",
    evidence:
      "dashboard-card.css resets width, height, min-width, min-height and transform on the stretched ::after, alongside `inset: 0`.",
  },
  {
    criterion: "1.3.1 Info and Relationships",
    level: "A",
    description:
      "Dashboard Card List is a real list, so a screen reader announces how many dashboards the page holds before the first is read.",
    status: "verified",
    evidence: "dashboard-card.tsx renders DashboardCardList as `<ul>` with one `<li>` per item.",
  },
  {
    criterion: "2.3.3 Animation from Interactions",
    level: "AAA",
    description:
      "The card's press and the arrow's lean are removed when the reader asks for reduced motion.",
    status: "verified",
    evidence:
      "dashboard-card.css: under `prefers-reduced-motion: reduce` the card and the arrow take `transition: none` and the press takes `transform: none`.",
  },
];

export default function DashboardCardPage(): React.JSX.Element {
  const [sc, obc, shreyas] = SCHOLARSHIPS.cards;
  return (
    <ComponentDocPage
      name="Dashboard Card"
      status="Beta"
      summary="One dashboard summarised on a page that lists several: its mark, its name, the scheme under it, one lead figure, a few facts and a link to the dashboard. Dashboard Card List lays the cards out by how many there are, so a programme with nothing to show leaves no gap in the row."
      figma={{ node: "dashboardCard" }}
      specimen={
        <div className="cdp-stack">
          <p className="cdp-states__label">Linked — the whole card opens its dashboard</p>
          <DashboardCardList
            aria-label="Department and Portal Dashboards"
            items={[
              {
                key: "department",
                content: (
                  <DashboardCard
                    tone="primary"
                    mark={<OrgLogo path={null} size="md" name="" />}
                    title="Department of Social Justice and Empowerment"
                    subtitle="Beneficiary Dashboard"
                    href="/website/dashboard?programme=department"
                    linkAs={Link}
                    linkLabel="View the Department's Beneficiary Dashboard"
                    figure={<HeadlineFigure size="md" value={`₹${fundTotal} Cr`} label={FUND_SHARE.subtitle} context="Scholarships, fellowships and hostels, 2014–15 to 2025–26" />}
                  />
                ),
              },
              {
                key: "nmba",
                content: (
                  <DashboardCard
                    tone="success"
                    mark={<OrgLogo path="/portals/nmba" size="md" />}
                    title="NMBA"
                    subtitle="Nasha Mukt Bharat Abhiyaan"
                    href="/website/dashboard?programme=nmba"
                    linkAs={Link}
                    linkLabel="View the NMBA Dashboard"
                    figure={
                      <HeadlineFigure
                        size="md"
                        value={compactCount(NMBA_STATES_SNAPSHOT.national)}
                        label="Total Outreach"
                        context={`Persons reached by awareness activities, since launch. As on ${shownDate(NMBA_STATES_SNAPSHOT.asOn)}`}
                      />
                    }
                  />
                ),
              },
            ]}
          />
          <p className="cdp-states__label">Summary — no href, no link, no footer</p>
          <DashboardCardList
            aria-label={SCHOLARSHIPS.title}
            items={[sc, obc, shreyas].flatMap((c) =>
              c
                ? [
                    {
                      key: c.id,
                      content: (
                        <DashboardCard
                          tone={c.tone}
                          mark={<CardIcon name={c.icon} />}
                          title={c.title}
                          subtitle={c.subtitle}
                          figure={c.metrics[2] ? <HeadlineFigure size="md" value={amount(c.metrics[2])} label={c.metrics[2].label} /> : undefined}
                        >
                          <DescriptionList
                            size="md"
                            columns={2}
                            items={c.metrics.slice(0, 2).map((m) => ({ term: m.label, value: amount(m) }))}
                          />
                        </DashboardCard>
                      ),
                    },
                  ]
                : [],
            )}
          />
        </div>
      }
      propsFrom="DashboardCardProps"
      a11y={A11Y}
      whenToUse={{
        use: [
          "A page lists several dashboards and the reader chooses one — the Beneficiary Dashboard's Department and Portal Dashboards.",
          "A section of one dashboard groups a few related schemes, each with a lead figure and two or three facts.",
          "The card has one destination, or none.",
        ],
        avoid: [
          "The card opens a portal rather than a dashboard of its figures — use Portal Card, which carries the portal's sign-in and service links.",
          "The tile is one figure in a row of figures of the same kind — use Metric Card inside a KPI Row.",
          "The card holds one chart with its own loading, empty and error states — use Chart Card, or KPI View for a register reading.",
          "The card needs two or more links — the whole-card link would cover them; use Card and place the links in its footer.",
        ],
      }}
      related={[
        { label: "Portal Card", href: "/design-system/components/navigation/portal-card", reason: "a portal to sign in to, not a dashboard to read" },
        { label: "Metric Card", href: "/design-system/components/data-display/metric-card", reason: "one figure in a row of like figures" },
        { label: "Headline Figure", href: "/design-system/components/data-display/headline-figure", reason: "the lead figure a card usually carries" },
        { label: "Card", href: "/design-system/components/data-display/card", reason: "the frame, tones and accents this card is built on" },
        { label: "Dashboard Screen", href: "/design-system/components/templates/dashboard-screen", reason: "the screen a list of these cards opens" },
      ]}
      design={
        <>
          <section className="cdp__section" aria-labelledby="cdp-whole-card">
            <h2 id="cdp-whole-card" className="cdp__h2">
              The Whole Card Is the Link
            </h2>
            <p>
              A card with one destination has one link, stretched over the card. A reader can press
              anywhere, a screen reader meets one named link, and the keyboard meets one tab stop
              rather than one per figure.
            </p>
            <p>
              The card answers as one: on hover its side and bottom edges firm and the label
              underlines; on press the card, not the button, gives way. The top edge stays the
              dashboard&rsquo;s colour throughout.
            </p>
          </section>

          <section className="cdp__section" aria-labelledby="cdp-by-count">
            <h2 id="cdp-by-count" className="cdp__h2">
              Laid Out by How Many There Are
            </h2>
            <p>
              A programme with nothing to show is not drawn, so the list cannot assume a count. Each
              count has its own arrangement on the 12-column grid, and none leaves a gap.
            </p>
            <MatrixTable
              caption="How Dashboard Card List shares out the row at 1280px and above"
              columns={["Cards", "balanced", "lead"]}
              rows={[
                ["1", "One across the width", "One across the width"],
                ["2", "7 + 5", "6 + 6"],
                ["3", "4 + 4 + 4", "12, then 6 + 6"],
                ["4", "7 + 5, then 6 + 6", "7 + 5, then 6 + 6"],
                ["5", "7 + 5, then 4 + 4 + 4", "7 + 5, then 4 + 4 + 4"],
              ]}
            />
            <p>
              Below 1280px cards pair up, and on a phone they stack. Use <code>lead</code> where the
              first card carries a map, so the map is never squeezed into a third of the row.
            </p>
          </section>

          <section className="cdp__section" aria-labelledby="cdp-content">
            <h2 id="cdp-content" className="cdp__h2">
              One Figure Leads
            </h2>
            <p>
              <code>figure</code> takes the one number the card answers with; <code>children</code>{" "}
              take the facts that follow it. Where most of the page has changed area but this
              dashboard publishes All-India figures only, say so once in <code>note</code>, above the
              figures, rather than leaving the reader to wonder why the figure did not move.
            </p>
          </section>
        </>
      }
      code={
        <>
          <section className="cdp__section" aria-labelledby="cdp-list-props">
            <h2 id="cdp-list-props" className="cdp__h2">
              Dashboard Card List Props
            </h2>
            <PropsTable from="DashboardCardListProps" />
          </section>
          <section className="cdp__section" aria-labelledby="cdp-item-shape">
            <h2 id="cdp-item-shape" className="cdp__h2">
              DashboardCardListItem
            </h2>
            <PropsTable props={ITEM_SHAPE} />
          </section>
          <section className="cdp__section" aria-labelledby="cdp-example">
            <h2 id="cdp-example" className="cdp__h2">
              Example
            </h2>
            <CodeBlock>{`import Link from "next/link";
import { DashboardCard, DashboardCardList, HeadlineFigure, OrgLogo } from "@mosje/design-system";

<DashboardCardList
  aria-label="Department and Portal Dashboards"
  arrangement="lead"
  items={portals.map((p) => ({
    key: p.id,
    id: \`card-\${p.id}\`,
    content: (
      <DashboardCard
        tone={p.tone}
        mark={<OrgLogo path={p.logoPath} size="md" />}
        title={p.portal}
        subtitle={p.name}
        href={\`?programme=\${p.id}\`}
        linkAs={Link}
        linkLabel={\`View the \${p.portal} Dashboard\`}
        figure={<HeadlineFigure size="md" value={p.lead.value} label={p.lead.label} />}
      >
        {p.facts}
      </DashboardCard>
    ),
  }))}
/>`}</CodeBlock>
            <p>
              Pass <code>linkLabel</code> whenever you pass <code>href</code>. The type does not
              require it, but without it every card&rsquo;s link is announced as &ldquo;View
              Dashboard&rdquo;.
            </p>
          </section>
        </>
      }
      accessibility={
        <section className="cdp__section" aria-labelledby="cdp-not-measured">
          <h2 id="cdp-not-measured" className="cdp__h2">
            Not Yet Measured
          </h2>
          <p>
            The top edge&rsquo;s contrast against the page is inherited from Card&rsquo;s{" "}
            <code>edge</code> accent and is not measured here. The mark takes no accessible name of
            its own, because the title names the card; pass <code>name=&quot;&quot;</code> to an
            Organisation Logo used as the mark.
          </p>
        </section>
      }
    />
  );
}
