"use client";

import * as React from "react";
import { Icon, Link } from "@mosje/design-system";
const row: React.CSSProperties = { display: "flex", gap: "var(--sa-inline-12)", alignItems: "center", flexWrap: "wrap" };
const dark: React.CSSProperties = { ...row, padding: "var(--sa-padding-16)", background: "var(--sa-bg-brand-primary-bolder)", borderRadius: "var(--sa-shape-8)" };
const eyebrow: React.CSSProperties = {
  margin: 0,
  fontSize: "var(--sa-type-label-3-size)",
  lineHeight: "var(--sa-type-label-3-lh)",
  letterSpacing: "var(--sa-type-label-tracking)",
  textTransform: "uppercase",
  color: "var(--sa-text-neutral-subtle)",
};

export function Specimen(): React.JSX.Element {
  return (
    <div style={{ display: "grid", gap: "var(--sa-stack-16)", maxWidth: "60ch" }}>
      <p style={{ margin: 0 }}>
        Applications are assessed under the{" "}
        <Link href="/website/schemes-services" data-testid="link-inline">
          scheme guidelines
        </Link>{" "}
        published by the Department, and the decision is communicated in writing.
      </p>
      <p style={{ margin: 0 }}>
        <Link
          href="https://www.india.gov.in"
          external
          variant="standalone"
          data-testid="link-external"
        >
          National Portal of India
        </Link>
      </p>
      <p style={{ margin: 0 }}>
        <Link
          href="/website/documents/annual-report.pdf"
          download
          variant="standalone"
          iconLeft={<Icon name="description" size={16} />}
          data-testid="link-download"
        >
          Annual Report 2025&ndash;26 (PDF)
        </Link>
      </p>
      <p style={eyebrow}>Arrangements the master grid does not show</p>
      <div style={row}>
        <Link href="/website/schemes" size="sm" variant="standalone">Small, in a caption</Link>
        <Link href="/website/schemes" size="lg" variant="standalone">Large, in a hero</Link>
        <Link href="/website/schemes" variant="standalone" iconRight={<Icon name="arrow_forward" size={16} />}>See All Schemes</Link>
        <Link href="/website/schemes" variant="standalone" disabled>Not Yet Published</Link>
        <Link href="mailto:grievance@dosje.gov.in" variant="standalone" iconLeft={<Icon name="mail" size={16} />}>Write to the Grievance Cell</Link>
      </div>
      <div style={dark}>
        <Link href="/website/accessibility" tone="inverse" variant="standalone">Accessibility Statement</Link>
        <Link href="https://www.india.gov.in" tone="inverse" variant="standalone" external>National Portal of India</Link>
      </div>
    </div>
  );
}
