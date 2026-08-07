"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Alert, Button, Checkbox, FormField, Icon, Input, Radio, Select, Textarea, type SelectOption, type StepperStep } from "@mosje/design-system";
import { useToast } from "@/components/nmba/toast";
import { useTCStore } from "@/lib/nmba/treatment-centre/store";
import { FormSection, FormCard } from "@/components/nmba/treatment-centre/tc-form";
import { Wizard, ReviewItem, ReviewSection } from "@/components/nmba/treatment-centre/tc-wizard";
import type { Beneficiary, DrugUseRow } from "@/lib/nmba/treatment-centre/types";
import {
  GENDERS,
  STATES,
  PLACE_OF_RESIDENCE,
  MARITAL_STATUS,
  LIVING_ARRANGEMENTS,
  EDUCATION,
  OCCUPATION,
  EMPLOYMENT,
  INCOME,
  CATEGORY,
  GOVERNMENT_ID,
  REFERRED_BY,
  DRUGS,
  INITIATION_REASONS,
  YES_NO,
  YES_NO_NR,
  SEXUAL_PRACTICES,
  TEST_RESULT,
  TREATMENT_TAKEN,
  MONEY_SOURCE_OPTIONS,
  MOTIVATION_STAGES,
  PROVISIONAL_DIAGNOSIS,
  INTERVENTION_REFERRAL,
  districtsForState,
} from "@/lib/nmba/treatment-centre/master-data";

function labelOf(options: SelectOption[], value: string): string {
  return options.find((o) => o.value === value)?.label ?? value;
}

/** "Others-specify" sentinel for the Referral Made To select. */
const REFERRAL_OTHER = "7";

const STEPS: StepperStep[] = [
  { label: "Registration & Profile", description: "Personal details" },
  { label: "Substance Use", description: "Drug & behaviour" },
  { label: "Assessment & Intervention", description: "Treatment & referral" },
  { label: "Review", description: "Confirm & submit" },
];

const emptyDrugRow: DrugUseRow = {
  drug: "",
  ageOfFirstUse: "",
  reason: "",
  usedLast3Months: "",
  dailyUse: "",
  durationMonths: "",
};

/** Required field keys per input step (mirrors the legacy form's `*` markers). */
const STEP_REQUIRED: Record<number, readonly string[]> = {
  0: [
    "dateOfRegistration",
    "name",
    "age",
    "state",
    "district",
    "placeOfResidence",
    "currentAddress",
    "permanentAddress",
    "contactNumber",
    "gender",
    "education",
    "occupation",
    "employment",
    "income",
    "maritalStatus",
    "category",
    "livingArrangements",
    "governmentId",
  ],
  1: [],
  2: [
    "previousTreatment",
    "everHospitalized",
    "avgExpenditure",
    "everApprehended",
    "familyHistory",
    "motivation",
    "provisionalDiagnosis",
    "referralMadeTo",
  ],
};

const FIELD_LABELS: Record<string, string> = {
  dateOfRegistration: "Date of Registration",
  name: "Name of the Beneficiary",
  age: "Age",
  state: "State",
  district: "District",
  placeOfResidence: "Place of Residence",
  currentAddress: "Current Address",
  permanentAddress: "Permanent Address",
  contactNumber: "Contact Number",
  gender: "Gender",
  education: "Educational Status",
  occupation: "Occupational Status",
  employment: "Employment Status",
  income: "Income (monthly)",
  maritalStatus: "Marital Status",
  category: "Category",
  livingArrangements: "Living Arrangements",
  governmentId: "Government ID",
  drug: "At least one drug-use row",
  ivEver: "Intravenous Drug Use Ever",
  sexualPractices: "Sexual Practices",
  hcvHistory: "HCV testing — Test History",
  hbvHistory: "HBV testing — Test History",
  previousTreatment: "Previous Treatment for Substance use",
  treatmentTaken: "If yes, treatment taken from",
  everHospitalized: "Ever hospitalized",
  avgExpenditure: "Average expenditure on drugs",
  moneySource: "Source of money for drugs",
  everApprehended: "Ever apprehended by police",
  familyHistory: "History of substance use in the family",
  motivation: "Patient's Motivation during admission",
  provisionalDiagnosis: "Diagnosis (as per ICD 11)",
  interventionTypes: "Intervention Provided during the Visit",
  medicalDetails: "Medical (intervention details)",
  psychosocial: "Psychosocial",
  referralMadeTo: "Referral Made To",
};

const todayIso = () => new Date().toISOString().slice(0, 10);

const INITIAL_FIELDS = {
  dateOfRegistration: "",
  referredBy: "",
  name: "",
  age: "",
  state: "",
  district: "",
  placeOfResidence: "",
  currentAddress: "",
  permanentAddress: "",
  contactNumber: "",
  gender: "",
  education: "",
  occupation: "",
  employment: "",
  income: "",
  maritalStatus: "",
  category: "",
  livingArrangements: "",
  governmentId: "",
  // Substance-use behaviour
  ivEver: "",
  iv3m: "",
  sharingEver: "",
  sharing3m: "",
  sexualPractices: "",
  hcvHistory: "",
  hcvResult: "",
  hbvHistory: "",
  hbvResult: "",
  // Treatment & miscellaneous
  previousTreatment: "",
  treatmentTaken: "",
  everHospitalized: "",
  avgExpenditure: "",
  everApprehended: "",
  familyHistory: "",
  motivation: "",
  provisionalDiagnosis: "",
  // Intervention provided
  medicalDetails: "",
  psychosocial: "",
  referralMadeTo: "",
  referralOther: "",
};

