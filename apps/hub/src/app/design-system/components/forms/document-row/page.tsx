import type { Metadata } from "next";
import * as React from "react";

import { CodeBlock, ComponentDocPage, MatrixTable, type A11yItem } from "@/components/design-system/docs-kit";

import { DocumentOfficerReviewSpecimen, DocumentRowStates } from "../document-checklist/document-centre-specimens";

export const metadata: Metadata = {
  title: "Document Row — Design System",
  description:
    "One document as a compact row — status icon, title, file, status in words, one action and a menu — in ten states, growing only when the document needs the reader.",
};

const A11Y: A11yItem[] = [
  {
    criterion: "1.4.1 Use of Color",
    level: "A",
    description: "Every state is written in words beside a distinct icon; the tint and colour repeat it, never carry it alone.",
    status: "verified",
    evidence:
      "Measured with Playwright on this page's specimen, 16 Sep 2026: all ten rows render a non-empty .ds-docrow__status-words, and the ten data-state values map to seven distinct Material Symbols glyphs plus none for Optional.",
  },
  {
    criterion: "1.4.3 Contrast (Minimum)",
    level: "AA",
    description: "Status words, titles, file names and reasons hold AA contrast on white and on the error tint.",
    status: "verified",
    evidence:
      "Computed with Playwright from getComputedStyle on this page's specimen, 16 Sep 2026: every title, file name, meta line, reason, status word and disclosure measured at or above 4.5:1; the lowest is the What we found link at 6.36:1, then the warning status words at 7.79:1; the error status words measure 9.10:1 on the row's white ground, which error rows keep since the fill became a 3px accent.",
  },
  {
    criterion: "4.1.2 Name, Role, Value",
    level: "A",
    description: "The menu trigger is named for its document, the What we found disclosure carries aria-expanded and aria-controls, and the upload bar is a named progressbar.",
    status: "verified",
    evidence:
      "Measured with Playwright on this page's specimen, 16 Sep 2026: every “More actions for …” button names its title; the disclosure toggles aria-expanded between false and true and controls an element that exists; the uploading row exposes role=progressbar with aria-valuenow 64.",
  },
  {
    criterion: "2.4.3 Focus Order",
    level: "A",
    description: "The row itself is focusable only by script (tabindex −1), so an ErrorSummary link or a status message can land on it without adding a tab stop.",
    status: "verified",
    evidence: "Measured with Playwright on this page's specimen, 16 Sep 2026: each .ds-docrow carries tabindex=-1 and is skipped by sequential Tab.",
  },
];

