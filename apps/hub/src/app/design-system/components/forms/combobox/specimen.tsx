"use client";

import { Combobox, type ComboboxOption } from "@mosje/design-system";
import * as React from "react";

const DISTRICTS: ComboboxOption[] = [
  { value: "ba", label: "Bankura", hint: "West Bengal" },
  { value: "bh", label: "Bhagalpur", hint: "Bihar" },
  { value: "na", label: "Nalanda", hint: "Bihar" },
  { value: "nd", label: "Nadia", hint: "West Bengal" },
  { value: "pu", label: "Purulia", hint: "West Bengal" },
  { value: "ra", label: "Ranchi", hint: "Jharkhand" },
  { value: "so", label: "Sonbhadra", hint: "Uttar Pradesh", disabled: true },
];

export function ComboboxSpecimen(): React.JSX.Element {
  const [district, setDistrict] = React.useState("");
  return (
    <div style={{ maxWidth: "22rem" }}>
      <Combobox
        label="District"
        options={DISTRICTS}
        value={district}
        onChange={setDistrict}
        hint="Type any part of the district or state name."
      />
    </div>
  );
}

export function ComboboxMultipleSpecimen(): React.JSX.Element {
  const [districts, setDistricts] = React.useState<string[]>(["ba", "ra"]);
  return (
    <div style={{ maxWidth: "22rem" }}>
      <Combobox
        multiple
        label="Districts of Operation"
        options={DISTRICTS}
        value={districts}
        onChange={setDistricts}
        hint="Choose every district the organisation works in."
      />
    </div>
  );
}

/** Both modes, side by side — the single field's answer, then several. */
export function ComboboxSpecimens(): React.JSX.Element {
  return (
    <div style={{ display: "flex", flexWrap: "wrap", alignItems: "flex-start", gap: "var(--sa-inline-32)" }}>
      <ComboboxSpecimen />
      <ComboboxMultipleSpecimen />
    </div>
  );
}
