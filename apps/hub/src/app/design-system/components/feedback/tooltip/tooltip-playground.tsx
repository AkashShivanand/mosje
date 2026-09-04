"use client";
import * as React from "react";
import { Tooltip, Button, Checkbox } from "@mosje/design-system";

export function TooltipPlayground() {
  const [side, setSide] = React.useState<"top" | "bottom" | "left" | "right">("top");
  const [delay, setDelay] = React.useState(200);
  const [duplicatesTriggerName, setDuplicatesTriggerName] = React.useState(false);

  return (
    <div
      style={{
        padding: "var(--sa-padding-40)",
        background: "var(--sa-bg-neutral-subtle)",
        borderRadius: "var(--sa-shape-8)",
        display: "flex",
        flexDirection: "column",
        gap: "var(--sa-stack-48)",
        alignItems: "center",
      }}
    >
      <div style={{ display: "flex", gap: "var(--sa-inline-16)", flexWrap: "wrap", alignSelf: "flex-start" }}>
        <label style={{ display: "flex", gap: "var(--sa-stack-8)", alignItems: "center", fontSize: "14px" }}>
          <strong>Side:</strong>
          <select 
            value={side} 
            onChange={(e) => setSide(e.target.value as typeof side)}
            style={{ padding: "var(--sa-padding-4) var(--sa-padding-8)", borderRadius: "var(--sa-shape-4)", border: "1px solid var(--sa-border-neutral-subtle)" }}
          >
            <option value="top">Top</option>
            <option value="bottom">Bottom</option>
            <option value="left">Left</option>
            <option value="right">Right</option>
          </select>
        </label>
        
        <label style={{ display: "flex", gap: "var(--sa-stack-8)", alignItems: "center", fontSize: "14px" }}>
          <strong>Delay (ms):</strong>
          <input 
            type="number" 
            value={delay} 
            onChange={(e) => setDelay(Number(e.target.value))}
            style={{ padding: "var(--sa-padding-4) var(--sa-padding-8)", borderRadius: "var(--sa-shape-4)", border: "1px solid var(--sa-border-neutral-subtle)", width: "80px" }}
          />
        </label>

        <Checkbox label="Duplicates trigger name" size="sm" checked={duplicatesTriggerName} onCheckedChange={setDuplicatesTriggerName} />
      </div>

      <div style={{ margin: "var(--sa-stack-40) 0" }}>
        <Tooltip 
          content="This is the tooltip content!" 
          side={side} 
          delay={delay}
          duplicatesTriggerName={duplicatesTriggerName}
        >
          <Button variant="primary">Hover or Focus me</Button>
        </Tooltip>
      </div>
    </div>
  );
}
