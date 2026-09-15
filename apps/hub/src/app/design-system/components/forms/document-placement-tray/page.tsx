import type { Metadata } from "next";
import * as React from "react";

import { CodeBlock, ComponentDocPage, type A11yItem } from "@/components/design-system/docs-kit";

import { DocumentPlacementTraySpecimen } from "../document-checklist/document-centre-specimens";

export const metadata: Metadata = {
  title: "Document Placement Tray — Design System",
  description: "What a batch drop did: where each file went, what it replaced, what could not be placed and what was refused — each changeable in one step.",
};

const A11Y: A11yItem[] = [
  {
    criterion: "1.3.1 Info and Relationships",
    level: "A",
    description: "The tray is a section labelled by its summary, holding a list with one item per file.",
    status: "verified",
    evidence: "Measured with Playwright on this page's specimen, 16 Sep 2026: SECTION[aria-labelledby] resolves to “We placed 2 of 4 files.”, followed by UL with four LI.",
  },
  {
    criterion: "3.3.2 Labels or Instructions",
    level: "A",
    description: "Every document select is labelled for its file — “Choose a document for scan0043.pdf”.",
    status: "verified",
    evidence: "Measured with Playwright on this page's specimen, 16 Sep 2026: each SELECT has a LABEL[for] whose text names its file.",
  },
];

export default function DocumentPlacementTrayPage(): React.JSX.Element {
  return (
    <ComponentDocPage
      name="Document Placement Tray"
      status="New"
      summary="What a batch drop did, one line per file: the document it went to, the file it replaced (which moves to that document's history), a Choose a document select for a file that could not be placed — empty documents first — and the reason a file was refused. Dropping files never replaces a document silently."
      figma={{ absent: "Built from the e-Anudaan Document Centre spec (docs/plans/2026-09-16-e-anudaan-document-centre.md); not yet drawn in the SAMAVESH library." }}
      specimen={<DocumentPlacementTraySpecimen />}
      propsFrom="DocumentPlacementTrayProps"
      a11y={A11Y}
      whenToUse={{
        use: ["After files are dropped on a Document Checklist and placed by detected type."],
        avoid: ["A single file chosen for one row — the row itself shows what happened."],
      }}
      related={[
        { label: "Document Checklist", href: "/design-system/components/forms/document-checklist", reason: "its tray slot" },
        { label: "Document History Sheet", href: "/design-system/components/forms/document-history-sheet", reason: "where a replaced file goes" },
      ]}
      design={
        <section className="cdp__section" aria-labelledby="cdp-rules">
          <h2 id="cdp-rules" className="cdp__h2">
            Listed, Never Dropped
          </h2>
          <p>
            A file the reader could not place stays on the list with a select until it is placed or removed. A refused file stays with its
            reason. The tray closes only on Done; the placements stand.
          </p>
        </section>
      }
      code={
        <section className="cdp__section" aria-labelledby="cdp-example">
          <h2 id="cdp-example" className="cdp__h2">
            Example
          </h2>
          <CodeBlock>{`<DocumentPlacementTray
  items={[{ id: "a", fileName: "scan0043.pdf", targetId: null }]}
  options={documents.map((d) => ({ id: String(d.n), label: d.title, filled: !!uploaded[d.n] }))}
  onChange={moveFile}
  onRemove={removeFromTray}
  onDone={closeTray}
/>`}</CodeBlock>
        </section>
      }
      accessibility={
        <section className="cdp__section" aria-labelledby="cdp-a11y-notes">
          <h2 id="cdp-a11y-notes" className="cdp__h2">
            Notes
          </h2>
          <p>Announce the summary through the checklist&rsquo;s polite live region when the tray appears.</p>
        </section>
      }
    />
  );
}
