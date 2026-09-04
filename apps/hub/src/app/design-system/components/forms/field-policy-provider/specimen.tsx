"use client";

import * as React from "react";

import {
  FieldPolicyProvider,
  FormField,
  Input,
  RequiredFieldsLegend,
  Select,
  type NecessityIndicator,
} from "@mosje/design-system";

export function FieldPolicySpecimen(): React.JSX.Element {
  const [necessity, setNecessity] = React.useState<NecessityIndicator>("optional");

  return (
    <div className="ds-stack">
      <FormField label="Marking convention" hint="Switch the policy to see every field below follow it.">
        {(control) => (
          <Select
            {...control}
            value={necessity}
            onChange={(event) => setNecessity(event.target.value as NecessityIndicator)}
            options={[
              { value: "required", label: "Mark the mandatory fields" },
              { value: "optional", label: "Mark the optional fields" },
              { value: "none", label: "Mark neither" },
            ]}
          />
        )}
      </FormField>

      <FieldPolicyProvider necessity={necessity}>
        <RequiredFieldsLegend />
        <FormField label="Full Name" required>
          {(control) => <Input {...control} autoComplete="name" />}
        </FormField>
        <FormField label="Father's or Mother's Name" required>
          {(control) => <Input {...control} autoComplete="off" />}
        </FormField>
        <FormField label="Alternate Mobile Number">
          {(control) => <Input {...control} type="tel" autoComplete="tel" />}
        </FormField>
      </FieldPolicyProvider>
    </div>
  );
}
