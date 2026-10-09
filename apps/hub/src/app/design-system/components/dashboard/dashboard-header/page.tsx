import type { Metadata } from "next";
import Link from "next/link";
import * as React from "react";

import { CodeBlock, ComponentDocPage, type A11yItem } from "@/components/design-system/docs-kit";
import { Button, DashboardHeader, Icon, OrgLogo, shownDate } from "@mosje/design-system";
import { DEPARTMENT_DASHBOARD_AS_ON } from "@/lib/website-shared/dashboard";
import { PORTAL_DASHBOARDS } from "@/lib/kpi/register";

export const metadata: Metadata = {
  title: "Dashboard Header — Design System",
  description:
    "The head of a dashboard page: whose dashboard it is, one sentence on what the scheme does, the period the figures describe, and the one way out — in the colour of the dashboard.",
};

/*
 * Both specimens are the Beneficiary Dashboard's own heads: the Department's (its words as
 * the website draws them, as on 5 Oct 2026) and NMBA's, read from the KPI register
 * (`lib/kpi/register.ts`) so the summary and period are the register's, not re-typed.
 */
const nmba = PORTAL_DASHBOARDS.find((p) => p.slug === "nmba");

const A11Y: A11yItem[] = [
  {
    criterion: "1.3.1 Info and Relationships",
    level: "A",
    description:
      "The title is a real heading at the level the page chooses, with the scheme's name as its description, so the dashboard's name leads the page outline.",
    status: "verified",
    evidence:
      "dashboard-header.tsx renders `SectionTitle as={headingLevel} title={title} description={subtitle}`; `headingLevel` defaults to 2.",
  },
  {
    criterion: "1.4.10 Reflow",
    level: "AA",
    description:
      "Below 1024px the brand, the action and the text stack in one column, so the header does not scroll sideways at 320px.",
    status: "verified",
    evidence:
      "dashboard-band.css: `@media (max-width: 1023px) { .ds-dashboard-header__body { grid-template-columns: minmax(0, 1fr) } }`.",
  },
  {
    criterion: "1.4.4 Resize Text",
    level: "AA",
    description:
      "The summary and the period are set on the --sa-type-* scale, which is authored in rem, so they follow the reader's text-size choice.",
    status: "verified",
    evidence:
      "dashboard-band.css sets the summary to --sa-type-body-1-size and the period to --sa-type-body-3-size; tokens.css defines --sa-type-body-1-size as 1rem.",
  },
];

