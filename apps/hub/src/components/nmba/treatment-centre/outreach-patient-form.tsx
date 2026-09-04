"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Alert, Button, FormField, Icon, Input, Radio, Select, Textarea, type SelectOption, type StepperStep } from "@mosje/design-system";
import { useToast } from "@/components/nmba/toast";
import { useTCStore } from "@/lib/nmba/treatment-centre/store";
import { FormSection, FormCard } from "@/components/nmba/treatment-centre/tc-form";
import { Wizard, ReviewItem, ReviewSection } from "@/components/nmba/treatment-centre/tc-wizard";
import type { Beneficiary, DrugUseRow } from "@/lib/nmba/treatment-centre/types";
import {
  GENDERS,
  LIVING_ARRANGEMENTS,
  EDUCATION,
  EMPLOYMENT,
  MARITAL_STATUS,
  DRUGS,
  INITIATION_REASONS,
  YES_NO,
  YES_NO_NR,
  SEXUAL_PRACTICES,
  REFERRAL_DESTINATIONS,
} from "@/lib/nmba/treatment-centre/master-data";

function labelOf(options: SelectOption[], value: string): string {
  return options.find((o) => o.value === value)?.label ?? value;
}

/** "Other-specify" sentinel for the Referred-to select. */
const REFERRAL_OTHER = "4";

const STEPS: StepperStep[] = [
  { label: "Outreach & Profile", description: "Worker & client" },
  { label: "Substance Use", description: "Drug & behaviour" },
  { label: "Intervention", description: "Intervention & referral" },
  { label: "Review", description: "Confirm & submit" },
];

/** Required fields owned by each input step. */
const STEP_REQUIRED: Record<number, readonly string[]> = {
  0: [
    "outreachWorkerName",
    "hotspotVisitDate",
    "hotspotName",
    "clientName",
    "gender",
    "age",
    "familyType",
    "education",
    "employment",
    "maritalStatus",
  ],
  1: [],
  2: ["briefInterventionGiven", "referredTo"],
};

const FIELD_LABELS: Record<string, string> = {
  outreachWorkerName: "Name of outreach worker",
  hotspotVisitDate: "Date of hotspot visit",
  hotspotName: "Name of hotspot visited",
  clientName: "Name of the client",
  gender: "Gender",
  age: "Age",
  familyType: "Family type",
  education: "Educational status",
  employment: "Employment status",
  maritalStatus: "Marital status",
  drug: "At least one substance (Pattern of Substance Use)",
  ivEver: "Intravenous drug use Ever",
  sexualPractices: "Sexual practices",
  briefInterventionGiven: "Brief intervention given",
  briefInterventionDetails: "Brief intervention details",
  referredTo: "Referred to",
};

const todayIso = () => new Date().toISOString().slice(0, 10);

/** Outreach drug row mirrors DrugUseRow minus "age of first use" (not on the legacy outreach table). */
type OutreachDrugRow = {
  drug: string;
  reason: string;
  usedLast3Months: "Yes" | "No" | "";
  dailyUse: "Yes" | "No" | "";
  durationMonths: string;
  _key: string;
};

const EMPTY_DRUG_ROW: Omit<OutreachDrugRow, "_key"> = {
  drug: "",
  reason: "",
  usedLast3Months: "",
  dailyUse: "",
  durationMonths: "",
};

const INITIAL_FIELDS = {
  outreachWorkerName: "",
  hotspotVisitDate: "",
  hotspotName: "",
  clientName: "",
  gender: "",
  age: "",
  familyType: "",
  education: "",
  employment: "",
  maritalStatus: "",
  // Injecting + sexual behaviour
  ivEver: "",
  iv3m: "",
  sharingEver: "",
  sharing3m: "",
  sexualPractices: "",
  // Intervention
  briefInterventionGiven: "",
  briefInterventionDetails: "",
  referredTo: "",
  referredToOther: "",
};

// Named fields resolve to `string` (not `string | undefined`) on dot access; the
// intersected index signature keeps dynamic bracket access (`f[key]`) working for
// validation loops driven by string arrays.
type OutreachFields = typeof INITIAL_FIELDS & Record<string, string>;

