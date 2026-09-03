"use client";

import { DocumentLibrary } from "@mosje/design-system";
import * as React from "react";

export function Specimen(): React.JSX.Element {
  return (
    <DocumentLibrary
      noun="document"
      items={[
        { id: "1", group: "Circulars", meta: "PDF · 240 KB · 12 Aug 2026", title: "Revised Scholarship Rates for 2026–27", href: "#", actionLabel: "Download the circular" },
        { id: "2", group: "Circulars", meta: "PDF · 180 KB · 03 Jul 2026", title: "Extension of the Application Window", href: "#", actionLabel: "Download the circular" },
        { id: "3", group: "Formats", meta: "DOCX · 90 KB", title: "Utilisation Certificate", officialName: "Form GFR 12-A", href: "#", actionLabel: "Download the format" },
        { id: "4", group: "Manuals", meta: "PDF · 3.2 MB", title: "Scheme Implementation Manual", href: "#", actionLabel: "Download the manual" },
      ]}
    />
  );
}
