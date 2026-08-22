import * as React from "react";
import type { Metadata } from "next";
import { MediaGalleryInputPlayground } from "./media-gallery-input-playground";
import { Playground } from "@/components/design-system/playground";
import { PropsTable, DoDont } from "@/components/design-system/docs-kit";

export const metadata: Metadata = {
  title: "MediaGalleryInput - SAMAVESH Design System",
  description:
    "A multi-file uploader supporting images and videos with inline previews.",
};

export default function MediaGalleryInputPage(): React.JSX.Element {
  const sectionStyle: React.CSSProperties = {
    marginTop: "var(--sa-stack-48)",
    paddingTop: "var(--sa-stack-48)",
    borderTop: "1px solid var(--sa-border-neutral-subtle)",
  };
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
    <main
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
          MediaGalleryInput
        </h1>
        <p className="ds-lead" style={leadStyle}>
          A robust multi-file upload dropzone for images and videos, featuring client-side validation, inline grid previews, and video poster frame generation.
        </p>
      </header>

      {/* ============ PLAYGROUND ============ */}
      <section style={sectionStyle}>
        <h2 id="playground" style={h2Style}>Playground</h2>
        <p style={proseStyle}>
          Upload multiple images or videos. Notice how the initial dropzone transforms into a thumbnail grid with a trailing &quot;Add more&quot; button once files are present.
        </p>
        <div style={{ marginTop: "var(--sa-stack-24)" }}>
          <MediaGalleryInputPlayground />
        </div>
      </section>

      {/* ============ 1. USAGE ============ */}
      <section style={sectionStyle}>
        <h2 id="usage" style={h2Style}>1. Usage</h2>
        <p style={proseStyle}>
          Use <code>MediaGalleryInput</code> when you need the user to provide multiple visual files, such as supporting documents, event photos, or inspection videos. It reads the files locally, generates previews, and enforces capacity limits without hitting the server.
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
                label: "Wrap it in a FormField so the dropzone gets properly labelled and wired to error messages.",
                preview: null,
              },
              {
                type: "dont",
                label: "Don't use this if you only need a single file (like a profile picture). Use MediaUpload instead to save screen real estate.",
                preview: null,
              },
            ]}
          />
        </div>
      </section>

      {/* ============ 2. CODE EXAMPLE ============ */}
      <section style={sectionStyle}>
        <h2 id="code-example" style={h2Style}>2. Code Example</h2>
        <Playground
          code={`function InspectionGallery() {
  const [items, setItems] = React.useState<GalleryMediaItem[]>([]);

  return (
    <FormField label="Inspection Evidence" hint="Upload up to 10 photos or short videos.">
      {(props) => (
        <MediaGalleryInput
          {...props}
          value={items}
          onChange={setItems}
          maxItems={10}
          maxSizeMb={50} // Higher limit since videos are allowed
        />
      )}
    </FormField>
  );
}`}
        />
      </section>

      {/* ============ 3. ACCESSIBILITY ============ */}
      <section style={sectionStyle}>
        <h2 id="accessibility" style={h2Style}>3. Accessibility (A11y)</h2>
        <ul style={{ ...proseStyle, paddingLeft: "var(--sa-padding-20)", marginTop: "var(--sa-stack-16)", lineHeight: 1.8 }}>
          <li><strong style={{ color: "var(--sa-text-neutral-bolder)" }}>Keyboard Dropzone:</strong> Both the empty full-width dropzone and the &quot;Add more&quot; tile are native buttons, fully operable via keyboard.</li>
          <li><strong style={{ color: "var(--sa-text-neutral-bolder)" }}>Clear Removal:</strong> Each item in the gallery grid has a dedicated remove button with a descriptive <code>aria-label</code> (e.g., &quot;Remove document.pdf&quot;).</li>
          <li><strong style={{ color: "var(--sa-text-neutral-bolder)" }}>Error Feedback:</strong> Validation errors (wrong file type, exceeded capacity) are rendered in a <code>role=&quot;alert&quot;</code> container to immediately notify screen reader users.</li>
        </ul>
      </section>

      {/* ============ 4. API ============ */}
      <section style={sectionStyle}>
        <h2 id="api" style={h2Style}>4. API Reference</h2>
        <PropsTable
          props={[
            { name: "value", type: "GalleryMediaItem[]", required: true, description: "Array of selected media items (images and videos)." },
            { name: "onChange", type: "(items: GalleryMediaItem[]) => void", required: true, description: "Called when items are added or removed." },
            { name: "maxItems", type: "number", default: "4", description: "Maximum number of files allowed." },
            { name: "maxSizeMb", type: "number", default: "10", description: "Max file size in megabytes per file." },
            { name: "accept", type: "string", default: '"image/*,video/*"', description: "Accepted MIME types." },
          ]}
        />
      </section>
    </main>
  );
}
