import type { Metadata } from "next";
import * as React from "react";

import {
  Callout,
  CodeBlock,
  ComponentDocPage,
  MatrixTable,
  type A11yItem,
} from "@/components/design-system/docs-kit";

import { DocumentTilePlayground } from "./document-tile-playground";

export const metadata: Metadata = {
  title: "Document Tile — Design System",
  description:
    "One document on an upload or review step — its title, one line of meta and its controls — in four states, laid out two to a row by Document Tiles.",
};

const A11Y: A11yItem[] = [
  {
    criterion: "1.3.1 Info and Relationships",
    level: "A",
    description:
      "Document Tiles is a `<ul>` and each tile an `<li>`, so a screen reader announces how many documents the step asks for before reading the first.",
    status: "verified",
    evidence:
      "Measured with Playwright against this page's specimen on the running hub, 14 Sep 2026: the grid renders as UL and every direct child as LI.",
  },
  {
    criterion: "1.4.3 Contrast (Minimum)",
    level: "AA",
    description:
      "The title and meta line hold AA contrast on all four state surfaces, including the success and error tints.",
    status: "verified",
    evidence:
      "Measured with Playwright against this page's specimen on the running hub, 14 Sep 2026: titles 15.72–18.94:1 and meta lines 5.58–10.92:1 across upcoming, uploaded, verified and invalid; the lowest is the invalid meta line at 5.58:1.",
  },
  {
    criterion: "3.3.2 Labels or Instructions",
    level: "A",
    description:
      'A mandatory document carries a visible asterisk hidden from assistive technology and a visually hidden "(required)", so the requirement is read as well as seen.',
    status: "verified",
    evidence:
      'Measured with Playwright against this page\'s specimen on the running hub, 14 Sep 2026: each required title carries an aria-hidden asterisk and a .ds-sr-only span reading " (required)".',
  },
  {
    criterion: "1.4.10 Reflow",
    level: "AA",
    description:
      "The tiles sit two to a row from 768px and one to a row below it, and a tile's controls wrap rather than overflow.",
    status: "verified",
    evidence:
      "Measured with Playwright against this page's specimen on the running hub, 14 Sep 2026: two columns at 1440px; one at a 320px viewport, with no tile's scrollWidth exceeding its clientWidth.",
  },
];

