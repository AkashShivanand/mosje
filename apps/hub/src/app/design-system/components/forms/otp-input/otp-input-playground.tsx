"use client";
import * as React from "react";
import { OtpInput } from "@mosje/design-system";

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
        <label style={{ display: "flex", gap: "8px", alignItems: "center", fontSize: "14px" }}>
          <strong>Length:</strong>
          <select 
            value={length} 
            onChange={(e) => {
              setLength(Number(e.target.value));
              setValue("");
            }}
            style={{ padding: "4px 8px", borderRadius: "4px", border: "1px solid var(--sa-border-neutral-subtle)" }}
          >
            <option value={4}>4 Digits</option>
            <option value={6}>6 Digits</option>
          </select>
        </label>
        
        <label style={{ display: "flex", gap: "8px", alignItems: "center", fontSize: "14px" }}>
          <input 
            type="checkbox" 
            checked={invalid} 
            onChange={(e) => setInvalid(e.target.checked)} 
          />
          <strong>Invalid State</strong>
        </label>

        <label style={{ display: "flex", gap: "8px", alignItems: "center", fontSize: "14px" }}>
          <input 
            type="checkbox" 
            checked={disabled} 
            onChange={(e) => setDisabled(e.target.checked)} 
          />
          <strong>Disabled</strong>
        </label>
      </div>

      <div style={{ width: "100%", maxWidth: "400px" }}>
        <p style={{ margin: "0 0 8px 0", fontSize: "14px", fontWeight: 600 }}>Enter OTP</p>
        <OtpInput 
          value={value}
          onValueChange={setValue}
          length={length}
          invalid={invalid}
          disabled={disabled}
          label="One-time password"
          onComplete={(code) => alert(`Completed! Code: ${code}`)}
        />
        <p style={{ margin: "8px 0 0 0", fontSize: "13px", color: "var(--sa-text-neutral-subtle)" }}>
          Try pasting a number like &quot;123456&quot; or using the arrow keys to navigate.
        </p>
      </div>
    </div>
  );
}
