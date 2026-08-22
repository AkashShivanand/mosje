"use client";

/**
 * The E-Anudaan grant application wizard.
 *
 * DS Audit: Wizard ✅ existing · Stepper ✅ existing (inside Wizard) · FormField ✅ · Input ✅ ·
 * Select ✅ · Textarea ✅ · Radio ✅ · Alert ✅ · Badge ✅ · Button ✅ · ReviewSection ✅ ·
 * ReviewItem ✅ · DeclarationCheckbox ✅ · Icon ✅ — nothing new needed.
 *
 * One component, four shapes: the step list, the fields, the document checklist and the
 * read-back all come from the per-scheme schema in lib/e-anudaan/form-schema.ts, because the
 * live portal runs a genuinely different form per scheme (6 / 7 / 6 / 3 steps).
 */

import * as React from "react";
import { useRouter } from "next/navigation";
import {
  Alert,
  Badge,
  Button,
  DeclarationCheckbox,
  FormField,
  Icon,
  Input,
  Radio,
  ReviewItem,
  ReviewSection,
  Select,
  Textarea,
  Wizard,
  useToast,
} from "@mosje/design-system";
import { useEAnudaan } from "@/lib/e-anudaan/store/store";
import { cityCategoryFor, districtsOf } from "@/lib/e-anudaan/geography";
import {
  AVYAY_RENEWAL_NOTICE,
  DECLARATION_TEXT,
  applyAutoFields,
  errorSummary,
  fieldVisible,
  stepFields,
  validateStep,
  wizardFor,
  type FieldDef,
  type StepDef,
  type WizardDef,
} from "@/lib/e-anudaan/form-schema";
import { DEMO_VERDICTS, invalidDocsWarning, type UploadedDoc } from "@/lib/e-anudaan/doc-verification";
import { CostNormsPanel } from "./cost-norms-panel";
import { DocumentsChecklist } from "./documents-checklist";

/** Seed the demo so the first four slots show all four verification states. */
function seedDocuments(w: WizardDef): Record<number, UploadedDoc> {
  const states = ["invalid", "review", "verified", "pending"] as const;
  const seeded: Record<number, UploadedDoc> = {};
  w.documents.slice(0, 4).forEach((d, i) => {
    seeded[d.n] = {
      fileName: `${d.title.replace(/[^A-Za-z0-9]+/g, "_").slice(0, 40)}.pdf`,
      sizeKb: 320 + i * 217,
      uploadedOn: "22 Aug 2026",
      verdict: DEMO_VERDICTS[states[i]!],
    };
  });
  return seeded;
}

/**
 * Which route the wizard is mounted on. The live portal keeps the early steps on `step-1`,
 * moves to `step-2` for the upload step and to `review` for the read-back, so the clone routes
 * the same way and carries the draft across in storage.
 */
export type WizardPhase = "form" | "documents" | "review";

const draftKey = (code: string) => `e-anudaan.draft.${code}`;

