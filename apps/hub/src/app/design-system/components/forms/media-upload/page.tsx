import type { Metadata } from "next";
import * as React from "react";

import {
  CodeBlock,
  ComponentDocPage,
  type A11yItem,
} from "@/components/design-system/docs-kit";

import { MediaUploadPlayground } from "./media-upload-playground";

export const metadata: Metadata = {
  title: "Media Upload — Design System",
  description:
    "A single-file dropzone with a click target, drag and drop, an inline preview, and client-side type and size checks.",
};

const A11Y: A11yItem[] = [
  {
    criterion: "2.1.1 Keyboard",
    level: "A",
    description:
      "The dropzone is a real `<button>`, so it is reachable by Tab and opens the file picker on Enter or Space. Dragging is an addition, never the only route.",
  },
  {
    criterion: "2.5.7 Dragging Movements",
    level: "AA",
    description:
      "Everything drag and drop achieves is also achieved by clicking the same target and using the platform's own picker.",
  },
  {
    criterion: "2.5.8 Target Size (Minimum)",
    level: "AA",
    description: "The dropzone is a large block target, and the Replace and Remove actions are text buttons well past 24×24.",
  },
  {
    criterion: "3.3.1 Error Identification",
    level: "A",
    description:
      "A rejected file renders a message naming the reason — the wrong type, or the size limit — rather than silently doing nothing.",
  },
  {
    criterion: "1.1.1 Non-text Content",
    level: "A",
    description:
      "The preview thumbnail carries alt text, and the file glyph used for non-image types is `aria-hidden` beside the file name that names it.",
  },
  {
    criterion: "4.1.2 Name, Role, Value",
    level: "A",
    description:
      "The operable control carries the `id` Form Field generated, so the visible label names the button rather than the hidden file input.",
  },
];

export default function MediaUploadPage(): React.JSX.Element {
  return (
    <ComponentDocPage
      name="Media Upload"
      status="Stable"
      summary="A single-file dropzone with a click target, drag and drop, an inline preview and client-side type and size checks. It reads the file locally and hands you a data URL, so nothing reaches the network until the form is submitted."
      figma={{ absent: "Not yet published in the Figma library." }}
      specimen={<MediaUploadPlayground />}
      propsFrom="MediaUploadProps"
      a11y={A11Y}
      whenToUse={{
        use: [
          "The reader supplies exactly one file — a photograph, a signature, a scanned identity document.",
          "The file should be previewed before submission, so an upside-down scan is caught by the reader rather than by an officer.",
          "The type and size limits should be enforced before anything is sent.",
        ],
        avoid: [
          "The reader supplies several files — use Media Gallery Input, which shows them as a grid.",
          "The photograph must carry a location — use Geo Photo Input, which reads the coordinates and compresses the image.",
          "The file is large or numerous enough that holding it in memory as a data URL is unreasonable. This control is for form attachments, not for bulk transfer.",
        ],
      }}
      related={[
        {
          label: "Media Gallery Input",
          href: "/design-system/components/forms/media-gallery-input",
          reason: "when several files are expected",
        },
        {
          label: "Geo Photo Input",
          href: "/design-system/components/forms/geo-photo-input",
          reason: "when the photograph must carry a location",
        },
        {
          label: "Form Field",
          href: "/design-system/components/forms/form-field",
          reason: "the label, hint and error wiring this control expects",
        },
        {
          label: "Form Card",
          href: "/design-system/components/forms/form-card",
          reason: "the section a list of attached documents belongs in",
        },
      ]}
      design={
        <section className="cdp__section" aria-labelledby="cdp-states">
          <h2 id="cdp-states" className="cdp__h2">
            The Two States
          </h2>
          <p>
            With no <code>value</code> the control is a dropzone carrying the prompt and a hint naming
            the accepted types and the size limit. With a <code>value</code> it becomes a preview: the
            thumbnail or a file glyph, the file name, and two actions — Replace, which reopens the
            picker, and Remove, which clears it.
          </p>
          <p>
            The hint is derived by default, so the limit shown always matches the limit enforced.
            Override <code>hintLabel</code> only where the department&apos;s own wording differs, and
            keep the figure in step with <code>maxSizeMb</code>.
          </p>
        </section>
      }
      code={
        <section className="cdp__section" aria-labelledby="cdp-example">
          <h2 id="cdp-example" className="cdp__h2">
            Example
          </h2>
          <CodeBlock>{`import { FormField, MediaUpload } from "@mosje/design-system";

const [photo, setPhoto] = React.useState<string>();
const [name, setName] = React.useState<string>();

<FormField label="Upload Photograph" hint="A recent passport-size photograph.">
  {(control) => (
    <MediaUpload
      {...control}
      value={photo}
      fileName={name}
      onChange={(dataUrl, fileName) => {
        setPhoto(dataUrl);
        setName(fileName);
      }}
      onClear={() => {
        setPhoto(undefined);
        setName(undefined);
      }}
    />
  )}
</FormField>`}</CodeBlock>
          <p>
            For a document rather than an image, set <code>accept</code>. The control then draws a file
            glyph instead of a thumbnail, and its default hint changes with it.
          </p>
          <CodeBlock>{`<MediaUpload
  accept="application/pdf"
  maxSizeMb={10}
  value={document}
  fileName={documentName}
  onChange={onDocument}
  onClear={onClearDocument}
/>`}</CodeBlock>
        </section>
      }
      accessibility={
        <section className="cdp__section" aria-labelledby="cdp-a11y-notes">
          <h2 id="cdp-a11y-notes" className="cdp__h2">
            Notes
          </h2>
          <p>
            The visible control is a button, not the file input. The hidden input carries no label and
            no id, which is why the <code>id</code> Form Field generates is applied to the button — a
            label bound to the hidden input would name something the reader cannot reach.
          </p>
          <p>
            <code>required</code> is accepted and dropped on purpose. A required file input inside a
            form blocks submission even once a file has been chosen, because the input&apos;s own
            value is never set by this component. Enforce the requirement in your own validation and
            report it through Form Field&apos;s <code>error</code>.
          </p>
        </section>
      }
    />
  );
}
