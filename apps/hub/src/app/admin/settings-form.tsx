"use client";

import { useFormStatus } from "react-dom";
import { Alert, Button, FormField, PasswordInput } from "@mosje/design-system";

const MESSAGES: Record<string, string> = {
  short: "Use at least 12 characters.",
  mismatch: "The two entries did not match.",
  store: "Could not reach the settings store. The password was not changed.",
};

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending}>
      {pending ? "Saving…" : "Change password"}
    </Button>
  );
}

export interface GatePasswordFormProps {
  action: (formData: FormData) => Promise<void>;
  error?: string;
  saved: boolean;
}

export function GatePasswordForm({ action, error, saved }: GatePasswordFormProps) {
  return (
    <form action={action} className="flex flex-col gap-5">
      {saved ? (
        <Alert status="success" title="Password changed">
          It takes up to a minute to apply everywhere. Everyone signed in with
          the old password will be asked for the new one.
        </Alert>
      ) : null}

      {error ? (
        <Alert status="error" title="Not changed">
          {MESSAGES[error] ?? "Something went wrong."}
        </Alert>
      ) : null}

      <FormField label="New review password" hint="At least 12 characters." required>
        {(control) => (
          <PasswordInput
            {...control}
            name="password"
            autoComplete="new-password"
            required
          />
        )}
      </FormField>

      <FormField label="Confirm new password" required>
        {(control) => (
          <PasswordInput
            {...control}
            name="confirm"
            autoComplete="new-password"
            required
          />
        )}
      </FormField>

      <div className="flex justify-end pt-1">
        <SubmitButton />
      </div>
    </form>
  );
}
