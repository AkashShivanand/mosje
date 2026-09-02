"use client";

import * as React from "react";
import { FilterSelect, type FilterSelectOption } from "@mosje/design-system";

const DISTRICTS: FilterSelectOption[] = [
  { value: "all", label: "All Districts", hint: "38" },
  { value: "patna", label: "Patna", hint: "1,204" },
  { value: "gaya", label: "Gaya", hint: "878" },
  { value: "nalanda", label: "Nalanda", hint: "651" },
  { value: "bhagalpur", label: "Bhagalpur", hint: "540" },
  { value: "araria", label: "Araria", hint: "Not reported", disabled: true },
];

const YEARS: FilterSelectOption[] = [
  { value: "2026", label: "2026–27" },
  { value: "2025", label: "2025–26" },
  { value: "2024", label: "2024–25" },
];

/** A filter row, which is the only place this component belongs. */
export function FilterSelectSpecimen(): React.JSX.Element {
  const [district, setDistrict] = React.useState("all");
  const [year, setYear] = React.useState("2026");
  return (
    <div className="cdp-row">
      <FilterSelect
        label="District"
        options={DISTRICTS}
        value={district}
        onChange={setDistrict}
        width={220}
      />
      <FilterSelect
        label="Financial Year"
        options={YEARS}
        value={year}
        onChange={setYear}
        width={180}
      />
    </div>
  );
}
