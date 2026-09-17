"use client";

/**
 * The demo dock's Fill tab on every e-Anudaan page with a form other than the grant application
 * (lib/e-anudaan/demo-forms). For each form on the page: fill it correctly, or trip one of its rules
 * and see the message — the same two moves the grant application's Answers section offers.
 *
 * DS Audit: Button ✅ · FormField ✅ · Select ✅ — nothing new.
 */

import * as React from "react";
import { Button, FormField, Select } from "@mosje/design-system";
import { DEMO_FORM_FILL_EVENT, type DemoFormDef, type DemoFormFillDetail } from "@/lib/e-anudaan/demo-forms";

export function DemoFormsPanel({ forms }: { forms: readonly DemoFormDef[] }) {
  const [done, setDone] = React.useState<string | null>(null);
  return (
    <div className="space-y-5 p-4">
      <p className="text-body-3 text-ink-muted">
        Fills the form on this page with the demo applicant&rsquo;s details. Nothing is submitted.
      </p>
      {forms.map((form) => (
        <FormPresets key={form.id} form={form} onDone={setDone} />
      ))}
      <p role="status" aria-live="polite" className="min-h-5 text-body-3 text-ink-muted">
        {done}
      </p>
    </div>
  );
}

function FormPresets({ form, onDone }: { form: DemoFormDef; onDone: (s: string) => void }) {
  const valid = form.presets.find((p) => p.valid);
  const rules = form.presets.filter((p) => !p.valid);
  const [rule, setRule] = React.useState(rules[0]?.id ?? "");
  const headingId = `demo-form-${form.id}`;

  const fill = (presetId: string) => {
    const preset = form.presets.find((p) => p.id === presetId);
    if (!preset) return;
    window.dispatchEvent(new CustomEvent<DemoFormFillDetail>(DEMO_FORM_FILL_EVENT, { detail: { formId: form.id, preset } }));
    onDone(preset.valid ? `${form.title}: filled correctly.` : `${form.title}: ${preset.label} — the message is showing.`);
  };

  return (
    <section className="space-y-2" aria-labelledby={headingId}>
      <h3 id={headingId} className="text-body-2 font-semibold text-ink">
        {form.title}
      </h3>
      {valid && (
        <Button size="sm" onClick={() => fill(valid.id)}>
          Fill Correctly
        </Button>
      )}
      {rules.length > 0 && (
        <div className="flex flex-wrap items-end gap-2">
          <div className="min-w-0 flex-1">
            <FormField id={`${headingId}-rule`} label="Trip One Rule">
              {(c) => (
                <Select {...c} size="sm" value={rule} onChange={(e) => setRule(e.target.value)}>
                  {rules.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.label}
                    </option>
                  ))}
                </Select>
              )}
            </FormField>
          </div>
          <Button size="sm" appearance="outlined" onClick={() => fill(rule)}>
            Show the Message
          </Button>
        </div>
      )}
    </section>
  );
}
