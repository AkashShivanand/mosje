import type { Metadata } from "next";
import * as React from "react";

import {
  CodeBlock,
  ComponentDocPage,
  type A11yItem,
  type PropDef,
} from "@/components/design-system/docs-kit";

import { EmptyStatePlayground } from "./empty-state-playground";

export const metadata: Metadata = {
  title: "Empty State — Design System",
  description:
    "The answer a reader gets when a list, table or dashboard has nothing to show: what is absent, why, and what they can do next.",
};

/*
 * Read off `EmptyStateProps` in
 * packages/design-system/components/feedback/empty-state.tsx. The interface
 * extends `Omit<React.HTMLAttributes<HTMLDivElement>, "title">`, so every
 * standard div attribute passes through and is not listed individually.
 */
const PROPS: PropDef[] = [
  {
    name: "title",
    type: "React.ReactNode",
    required: true,
    description:
      "The reader's answer, in the department's register — “No applications submitted yet”, not “No data”.",
  },
  {
    name: "description",
    type: "React.ReactNode",
    default: "undefined",
    description:
      "One sentence of context, and only where the context changes what the reader should do. A reason that leads nowhere belongs in the audit record, not on the page.",
  },
  {
    name: "action",
    type: "React.ReactNode",
    default: "undefined",
    description:
      "The way out — start an application, clear the filters, go back. An empty state with no exit is a dead end.",
  },
  {
    name: "icon",
    type: "React.ReactNode",
    default: "undefined",
    description:
      "An illustration above the title. Decorative: it is wrapped in an aria-hidden container, so it must never be the only thing that says what is empty.",
  },
  {
    name: "className",
    type: "string",
    default: "undefined",
    description: "Merged onto the root element.",
  },
];

const A11Y: A11yItem[] = [
  {
    criterion: "1.1.1 Non-text Content",
    level: "A",
    description:
      'The icon container carries aria-hidden="true", so a screen reader goes straight to the title and description rather than announcing a decorative shape.',
  },
  {
    criterion: "1.3.1 Info and Relationships",
    level: "A",
    description:
      "The title and description are ordinary paragraphs in reading order, not a heading that would insert a level into the page outline for a state that is temporary.",
  },
  {
    criterion: "3.3.1 Error Identification",
    level: "A",
    description:
      "Where the emptiness is caused by the reader's own filter, the copy names the filter and how to clear it — which is a different sentence from “nothing has been published”.",
  },
  {
    criterion: "2.4.4 Link Purpose (In Context)",
    level: "A",
    description:
      "The action slot holds a real control carrying its own accessible name, so “Start a new application” is announced as what it does rather than as “button”.",
  },
];

export default function EmptyStatePage(): React.JSX.Element {
  return (
    <ComponentDocPage
      name="Empty State"
      status="Stable"
      summary="A centred placeholder for a list, table or dashboard that has nothing to show. It gives the reader the answer to the question they asked, the reason where the reason matters, and a way forward."
      figma={{ node: "emptyState" }}
      specimen={<EmptyStatePlayground />}
      props={PROPS}
      a11y={A11Y}
      whenToUse={{
        use: [
          "A collection is genuinely empty — nothing has been submitted, published or recorded yet.",
          "A search or a filter matched nothing, and the reader needs to be told which filter did it.",
          "A region has loaded successfully and has no rows; a blank panel would read as broken.",
        ],
        avoid: [
          "The request has not answered yet — use a Skeleton in the shape of the result, so the layout does not jump when data lands.",
          "The request failed — use an Error View, which says it failed and offers the retry.",
          "The region has content and one condition to report about it — use an Alert above the content.",
          "The region is an invitation rather than an absence — use an Action Banner.",
        ],
      }}
      related={[
        {
          label: "Skeleton",
          href: "/design-system/components/feedback/skeleton",
          reason: "for the wait before the answer arrives",
        },
        {
          label: "Error View",
          href: "/design-system/components/feedback/error-view",
          reason: "when the request failed rather than returned nothing",
        },
        {
          label: "Alert",
          href: "/design-system/components/feedback/alert",
          reason: "when there is content and one condition to report",
        },
      ]}
      design={
        <>
          <section className="cdp__section" aria-labelledby="cdp-four">
            <h2 id="cdp-four" className="cdp__h2">
              Empty Is Not the Same as Filtered to Nothing
            </h2>
            <p>
              A surface that reads from somewhere else has seven states, and four of them render
              identically if nobody writes them: loading, empty, error and filtered-to-nothing.
              Empty State covers two of the four, and the wording has to tell them apart.
            </p>
            <ul>
              <li>
                <strong>Nothing published.</strong> “No tenders have been published for this
                division.” The reader can do nothing about it, so the action is a route elsewhere,
                or there is no action.
              </li>
              <li>
                <strong>Filtered to nothing.</strong> “No applications match the district and date
                you selected.” The reader caused this and can undo it, so the action clears the
                filter.
              </li>
            </ul>
            <p>
              Rendering one of those for the other is a page telling the reader something untrue
              about the department&apos;s records.
            </p>
          </section>
          <section className="cdp__section" aria-labelledby="cdp-copy">
            <h2 id="cdp-copy" className="cdp__h2">
              Writing the Copy
            </h2>
            <p>
              The title answers the question the reader asked. The description earns its place only
              where the reason changes what they should do next — “Village names are not published
              for three states, so a village there cannot be found by name” stops a reader
              concluding their village is outside the scheme. A count of unusable records does not
              earn its place; that belongs in the audit record.
            </p>
          </section>
        </>
      }
      code={
        <section className="cdp__section" aria-labelledby="cdp-example">
          <h2 id="cdp-example" className="cdp__h2">
            Example
          </h2>
          <CodeBlock>{`import { EmptyState, Icon, Button } from "@mosje/design-system";

<EmptyState
  icon={<Icon name="folder_open" size={40} />}
  title="No Applications Submitted Yet"
  description="Applications you submit will be listed here, with their current status."
  action={<Button variant="primary">Start an Application</Button>}
/>`}</CodeBlock>
          <p>
            The filtered case is the same component with different words, and the action undoes what
            the reader did rather than offering something new.
          </p>
          <CodeBlock>{`<EmptyState
  title="No Applications Match These Filters"
  description="No application in this district was submitted in the selected period."
  action={<Button variant="neutral" onClick={clearFilters}>Clear Filters</Button>}
/>`}</CodeBlock>
        </section>
      }
      accessibility={
        <section className="cdp__section" aria-labelledby="cdp-swap">
          <h2 id="cdp-swap" className="cdp__h2">
            Replacing a Region, Not Announcing an Event
          </h2>
          <p>
            An empty state is content, not a notification. It carries no live region and no{" "}
            <code>role=&quot;status&quot;</code>: it is what the region contains, so a screen reader
            meets it by reading the page rather than by being interrupted.
          </p>
          <p>
            Where the region swaps from a loading skeleton to an empty state after a fetch, the
            wrapper that owns the request is the right place for <code>aria-busy</code> and the
            announcement — see Live Region. The empty state itself stays quiet.
          </p>
          <p>
            The icon is hidden from assistive technology by construction, so the title has to name
            what is empty. A folder glyph over the word “Nothing here” tells a screen-reader user
            nothing at all.
          </p>
        </section>
      }
    />
  );
}
