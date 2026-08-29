import * as React from "react";
import type { Metadata } from "next";
import { GeoPhotoInputPlayground } from "./geo-photo-input-playground";
import { Playground } from "@/components/design-system/playground";
import { PropsTable, DoDont } from "@/components/design-system/docs-kit";
import { DocsTabs } from "@/components/design-system/docs-kit";


export const metadata: Metadata = {
  title: "GeoPhotoInput - SAMAVESH Design System",
  description:
    "An evidence-photo uploader that automatically extracts EXIF coordinates or requests device location.",
};

export default function GeoPhotoInputPage(): React.JSX.Element {
    const h2Style: React.CSSProperties = {
    fontSize: "var(--sa-type-headline-2-size)",
    fontWeight: 600,
    margin: "0 0 var(--sa-stack-24) 0",
    color: "var(--sa-text-neutral-bolder)",
  };
  const proseStyle: React.CSSProperties = {
    color: "var(--sa-text-neutral-base)",
    fontSize: "var(--sa-type-body-1-size)",
    lineHeight: 1.6,
  };
  const leadStyle: React.CSSProperties = {
    ...proseStyle,
    fontSize: "var(--sa-type-headline-3-size)",
    color: "var(--sa-text-neutral-subtle)",
    marginBottom: "var(--sa-stack-24)",
  };

  return (
    <article
      className="ds-prose"
      style={{
        maxWidth: "800px",
        padding: "var(--sa-padding-40) var(--sa-padding-24)",
      }}
    >
      {/* ============ HEADER ============ */}
      <header style={{ marginBottom: "var(--sa-stack-40)" }}>
        <h1
          style={{
            fontSize: "var(--sa-type-headline-1-size)",
            margin: "0 0 var(--sa-stack-16) 0",
          }}
        >
          GeoPhotoInput
        </h1>
        <p className="ds-lead" style={leadStyle}>
          An advanced image uploader for field reporting. It extracts GPS coordinates from the photo&apos;s EXIF data, falling back to the browser&apos;s Geolocation API if necessary, and compresses images client-side before upload.
        </p>
      </header>

      {/* ============ PLAYGROUND ============ */}
      
      <DocsTabs
        tabs={[
          {
            id: "design",
            label: "Design",
            content: (
              <div className="ds-prose">
                <section style={{ marginBottom: "var(--sa-section-48)" }}>
        <h2 id="playground" style={h2Style}>Playground</h2>
        <p style={proseStyle}>
          Try uploading an image. The component will attempt to extract its location and immediately display a thumbnail.
        </p>
        <div style={{ marginTop: "var(--sa-stack-24)" }}>
          <GeoPhotoInputPlayground />
        </div>
      </section>
<section style={{ marginBottom: "var(--sa-section-48)" }}>
        <h2 id="usage" style={h2Style}>1. Usage</h2>
        <p style={proseStyle}>
          Use <code>GeoPhotoInput</code> when building forms for field surveyors, inspectors, or citizens reporting physical evidence (e.g., PM-AJAY asset verification). It guarantees that a location is captured whenever possible, while transparently compressing multi-megabyte camera photos down to a few hundred kilobytes directly in the browser.
        </p>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "var(--sa-inline-24)",
            marginTop: "var(--sa-stack-24)",
          }}
        >
          <DoDont
            cards={[
              {
                type: "do",
                label: "Wrap the component in a FormField so users receive an accessible label and clear instructions about the required number of photos.",
                preview: null,
              },
              {
                type: "dont",
                label: "Don't use this for standard document or profile picture uploads. Use MediaUpload or MediaGalleryInput instead.",
                preview: null,
              },
            ]}
          />
        </div>
      </section>
<section style={{ marginBottom: "var(--sa-section-48)" }}>
        <h2 id="code-example" style={h2Style}>2. Code Example</h2>
        <Playground
          code={`function EvidenceForm() {
  const [photos, setPhotos] = React.useState<GeoPhoto[]>([]);

  return (
    <FormField label="Asset Verification Photos" required>
      {(props) => (
        <GeoPhotoInput
          {...props}
          value={photos}
          onChange={setPhotos}
          maxItems={4}
          minItems={1}
        />
      )}
    </FormField>
  );
}`}
        />
      </section>

              </div>
            )
          },
          {
            id: "develop",
            label: "Develop",
            content: (
              <div className="ds-prose">
                <section style={{ marginBottom: "var(--sa-section-48)" }}>
        <h2 id="api" style={h2Style}>4. API Reference</h2>
        <PropsTable
          props={[
            { name: "value", type: "GeoPhoto[]", required: true, description: "Current array of geo-tagged photos." },
            { name: "onChange", type: "(photos: GeoPhoto[]) => void", required: true, description: "Called with the new array when photos are added or removed." },
            { name: "maxItems", type: "number", default: "4", description: "Maximum number of photos allowed." },
            { name: "minItems", type: "number", default: "1", description: "Minimum photos, surfaced in the hint text only." },
            { name: "maxSizeMb", type: "number", default: "10", description: "Max size per original file, in MB." },
          ]}
        />
      </section>

              </div>
            )
          },
          {
            id: "accessibility",
            label: "Accessibility",
            content: (
              <div className="ds-prose">
                <section style={{ marginBottom: "var(--sa-section-48)" }}>
        <h2 id="accessibility" style={h2Style}>3. Accessibility (A11y)</h2>
        <ul style={{ ...proseStyle, paddingLeft: "var(--sa-padding-20)", marginTop: "var(--sa-stack-16)", lineHeight: 1.8 }}>
          <li><strong style={{ color: "var(--sa-text-neutral-bolder)" }}>Keyboard Dropzone:</strong> The primary upload dropzone and &quot;Add more&quot; buttons are fully operable via keyboard.</li>
          <li><strong style={{ color: "var(--sa-text-neutral-bolder)" }}>Action Feedback:</strong> Status updates like &quot;Adding...&quot; and errors regarding file size limits are announced effectively.</li>
          <li><strong style={{ color: "var(--sa-text-neutral-bolder)" }}>Clear Focus:</strong> Removed thumbnails can be easily deleted using a dedicated, accessible <code>&lt;button&gt;</code> with an explicit <code>aria-label</code>.</li>
        </ul>
      </section>

              </div>
            )
          }
        ]}
      />

    </article>
  );
}
