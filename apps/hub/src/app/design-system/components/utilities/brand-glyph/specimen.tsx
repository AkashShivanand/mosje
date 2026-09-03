"use client";

import { BrandGlyph } from "@mosje/design-system";
import * as React from "react";

/** Five different silhouettes, seated at one optical size. */
export function Specimen(): React.JSX.Element {
  return (
    <div style={{ display: "flex", gap: "var(--sa-inline-16)", alignItems: "center" }}>
      {(["facebook", "x", "instagram", "youtube", "whatsapp"] as const).map((n) => (
        <BrandGlyph key={n} name={n} size={24} />
      ))}
    </div>
  );
}
