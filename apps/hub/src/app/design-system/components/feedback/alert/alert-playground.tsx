"use client";
import * as React from "react";
import { Alert } from "@mosje/design-system";

export function AlertPlayground() {
  const [status, setStatus] = React.useState<"info" | "success" | "warning" | "error">("info");
  const [dismissible, setDismissible] = React.useState(true);

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
        <label style={{ display: "flex", gap: "8px", alignItems: "center", fontSize: "14px" }}>
          <strong>Status:</strong>
          <select 
            value={status} 
            onChange={(e) => setStatus(e.target.value as any)}
            style={{ padding: "4px 8px", borderRadius: "4px", border: "1px solid var(--sa-border-neutral-subtle)" }}
          >
            <option value="info">Info</option>
            <option value="success">Success</option>
            <option value="warning">Warning</option>
            <option value="error">Error</option>
          </select>
        </label>

        <label style={{ display: "flex", gap: "8px", alignItems: "center", fontSize: "14px" }}>
          <input 
            type="checkbox" 
            checked={dismissible} 
            onChange={(e) => setDismissible(e.target.checked)} 
          />
          <strong>Dismissible</strong>
        </label>
      </div>

      <Alert 
        status={status} 
        title={status.charAt(0).toUpperCase() + status.slice(1) + " Alert"}
        dismissible={dismissible}
        onDismiss={() => window.alert("Dismissed!")}
      >
        This is an example of the Alert component displaying a {status} message. Use alerts to deliver important information or feedback to users.
      </Alert>
    </div>
  );
}
