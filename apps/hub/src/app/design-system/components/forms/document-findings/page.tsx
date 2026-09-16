import type { Metadata } from "next";
import * as React from "react";

import { CodeBlock, ComponentDocPage, type A11yItem } from "@/components/design-system/docs-kit";

import { DocumentFindingsSpecimen } from "../document-checklist/document-centre-specimens";

export const metadata: Metadata = {
  title: "Document Findings — Design System",
  description: "What the automatic check found in a document: its verdict, the fields it read — each compared with the application's own answer — and every reason.",
};

const A11Y: A11yItem[] = [
  {
    criterion: "1.3.1 Info and Relationships",
    level: "A",
    description: "The fields are a description list, so each value is announced with its label.",
    status: "verified",
    evidence: "Measured with Playwright on this page's specimen, 16 Sep 2026: fields render as DL > DIV > DT + DD; reasons as UL > LI.",
  },
  {
    criterion: "1.4.1 Use of Color",
    level: "A",
    description: "A mismatch says “Does not match. Your application says …” in words beside the icon; a match says “Matches your application”.",
    status: "verified",
    evidence: "Measured with Playwright on this page's specimen, 16 Sep 2026: both comparison lines carry their words as text; the icons are aria-hidden.",
  },
];

export default function DocumentFindingsPage(): React.JSX.Element {
  return (
    <ComponentDocPage
      name="Document Findings"
      status="New"
      summary="“What we found”: the automatic check's one-sentence verdict, the fields it read from the file — each compared with the application's own answer — and every reason. The live portal prints an extracted organisation name and leaves the reader to notice it is not theirs; this panel says so."
      figma={{ node: "documentFindings" }}
      specimen={<DocumentFindingsSpecimen />}
      propsFrom="DocumentFindingsProps"
      a11y={A11Y}
      whenToUse={{
        use: ["Under a Document Row, revealed by What we found.", "On an officer's review, with confidence, as advice beside the officer's own verdict."],
        avoid: ["Confidence on an applicant's screen — pass it only to officers.", "A verdict with nothing read — the panel says “No details could be read from this file.”"],
      }}
      related={[
        { label: "Document Row", href: "/design-system/components/forms/document-row", reason: "the row that reveals it" },
        { label: "Document Checklist", href: "/design-system/components/forms/document-checklist", reason: "the list of rows" },
      ]}
      design={
        <section className="cdp__section" aria-labelledby="cdp-compare">
          <h2 id="cdp-compare" className="cdp__h2">
            Compared, Not Just Printed
          </h2>
          <p>
            Pass <code>expected</code> and <code>matches</code> for every field the application also answers — organisation name, registration
            number, financial year, IFSC, account number. A field the application says nothing about is shown without a comparison.
          </p>
        </section>
      }
      code={
        <section className="cdp__section" aria-labelledby="cdp-example">
          <h2 id="cdp-example" className="cdp__h2">
            Example
          </h2>
          <CodeBlock>{`<DocumentFindings
  summary="This Registration Certificate is for another organisation."
  fields={[{ label: "Organisation Name", found: "Other Society", expected: "Sankalp Seva Sansthan", matches: false }]}
  reasons={["Upload the Registration Certificate issued to Sankalp Seva Sansthan."]}
/>`}</CodeBlock>
        </section>
      }
      accessibility={
        <section className="cdp__section" aria-labelledby="cdp-a11y-notes">
          <h2 id="cdp-a11y-notes" className="cdp__h2">
            Notes
          </h2>
          <p>The panel has no heading of its own; the disclosure that reveals it names it.</p>
        </section>
      }
    />
  );
}
