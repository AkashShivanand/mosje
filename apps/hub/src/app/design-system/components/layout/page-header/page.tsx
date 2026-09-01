import type { Metadata } from "next";
import * as React from "react";

import {
  Callout,
  CodeBlock,
  ComponentDocPage,
  type A11yItem,
} from "@/components/design-system/docs-kit";
import { PageHeader } from "@mosje/design-system";

export const metadata: Metadata = {
  title: "Page Header — Design System",
  description:
    "The row every portal page opens with: title, meta line, actions. It hugs its content and carries no fixed height.",
};


const A11Y: A11yItem[] = [
  {
    criterion: "1.3.1 Info and Relationships",
    level: "A",
    description:
      "Renders a real `<header>` containing a real `<h1>`. The meta line is a `<p>` outside the heading, so it does not become part of the page's accessible name.",
  },
  {
    criterion: "2.4.6 Headings and Labels",
    level: "AA",
    description:
      "The title is the page's subject stated once, at the top, in the words the reader arrived looking for.",
  },
  {
    criterion: "2.4.2 Page Titled",
    level: "A",
    description:
      "This is the visible half of the pairing; the document `<title>` is the other. Keep them consistent — a page whose tab says one thing and whose heading says another is disorienting for everyone and hardest on a screen-reader user.",
  },
  {
    criterion: "1.4.4 Resize Text",
    level: "AA",
    description:
      "The row hugs its content and carries no height of its own, so a two-line scheme name at 200% zoom grows the row instead of clipping the title.",
  },
  {
    criterion: "1.4.10 Reflow",
    level: "AA",
    description:
      "Actions wrap below the title on a narrow viewport rather than squeezing it, so nothing overflows at 320 CSS px.",
  },
];

export default function PageHeaderPage(): React.JSX.Element {
  return (
    <ComponentDocPage
      name="Page Header"
      status="Stable"
      summary="The row every portal page opens with: title, meta line, actions. It hugs its content and carries no height of its own, because a two-line scheme name and a one-line dashboard title are both correct and the row must fit either."
      figma={{
        absent:
          "The page header is a page-composition rule rather than a published master; the SAMAVESH library documents its type roles on the Text Styles page.",
      }}
      specimen={
        <PageHeader
          title="PM-AJAY Grant Application"
          meta="Last updated: 27 August 2026, 3:05 pm"
        />
      }
      propsFrom="PageHeaderProps"
      a11y={A11Y}
      whenToUse={{
        use: [
          "The opening row of a signed-in portal page — a dashboard, a list, a record.",
          "A page whose title needs a provenance or timestamp line beneath it.",
          "A page with one or two page-level actions, such as “New Application” or “Export”.",
        ],
        avoid: [
          "A heading inside the page — use Section Title, which labels a section rather than the page.",
          "A public website page hero — that is a Band with its own hero content.",
          "Stacking four buttons — the header carries page-level actions, not a toolbar.",
        ],
      }}
      related={[
        {
          label: "Section Title",
          href: "/design-system/components/layout/section",
          reason: "for a heading inside the page rather than the page's own",
        },
        {
          label: "App Shell",
          href: "/design-system/components/layout/app-shell",
          reason: "the portal skeleton this header opens",
        },
        {
          label: "Button",
          href: "/design-system/components/actions/button",
          reason: "what goes in the actions slot",
        },
      ]}
      design={
        <>
          <section className="cdp__section" aria-labelledby="cdp-hug">
            <h2 id="cdp-hug" className="cdp__h2">
              It Hugs, and That Is the Point
            </h2>
            <p>
              The row carries no height. A one-line dashboard title and a two-line scheme name are
              both correct, and pinning a height makes one of them wrong — either the short title
              floats in empty space or the long one clips. The same reasoning applies to the
              actions: they wrap below the title on a narrow viewport rather than compressing it,
              because a truncated page title is worse than a taller header.
            </p>
          </section>

          <section className="cdp__section" aria-labelledby="cdp-actions">
            <h2 id="cdp-actions" className="cdp__h2">
              What Belongs in the Actions Slot
            </h2>
            <p>
              Actions that operate on the <strong>page</strong> — creating a new record, exporting
              the list, printing the view. An action that operates on one row belongs beside that
              row, and a filter belongs with the thing it filters, not in the page header where it
              reads as a page-level control.
            </p>
            <Callout type="info" title="One primary action">
              A page has one primary action at most. A second primary button beside it makes the
              reader choose before they have read the page, and on a government service that
              choice is usually the wrong one.
            </Callout>
          </section>
        </>
      }
      code={
        <section className="cdp__section" aria-labelledby="cdp-example">
          <h2 id="cdp-example" className="cdp__h2">
            Example
          </h2>
          <CodeBlock>{`import { PageHeader } from "@mosje/design-system";

<PageHeader
  title="PM-AJAY Grant Application"
  meta={<>Last updated: <time dateTime="2026-08-27T15:05">27 August 2026, 3:05 pm</time></>}
/>`}</CodeBlock>
          <p>
            With actions, and with the heading named so the page body can reference it:
          </p>
          <CodeBlock>{`<PageHeader
  headingId="page-title"
  title="Applications"
  meta="128 applications across 12 districts"
  actions={
    <>
      <Button variant="outlined">Export</Button>
      <Button>New Application</Button>
    </>
  }
/>`}</CodeBlock>
        </section>
      }
      accessibility={
        <section className="cdp__section" aria-labelledby="cdp-h1">
          <h2 id="cdp-h1" className="cdp__h2">
            One h1 Per Page
          </h2>
          <p>
            <code>as</code> defaults to 1 because this component is the page&apos;s{" "}
            <code>&lt;h1&gt;</code>. Rendering a second one — in a hero, in a card, in a heading
            you wanted at that size — leaves a screen-reader user with two candidates for the
            page&apos;s subject and no way to tell which is it. Drop to <code>as=&#123;2&#125;</code>{" "}
            only where this header sits inside a page whose <code>h1</code> is elsewhere.
          </p>
          <p>
            The meta line sits outside the heading element. That is deliberate: folding
            &ldquo;Last updated 27 August 2026&rdquo; into the <code>h1</code> would make the
            page&apos;s accessible name change every time the record is edited, and a heading
            list would read as a list of timestamps.
          </p>
        </section>
      }
    />
  );
}
