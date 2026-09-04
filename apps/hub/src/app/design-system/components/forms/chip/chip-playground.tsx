"use client";
import * as React from "react";
import { Chip, Icon, Checkbox } from "@mosje/design-system";

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
        <Checkbox label="Interactive (Toggleable)" size="sm" checked={interactive} onCheckedChange={setInteractive} />
        
        <Checkbox label="Disabled" size="sm" checked={disabled} onCheckedChange={setDisabled} />

        <Checkbox label="Leading Icon" size="sm" checked={hasLeadingIcon} onCheckedChange={setHasLeadingIcon} />

        <Checkbox label="Dismissible" size="sm" checked={hasDismiss} onCheckedChange={setHasDismiss} />
        
        <Checkbox label="Dropdown Chevron" size="sm" checked={hasTrailingDropdown} onCheckedChange={setHasTrailingDropdown} />
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
