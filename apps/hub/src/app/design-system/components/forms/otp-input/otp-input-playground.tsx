"use client";
import * as React from "react";
import { OtpInput, Checkbox } from "@mosje/design-system";

const stack: React.CSSProperties = { display: "grid", gap: "var(--sa-stack-12)" };
const eyebrow: React.CSSProperties = {
  margin: 0,
  fontSize: "var(--sa-type-label-3-size)",
  lineHeight: "var(--sa-type-label-3-lh)",
  letterSpacing: "var(--sa-type-label-tracking)",
  textTransform: "uppercase",
  color: "var(--sa-text-neutral-subtle)",
};

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

      <div style={stack}>
        <p style={eyebrow}>Arrangements the master grid does not show</p>
        <OtpInput length={4} value="12" onValueChange={() => {}} label="Four-digit code, partly entered" />
        <OtpInput length={6} value="123456" onValueChange={() => {}} label="Six-digit code, complete" />
        <OtpInput length={6} value="123456" onValueChange={() => {}} invalid label="Six-digit code, rejected" aria-describedby="otp-arr-error" />
        <p id="otp-arr-error" role="alert" style={{ margin: 0, color: "var(--sa-text-status-error-base)", fontSize: "var(--sa-type-body-3-size)", lineHeight: "var(--sa-type-body-3-lh)" }}>
          The code entered is incorrect. Two attempts remain.
        </p>
        <OtpInput length={6} value="" onValueChange={() => {}} disabled label="Six-digit code, waiting for the SMS" />
      </div>
    </div>
  );
}
