import * as React from "react";
import type { Metadata } from "next";
import { LoaderPlayground } from "./loader-playground";
import { Playground } from "@/components/design-system/playground";
import { PropsTable, DoDont, A11yChecklist } from "@/components/design-system/docs-kit";
import { DocsTabs } from "@/components/design-system/docs-kit";


export const metadata: Metadata = {
  title: "Loader - SAMAVESH Design System",
  description:
    "An accessible CSS spinner used to indicate that a process or data loading is currently underway.",
};

export default function LoaderPage(): React.JSX.Element {
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
          Loader
        </h1>
        <p className="ds-lead" style={leadStyle}>
          An accessible CSS spinner used to indicate that a process or data loading is currently underway.
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
          Try out the Loader component in different sizes and colour variants.
        </p>
        <div style={{ marginTop: "var(--sa-stack-24)" }}>
          <LoaderPlayground />
        </div>
      </section>
<section style={{ marginBottom: "var(--sa-section-48)" }}>
        <h2 id="usage" style={h2Style}>1. Usage</h2>
        <p style={proseStyle}>
          Loaders reassure the user that the system is processing their request. Use them for actions that take more than a second to complete.
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
                label: "Use the `sm` size inside buttons, and the `md` or `lg` sizes for full-page or section loading states.",
                preview: null,
              },
              {
                type: "dont",
                label: "Don't show multiple loaders on the same page if you can avoid it. Prefer a Skeleton loader for initial page loads.",
                preview: null,
              },
            ]}
          />
        </div>
      </section>
<section style={{ marginBottom: "var(--sa-section-48)" }}>
        <h2 id="code-example" style={h2Style}>2. Code Example</h2>
        <Playground
          code={`<div style={{ display: "flex", gap: "var(--sa-stack-16)", alignItems: "center" }}>
  <Loader size="sm" />
  <Loader size="md" />
  <Loader size="lg" variant="secondary" />
</div>`}
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
            { name: "size", type: '"sm" | "md" | "lg"', default: '"md"', description: "The diameter of the spinner." },
            { name: "variant", type: '"primary" | "secondary"', default: '"primary"', description: "The colour role." },
            { name: "label", type: "string", default: '"Loading…"', description: "Accessible label, visually hidden but read by screen readers." },
            { name: "className", type: "string", description: "Additional classes merged onto the root element." },
            { name: "...rest", type: "HTMLAttributes<HTMLSpanElement>", description: "All standard span props are forwarded." },
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
        <p style={proseStyle}>
          A visual spinner is not enough; assistive technologies need to know that loading is occurring.
        </p>
        <div style={{ marginTop: "var(--sa-padding-20)" }}>
          <A11yChecklist
            items={[
              { criterion: "role='status'", level: "A", description: "The component uses role='status' combined with aria-live='polite' to announce its presence without interrupting the user's current activity." },
              { criterion: "Visually hidden label", level: "A", description: "A visually hidden text label (default: 'Loading…') is included so screen readers can announce the loading state." },
            ]}
          />
        </div>
      </section>

              </div>
            )
          }
        ]}
      />

    </article>
  );
}
