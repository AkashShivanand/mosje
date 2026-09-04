"use client";

import { Text } from "@mosje/design-system";
import * as React from "react";

export function TextSpecimen(): React.JSX.Element {
  return (
    <div style={{ display: "grid", gap: "var(--sa-stack-24)" }}>
      <div>
        <Text measure flow>
          Villages declared as Adarsh Gram and hostels sanctioned under the scheme, at the locations
          recorded in the PM-AJAY Management Information System.
        </Text>
        <Text measure flow variant="body-2" tone="subtle">
          Figures as on 31 March 2026.
        </Text>
      </div>
      <div style={{ display: "grid", gap: "var(--sa-stack-8)" }}>
        <Text as="span" variant="label-3">
          Scheme Delivery
        </Text>
        <Text as="span" variant="label-1">
          Mobile Number
        </Text>
        <Text as="span" variant="body-3" tone="subtle">
          Source: PM-AJAY MIS
        </Text>
        <Text as="span" variant="title-1">
          Grants Released to States
        </Text>
        <Text as="span" variant="body-1" numeric>
          1,24,560 · 98,410 · 7,205
        </Text>
      </div>
      <Text lang="hi" measure>
        सामाजिक न्याय और अधिकारिता मंत्रालय — हर नागरिक के लिए न्याय।
      </Text>
    </div>
  );
}
