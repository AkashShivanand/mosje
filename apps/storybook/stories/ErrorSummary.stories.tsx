import type { Meta, StoryObj } from "@storybook/react";
import * as React from "react";

import { Button, ErrorSummary, FormField, Input } from "@mosje/design-system";

/**
 * The list at the top of a form that failed validation.
 *
 * **Use it on any form long enough that the citizen cannot see every field at
 * once** — which on this estate means most of them. A scheme application runs
 * to nineteen fields; when Submit fails, `FormField` marks each bad one, but
 * the reader is at the BOTTOM of the page with focus on the button and nothing
 * announced. The summary is what tells them what went wrong and takes them
 * there.
 *
 * **Do not use it for a single-field form** — one input with one message under
 * it needs no index of itself. And do not use it INSTEAD of the per-field
 * errors: the two are a pair, and WCAG 3.3.1 wants the error identified at the
 * field as well as summarised.
 *
 * The messages are the citizen's answer, never the validator's. "Enter the date
 * the certificate was issued", not "dateOfIssue is required".
 *
 * `headingLevel` exists so the summary fits the page's outline rather than
 * imposing its own — a wizard step whose own title is already an `h2` wants the
 * summary at `3`. It has no story of its own because the only visible
 * difference is the heading's rank, and a screenshot cannot show that; what
 * matters is that you set it to whatever sits one level below the heading
 * above the form.
 */
const meta = {
  title: "Forms/ErrorSummary",
  component: ErrorSummary,
  parameters: { layout: "padded" },
} satisfies Meta<typeof ErrorSummary>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  args: {
    errors: [
      { fieldId: "applicant-name", message: "Enter the applicant's name as it appears on the Aadhaar card" },
      { fieldId: "certificate-date", message: "Enter the date the caste certificate was issued" },
      { fieldId: "annual-income", message: "Annual income must be a figure in rupees, without commas" },
    ],
  },
};

/** One error is still worth summarising on a long form — the link is the point. */
export const SingleError: Story = {
  args: {
    errors: [{ fieldId: "annual-income", message: "Enter the household's annual income" }],
  },
};

/**
 * Wired to real fields. Press a summary entry and focus moves to that input —
 * not merely a scroll, which is what a bare anchor gives you and which leaves a
 * keyboard user tabbing from the wrong place.
 */
export const LinkedToFields: Story = {
  args: { errors: [] },
  render: function LinkedToFieldsStory() {
    const errors = [
      { fieldId: "es-name", message: "Enter the applicant's name as it appears on the Aadhaar card" },
      { fieldId: "es-income", message: "Annual income must be a figure in rupees, without commas" },
    ];
    return (
      <form onSubmit={(e) => e.preventDefault()} style={{ maxWidth: 520 }}>
        <ErrorSummary errors={errors} autoFocus={false} />
        <FormField label="Applicant's Name" id="es-name" error={errors[0].message} required>
          {(c) => <Input {...c} defaultValue="" />}
        </FormField>
        <div style={{ height: 16 }} />
        <FormField label="Annual Household Income" id="es-income" error={errors[1].message} required>
          {(c) => <Input {...c} defaultValue="4,20,000" />}
        </FormField>
        <div style={{ height: 16 }} />
        <Button type="submit">Submit Application</Button>
      </form>
    );
  },
};

/** Empty renders nothing at all — not an empty box, not a heading. */
export const NoErrors: Story = { args: { errors: [] } };
