import type { Metadata } from "next";
import * as React from "react";

import { CodeBlock, ComponentDocPage, type A11yItem } from "@/components/design-system/docs-kit";

import { BreadcrumbSpecimen } from "./specimen";

export const metadata: Metadata = {
  title: "Breadcrumb — Design System",
  description: "The trail showing where a page sits, with the current page as the last, non-interactive crumb.",
};

const A11Y: A11yItem[] = [
  {
    criterion: "1.3.1 Info and Relationships",
    level: "A",
    status: "verified",
    evidence:
      "The trail is a `<nav>` containing an ordered list, so a screen reader announces it as a navigation landmark with a countable number of steps.",
    description: "A row of links separated by slashes is not a trail to anything that cannot see the slashes.",
  },
  {
    criterion: "4.1.2 Name, Role, Value",
    level: "A",
    status: "verified",
    evidence:
      "The `<nav>` carries an accessible name (`label`, default “Breadcrumb”), so a page with several landmarks can be told apart.",
    description: "Two unnamed navigation landmarks on one page are indistinguishable in a landmark list.",
  },
  {
    criterion: "2.4.8 Location",
    level: "AAA",
    status: "verified",
    evidence: "The last crumb is the current page, is never a link, and is the only one marked `aria-current=\"page\"`.",
    description:
      "Claimed as AAA because the component satisfies it, not because the estate targets AAA — the estate targets 2.2 AA.",
  },
  {
    criterion: "1.4.10 Reflow",
    level: "AA",
    status: "verified",
    evidence:
      "Measured at a 320px viewport 2026-09-02: the trail renders 174px wide with no internal horizontal scroll, wrapping to a second line rather than overflowing. (The documentation page around it does overflow at that width, from chrome outside this component.)",
    description: "Pass `wrap={false}` inside a fixed-width rail, where a second line would change the panel's height on every drill.",
  },
];

export default function BreadcrumbPage(): React.JSX.Element {
  return (
    <ComponentDocPage
      name="Breadcrumb"
      status="Stable"
      summary="The trail showing where a page sits in the estate. Ancestors are real links; the last crumb is the page you are on, is never interactive, and is the only one marked as current."
      figma={{ absent: "Not yet drawn in the Figma library. The Figma counterpart is outstanding." }}
      specimen={<BreadcrumbSpecimen />}
      propsFrom="BreadcrumbProps"
      props={[
        {
          name: "items[].label",
          type: "string",
          required: true,
          description: "The crumb's text. The last item's label is the current page.",
        },
        {
          name: "items[].href",
          type: "string",
          description:
            "Where the crumb goes. Omit on the LAST item — the current page is not a link to itself. A crumb with an href renders a real <a>, so it is shareable, middle-clickable and works before hydration.",
        },
      ]}
      a11y={A11Y}
      whenToUse={{
        use: [
          "A page more than one level below a section's landing page.",
          "A document or scheme reached from a listing, where the reader needs the way back up.",
          "Any page a citizen can arrive at from a search engine, with no idea where they are.",
        ],
        avoid: [
          "A top-level page — a trail with one crumb tells nobody anything.",
          "A wizard or a multi-step form — that is a Stepper, which shows progress rather than place.",
          "Replacing the back button: a breadcrumb describes structure, not history.",
        ],
      }}
      related={[
        { label: "Stepper", href: "/design-system/components/feedback/stepper", reason: "progress through a process, not place in a structure" },
        { label: "Site Header", href: "/design-system/components/section-templates/site-header", reason: "the estate's primary navigation" },
        { label: "Pagination", href: "/design-system/components/navigation/pagination", reason: "moving through a set, not up a hierarchy" },
      ]}
      code={
        <section className="cdp__section" aria-labelledby="cdp-example">
          <h2 id="cdp-example" className="cdp__h2">
            Example
          </h2>
          <CodeBlock>{`import { Breadcrumb } from "@mosje/design-system";

<Breadcrumb
  items={[
    { label: "Home", href: "/website" },
    { label: "Schemes", href: "/website/schemes" },
    { label: "Pre-Matric Scholarship for SC Students" },  // no href: this IS the page
  ]}
/>`}</CodeBlock>
          <p>
            The last item never takes an <code>href</code>. A page that links to itself gives the
            reader a control that appears to do something and does nothing.
          </p>
        </section>
      }
    />
  );
}
