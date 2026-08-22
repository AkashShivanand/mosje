"use client";
import * as React from "react";
import { CaptchaField } from "@mosje/design-system";

export function CaptchaFieldPlayground() {
  const [value, setValue] = React.useState("");
  const [invalid, setInvalid] = React.useState(false);
  const [disabled, setDisabled] = React.useState(false);
  
  const handleRefresh = () => {
    alert("Captcha refreshed (value cleared).");
    setValue("");
  };

  return (
    <div
      style={{
        padding: "var(--sa-padding-40)",
        background: "var(--sa-bg-neutral-subtle)",
        borderRadius: "var(--sa-shape-8)",
        display: "flex",
        flexDirection: "column",
        gap: "var(--sa-stack-24)",
      }}
    >
      <div style={{ display: "flex", gap: "var(--sa-inline-16)", flexWrap: "wrap", marginBottom: "var(--sa-stack-16)" }}>
        <label style={{ display: "flex", gap: "var(--sa-stack-8)", alignItems: "center", fontSize: "14px" }}>
          <input 
            type="checkbox" 
            checked={invalid} 
            onChange={(e) => setInvalid(e.target.checked)} 
          />
          <strong>Invalid State</strong>
        </label>
        
        <label style={{ display: "flex", gap: "var(--sa-stack-8)", alignItems: "center", fontSize: "14px" }}>
          <input 
            type="checkbox" 
            checked={disabled} 
            onChange={(e) => setDisabled(e.target.checked)} 
          />
          <strong>Disabled</strong>
        </label>
      </div>

      <div style={{ width: "100%", maxWidth: "320px" }}>
        <CaptchaField
          challenge={{ type: "text", characters: "AB7X9" }}
          value={value}
          onValueChange={setValue}
          onRefresh={handleRefresh}
          disabled={disabled}
          error={invalid ? "Incorrect characters entered." : undefined}
        />
      </div>
    </div>
  );
}
