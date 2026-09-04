"use client";
import * as React from "react";
import { MediaUpload, FormField, Checkbox } from "@mosje/design-system";

export function MediaUploadPlayground() {
  const [value, setValue] = React.useState<string | undefined>();
  const [fileName, setFileName] = React.useState<string | undefined>();
  const [invalid, setInvalid] = React.useState(false);
  const [disabled, setDisabled] = React.useState(false);

  const handleUpload = (dataUrl: string, name: string) => {
    setValue(dataUrl);
    setFileName(name);
  };

  const handleClear = () => {
    setValue(undefined);
    setFileName(undefined);
  };

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
        <Checkbox label="Invalid State" size="sm" checked={invalid} onCheckedChange={setInvalid} />
        
        <Checkbox label="Disabled" size="sm" checked={disabled} onCheckedChange={setDisabled} />
      </div>

      <div style={{ width: "100%", maxWidth: "480px" }}>
        <FormField 
          label="Profile Picture" 
          hint="Must be a JPG or PNG under 5MB."
          error={invalid ? "Please select a valid image file." : undefined}
        >
          {(props) => (
            <MediaUpload 
              {...props}
              value={value}
              fileName={fileName}
              onChange={handleUpload}
              onClear={handleClear}
              disabled={disabled}
              maxSizeMb={5}
            />
          )}
        </FormField>
      </div>
    </div>
  );
}
