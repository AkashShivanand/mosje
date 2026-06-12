import * as React from "react";
import type { Metadata } from "next";
import { TokenTable } from "@/components/docs-kit/index";

export const metadata: Metadata = {
  title: "Density",
  description:
    "Comfortable and compact density modes — how SAMAVESH adapts control sizing for spacious public forms and data-dense portals.",
};

function DemoControls(): React.JSX.Element {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--ds-space-3)" }}>
      <button
        type="button"
        style={{
          height: "var(--sa-density-control-height)",
          padding: "0 var(--ds-space-4)",
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
          padding: "0 var(--ds-space-3)",
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
          padding: "0 var(--ds-space-3)",
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
      <p style={{ fontSize: "var(--ds-text-headline)", color: "var(--ds-ink-muted)", marginTop: "var(--ds-space-3)" }}>
        Density controls how tall interactive elements are. SAMAVESH ships two
        modes — <strong>comfortable</strong> for everyday public use and{" "}
        <strong>compact</strong> for screens that need to show a lot of data at
        once.
      </p>

      <section aria-labelledby="demo" style={{ marginTop: "var(--ds-space-10)" }}>
        <h2 id="demo">Side by side</h2>
        <div
          style={{
            marginTop: "var(--ds-space-6)",
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            gap: "var(--ds-space-6)",
          }}
        >
          <div style={{ background: "var(--ds-surface-muted)", borderRadius: "var(--ds-radius-md)", padding: "var(--ds-space-6)" }}>
            <div style={{ fontWeight: 600, marginBottom: "var(--ds-space-4)" }}>
              Comfortable <span style={{ color: "var(--ds-ink-muted)", fontWeight: 400 }}>· 40px</span>
            </div>
            <DemoControls />
          </div>
          <div data-density="compact" style={{ background: "var(--ds-surface-muted)", borderRadius: "var(--ds-radius-md)", padding: "var(--ds-space-6)" }}>
            <div style={{ fontWeight: 600, marginBottom: "var(--ds-space-4)" }}>
              Compact <span style={{ color: "var(--ds-ink-muted)", fontWeight: 400 }}>· 32px</span>
            </div>
            <DemoControls />
          </div>
        </div>
      </section>

      <section aria-labelledby="when-compact" style={{ marginTop: "var(--ds-space-10)" }}>
        <h2 id="when-compact">When to use compact</h2>
        <ul style={{ marginTop: "var(--ds-space-4)" }}>
          <li>Data-dense portals — for example the PM-AJAY MIS dashboard.</li>
          <li>Tables with many rows where vertical space is at a premium.</li>
          <li>Expert tools used repeatedly by trained staff who value scanning speed.</li>
        </ul>
      </section>

      <section aria-labelledby="when-not" style={{ marginTop: "var(--ds-space-10)" }}>
        <h2 id="when-not">When NOT to use compact</h2>
        <ul style={{ marginTop: "var(--ds-space-4)" }}>
          <li>Public-facing forms, where comfortable targets reduce errors.</li>
          <li>Mobile, where fingers need larger touch targets.</li>
          <li>Accessibility-critical flows, where the 44px minimum target matters most.</li>
        </ul>
      </section>

      <section aria-labelledby="activate" style={{ marginTop: "var(--ds-space-10)" }}>
        <h2 id="activate">How to activate it</h2>
        <p style={{ marginTop: "var(--ds-space-4)" }}>
          Set <code>data-density=&quot;compact&quot;</code> on any wrapper
          element. Every SAMAVESH control inside that wrapper picks up the
          smaller control height automatically — no per-component changes
          needed.
        </p>
      </section>

      <section aria-labelledby="tokens" style={{ marginTop: "var(--ds-space-10)" }}>
        <h2 id="tokens">Tokens</h2>
        <div style={{ marginTop: "var(--ds-space-4)" }}>
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
