"use client";
import * as React from "react";
import { Chip, Icon } from "@mosje/design-system";

export function ChipPlayground() {
  const [selected, setSelected] = React.useState(false);
  const [interactive, setInteractive] = React.useState(true);
  const [disabled, setDisabled] = React.useState(false);
  const [hasLeadingIcon, setHasLeadingIcon] = React.useState(true);
  const [hasDismiss, setHasDismiss] = React.useState(true);
  const [hasTrailingDropdown, setHasTrailingDropdown] = React.useState(false);

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
            checked={interactive} 
            onChange={(e) => setInteractive(e.target.checked)} 
          />
          <strong>Interactive (Toggleable)</strong>
        </label>
        
        <label style={{ display: "flex", gap: "var(--sa-stack-8)", alignItems: "center", fontSize: "14px" }}>
          <input 
            type="checkbox" 
            checked={disabled} 
            onChange={(e) => setDisabled(e.target.checked)} 
          />
          <strong>Disabled</strong>
        </label>

        <label style={{ display: "flex", gap: "var(--sa-stack-8)", alignItems: "center", fontSize: "14px" }}>
          <input 
            type="checkbox" 
            checked={hasLeadingIcon} 
            onChange={(e) => setHasLeadingIcon(e.target.checked)} 
          />
          <strong>Leading Icon</strong>
        </label>

        <label style={{ display: "flex", gap: "var(--sa-stack-8)", alignItems: "center", fontSize: "14px" }}>
          <input 
            type="checkbox" 
            checked={hasDismiss} 
            onChange={(e) => setHasDismiss(e.target.checked)} 
          />
          <strong>Dismissible</strong>
        </label>
        
        <label style={{ display: "flex", gap: "var(--sa-stack-8)", alignItems: "center", fontSize: "14px" }}>
          <input 
            type="checkbox" 
            checked={hasTrailingDropdown} 
            onChange={(e) => setHasTrailingDropdown(e.target.checked)} 
          />
          <strong>Dropdown Chevron</strong>
        </label>
      </div>

      <div style={{ display: "flex", gap: "var(--sa-inline-12)", flexWrap: "wrap" }}>
        <Chip
          selected={interactive ? selected : false}
          onSelectedChange={interactive ? setSelected : undefined}
          disabled={disabled}
          leadingIcon={hasLeadingIcon ? <Icon name="person" size={16} /> : undefined}
          onDismiss={hasDismiss ? () => alert("Dismissed!") : undefined}
          trailingDropdown={hasTrailingDropdown}
        >
          {interactive ? "Toggle me" : "Static Chip"}
        </Chip>
        
        <Chip
          selected={interactive ? !selected : false}
          onSelectedChange={interactive ? (val) => setSelected(!val) : undefined}
          disabled={disabled}
          leadingIcon={hasLeadingIcon ? <Icon name="filter_alt" size={16} /> : undefined}
          onDismiss={hasDismiss ? () => alert("Dismissed!") : undefined}
          trailingDropdown={hasTrailingDropdown}
        >
          Another Chip
        </Chip>
      </div>
    </div>
  );
}