export function GrantWizard({ schemeCode, phase = "form" }: { schemeCode: string; phase?: WizardPhase }) {
  const router = useRouter();
  const { state } = useEAnudaan();
  const { toast } = useToast();

  const def = wizardFor(schemeCode);
  const ngo = state.ngos[0];

  /**
   * Initial answers: what the live portal prefills from DARPAN, with any saved draft laid over
   * the top so a step-1 → step-2 → review hop keeps the answers. Computed once in a lazy state
   * initialiser rather than an effect — there is no external system to synchronise with, and a
   * setState in an effect would cascade an extra render on every mount.
   */
  const readDraft = (): { values?: Record<string, string>; docs?: Record<number, UploadedDoc> } => {
    if (typeof window === "undefined") return {};
    try {
      return JSON.parse(window.sessionStorage.getItem(draftKey(schemeCode.toUpperCase())) ?? "{}");
    } catch {
      return {};
    }
  };

  const [step, setStep] = React.useState(0);
  const [values, setValues] = React.useState<Record<string, string>>(() => ({
    fld_ngo_name: ngo?.name ?? "Sankalp Seva Sansthan",
    fld_darpan_id: ngo?.darpanId ?? "MH/2016/100000",
    fld_registration_number: ngo?.registrationNo ?? "51-54",
    fld_contact_mobile: ngo?.mobile ?? "9441747200",
    fld_contact_email: ngo?.email ?? "sankalpsevasansthan@gmail.com",
    fld_reg_office_state: ngo?.state ?? "Maharashtra",
    fld_reg_office_district: ngo?.district ?? "Pune",
    fld_financial_year: "2026-27",
    ...(readDraft().values ?? {}),
  }));
  const [errors, setErrors] = React.useState<Record<string, string>>({});
  const [declared, setDeclared] = React.useState(false);
  const [draftDismissed, setDraftDismissed] = React.useState(false);
  const [docs, setDocs] = React.useState<Record<number, UploadedDoc>>(
    () => readDraft().docs ?? (def ? seedDocuments(def) : {}),
  );
  const errorRef = React.useRef<HTMLDivElement>(null);

  // Persist the draft on every change, so a step-1 → step-2 → review hop keeps the answers.
  React.useEffect(() => {
    if (!def || Object.keys(values).length === 0) return;
    window.sessionStorage.setItem(draftKey(def.code), JSON.stringify({ values, docs }));
  }, [def, values, docs]);

  if (!def) {
    return (
      <Alert status="error" title="Please choose a scheme first.">
        <Button appearance="outlined" size="sm" onClick={() => router.push("/portals/e-anudaan/apply-grant")}>
          Back to Select Grant Scheme
        </Button>
      </Alert>
    );
  }

  const docsIndex = def.steps.findIndex((s) => s.kind === "documents");
  const reviewIndex = def.steps.findIndex((s) => s.kind === "review");
  const activeIndex = phase === "documents" ? docsIndex : phase === "review" ? reviewIndex : step;

  const current = def.steps[activeIndex]!;
  const total = def.steps.length;
  const isDocs = current.kind === "documents";
  const isReview = current.kind === "review";
  const base = `/portals/e-anudaan/apply-grant/scheme/${def.code}`;

  const set = (name: string, value: string) => {
    setValues((v) => {
      let next = { ...v, [name]: value };
      // A State change clears its dependent District, as the live cascade does.
      for (const f of stepFields(current)) {
        if (f.districtsOf === name) next = { ...next, [f.name]: "" };
        if (f.auto?.kind === "cityCategory" && f.auto.from === name) {
          next = { ...next, [f.name]: cityCategoryFor(value) };
        }
      }
      return applyAutoFields(current, next);
    });
    setErrors((e) => {
      if (!e[name]) return e;
      const rest = { ...e };
      delete rest[name];
      return rest;
    });
  };

  /** Jump to any step by index, taking the route with us when the phase changes. */
  const goto = (i: number) => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    const kind = def.steps[i]?.kind;
    if (kind === "documents") {
      router.push(`${base}/step-2`);
      return;
    }
    if (kind === "review") {
      router.push(`${base}/review`);
      return;
    }
    setStep(i);
    if (phase !== "form") router.push(`${base}/step-1`);
  };

  const next = () => {
    if (!isDocs && !isReview) {
      const found = validateStep(current, values);
      setErrors(found);
      if (Object.keys(found).length > 0) {
        errorRef.current?.focus();
        return;
      }
    }
    goto(Math.min(activeIndex + 1, total - 1));
  };

  const submit = () => {
    if (!declared) {
      toast("Accept the declaration above to submit.", "error");
      return;
    }
    window.sessionStorage.removeItem(draftKey(def.code));
    toast("Application submitted. It is now with the Ministry for review.", "success");
    router.push(`${base}/success`);
  };

  const invalidCount = Object.values(docs).filter((d) => d.verdict.state === "invalid").length;

  return (
    <div className="mx-auto max-w-4xl space-y-5">
      <header className="space-y-1">
        <h1 className="text-xl font-bold text-ink">{def.title}</h1>
        <p className="text-sm text-ink-muted">
          Step {activeIndex + 1} of {total} — {current.title}.
          {!isDocs && !isReview && " Fields marked * are mandatory."}
        </p>
      </header>

      {!draftDismissed && (
        <Alert status="info" title={`You are continuing a saved draft for FY ${values.fld_financial_year ?? "2026-27"}, last saved 21 Aug 2026.`}>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <p className="text-sm">Its answers are already filled in below.</p>
            <Button
              appearance="outlined"
              size="sm"
              onClick={() => {
                setValues({});
                setErrors({});
                setDocs({});
                setDraftDismissed(true);
                setStep(0);
                toast("Started a fresh application.", "info");
              }}
            >
              Start a fresh application
            </Button>
          </div>
        </Alert>
      )}

      {def.code === "AVYAY" && <Alert status="info">{AVYAY_RENEWAL_NOTICE}</Alert>}

      <Wizard
        steps={def.steps.map((s) => ({ label: s.title }))}
        current={activeIndex}
        onBack={() => goto(Math.max(activeIndex - 1, 0))}
        onNext={next}
        onSubmit={submit}
        nextLabel={current.nextLabel ?? "Next →"}
        submitLabel="Submit Application"
        error={errorSummary(current, errors)}
        errorRef={errorRef}
      >
        {isDocs ? (
          <>
            <DocumentsChecklist
              documents={def.documents}
              note={def.documentsNote}
              uploaded={docs}
              onChange={setDocs}
            />
            {invalidCount > 0 && (
              <p className="mt-3 text-sm text-status-warning">{invalidDocsWarning(invalidCount)}</p>
            )}
          </>
        ) : isReview ? (
          <ReviewStep def={def} values={values} docs={docs} declared={declared} onDeclare={setDeclared} onEdit={goto} />
        ) : (
          <FormStep def={def} step={current} values={values} errors={errors} onChange={set} />
        )}
      </Wizard>
    </div>
  );
}

