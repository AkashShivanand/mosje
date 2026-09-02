import type { Metadata } from "next";
import * as React from "react";

import {
  Callout,
  CodeBlock,
  ComponentDocPage,
  type A11yItem,
} from "@/components/design-system/docs-kit";
import { VisitorCounter } from "@mosje/design-system";

export const metadata: Metadata = {
  title: "Visitor Counter — Design System",
  description:
    "The “Total Visits” figure in the site footer, derived from a seeded baseline. Mock data by design, until a real analytics feed replaces it.",
};

const A11Y: A11yItem[] = [
  {
    criterion: "4.1.3 Status Messages",
    level: "AA",
    status: "verified",
    description:
      "The counter is deliberately NOT a live region. It changes on a timer and carries no task value, so announcing it every twelve seconds would talk over the page; the figure is named once through an aria-label on the wrapper instead.",
    evidence: "visitor-counter.tsx lines 51 and 85, with the reasoning stated in the component's own docstring.",
  },
  {
    criterion: "1.1.1 Non-text Content",
    level: "A",
    status: "verified",
    description:
      "The visible label and digits are aria-hidden and the wrapper carries the whole reading as its accessible name, so a screen reader hears “Total Visits: 2,47,112” once rather than a label and a number as two fragments.",
    evidence: "visitor-counter.tsx lines 85–91.",
  },
  {
    criterion: "2.3.3 Animation from Interactions",
    level: "AAA",
    status: "verified",
    description:
      "Ticking stops under prefers-reduced-motion, and setting tickSeconds to 0 freezes the figure after the first paint for anyone who wants it still.",
    evidence: "The reduced-motion guard in visitor-counter.tsx, documented in its docstring.",
  },
  {
    criterion: "1.3.2 Meaningful Sequence",
    level: "A",
    status: "verified",
    description:
      "The first paint renders a non-breaking space rather than a figure, because the value depends on the clock and server and client would otherwise disagree. The layout does not move when the real figure lands.",
    evidence: "visitor-counter.tsx holds `count` at null until mounted.",
  },
];

export default function VisitorCounterPage(): React.JSX.Element {
  return (
    <ComponentDocPage
      name="Visitor Counter"
      status="Beta"
      summary="The “Total Visits” figure in the site footer. It derives a consistent, gently ticking number from a seeded baseline rather than printing an invented constant."
      figma={{ absent: "Not yet published in the Figma library." }}
      specimen={
        <div className="cdp-stack">
          <VisitorCounter />
          <VisitorCounter label="Website Visits" />
          <VisitorCounter label="Frozen After First Paint" tickSeconds={0} />
        </div>
      }
      propsFrom="VisitorCounterProps"
      a11y={A11Y}
      whenToUse={{
        use: [
          "A site footer carries the visit count that GIGW expects a government website to publish.",
          "The figure should read as a live counter rather than as a static number nobody maintains.",
        ],
        avoid: [
          "The figure will be quoted. This is derived, not measured — see the note below, and replace it with a real feed before anyone cites it.",
          "The reading is a departmental statistic rather than site traffic — use a Metric Card, fed from the source that publishes the figure.",
          "The count needs to be announced as it changes. It is deliberately not a live region, and making it one would talk over the page every twelve seconds.",
        ],
      }}
      related={[
        { label: "Metric Card", href: "/design-system/components/data-display/metric-card", reason: "for a departmental figure rather than site traffic" },
        { label: "Site Footer", href: "/design-system/components/navigation/site-footer", reason: "where this counter lives" },
        { label: "Accessibility Bar", href: "/design-system/components/utilities/accessibility-bar", reason: "the other statutory element in the site chrome" },
        { label: "Live Region", href: "/design-system/components/utilities/live-region", reason: "for a figure that genuinely must be announced" },
      ]}
      design={
        <>
          <section className="cdp__section" aria-labelledby="cdp-mock">
            <h2 id="cdp-mock" className="cdp__h2">
              Mock Data, By Design
            </h2>
            <Callout type="warning" title="This figure is derived, not measured">
              There is no analytics backend on this estate. Rather than print an invented constant, the
              figure is derived: a <code>baseline</code> counted at <code>since</code>, extrapolated at{" "}
              <code>perDay</code>, ticking gently while the page is open. It moves like a real counter
              and is reproducible from its inputs — but it is not a measurement. Swap this
              component&apos;s props for a real feed before the site carries a number anyone might
              quote.
            </Callout>
            <p>
              The defaults are a baseline of 2,47,112 taken on 20 August 2026 at 1,940 visits a day.
              They are fixed so the arithmetic is reproducible, which is the difference between a
              placeholder that can be audited and one that cannot.
            </p>
          </section>
          <section className="cdp__section" aria-labelledby="cdp-hydration">
            <h2 id="cdp-hydration" className="cdp__h2">
              Why the First Paint Is Blank
            </h2>
            <p>
              The value depends on the current clock, so a server render and a client render would
              disagree and React would report a hydration mismatch. The component renders a
              non-breaking space until it has mounted, then fills the figure in — which also keeps the
              number out of the static HTML, where it would be stale the moment the page was built.
            </p>
            <p>
              The digits are set in <code>tabular-nums</code> so they do not jitter as they change, and
              ticking stops under <code>prefers-reduced-motion</code>. Setting{" "}
              <code>tickSeconds</code> to 0 freezes the figure after the first paint.
            </p>
          </section>
        </>
      }
      code={
        <section className="cdp__section" aria-labelledby="cdp-example">
          <h2 id="cdp-example" className="cdp__h2">
            Example
          </h2>
          <CodeBlock>{`import { VisitorCounter } from "@mosje/design-system";

// Footer default.
<VisitorCounter />

// Re-seeded from a real count, and frozen.
<VisitorCounter
  label="Website Visits"
  baseline={412_338}
  since="2026-09-01T00:00:00Z"
  perDay={2_110}
  tickSeconds={0}
/>`}</CodeBlock>
          <p>
            When a real analytics feed exists, the honest replacement is not new props on this component
            but a figure fetched on the server and rendered as text. Everything here — the
            extrapolation, the tick, the deferred first paint — exists because there is nothing to
            fetch.
          </p>
        </section>
      }
      accessibility={
        <section className="cdp__section" aria-labelledby="cdp-live">
          <h2 id="cdp-live" className="cdp__h2">
            Deliberately Not a Live Region
          </h2>
          <p>
            A changing figure looks like an obvious candidate for <code>aria-live</code>. It is not: the
            count changes on a timer rather than in response to anything the reader did, and announcing
            it every twelve seconds would interrupt whatever they were reading with a number they did
            not ask for.
          </p>
          <p>
            So the wrapper carries the whole reading as its accessible name, announced once when a
            reader reaches it, and the visible label and digits are hidden so it is not heard twice.
            Where a figure genuinely must be announced as it changes, that is what Live Region is for.
          </p>
        </section>
      }
    />
  );
}
