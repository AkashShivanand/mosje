"use client";

import { Button, ErrorSummary, FormField, Input } from "@mosje/design-system";
import * as React from "react";

const FIELDS = [
  { id: "es-name", label: "Applicant's Name", value: "", error: "Enter the applicant's name as it appears on the Aadhaar card" },
  { id: "es-date", label: "Date the Caste Certificate Was Issued", value: "", error: "Enter the date the caste certificate was issued" },
  { id: "es-income", label: "Annual Household Income", value: "4,20,000", error: "Enter the income in rupees, without commas" },
];

/**
 * A form that has just failed, which is the only state this component has.
 *
 * `autoFocus` is off here and ONLY here: the specimen renders on page load, and
 * a component that grabs focus as a documentation page settles would throw a
 * reader out of the page they were reading. In a real form it stays on.
 */
export function ErrorSummarySpecimen(): React.JSX.Element {
  const [submitted, setSubmitted] = React.useState(true);
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        setSubmitted(true);
      }}
      style={{ maxWidth: 560 }}
    >
      {submitted ? (
        <ErrorSummary
          autoFocus={false}
          errors={FIELDS.map((f) => ({ fieldId: f.id, message: f.error }))}
        />
      ) : null}
      {FIELDS.map((f) => (
        <div key={f.id} style={{ marginBlockEnd: "var(--sa-stack-16)" }}>
          <FormField label={f.label} id={f.id} error={submitted ? f.error : undefined} required>
            {(c) => <Input {...c} defaultValue={f.value} />}
          </FormField>
        </div>
      ))}
      <Button type="submit">Submit Application</Button>
    </form>
  );
}