/* ── The ordinary field steps ─────────────────────────────────────────────── */

function FormStep({
  def,
  step,
  values,
  errors,
  onChange,
}: {
  def: WizardDef;
  step: StepDef;
  values: Record<string, string>;
  errors: Record<string, string>;
  onChange: (name: string, value: string) => void;
}) {
  return (
    <div className="space-y-5">
      {step.sections.map((section) => (
        <section key={section.title} className="space-y-4 rounded-xl border border-line bg-surface p-5 shadow-xs">
          <div>
            <h2 className="text-base font-bold text-ink">{section.title}</h2>
            {section.lead && <p className="mt-1 text-sm text-ink-muted">{section.lead}</p>}
          </div>

          {def.costNorms && section.title === "Grant Sought" && (
            <CostNormsPanel
              natureOfProject={values.fld_nature_of_project}
              agencyType={values.fld_agency_type}
              projectState={values.fld_project_state}
              cityCategory={values.fld_city_category}
              buildingOwnership={values.fld_building_ownership}
              recurringSought={values.fld_grant_recurring}
              nonRecurringSought={values.fld_grant_non_recurring}
            />
          )}

          <div className="grid gap-4 sm:grid-cols-2">
            {section.fields
              .filter((f) => fieldVisible(f, values))
              .map((f) => (
                <Field
                  key={f.name}
                  field={f}
                  value={values[f.name] ?? ""}
                  error={errors[f.name]}
                  parentValue={f.districtsOf ? values[f.districtsOf] : undefined}
                  onChange={(v) => onChange(f.name, v)}
                />
              ))}
          </div>
        </section>
      ))}
    </div>
  );
}

