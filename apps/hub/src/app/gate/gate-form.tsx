"use client";

/**
 * The gate's form half.
 *
 * Split out of page.tsx because FormField takes a render prop, and functions
 * cannot cross the server→client boundary. The server action arrives as a prop,
 * which is allowed — it is marked "use server" at its definition.
 */

import { useFormStatus } from "react-dom";
import { Alert, Button, FormField, PasswordInput } from "@mosje/design-system";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" size="lg" disabled={pending} className="w-full">
      {pending ? "Checking…" : "Continue"}
    </Button>
  );
}

export interface GateFormProps {
  /** Server action that verifies the password and sets the cookie. */
  action: (formData: FormData) => Promise<void>;
  /** Same-origin path to land on once unlocked. */
  next: string;
  /** Whether the previous attempt was rejected. */
  invalid: boolean;
}

export function GateForm({ action, next, invalid }: GateFormProps) {
  return (
    <form action={action} className="mt-8 flex flex-col gap-5">
      <input type="hidden" name="next" value={next} />

      {invalid ? (
        <Alert status="error" title="Incorrect password">
          Check the password you were sent, then try again.
        </Alert>
      ) : null}

      <FormField label="Access password" required>
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
