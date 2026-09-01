import type { Metadata } from "next";
import * as React from "react";

import {
  CodeBlock,
  ComponentDocPage,
  type A11yItem,
} from "@/components/design-system/docs-kit";

import { GeoPhotoInputPlayground } from "./geo-photo-input-playground";

export const metadata: Metadata = {
  title: "Geo Photo Input — Design System",
  description:
    "An evidence-photograph control that reads coordinates from EXIF, falls back to the device's location, and compresses each photograph in the browser before it is stored.",
};

const A11Y: A11yItem[] = [
  {
    criterion: "1.3.1 Info and Relationships",
    level: "A",
    description:
      "The control is a `role=\"group\"` carrying `aria-describedby` and `aria-invalid`, so Form Field's label, hint and error stay associated even once the dropzone has been replaced by the grid.",
  },
  {
    criterion: "1.1.1 Non-text Content",
    level: "A",
    description:
      "Each thumbnail carries its original file name as alt text, and each remove button names the photograph it removes.",
  },
  {
    criterion: "1.4.1 Use of Colour",
    level: "A",
    description:
      "A located photograph shows its coordinates as text beside the pin, and an unlocated one says \"No location\" — the state is never carried by the chip's colour alone.",
  },
  {
    criterion: "2.1.1 Keyboard",
    level: "A",
    description:
      "The dropzone, the add tile and every remove control are real buttons. Dragging is an addition, never the only route.",
  },
  {
    criterion: "2.5.7 Dragging Movements",
    level: "AA",
    description: "Everything drag and drop achieves is also achieved by clicking and using the platform's own picker.",
  },
  {
    criterion: "4.1.3 Status Messages",
    level: "AA",
    description:
      "A polite live region announces progress while photographs are being read and compressed, without stealing focus — which matters, because the work takes visible time on a phone.",
  },
  {
    criterion: "3.3.1 Error Identification",
    level: "A",
    description:
      "A rejected file renders a message with `role=\"alert\"`, and photographs with no location are reported in plain text saying that submission is still possible.",
  },
];

export default function GeoPhotoInputPage(): React.JSX.Element {
  return (
    <ComponentDocPage
      name="Geo Photo Input"
      status="Stable"
      summary="An evidence-photograph control for field reporting. It reads coordinates from the photograph's EXIF data, falls back to the device's own location where there are none, and compresses each photograph in the browser into a thumbnail and a view copy before anything is stored."
      figma={{ absent: "Not yet published in the Figma library." }}
      specimen={<GeoPhotoInputPlayground />}
      propsFrom="GeoPhotoInputProps"
      a11y={A11Y}
      whenToUse={{
        use: [
          "A surveyor, an inspector or a citizen is recording physical evidence — asset verification under PM-AJAY is the case this was built for.",
          "Where the photograph was taken is part of the record, not an incidental detail.",
          "Multi-megabyte camera photographs must be reduced before they reach the department's systems.",
        ],
        avoid: [
          "The upload is an ordinary document or a profile photograph — use Media Upload, or Media Gallery Input for several.",
          "The location is not part of the evidence. Asking a reader for their device location without a reason is a privacy cost with no return.",
          "Video is expected — this control accepts still photographs only.",
        ],
      }}
      related={[
        {
          label: "Media Upload",
          href: "/design-system/components/forms/media-upload",
          reason: "for an ordinary single-file upload",
        },
        {
          label: "Media Gallery Input",
          href: "/design-system/components/forms/media-gallery-input",
          reason: "for several files where location does not matter",
        },
        {
          label: "India Map",
          href: "/design-system/components/data-display/india-map",
          reason: "where the recorded coordinates are shown back",
        },
        {
          label: "Form Field",
          href: "/design-system/components/forms/form-field",
          reason: "the label, hint and error wiring this control expects",
        },
      ]}
      design={
        <section className="cdp__section" aria-labelledby="cdp-location">
          <h2 id="cdp-location" className="cdp__h2">
            Where the Location Comes From
          </h2>
          <p>
            Each photograph records how its coordinates were obtained: <code>EXIF</code> where the
            camera wrote them into the file, <code>DEVICE</code> where the browser&apos;s own location
            was used instead, and <code>UNAVAILABLE</code> where neither was possible.
          </p>
          <p>
            A photograph with no location is common and is not an error. Messaging applications strip
            EXIF, so a photograph forwarded through one arrives with nothing. The control says so, in
            the department&apos;s register, and states that the submission can still proceed and that
            the approving officer will see the gap.
          </p>
          <p>
            The two derived copies exist so the same photograph serves both a grid and a lightbox
            without either being wrong: a 320px thumbnail is unreadable at full size, and a 1600px view
            copy is wasteful in a grid of four.
          </p>
        </section>
      }
      code={
        <section className="cdp__section" aria-labelledby="cdp-example">
          <h2 id="cdp-example" className="cdp__h2">
            Example
          </h2>
          <CodeBlock>{`import { FormField, GeoPhotoInput } from "@mosje/design-system";
import type { GeoPhoto } from "@mosje/design-system";

const [photos, setPhotos] = React.useState<GeoPhoto[]>([]);

<FormField
  label="Asset Verification Photographs"
  required
  hint="Between one and four photographs of the completed asset."
  error={submitted && photos.length === 0
    ? "Attach at least one photograph of the asset."
    : undefined}
>
  {(control) => (
    <GeoPhotoInput
      {...control}
      value={photos}
      onChange={setPhotos}
      minItems={1}
      maxItems={4}
    />
  )}
</FormField>`}</CodeBlock>
          <p>
            <code>minItems</code> is shown in the hint but not enforced. Validate it in your own
            submit handler, as above, so the reader gets a message that names what is missing.
          </p>
        </section>
      }
      accessibility={
        <section className="cdp__section" aria-labelledby="cdp-a11y-notes">
          <h2 id="cdp-a11y-notes" className="cdp__h2">
            Notes
          </h2>
          <p>
            The <code>aria-describedby</code> wiring is bound to the group rather than to a button.
            That is deliberate: the dropzone exists only while the gallery is empty, and at capacity
            no add control is rendered at all, so a binding on a button would silently detach the
            label and hint at exactly the point the reader is reviewing what they attached.
          </p>
          <p>
            Reading and compressing several camera photographs takes visible time on a phone. The
            polite live region reports progress so a screen-reader user is not left with a control
            that appears to have done nothing.
          </p>
        </section>
      }
    />
  );
}
