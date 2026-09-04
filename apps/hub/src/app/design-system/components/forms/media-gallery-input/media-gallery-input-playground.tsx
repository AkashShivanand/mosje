"use client";
import * as React from "react";
import { MediaGalleryInput, FormField, type GalleryMediaItem } from "@mosje/design-system";

export function MediaGalleryInputPlayground() {
  const [items, setItems] = React.useState<GalleryMediaItem[]>([]);
  const [invalid, setInvalid] = React.useState(false);
  const [disabled, setDisabled] = React.useState(false);

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
        <label style={{ display: "flex", gap: "var(--sa-stack-8)", alignItems: "center", fontSize: "var(--sa-type-label-1-size)", lineHeight: "var(--sa-type-label-1-lh)" }}>
          <input 
            type="checkbox" 
            checked={invalid} 
            onChange={(e) => setInvalid(e.target.checked)} 
          />
          <strong>Invalid State</strong>
        </label>
        
        <label style={{ display: "flex", gap: "var(--sa-stack-8)", alignItems: "center", fontSize: "var(--sa-type-label-1-size)", lineHeight: "var(--sa-type-label-1-lh)" }}>
          <input 
            type="checkbox" 
            checked={disabled} 
            onChange={(e) => setDisabled(e.target.checked)} 
          />
          <strong>Disabled</strong>
        </label>
      </div>

      <div style={{ width: "100%" }}>
        <FormField 
          label="Supporting Documents"
          hint="You can upload up to 4 images or videos."
          error={invalid ? "Please upload at least one document." : undefined}
        >
          {(props) => (
            <MediaGalleryInput 
              {...props}
              value={items}
              onChange={setItems}
              maxItems={4}
              disabled={disabled}
            />
          )}
        </FormField>
      </div>
    </div>
  );
}
