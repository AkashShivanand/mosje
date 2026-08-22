import * as React from "react";
import type { Metadata } from "next";
import { AadhaarPlayground } from "./aadhaar-playground";

export const metadata: Metadata = {
  title: "Aadhaar Input - SAMAVESH Design System",
  description: "A specialized input for collecting Aadhaar numbers, featuring auto-formatting, DPDP Act masking, and Verhoeff validation.",
};

export default function AadhaarInputPage(): React.JSX.Element {
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

  return (
    <main className="ds-prose" style={{ maxWidth: "800px", padding: "var(--sa-padding-40) var(--sa-padding-24)" }}>
      {/* ============ HEADER ============ */}
      <header style={{ marginBottom: "var(--sa-stack-40)" }}>
        <h1 style={{ fontSize: "var(--sa-type-headline-1-size)", margin: "0 0 var(--sa-stack-16) 0" }}>
          Aadhaar Input
        </h1>
        <p className="ds-lead" style={{ fontSize: "var(--sa-type-headline-3-size)", color: "var(--sa-text-neutral-subtle)" }}>
          A specialized 12-digit input for collecting Aadhaar numbers, featuring auto-formatting, DPDP Act masking, and inline Verhoeff validation (UX4G 3.0 Standard).
        </p>
      </header>

      {/* ============ PLAYGROUND ============ */}
      <AadhaarPlayground />

      {/* ============ 1. USAGE ============ */}
      <section style={sectionStyle}>
        <h2 id="usage" style={h2Style}>1. Usage</h2>
        <p style={proseStyle}>
          The Aadhaar number is a unique 12-digit identity number issued by UIDAI. Collecting it requires specific care regarding formatting, validation, and privacy.
        </p>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "var(--sa-inline-24)", marginTop: "var(--sa-stack-24)" }}>
          <UseCard tone="do" title="When to use">
            <li>When you strictly need to collect a resident's Aadhaar number.</li>
            <li>In authentication workflows requiring Aadhaar verification.</li>
          </UseCard>
          <UseCard tone="dont" title="When NOT to use">
            <li>Do not use for Virtual ID (VID) which is 16 digits.</li>
            <li>Do not use a standard text input or number input for Aadhaar.</li>
          </UseCard>
        </div>
      </section>

      {/* ============ 2. FEATURES ============ */}
      <section style={sectionStyle}>
        <h2 id="features" style={h2Style}>2. Features & Compliance</h2>
        <ul style={{ ...proseStyle, paddingLeft: "var(--sa-padding-20)", marginTop: "var(--sa-stack-16)", lineHeight: 1.8 }}>
          <li>
            <strong style={{ color: "var(--sa-text-neutral-bolder)" }}>DPDP Act Masking:</strong>
            By default, when the user finishes typing 12 digits and blurring the field, the input masks the first 8 digits (<code>XXXX XXXX 1234</code>). This complies with UIDAI and DPDP Act guidelines to minimize PII exposure on screen. The underlying state value remains the full 12 digits.
          </li>
          <li>
            <strong style={{ color: "var(--sa-text-neutral-bolder)" }}>Auto-Formatting:</strong>
            As the user types, the input automatically injects a space every 4 digits (<code>XXXX XXXX XXXX</code>) to match the physical Aadhaar card layout, improving readability and reducing typos.
          </li>
          <li>
            <strong style={{ color: "var(--sa-text-neutral-bolder)" }}>Verhoeff Validation:</strong>
            The last digit of an Aadhaar number is a Verhoeff checksum. The component automatically validates this checksum when 12 digits are reached and sets <code>aria-invalid</code> if it fails, catching mistyped digits before API submission.
          </li>
          <li>
            <strong style={{ color: "var(--sa-text-neutral-bolder)" }}>Input Mode:</strong>
            Uses <code>inputMode="numeric"</code> and <code>type="text"</code> to show the numpad on mobile, but prevents the browser from treating it as a mathematical number (which would strip leading zeros and allow mouse-wheel scrolling).
          </li>
        </ul>
      </section>

      {/* ============ 3. CODE ============ */}
      <section style={sectionStyle}>
        <h2 id="code" style={h2Style}>3. Code Example</h2>
        <CodeBlock>{`import { AadhaarInput, FormField } from "@mosje/design-system";

export function AadhaarForm() {
  const [aadhaar, setAadhaar] = useState("");

  return (
    <FormField label="Aadhaar number" required>
      {(fieldProps) => (
        <AadhaarInput
          {...fieldProps}
          value={aadhaar}
          onValueChange={setAadhaar}
          mask={true} // Enabled by default
        />
      )}
    </FormField>
  );
}`}</CodeBlock>
      </section>
    </main>
  );
}

/* Local Helpers */
function UseCard({ tone, title, children }: { tone: "do" | "dont"; title: string; children: React.ReactNode }) {
  const accent = tone === "do" ? "var(--sa-color-status-success)" : "var(--sa-color-status-danger)";
  return (
    <div style={{ border: "1px solid var(--sa-border-neutral-subtle)", borderTop: `3px solid ${accent}`, borderRadius: "var(--sa-shape-8)", padding: "var(--sa-padding-20)", background: "var(--sa-bg-neutral-base)" }}>
      <h3 style={{ margin: 0, marginBottom: "var(--sa-stack-12)", fontSize: "var(--sa-type-headline-2-size)", fontWeight: 600, color: "var(--sa-text-neutral-base)" }}>{title}</h3>
      <ul style={{ margin: 0, paddingLeft: "var(--sa-padding-20)", color: "var(--sa-text-neutral-subtle)", fontSize: "var(--sa-type-body-2-size)", lineHeight: 1.8 }}>{children}</ul>
    </div>
  );
}

function CodeBlock({ children }: { children: string }) {
  return (
    <pre style={{ background: "var(--sa-bg-neutral-subtler)", border: "1px solid var(--sa-border-neutral-subtle)", borderRadius: "var(--sa-shape-8)", padding: "var(--sa-padding-16)", overflowX: "auto", fontSize: "var(--sa-type-body-2-size)", lineHeight: 1.6, color: "var(--sa-text-neutral-base)", marginTop: "var(--sa-stack-16)" }}>
      <code style={{ fontFamily: "var(--sa-font-mono)" }}>{children}</code>
    </pre>
  );
}
