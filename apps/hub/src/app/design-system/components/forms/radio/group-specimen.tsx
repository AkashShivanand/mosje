"use client";

import { RadioGroup } from "@mosje/design-system";
import * as React from "react";

/** A live group, so the fieldset and legend can be inspected rather than described. */
export function RadioGroupSpecimen(): React.JSX.Element {
  const [category, setCategory] = React.useState("sc");
  return (
    <div style={{ maxWidth: 520 }}>
      <RadioGroup
        legend="Category of the Applicant"
        name="ds-category-specimen"
        required
        hint="As recorded on the caste certificate issued by the competent authority."
        value={category}
        onChange={setCategory}
        options={[
          { value: "sc", label: "Scheduled Caste" },
          { value: "st", label: "Scheduled Tribe" },
          { value: "obc", label: "Other Backward Class" },
          { value: "gen", label: "General" },
        ]}
      />
    </div>
  );
}
