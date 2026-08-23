"use client";
import * as React from "react";
import { Button, EmptyState, Icon } from "@mosje/design-system";

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
        <label style={{ display: "flex", gap: "var(--sa-stack-8)", alignItems: "center", fontSize: "14px" }}>
          <input 
            type="checkbox" 
            checked={hasIcon} 
            onChange={(e) => setHasIcon(e.target.checked)} 
          />
          <strong>Include icon</strong>
        </label>
        
        <label style={{ display: "flex", gap: "var(--sa-stack-8)", alignItems: "center", fontSize: "14px" }}>
          <input 
            type="checkbox" 
            checked={hasDescription} 
            onChange={(e) => setHasDescription(e.target.checked)} 
          />
          <strong>Include description</strong>
        </label>

        <label style={{ display: "flex", gap: "var(--sa-stack-8)", alignItems: "center", fontSize: "14px" }}>
          <input 
            type="checkbox" 
            checked={hasAction} 
            onChange={(e) => setHasAction(e.target.checked)} 
          />
          <strong>Include action</strong>
        </label>
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
