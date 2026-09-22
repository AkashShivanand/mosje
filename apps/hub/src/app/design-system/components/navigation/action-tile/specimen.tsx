"use client";

import * as React from "react";
import Link from "next/link";
import { ActionTile, Icon } from "@mosje/design-system";

const grid: React.CSSProperties = { display: "grid", gap: "var(--sa-stack-12)", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))" };
const navy: React.CSSProperties = { ...grid, padding: "var(--sa-padding-16)", background: "var(--sa-bg-brand-primary-boldest)", borderRadius: "var(--sa-shape-12)" };
const tint: React.CSSProperties = { ...grid, padding: "var(--sa-padding-16)", background: "var(--sa-bg-brand-primary-base)", borderRadius: "var(--sa-shape-12)" };

export function Specimen(): React.JSX.Element {
  return (
    <div style={{ display: "grid", gap: "var(--sa-stack-16)" }}>
      <div style={navy}>
        <ActionTile linkAs={Link} href="/website/schemes-services" tone="inverse" title="Find a Scheme" media={<Icon name="manage_search" size={24} />} />
        <ActionTile href="https://pgportal.gov.in/" external tone="inverse" title="File a Grievance" media={<Icon name="report" size={24} />} />
        <ActionTile
          href="tel:14567"
          layout="block"
          tone="inverse"
          value="14567"
          title="Elderline"
          description="National helpline for senior citizens"
          media={<Icon name="elderly" size={24} />}
          action={
            <>
              <Icon name="call" size={20} /> Call
            </>
          }
        />
      </div>
      <div style={tint}>
        <ActionTile linkAs={Link} href="/website/schemes-services?who=senior" layout="stack" mediaSize={88} title="Senior Citizens" media={<Icon name="elderly" size={40} />} />
        <ActionTile linkAs={Link} href="/website/for-researcher" shape="pill" tone="solid" mediaSize={48} title="For Researchers" media={<Icon name="biotech" size={24} />} />
        <ActionTile linkAs={Link} href="/website/annual-reports" layout="block" mediaSize={48} title="Annual Report 2024-25" description="23 Dec 2025 · PDF, 195 MB" media={<Icon name="description" size={24} />} />
      </div>
    </div>
  );
}
