"use client";

import { Input, RadioGroup } from "@mosje/design-system";
import * as React from "react";

/** Live groups, so the fieldset, legend, error and reveal can be inspected rather than described. */
export function RadioGroupSpecimen(): React.JSX.Element {
  const [category, setCategory] = React.useState<string | undefined>(undefined);
  const [contact, setContact] = React.useState("email");
  return (
    <div style={{ display: "grid", gap: "var(--sa-stack-32)", maxWidth: 520 }}>
      <RadioGroup
        legend="Category of the Applicant"
        name="ds-category-specimen"
        required
        hint="As recorded on the caste certificate issued by the competent authority."
        value={category}
        onChange={setCategory}
        error={category ? undefined : "Select the applicant's category to continue"}
        options={[
          { value: "sc", label: "Scheduled Caste" },
          { value: "st", label: "Scheduled Tribe" },
          { value: "obc", label: "Other Backward Class" },
          { value: "gen", label: "General" },
        ]}
      />
      <RadioGroup
        legend="How Should the Department Contact You?"
        name="ds-contact-specimen"
        value={contact}
        onChange={setContact}
        options={[
          {
            value: "email",
            label: "Email",
            reveal: <Input aria-label="Email address" placeholder="name@example.gov.in" />,
          },
          {
            value: "sms",
            label: "SMS",
            reveal: <Input aria-label="Mobile number" inputMode="numeric" placeholder="10-digit mobile number" />,
          },
          { value: "post", label: "Post", description: "To the address on the application." },
        ]}
      />
    </div>
  );
}
