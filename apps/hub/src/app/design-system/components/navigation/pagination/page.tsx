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
    criterion: "4.1.3 Status Messages",
    level: "AA",
    status: "verified",
    evidence:
      'In the button form a <p role="status" aria-live="polite"> carries "Page N of M" and updates on every change — read from the DOM after pressing Next to the last page of twelve: "Page 12 of 12". It is the VISIBLE position paragraph in the steps-only form and a visually hidden node in the numbered one, so the sentence is never in the accessibility tree twice. The link form renders neither, because a navigation announces itself and a second announcement would talk over the framework\'s own route announcer.',
    description:
      "Changing page swaps the rows and moves nothing else, so a screen-reader user is told where they now are.",
  },
  {
    criterion: "2.4.4 Link Purpose (In Context)",
    level: "A",
    status: "verified",
    evidence:
      'Read from the rendered DOM: each numbered control is `aria-label="Page 4"`, and the step controls are named in words — "Previous", "Next" — which stay in the accessibility tree at every width even where the CSS hides them. This row previously claimed the name was "Go to page 4"; the code has always said "Page 4", which is also what GOV.UK and USWDS publish, so the evidence was corrected rather than the label.',
    description: "“4” read out of context is not a purpose.",
  },
  {
    criterion: "2.1.1 Keyboard",
    level: "A",
    status: "verified",
    evidence:
      "With `hrefFor` the controls are anchors and inherit the browser's own keyboard handling; nothing is re-implemented. In the button form the ends stay mounted as `aria-disabled` buttons and the current page stays a `<button>`, so the tab stop never disappears under the reader — verified in a browser 2026-09-07: focusing a page number and pressing it leaves `document.activeElement` on the SAME node, and pressing Next to the last page leaves focus on Next. Both previously fell to `<body>`.",
    description: "This is the reason to prefer links: the accessible behaviour is the platform's, not ours.",
  },
  {
    criterion: "2.5.8 Target Size (Minimum)",
    level: "AA",
    status: "verified",
    evidence:
      "Measured in a browser 2026-09-02: all seven `md` controls render 40×40, well clear of the 24×24 floor. On a coarse pointer they now grow to 44×44 at an 8px pitch, which is what UX4G 3.0 §3 asks for. `size=\"sm\"` stays at 32×32 — past the WCAG floor, short of UX4G — because it exists for a pager inside a narrow rail where growing the boxes re-creates the wrap it was built to avoid, and the invisible-target expansion `Button` uses is ruled out for controls this close together (it would resolve an overlapping press by paint order). The divergence is recorded in the stylesheet.",
    description: "A page number is a small label, and it needed a target built around it rather than sized to it.",
  },
];

export default function PaginationPage(): React.JSX.Element {
  return (
    <ComponentDocPage
      name="Pagination"
      status="Stable"
      summary="Moving through a set of results a page at a time. It renders real links wherever the page number belongs in the URL, and falls back to a handler for state that has no URL of its own."
      figma={{ node: "pagination" }}
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
