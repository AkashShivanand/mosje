"use client";
import * as React from "react";
import { AadhaarInput, FormField, Checkbox } from "@mosje/design-system";

export function AadhaarPlayground() {
  const [value, setValue] = React.useState("");
  const [mask, setMask] = React.useState(true);
  
  // The component validates Verhoeff automatically and sets aria-invalid if complete but wrong.
  // We'll just show the error message if it's exactly 12 but we pretend it's wrong for demo if it ends in 0.
  const complete = value.length === 12;
  const showErr = complete && value.endsWith("0");

  return (
    <div
      style={{
        padding: "var(--sa-padding-40)",
        background: "var(--sa-bg-neutral-subtle)",
        borderRadius: "var(--sa-shape-8)",
        display: "flex",
        flexDirection: "column",
        gap: "var(--sa-stack-24)",
        maxWidth: "400px",
        margin: "0 auto"
      }}
    >
      <FormField
        label="Aadhaar Number"
        required
        hint="12 digits as printed on your Aadhaar card"
        error={showErr ? "Enter a valid 12-digit Aadhaar number" : undefined}
      >
        {(f) => (
          <AadhaarInput
            {...f}
            value={value}
            onValueChange={setValue}
            mask={mask}
            invalid={showErr}
          />
        )}
      </FormField>

      <div style={{ paddingTop: "var(--sa-stack-16)", borderTop: "1px solid var(--sa-border-neutral-subtle)" }}>
         <Checkbox checked={mask} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setMask(e.target.checked)}>
            Enable DPDP Masking (Default)
         </Checkbox>
      </div>
    </div>
  );
}
