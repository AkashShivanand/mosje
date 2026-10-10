import type { Metadata } from "next";
import * as React from "react";

import {
  CodeBlock,
  ComponentDocPage,
  PropsTable,
  type A11yItem,
  type PropDef,
} from "@/components/design-system/docs-kit";
import { HeadlineBand, compactCount, shownDate } from "@mosje/design-system";
import { FUND_SHARE, HOSTELS, SCHOLARSHIPS } from "@/lib/website-shared/dashboard";
import { NMBA_STATES_SNAPSHOT } from "@/lib/kpi/feeds/nmba-states-snapshot";

export const metadata: Metadata = {
  title: "Headline Band — Design System",
  description:
    "The figures a dashboard opens with: one drawn large and a few beside it, on the colour of the dashboard, named in the page outline by a visually hidden heading.",
};

/*
 * The Beneficiary Dashboard's own At a Glance figures, All India: NMBA's Total Outreach (the
 * State/UT snapshot, 7 Oct 2026) and the Department's figures as received (read 5 Oct 2026),
 * from the shared records the website draws. Nothing is re-typed here.
 */
const fundTotal = Math.round(FUND_SHARE.slices.reduce((t, s) => t + s.value, 0)).toLocaleString("en-IN");
interface Metric {
  label: string;
  value: string;
  unit?: string;
}
/** A card's figure as a band figure, keyed and with the card's title under it; none if the record lacks it. */
const fromCard = (key: string, card: { title: string; metrics?: readonly Metric[] } | undefined, i: number) => {
  const m = card?.metrics?.[i];
  return card && m ? [{ key, value: m.unit ? `${m.value} ${m.unit}` : m.value, label: m.label, context: card.title }] : [];
};

const FIGURE_SHAPE: PropDef[] = [
  { name: "key", type: "React.Key", required: true, description: "React's key for the list item." },
  { name: "value", type: "string", required: true, description: "The figure, formatted: \"34.81 crore\"." },
  { name: "label", type: "React.ReactNode", required: true, description: "What the figure counts, as a phrase." },
  { name: "context", type: "React.ReactNode", required: false, description: "What the figure counts, and when." },
  { name: "mark", type: "React.ReactNode", required: false, description: "The provenance mark beside the figure. Not drawn when the figure has an href." },
  { name: "href", type: "string", required: false, description: "Where the figure is explained — a card further down the page." },
];

const A11Y: A11yItem[] = [
  {
    criterion: "1.3.1 Info and Relationships",
    level: "A",
    description:
      "The band is named by a real heading that is visually hidden, so it appears in the page's outline and a screen-reader user can jump to it. The figures beside the lead are a list.",
    status: "verified",
    evidence:
      "headline-band.tsx renders `SectionTitle as={headingLevel}` with `className=\"ds-sr-only\"`, and the side figures as a `<ul>` of `<li>`.",
  },
  {
    criterion: "2.4.6 Headings and Labels",
    level: "AA",
    description:
      "The list of figures beside the lead carries its own name — \"Other figures\" unless the page words it better — so it is not announced as an unnamed list.",
    status: "verified",
    evidence: "headline-band.tsx sets `aria-label={figuresLabel}` on the side list, defaulting to \"Other figures\".",
  },
  {
    criterion: "2.4.7 Focus Visible",
    level: "AA",
    description:
      "A figure that links to its card shows a focus ring in the band's inverse ink, so the ring is drawn against the coloured ground rather than lost in it.",
    status: "verified",
    evidence:
      "dashboard-band.css: `.ds-headline-band__jump:focus-visible { outline: var(--sa-focus-width) solid var(--sa-text-neutral-inverse) }`.",
  },
  {
    criterion: "1.4.10 Reflow",
    level: "AA",
    description:
      "The lead and its figures stack below 1024px, and the figures fall to one column below 768px, so nothing scrolls sideways at 320px.",
    status: "verified",
    evidence:
      "dashboard-band.css: `@media (max-width: 1023px)` sets the body to one column; `@media (max-width: 767px)` sets the side list to one column.",
  },
];

