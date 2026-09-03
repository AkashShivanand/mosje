import { ContentNav } from "@mosje/design-system";
import * as React from "react";

export function Specimen(): React.JSX.Element {
  return (
    <div style={{ maxWidth: "18rem" }}>
      <ContentNav
        ariaLabel="On this page"
        groups={[
          {
            label: "OUR WORK & IMPACT",
            items: [
              { label: "Overview", href: "#overview", current: true },
              { label: "Scheme Components", href: "#components" },
              { label: "Eligibility", href: "#eligibility" },
            ],
          },
          {
            label: "DOCUMENTS",
            items: [
              { label: "Circulars", href: "#circulars" },
              { label: "Formats", href: "#formats" },
            ],
          },
        ]}
      />
    </div>
  );
}
