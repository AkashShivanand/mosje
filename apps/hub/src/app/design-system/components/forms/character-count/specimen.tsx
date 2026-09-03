"use client";

import * as React from "react";

import { FormField, Textarea } from "@mosje/design-system";

export function CharacterCountSpecimen(): React.JSX.Element {
  const [value, setValue] = React.useState(
    "The hostel warden was informed on 12 August and no action has been taken since.",
  );
  return (
    <FormField
      label="Describe your grievance"
      hint="Say what happened and when. Do not include your Aadhaar number."
      characterCount={{ value, maxLength: 120 }}
      required
    >
      {(control) => (
        <Textarea
          {...control}
          value={value}
          onChange={(event) => setValue(event.target.value)}
          rows={4}
        />
      )}
    </FormField>
  );
}
