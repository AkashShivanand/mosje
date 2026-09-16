import type { Metadata } from "next";
import * as React from "react";

import { CodeBlock, ComponentDocPage, MatrixTable, type A11yItem } from "@/components/design-system/docs-kit";

import { DocumentChecklistSpecimen, DocumentOfficerReviewSpecimen } from "./document-centre-specimens";

export const metadata: Metadata = {
  title: "Document Checklist — Design System",
  description:
    "The documents a form asks for, grouped, under one header that says how many required documents are ready — with filter chips, a drop zone and the summary a blocked Continue raises.",
};

const A11Y: A11yItem[] = [
  {
    criterion: "3.3.1 Error Identification",
    level: "A",
    description: "A blocked Continue raises an ErrorSummary that takes focus and links each entry to the row's control.",
    status: "verified",
    evidence:
      "Measured with Playwright on the e-Anudaan AVYAY upload step, 16 Sep 2026: pressing Save and Continue with six blockers moved document.activeElement to .ds-error-summary, and each link focused its row's action button.",
  },
  {
    criterion: "4.1.3 Status Messages",
    level: "AA",
    description: "Verdicts arriving are announced through a polite live region; a failed or refused upload through an assertive one.",
    status: "verified",
    evidence:
      "Measured with Playwright, 16 Sep 2026: the checklist renders one role=status aria-live=polite region and one role=alert aria-live=assertive region, and the polite region's text changed to the verdict when a check settled.",
  },
  {
    criterion: "2.1.1 Keyboard",
    level: "A",
    description: "The drop zone has a keyboard route — a Choose Files button — and the filter chips are buttons with aria-pressed.",
    status: "verified",
    evidence:
      "Measured with Playwright on this page's specimen, 16 Sep 2026: Choose Files is a BUTTON reachable by Tab; each chip carries role=button, tabindex=0 and aria-pressed. The danger-tone Needs your attention chip measures 9.10:1 unselected and 7.56:1 selected.",
  },
  {
    criterion: "1.3.1 Info and Relationships",
    level: "A",
    description: "Each group is a section labelled by its heading, holding a list of rows; the progress bar is a progressbar labelled by its sentence.",
    status: "verified",
    evidence:
      "Measured with Playwright on this page's specimen, 16 Sep 2026: SECTION[aria-labelledby] > UL > LI for every group; the bar carries role=progressbar with aria-labelledby resolving to the “N of M required documents ready” line.",
  },
];

