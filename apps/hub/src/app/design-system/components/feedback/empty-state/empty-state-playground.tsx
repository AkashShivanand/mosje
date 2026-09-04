"use client";
import * as React from "react";
import { Button, EmptyState, Icon, Checkbox } from "@mosje/design-system";

export function EmptyStatePlayground() {
  const [hasIcon, setHasIcon] = React.useState(true);
  const [hasDescription, setHasDescription] = React.useState(true);
  const [hasAction, setHasAction] = React.useState(true);

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
        <Checkbox label="Include icon" size="sm" checked={hasIcon} onCheckedChange={setHasIcon} />
        
        <Checkbox label="Include description" size="sm" checked={hasDescription} onCheckedChange={setHasDescription} />

        <Checkbox label="Include action" size="sm" checked={hasAction} onCheckedChange={setHasAction} />
      </div>

      <div style={{ border: "1px dashed var(--sa-border-neutral-base)", padding: "var(--sa-padding-40)", borderRadius: "var(--sa-shape-8)" }}>
        <EmptyState 
          icon={hasIcon ? <Icon name="search" size={48} style={{ opacity: 0.5 }} /> : undefined}
          title="No results found"
          description={hasDescription ? "We couldn't find anything matching your search criteria. Try adjusting your filters or checking for typos." : undefined}
          action={hasAction ? <Button appearance="outlined">Clear all filters</Button> : undefined}
        />
      </div>
    </div>
  );
}
