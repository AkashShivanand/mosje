"use client";

import { Button, SectionTitle } from "@mosje/design-system";
import * as React from "react";

export function SectionTitleSpecimen(): React.JSX.Element {
  return (
    <div style={{ display: "grid", gap: "var(--sa-stack-32)" }}>
      <SectionTitle
        eyebrow="Scheme Delivery"
        title="Grants Released to States"
        description="Figures as recorded in the PM-AJAY Management Information System."
        count={28}
      />
      <SectionTitle title="Documents & Downloads" as={3}>
        <Button size="sm" variant="neutral">
          View All
        </Button>
      </SectionTitle>
    </div>
  );
}
