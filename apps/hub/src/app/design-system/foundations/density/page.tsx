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
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--sa-stack-12)" }}>
      <button
        type="button"
        style={{
          height: "var(--sa-density-control-height)",
          padding: "0 var(--sa-padding-16)",
          background: "var(--sa-bg-brand-primary-bolder)",
          color: "var(--sa-on-bg-brand-primary-bolder)",
          border: "none",
          borderRadius: "var(--sa-shape-6)",
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
          padding: "0 var(--sa-padding-12)",
          background: "var(--sa-bg-neutral-base)",
          color: "var(--sa-text-neutral-base)",
          border: "1px solid var(--sa-border-neutral-base)",
          borderRadius: "var(--sa-shape-6)",
          fontFamily: "var(--sa-font-latin)",
        }}
      />
      <select
        defaultValue="one"
        style={{
          height: "var(--sa-density-control-height)",
          padding: "0 var(--sa-padding-12)",
          background: "var(--sa-bg-neutral-base)",
          color: "var(--sa-text-neutral-base)",
          border: "1px solid var(--sa-border-neutral-base)",
          borderRadius: "var(--sa-shape-6)",
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
      <p style={{ fontSize: "var(--sa-type-headline-1-size)", lineHeight: "var(--sa-type-headline-1-lh)", color: "var(--sa-color-text-muted)", marginTop: "var(--sa-stack-12)" }}>
        Density controls how tall interactive elements are. SAMAVESH ships two
        modes — <strong>comfortable</strong> for everyday public use and{" "}
        <strong>compact</strong> for screens that need to show a lot of data at
        once.
      </p>
      <div style={{ marginTop: "var(--sa-stack-16)" }}>
        <a className={buttonClasses("primary", "outlined", "md")} href={figmaUrl(FIGMA_NODES.density)} target="_blank" rel="noopener noreferrer">
          View in Figma <span aria-hidden="true">↗</span>
        </a>
      </div>

      <section aria-labelledby="demo" style={{ marginTop: "var(--sa-stack-40)" }}>
        <h2 id="demo">Side by side</h2>
        <div
          style={{
            marginTop: "var(--sa-stack-24)",
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            gap: "var(--sa-stack-24)",
          }}
        >
          <div style={{ background: "var(--sa-bg-neutral-subtler)", borderRadius: "var(--sa-shape-8)", padding: "var(--sa-stack-24)" }}>
            <div style={{ fontWeight: 600, marginBottom: "var(--sa-stack-16)" }}>
              Comfortable <span style={{ color: "var(--sa-text-neutral-subtle)", fontWeight: 400 }}>· 40px</span>
            </div>
            <DemoControls />
          </div>
          <div data-density="compact" style={{ background: "var(--sa-bg-neutral-subtler)", borderRadius: "var(--sa-shape-8)", padding: "var(--sa-stack-24)" }}>
            <div style={{ fontWeight: 600, marginBottom: "var(--sa-stack-16)" }}>
              Compact <span style={{ color: "var(--sa-text-neutral-subtle)", fontWeight: 400 }}>· 32px</span>
            </div>
            <DemoControls />
          </div>
        </div>
      </section>

      <section aria-labelledby="when-compact" style={{ marginTop: "var(--sa-stack-40)" }}>
        <h2 id="when-compact">When to use compact</h2>
        <ul style={{ marginTop: "var(--sa-stack-16)" }}>
          <li>Data-dense portals — for example the PM-AJAY MIS dashboard.</li>
          <li>Tables with many rows where vertical space is at a premium.</li>
          <li>Expert tools used repeatedly by trained staff who value scanning speed.</li>
        </ul>
      </section>

      <section aria-labelledby="when-not" style={{ marginTop: "var(--sa-stack-40)" }}>
        <h2 id="when-not">When NOT to use compact</h2>
        <ul style={{ marginTop: "var(--sa-stack-16)" }}>
          <li>Public-facing forms, where comfortable targets reduce errors.</li>
          <li>Mobile, where fingers need larger touch targets.</li>
          <li>Accessibility-critical flows, where the extra reach matters most.</li>
        </ul>
      </section>

      <section aria-labelledby="targets" style={{ marginTop: "var(--sa-stack-40)" }}>
        <h2 id="targets">Target size</h2>
        <p style={{ marginTop: "var(--sa-stack-16)" }}>
          WCAG 2.2 asks that a target be at least 24 by 24 CSS pixels — success
          criterion 2.5.8, Target Size (Minimum), at level AA. A comfortable
          control is 40px high and a compact one is 32px, so{" "}
          <strong>both modes clear the minimum</strong>, compact with less room
          to spare. The 44px figure often quoted as a minimum is 2.5.5, Target
          Size (Enhanced), which is level AAA; neither mode reaches it and this
          estate does not claim it.
        </p>
        <p style={{ marginTop: "var(--sa-stack-16)" }}>
          Height is only one axis. A control 32px high can still fail 2.5.8 on
          its width, and none of the density tokens sets a width — that stays
          the component&apos;s own responsibility.
        </p>
      </section>

      <section aria-labelledby="activate" style={{ marginTop: "var(--sa-stack-40)" }}>
        <h2 id="activate">How to activate it</h2>
        <p style={{ marginTop: "var(--sa-stack-16)" }}>
          Set <code>data-density=&quot;compact&quot;</code> on any wrapper
          element. Every SAMAVESH control inside that wrapper picks up the
          smaller control height automatically — no per-component changes
          needed.
        </p>
      </section>

      <section aria-labelledby="tokens" style={{ marginTop: "var(--sa-stack-40)" }}>
        <h2 id="tokens">Tokens</h2>
        <p style={{ marginTop: "var(--sa-stack-16)" }}>
          These eight values are the whole axis — each shown as{" "}
          <strong>comfortable → compact</strong>. Anything not listed here is
          identical in both modes, including type, icons, radius and colour, so
          a compact screen is a tighter layout rather than a smaller design.
        </p>
        <div style={{ marginTop: "var(--sa-stack-16)" }}>
          <TokenTable
            tokens={[
              {
                token: "--sa-density-control-height",
                value: "40px → 32px",
                description: "Height of a button, an input or a select. −20%.",
              },
              {
                token: "--sa-density-control-padding-x",
                value: "16px → 12px",
                description: "Padding inside a control, left and right. −25%.",
              },
              {
                token: "--sa-density-control-padding-y",
                value: "8px → 6px",
                description: "Padding inside a control, top and bottom. −25%.",
              },
              {
                token: "--sa-density-control-gap",
                value: "8px → 6px",
                description: "Gap between a control's parts — an icon and its label. −25%.",
              },
              {
                token: "--sa-density-row-height",
                value: "48px → 36px",
                description: "Height of a table row or a list row. −25%.",
              },
              {
                token: "--sa-density-row-padding-x",
                value: "16px → 12px",
                description: "Padding inside a row, left and right. −25%.",
              },
              {
                token: "--sa-density-row-padding-y",
                value: "12px → 8px",
                description: "Padding inside a row, top and bottom. −33%.",
              },
              {
                token: "--sa-density-section-gap",
                value: "24px → 16px",
                description: "Gap between sections of a form or a page. −33%.",
              },
            ]}
          />
        </div>
      </section>
    </article>
  );
}
