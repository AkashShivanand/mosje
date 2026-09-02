import type { Metadata } from "next";
import * as React from "react";

import {
  CodeBlock,
  ComponentDocPage,
  PropsTable,
  type A11yItem,
} from "@/components/design-system/docs-kit";
import { Skeleton, SkeletonText } from "@mosje/design-system";

export const metadata: Metadata = {
  title: "Skeleton — Design System",
  description:
    "A placeholder in the shape of the result, shown while a request is in flight so the layout does not jump when the data lands.",
};

const A11Y: A11yItem[] = [
  {
    criterion: "1.1.1 Non-text Content",
    level: "A",
    description:
      'Every skeleton carries aria-hidden="true". The shapes carry no information — announcing them would read a row of empty boxes to somebody who cannot see that they are boxes.',
  },
  {
    criterion: "2.3.3 Animation from Interactions",
    level: "AAA",
    description: "The shimmer is switched off under prefers-reduced-motion.",
  },
  {
    criterion: "1.3.2 Meaningful Sequence",
    level: "A",
    description:
      "Because the placeholder occupies the same space as the result, nothing below it moves when the data lands — so a reader who has already started reading is not displaced.",
  },
  {
    criterion: "4.1.3 Status Messages",
    level: "AA",
    description:
      "This one is the consumer's, not the component's. The skeleton is silent by construction, so the region that owns the request must carry aria-busy and the announcement — see the note in the Accessibility tab.",
  },
];

export default function SkeletonPage(): React.JSX.Element {
  return (
    <ComponentDocPage
      name="Skeleton"
      status="Stable"
      summary="A placeholder drawn in the shape of the result it is standing in for, shown while a request is in flight. Because it occupies the same space as the eventual content, the layout does not jump when the data lands."
      figma={{ absent: "Not yet published in the Figma library." }}
      specimen={
        <div className="cdp__specimen-stack">
          <SkeletonText lines={3} />
          <Skeleton height="2.5rem" width="9rem" />
          <Skeleton circle height="3rem" width="3rem" />
        </div>
      }
      propsFrom="SkeletonProps"
      a11y={A11Y}
      whenToUse={{
        use: [
          "The shape of the result is known before it arrives — a table of rows, a card, a paragraph, an avatar.",
          "The region is large enough that a blank space would read as broken rather than as busy.",
          "A page is loading several regions and each should show its own progress in place.",
        ],
        avoid: [
          "The result has no predictable shape — use a Loader, which says a wait is happening without pretending to know what will fill it.",
          "The wait is inside a control, where there is nowhere for a placeholder to go — use a Loader at its small size.",
          "The request has already answered with nothing — use an Empty State; a skeleton that never resolves reads as a page that has hung.",
          "How far along the work is can be stated — use Progress.",
        ],
      }}
      related={[
        {
          label: "Loader",
          href: "/design-system/components/feedback/loader",
          reason: "when the shape of the result is unknown",
        },
        {
          label: "Empty State",
          href: "/design-system/components/feedback/empty-state",
          reason: "once the request answers with nothing",
        },
        {
          label: "Live Region",
          href: "/design-system/components/utilities/live-region",
          reason: "to announce the wait, which the skeleton itself cannot",
        },
      ]}
      design={
        <>
          <section className="cdp__section" aria-labelledby="cdp-shape">
            <h2 id="cdp-shape" className="cdp__h2">
              Match the Shape, Not the Content
            </h2>
            <p>
              A skeleton earns its place by holding the space the result will take. Three lines of
              placeholder above a table that turns out to be eight rows tall is a page that still
              jumps — which is the defect the component exists to prevent.
            </p>
            <p>
              <code>SkeletonText</code> and <code>SkeletonRow</code> exist so the two commonest
              shapes need no measuring. <code>SkeletonRow</code> emits real{" "}
              <code>&lt;td&gt;</code> cells, which is what keeps a data table&apos;s column widths
              stable across the swap.
            </p>
          </section>
          <section className="cdp__section" aria-labelledby="cdp-restraint">
            <h2 id="cdp-restraint" className="cdp__h2">
              Keep the Shimmer Quiet
            </h2>
            <p>
              The shimmer says the page is working. A high-contrast sweep across a full screen of
              placeholders says it is flashing. The animation is low-contrast by design and stops
              entirely under <code>prefers-reduced-motion</code>; do not override either.
            </p>
          </section>
        </>
      }
      code={
        <>
        <section className="cdp__section" aria-labelledby="cdp-text-props">
          <h2 id="cdp-text-props" className="cdp__h2">
            SkeletonText Props
          </h2>
          <PropsTable from="SkeletonTextProps" />
        </section>
        <section className="cdp__section" aria-labelledby="cdp-row-props">
          <h2 id="cdp-row-props" className="cdp__h2">
            SkeletonRow Props
          </h2>
          <PropsTable from="SkeletonRowProps" />
        </section>
        <section className="cdp__section" aria-labelledby="cdp-example">
          <h2 id="cdp-example" className="cdp__h2">
            Example
          </h2>
          <CodeBlock>{`import { Skeleton, SkeletonText, SkeletonRow } from "@mosje/design-system";

<Skeleton height="1.5rem" width="60%" />
<SkeletonText lines={3} />
<Skeleton circle height="2.5rem" width="2.5rem" />`}</CodeBlock>
          <p>
            In a table, the placeholder rows are real rows, so the header and the column widths do
            not move when the data arrives.
          </p>
          <CodeBlock>{`<tbody aria-busy={loading}>
  {loading
    ? Array.from({ length: 5 }, (_, i) => <SkeletonRow key={i} cols={6} />)
    : rows.map((row) => <ApplicationRow key={row.id} {...row} />)}
</tbody>`}</CodeBlock>
        </section>
        </>
      }
      accessibility={
        <section className="cdp__section" aria-labelledby="cdp-announce">
          <h2 id="cdp-announce" className="cdp__h2">
            The Skeleton Is Silent — the Region Is Not
          </h2>
          <p>
            Every skeleton is <code>aria-hidden</code>. That is correct: the shapes mean nothing, and
            reading out a dozen empty boxes tells a screen-reader user less than saying nothing at
            all.
          </p>
          <p>
            The consequence is that the announcement is the consumer&apos;s job.{" "}
            <strong>A region rendering skeletons must say so itself</strong> — put{" "}
            <code>aria-busy</code> on the container that owns the request, and announce the outcome
            through a live region when it resolves. A page that swaps skeletons for content with no
            announcement changes silently for anyone not watching it.
          </p>
          <CodeBlock>{`<section aria-busy={loading} aria-live="polite">
  {loading ? <SkeletonText lines={4} /> : <SchemeSummary data={data} />}
</section>`}</CodeBlock>
        </section>
      }
    />
  );
}
