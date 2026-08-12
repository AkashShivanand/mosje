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
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--sa-stack-s)" }}>
      <button
        type="button"
        style={{
          height: "var(--sa-density-control-height)",
          padding: "0 var(--sa-padding-m)",
          background: "var(--sa-bg-brand-primary-bolder)",
          color: "var(--sa-on-bg-brand-primary-bolder)",
          border: "none",
          borderRadius: "var(--sa-shape-sm)",
          fontWeight: 600,
          fontFamily: "var(--sa-font-latin)",
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
          padding: "0 var(--sa-padding-s)",
          background: "var(--sa-bg-neutral-base)",
          color: "var(--sa-text-neutral-base)",
          border: "1px solid var(--sa-border-neutral-base)",
          borderRadius: "var(--sa-shape-sm)",
          fontFamily: "var(--sa-font-latin)",
        }}
      />
      <select
        defaultValue="one"
        style={{
          height: "var(--sa-density-control-height)",
          padding: "0 var(--sa-padding-s)",
          background: "var(--sa-bg-neutral-base)",
          color: "var(--sa-text-neutral-base)",
          border: "1px solid var(--sa-border-neutral-base)",
          borderRadius: "var(--sa-shape-sm)",
          fontFamily: "var(--sa-font-latin)",
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
      <p style={{ fontSize: "var(--sa-type-headline-1-size)", lineHeight: "var(--sa-type-headline-1-lh)", color: "var(--sa-color-text-muted)", marginTop: "var(--sa-stack-s)" }}>
        Density controls how tall interactive elements are. SAMAVESH ships two
        modes — <strong>comfortable</strong> for everyday public use and{" "}
        <strong>compact</strong> for screens that need to show a lot of data at
        once.
      </p>
      <div style={{ marginTop: "var(--sa-stack-m)" }}>
        <a className={buttonClasses("primary", "outlined", "md")} href={figmaUrl(FIGMA_NODES.density)} target="_blank" rel="noopener noreferrer">
          View in Figma <span aria-hidden="true">↗</span>
        </a>
      </div>

      <section aria-labelledby="demo" style={{ marginTop: "var(--sa-stack-2xl)" }}>
        <h2 id="demo">Side by side</h2>
        <div
          style={{
            marginTop: "var(--sa-stack-l)",
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            gap: "var(--sa-stack-l)",
          }}
        >
          <div style={{ background: "var(--sa-bg-neutral-subtler)", borderRadius: "var(--sa-shape-md)", padding: "var(--sa-stack-l)" }}>
            <div style={{ fontWeight: 600, marginBottom: "var(--sa-stack-m)" }}>
              Comfortable <span style={{ color: "var(--sa-text-neutral-subtle)", fontWeight: 400 }}>· 40px</span>
            </div>
            <DemoControls />
          </div>
          <div data-density="compact" style={{ background: "var(--sa-bg-neutral-subtler)", borderRadius: "var(--sa-shape-md)", padding: "var(--sa-stack-l)" }}>
            <div style={{ fontWeight: 600, marginBottom: "var(--sa-stack-m)" }}>
              Compact <span style={{ color: "var(--sa-text-neutral-subtle)", fontWeight: 400 }}>· 32px</span>
            </div>
            <DemoControls />
          </div>
        </div>
      </section>

      <section aria-labelledby="when-compact" style={{ marginTop: "var(--sa-stack-2xl)" }}>
        <h2 id="when-compact">When to use compact</h2>
        <ul style={{ marginTop: "var(--sa-stack-m)" }}>
          <li>Data-dense portals — for example the PM-AJAY MIS dashboard.</li>
          <li>Tables with many rows where vertical space is at a premium.</li>
          <li>Expert tools used repeatedly by trained staff who value scanning speed.</li>
        </ul>
      </section>

      <section aria-labelledby="when-not" style={{ marginTop: "var(--sa-stack-2xl)" }}>
        <h2 id="when-not">When NOT to use compact</h2>
        <ul style={{ marginTop: "var(--sa-stack-m)" }}>
          <li>Public-facing forms, where comfortable targets reduce errors.</li>
          <li>Mobile, where fingers need larger touch targets.</li>
          <li>Accessibility-critical flows, where the 44px minimum target matters most.</li>
        </ul>
      </section>

      <section aria-labelledby="activate" style={{ marginTop: "var(--sa-stack-2xl)" }}>
        <h2 id="activate">How to activate it</h2>
        <p style={{ marginTop: "var(--sa-stack-m)" }}>
          Set <code>data-density=&quot;compact&quot;</code> on any wrapper
          element. Every SAMAVESH control inside that wrapper picks up the
          smaller control height automatically — no per-component changes
          needed.
        </p>
      </section>

      <section aria-labelledby="tokens" style={{ marginTop: "var(--sa-stack-2xl)" }}>
        <h2 id="tokens">Tokens</h2>
        <div style={{ marginTop: "var(--sa-stack-m)" }}>
          <TokenTable
            tokens={[
              {
                token: "--sa-density-control-height (comfortable)",
                value: "40px",
                description: "Default control height for public sites and forms",
              },
              {
                token: "--sa-density-control-height (compact)",
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
