import * as React from "react";
import type { Metadata } from "next";
import { ActionBannerPlayground } from "./action-banner-playground";
import { Playground } from "@/components/design-system/playground";
import { PropsTable, DoDont } from "@/components/design-system/docs-kit";

export const metadata: Metadata = {
  title: "Action Banner - SAMAVESH Design System",
  description:
    "A high-visibility call to action block used on public pages to direct users to key flows.",
};

export default function ActionBannerPage(): React.JSX.Element {
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
          Action Banner
        </h1>
        <p className="ds-lead" style={leadStyle}>
          A high-visibility call to action block used on public pages to direct users to key flows.
        </p>
      </header>

      {/* ============ PLAYGROUND ============ */}
      <section style={sectionStyle}>
        <h2 id="playground" style={h2Style}>Playground</h2>
        <p style={proseStyle}>
          Interact with the Action Banner to see how it accommodates optional descriptions.
        </p>
        <div style={{ marginTop: "var(--sa-stack-24)" }}>
          <ActionBannerPlayground />
        </div>
      </section>

      {/* ============ 1. USAGE ============ */}
      <section style={sectionStyle}>
        <h2 id="usage" style={h2Style}>1. Usage</h2>
        <p style={proseStyle}>
          Action Banners are typically placed at the bottom of public-facing pages or within prominent dashboard sections to encourage users to take a primary action, such as applying for a scheme or logging in.
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
                label: "Use strong, action-oriented titles and clear button labels.",
                preview: null,
              },
              {
                type: "dont",
                label: "Don't place multiple Action Banners on the same page. Focus the user on a single primary call to action.",
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
          code={`<ActionBanner 
  title="Apply for PM-AJAY"
  description="Check your eligibility and submit your application online."
  action={<Button variant="primary">Apply Now</Button>}
/>`}
        />
      </section>

      {/* ============ 3. ACCESSIBILITY ============ */}
      <section style={sectionStyle}>
        <h2 id="accessibility" style={h2Style}>3. Accessibility (A11y)</h2>
        <ul style={{ ...proseStyle, paddingLeft: "var(--sa-padding-20)", marginTop: "var(--sa-stack-16)", lineHeight: 1.8 }}>
          <li><strong style={{ color: "var(--sa-text-neutral-bolder)" }}>Heading Structure:</strong> The title is rendered as an <code>&lt;h3&gt;</code> element. Ensure this fits logically within your page’s heading hierarchy.</li>
          <li><strong style={{ color: "var(--sa-text-neutral-bolder)" }}>Contrast:</strong> The gradient background and text colours are selected from the SAMAVESH tokens to ensure WCAG AA compliance.</li>
        </ul>
      </section>

      {/* ============ 4. API ============ */}
      <section style={sectionStyle}>
        <h2 id="api" style={h2Style}>4. API Reference</h2>
        <PropsTable
          props={[
            { name: "title", type: "ReactNode", required: true, description: "The main headline of the banner." },
            { name: "description", type: "ReactNode", description: "Optional supporting text displayed below the title." },
            { name: "action", type: "ReactNode", required: true, description: "The interactive element, usually a Button or a Link component." },
            { name: "className", type: "string", description: "Additional classes merged onto the root element." },
            { name: "...rest", type: "HTMLAttributes<HTMLDivElement>", description: "All standard div props are forwarded, except 'title' which is overridden." },
          ]}
        />
      </section>
    </main>
  );
}
