"use client";

import { useState } from "react";
import { Alert, Button, FormField, Icon, Input, Textarea } from "@mosje/design-system";

/** GIGW-compliant feedback form: instructions first, every field labelled, keyboard operable. */
export function FeedbackForm() {
  const [sent, setSent] = useState(false);

  if (sent) {
    return (
      <Alert status="success" title="Thank you">
        Your message has been received. We will get back to you shortly.
      </Alert>
    );
  }

  return (
    <form
      className="space-y-4"
      onSubmit={(e) => {
        e.preventDefault();
        setSent(true);
      }}
    >
      <p className="text-body-2 text-ink-muted">
        Fields marked <span className="text-red-600">*</span> are required. We typically respond within 3 working days.
      </p>
      <div className="grid gap-4 sm:grid-cols-2">
        <FormField label="Name" id="fb-name" required>
          {(control) => (
            <Input {...control} name="name" type="text" autoComplete="name" />
          )}
        </FormField>
        <FormField label="Email" id="fb-email" required>
          {(control) => (
            <Input {...control} name="email" type="email" autoComplete="email" />
          )}
        </FormField>
      </div>
      <FormField label="Subject" id="fb-subject" required>
        {(control) => <Input {...control} name="subject" type="text" />}
      </FormField>
      <FormField label="Message" id="fb-message" required>
        {(control) => <Textarea {...control} name="message" rows={5} />}
      </FormField>
      <Button type="submit" iconLeft={<Icon name="send" size={16} />}>
        Submit
      </Button>
    </form>
  );
}
