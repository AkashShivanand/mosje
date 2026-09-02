"use client";

import { Combobox } from "@mosje/design-system";
import * as React from "react";

const DISTRICTS = [
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
