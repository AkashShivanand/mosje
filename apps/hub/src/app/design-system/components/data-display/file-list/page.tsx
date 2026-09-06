import type { Metadata } from "next";
import * as React from "react";
import { CodeBlock, ComponentDocPage, type A11yItem } from "@/components/design-system/docs-kit";
import { FilePlayground } from "./file-playground";

export const metadata: Metadata = {
  title: "File List — Design System",
  description:
    "The attachments on an application: what has been uploaded, what state each one is in, and what can be done about it. A list of states, not a list of names.",
};

const A11Y: A11yItem[] = [
  {
    criterion: "1.3.1 Info and Relationships",
    level: "A",
    status: "verified",
    evidence:
      "The list is a <ul> named by `label` and each attachment is an <li>, so a screen reader announces how many files there are before reading them. Read from the rendered DOM on this page.",
    description: "The reader is told how many attachments there are before hearing their names.",
  },
  {
    criterion: "2.4.4 Link Purpose (In Context)",
    level: "A",
    status: "verified",
    evidence:
      'Each row action carries a visually hidden span naming the file — "Remove income-certificate.pdf" — while the visible word stays short. Read from the accessibility tree: the four Remove buttons have four distinct accessible names.',
    description:
      "Every action names its own file, so twelve attachments do not produce twelve identical 'Remove's.",
  },
  {
    criterion: "1.4.1 Use of Color",
    level: "A",
    status: "verified",
    evidence:
      'Every state renders its own WORD — "Uploading", "Checking for viruses", "Attached", "Failed" — and colour only tints the word already there. Read from the DOM: the state text is present in all four rows independent of any fill.',
    description: "State is carried by words first; colour only reinforces them.",
  },
];

export default function FileListPage(): React.JSX.Element {
  return (
    <ComponentDocPage
      name="File List"
      status="Stable"
      summary="The attachments on an application — what has been uploaded, what state each one is in, and what can be done about it. It is a list of states, not a list of names."
      figma={{ absent: "Master pending in the SAMAVESH library — tracked on the component record." }}
      specimen={<FilePlayground />}
      propsFrom="FileListProps"
      a11y={A11Y}
      whenToUse={{
        use: [
          "An application carries attachments the citizen or an officer needs to see the status of.",
          "Uploads are asynchronous — queued, scanned, then accepted — and the reader needs to know where each one is.",
          "A submitted application is being read back, and the documents are part of the record.",
        ],
        avoid: [
          "The reader is choosing files to upload — that is Media Upload, and this list is what it produces.",
          "The files are a public catalogue to browse and search — that is Document Library.",
          "There is one file. One attachment with a status is a line of text.",
        ],
      }}
      related={[
        { label: "Media Upload", href: "/design-system/components/forms/media-upload", reason: "the control that adds files to this list" },
        { label: "Document Library", href: "/design-system/components/data-display/document-library", reason: "for a public catalogue rather than one application's attachments" },
        { label: "Progress", href: "/design-system/components/data-display/progress", reason: "for a single operation's progress outside a list" },
      ]}
      design={
        <>
          <section className="cdp__section" aria-labelledby="cdp-states">
            <h2 id="cdp-states" className="cdp__h2">A List of States, Not a List of Names</h2>
            <p>
              An attachment on this estate is uploading, then being scanned, then attached — or it
              failed. A row that shows only a filename tells the citizen nothing about whether the
              department has actually received it, which is the only question they have.
            </p>
            <p>
              <strong><code>scanning</code> is a real state and not a nicety.</strong> Departmental
              uploads are virus-scanned before they count as received, and a file that appears
              &ldquo;attached&rdquo; and is rejected an hour later is worse than one that honestly
              says it is being checked.
            </p>
          </section>
          <section className="cdp__section" aria-labelledby="cdp-name">
            <h2 id="cdp-name" className="cdp__h2">The Filename Is Never Rewritten</h2>
            <p>
              A citizen recognises their own document by the name they gave it. A sanitised name, or
              one cut off with an ellipsis, makes them wonder whether they uploaded the right thing —
              and on an application with four certificates that doubt is expensive. Long names wrap;
              they are not clipped.
            </p>
          </section>
          <section className="cdp__section" aria-labelledby="cdp-fail">
            <h2 id="cdp-fail" className="cdp__h2">A Failure Says What to Do</h2>
            <p>
              &ldquo;The file is larger than 5 MB. Reduce it and upload again&rdquo; is actionable at
              a counter or at home. &ldquo;Upload failed&rdquo; is not: it sends the citizen back to
              an office to ask a person what went wrong. Where <code>onRetry</code> is given, the
              failed row offers it — and only the failed row.
            </p>
          </section>
        </>
      }
      code={
        <section className="cdp__section" aria-labelledby="cdp-example">
          <h2 id="cdp-example" className="cdp__h2">Example</h2>
          <CodeBlock>{`import { FileList } from "@mosje/design-system";

<FileList
  label="Documents attached to this application"
  files={attachments}
  onRemove={(id) => detach(id)}
  onRetry={(id) => reupload(id)}
/>`}</CodeBlock>
          <p>
            Omit <code>onRemove</code> and <code>onRetry</code> for the read-only list a citizen sees
            after submitting: the record of what the department holds, with nothing to press.
          </p>
        </section>
      }
      accessibility={
        <section className="cdp__section" aria-labelledby="cdp-named">
          <h2 id="cdp-named" className="cdp__h2">Every Action Names Its Own File</h2>
          <p>
            The visible word is short — &ldquo;Remove&rdquo; — so a dense list stays readable, but
            the accessible name is &ldquo;Remove income-certificate.pdf&rdquo;. A screen-reader user
            moving through an application&apos;s attachments by button would otherwise hear
            &ldquo;Remove&rdquo; twelve times with no way to tell which file each one belonged to.
          </p>
        </section>
      }
    />
  );
}
