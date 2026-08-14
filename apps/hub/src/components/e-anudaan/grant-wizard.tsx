"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import {
  Alert,
  Badge,
  Button,
  Checkbox,
  FormField,
  Icon,
  Input,
  Radio,
  Select,
  Textarea,
  useToast,
} from "@mosje/design-system";
import { useEAnudaan } from "@/lib/e-anudaan/store/store";
import { WIZARD_STEPS, validateGrant, type FieldDef } from "@/lib/e-anudaan/form-schema";
import type { MockDoc } from "@/lib/e-anudaan/types";

/**
 * The Grant-in-Aid application wizard.
 *
 * Six steps under ONE URL — the live portal's actual behaviour, which the bundle's route table
 * (step-1 / step-2 / review / success) misrepresents. The stepper is display-only, exactly as
 * observed; advance is the single "Next →" at the foot of the form.
 */
export function GrantWizard({ schemeCode }: { schemeCode: string }) {
  const router = useRouter();
  const { state } = useEAnudaan();
  const { toast } = useToast();
  const [step, setStep] = React.useState(0);
  const [declared, setDeclared] = React.useState(false);

  const ngo = state.ngos[0];
  const scheme = state.schemes.find((s) => s.code === schemeCode);

  // The NGO-Darpan-sourced fields are DERIVED initial state, not a subscription to anything, so
  // they belong in the lazy initialiser rather than an effect — no extra commit, and no
  // set-state-in-effect. The live form pre-fills these from the login the same way.
  const [values, setValues] = React.useState<Record<string, string>>(() =>
    ngo
      ? ({
          ngoName: ngo.name,
          darpanId: ngo.darpanId,
          registrationNo: ngo.registrationNo,
          district: ngo.district,
          state: ngo.state,
        } as Record<string, string>)
      : {},
  );

  const set = (name: string, value: string) => setValues((v) => ({ ...v, [name]: value }));
  const current = WIZARD_STEPS[step]!;
  const isDocs = current.title === "Upload Documents";
  const isReview = current.title === "Review & Submit";

  const next = () => {
    const err = validateGrant(values);
    if (current.title === "Bank, Beneficiaries & Grant" && err) {
      toast(err, "error");
      return;
    }
    setStep((s) => Math.min(s + 1, WIZARD_STEPS.length - 1));
    window.scrollTo({ top: 0 });
  };

  return (
    <div className="mx-auto max-w-4xl space-y-5">
      {/* Stepper — display-only, matching the live wizard. */}
      <ol className="flex flex-wrap gap-x-6 gap-y-2" aria-label="Application steps">
        {WIZARD_STEPS.map((s, i) => (
          <li key={s.title} className="flex items-center gap-2 text-sm">
            <span
              aria-current={i === step ? "step" : undefined}
              className={`grid h-6 w-6 place-items-center rounded-full text-xs font-semibold ${
                i === step ? "bg-navy text-white" : i < step ? "bg-success text-white" : "bg-surface-muted text-ink-muted"
              }`}
            >
              {i + 1}
            </span>
            <span className={i === step ? "font-semibold text-ink" : "text-ink-muted"}>{s.title}</span>
          </li>
        ))}
      </ol>

      <div className="rounded-xl border border-line bg-surface p-5">
        <h1 className="text-xl font-bold text-ink">
          {scheme?.name ?? schemeCode} — Grant-in-Aid
        </h1>
        <p className="mt-1 text-sm text-ink-muted">
          Step {step + 1} of {WIZARD_STEPS.length} — {current.title}. Fields marked{" "}
          <span className="text-danger">*</span> are mandatory.
        </p>
      </div>

      {isDocs ? (
        <DocumentsStep />
      ) : isReview ? (
        <ReviewStep values={values} declared={declared} onDeclare={setDeclared} />
      ) : (
        current.sections.map((section) => (
          <section key={section.title} className="rounded-xl border border-line bg-surface p-5">
            <h2 className="text-base font-semibold text-ink">{section.title}</h2>
            {section.lead && <p className="mt-1 text-sm text-ink-muted">{section.lead}</p>}
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              {section.fields.map((f) => (
                <Field key={f.name} field={f} value={values[f.name] ?? ""} onChange={(v) => set(f.name, v)} />
              ))}
            </div>
          </section>
        ))
      )}

      <div className="flex items-center justify-between">
        <Button
          appearance="outlined"
          disabled={step === 0}
          onClick={() => {
            setStep((s) => Math.max(s - 1, 0));
            window.scrollTo({ top: 0 });
          }}
        >
          ← Back
        </Button>
        {isReview ? (
          <Button
            disabled={!declared}
            onClick={() => {
              toast("Application submitted (demo — nothing is filed).", "success");
              router.push("/portals/e-anudaan/ngo/my-applications");
            }}
          >
            Submit application
          </Button>
        ) : (
          <Button onClick={next}>Next →</Button>
        )}
      </div>
    </div>
  );
}

