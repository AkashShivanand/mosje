"use client";
import * as React from "react";
import { OtpInput, Checkbox } from "@mosje/design-system";

export function OtpInputPlayground() {
  const [value, setValue] = React.useState("");
  const [length, setLength] = React.useState(6);
  const [invalid, setInvalid] = React.useState(false);
  const [disabled, setDisabled] = React.useState(false);

  return (
    <div
      style={{
        padding: "var(--sa-padding-40)",
        background: "var(--sa-bg-neutral-subtle)",
        borderRadius: "var(--sa-shape-8)",
        display: "flex",
        flexDirection: "column",
        gap: "var(--sa-stack-48)",
      }}
    >
      <div style={{ display: "flex", gap: "var(--sa-inline-16)", flexWrap: "wrap", alignSelf: "flex-start" }}>
        <label style={{ display: "flex", gap: "var(--sa-stack-8)", alignItems: "center", fontSize: "var(--sa-type-label-1-size)", lineHeight: "var(--sa-type-label-1-lh)" }}>
          <strong>Length:</strong>
          <select 
            value={length} 
            onChange={(e) => {
              setLength(Number(e.target.value));
              setValue("");
            }}
            style={{ padding: "var(--sa-padding-4) var(--sa-padding-8)", borderRadius: "var(--sa-shape-4)", border: "1px solid var(--sa-border-neutral-subtle)" }}
          >
            <option value={4}>4 Digits</option>
            <option value={6}>6 Digits</option>
          </select>
        </label>
        
        <Checkbox label="Invalid State" size="sm" checked={invalid} onCheckedChange={setInvalid} />

        <Checkbox label="Disabled" size="sm" checked={disabled} onCheckedChange={setDisabled} />
      </div>

      <div style={{ width: "100%", maxWidth: "400px" }}>
        <p style={{ margin: "0 0 var(--sa-stack-8) 0", fontSize: "var(--sa-type-title-3-size)", lineHeight: "var(--sa-type-title-3-lh)", fontWeight: "var(--sa-font-weight-semibold)" }}>Enter OTP</p>
        <OtpInput 
          value={value}
          onValueChange={setValue}
          length={length}
          invalid={invalid}
          disabled={disabled}
          label="One-time password"
          onComplete={(code) => alert(`Completed! Code: ${code}`)}
        />
        <p style={{ margin: "var(--sa-stack-8) 0 0 0", fontSize: "var(--sa-type-body-2-size)", lineHeight: "var(--sa-type-body-2-lh)", color: "var(--sa-text-neutral-subtle)" }}>
          Try pasting a number like &quot;123456&quot; or using the arrow keys to navigate.
        </p>
      </div>
    </div>
  );
}
