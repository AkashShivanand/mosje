import type { Metadata } from "next";
import * as React from "react";

import { CodeBlock, ComponentDocPage, type A11yItem } from "@/components/design-system/docs-kit";

import { PaginationSpecimen } from "./specimen";

export const metadata: Metadata = {
  title: "Pagination — Design System",
  description: "Moving through a set of results a page at a time, as real links wherever the page number belongs in the URL.",
};

const A11Y: A11yItem[] = [
  {
    criterion: "4.1.2 Name, Role, Value",
    level: "A",
    status: "verified",
    evidence:
      "The control is a named `<nav>` (default “Pagination”), and the current page carries `aria-current=\"page\"`.",
    description: "A row of numbers is not navigation to anything that cannot see the row.",
  },
  {
    criterion: "2.4.4 Link Purpose (In Context)",
    level: "A",
    status: "verified",
    evidence:
      "Each control has an accessible name naming its destination — “Go to page 4”, not “4” — so a link list is usable.",
    description: "“4” read out of context is not a purpose.",
  },
  {
    criterion: "2.1.1 Keyboard",
    level: "A",
    status: "verified",
    evidence:
      "With `hrefFor` the controls are anchors and inherit the browser's own keyboard handling; nothing is re-implemented.",
    description: "This is the reason to prefer links: the accessible behaviour is the platform's, not ours.",
  },
  {
    criterion: "2.5.8 Target Size (Minimum)",
    level: "AA",
    status: "verified",
    evidence:
      "Measured in a browser 2026-09-02: all seven controls render 40×40, well clear of the 24×24 floor. The page numbers are the densest targets in the control, so they are the ones that decide it.",
    description: "A page number is a small label, and it needed a target built around it rather than sized to it.",
  },
];

export default function PaginationPage(): React.JSX.Element {
  return (
    <ComponentDocPage
      name="Pagination"
      status="Stable"
      summary="Moving through a set of results a page at a time. It renders real links wherever the page number belongs in the URL, and falls back to a handler for state that has no URL of its own."
      figma={{ absent: "Not yet drawn in the Figma library. The Figma counterpart is outstanding." }}
      specimen={<PaginationSpecimen />}
      propsFrom="PaginationProps"
      a11y={A11Y}
      whenToUse={{
        use: [
          "A result set, document listing or register too long for one page.",
          "Anything whose page number belongs in the URL — pass `hrefFor` and it becomes shareable.",
          "A table whose row count would otherwise grow the page without limit.",
        ],
        avoid: [
          "A feed a reader scrolls continuously — pagination interrupts that deliberately, which is right for a register and wrong for a timeline.",
          "Fewer than two pages: `totalPages` below 1 renders nothing, by design.",
        ],
      }}
      related={[
        { label: "Data Table", href: "/design-system/components/data-display/data-table", reason: "the table this usually sits under" },
        { label: "Breadcrumb", href: "/design-system/components/navigation/breadcrumb", reason: "place in a hierarchy, not position in a set" },
      ]}
      code={
        <section className="cdp__section" aria-labelledby="cdp-example">
          <h2 id="cdp-example" className="cdp__h2">
            Prefer Links
          </h2>
          <CodeBlock>{`// PREFERRED — the page number is in the URL
<Pagination page={page} totalPages={12} hrefFor={(p) => \`?page=\${p}\`} />

// For client-side state with no URL of its own
<Pagination page={page} totalPages={12} onPageChange={setPage} />`}</CodeBlock>
          <p>
            Links are shareable, survive the back button, work before hydration and are followed by
            a crawler — which matters on a government site whose registers people find through
            search. <code>onPageChange</code> is ignored when <code>hrefFor</code> is given.
          </p>
        </section>
      }
    />
  );
}