export default function HeadlineBandPage(): React.JSX.Element {
  return (
    <ComponentDocPage
      name="Headline Band"
      status="Beta"
      summary="The figures a dashboard opens with: one drawn large, and a few beside it, on the dashboard's colour. The lead answers the page's first question; the figures beside it answer the next few."
      figma={{ node: "headlineBand" }}
      specimen={
        <HeadlineBand
          title="At a Glance, All India"
          headingLevel={3}
          lead={{
            value: compactCount(NMBA_STATES_SNAPSHOT.national),
            label: "Total Outreach",
            context: `Persons reached by awareness activities under Nasha Mukt Bharat Abhiyaan, since launch. As on ${shownDate(NMBA_STATES_SNAPSHOT.asOn)}`,
          }}
          figures={[
            { key: "fund", value: `₹${fundTotal} Cr`, label: FUND_SHARE.subtitle, context: "Scholarships, fellowships and hostels" },
            ...fromCard("sc", SCHOLARSHIPS.cards[0], 2),
            ...fromCard("obc", SCHOLARSHIPS.cards[1], 2),
            ...fromCard("hostels", HOSTELS.cards[0], 0),
          ]}
        />
      }
      propsFrom="HeadlineBandProps"
      a11y={A11Y}
      whenToUse={{
        use: [
          "A dashboard opens with one figure that answers its first question, and two to four that answer the next.",
          "The figures differ in kind — people reached, funds released, seats sanctioned — and each needs its own phrase.",
          "A figure leads a card further down the page, and the reader should be able to jump to it.",
        ],
        avoid: [
          "The figures are of one kind and one period, read across a row — use KPI Row; this band is for a lead and its companions.",
          "There is one figure and no colour band is wanted — use Headline Figure on its own.",
          "The page is the head of one programme's dashboard — use Dashboard Header, which carries the name, the summary and the period, and no figures.",
          "A figure would have to be invented or modelled to fill the band — leave it out; three true figures beside the lead are better than four.",
        ],
      }}
      related={[
        { label: "Headline Figure", href: "/design-system/components/data-display/headline-figure", reason: "the figure this band draws, in every size" },
        { label: "KPI Row", href: "/design-system/components/dashboard/kpi-row", reason: "a row of like figures, each in its own tile" },
        { label: "Dashboard Header", href: "/design-system/components/dashboard/dashboard-header", reason: "the head of one dashboard, which carries no figures" },
        { label: "Dashboard Card", href: "/design-system/components/dashboard/dashboard-card", reason: "where a linked figure is explained" },
      ]}
      design={
        <>
          <section className="cdp__section" aria-labelledby="cdp-summary-detail">
            <h2 id="cdp-summary-detail" className="cdp__h2">
              The Band Is the Summary, the Card the Detail
            </h2>
            <p>
              A figure in the band may repeat a figure from a card below. Give it an{" "}
              <code>href</code> to that card, so the repetition has a job: the band answers at a
              glance, and the link takes the reader to the definition and the source.
            </p>
            <p>
              A linked figure carries no provenance mark, because the link is the way to its
              explanation. Put the mark on the card it opens.
            </p>
          </section>
          <section className="cdp__section" aria-labelledby="cdp-hidden-heading">
            <h2 id="cdp-hidden-heading" className="cdp__h2">
              Named in the Outline, Not on Screen
            </h2>
            <p>
              The figures speak for themselves on screen, so <code>title</code> is visually hidden.
              It still names the band in the page outline, and a page that changes area can move
              focus to it with <code>headingId</code>.
            </p>
          </section>
        </>
      }
      code={
        <>
          <section className="cdp__section" aria-labelledby="cdp-figure-shape">
            <h2 id="cdp-figure-shape" className="cdp__h2">
              HeadlineBandFigure
            </h2>
            <PropsTable props={FIGURE_SHAPE} />
          </section>
          <section className="cdp__section" aria-labelledby="cdp-example">
            <h2 id="cdp-example" className="cdp__h2">
              Example
            </h2>
            <CodeBlock>{`import Link from "next/link";
import { HeadlineBand } from "@mosje/design-system";

<HeadlineBand
  title={\`At a Glance, \${areaName}\`}
  headingId="glance"
  lead={{ value: "34.83 Cr", label: "Total Outreach", context: "Persons reached since launch", mark: originChip }}
  figures={[
    { key: "fund", value: "₹67,977 Cr", label: "Total spend across 9 schemes", href: "#card-department" },
    { key: "seats", value: "28,865", label: "Seats Sanctioned", href: "#card-hostels" },
  ]}
  linkAs={Link}
/>`}</CodeBlock>
            <p>
              Values are passed formatted, in lakh and crore. The band does no rounding, because
              whether a figure reads as <code>34.83 Cr</code> or <code>34,83,34,090</code> depends on
              what the page is for.
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
            The inverse ink&rsquo;s contrast against each tone&rsquo;s fill is inherited from
            Card&rsquo;s <code>fill</code> accent, which draws a gradient, and has not been measured
            for every tone in every brand mode. Check the tone you choose before shipping.
          </p>
        </section>
      }
    />
  );
}
