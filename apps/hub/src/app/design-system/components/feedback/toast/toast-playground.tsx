"use client";
import * as React from "react";
import { useToast, Button } from "@mosje/design-system";

export function ToastPlayground() {
  const { toast } = useToast();
  const [variant, setVariant] = React.useState<"success" | "info" | "warning" | "error">("success");
  const [message, setMessage] = React.useState("Application saved successfully.");

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
      <div style={{ display: "flex", gap: "var(--sa-inline-16)", flexWrap: "wrap" }}>
        <label style={{ display: "flex", gap: "8px", alignItems: "center", fontSize: "14px", flex: 1 }}>
          <strong>Message:</strong>
          <input 
            type="text" 
            value={message} 
            onChange={(e) => setMessage(e.target.value)}
            style={{ padding: "4px 8px", borderRadius: "4px", border: "1px solid var(--sa-border-neutral-subtle)", flex: 1, minWidth: "200px" }}
          />
        </label>
        
        <label style={{ display: "flex", gap: "8px", alignItems: "center", fontSize: "14px" }}>
          <strong>Variant:</strong>
          <select 
            value={variant} 
            onChange={(e) => setVariant(e.target.value as any)}
            style={{ padding: "4px 8px", borderRadius: "4px", border: "1px solid var(--sa-border-neutral-subtle)" }}
          >
            <option value="success">Success</option>
            <option value="info">Info</option>
            <option value="warning">Warning</option>
            <option value="error">Error</option>
          </select>
        </label>
      </div>

      <div style={{ display: "flex", justifyContent: "flex-start" }}>
        <Button 
          variant="primary" 
          onClick={() => {
            toast(message, variant);
          }}
        >
          Show Toast
        </Button>
      </div>
    </div>
  );
}
