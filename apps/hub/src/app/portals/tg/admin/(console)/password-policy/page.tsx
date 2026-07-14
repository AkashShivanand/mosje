"use client";

import * as React from "react";
import { Save, CheckCircle2 } from "lucide-react";
import { PageHeader, Card, Field, TextInput, Checkbox, Button, EmptyState } from "@/components/tg/ui";
import { useTg } from "@/lib/tg/store/store";
import type { PasswordPolicy } from "@/lib/tg/store/types";

export default function PasswordPolicyPage() {
  const { state, hydrated, updatePasswordPolicy } = useTg();
  if (!hydrated) return null;
  if (state.session !== "central-admin")
    return <EmptyState title="Access restricted" hint="Only the Central Admin can edit the password policy." />;
  // The form initialises once from the (possibly restored) policy — no
  // setState-in-effect needed.
  return <PolicyForm initial={state.passwordPolicy} onSave={updatePasswordPolicy} />;
}

function PolicyForm({ initial, onSave }: { initial: PasswordPolicy; onSave: (p: PasswordPolicy) => void }) {
  const [form, setForm] = React.useState<PasswordPolicy>(initial);
  const [saved, setSaved] = React.useState(false);

  function submit(e: React.FormEvent) {
    e.preventDefault();
    onSave(form);
    setSaved(true);
    window.setTimeout(() => setSaved(false), 2500);
  }

  const num = (v: string) => Math.max(0, Number(v.replace(/\D/g, "")) || 0);

  return (
    <div className="mx-auto max-w-2xl">
      <PageHeader title="Password Policy" subtitle="Configure the password rules enforced for all portal users." />
      <Card className="p-6">
        <form className="space-y-5" onSubmit={submit}>
          <Field label="Password History Count">
            <TextInput inputMode="numeric" value={String(form.historyCount)} onChange={(e) => setForm({ ...form, historyCount: num(e.target.value) })} />
            <span className="mt-1 block text-xs text-ink-hint">Enter the number of previous passwords to retain</span>
          </Field>
          <Field label="Password Complexity Level">
            <TextInput inputMode="numeric" value={String(form.complexityLevel)} onChange={(e) => setForm({ ...form, complexityLevel: num(e.target.value) })} />
            <span className="mt-1 block text-xs text-ink-hint">Enter the required complexity level</span>
          </Field>
          <Field label="Minimum Password Length">
            <TextInput inputMode="numeric" value={String(form.minLength)} onChange={(e) => setForm({ ...form, minLength: num(e.target.value) })} />
            <span className="mt-1 block text-xs text-ink-hint">Enter the minimum number of characters</span>
          </Field>
          <Field label="Allowed Special Characters">
            <TextInput value={form.allowedSpecialChars} onChange={(e) => setForm({ ...form, allowedSpecialChars: e.target.value })} />
            <span className="mt-1 block text-xs text-ink-hint">Enter special characters allowed in passwords</span>
          </Field>
          <Field label="Maximum Invalid Login Attempts">
            <TextInput inputMode="numeric" value={String(form.maxInvalidAttempts)} onChange={(e) => setForm({ ...form, maxInvalidAttempts: num(e.target.value) })} />
            <span className="mt-1 block text-xs text-ink-hint">Enter the maximum number of invalid attempts allowed</span>
          </Field>

          <div className="space-y-3 border-t border-line pt-4">
            <Checkbox label="Require Alphabetical Characters" checked={form.requireAlpha} onChange={(e) => setForm({ ...form, requireAlpha: e.target.checked })} />
            <Checkbox label="Require Numerical Characters" checked={form.requireNumeric} onChange={(e) => setForm({ ...form, requireNumeric: e.target.checked })} />
            <Checkbox label="Require Special Characters" checked={form.requireSpecial} onChange={(e) => setForm({ ...form, requireSpecial: e.target.checked })} />
          </div>

          <div className="flex items-center gap-3 pt-2">
            <Button type="submit"><Save className="h-4 w-4" /> Update Policy</Button>
            {saved && (
              <span className="flex items-center gap-1.5 text-sm font-medium text-approve-fg">
                <CheckCircle2 className="h-4 w-4" /> Policy updated
              </span>
            )}
          </div>
        </form>
      </Card>
    </div>
  );
}
