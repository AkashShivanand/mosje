"use client";

import { Heading } from "@mosje/design-system";
import * as React from "react";

export function HeadingSpecimen(): React.JSX.Element {
  return (
    <div style={{ display: "grid", gap: "var(--sa-stack-16)" }}>
      <Heading level={1} variant="display-4">
        Digital India, Inclusive India
      </Heading>
      <Heading level={1}>Scheme Coverage</Heading>
      <Heading level={2}>Grants Released to States</Heading>
      <Heading level={3}>Andhra Pradesh</Heading>
      <Heading level={3} variant="title-1">
        Post-Matric Scholarship for Scheduled Castes
      </Heading>
      <Heading level={2} lang="hi">
        हर नागरिक के लिए न्याय
      </Heading>
    </div>
  );
}