export default function DashboardHeaderPage(): React.JSX.Element {
  return (
    <ComponentDocPage
      name="Dashboard Header"
      status="Beta"
      summary="The head of one dashboard's page: whose dashboard it is, one sentence on what the scheme does, the period the figures describe, and the one way out, in the dashboard's colour. It carries no figures; the cards below carry them, with their definitions."
      figma={{
        absent:
          "Not yet drawn in the SAMAVESH library. Extracted from the built Beneficiary Dashboard in October 2026; the Figma master follows in the next pass, and the code is authoritative until it exists.",
      }}
      specimen={
        <div className="cdp-stack">
          <DashboardHeader
            tone="primary"
            mark={<OrgLogo path={null} size="md" name="" />}
            title="Department of Social Justice and Empowerment"
            subtitle="Beneficiary Dashboard"
            summary="Scholarships, fellowships, hostels and top class education for students from Scheduled Castes, Other Backward Classes, Economically Backward Classes and Denotified Tribes."
            meta={`As on ${shownDate(DEPARTMENT_DASHBOARD_AS_ON)}`}
            headingLevel={3}
          />
          {nmba ? (
            <DashboardHeader
              tone="success"
              mark={<OrgLogo path={nmba.logoPath} size="md" name="" />}
              title={nmba.portal}
              subtitle={nmba.name}
              summary={nmba.summary}
              meta={nmba.period}
              headingLevel={3}
              action={
                <Button
                  appearance="outlined"
                  tone="inverse"
                  size="sm"
                  href={nmba.portalHref}
                  linkAs={Link}
                  iconRight={<Icon name="arrow_outward" size={16} />}
                >
                  Open Portal
                </Button>
              }
            />
          ) : null}
        </div>
      }
      propsFrom="DashboardHeaderProps"
      a11y={A11Y}
      whenToUse={{
        use: [
          "The page is one programme's or the Department's dashboard, opened from a list of dashboards.",
          "The reader needs to know whose figures these are, what the scheme does, and the period the figures describe, before the first figure.",
        ],
        avoid: [
          "The head would carry figures — put them in the cards below, where they are defined and sourced; a figure in the head repeats one the page already shows.",
          "The page is a portal's signed-in home, with a greeting and actions — use Page Header inside Overview Screen.",
          "The page lists several dashboards — lead with Headline Band, and let each Dashboard Card name its own dashboard.",
          "There is more than one way out — the header holds one action; put the rest in the page's navigation.",
        ],
      }}
      related={[
        { label: "Headline Band", href: "/design-system/components/dashboard/headline-band", reason: "the coloured band that leads a list of dashboards, with figures" },
        { label: "Page Header", href: "/design-system/components/layout/page-header", reason: "a portal page's title, actions and status" },
        { label: "Section Title", href: "/design-system/components/layout/section-title", reason: "the heading this header renders" },
        { label: "Dashboard Screen", href: "/design-system/components/templates/dashboard-screen", reason: "the screen this header opens" },
      ]}
      design={
        <>
          <section className="cdp__section" aria-labelledby="cdp-nothing-twice">
            <h2 id="cdp-nothing-twice" className="cdp__h2">
              Nothing the Page Says Again Below
            </h2>
            <p>
              The banner this replaced carried a line repeating its own title, four figures
              repeating the cards under it, and the portal&rsquo;s name twice. What is left is what
              only the head can say: whose dashboard, what the scheme does, and when.
            </p>
            <p>
              Write <code>summary</code> in the Department&rsquo;s words, one sentence long. Where the
              body that runs the portal is not the Department itself, name it in <code>meta</code>{" "}
              after the period.
            </p>
          </section>
          <section className="cdp__section" aria-labelledby="cdp-mark">
            <h2 id="cdp-mark" className="cdp__h2">
              The Organisation&rsquo;s Own Mark, or None
            </h2>
            <p>
              The mark sits on a white ground so an organisation&rsquo;s colours are not lost on the
              band. Use the organisation&rsquo;s own mark; where it has none, leave{" "}
              <code>mark</code> out rather than standing a generic icon or the State Emblem in its
              place.
            </p>
          </section>
        </>
      }
      code={
        <section className="cdp__section" aria-labelledby="cdp-example">
          <h2 id="cdp-example" className="cdp__h2">
            Example
          </h2>
          <CodeBlock>{`import Link from "next/link";
import { Button, DashboardHeader, Icon, OrgLogo } from "@mosje/design-system";

<DashboardHeader
  tone="success"
  mark={<OrgLogo path="/portals/nmba" size="md" name="" />}
  title="NMBA"
  subtitle="Nasha Mukt Bharat Abhiyaan"
  summary={programme.summary}
  meta={programme.period}
  headingId="programme"
  action={
    <Button appearance="outlined" tone="inverse" size="sm" href="/portals/nmba" linkAs={Link}
      iconRight={<Icon name="arrow_outward" size={16} />}>
      Open Portal
    </Button>
  }
/>`}</CodeBlock>
          <p>
            Inside Dashboard Screen, the header&rsquo;s title is usually the view&rsquo;s first
            heading, so it is where focus lands when the reader opens the dashboard. Give it a{" "}
            <code>headingId</code> where another part of the page links to it.
          </p>
        </section>
      }
      accessibility={
        <section className="cdp__section" aria-labelledby="cdp-not-measured">
          <h2 id="cdp-not-measured" className="cdp__h2">
            Not Yet Measured
          </h2>
          <p>
            The inverse ink&rsquo;s contrast against each tone&rsquo;s fill is inherited from
            Card&rsquo;s <code>fill</code> accent and has not been measured for every tone in every
            brand mode. The mark takes no accessible name, because the title names the dashboard;
            pass <code>name=&quot;&quot;</code> to the Organisation Logo.
          </p>
        </section>
      }
    />
  );
}
