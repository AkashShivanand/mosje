"use client";
import * as React from "react";
import { PasswordStrengthMeter, FormField, PasswordInput } from "@mosje/design-system";

export function PasswordStrengthMeterPlayground() {
  const [password, setPassword] = React.useState("");
  const reactId = React.useId();
  const meterId = \`\${reactId}-meter\`;

  // A very crude simulation of zxcvbn for playground purposes only.
  const getScore = (pw: string): 0 | 1 | 2 | 3 | 4 | null => {
    if (!pw) return null;
    if (pw.length < 6) return 0;
    if (pw.length < 8) return 1;
    if (pw.length < 10) return 2;
    if (pw.length < 12) return 3;
    return 4;
  };

  const score = getScore(password);

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
      <div style={{ width: "100%", maxWidth: "400px" }}>
        <FormField label="Create Password">
          {(props) => (
            <PasswordInput 
              {...props}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Type to see the meter change"
              aria-describedby={meterId}
              autoComplete="new-password"
            />
          )}
        </FormField>
        <div style={{ marginTop: "var(--sa-stack-8)" }}>
          <PasswordStrengthMeter score={score} id={meterId} />
        </div>
      </div>
      <p style={{ margin: 0, fontSize: "13px", color: "var(--sa-text-neutral-subtle)" }}>
        <em>Note: This playground uses a crude length-based mock score. In production, always pass the output of the <code>zxcvbn</code> library.</em>
      </p>
    </div>
  );
}
