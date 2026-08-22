import * as React from "react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Container - SAMAVESH Design System",
  description: "SAMAVESH Container component.",
};

export default function ContainerPage(): React.JSX.Element {
  return (
    <main className="ds-prose" style={{ maxWidth: "800px", padding: "var(--sa-padding-40) var(--sa-padding-24)" }}>
      <header style={{ marginBottom: "var(--sa-stack-40)" }}>
        <h1 style={{ fontSize: "var(--sa-type-headline-1-size)", margin: "0 0 var(--sa-stack-16) 0" }}>
          Container
        </h1>
        <p className="ds-lead" style={{ fontSize: "var(--sa-type-headline-3-size)", color: "var(--sa-text-neutral-subtle)" }}>
          SAMAVESH Container component.
        </p>
      </header>
      
      <div className="ds-alert ds-alert--info" style={{ padding: "var(--sa-padding-16)", backgroundColor: "var(--sa-bg-brand-primary-subtler)", borderRadius: "var(--sa-shape-8)", borderLeft: "4px solid var(--sa-border-brand-primary-base)" }}>
        <p style={{ margin: 0, color: "var(--sa-text-brand-primary-bolder)" }}>
          <strong>Documentation Stub:</strong> This page was auto-generated to mirror the codebase and is waiting for full documentation content.
        </p>
      </div>
    </main>
  );
}