export default function DocumentRowPage(): React.JSX.Element {
  return (
    <ComponentDocPage
      name="Document Row"
      status="New"
      summary="One document as a compact row: a status icon, the title, the file, the status in words, one primary action and a menu. Ten states — Not uploaded, Optional, Uploading, Upload failed, Can't be uploaded, Checking, Looks right, Please confirm, Doesn't match, Saved for a hand check. A row that needs nothing is one line; a row that needs the reader grows by one sentence, and everything else sits behind What we found and the menu."
      figma={{ absent: "Built from the e-Anudaan Document Centre spec (docs/plans/2026-09-16-e-anudaan-document-centre.md); not yet drawn in the SAMAVESH library." }}
      specimen={<DocumentRowStates />}
      propsFrom="DocumentRowProps"
      a11y={A11Y}
      whenToUse={{
        use: [
          "Inside a Document Checklist — upload, review, correction and officer screens all use the same row.",
          "Alone, with as=\"div\", for one document a correction asks for, with the Ministry's remark above it.",
          "Beside an officer's own verdict, passed as aside, with the automatic check's words in statusLabel.",
          "Folded to one line with collapsible and summary, for a document an earlier officer has already verified — the verdict and the file behind Details.",
        ],
        avoid: [
          "A two-column grid of a few documents on a form step — use Document Tile.",
          "A confidence percentage on an applicant's row. The applicant is told the consequence; the number is for officers.",
        ],
      }}
      related={[
        { label: "Document Checklist", href: "/design-system/components/forms/document-checklist", reason: "the grouped list rows sit in" },
        { label: "Document Findings", href: "/design-system/components/forms/document-findings", reason: "what What we found reveals" },
        { label: "Document History Sheet", href: "/design-system/components/forms/document-history-sheet", reason: "Upload History from the menu" },
      ]}
      design={
        <>
        <section className="cdp__section" aria-labelledby="cdp-states">
          <h2 id="cdp-states" className="cdp__h2">
            Ten States
          </h2>
          <MatrixTable
            caption="Document Row states"
            columns={["State", "Words", "Icon", "Primary action"]}
            rows={[
              ["missing", "Not uploaded", "radio_button_unchecked", "Upload"],
              ["optional", "Optional", "—", "Upload (outlined)"],
              ["uploading", "Uploading 64% + bar", "progress_activity", "Cancel"],
              ["failed", "Upload failed", "error, 3px error accent", "Try Again"],
              ["rejected", "Can't be uploaded", "error, 3px error accent", "Choose Another File"],
              ["checking", "Checking…", "progress_activity", "—"],
              ["verified", "Looks right", "check_circle", "(menu)"],
              ["review", "Please confirm", "warning", "What we found"],
              ["invalid", "Doesn't match", "report, 3px error accent", "Replace"],
              ["unavailable", "Saved — an officer will check it", "info", "(menu)"],
            ]}
          />
          <p>
            Columns are fractions of the row, not auto, so every row of a list puts its file, status and action in the same place. The row lays
            itself out by its own width (a container query), so the same row works full-width on an upload step and in a narrow review column.
          </p>
          <p>
            A file name is cut in its stem and never in its extension, at every width, so two scans stay distinguishable on a phone and a name
            never breaks as &ldquo;.pd&rdquo; over &ldquo;f&rdquo;.
          </p>
        </section>
        <section className="cdp__section" aria-labelledby="cdp-compact">
          <h2 id="cdp-compact" className="cdp__h2">
            Compact — The Reviewed-Document Row
          </h2>
          <p>
            <code>density=&quot;compact&quot;</code> is the officer&rsquo;s row. From a row width of 520px it is two lines — the
            title, the verdict passed as <code>aside</code> and View, with the file and the automatic check as small print beneath —
            and from 960px one line. The title and file are each cut to one line, and on a collapsible row the hint waits behind
            Details. Below 520px it stacks like the default row. The review column beside an officer&rsquo;s decision panel is
            about 650px wide, which is why the two-line form starts at 520. A twenty-document review at the default density ran
            about 3,700px.
          </p>
          <DocumentOfficerReviewSpecimen />
          <MatrixTable
            caption="Props that shorten a long list"
            columns={["Prop", "Effect", "Use on"]}
            rows={[
              ["density=\"compact\"", "Two lines from 520px, one from 960px; verdict in the line", "An officer's review list"],
              ["collapsible + summary", "Folds a settled row to its summary and status", "A document an earlier grade verified"],
              ["clampReason", "Cuts the reason to one line from 640px; the full sentence stays in the DOM and on hover", "A list where many rows carry one reason — put the full reason in findings"],
            ]}
          />
        </section>
        </>
      }
      code={
        <section className="cdp__section" aria-labelledby="cdp-example">
          <h2 id="cdp-example" className="cdp__h2">
            Example
          </h2>
          <CodeBlock>{`import { Button, DocumentFindings, DocumentRow } from "@mosje/design-system";

<DocumentRow
  number={2}
  title="Budget Estimates — Current Year"
  required
  state="invalid"
  file={{ name: "budget-2026-27.pdf", size: "6 KB", date: "14 Sep 2026" }}
  reason="Only the cover sheet was found — the head-wise estimates are missing."
  action={<Button id="doc-2-action" size="sm">Replace</Button>}
  menu={{ items: [{ id: "view", label: "View" }, { id: "history", label: "Upload History" }], onSelect }}
  findings={<DocumentFindings summary="…" fields={fields} reasons={reasons} />}
/>`}</CodeBlock>
        </section>
      }
      accessibility={
        <section className="cdp__section" aria-labelledby="cdp-a11y-notes">
          <h2 id="cdp-a11y-notes" className="cdp__h2">
            Notes
          </h2>
          <p>
            Name the primary action for its document — “Replace: Budget Estimates — Current Year” — so a list of controls is not seventeen
            identical names. Give it an id, so an ErrorSummary can focus it.
          </p>
        </section>
      }
    />
  );
}
