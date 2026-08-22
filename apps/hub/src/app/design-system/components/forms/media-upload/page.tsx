import * as React from "react";
import type { Metadata } from "next";
import { MediaUploadPlayground } from "./media-upload-playground";
import { Playground } from "@/components/design-system/playground";
import { PropsTable, DoDont, A11yChecklist } from "@/components/design-system/docs-kit";

export const metadata: Metadata = {
  title: "MediaUpload - SAMAVESH Design System",
  description:
    "An accessible file dropzone supporting image previews and client-side validation.",
};

export default function MediaUploadPage(): React.JSX.Element {
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
          MediaUpload
        </h1>
        <p className="ds-lead" style={leadStyle}>
          A robust file upload component with drag-and-drop support, inline image previews, and automatic client-side size and type validation.
        </p>
      </header>

      {/* ============ PLAYGROUND ============ */}
      <section style={sectionStyle}>
        <h2 id="playground" style={h2Style}>Playground</h2>
        <p style={proseStyle}>
          Try dragging and dropping an image onto the dropzone, or clicking it to open the file picker. Once uploaded, you can view the thumbnail preview and remove or replace the file.
        </p>
        <div style={{ marginTop: "var(--sa-stack-24)" }}>
          <MediaUploadPlayground />
        </div>
      </section>

      {/* ============ 1. USAGE ============ */}
      <section style={sectionStyle}>
        <h2 id="usage" style={h2Style}>1. Usage</h2>
        <p style={proseStyle}>
          Use <code>MediaUpload</code> when you need users to provide a single file, particularly images (like a passport photo, ID scan, or signature). It handles reading the file locally using <code>FileReader</code>, returning a base64 data-URL to your application without needing an immediate network request.
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
                label: "Wrap it in a FormField so the dropzone gets properly labelled and wired to any error messages.",
                preview: null,
              },
              {
                type: "dont",
                label: "Don't use this for multi-file uploads or entire galleries. Use MediaGalleryInput (coming soon) instead.",
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
          code={`function AvatarUploader() {
  const [photo, setPhoto] = React.useState();
  const [name, setName] = React.useState();

  return (
    <FormField label="Upload Photograph">
      {(props) => (
        <MediaUpload 
          {...props}
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
    </FormField>
  );
}`}
        />
      </section>

      {/* ============ 3. ACCESSIBILITY ============ */}
      <section style={sectionStyle}>
        <h2 id="accessibility" style={h2Style}>3. Accessibility (A11y)</h2>
        <ul style={{ ...proseStyle, paddingLeft: "var(--sa-padding-20)", marginTop: "var(--sa-stack-16)", lineHeight: 1.8 }}>
          <li><strong style={{ color: "var(--sa-text-neutral-bolder)" }}>Keyboard Operable:</strong> The entire dropzone area is a <code>&lt;button&gt;</code>, making it fully operable via the keyboard (Space/Enter). The hidden native file input is bypassed via a ref click.</li>
          <li><strong style={{ color: "var(--sa-text-neutral-bolder)" }}>Error Feedback:</strong> Built-in size and type validation errors are rendered in a <code>role="alert"</code> container, immediately notifying screen reader users if their file was rejected.</li>
        </ul>
      </section>

      {/* ============ 4. API ============ */}
      <section style={sectionStyle}>
        <h2 id="api" style={h2Style}>4. API Reference</h2>
        <PropsTable
          props={[
            { name: "value", type: "string", description: "Current value — a data-URL or image src. Triggers the preview state." },
            { name: "fileName", type: "string", description: "File name shown in the preview chip." },
            { name: "onChange", type: "(dataUrl: string, fileName: string) => void", required: true, description: "Called with the read data-URL and file name." },
            { name: "onClear", type: "() => void", required: true, description: "Called when the user removes the file." },
            { name: "accept", type: "string", default: '"image/*"', description: "Accepted MIME types/extensions." },
            { name: "maxSizeMb", type: "number", default: "5", description: "Max file size in megabytes." },
            { name: "promptLabel", type: "string", default: '"Click or drag an image..."', description: "Prompt shown in the empty drop zone." },
            { name: "hintLabel", type: "string", description: "Sub-hint under the prompt. Defaults to a type/size summary." },
          ]}
        />
      </section>
    </main>
  );
}
