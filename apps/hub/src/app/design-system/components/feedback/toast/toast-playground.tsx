"use client";
import * as React from "react";
import { ToastProvider, useToast, Button } from "@mosje/design-system";

/**
 * The demo body. It must be rendered inside <ToastProvider>, so ToastPlayground below wraps
 * it; calling useToast outside a provider throws, and that failed the prerender of this page.
 */
function ToastDemo() {
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
        <label style={{ display: "flex", gap: "var(--sa-stack-8)", alignItems: "center", fontSize: "var(--sa-type-label-1-size)", lineHeight: "var(--sa-type-label-1-lh)", flex: 1 }}>
          <strong>Message:</strong>
          <input 
            type="text" 
            value={message} 
            onChange={(e) => setMessage(e.target.value)}
            style={{ padding: "var(--sa-padding-4) var(--sa-padding-8)", borderRadius: "var(--sa-shape-4)", border: "1px solid var(--sa-border-neutral-subtle)", flex: 1, minWidth: "200px" }}
          />
        </label>
        
        <label style={{ display: "flex", gap: "var(--sa-stack-8)", alignItems: "center", fontSize: "var(--sa-type-label-1-size)", lineHeight: "var(--sa-type-label-1-lh)" }}>
          <strong>Variant:</strong>
          <select 
            value={variant} 
            onChange={(e) => setVariant(e.target.value as typeof variant)}
            style={{ padding: "var(--sa-padding-4) var(--sa-padding-8)", borderRadius: "var(--sa-shape-4)", border: "1px solid var(--sa-border-neutral-subtle)" }}
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

export function ToastPlayground() {
  return (
    <ToastProvider>
      <ToastDemo />
    </ToastProvider>
  );
}
