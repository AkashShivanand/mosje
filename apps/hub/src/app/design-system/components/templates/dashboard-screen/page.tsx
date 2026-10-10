import type { Metadata } from "next";
import * as React from "react";
import { CodeBlock, ComponentDocPage, MatrixTable, type A11yItem } from "@/components/design-system/docs-kit";
import { DashboardSpecimen } from "./dashboard-specimen";

export const metadata: Metadata = {
  title: "Dashboard Screen — Design System",
  description:
    "Figures about one programme or several, filtered by area and period: the way back, the area bar with its filters, one sentence where an area choice changes only part of the page, then the view.",
};

const A11Y: A11yItem[] = [
  {
    criterion: "4.1.3 Status Messages",
    level: "AA",
    description:
      "The area the figures are for is announced when it changes, without moving focus — \"Figures for Kerala\". While the view loads, the skeleton is announced as a wait, not read as an empty page.",
    status: "verified",
    evidence:
      "dashboard-screen.tsx renders the area line as `<p role=\"status\">`; screen-body.tsx renders the loading skeleton with `role=\"status\"` and `aria-busy=\"true\"`.",
  },
  {
    criterion: "2.4.3 Focus Order",
    level: "A",
    description:
      "When the view changes — a card opened, Back pressed — focus moves to the new view's first heading and the view scrolls to its top, as a page change would, so a keyboard or screen-reader user does not restart from the top of the page.",
    status: "verified",
    evidence:
      "dashboard-screen.tsx: an effect on `viewKey` (skipped on first render) focuses the panel's first h2 or h3, adding `tabindex=\"-1\"`, then calls `scrollIntoView`.",
  },
  {
    criterion: "3.2.2 On Input",
    level: "A",
    description:
      "Choosing a filter does not move the reader away from it: the page passes `shouldMoveFocus`, and focus stays on the filter so the reader can choose again.",
    status: "verified",
    evidence: "dashboard-screen.tsx reads `shouldMoveFocus()` before moving focus and returns without moving it when that is false.",
  },
];

