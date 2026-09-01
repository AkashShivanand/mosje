import type { Metadata } from "next";
import * as React from "react";

import {
  CodeBlock,
  ComponentDocPage,
  type A11yItem,
} from "@/components/design-system/docs-kit";

import { LoaderPlayground } from "./loader-playground";

export const metadata: Metadata = {
  title: "Loader — Design System",
  description:
    "A spinner for a wait whose result has no known shape, announced to assistive technology through a live region and a visually hidden label.",
};

const A11Y: A11yItem[] = [
  {
    criterion: "4.1.3 Status Messages",
    level: "AA",
    description:
      'The root carries role="status" with aria-live="polite", so the wait is announced without moving focus and without interrupting whatever the reader is doing.',
  },
  {
    criterion: "1.1.1 Non-text Content",
    level: "A",
    description:
      'The spinning disc is aria-hidden="true" and the meaning is carried by the visually hidden label, so a screen reader hears words rather than nothing.',
  },
  {
    criterion: "1.4.11 Non-text Contrast",
    level: "AA",
    description:
      "The two variants exist so the spinner can be drawn against either a neutral or a brand surface rather than one colour being used on both.",
  },
  {
    criterion: "2.2.2 Pause, Stop, Hide",
    level: "A",
    description:
      "The spinner animates for the duration of a wait the reader started, which is the exception this criterion allows. It must not be left running on a page as decoration.",
  },
];

export default function LoaderPage(): React.JSX.Element {
  return (
    <ComponentDocPage
      name="Loader"
      status="Stable"
      summary="A spinner for a wait whose result has no known shape — a submission being processed, an action inside a button. It announces itself through a polite live region and a visually hidden label."
      figma={{ node: "loader" }}
      specimen={<LoaderPlayground />}
      propsFrom="LoaderProps"
      a11y={A11Y}
      whenToUse={{
        use: [
          "An action the reader started is in progress and the result has no layout to stand in for — saving, submitting, verifying.",
          "The wait sits inside a control, where a skeleton has nowhere to go: a button showing the small size while its request runs.",
          "The wait is short and the page does not otherwise change.",
        ],
        avoid: [
          "The eventual shape is known — a table, a card, a paragraph — use a Skeleton, so the layout does not jump when the data lands.",
          "The progress is measurable — use Progress, which can state how far along it is.",
          "Several regions on one page are loading at once — one spinner per page, or several polite live regions compete to announce the same wait.",
          "Nothing was actually requested. A spinner with no request behind it is a page pretending to be busy.",
        ],
      }}
      related={[
        {
          label: "Skeleton",
          href: "/design-system/components/feedback/skeleton",
          reason: "when the shape of the result is already known",
        },
        {
          label: "Progress",
          href: "/design-system/components/data-display/progress",
          reason: "when how far along it is can be stated",
        },
        {
          label: "Live Region",
          href: "/design-system/components/utilities/live-region",
          reason: "to announce the outcome once the wait ends",
        },
      ]}
      design={
        <section className="cdp__section" aria-labelledby="cdp-sizes">
          <h2 id="cdp-sizes" className="cdp__h2">
            Choosing a Size
          </h2>
          <ul>
            <li>
              <strong>sm</strong> — inside a button or a table cell, replacing the label while the
              request runs.
            </li>
            <li>
              <strong>md</strong> — the default, for a section or a card that is fetching.
            </li>
            <li>
              <strong>lg</strong> — a full panel or a route transition, where the spinner is the
              only thing on screen.
            </li>
          </ul>
          <p>
            Never show more than one on a screen at a time. Three spinners do not describe three
            waits to a reader; they describe a page that has stopped working.
          </p>
        </section>
      }
      code={
        <section className="cdp__section" aria-labelledby="cdp-example">
          <h2 id="cdp-example" className="cdp__h2">
            Example
          </h2>
          <CodeBlock>{`import { Loader } from "@mosje/design-system";

<Loader size="lg" label="Submitting your application…" />`}</CodeBlock>
          <p>
            Inside a button, the spinner replaces the label rather than sitting beside it, and the
            button is disabled for the duration so the request cannot be sent twice.
          </p>
          <CodeBlock>{`<Button variant="primary" disabled={saving}>
  {saving ? <Loader size="sm" variant="secondary" label="Saving…" /> : "Save"}
</Button>`}</CodeBlock>
        </section>
      }
      accessibility={
        <section className="cdp__section" aria-labelledby="cdp-label">
          <h2 id="cdp-label" className="cdp__h2">
            The Label Is the Whole Announcement
          </h2>
          <p>
            The spinner itself is hidden from assistive technology, so what a screen-reader user
            hears is exactly the string in <code>label</code>. The default, “Loading…”, is the least
            it can say; where the page knows what it is fetching, say that instead.
          </p>
          <p>
            The live region is <code>polite</code>, which means the announcement waits for a pause
            rather than interrupting. That is right for a wait: the reader started it and is not
            surprised by it.
          </p>
          <p>
            Because each Loader is its own live region, mounting several at once queues several
            announcements for one event. Where a whole region is loading, put a single Loader at the
            region level rather than one per row.
          </p>
        </section>
      }
    />
  );
}
