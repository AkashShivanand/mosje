"use client";

import * as React from "react";
import { Icon, Link } from "@mosje/design-system";

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
    </div>
  );
}