export default function DocumentTilePage(): React.JSX.Element {
  return (
    <ComponentDocPage
      name="Document Tile"
      status="New"
      summary="One document on an upload or review step: its title, one line of meta, and its controls at the right. Four states — Upcoming, Uploaded, Verified and Needs Correction — laid out two to a row by Document Tiles. An upload is Uploaded, never Verified; only an officer or DigiLocker verifies a document."
      figma={{
        absent:
          "Drawn in the portal handoff file (NOS, Document Upload and Review); not yet published in the SAMAVESH library.",
      }}
      specimen={<DocumentTilePlayground />}
      propsFrom="DocumentTileProps"
      a11y={A11Y}
      whenToUse={{
        use: [
          "A form step asks the applicant to attach named documents — an income certificate, a bank passbook.",
          "A review step lists the documents attached, each with a View control.",
          "A document's state must be seen at a glance: still to upload, attached, verified, or returned for correction.",
        ],
        avoid: [
          "An officer's checklist of documents with findings, versions and verification history — use Checklist Screen, which carries that detail.",
          "A library of published documents for citizens to download — use Document Library.",
          "Choosing a file with a drop zone and a progress bar — use Media Upload inside the tile's step, not a tile.",
        ],
      }}
      related={[
        {
          label: "Media Upload",
          href: "/design-system/components/forms/media-upload",
          reason: "the file picker with a drop zone and progress",
        },
        {
          label: "Form Card",
          href: "/design-system/components/forms/form-card",
          reason: "the sub-section a set of tiles sits in",
        },
        {
          label: "Checklist Screen",
          href: "/design-system/components/templates/checklist-screen",
          reason: "an officer's document checklist",
        },
        {
          label: "Badge",
          href: "/design-system/components/feedback/badge",
          reason: "the Verified mark",
        },
      ]}
      design={
        <>
          <section className="cdp__section" aria-labelledby="cdp-states">
            <h2 id="cdp-states" className="cdp__h2">
              Four States
            </h2>
            <MatrixTable
              caption="Document Tile states"
              columns={["State", "Surface", "Meta line", "Controls"]}
              rows={[
                [
                  "Upcoming",
                  "bg/neutral/base, border/neutral/base",
                  "Accepted formats and the size limit",
                  "Browse File, small outlined",
                ],
                [
                  "Uploaded",
                  "bg/neutral/subtler, border/neutral/base",
                  "File name and size",
                  "Change, small outlined, and a Remove icon button",
                ],
                [
                  "Verified",
                  "bg/status/success/base, border/status/success/base",
                  "The verifying source, in text/status/success/bolder",
                  "Badge “Verified”",
                ],
                [
                  "Needs Correction",
                  "bg/status/error/base, border/status/error/base",
                  "The officer’s reason, in text/status/error/base",
                  "Replace File",
                ],
              ]}
            />
          </section>

          <section className="cdp__section" aria-labelledby="cdp-verified">
            <h2 id="cdp-verified" className="cdp__h2">
              An Upload Is Not a Verification
            </h2>
            <Callout type="warning" title="Never Set Verified on Upload">
              A green tile tells the applicant the Department has accepted the document. Setting it because a
              file arrived tells them something no one has checked, and they will not look at it again.
              Verified is set only from an officer&rsquo;s decision or a DigiLocker link.
            </Callout>
          </section>

          <section className="cdp__section" aria-labelledby="cdp-layout">
            <h2 id="cdp-layout" className="cdp__h2">
              Layout
            </h2>
            <p>
              Document Tiles sets the tiles two to a row from 768px, with 16 between rows and 24 between
              columns, and one to a row below. Group them by sub-section — Identity Documents, Income
              Documents — rather than listing every document in one grid.
            </p>
            <p>
              On a review step, pass a file glyph as <code>icon</code> and a View control as{" "}
              <code>actions</code>. Content that belongs to one document — an officer&rsquo;s remark, a list
              of earlier versions — goes in <code>children</code>, below the row.
            </p>
          </section>
        </>
      }
      code={
        <section className="cdp__section" aria-labelledby="cdp-example">
          <h2 id="cdp-example" className="cdp__h2">
            Example
          </h2>
          <CodeBlock>{`import { Badge, Button, DocumentTile, DocumentTiles, FormCard } from "@mosje/design-system";

<FormCard title="Identity Documents">
  <DocumentTiles>
    <DocumentTile
      title="Income Certificate"
      required
      state={file ? "uploaded" : "upcoming"}
      meta={file ? \`\${file.name} · \${formatSize(file.size)}\` : "PDF, JPG or PNG · up to 2 MB"}
      actions={<Button appearance="outlined" size="sm">{file ? "Change" : "Browse File"}</Button>}
    />
    <DocumentTile
      title="Aadhaar Card"
      required
      state="verified"
      meta="Linked via DigiLocker"
      actions={<Badge status="success">Verified</Badge>}
    />
  </DocumentTiles>
</FormCard>`}</CodeBlock>
          <p>
            A tile outside a <code>DocumentTiles</code> list takes <code>as=&quot;div&quot;</code>, so it does
            not render a stray list item.
          </p>
        </section>
      }
      accessibility={
        <section className="cdp__section" aria-labelledby="cdp-a11y-notes">
          <h2 id="cdp-a11y-notes" className="cdp__h2">
            Notes
          </h2>
          <p>
            When a control swaps — Browse File becomes Change, Remove brings Browse File back — move focus to
            the control that replaced the one pressed. The specimen does this; without it a keyboard
            user&rsquo;s focus falls back to the top of the page.
          </p>
          <p>
            No state may be carried by its tint alone. Verified carries a Badge and the verifying source,
            Needs Correction carries the officer&rsquo;s reason, and Uploaded carries the file name. Name
            repeated controls for their document — &ldquo;Remove Income Certificate&rdquo;, &ldquo;View
            Aadhaar Card&rdquo; — so a list of controls is not six identical names.
          </p>
          <p>
            A change of state that the applicant did not cause — a verification arriving, a document returned
            — should also be announced in a polite live region on the step, because a tint changing colour is
            not announced.
          </p>
        </section>
      }
    />
  );
}
