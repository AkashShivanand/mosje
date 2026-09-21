"use client";

// Client component because FormField takes a render prop, and functions cannot
// cross the server→client boundary. The server action arrives as a prop.

import { useFormStatus } from "react-dom";
import { Alert, Button, FormField, PasswordInput } from "@mosje/design-system";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" size="lg" disabled={pending} className="w-full">
      {pending ? "Checking…" : "Sign in"}
    </Button>
  );
}

export interface AdminLoginFormProps {
  action: (formData: FormData) => Promise<void>;
  invalid: boolean;
  /** Where to return after sign-in; the action checks it against an allow-list. */
  next?: string;
}

export function AdminLoginForm({ action, invalid, next }: AdminLoginFormProps) {
  return (
    <form action={action} className="mt-6 flex flex-col gap-5">
      {next ? <input type="hidden" name="next" value={next} /> : null}
      {invalid ? (
        <Alert status="error" title="Incorrect password">
          That admin password was not recognised.
        </Alert>
      ) : null}

      <FormField label="Admin password" required>
        {(control) => (
          <PasswordInput
            {...control}
            name="password"
            autoComplete="current-password"
            autoFocus
            required
          />
        )}
      </FormField>

      <SubmitButton />
    </form>
  );
}