export function OutreachPatientForm({ redirectTo }: { redirectTo: string }) {
  const router = useRouter();
  const { toast } = useToast();
  const store = useTCStore();

  const [f, setF] = React.useState<OutreachFields>(INITIAL_FIELDS);

  const keyRef = React.useRef(0);
  const [drugRows, setDrugRows] = React.useState<OutreachDrugRow[]>([
    { ...EMPTY_DRUG_ROW, _key: "row-0" },
  ]);

  const [step, setStep] = React.useState(0);
  const [errors, setErrors] = React.useState<Set<string>>(new Set());
  const [submitError, setSubmitError] = React.useState("");
  const errorSummaryRef = React.useRef<HTMLDivElement>(null);
  const submittingRef = React.useRef(false);
  const drugSectionId = React.useId();

  // Warn before leaving with unsaved data.
  React.useEffect(() => {
    const dirty =
      !submittingRef.current &&
      (Object.values(f).some(Boolean) || drugRows.some((r) => r.drug));
    if (!dirty) return;
    const handler = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = "";
    };
    window.addEventListener("beforeunload", handler);
    return () => window.removeEventListener("beforeunload", handler);
  }, [f, drugRows]);

  const set = (key: string) => (value: string) => setF((prev) => ({ ...prev, [key]: value }));

  const updateDrugRow = (i: number, patch: Partial<Omit<OutreachDrugRow, "_key">>) =>
    setDrugRows((prev) => prev.map((row, idx) => (idx === i ? { ...row, ...patch } : row)));

  const err = (key: string): string | undefined => {
    if (!errors.has(key)) return undefined;
    if (key === "age" && f.age) return "Enter a valid age between 1 and 120.";
    if (key === "hotspotVisitDate" && f.hotspotVisitDate) return "Date cannot be in the future.";
    return "This field is required.";
  };

  const missingForStep = React.useCallback(
    (s: number): Set<string> => {
      const missing = new Set<string>();
      if (s === 0) {
        for (const key of STEP_REQUIRED[0] ?? []) if (!f[key]) missing.add(key);
        if (f.age) {
          const n = Number(f.age);
          if (!Number.isInteger(n) || n < 1 || n > 120) missing.add("age");
        }
        if (f.hotspotVisitDate && f.hotspotVisitDate > todayIso()) missing.add("hotspotVisitDate");
      }
      if (s === 1) {
        if (!drugRows.some((r) => r.drug)) missing.add("drug");
        drugRows.forEach((r, i) => {
          if (!r.drug) return;
          if (!r.reason) missing.add(`row${i}.reason`);
          if (!r.usedLast3Months) missing.add(`row${i}.use3m`);
          if (!r.dailyUse) missing.add(`row${i}.daily`);
          if (!r.durationMonths) missing.add(`row${i}.duration`);
        });
        if (!f.ivEver) missing.add("ivEver");
        if (!f.sexualPractices) missing.add("sexualPractices");
      }
      if (s === 2) {
        for (const key of STEP_REQUIRED[2] ?? []) if (!f[key]) missing.add(key);
        if (f.briefInterventionGiven === "Yes" && !f.briefInterventionDetails)
          missing.add("briefInterventionDetails");
      }
      return missing;
    },
    [f, drugRows],
  );

  const labelForKey = (k: string): string => {
    const row = k.match(/^row(\d+)\.(\w+)$/);
    if (row) {
      const fieldLabels: Record<string, string> = {
        reason: "Reason of Substance Abuse",
        use3m: "Use in Last 3 Month",
        daily: "Daily/Near Daily Use",
        duration: "Duration of Regular Use",
      };
      const subfield = row[2] ?? "";
      return `Substance ${Number(row[1]) + 1} — ${fieldLabels[subfield] ?? subfield}`;
    }
    return FIELD_LABELS[k] ?? k;
  };

  const flagStep = (missing: Set<string>, targetStep: number) => {
    setErrors(missing);
    setStep(targetStep);
    const names = [...missing].map(labelForKey);
    setSubmitError(
      names.length
        ? `Please complete ${names.length} field${names.length > 1 ? "s" : ""}: ${names.join(", ")}.`
        : "Please complete the highlighted fields before continuing.",
    );
    requestAnimationFrame(() => errorSummaryRef.current?.focus());
  };

  const goNext = () => {
    const missing = missingForStep(step);
    if (missing.size > 0) {
      flagStep(missing, step);
      return;
    }
    setErrors(new Set());
    setSubmitError("");
    setStep((s) => Math.min(s + 1, STEPS.length - 1));
  };

  const goBack = () => {
    setErrors(new Set());
    setSubmitError("");
    setStep((s) => Math.max(s - 1, 0));
  };

  const jumpTo = (to: number) => {
    setErrors(new Set());
    setSubmitError("");
    setStep(to);
  };

  const submit = () => {
    if (submittingRef.current) return;
    for (const s of [0, 1, 2]) {
      const missing = missingForStep(s);
      if (missing.size > 0) {
        flagStep(missing, s);
        return;
      }
    }
    setErrors(new Set());
    setSubmitError("");
    submittingRef.current = true;

    const referralLabel =
      f.referredTo === REFERRAL_OTHER && f.referredToOther
        ? f.referredToOther
        : labelOf(REFERRAL_DESTINATIONS, f.referredTo);

    const drugUse: DrugUseRow[] = drugRows
      .filter((r) => r.drug)
      .map((r) => ({
        drug: labelOf(DRUGS, r.drug),
        ageOfFirstUse: "",
        reason: labelOf(INITIATION_REASONS, r.reason),
        usedLast3Months: r.usedLast3Months,
        dailyUse: r.dailyUse,
        durationMonths: r.durationMonths,
      }));

    const detailPairs: Array<[string, string]> = [
      ["Outreach Worker", f.outreachWorkerName],
      ["Hotspot Name", f.hotspotName],
      ["Family Type", labelOf(LIVING_ARRANGEMENTS, f.familyType)],
      ["Educational Status", labelOf(EDUCATION, f.education)],
      ["Employment Status", labelOf(EMPLOYMENT, f.employment)],
      ["Marital Status", labelOf(MARITAL_STATUS, f.maritalStatus)],
      ["IV drug use (ever)", labelOf(YES_NO_NR, f.ivEver)],
      ["IV drug use (last 3 months)", labelOf(YES_NO_NR, f.iv3m)],
      ["Shared needles (ever)", labelOf(YES_NO_NR, f.sharingEver)],
      ["Shared needles (last 3 months)", labelOf(YES_NO_NR, f.sharing3m)],
      ["Sexual practices", labelOf(SEXUAL_PRACTICES, f.sexualPractices)],
      ["Brief intervention given", f.briefInterventionGiven],
      ["Brief intervention details", f.briefInterventionGiven === "Yes" ? f.briefInterventionDetails : ""],
      ["Referred to", referralLabel],
    ];
    const details = Object.fromEntries(detailPairs.filter(([, v]) => v && v.trim()));

    const beneficiary: Omit<Beneficiary, "id"> = {
      registrationNumber: `OP${Date.now().toString().slice(-8)}${crypto.randomUUID().slice(0, 4)}`,
      registrationProgress: "Pending",
      name: f.clientName,
      gender: labelOf(GENDERS, f.gender),
      age: Number(f.age) || 0,
      dateOfRegistration: f.hotspotVisitDate,
      referredBy: "",
      state: "",
      district: "",
      placeOfResidence: "",
      contactNumber: "",
      category: "",
      kind: "Outreach",
      drugUse,
      details,
    };

    store.addBeneficiary(beneficiary);
    toast("Outreach patient registered successfully.", "success");
    router.push(redirectTo);
  };

  const recordedDrugs = drugRows.filter((r) => r.drug);
  const drugDetail = (r: OutreachDrugRow): string =>
    [
      r.reason ? labelOf(INITIATION_REASONS, r.reason) : "",
      r.usedLast3Months ? `Used in last 3 months: ${r.usedLast3Months}` : "",
      r.dailyUse ? `Daily/near-daily: ${r.dailyUse}` : "",
      r.durationMonths ? `Regular use ${r.durationMonths} month${r.durationMonths === "1" ? "" : "s"}` : "",
    ]
      .filter(Boolean)
      .join("  ·  ");

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        if (step === STEPS.length - 1) submit();
        else goNext();
      }}
      className="flex flex-col gap-6"
      noValidate
    >
      <div>
        <h1 className="text-headline-1 text-ink">Outreach Patient Registration</h1>
        <p className="mt-1 text-body-2 text-ink-muted">
          Fields marked <span aria-hidden="true">*</span>
          <span className="sr-only">with an asterisk</span> are required.
        </p>
      </div>

      <Wizard
        steps={STEPS}
        current={step}
        onBack={goBack}
        onNext={goNext}
        onSubmit={submit}
        submitLabel="Submit Registration"
        error={submitError || undefined}
        errorRef={errorSummaryRef}
      >
        {/* ── Step 0: Outreach Details + Client Profile ───────────────────── */}
        {step === 0 && (
          <div className="flex flex-col gap-6">
            <FormSection title="Details of Outreach" columns={2}>
              <FormField label="Name of Outreach Worker" required error={err("outreachWorkerName")}>
                {(c) => <Input {...c} value={f.outreachWorkerName} onChange={(e) => set("outreachWorkerName")(e.target.value)} placeholder="Outreach worker's full name" invalid={errors.has("outreachWorkerName")} />}
              </FormField>
              <FormField label="Date of Hotspot Visited by Outreach Worker" required error={err("hotspotVisitDate")}>
                {(c) => <Input {...c} type="date" max={todayIso()} value={f.hotspotVisitDate} onChange={(e) => set("hotspotVisitDate")(e.target.value)} invalid={errors.has("hotspotVisitDate")} />}
              </FormField>
              <FormField label="Name of Hotspot Visited" required error={err("hotspotName")}>
                {(c) => <Input {...c} value={f.hotspotName} onChange={(e) => set("hotspotName")(e.target.value)} placeholder="Name of the hotspot" invalid={errors.has("hotspotName")} />}
              </FormField>
            </FormSection>

            <FormSection title="Profile of the Client" columns={2}>
              <FormField label="Name of the Client" required error={err("clientName")}>
                {(c) => <Input {...c} autoComplete="name" value={f.clientName} onChange={(e) => set("clientName")(e.target.value.replace(/[^a-zA-Z\s.]/g, ""))} placeholder="Client's full name" invalid={errors.has("clientName")} />}
              </FormField>
              <FormField label="Gender" required error={err("gender")}>
                {(c) => <Select {...c} value={f.gender} onChange={(e) => set("gender")(e.target.value)} placeholder="Select Gender" options={GENDERS} invalid={errors.has("gender")} />}
              </FormField>
              <FormField label="Age" required error={err("age")}>
                {(c) => <Input {...c} type="number" min={1} max={120} step={1} value={f.age} onChange={(e) => set("age")(e.target.value)} placeholder="Age in years" invalid={errors.has("age")} />}
              </FormField>
              <FormField label="Family Type" required error={err("familyType")}>
                {(c) => <Select {...c} value={f.familyType} onChange={(e) => set("familyType")(e.target.value)} placeholder="Select Living Arrangement" options={LIVING_ARRANGEMENTS} invalid={errors.has("familyType")} />}
              </FormField>
              <FormField label="Educational Status" required error={err("education")}>
                {(c) => <Select {...c} value={f.education} onChange={(e) => set("education")(e.target.value)} placeholder="Select Education" options={EDUCATION} invalid={errors.has("education")} />}
              </FormField>
              <FormField label="Employment Status" required error={err("employment")}>
                {(c) => <Select {...c} value={f.employment} onChange={(e) => set("employment")(e.target.value)} placeholder="Select Employment Status" options={EMPLOYMENT} invalid={errors.has("employment")} />}
              </FormField>
              <FormField label="Marital Status" required error={err("maritalStatus")}>
                {(c) => <Select {...c} value={f.maritalStatus} onChange={(e) => set("maritalStatus")(e.target.value)} placeholder="Select Marital Status" options={MARITAL_STATUS} invalid={errors.has("maritalStatus")} />}
              </FormField>
            </FormSection>
          </div>
        )}

        {/* ── Step 1: Substance Use (drugs + injecting + sexual) ──────────── */}
        {step === 1 && (
          <div className="flex flex-col gap-6">
            <FormCard
              title="Pattern of Substance Use"
              required
              headingId={drugSectionId}
              description="Each substance gets its own card — add as many as needed."
            >
              {errors.has("drug") && (
                <div className="mb-4">
                  <Alert id="drug-error" status="error">Add at least one substance — select a drug below.</Alert>
                </div>
              )}
              <ol className="flex flex-col gap-4">
                {drugRows.map((row, i) => (
                  <li key={row._key} className="rounded-xl border border-line bg-surface-muted/50 p-4 sm:p-5">
                    <div className="mb-4 flex items-center justify-between gap-2">
                      <span className="inline-flex items-center gap-2 text-title-3 text-navy">
                        <span className="flex h-6 w-6 items-center justify-center rounded-full bg-navy/10 text-label-2 font-bold text-navy" aria-hidden="true">{i + 1}</span>
                        Substance {i + 1}
                      </span>
                      {drugRows.length > 1 && (
                        <button
                          type="button"
                          onClick={() => setDrugRows((prev) => prev.filter((_, idx) => idx !== i))}
                          aria-label={`Remove substance ${i + 1}`}
                          className="inline-flex h-9 items-center gap-1.5 rounded-lg px-2.5 text-label-2 font-semibold text-danger-fg hover:bg-danger-fg/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-danger-fg"
                        >
                          <Icon name="delete" size={14} aria-hidden /> Remove
                        </button>
                      )}
                    </div>
                    <div className="grid grid-cols-1 gap-x-4 gap-y-4 sm:grid-cols-2 lg:grid-cols-3">
                      <FormField label="Name of the Substance Used" required error={errors.has("drug") && !row.drug ? "Select a drug." : undefined}>
                        {(c) => <Select {...c} value={row.drug} onChange={(e) => updateDrugRow(i, { drug: e.target.value })} placeholder="Select Drug" options={DRUGS} />}
                      </FormField>
                      <FormField label="Reason of Substance Abuse" required error={errors.has(`row${i}.reason`) ? "Required." : undefined}>
                        {(c) => <Select {...c} value={row.reason} onChange={(e) => updateDrugRow(i, { reason: e.target.value })} placeholder="Select Reason" options={INITIATION_REASONS} />}
                      </FormField>
                      <FormField label="Duration of Regular Use (months)" required error={errors.has(`row${i}.duration`) ? "Required." : undefined}>
                        {(c) => <Input {...c} type="number" min={0} value={row.durationMonths} onChange={(e) => updateDrugRow(i, { durationMonths: e.target.value })} placeholder="Months" />}
                      </FormField>
                      <fieldset className="m-0 flex flex-col gap-1.5 border-0 p-0">
                        <legend className="p-0 text-label-1 text-ink">Use in Last 3 Month <span className="ds-field__required" aria-hidden="true">*</span></legend>
                        <div className="flex gap-4 pt-1.5">
                          {YES_NO.map((o) => (
                            <Radio key={o.value} name={`used3m-${row._key}`} value={o.value} checked={row.usedLast3Months === o.value} onChange={() => updateDrugRow(i, { usedLast3Months: o.value as "Yes" | "No" })} label={o.label} />
                          ))}
                        </div>
                        {errors.has(`row${i}.use3m`) && <p className="text-label-2 text-danger-fg">Required.</p>}
                      </fieldset>
                      <fieldset className="m-0 flex flex-col gap-1.5 border-0 p-0">
                        <legend className="p-0 text-label-1 text-ink">Daily / Near Daily Use <span className="ds-field__required" aria-hidden="true">*</span></legend>
                        <div className="flex gap-4 pt-1.5">
                          {YES_NO.map((o) => (
                            <Radio key={o.value} name={`daily-${row._key}`} value={o.value} checked={row.dailyUse === o.value} onChange={() => updateDrugRow(i, { dailyUse: o.value as "Yes" | "No" })} label={o.label} />
                          ))}
                        </div>
                        {errors.has(`row${i}.daily`) && <p className="text-label-2 text-danger-fg">Required.</p>}
                      </fieldset>
                    </div>
                  </li>
                ))}
              </ol>
              <div className="mt-4">
                <Button type="button" appearance="outlined" iconLeft={<Icon name="add" size={16} />} onClick={() => setDrugRows((prev) => [...prev, { ...EMPTY_DRUG_ROW, _key: `row-${(keyRef.current += 1)}` }])}>
                  Add
                </Button>
              </div>
            </FormCard>

            <FormSection title="Injecting Behaviour" columns={2}>
              <FormField label="Intravenous drug use Ever" required error={err("ivEver")}>
                {(c) => (
                  <Select
                    {...c}
                    value={f.ivEver}
                    onChange={(e) => {
                      set("ivEver")(e.target.value);
                      if (e.target.value !== "Yes") {
                        set("sharingEver")("");
                        set("sharing3m")("");
                      }
                    }}
                    placeholder="Select Injection"
                    options={YES_NO_NR}
                    invalid={errors.has("ivEver")}
                  />
                )}
              </FormField>
              <FormField label="Intravenous drug use Last 3 Month">
                {(c) => <Select {...c} value={f.iv3m} onChange={(e) => set("iv3m")(e.target.value)} placeholder="Select Injection" options={YES_NO_NR} />}
              </FormField>
              {f.ivEver === "Yes" && (
                <>
                  <FormField label="If yes, sharing of needles/syringes — Ever">
                    {(c) => <Select {...c} value={f.sharingEver} onChange={(e) => set("sharingEver")(e.target.value)} placeholder="Select Injection" options={YES_NO_NR} />}
                  </FormField>
                  <FormField label="Sharing Needles/Syringes — Last 3 Month">
                    {(c) => <Select {...c} value={f.sharing3m} onChange={(e) => set("sharing3m")(e.target.value)} placeholder="Select Injection" options={YES_NO_NR} />}
                  </FormField>
                </>
              )}
            </FormSection>

            <FormSection title="Sexual Behaviour" columns={2}>
              <FormField label="Partners / Sexual Practices" required error={err("sexualPractices")}>
                {(c) => <Select {...c} value={f.sexualPractices} onChange={(e) => set("sexualPractices")(e.target.value)} placeholder="Select Sexual Practices" options={SEXUAL_PRACTICES} invalid={errors.has("sexualPractices")} />}
              </FormField>
            </FormSection>
          </div>
        )}

        {/* ── Step 2: Brief Intervention & Referral ───────────────────────── */}
        {step === 2 && (
          <FormSection title="Brief Intervention & Referral" columns={1}>
            <div className="flex flex-col gap-1.5">
              <span className="text-label-1 text-ink">
                Was any Brief Intervention Given? <span className="ds-field__required" aria-hidden="true">*</span>
              </span>
              <fieldset className="m-0 border-0 p-0">
                <legend className="sr-only">Was any Brief Intervention Given?</legend>
                <div className="flex gap-4 pt-1.5">
                  {YES_NO.map((o) => (
                    <Radio
                      key={o.value}
                      name="briefInterventionGiven"
                      value={o.value}
                      checked={f.briefInterventionGiven === o.value}
                      onChange={() => set("briefInterventionGiven")(o.value)}
                      label={o.label}
                    />
                  ))}
                </div>
              </fieldset>
              {errors.has("briefInterventionGiven") && <p className="text-label-2 text-danger-fg">This field is required.</p>}
            </div>

            {f.briefInterventionGiven === "Yes" && (
              <FormField label="Brief Intervention Details" required error={err("briefInterventionDetails")}>
                {(c) => <Textarea {...c} rows={3} value={f.briefInterventionDetails} onChange={(e) => set("briefInterventionDetails")(e.target.value)} placeholder="Describe the brief intervention given to the client" invalid={errors.has("briefInterventionDetails")} />}
              </FormField>
            )}

            <FormField label="Referred To" required error={err("referredTo")}>
              {(c) => <Select {...c} value={f.referredTo} onChange={(e) => { set("referredTo")(e.target.value); if (e.target.value !== REFERRAL_OTHER) set("referredToOther")(""); }} placeholder="Select Referral" options={REFERRAL_DESTINATIONS} invalid={errors.has("referredTo")} />}
            </FormField>
            {f.referredTo === REFERRAL_OTHER && (
              <FormField label="Referral (specify)" required error={err("referredToOther")}>
                {(c) => <Input {...c} value={f.referredToOther} onChange={(e) => set("referredToOther")(e.target.value)} placeholder="Specify referral" invalid={errors.has("referredToOther")} />}
              </FormField>
            )}
          </FormSection>
        )}

        {/* ── Step 3: Review ──────────────────────────────────────────────── */}
        {step === 3 && (
          <div className="flex flex-col gap-5">
            <div className="flex flex-col gap-3">
              <p className="text-body-2 text-ink-muted">
                Review the details below, then submit. Use the quick links or{" "}
                <span className="font-semibold text-ink">Back</span> to make changes.
              </p>
              <div className="flex flex-wrap gap-2">
                {[
                  { to: 0, label: "Edit Outreach & Profile" },
                  { to: 1, label: "Edit Substance Use" },
                  { to: 2, label: "Edit Intervention" },
                ].map((j) => (
                  <button
                    key={j.to}
                    type="button"
                    onClick={() => jumpTo(j.to)}
                    className="inline-flex items-center gap-1 rounded-lg border border-line bg-white px-3 py-1.5 text-label-2 font-semibold text-navy hover:bg-black/5"
                  >
                    <Icon name="edit" size={12} aria-hidden /> {j.label}
                  </button>
                ))}
              </div>
            </div>

            <ReviewSection title="Details of Outreach & Client Profile">
              <ReviewItem label="Outreach Worker" value={f.outreachWorkerName} />
              <ReviewItem label="Date of Hotspot Visit" value={f.hotspotVisitDate} />
              <ReviewItem label="Hotspot Name" value={f.hotspotName} />
              <ReviewItem label="Client Name" value={f.clientName} />
              <ReviewItem label="Gender" value={labelOf(GENDERS, f.gender)} />
              <ReviewItem label="Age" value={f.age} />
              <ReviewItem label="Family Type" value={labelOf(LIVING_ARRANGEMENTS, f.familyType)} />
              <ReviewItem label="Educational Status" value={labelOf(EDUCATION, f.education)} />
              <ReviewItem label="Employment Status" value={labelOf(EMPLOYMENT, f.employment)} />
              <ReviewItem label="Marital Status" value={labelOf(MARITAL_STATUS, f.maritalStatus)} />
            </ReviewSection>

            <ReviewSection title="Substance Use">
              {recordedDrugs.length === 0 ? (
                <ReviewItem wide label="Substances recorded" value="None" />
              ) : (
                recordedDrugs.map((r, i) => (
                  <ReviewItem key={r._key} wide label={`Substance ${i + 1} — ${labelOf(DRUGS, r.drug)}`} value={drugDetail(r)} />
                ))
              )}
              <ReviewItem label="IV drug use (ever)" value={labelOf(YES_NO_NR, f.ivEver)} />
              <ReviewItem label="IV drug use (last 3 months)" value={labelOf(YES_NO_NR, f.iv3m)} />
              {f.ivEver === "Yes" && (
                <>
                  <ReviewItem label="Shared needles (ever)" value={labelOf(YES_NO_NR, f.sharingEver)} />
                  <ReviewItem label="Shared needles (last 3 months)" value={labelOf(YES_NO_NR, f.sharing3m)} />
                </>
              )}
              <ReviewItem label="Sexual practices" value={labelOf(SEXUAL_PRACTICES, f.sexualPractices)} />
            </ReviewSection>

            <ReviewSection title="Brief Intervention & Referral">
              <ReviewItem label="Brief Intervention Given" value={f.briefInterventionGiven} />
              {f.briefInterventionGiven === "Yes" && <ReviewItem label="Intervention Details" value={f.briefInterventionDetails} />}
              <ReviewItem
                label="Referred To"
                value={f.referredTo === REFERRAL_OTHER && f.referredToOther ? f.referredToOther : labelOf(REFERRAL_DESTINATIONS, f.referredTo)}
              />
            </ReviewSection>
          </div>
        )}
      </Wizard>
    </form>
  );
}
