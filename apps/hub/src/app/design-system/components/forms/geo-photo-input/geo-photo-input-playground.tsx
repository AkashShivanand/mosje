"use client";
import * as React from "react";
import { GeoPhotoInput, FormField, type GeoPhoto } from "@mosje/design-system";

export function GeoPhotoInputPlayground() {
  const [photos, setPhotos] = React.useState<GeoPhoto[]>([]);
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
        <label style={{ display: "flex", gap: "var(--sa-stack-8)", alignItems: "center", fontSize: "14px" }}>
          <input 
            type="checkbox" 
            checked={invalid} 
            onChange={(e) => setInvalid(e.target.checked)} 
          />
          <strong>Invalid State</strong>
        </label>
        
        <label style={{ display: "flex", gap: "var(--sa-stack-8)", alignItems: "center", fontSize: "14px" }}>
          <input 
            type="checkbox" 
            checked={disabled} 
            onChange={(e) => setDisabled(e.target.checked)} 
          />
          <strong>Disabled</strong>
        </label>
      </div>

      <div style={{ width: "100%", maxWidth: "600px" }}>
        <FormField 
          label="Site Evidence Photos"
          hint="Please upload exactly 2 photos of the site. The location will be automatically captured."
          error={invalid ? "You must provide 2 photos." : undefined}
          required
        >
          {(props) => (
            <GeoPhotoInput 
              {...props}
              value={photos}
              onChange={setPhotos}
              maxItems={2}
              minItems={2}
              disabled={disabled}
            />
          )}
        </FormField>
      </div>
    </div>
  );
}
