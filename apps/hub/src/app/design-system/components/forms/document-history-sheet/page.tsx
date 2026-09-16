import type { Metadata } from "next";
import * as React from "react";

import { CodeBlock, ComponentDocPage, type A11yItem } from "@/components/design-system/docs-kit";

import { DocumentHistorySheetSpecimen } from "../document-checklist/document-centre-specimens";

export const metadata: Metadata = {
  title: "Document History Sheet — Design System",
  description: "Every version of one document in a side sheet — the current file first, then each earlier file, with what was said about it and why it was replaced.",
};

const A11Y: A11yItem[] = [
  {
    criterion: "2.4.3 Focus Order",
    level: "A",
    description: "The sheet is a SideSheet: focus moves into it on open and returns to the control that opened it on close.",
    status: "verified",
    evidence: "Measured with Playwright on this page's specimen, 16 Sep 2026: after Open Upload History, document.activeElement was inside [role=dialog]; after Escape it was the Open Upload History button.",
  },
  {
    criterion: "1.3.1 Info and Relationships",
    level: "A",
    description: "Versions are an ordered list, newest first, each marked Current or Earlier in text.",
    status: "verified",
    evidence: "Measured with Playwright on this page's specimen, 16 Sep 2026: OL with three LI; the first reads “Current”, the others “Earlier”.",
  },
];

export default function DocumentHistorySheetPage(): React.JSX.Element {
  return (
    <ComponentDocPage
      name="Document History Sheet"
      status="New"
      summary="Every version of one document, in a side sheet: the current file first, then each earlier file newest first, with what the check said about it and why it was replaced. A replaced file is never lost, and the applicant, the correction flow and the officer read the same log."
      figma={{ node: "documentHistorySheet" }}
      specimen={<DocumentHistorySheetSpecimen />}
      propsFrom="DocumentHistorySheetProps"
      a11y={A11Y}
      whenToUse={{
        use: ["Upload History, from a Document Row's menu, on any screen that shows documents."],
        avoid: ["A document's current file alone — open it with View instead."],
      }}
      related={[
        { label: "Document Row", href: "/design-system/components/forms/document-row", reason: "its menu opens the sheet" },
        { label: "Side Sheet", href: "/design-system/components/feedback/side-sheet", reason: "the sheet it renders in" },
      ]}
      design={
        <section className="cdp__section" aria-labelledby="cdp-order">
          <h2 id="cdp-order" className="cdp__h2">
            Current First
          </h2>
          <p>Pass entries current first, then earlier versions newest first. A version with an address opens through <code>linkAs</code>; one without takes <code>onView</code>.</p>
        </section>
      }
      code={
        <section className="cdp__section" aria-labelledby="cdp-example">
          <h2 id="cdp-example" className="cdp__h2">
            Example
          </h2>
          <CodeBlock>{`import Link from "next/link";

<DocumentHistorySheet
  open={open}
  onClose={close}
  title="Upload History — Budget Estimates"
  linkAs={Link}
  entries={[{ id: "1", fileName: "budget-v2.pdf", date: "16 Sep 2026", current: true, status: "Looks right" }]}
/>`}</CodeBlock>
        </section>
      }
      accessibility={
        <section className="cdp__section" aria-labelledby="cdp-a11y-notes">
          <h2 id="cdp-a11y-notes" className="cdp__h2">
            Notes
          </h2>
          <p>Each View link carries the file&rsquo;s name for assistive technology, so three Views are three different names.</p>
        </section>
      }
    />
  );
}