export default function DocumentChecklistPage(): React.JSX.Element {
  return (
    <ComponentDocPage
      name="Document Checklist"
      status="New"
      summary="The documents a form asks for, in the groups the scheme uses, under one header that answers “what do I have to do?”: how many required documents are READY, three filter chips for the three questions a clerk has, one drop zone with a keyboard route, and the ErrorSummary a blocked Continue raises. Rows are Document Rows."
      figma={{ node: "documentChecklist" }}
      specimen={<DocumentChecklistSpecimen />}
      propsFrom="DocumentChecklistProps"
      a11y={A11Y}
      whenToUse={{
        use: [
          "An application asks for more than a handful of named documents and the applicant must see at a glance which need action.",
          "Files can be dropped in bulk and placed by type.",
          "A review or officer screen reads back the same documents, read-only — omit the filters and onFiles.",
        ],
        avoid: [
          "Two or three documents on an ordinary form step — use Document Tile.",
          "A public list of downloads — use Document Library.",
        ],
      }}
      related={[
        { label: "Document Row", href: "/design-system/components/forms/document-row", reason: "the rows inside each group" },
        { label: "Document Placement Tray", href: "/design-system/components/forms/document-placement-tray", reason: "what a batch drop did" },
        { label: "Error Summary", href: "/design-system/components/forms/error-summary", reason: "the summary a blocked Continue raises" },
        { label: "Document Tile", href: "/design-system/components/forms/document-tile", reason: "a short list on a form step" },
      ]}
      design={
        <>
          <section className="cdp__section" aria-labelledby="cdp-anatomy">
            <h2 id="cdp-anatomy" className="cdp__h2">
              Anatomy
            </h2>
            <MatrixTable
              caption="Document Checklist, top to bottom"
              columns={["Part", "What it says", "Rule"]}
              rows={[
                ["ErrorSummary", "N Documents Need Your Attention Before You Continue", "Only after Continue is pressed with blockers; takes focus"],
                ["Progress", "12 of 17 required documents ready", "Counts READY, never uploaded — a rejected upload is not progress"],
                ["Formats", "PDF, JPG or PNG · up to 5 MB each", "Stated once, inside the drop zone where files are chosen; in the header only when there is no drop zone"],
                ["Filter chips", "Needs your attention (its count in the error ink while above 0) · Being checked · Ready · Optional", "One selected style for every chip; each filters the list; a filter that leaves nothing says so and offers Show All Documents"],
                ["Drop zone", "Drop all your documents here, or Choose Files — on a touch screen or below 768px, Choose your documents", "Choose Files is the keyboard route; a thumb has nothing to drag"],
                ["Tray slot", "Document Placement Tray", "Between the drop zone and the list, until closed"],
                ["Bulk verdict", "Mark All Remaining as Verified (12)", "Officer screens only; behind a confirmation; drawn only while the count is above 0"],
                ["Groups", "Document Checklist Group of Document Rows", "The scheme's own groups; uppercase label, divided list; hideRequiredMarks under a Required heading"],
              ]}
            />
          </section>
          <section className="cdp__section" aria-labelledby="cdp-bulk">
            <h2 id="cdp-bulk" className="cdp__h2">
              Bulk Verdict
            </h2>
            <p>
              <code>bulkAction</code> draws one outlined button and a confirmation for a verdict given to many documents at once. The design
              system draws the affordance; the screen decides which documents are &ldquo;remaining&rdquo;, never includes one the automatic
              check flagged, and records one verdict per document so each stays individually auditable. It is also exported alone as
              <code> DocumentBulkAction</code>, for a decision panel. Rows here are <code>density=&quot;compact&quot;</code> under a group with{" "}
              <code>hideRequiredMarks</code>.
            </p>
            <DocumentOfficerReviewSpecimen />
          </section>
          <section className="cdp__section" aria-labelledby="cdp-gate">
            <h2 id="cdp-gate" className="cdp__h2">
              The Gate Is Not a Disabled Button
            </h2>
            <p>
              Continue stays enabled. Pressed with a blocker, the checklist raises its summary, filters to Needs your attention and moves focus to
              the summary. A disabled button explains nothing and cannot be focused. The hard gate is Submit, on the review step.
            </p>
          </section>
        </>
      }
      code={
        <section className="cdp__section" aria-labelledby="cdp-example">
          <h2 id="cdp-example" className="cdp__h2">
            Example
          </h2>
          <CodeBlock>{`import { DocumentChecklist, DocumentChecklistGroup, DocumentRow } from "@mosje/design-system";

<DocumentChecklist
  formats="PDF, JPG or PNG · up to 5 MB each"
  ready={summary.ready}
  required={summary.required}
  filters={[{ id: "attention", label: "Needs your attention", count: 3 }]}
  activeFilter={filter}
  onFilterChange={setFilter}
  onFiles={placeDroppedFiles}
  errors={showErrors ? blockers : []}
  errorsRevision={revision}
  politeMessage={announcement}
  visibleCount={visibleRows}
>
  <DocumentChecklistGroup title="Registration & Identity">
    <DocumentRow title="Registration Certificate" required state="verified" file={{ name: "reg.pdf" }} />
  </DocumentChecklistGroup>
</DocumentChecklist>`}</CodeBlock>
        </section>
      }
      accessibility={
        <section className="cdp__section" aria-labelledby="cdp-a11y-notes">
          <h2 id="cdp-a11y-notes" className="cdp__h2">
            Notes
          </h2>
          <p>
            Pass <code>errorsRevision</code> a new number each time Continue is pressed, so the summary takes focus again when the same
            blockers are raised twice. Each error&rsquo;s <code>fieldId</code> is the id of the row&rsquo;s primary control, never the row.
          </p>
        </section>
      }
    />
  );
}
