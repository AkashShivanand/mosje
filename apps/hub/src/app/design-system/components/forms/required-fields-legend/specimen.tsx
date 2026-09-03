"use client";

import * as React from "react";

import {
  FieldPolicyProvider,
  FormField,
  Input,
  RequiredFieldsLegend,
} from "@mosje/design-system";

/**
 * The legend in the only place it makes sense — above the fields whose marks it
 * explains, reading the same policy those marks read.
 *
 * A client component because `FormField` takes a render prop, and a function
 * cannot cross the server/client boundary.
 */
export function RequiredFieldsLegendSpecimen(): React.JSX.Element {
  return (
    <FieldPolicyProvider necessity="optional">
      <RequiredFieldsLegend />
      <FormField label="Full Name" hint="As shown on your Aadhaar card" required>
        {(control) => <Input {...control} placeholder="Enter your full name" />}
      </FormField>
      <FormField label="Alternate Mobile Number" optional>
        {(control) => (
          <Input {...control} type="tel" inputMode="numeric" autoComplete="tel" />
        )}
      </FormField>
    </FieldPolicyProvider>
  );
}
