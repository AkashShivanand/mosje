"use client";

// Client component because FormField takes a render prop, and functions cannot
// cross the server→client boundary. The server action arrives as a prop.

import { useFormStatus } from "react-dom";
import { Alert, Button, FormField, Input } from "@mosje/design-system";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" size="lg" disabled={pending}>
      {pending ? "Checking…" : "Sign in"}
    </Button>
  );
}

export interface AdminLoginFormProps {
  action: (formData: FormData) => Promise<void>;
  invalid: boolean;
}

export function AdminLoginForm({ action, invalid }: AdminLoginFormProps) {
  return (
    <form action={action} className="mt-6 flex flex-col gap-4">
      {invalid ? (
        <Alert status="error" title="Incorrect password">
          That admin password was not recognised.
        </Alert>
      ) : null}

      <FormField label="Admin password" required>
        {(control) => (
          <Input
            {...control}
            name="password"
            type="password"
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