// Named fields resolve to `string` (not `string | undefined`) on dot access; the
// intersected index signature keeps dynamic bracket access (`f[key]`) working for
// validation loops driven by string arrays.
type OdicFields = typeof INITIAL_FIELDS & Record<string, string>;

export function OdicBeneficiaryForm({
  kind,
  redirectTo,
}: {
  kind: "Outreach" | "Drop-in Centre";
  redirectTo: string;
}) {
  const router = useRouter();
  const { toast } = useToast();
  const store = useTCStore();

  const [f, setF] = React.useState<OdicFields>(INITIAL_FIELDS);
  const [sameAddress, setSameAddress] = React.useState(false);
  const [moneySource, setMoneySource] = React.useState<string[]>([]);
  const [interventionTypes, setInterventionTypes] = React.useState<string[]>([]);

  const keyRef = React.useRef(0);
  const [drugRows, setDrugRows] = React.useState<Array<DrugUseRow & { _key: string }>>([
    { ...emptyDrugRow, _key: "row-0" },
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

  const toggleMoneySource = (value: string) =>
    setMoneySource((prev) => (prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value]));

  const toggleIntervention = (value: string) =>
    setInterventionTypes((prev) => (prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value]));

  const onSameAddress = (checked: boolean) => {
    setSameAddress(checked);
    if (checked) setF((prev) => ({ ...prev, permanentAddress: prev.currentAddress }));
  };

  const updateDrugRow = (i: number, patch: Partial<DrugUseRow>) =>
    setDrugRows((prev) => prev.map((row, idx) => (idx === i ? { ...row, ...patch } : row)));

  const districtOptions = f.state ? districtsForState(f.state) : [];

  const missingForStep = React.useCallback(
    (s: number): Set<string> => {
      const missing = new Set<string>();
      if (s === 0) {
        for (const key of STEP_REQUIRED[0] ?? []) if (!f[key]) missing.add(key);
        if (f.contactNumber && f.contactNumber.length !== 10) missing.add("contactNumber");
        if (f.age) {
          const n = Number(f.age);
          if (!Number.isInteger(n) || n < 1 || n > 120) missing.add("age");
        }
        if (f.dateOfRegistration && f.dateOfRegistration > todayIso()) missing.add("dateOfRegistration");
      }
      if (s === 1) {
        if (!drugRows.some((r) => r.drug)) missing.add("drug");
        drugRows.forEach((r, i) => {
          if (!r.drug) return;
          if (!r.ageOfFirstUse) missing.add(`row${i}.age`);
          if (!r.reason) missing.add(`row${i}.reason`);
          if (!r.usedLast3Months) missing.add(`row${i}.use3m`);
          if (!r.dailyUse) missing.add(`row${i}.daily`);
          if (!r.durationMonths) missing.add(`row${i}.duration`);
        });
        if (!f.ivEver) missing.add("ivEver");
        for (const key of ["sexualPractices", "hcvHistory", "hbvHistory"]) if (!f[key]) missing.add(key);
      }
      if (s === 2) {
        for (const key of STEP_REQUIRED[2] ?? []) if (!f[key]) missing.add(key);
        if (f.previousTreatment === "Yes" && !f.treatmentTaken) missing.add("treatmentTaken");
        if (moneySource.length === 0) missing.add("moneySource");
        if (interventionTypes.length === 0) missing.add("interventionTypes");
        if (interventionTypes.includes("Medical") && !f.medicalDetails) missing.add("medicalDetails");
        if (interventionTypes.includes("Psychosocial") && !f.psychosocial) missing.add("psychosocial");
      }
      return missing;
    },
    [f, drugRows, moneySource, interventionTypes],
  );

  const labelForKey = (k: string): string => {
    const row = k.match(/^row(\d+)\.(\w+)$/);
    if (row) {
      const fieldLabels: Record<string, string> = {
        age: "Age of First Use",
        reason: "Reason of Substance Abuse",
        use3m: "Use in Last 3 Months",
        daily: "Daily/Near-daily Use",
        duration: "Duration of Regular Use",
      };
      const subfield = row[2] ?? "";
      return `Drug ${Number(row[1]) + 1} — ${fieldLabels[subfield] ?? subfield}`;
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
      f.referralMadeTo === REFERRAL_OTHER && f.referralOther
        ? f.referralOther
        : labelOf(INTERVENTION_REFERRAL, f.referralMadeTo);
    const moneySourceLabel = moneySource.map((v) => labelOf(MONEY_SOURCE_OPTIONS, v)).join(", ");

    const detailPairs: Array<[string, string]> = [
      ["Referred By", labelOf(REFERRED_BY, f.referredBy)],
      ["Current address", f.currentAddress],
      ["Permanent address", f.permanentAddress],
      ["Education", labelOf(EDUCATION, f.education)],
      ["Occupation", labelOf(OCCUPATION, f.occupation)],
      ["Employment", labelOf(EMPLOYMENT, f.employment)],
      ["Income", labelOf(INCOME, f.income)],
      ["Marital status", labelOf(MARITAL_STATUS, f.maritalStatus)],
      ["Living arrangements", labelOf(LIVING_ARRANGEMENTS, f.livingArrangements)],
      // Injecting behaviour
      ["IV drug use (ever)", labelOf(YES_NO_NR, f.ivEver)],
      ["IV drug use (last 3 months)", labelOf(YES_NO_NR, f.iv3m)],
      ["Shared needles (ever)", labelOf(YES_NO_NR, f.sharingEver)],
      ["Shared needles (last 3 months)", labelOf(YES_NO_NR, f.sharing3m)],
      // Sexual behaviour
      ["Sexual practices", labelOf(SEXUAL_PRACTICES, f.sexualPractices)],
      ["HCV test history", labelOf(YES_NO, f.hcvHistory)],
      ["HCV result", labelOf(TEST_RESULT, f.hcvResult)],
      ["HBV test history", labelOf(YES_NO, f.hbvHistory)],
      ["HBV result", labelOf(TEST_RESULT, f.hbvResult)],
      // Treatment
      ["Previous treatment", labelOf(YES_NO, f.previousTreatment)],
      ["Treatment taken from", f.previousTreatment === "Yes" ? labelOf(TREATMENT_TAKEN, f.treatmentTaken) : ""],
      ["Ever hospitalised", labelOf(YES_NO, f.everHospitalized)],
      // Miscellaneous
      ["Avg. expenditure on drugs (₹)", f.avgExpenditure],
      ["Source of money", moneySourceLabel],
      ["Ever apprehended by police", labelOf(YES_NO_NR, f.everApprehended)],
      ["Family history of substance use", labelOf(YES_NO, f.familyHistory)],
      ["Motivation at admission", labelOf(MOTIVATION_STAGES, f.motivation)],
      ["Diagnosis (ICD 11)", labelOf(PROVISIONAL_DIAGNOSIS, f.provisionalDiagnosis)],
      // Intervention provided
      ["Intervention provided", interventionTypes.join(", ")],
      ["Medical intervention", interventionTypes.includes("Medical") ? f.medicalDetails : ""],
      ["Psychosocial", interventionTypes.includes("Psychosocial") ? labelOf(YES_NO_NR, f.psychosocial) : ""],
      ["Referral made to", referralLabel],
    ];
    const details = Object.fromEntries(detailPairs.filter(([, v]) => v && v.trim()));

    const beneficiary: Omit<Beneficiary, "id"> = {
      // Unique demo registration number generated at submit time (event handler).
      // eslint-disable-next-line react-hooks/purity
      registrationNumber: `OD${Date.now().toString().slice(-8)}${crypto.randomUUID().slice(0, 4)}`,
      registrationProgress: "Pending",
      name: f.name,
      gender: labelOf(GENDERS, f.gender),
      age: Number(f.age) || 0,
      dateOfRegistration: f.dateOfRegistration,
      referredBy: labelOf(REFERRED_BY, f.referredBy),
      state: labelOf(STATES, f.state),
      district: labelOf(districtOptions, f.district),
      placeOfResidence: labelOf(PLACE_OF_RESIDENCE, f.placeOfResidence),
      contactNumber: f.contactNumber,
      category: labelOf(CATEGORY, f.category),
      kind,
      governmentId: f.governmentId ? labelOf(GOVERNMENT_ID, f.governmentId) : undefined,
      drugUse: drugRows
        .filter((r) => r.drug)
        .map((r) => ({
          drug: labelOf(DRUGS, r.drug),
          ageOfFirstUse: r.ageOfFirstUse,
          reason: labelOf(INITIATION_REASONS, r.reason),
          usedLast3Months: r.usedLast3Months,
          dailyUse: r.dailyUse,
          durationMonths: r.durationMonths,
        })),
      details: Object.keys(details).length ? details : undefined,
    };
    store.addBeneficiary(beneficiary);
    toast("Beneficiary registered successfully.", "success");
    router.push(redirectTo);
  };

  const err = (key: string): string | undefined => {
    if (!errors.has(key)) return undefined;
    if (key === "contactNumber" && f.contactNumber) return "Enter a valid 10-digit mobile number.";
    if (key === "age" && f.age) return "Enter a valid age between 1 and 120.";
    if (key === "dateOfRegistration" && f.dateOfRegistration) return "Date cannot be in the future.";
    return "This field is required.";
  };

  const recordedDrugs = drugRows.filter((r) => r.drug);
  const drugDetail = (r: DrugUseRow): string =>
    [
      r.ageOfFirstUse ? `First use age ${r.ageOfFirstUse}` : "",
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
        <h1 className="text-xl font-bold text-ink">
          {kind === "Outreach"
            ? "Outreach Beneficiary Registration"
            : "ODIC Client / Beneficiary Registration"}
        </h1>
        <p className="mt-1 text-sm text-ink-muted">
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
        {/* ── Step 0: Registration & Personal Details ─────────────────────── */}
        {step === 0 && (
          <div className="flex flex-col gap-6">
            <FormSection title={kind === "Outreach" ? "Details of Outreach" : "Details of DIC"} columns={2}>
              <FormField label="Date of Registration" required error={err("dateOfRegistration")}>
                {(c) => <Input {...c} type="date" max={todayIso()} value={f.dateOfRegistration} onChange={(e) => set("dateOfRegistration")(e.target.value)} invalid={errors.has("dateOfRegistration")} />}
              </FormField>
              <FormField label="Referred By">
                {(c) => <Select {...c} value={f.referredBy} onChange={(e) => set("referredBy")(e.target.value)} placeholder="Select Referred By" options={REFERRED_BY} />}
              </FormField>
            </FormSection>

            <FormSection title="Personal Details" columns={2}>
              <FormField label="Name of the Beneficiary" required error={err("name")}>
                {(c) => <Input {...c} autoComplete="name" value={f.name} onChange={(e) => set("name")(e.target.value.replace(/[^a-zA-Z\s.]/g, ""))} placeholder="Full name" invalid={errors.has("name")} />}
              </FormField>
              <FormField label="Age" required error={err("age")}>
                {(c) => <Input {...c} autoComplete="off" type="number" min={1} max={120} step={1} value={f.age} onChange={(e) => set("age")(e.target.value)} placeholder="Age in years" invalid={errors.has("age")} />}
              </FormField>
              <FormField label="Gender" required error={err("gender")}>
                {(c) => <Select {...c} value={f.gender} onChange={(e) => set("gender")(e.target.value)} placeholder="Select Gender" options={GENDERS} invalid={errors.has("gender")} />}
              </FormField>
              <FormField label="Contact Number" required error={err("contactNumber")}>
                {(c) => <Input {...c} autoComplete="tel-national" type="tel" inputMode="numeric" maxLength={10} value={f.contactNumber} onChange={(e) => set("contactNumber")(e.target.value.replace(/\D/g, ""))} placeholder="10-digit number" invalid={errors.has("contactNumber")} />}
              </FormField>
              <FormField label="State" required error={err("state")}>
                {(c) => <Select {...c} value={f.state} onChange={(e) => { set("state")(e.target.value); set("district")(""); }} placeholder="Select State" options={STATES} invalid={errors.has("state")} />}
              </FormField>
              <FormField label="District" required error={err("district")}>
                {(c) => <Select {...c} value={f.district} onChange={(e) => set("district")(e.target.value)} placeholder={f.state ? "Select District" : "Select a State first"} options={districtOptions} disabled={!f.state} invalid={errors.has("district")} />}
              </FormField>
              <FormField label="Place of Residence" required error={err("placeOfResidence")}>
                {(c) => <Select {...c} value={f.placeOfResidence} onChange={(e) => set("placeOfResidence")(e.target.value)} placeholder="Select Residence" options={PLACE_OF_RESIDENCE} invalid={errors.has("placeOfResidence")} />}
              </FormField>
              <div className="hidden lg:block" />
              <FormField label="Current Address" required error={err("currentAddress")}>
                {(c) => <Textarea {...c} rows={2} value={f.currentAddress} onChange={(e) => { const v = e.target.value; set("currentAddress")(v); if (sameAddress) set("permanentAddress")(v); }} placeholder="House no., street, area" invalid={errors.has("currentAddress")} />}
              </FormField>
              <FormField label="Permanent Address" required error={err("permanentAddress")}>
                {(c) => <Textarea {...c} rows={2} value={f.permanentAddress} onChange={(e) => set("permanentAddress")(e.target.value)} disabled={sameAddress} placeholder="House no., street, area" invalid={errors.has("permanentAddress")} />}
              </FormField>
              <div className="flex items-center">
                <Checkbox checked={sameAddress} onChange={(e) => onSameAddress(e.target.checked)} label="Same as Current Address" />
              </div>
              <div className="hidden lg:block" />
              <FormField label="Educational Status" required error={err("education")}>
                {(c) => <Select {...c} value={f.education} onChange={(e) => set("education")(e.target.value)} placeholder="Select Education" options={EDUCATION} invalid={errors.has("education")} />}
              </FormField>
              <FormField label="Occupational Status" required error={err("occupation")}>
                {(c) => <Select {...c} value={f.occupation} onChange={(e) => set("occupation")(e.target.value)} placeholder="Select Occupation" options={OCCUPATION} invalid={errors.has("occupation")} />}
              </FormField>
              <FormField label="Employment Status" required error={err("employment")}>
                {(c) => <Select {...c} value={f.employment} onChange={(e) => set("employment")(e.target.value)} placeholder="Select Employment" options={EMPLOYMENT} invalid={errors.has("employment")} />}
              </FormField>
              <FormField label="Income (monthly)" required error={err("income")}>
                {(c) => <Select {...c} value={f.income} onChange={(e) => set("income")(e.target.value)} placeholder="Select Income" options={INCOME} invalid={errors.has("income")} />}
              </FormField>
              <FormField label="Marital Status" required error={err("maritalStatus")}>
                {(c) => <Select {...c} value={f.maritalStatus} onChange={(e) => set("maritalStatus")(e.target.value)} placeholder="Select Marital Status" options={MARITAL_STATUS} invalid={errors.has("maritalStatus")} />}
              </FormField>
              <FormField label="Category" required error={err("category")}>
                {(c) => <Select {...c} value={f.category} onChange={(e) => set("category")(e.target.value)} placeholder="Select Category" options={CATEGORY} invalid={errors.has("category")} />}
              </FormField>
              <FormField label="Living Arrangements" required error={err("livingArrangements")}>
                {(c) => <Select {...c} value={f.livingArrangements} onChange={(e) => set("livingArrangements")(e.target.value)} placeholder="Select Living Arrangement" options={LIVING_ARRANGEMENTS} invalid={errors.has("livingArrangements")} />}
              </FormField>
              <FormField label="Government ID" required error={err("governmentId")}>
                {(c) => <Select {...c} value={f.governmentId} onChange={(e) => set("governmentId")(e.target.value)} placeholder="Select Government ID" options={GOVERNMENT_ID} invalid={errors.has("governmentId")} />}
              </FormField>
            </FormSection>
          </div>
        )}

        {/* ── Step 1: Substance Use ───────────────────────────────────────── */}
        {step === 1 && (
          <div className="flex flex-col gap-6">
            <FormCard
              title="Drug Use Details"
              required
              headingId={drugSectionId}
              description="Each substance gets its own card — add as many as needed."
            >
              {errors.has("drug") && (
                <div className="mb-4">
                  <Alert id="drug-error" status="error">Add at least one drug — select a substance below.</Alert>
                </div>
              )}
              <ol className="flex flex-col gap-4">
                {drugRows.map((row, i) => (
                  <li key={row._key} className="rounded-xl border border-line bg-surface-muted/50 p-4 sm:p-5">
                    <div className="mb-4 flex items-center justify-between gap-2">
                      <span className="inline-flex items-center gap-2 text-sm font-semibold text-navy">
                        <span className="flex h-6 w-6 items-center justify-center rounded-full bg-navy/10 text-xs font-bold text-navy" aria-hidden="true">{i + 1}</span>
                        Drug {i + 1}
                      </span>
                      {drugRows.length > 1 && (
                        <button
                          type="button"
                          onClick={() => setDrugRows((prev) => prev.filter((_, idx) => idx !== i))}
                          aria-label={`Remove drug ${i + 1}`}
                          className="inline-flex h-9 items-center gap-1.5 rounded-lg px-2.5 text-xs font-semibold text-danger-fg hover:bg-danger-fg/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-danger-fg"
                        >
                          <Icon name="delete" size={14} aria-hidden /> Remove
                        </button>
                      )}
                    </div>
                    <div className="grid grid-cols-1 gap-x-4 gap-y-4 sm:grid-cols-2 lg:grid-cols-3">
                      <FormField label="Drug" required error={errors.has("drug") && !row.drug ? "Select a drug." : undefined}>
                        {(c) => <Select {...c} value={row.drug} onChange={(e) => updateDrugRow(i, { drug: e.target.value })} placeholder="Select Drug" options={DRUGS} />}
                      </FormField>
                      <FormField label="Age Of First Use" required error={errors.has(`row${i}.age`) ? "Required." : undefined}>
                        {(c) => <Input {...c} type="number" min={0} value={row.ageOfFirstUse} onChange={(e) => updateDrugRow(i, { ageOfFirstUse: e.target.value })} placeholder="Years" />}
                      </FormField>
                      <FormField label="Reason of Substance Abuse" required error={errors.has(`row${i}.reason`) ? "Required." : undefined}>
                        {(c) => <Select {...c} value={row.reason} onChange={(e) => updateDrugRow(i, { reason: e.target.value })} placeholder="Select Reason" options={INITIATION_REASONS} />}
                      </FormField>
                      <fieldset className="m-0 flex flex-col gap-1.5 border-0 p-0">
                        <legend className="p-0 text-sm font-medium text-ink">Use in Last 3 Month <span className="ds-field__required" aria-hidden="true">*</span></legend>
                        <div className="flex gap-4 pt-1.5">
                          {YES_NO.map((o) => (
                            <Radio key={o.value} name={`used3m-${row._key}`} value={o.value} checked={row.usedLast3Months === o.value} onChange={() => updateDrugRow(i, { usedLast3Months: o.value as "Yes" | "No" })} label={o.label} />
                          ))}
                        </div>
                        {errors.has(`row${i}.use3m`) && <p className="text-xs font-medium text-danger-fg">Required.</p>}
                      </fieldset>
                      <fieldset className="m-0 flex flex-col gap-1.5 border-0 p-0">
                        <legend className="p-0 text-sm font-medium text-ink">Daily / Near Daily Use <span className="ds-field__required" aria-hidden="true">*</span></legend>
                        <div className="flex gap-4 pt-1.5">
                          {YES_NO.map((o) => (
                            <Radio key={o.value} name={`daily-${row._key}`} value={o.value} checked={row.dailyUse === o.value} onChange={() => updateDrugRow(i, { dailyUse: o.value as "Yes" | "No" })} label={o.label} />
                          ))}
                        </div>
                        {errors.has(`row${i}.daily`) && <p className="text-xs font-medium text-danger-fg">Required.</p>}
                      </fieldset>
                      <FormField label="Duration of regular use (months)" required error={errors.has(`row${i}.duration`) ? "Required." : undefined}>
                        {(c) => <Input {...c} type="number" min={0} value={row.durationMonths} onChange={(e) => updateDrugRow(i, { durationMonths: e.target.value })} placeholder="Months" />}
                      </FormField>
                    </div>
                  </li>
                ))}
              </ol>
              <div className="mt-4">
                <Button type="button" appearance="outlined" iconLeft={<Icon name="add" size={16} />} onClick={() => setDrugRows((prev) => [...prev, { ...emptyDrugRow, _key: `row-${(keyRef.current += 1)}` }])}>
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
              <div className="hidden lg:block" />
              <FormField label="Ever had HCV testing — Test History" required error={err("hcvHistory")}>
                {(c) => <Select {...c} value={f.hcvHistory} onChange={(e) => set("hcvHistory")(e.target.value)} placeholder="Select" options={YES_NO} invalid={errors.has("hcvHistory")} />}
              </FormField>
              <FormField label="HCV Test Result">
                {(c) => <Select {...c} value={f.hcvResult} onChange={(e) => set("hcvResult")(e.target.value)} placeholder="Select" options={TEST_RESULT} />}
              </FormField>
              <FormField label="Ever had HBV testing — Test History" required error={err("hbvHistory")}>
                {(c) => <Select {...c} value={f.hbvHistory} onChange={(e) => set("hbvHistory")(e.target.value)} placeholder="Select" options={YES_NO} invalid={errors.has("hbvHistory")} />}
              </FormField>
              <FormField label="Result of HBV Test">
                {(c) => <Select {...c} value={f.hbvResult} onChange={(e) => set("hbvResult")(e.target.value)} placeholder="Select" options={TEST_RESULT} />}
              </FormField>
            </FormSection>
          </div>
        )}

        {/* ── Step 2: Assessment & Intervention ───────────────────────────── */}
        {step === 2 && (
          <div className="flex flex-col gap-6">
            <FormSection title="Treatment Details" columns={2}>
              <FormField label="Previous Treatment for use Substance" required error={err("previousTreatment")}>
                {(c) => <Select {...c} value={f.previousTreatment} onChange={(e) => { set("previousTreatment")(e.target.value); if (e.target.value !== "Yes") set("treatmentTaken")(""); }} placeholder="Select" options={YES_NO} invalid={errors.has("previousTreatment")} />}
              </FormField>
              {f.previousTreatment === "Yes" && (
                <FormField label="Treatment taken from" required error={err("treatmentTaken")}>
                  {(c) => <Select {...c} value={f.treatmentTaken} onChange={(e) => set("treatmentTaken")(e.target.value)} placeholder="Select Treatment Taken" options={TREATMENT_TAKEN} invalid={errors.has("treatmentTaken")} />}
                </FormField>
              )}
              <FormField label="Ever hospitalized for treatment of substance use" required error={err("everHospitalized")}>
                {(c) => <Select {...c} value={f.everHospitalized} onChange={(e) => set("everHospitalized")(e.target.value)} placeholder="Select drug abuse" options={YES_NO} invalid={errors.has("everHospitalized")} />}
              </FormField>
            </FormSection>

            <FormCard title="Miscellaneous">
              <div className="ds-form-section__grid ds-form-section__grid--2">
                <FormField label="Average expenditure on drugs (₹)" required error={err("avgExpenditure")}>
                  {(c) => <Input {...c} type="number" min={0} value={f.avgExpenditure} onChange={(e) => set("avgExpenditure")(e.target.value)} placeholder="₹ amount" invalid={errors.has("avgExpenditure")} />}
                </FormField>
                <div className="flex flex-col gap-1.5">
                  <span id="money-source-label" className="text-sm font-medium text-ink">
                    Source of money for drugs (rupees) <span className="ds-field__required">*</span>
                    <span className="ml-1 font-normal text-ink-muted">(select all that apply)</span>
                  </span>
                  <div
                    role="group"
                    aria-labelledby="money-source-label"
                    className={`flex flex-wrap gap-x-4 gap-y-2 rounded-lg border p-3 ${errors.has("moneySource") ? "border-danger-fg" : "border-line"}`}
                  >
                    {MONEY_SOURCE_OPTIONS.map((o) => (
                      <Checkbox
                        key={o.value}
                        checked={moneySource.includes(o.value)}
                        onChange={() => {
                          toggleMoneySource(o.value);
                          setErrors((prev) => { const n = new Set(prev); n.delete("moneySource"); return n; });
                        }}
                        label={o.label}
                      />
                    ))}
                  </div>
                  {errors.has("moneySource") && <p className="text-xs font-medium text-danger-fg">Select at least one source.</p>}
                </div>
                <FormField label="Ever apprehended by police for drug-related offense" required error={err("everApprehended")}>
                  {(c) => <Select {...c} value={f.everApprehended} onChange={(e) => set("everApprehended")(e.target.value)} placeholder="Select" options={YES_NO_NR} invalid={errors.has("everApprehended")} />}
                </FormField>
                <FormField label="Any history of substance use in the family" required error={err("familyHistory")}>
                  {(c) => <Select {...c} value={f.familyHistory} onChange={(e) => set("familyHistory")(e.target.value)} placeholder="Select Option" options={YES_NO} invalid={errors.has("familyHistory")} />}
                </FormField>
                <FormField label="Patient's Motivation During the time of admission" required error={err("motivation")}>
                  {(c) => <Select {...c} value={f.motivation} onChange={(e) => set("motivation")(e.target.value)} placeholder="Select Patient's Motivation" options={MOTIVATION_STAGES} invalid={errors.has("motivation")} />}
                </FormField>
                <FormField label="Diagnosis (as per ICD 11)" required error={err("provisionalDiagnosis")}>
                  {(c) => <Select {...c} value={f.provisionalDiagnosis} onChange={(e) => set("provisionalDiagnosis")(e.target.value)} placeholder="Select Diagnosis" options={PROVISIONAL_DIAGNOSIS} invalid={errors.has("provisionalDiagnosis")} />}
                </FormField>
              </div>
            </FormCard>

            <FormCard title="Intervention Provided">
              <div className="flex flex-col gap-4">
                <div className="flex flex-col gap-1.5">
                  <span id="intervention-label" className="text-sm font-medium text-ink">
                    Intervention Provided during the Visit <span className="ds-field__required">*</span>
                  </span>
                  <div
                    role="group"
                    aria-labelledby="intervention-label"
                    className={`flex flex-wrap gap-x-4 gap-y-2 rounded-lg border p-3 ${errors.has("interventionTypes") ? "border-danger-fg" : "border-line"}`}
                  >
                    {["Medical", "Psychosocial"].map((opt) => (
                      <Checkbox
                        key={opt}
                        checked={interventionTypes.includes(opt)}
                        onChange={() => {
                          toggleIntervention(opt);
                          setErrors((prev) => { const n = new Set(prev); n.delete("interventionTypes"); return n; });
                        }}
                        label={opt}
                      />
                    ))}
                  </div>
                  {errors.has("interventionTypes") && <p className="text-xs font-medium text-danger-fg">Select at least one intervention.</p>}
                </div>

                <div className="ds-form-section__grid ds-form-section__grid--2">
                  {interventionTypes.includes("Medical") && (
                    <FormField label="Medical" required error={err("medicalDetails")}>
                      {(c) => <Input {...c} value={f.medicalDetails} onChange={(e) => set("medicalDetails")(e.target.value)} placeholder="Medical intervention details" invalid={errors.has("medicalDetails")} />}
                    </FormField>
                  )}
                  {interventionTypes.includes("Psychosocial") && (
                    <FormField label="Psychosocial" required error={err("psychosocial")}>
                      {(c) => <Select {...c} value={f.psychosocial} onChange={(e) => set("psychosocial")(e.target.value)} placeholder="Select Psychosocial" options={YES_NO_NR} invalid={errors.has("psychosocial")} />}
                    </FormField>
                  )}
                  <FormField label="Referral Made To" required error={err("referralMadeTo")}>
                    {(c) => <Select {...c} value={f.referralMadeTo} onChange={(e) => { set("referralMadeTo")(e.target.value); if (e.target.value !== REFERRAL_OTHER) set("referralOther")(""); }} placeholder="Select Referral" options={INTERVENTION_REFERRAL} invalid={errors.has("referralMadeTo")} />}
                  </FormField>
                  {f.referralMadeTo === REFERRAL_OTHER && (
                    <FormField label="Referral (specify)" required error={err("referralOther")}>
                      {(c) => <Input {...c} value={f.referralOther} onChange={(e) => set("referralOther")(e.target.value)} placeholder="Specify referral" invalid={errors.has("referralOther")} />}
                    </FormField>
                  )}
                </div>
              </div>
            </FormCard>
          </div>
        )}

        {/* ── Step 3: Review ──────────────────────────────────────────────── */}
        {step === 3 && (
          <div className="flex flex-col gap-5">
            <div className="flex flex-col gap-3">
              <p className="text-sm text-ink-muted">
                Review the details below, then submit. Use the quick links or{" "}
                <span className="font-semibold text-ink">Back</span> to make changes.
              </p>
              <div className="flex flex-wrap gap-2">
                {[
                  { to: 0, label: "Edit Registration & Profile" },
                  { to: 1, label: "Edit Substance Use" },
                  { to: 2, label: "Edit Assessment & Intervention" },
                ].map((j) => (
                  <button
                    key={j.to}
                    type="button"
                    onClick={() => jumpTo(j.to)}
                    className="inline-flex items-center gap-1 rounded-lg border border-line bg-white px-3 py-1.5 text-xs font-semibold text-navy hover:bg-black/5"
                  >
                    <Icon name="edit" size={12} aria-hidden /> {j.label}
                  </button>
                ))}
              </div>
            </div>

            <ReviewSection title="Registration & Personal Details">
              <ReviewItem label="Date of Registration" value={f.dateOfRegistration} />
              <ReviewItem label="Referred By" value={labelOf(REFERRED_BY, f.referredBy)} />
              <ReviewItem label="Name" value={f.name} />
              <ReviewItem label="Age" value={f.age} />
              <ReviewItem label="Gender" value={labelOf(GENDERS, f.gender)} />
              <ReviewItem label="Contact Number" value={f.contactNumber} />
              <ReviewItem label="State" value={labelOf(STATES, f.state)} />
              <ReviewItem label="District" value={labelOf(districtOptions, f.district)} />
              <ReviewItem label="Place of Residence" value={labelOf(PLACE_OF_RESIDENCE, f.placeOfResidence)} />
              <ReviewItem label="Current Address" value={f.currentAddress} />
              <ReviewItem label="Permanent Address" value={f.permanentAddress} />
              <ReviewItem label="Education" value={labelOf(EDUCATION, f.education)} />
              <ReviewItem label="Occupation" value={labelOf(OCCUPATION, f.occupation)} />
              <ReviewItem label="Employment" value={labelOf(EMPLOYMENT, f.employment)} />
              <ReviewItem label="Income" value={labelOf(INCOME, f.income)} />
              <ReviewItem label="Marital Status" value={labelOf(MARITAL_STATUS, f.maritalStatus)} />
              <ReviewItem label="Category" value={labelOf(CATEGORY, f.category)} />
              <ReviewItem label="Living Arrangements" value={labelOf(LIVING_ARRANGEMENTS, f.livingArrangements)} />
              <ReviewItem label="Government ID" value={labelOf(GOVERNMENT_ID, f.governmentId)} />
            </ReviewSection>

            <ReviewSection title="Substance Use">
              {recordedDrugs.length === 0 ? (
                <ReviewItem wide label="Drugs recorded" value="None" />
              ) : (
                recordedDrugs.map((r, i) => (
                  <ReviewItem key={r._key} wide label={`Drug ${i + 1} — ${labelOf(DRUGS, r.drug)}`} value={drugDetail(r)} />
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
              <ReviewItem label="HCV testing — history" value={labelOf(YES_NO, f.hcvHistory)} />
              <ReviewItem label="HCV result" value={labelOf(TEST_RESULT, f.hcvResult)} />
              <ReviewItem label="HBV testing — history" value={labelOf(YES_NO, f.hbvHistory)} />
              <ReviewItem label="HBV result" value={labelOf(TEST_RESULT, f.hbvResult)} />
            </ReviewSection>

            <ReviewSection title="Assessment & Intervention">
              <ReviewItem label="Previous treatment" value={labelOf(YES_NO, f.previousTreatment)} />
              {f.previousTreatment === "Yes" && <ReviewItem label="Treatment taken from" value={labelOf(TREATMENT_TAKEN, f.treatmentTaken)} />}
              <ReviewItem label="Ever hospitalised" value={labelOf(YES_NO, f.everHospitalized)} />
              <ReviewItem label="Avg. expenditure on drugs" value={f.avgExpenditure ? `₹${f.avgExpenditure}` : ""} />
              <ReviewItem label="Source of money" value={moneySource.map((v) => labelOf(MONEY_SOURCE_OPTIONS, v)).join(", ")} />
              <ReviewItem label="Ever apprehended by police" value={labelOf(YES_NO_NR, f.everApprehended)} />
              <ReviewItem label="Family history of substance use" value={labelOf(YES_NO, f.familyHistory)} />
              <ReviewItem label="Motivation" value={labelOf(MOTIVATION_STAGES, f.motivation)} />
              <ReviewItem label="Diagnosis (ICD 11)" value={labelOf(PROVISIONAL_DIAGNOSIS, f.provisionalDiagnosis)} />
              <ReviewItem label="Intervention provided" value={interventionTypes.join(", ")} />
              {interventionTypes.includes("Medical") && <ReviewItem label="Medical" value={f.medicalDetails} />}
              {interventionTypes.includes("Psychosocial") && <ReviewItem label="Psychosocial" value={labelOf(YES_NO_NR, f.psychosocial)} />}
              <ReviewItem
                label="Referral Made To"
                value={f.referralMadeTo === REFERRAL_OTHER && f.referralOther ? f.referralOther : labelOf(INTERVENTION_REFERRAL, f.referralMadeTo)}
              />
            </ReviewSection>
          </div>
        )}
      </Wizard>
    </form>
  );
}