function Field({
  field,
  value,
  error,
  parentValue,
  onChange,
}: {
  field: FieldDef;
  value: string;
  error?: string;
  parentValue?: string;
  onChange: (v: string) => void;
}) {
  const wide = field.wide || field.kind === "textarea" || field.kind === "radio";
  const options = field.districtsOf ? districtsOf(parentValue) : (field.options ?? []);
  const isAuto = Boolean(field.auto);
  const readOnly = field.readOnly || isAuto;

  if (field.kind === "radio") {
    return (
      <fieldset className={wide ? "sm:col-span-2" : undefined}>
        <legend className="text-sm font-semibold text-ink">
          {field.label} {field.required && <span className="text-status-error">*</span>}
        </legend>
        <div className="mt-2 flex flex-wrap gap-4">
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
        {field.help && <p className="mt-1 text-xs text-ink-muted">{field.help}</p>}
        {error && (
          <p role="alert" className="mt-1 text-xs text-status-error">
            {error}
          </p>
        )}
      </fieldset>
    );
  }

  const counter =
    field.maxLength != null ? `${value.length} / ${field.maxLength} characters` : undefined;

  return (
    <div className={wide ? "sm:col-span-2" : undefined}>
      <FormField
        label={field.label}
        id={field.name}
        hint={field.help}
        error={error}
        required={field.required}
      >
        {(control) =>
          field.kind === "select" ? (
            <Select
              {...control}
              value={value}
              disabled={Boolean(field.districtsOf) && options.length === 0}
              onChange={(e) => onChange(e.target.value)}
            >
              <option value="">Select…</option>
              {options.map((o) => (
                <option key={o} value={o}>
                  {o}
                </option>
              ))}
            </Select>
          ) : field.kind === "textarea" ? (
            <Textarea
              {...control}
              rows={3}
              value={value}
              maxLength={field.maxLength}
              readOnly={readOnly}
              onChange={(e) => onChange(e.target.value)}
            />
          ) : (
            <Input
              {...control}
              type={field.kind === "number" ? "text" : field.kind}
              inputMode={field.kind === "number" ? "numeric" : undefined}
              value={value}
              readOnly={readOnly}
              onChange={(e) => onChange(e.target.value)}
            />
          )
        }
      </FormField>
      {counter && <p className="mt-1 text-xs text-ink-hint">{counter}</p>}
    </div>
  );
}

/* ── Review & Submit ──────────────────────────────────────────────────────── */

function ReviewStep({
  def,
  values,
  docs,
  declared,
  onDeclare,
  onEdit,
}: {
  def: WizardDef;
  values: Record<string, string>;
  docs: Record<number, UploadedDoc>;
  declared: boolean;
  onDeclare: (v: boolean) => void;
  onEdit: (step: number) => void;
}) {
  const formSteps = def.steps
    .map((s, i) => ({ step: s, index: i }))
    .filter(({ step }) => step.kind !== "documents" && step.kind !== "review");

  return (
    <div className="space-y-5">
      <p className="text-sm text-ink-muted">
        Review your details. Once submitted, the application enters the Ministry review chain.
      </p>

      {formSteps.flatMap(({ step, index }) =>
        step.sections.map((section) => (
          <div key={`${step.title}-${section.title}`}>
            <ReviewSection
              title={
                <span className="flex w-full items-center justify-between gap-3">
                  {section.title}
                  <Button appearance="text" size="sm" onClick={() => onEdit(index)}>
                    <Icon name="edit" size={16} aria-hidden /> Edit
                  </Button>
                </span>
              }
            >
              {section.fields
                .filter((f) => fieldVisible(f, values))
                .map((f) => (
                  <ReviewItem
                    key={f.name}
                    label={f.label.toUpperCase()}
                    value={values[f.name]}
                    wide={f.wide || f.kind === "textarea"}
                  />
                ))}
            </ReviewSection>
          </div>
        )),
      )}

      <section className="rounded-xl border border-line bg-surface p-5 shadow-xs">
        <div className="flex items-center justify-between border-b border-line pb-2">
          <h3 className="text-base font-bold text-ink">Documents</h3>
          <Button appearance="text" size="sm" onClick={() => onEdit(def.steps.findIndex((s) => s.kind === "documents"))}>
            <Icon name="edit" size={16} aria-hidden /> Edit
          </Button>
        </div>
        <ul className="mt-3 space-y-1.5">
          {def.documents.map((d) => {
            const up = docs[d.n];
            return (
              <li key={d.n} className="flex items-center justify-between gap-3 text-sm">
                <span className="flex min-w-0 items-center gap-2">
                  <Icon
                    name={up ? "check_circle" : "radio_button_unchecked"}
                    size={16}
                    className={up ? "text-status-success shrink-0" : "text-ink-hint shrink-0"}
                    aria-hidden
                  />
                  <span className="truncate text-ink">
                    {d.n}. {d.title}
                  </span>
                </span>
                {up ? (
                  <Button appearance="text" size="sm">
                    View
                  </Button>
                ) : (
                  <Badge status="warning">Not uploaded</Badge>
                )}
              </li>
            );
          })}
        </ul>
      </section>

      <DeclarationCheckbox checked={declared} onChange={onDeclare} title="Declaration" lead="">
        {DECLARATION_TEXT}
      </DeclarationCheckbox>

      {!declared && <p className="text-sm text-ink-muted">Accept the declaration above to submit.</p>}
    </div>
  );
}
