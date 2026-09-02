"use client";

import { Breadcrumb } from "@mosje/design-system";
import * as React from "react";

export function BreadcrumbSpecimen(): React.JSX.Element {
  return (
    <div style={{ display: "grid", gap: "var(--sa-stack-24)" }}>
      <Breadcrumb
        items={[
          { label: "Home", href: "/website" },
          { label: "Schemes", href: "/website/schemes" },
          { label: "Pre-Matric Scholarship for SC Students" },
        ]}
      />
      <Breadcrumb
        label="You are here"
        items={[
          { label: "Home", href: "/website" },
          { label: "Documents", href: "/website/documents" },
          { label: "Annual Reports", href: "/website/documents/annual-reports" },
          { label: "Annual Report 2025–26" },
        ]}
      />
    </div>
  );
}
