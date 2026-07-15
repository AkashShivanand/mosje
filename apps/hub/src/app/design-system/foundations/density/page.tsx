import * as React from "react";
import type { Metadata } from "next";
import { buttonClasses } from "@mosje/design-system";
import { TokenTable } from "@/components/design-system/docs-kit/index";
import { figmaUrl, FIGMA_NODES } from "@/lib/design-system/figma";

export const metadata: Metadata = {
  title: "Density",
  description:
    "Comfortable and compact density modes — how SAMAVESH adapts control sizing for spacious public forms and data-dense portals.",
};

function DemoControls(): React.JSX.Element {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--ds-spacing-md)" }}>
      <button
        type="button"
        style={{
          height: "var(--sa-density-control-height)",
          padding: "0 var(--ds-spacing-lg)",
          background: "var(--ds-primary)",
          color: "#fff",
          border: "none",
          borderRadius: "var(--ds-radius-sm)",
          fontWeight: 600,
          fontFamily: "var(--ds-font-sans)",
          cursor: "pointer",
        }}
      >
        Submit
      </button>
      <input
        type="text"
        readOnly
        defaultValue="Sample input"
        style={{
          height: "var(--sa-density-control-height)",
          padding: "0 var(--ds-spacing-md)",
          background: "var(--ds-surface)",
          color: "var(--ds-ink)",
          border: "1px solid var(--ds-border-strong)",
          borderRadius: "var(--ds-radius-sm)",
          fontFamily: "var(--ds-font-sans)",
        }}
      />
      <select
        defaultValue="one"
        style={{
          height: "var(--sa-density-control-height)",
          padding: "0 var(--ds-spacing-md)",
          background: "var(--ds-surface)",
          color: "var(--ds-ink)",
          border: "1px solid var(--ds-border-strong)",
          borderRadius: "var(--ds-radius-sm)",
          fontFamily: "var(--ds-font-sans)",
        }}
      >
        <option value="one">Option one</option>
        <option value="two">Option two</option>
      </select>
    </div>
  );
}

export default function DensityPage(): React.JSX.Element {
  return (
    <article className="ds-prose">
      <h1>Density</h1>
      <p style={{ fontSize: "var(--ds-text-headline)", color: "var(--ds-ink-muted)", marginTop: "var(--ds-spacing-md)" }}>
        Density controls how tall interactive elements are. SAMAVESH ships two
        modes — <strong>comfortable</strong> for everyday public use and{" "}
        <strong>compact</strong> for screens that need to show a lot of data at
        once.
      </p>
      <div style={{ marginTop: "var(--ds-spacing-lg)" }}>
        <a className={buttonClasses("primary", "outlined", "md")} href={figmaUrl(FIGMA_NODES.density)} target="_blank" rel="noopener noreferrer">
          View in Figma <span aria-hidden="true">↗</span>
        </a>
      </div>

      <section aria-labelledby="demo" style={{ marginTop: "var(--ds-spacing-4xl)" }}>
        <h2 id="demo">Side by side</h2>
        <div
          style={{
            marginTop: "var(--ds-spacing-2xl)",
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            gap: "var(--ds-spacing-2xl)",
          }}
        >
          <div style={{ background: "var(--ds-surface-muted)", borderRadius: "var(--ds-radius-md)", padding: "var(--ds-spacing-2xl)" }}>
            <div style={{ fontWeight: 600, marginBottom: "var(--ds-spacing-lg)" }}>
              Comfortable <span style={{ color: "var(--ds-ink-muted)", fontWeight: 400 }}>· 40px</span>
            </div>
            <DemoControls />
          </div>
          <div data-density="compact" style={{ background: "var(--ds-surface-muted)", borderRadius: "var(--ds-radius-md)", padding: "var(--ds-spacing-2xl)" }}>
            <div style={{ fontWeight: 600, marginBottom: "var(--ds-spacing-lg)" }}>
              Compact <span style={{ color: "var(--ds-ink-muted)", fontWeight: 400 }}>· 32px</span>
            </div>
            <DemoControls />
          </div>
        </div>
      </section>

      <section aria-labelledby="when-compact" style={{ marginTop: "var(--ds-spacing-4xl)" }}>
        <h2 id="when-compact">When to use compact</h2>
        <ul style={{ marginTop: "var(--ds-spacing-lg)" }}>
          <li>Data-dense portals — for example the PM-AJAY MIS dashboard.</li>
          <li>Tables with many rows where vertical space is at a premium.</li>
          <li>Expert tools used repeatedly by trained staff who value scanning speed.</li>
        </ul>
      </section>

      <section aria-labelledby="when-not" style={{ marginTop: "var(--ds-spacing-4xl)" }}>
        <h2 id="when-not">When NOT to use compact</h2>
        <ul style={{ marginTop: "var(--ds-spacing-lg)" }}>
          <li>Public-facing forms, where comfortable targets reduce errors.</li>
          <li>Mobile, where fingers need larger touch targets.</li>
          <li>Accessibility-critical flows, where the 44px minimum target matters most.</li>
        </ul>
      </section>

      <section aria-labelledby="activate" style={{ marginTop: "var(--ds-spacing-4xl)" }}>
        <h2 id="activate">How to activate it</h2>
        <p style={{ marginTop: "var(--ds-spacing-lg)" }}>
          Set <code>data-density=&quot;compact&quot;</code> on any wrapper
          element. Every SAMAVESH control inside that wrapper picks up the
          smaller control height automatically — no per-component changes
          needed.
        </p>
      </section>

      <section aria-labelledby="tokens" style={{ marginTop: "var(--ds-spacing-4xl)" }}>
        <h2 id="tokens">Tokens</h2>
        <div style={{ marginTop: "var(--ds-spacing-lg)" }}>
          <TokenTable
            tokens={[
              {
                token: "--ds-control-height (comfortable)",
                value: "40px",
                description: "Default control height for public sites and forms",
              },
              {
                token: "--ds-control-height (compact)",
                value: "32px",
                description: 'Active under [data-density="compact"] for dense portals',
              },
            ]}
          />
        </div>
      </section>
    </article>
  );
}
