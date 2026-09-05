"use client";
import * as React from "react";
import { ActionBanner, Button, Checkbox } from "@mosje/design-system";

export function ActionBannerPlayground() {
  const [hasDescription, setHasDescription] = React.useState(true);

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
        <Checkbox label="Include description" size="sm" checked={hasDescription} onCheckedChange={setHasDescription} />
      </div>

      <ActionBanner 
        title="Ready to get started?"
        description={hasDescription ? "Sign up for an account to access our comprehensive suite of tools and services. It only takes a minute." : undefined}
        action={<Button variant="primary">Create account</Button>}
      />
    </div>
  );
}