function Field({ field, value, onChange }: { field: FieldDef; value: string; onChange: (v: string) => void }) {
  const label = field.required ? `${field.label} *` : field.label;
  const wide = field.kind === "textarea";

  if (field.kind === "radio") {
    return (
      <fieldset className={wide ? "sm:col-span-2" : undefined}>
        <legend className="text-sm font-medium text-ink">{label}</legend>
        <div className="mt-2 flex gap-4">
          {(field.options ?? []).map((o) => (
            <Radio
              key={o}
              name={field.name}
              value={o}
              checked={value === o}
              onChange={() => onChange(o)}
              label={o}
            />
          ))}
        </div>
      </fieldset>
    );
  }

  return (
    <div className={wide ? "sm:col-span-2" : undefined}>
      <FormField label={label} id={field.name} hint={field.help}>
        {(control) =>
          field.kind === "select" ? (
            <Select {...control} value={value} onChange={(e) => onChange(e.target.value)}>
              <option value="">Select…</option>
              {(field.options ?? []).map((o) => (
                <option key={o} value={o}>
                  {o}
                </option>
              ))}
            </Select>
          ) : field.kind === "textarea" ? (
            <Textarea {...control} value={value} onChange={(e) => onChange(e.target.value)} rows={3} />
          ) : (
            <Input
              {...control}
              type={field.kind === "number" ? "number" : field.kind}
              value={value}
              readOnly={field.readOnly}
              onChange={(e) => onChange(e.target.value)}
            />
          )
        }
      </FormField>
    </div>
  );
}

/** Step 5 — the 20-slot checklist, in the live portal's two groups. */
function DocumentsStep() {
  const { state } = useEAnudaan();
  const template: MockDoc[] = state.applications[0]?.documents ?? [];
  const annual = template.filter((d) => d.group === "annual");
  const permanent = template.filter((d) => d.group === "permanent");

  return (
    <section className="rounded-xl border border-line bg-surface p-5">
      <h2 className="text-base font-semibold text-ink">Documents Checklist</h2>
      <p className="mt-1 text-sm text-ink-muted">PDF / JPG / PNG, up to 10 MB each.</p>
      {[
        { label: "Annual documents", hint: "verified & remarked each year", docs: annual },
        { label: "Permanent documents", hint: "one-time · view-only unless re-uploaded this year", docs: permanent },
      ].map((group) => (
        <div key={group.label} className="mt-5">
          <p className="text-xs font-semibold text-navy">
            {group.label} <span className="font-normal text-ink-muted">{group.hint}</span>
          </p>
          <ul className="mt-2 divide-y divide-line">
            {group.docs.map((d) => (
              <li key={d.id} className="flex flex-wrap items-center justify-between gap-3 py-3">
                <span className="text-sm text-ink">
                  {d.slot}. {d.title}
                  {!d.optional && <span className="text-danger"> *</span>}
                  {d.optional && <Badge className="ml-2">Optional</Badge>}
                  {d.conditional && <span className="block text-xs text-ink-muted">{d.conditional}</span>}
                </span>
                <Button appearance="outlined" size="sm">
                  <Icon name="upload" size={16} aria-hidden /> Upload
                </Button>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </section>
  );
}

/** Step 6 — read-back plus the declaration. Unobserved on the live portal (gated behind uploads). */
function ReviewStep({
  values,
  declared,
  onDeclare,
}: {
  values: Record<string, string>;
  declared: boolean;
  onDeclare: (v: boolean) => void;
}) {
  const filled = Object.entries(values).filter(([, v]) => v);
  return (
    <>
      <Alert status="info" title="Inferred screen">
        The live portal gates this step behind mandatory uploads, so it could not be captured.
        This read-back follows the BRD&apos;s review-and-declare pattern.
      </Alert>
      <section className="rounded-xl border border-line bg-surface p-5">
        <h2 className="text-base font-semibold text-ink">Review &amp; Submit</h2>
        <dl className="mt-4 grid gap-x-8 gap-y-2 sm:grid-cols-2">
          {filled.map(([k, v]) => (
            <div key={k} className="flex items-baseline justify-between gap-4 border-b border-line pb-2">
              <dt className="text-sm text-ink-muted">{k}</dt>
              <dd className="text-sm font-semibold text-ink">{v}</dd>
            </div>
          ))}
        </dl>
        <div className="mt-5">
          <Checkbox
            checked={declared}
            onChange={(e) => onDeclare(e.target.checked)}
            label="I declare that the information given above is true to the best of my knowledge and belief."
          />
        </div>
      </section>
    </>
  );
}