export default function DashboardScreenPage(): React.JSX.Element {
  return (
    <ComponentDocPage
      name="Dashboard Screen"
      status="Beta"
      summary="Figures about one programme or several, for a reader who wants to know how things stand, filtered by area and period. The nineteenth screen template: the way back, the area bar with its filters, one sentence where an area choice changes only part of the page, then the view."
      figma={{ node: "screenTemplates" }}
      specimen={<DashboardSpecimen />}
      propsFrom="DashboardScreenProps"
      a11y={A11Y}
      whenToUse={{
        use: [
          "A public or officer dashboard: one programme or many, an area filter, views that open from one another.",
          "The page must say which area its figures are for, and change it without a full page load.",
          "Most of the page publishes All-India figures and only some sections follow the area — the area note says which.",
        ],
        avoid: [
          "A portal's signed-in home, with a greeting, four tiles and recent records — use Overview Screen.",
          "A tabular statement meant to be printed and filed — use Report Screen.",
          "A list the reader works through and acts on — use Worklist Screen; a dashboard is for reading.",
          "Anywhere a figure would have to be invented to fill a section — a programme with nothing to show is left off.",
        ],
      }}
      related={[
        { label: "Overview Screen", href: "/design-system/components/templates/overview-screen", reason: "a portal's signed-in home, not a dashboard" },
        { label: "Report Screen", href: "/design-system/components/templates/report-screen", reason: "a statement to print and file" },
        { label: "Screen Body", href: "/design-system/components/templates/screen-body", reason: "the seven states this template routes through" },
        { label: "Headline Band", href: "/design-system/components/dashboard/headline-band", reason: "the figures a dashboard opens with" },
        { label: "Dashboard Card", href: "/design-system/components/dashboard/dashboard-card", reason: "a page of dashboards, one card each" },
        { label: "KPI View", href: "/design-system/components/dashboard/kpi-view", reason: "a register reading drawn by its shape" },
      ]}
      design={
        <>
          <section className="cdp__section" aria-labelledby="cdp-order">
            <h2 id="cdp-order" className="cdp__h2">The Order Is the Reader&rsquo;s</h2>
            <MatrixTable
              caption="What the template draws, top to bottom, and the question each answers"
              columns={["Band", "Holds", "Answers"]}
              rows={[
                ["Notice", "Who the page is drawn for, where it is not the public", "Whose view is this"],
                ["Back", "All Dashboards", "How do I leave this dashboard"],
                ["Area bar", "Figures for All India, with State/UT, District and Financial Year", "Where, and when"],
                ["Area note", "One sentence, only where an area choice changes part of the page", "Why did this section not change"],
                ["View", "Headline Band, Dashboard Card List, Dashboard Header, KPI View, Area Breakdown", "How do things stand"],
              ]}
            />
          </section>

          <section className="cdp__section" aria-labelledby="cdp-area-note">
            <h2 id="cdp-area-note" className="cdp__h2">Say What an Area Choice Changed</h2>
            <p>
              Where most of the page publishes All-India figures only, a reader who picks a State
              and finds five of seven sections unchanged concludes the filter did not work. One
              sentence in <code>areaNote</code> names the sections that did change, and the cards
              that did not say so in their own <code>note</code>.
            </p>
          </section>

          <section className="cdp__section" aria-labelledby="cdp-focus">
            <h2 id="cdp-focus" className="cdp__h2">A New View Moves Focus; a Filter Does Not</h2>
            <p>
              <code>viewKey</code> is the view&rsquo;s identity, usually the URL&rsquo;s search
              string. When it changes, focus moves to the view&rsquo;s first heading, as it would on
              a new page. A filter is different: the reader may want to choose again, so the page
              returns false from <code>shouldMoveFocus</code> and focus stays where it was.
            </p>
          </section>

          <section className="cdp__section" aria-labelledby="cdp-states">
            <h2 id="cdp-states" className="cdp__h2">The Seven States Are the Template&rsquo;s</h2>
            <p>
              Pass <code>loading</code>, <code>error</code>, <code>count</code> and{" "}
              <code>filtered</code>, and the template resolves them once and draws the matching
              state through Screen Body. Each card inside the view still owns its own states, so one
              failing chart does not blank the dashboard around it.
            </p>
          </section>
        </>
      }
      code={
        <section className="cdp__section" aria-labelledby="cdp-example">
          <h2 id="cdp-example" className="cdp__h2">Example</h2>
          <CodeBlock>{`import Link from "next/link";
import { DashboardScreen, FilterSelect, HeadlineBand } from "@mosje/design-system";

<DashboardScreen
  back={programme ? { href: hrefTo({ programme: null }), label: "All Dashboards" } : undefined}
  linkAs={Link}
  area={state ?? "All India"}
  filters={<FilterSelect label="State / UT" value={state ?? "All India"} options={states}
    onChange={(v) => go({ state: v }, { keepFocus: true })} />}
  areaNote={state ? \`Figures for \${state} are published for NMBA. Other sections show All-India figures.\` : undefined}
  viewKey={searchParams.toString()}
  shouldMoveFocus={() => !keepFocus.current}
  loading={isLoading}
  error={error}
  count={programmes.length}
  onRetry={refetch}
>
  <HeadlineBand title={\`At a Glance, \${area}\`} lead={lead} figures={figures} />
  …
</DashboardScreen>`}</CodeBlock>
          <p>
            Pass <code>count</code>. The template resolves an unanswered count as empty, so a view
            that always has something to show still says so with <code>count=&#123;1&#125;</code>.
          </p>
        </section>
      }
      accessibility={
        <section className="cdp__section" aria-labelledby="cdp-heading">
          <h2 id="cdp-heading" className="cdp__h2">The Heading That Takes Focus</h2>
          <p>
            Focus lands on the first <code>h2</code> or <code>h3</code> in the view, so the view must
            open with one — a Dashboard Header, a Headline Band, or a Section Title. The heading
            takes focus as a landmark, not as a control, so it is drawn without a focus ring.
          </p>
          <p>
            Each section inside the view carries its own criteria: check the cards and charts you
            pass against their own pages, which is why they are not listed above.
          </p>
        </section>
      }
    />
  );
}
