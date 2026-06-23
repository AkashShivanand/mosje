"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Plus, Trash2 } from "lucide-react";
import {
  Button,
  Input,
  Textarea,
  Select,
  FormField,
  Checkbox,
  Radio,
  Alert,
  type SelectOption,
  type StepperStep,
} from "@mosje/design-system";
import { useToast } from "@/components/toast";
import { useTCSession } from "@/lib/treatment-centre/session-context";
import { useTCStore } from "@/lib/treatment-centre/store";
import { FormSection } from "@/components/treatment-centre/tc-form";
import { Wizard, ReviewItem, ReviewSection } from "@/components/treatment-centre/tc-wizard";
import type { DrugUseRow, Patient } from "@/lib/treatment-centre/types";
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
  DRUGS,
  INITIATION_REASONS,
  YES_NO,
  ASSIST_SCORE,
  SEXUAL_PRACTICES,
  PREVIOUS_TREATMENT,
  SOURCE_OF_REFERRAL,
  PROVISIONAL_DIAGNOSIS,
  districtsForState,
} from "@/lib/treatment-centre/master-data";

function labelOf(options: SelectOption[], value: string): string {
  return options.find((o) => o.value === value)?.label ?? value;
}

const TEST_RESULT: SelectOption[] = [
  { label: "Positive", value: "pos" },
  { label: "Negative", value: "neg" },
  { label: "Not Tested", value: "nt" },
];
const MONEY_SOURCE: SelectOption[] = [
  { label: "Own Income", value: "1" },
  { label: "Family", value: "2" },
  { label: "Borrowing", value: "3" },
  { label: "Illegal Means", value: "4" },
];
const MOTIVATION: SelectOption[] = [
  { label: "Low", value: "1" },
  { label: "Moderate", value: "2" },
  { label: "High", value: "3" },
];

const emptyDrugRow: DrugUseRow = {
  drug: "",
  ageOfFirstUse: "",
  reason: "",
  usedLast3Months: "",
  dailyUse: "",
  durationMonths: "",
};

const REQUIRED_FIELDS = [
  "dateOfAdmission",
  "name",
  "gender",
  "age",
  "currentAddress",
  "permanentAddress",
  "state",
  "district",
  "placeOfResidence",
  "maritalStatus",
  "livingArrangements",
  "education",
  "occupation",
  "employment",
  "income",
  "category",
  "contactNumber",
  "governmentId",
  "provisionalDiagnosis",
] as const;

/** Human labels for the error summary (so it names the fields, not just "highlighted"). */
const FIELD_LABELS: Record<string, string> = {
  dateOfAdmission: "Date of Admission",
  name: "Name of the Patient",
  gender: "Gender",
  age: "Age",
  currentAddress: "Current Address",
  permanentAddress: "Permanent Address",
  state: "State",
  district: "District",
  placeOfResidence: "Place of Residence",
  maritalStatus: "Marital Status",
  livingArrangements: "Living Arrangements",
  education: "Educational Status",
  occupation: "Occupational Status",
  employment: "Employment Status",
  income: "Income",
  category: "Category",
  contactNumber: "Contact Number",
  governmentId: "Government ID",
  provisionalDiagnosis: "Provisional Diagnosis",
  drug: "At least one drug-use row",
};

const STEPS: StepperStep[] = [
  { label: "Patient Details", description: "Demographics" },
  { label: "Substance Use", description: "Drug & behaviour" },
  { label: "Assessment", description: "Scores & diagnosis" },
  { label: "Review", description: "Confirm & submit" },
];

/** Required fields owned by each input step (Review step has none of its own). */
const STEP0_REQUIRED = REQUIRED_FIELDS.filter((k) => k !== "provisionalDiagnosis");

const todayIso = () => new Date().toISOString().slice(0, 10);

export default function IrcaRegisterPage() {
  const router = useRouter();
  const { toast } = useToast();
  const session = useTCSession();
  const store = useTCStore();

  const [f, setF] = React.useState<Record<string, string>>({
    dateOfAdmission: "",
    name: "",
    gender: "",
    age: "",
    currentAddress: "",
    permanentAddress: "",
    state: "",
    district: "",
    placeOfResidence: "",
    maritalStatus: "",
    livingArrangements: "",
    education: "",
    occupation: "",
    employment: "",
    income: "",
    category: "",
    contactNumber: "",
    governmentId: "",
    provisionalDiagnosis: "",
    // Clinical detail fields (optional) — now captured, previously discarded.
    ivEver: "",
    iv3m: "",
    sharingEver: "",
    sharing3m: "",
    sexualPractices: "",
    hcvHistory: "",
    hcvResult: "",
    hbvHistory: "",
    hbvResult: "",
    assistAlcohol: "",
    assistOther: "",
    previousTreatment: "",
    sourceOfReferral: "",
    everHospitalized: "",
    avgExpenditure: "",
    moneySource: "",
    everApprehended: "",
    familyHistory: "",
    daysSinceLast: "",
    motivation: "",
  });
  const [sameAddress, setSameAddress] = React.useState(false);
  const keyRef = React.useRef(0);
  const [drugRows, setDrugRows] = React.useState<Array<DrugUseRow & { _key: string }>>([
    { ...emptyDrugRow, _key: "row-0" },
  ]);
  const [errors, setErrors] = React.useState<Set<string>>(new Set());
  const [submitError, setSubmitError] = React.useState("");
  const errorSummaryRef = React.useRef<HTMLDivElement>(null);
  const submittingRef = React.useRef(false);
  const drugSectionId = React.useId();

  // Warn before leaving with unsaved data (browser refresh/close/external nav).
  React.useEffect(() => {
    const dirty = !submittingRef.current && (Object.values(f).some(Boolean) || drugRows.some((r) => r.drug));
    if (!dirty) return;
    const handler = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = "";
    };
    window.addEventListener("beforeunload", handler);
    return () => window.removeEventListener("beforeunload", handler);
  }, [f, drugRows]);

  const set = (key: string) => (value: string) =>
    setF((prev) => ({ ...prev, [key]: value }));

  const onSameAddress = (checked: boolean) => {
    setSameAddress(checked);
    if (checked) setF((prev) => ({ ...prev, permanentAddress: prev.currentAddress }));
  };

  const updateDrugRow = (i: number, patch: Partial<DrugUseRow>) =>
    setDrugRows((prev) => prev.map((row, idx) => (idx === i ? { ...row, ...patch } : row)));

  const districtOptions = f.state ? districtsForState(f.state) : [];

  const [step, setStep] = React.useState(0);

  /** Missing/invalid required fields for a given input step. */
  const missingForStep = React.useCallback(
    (s: number): Set<string> => {
      const missing = new Set<string>();
      if (s === 0) {
        for (const key of STEP0_REQUIRED) if (!f[key]) missing.add(key);
        // Format checks (only flag when the field has a value but is wrong).
        if (f.contactNumber && f.contactNumber.length !== 10) missing.add("contactNumber");
        if (f.age) {
          const n = Number(f.age);
          if (!Number.isInteger(n) || n < 1 || n > 120) missing.add("age");
        }
        if (f.dateOfAdmission && f.dateOfAdmission > todayIso()) missing.add("dateOfAdmission");
      }
      if (s === 1 && !drugRows.some((r) => r.drug)) missing.add("drug");
      if (s === 2 && !f.provisionalDiagnosis) missing.add("provisionalDiagnosis");
      return missing;
    },
    [f, drugRows],
  );

  const flagStep = (missing: Set<string>, targetStep: number) => {
    setErrors(missing);
    setStep(targetStep);
    const names = [...missing].map((k) => FIELD_LABELS[k] ?? k);
    setSubmitError(
      names.length
        ? `Please complete: ${names.join(", ")}.`
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

  const submit = () => {
    if (submittingRef.current) return; // guard against double-submit
    // Validate every input step; jump to the first that fails.
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

    // Optional clinical details — captured, no longer discarded. Only keep answered fields.
    const clinicalPairs: Array<[string, string]> = [
      ["IV drug use (ever)", labelOf(YES_NO, f.ivEver)],
      ["IV drug use (last 3 months)", labelOf(YES_NO, f.iv3m)],
      ["Shared needles (ever)", labelOf(YES_NO, f.sharingEver)],
      ["Shared needles (last 3 months)", labelOf(YES_NO, f.sharing3m)],
      ["Sexual practices", labelOf(SEXUAL_PRACTICES, f.sexualPractices)],
      ["HCV test history", labelOf(YES_NO, f.hcvHistory)],
      ["HCV result", labelOf(TEST_RESULT, f.hcvResult)],
      ["HBV test history", labelOf(YES_NO, f.hbvHistory)],
      ["HBV result", labelOf(TEST_RESULT, f.hbvResult)],
      ["ASSIST score (alcohol)", labelOf(ASSIST_SCORE, f.assistAlcohol)],
      ["ASSIST score (other drugs)", labelOf(ASSIST_SCORE, f.assistOther)],
      ["Previous treatment", labelOf(PREVIOUS_TREATMENT, f.previousTreatment)],
      ["Source of referral", labelOf(SOURCE_OF_REFERRAL, f.sourceOfReferral)],
      ["Ever hospitalised", labelOf(YES_NO, f.everHospitalized)],
      ["Avg. daily expenditure (₹)", f.avgExpenditure],
      ["Source of money", labelOf(MONEY_SOURCE, f.moneySource)],
      ["Ever apprehended", labelOf(YES_NO, f.everApprehended)],
      ["Family history of substance use", labelOf(YES_NO, f.familyHistory)],
      ["Days since last use", f.daysSinceLast],
      ["Motivation at admission", labelOf(MOTIVATION, f.motivation)],
    ];
    const clinicalDetails = Object.fromEntries(clinicalPairs.filter(([, v]) => v && v.trim()));

    const patient: Omit<Patient, "id"> = {
      registrationNumber: `DM${Date.now().toString().slice(-8)}${crypto.randomUUID().slice(0, 4)}`,
      registrationProgress: "Pending",
      treatmentCenter: session.centerName,
      name: f.name,
      gender: labelOf(GENDERS, f.gender),
      age: Number(f.age) || 0,
      dateOfAdmission: f.dateOfAdmission,
      currentAddress: f.currentAddress,
      permanentAddress: f.permanentAddress,
      state: labelOf(STATES, f.state),
      district: labelOf(districtOptions, f.district),
      placeOfResidence: labelOf(PLACE_OF_RESIDENCE, f.placeOfResidence),
      maritalStatus: labelOf(MARITAL_STATUS, f.maritalStatus),
      livingArrangements: labelOf(LIVING_ARRANGEMENTS, f.livingArrangements),
      education: labelOf(EDUCATION, f.education),
      occupation: labelOf(OCCUPATION, f.occupation),
      employment: labelOf(EMPLOYMENT, f.employment),
      income: labelOf(INCOME, f.income),
      category: labelOf(CATEGORY, f.category),
      contactNumber: f.contactNumber,
      governmentId: labelOf(GOVERNMENT_ID, f.governmentId),
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
      provisionalDiagnosis: labelOf(PROVISIONAL_DIAGNOSIS, f.provisionalDiagnosis),
      clinicalDetails: Object.keys(clinicalDetails).length ? clinicalDetails : undefined,
    };

    store.addPatient(patient);
    toast("Patient registered successfully.", "success");
    router.push("/treatment-centre/irca/patients");
  };

  const err = (key: string): string | undefined => {
    if (!errors.has(key)) return undefined;
    if (key === "contactNumber" && f.contactNumber) return "Enter a valid 10-digit mobile number.";
    if (key === "age" && f.age) return "Enter a valid age between 1 and 120.";
    if (key === "dateOfAdmission" && f.dateOfAdmission) return "Date of admission cannot be in the future.";
    return "This field is required.";
  };

  const recordedDrugs = drugRows.filter((r) => r.drug);

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
        <h1 className="text-xl font-bold text-ink">Patient Registration &amp; Details Submission</h1>
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
        {step === 0 && (
          <>
            {/* 1. Details of the Patient */}
            <FormSection title="Details of the Patient">
        <FormField label="Date of Admission" required error={err("dateOfAdmission")}>
          {(c) => (
            <Input {...c} type="date" max={todayIso()} value={f.dateOfAdmission} onChange={(e) => set("dateOfAdmission")(e.target.value)} invalid={errors.has("dateOfAdmission")} />
          )}
        </FormField>
        <FormField label="Name of the Patient" required error={err("name")}>
          {(c) => (
            <Input {...c} autoComplete="name" value={f.name} onChange={(e) => set("name")(e.target.value)} placeholder="Full name" invalid={errors.has("name")} />
          )}
        </FormField>
        <FormField label="Gender" required error={err("gender")}>
          {(c) => (
            <Select {...c} value={f.gender} onChange={(e) => set("gender")(e.target.value)} placeholder="Select Gender" options={GENDERS} invalid={errors.has("gender")} />
          )}
        </FormField>
        <FormField label="Age" required error={err("age")}>
          {(c) => (
            <Input {...c} autoComplete="off" type="number" min={1} max={120} step={1} value={f.age} onChange={(e) => set("age")(e.target.value)} placeholder="Age" invalid={errors.has("age")} />
          )}
        </FormField>
        <FormField label="Current Address" required error={err("currentAddress")}>
          {(c) => (
            <Textarea {...c} rows={2} value={f.currentAddress} onChange={(e) => set("currentAddress")(e.target.value)} invalid={errors.has("currentAddress")} />
          )}
        </FormField>
        <FormField label="Permanent Address" required error={err("permanentAddress")}>
          {(c) => (
            <Textarea {...c} rows={2} value={f.permanentAddress} onChange={(e) => set("permanentAddress")(e.target.value)} disabled={sameAddress} invalid={errors.has("permanentAddress")} />
          )}
        </FormField>
        <div className="flex items-center">
          <Checkbox checked={sameAddress} onChange={(e) => onSameAddress(e.target.checked)} label="Same as Current Address" />
        </div>
        <FormField label="State" required error={err("state")}>
          {(c) => (
            <Select {...c} value={f.state} onChange={(e) => { set("state")(e.target.value); set("district")(""); }} placeholder="Select State" options={STATES} invalid={errors.has("state")} />
          )}
        </FormField>
        <FormField label="District" required error={err("district")}>
          {(c) => (
            <Select {...c} value={f.district} onChange={(e) => set("district")(e.target.value)} placeholder="Select District" options={districtOptions} disabled={!f.state} invalid={errors.has("district")} />
          )}
        </FormField>
        <FormField label="Place of Residence" required error={err("placeOfResidence")}>
          {(c) => (
            <Select {...c} value={f.placeOfResidence} onChange={(e) => set("placeOfResidence")(e.target.value)} placeholder="Select Residence" options={PLACE_OF_RESIDENCE} invalid={errors.has("placeOfResidence")} />
          )}
        </FormField>
        <FormField label="Marital Status" required error={err("maritalStatus")}>
          {(c) => (
            <Select {...c} value={f.maritalStatus} onChange={(e) => set("maritalStatus")(e.target.value)} placeholder="Select Marital Status" options={MARITAL_STATUS} invalid={errors.has("maritalStatus")} />
          )}
        </FormField>
        <FormField label="Living Arrangements" required error={err("livingArrangements")}>
          {(c) => (
            <Select {...c} value={f.livingArrangements} onChange={(e) => set("livingArrangements")(e.target.value)} placeholder="Select Living Arrangements" options={LIVING_ARRANGEMENTS} invalid={errors.has("livingArrangements")} />
          )}
        </FormField>
        <FormField label="Educational Status" required error={err("education")}>
          {(c) => (
            <Select {...c} value={f.education} onChange={(e) => set("education")(e.target.value)} placeholder="Select Education" options={EDUCATION} invalid={errors.has("education")} />
          )}
        </FormField>
        <FormField label="Occupational Status" required error={err("occupation")}>
          {(c) => (
            <Select {...c} value={f.occupation} onChange={(e) => set("occupation")(e.target.value)} placeholder="Select Occupation" options={OCCUPATION} invalid={errors.has("occupation")} />
          )}
        </FormField>
        <FormField label="Employment Status" required error={err("employment")}>
          {(c) => (
            <Select {...c} value={f.employment} onChange={(e) => set("employment")(e.target.value)} placeholder="Select Employment" options={EMPLOYMENT} invalid={errors.has("employment")} />
          )}
        </FormField>
        <FormField label="Income (monthly)" required error={err("income")}>
          {(c) => (
            <Select {...c} value={f.income} onChange={(e) => set("income")(e.target.value)} placeholder="Select Income" options={INCOME} invalid={errors.has("income")} />
          )}
        </FormField>
        <FormField label="Category" required error={err("category")}>
          {(c) => (
            <Select {...c} value={f.category} onChange={(e) => set("category")(e.target.value)} placeholder="Select Category" options={CATEGORY} invalid={errors.has("category")} />
          )}
        </FormField>
        <FormField label="Contact Number" required error={err("contactNumber")}>
          {(c) => (
            <Input {...c} autoComplete="tel-national" type="tel" inputMode="numeric" maxLength={10} value={f.contactNumber} onChange={(e) => set("contactNumber")(e.target.value.replace(/\D/g, ""))} placeholder="10-digit number" invalid={errors.has("contactNumber")} />
          )}
        </FormField>
        <FormField label="Government ID" required error={err("governmentId")}>
          {(c) => (
            <Select {...c} value={f.governmentId} onChange={(e) => set("governmentId")(e.target.value)} placeholder="Select Government ID" options={GOVERNMENT_ID} invalid={errors.has("governmentId")} />
          )}
        </FormField>
      </FormSection>
          </>
        )}

        {step === 1 && (
          <>
      {/* 2. Drug Use Details */}
      <section aria-labelledby={drugSectionId} className="rounded-xl border border-line bg-white p-5">
        <div className="mb-5 border-b border-line pb-3">
          <h2 id={drugSectionId} className="text-base font-semibold text-navy">Drug Use Details</h2>
        </div>
        {errors.has("drug") && (
          <div className="mb-3">
            <Alert id="drug-error" status="error">Add at least one drug-use row (select a drug).</Alert>
          </div>
        )}
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="text-left text-xs font-semibold uppercase tracking-wide text-ink-muted">
                <th scope="col" className="px-2 py-2">Drug *</th>
                <th scope="col" className="px-2 py-2">Age of First Use</th>
                <th scope="col" className="px-2 py-2">Reason for Initiation/Use</th>
                <th scope="col" className="px-2 py-2">Use in Last 3 Months</th>
                <th scope="col" className="px-2 py-2">Daily/Near Daily Use</th>
                <th scope="col" className="px-2 py-2">Duration (months)</th>
                <th scope="col" className="px-2 py-2"><span className="sr-only">Actions</span></th>
              </tr>
            </thead>
            <tbody>
              {drugRows.map((row, i) => (
                <tr key={row._key} className="align-top">
                  <td className="px-2 py-2 min-w-[180px]">
                    <Select
                      aria-label={`Drug for row ${i + 1}`}
                      value={row.drug}
                      onChange={(e) => updateDrugRow(i, { drug: e.target.value })}
                      placeholder="Select Drug"
                      options={DRUGS}
                      invalid={errors.has("drug") && !row.drug}
                      aria-describedby={errors.has("drug") && !row.drug ? "drug-error" : undefined}
                    />
                  </td>
                  <td className="px-2 py-2 w-28">
                    <Input aria-label={`Age of first use for row ${i + 1}`} type="number" min={0} value={row.ageOfFirstUse} onChange={(e) => updateDrugRow(i, { ageOfFirstUse: e.target.value })} placeholder="Age" />
                  </td>
                  <td className="px-2 py-2 min-w-[180px]">
                    <Select aria-label={`Reason for initiation for row ${i + 1}`} value={row.reason} onChange={(e) => updateDrugRow(i, { reason: e.target.value })} placeholder="Select Reason" options={INITIATION_REASONS} />
                  </td>
                  <td className="px-2 py-2">
                    <fieldset className="m-0 border-0 p-0">
                      <legend className="sr-only">{`Use in Last 3 Months — row ${i + 1}`}</legend>
                      <div className="flex gap-3">
                        {YES_NO.map((o) => (
                          <Radio key={o.value} name={`used3m-${row._key}`} value={o.value} checked={row.usedLast3Months === o.value} onChange={() => updateDrugRow(i, { usedLast3Months: o.value as "Yes" | "No" })} label={o.label} />
                        ))}
                      </div>
                    </fieldset>
                  </td>
                  <td className="px-2 py-2">
                    <fieldset className="m-0 border-0 p-0">
                      <legend className="sr-only">{`Daily/Near Daily Use — row ${i + 1}`}</legend>
                      <div className="flex gap-3">
                        {YES_NO.map((o) => (
                          <Radio key={o.value} name={`daily-${row._key}`} value={o.value} checked={row.dailyUse === o.value} onChange={() => updateDrugRow(i, { dailyUse: o.value as "Yes" | "No" })} label={o.label} />
                        ))}
                      </div>
                    </fieldset>
                  </td>
                  <td className="px-2 py-2 w-28">
                    <Input aria-label={`Duration in months for row ${i + 1}`} type="number" min={0} value={row.durationMonths} onChange={(e) => updateDrugRow(i, { durationMonths: e.target.value })} placeholder="Months" />
                  </td>
                  <td className="px-2 py-2">
                    {drugRows.length > 1 && (
                      <button type="button" onClick={() => setDrugRows((prev) => prev.filter((_, idx) => idx !== i))} aria-label={`Remove drug row ${i + 1}`} className="inline-flex h-11 w-11 items-center justify-center rounded text-danger-fg hover:bg-black/5">
                        <Trash2 className="h-4 w-4" aria-hidden />
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="mt-3">
          <Button type="button" appearance="outlined" iconLeft={<Plus className="h-4 w-4" />} onClick={() => setDrugRows((prev) => [...prev, { ...emptyDrugRow, _key: `row-${(keyRef.current += 1)}` }])}>
            Add Drug
          </Button>
        </div>
      </section>

      {/* 3. Injecting Behaviour */}
      <FormSection title="Injecting Behaviour" columns={2}>
        <FormField label="Intravenous Drug Use Ever">
          {(c) => <Select {...c} value={f.ivEver} onChange={(e) => set("ivEver")(e.target.value)} placeholder="Select Option" options={YES_NO} />}
        </FormField>
        <FormField label="Intravenous Drug Use in Last 3 Months">
          {(c) => <Select {...c} value={f.iv3m} onChange={(e) => set("iv3m")(e.target.value)} placeholder="Select Option" options={YES_NO} />}
        </FormField>
        <FormField label="Sharing Needles/Syringes Ever">
          {(c) => <Select {...c} value={f.sharingEver} onChange={(e) => set("sharingEver")(e.target.value)} placeholder="Select Option" options={YES_NO} />}
        </FormField>
        <FormField label="Sharing Needles/Syringes in Last 3 Months">
          {(c) => <Select {...c} value={f.sharing3m} onChange={(e) => set("sharing3m")(e.target.value)} placeholder="Select Option" options={YES_NO} />}
        </FormField>
      </FormSection>

      {/* 4. Sexual Behaviour */}
      <FormSection title="Sexual Behaviour" columns={2}>
        <FormField label="Sexual Practices">
          {(c) => <Select {...c} value={f.sexualPractices} onChange={(e) => set("sexualPractices")(e.target.value)} placeholder="Select Sexual Practices" options={SEXUAL_PRACTICES} />}
        </FormField>
        <div className="hidden xl:block" />
        <FormField label="Ever had HCV testing — Test History">
          {(c) => <Select {...c} value={f.hcvHistory} onChange={(e) => set("hcvHistory")(e.target.value)} placeholder="Select Option" options={YES_NO} />}
        </FormField>
        <FormField label="Result of HCV Test">
          {(c) => <Select {...c} value={f.hcvResult} onChange={(e) => set("hcvResult")(e.target.value)} placeholder="Select Option" options={TEST_RESULT} />}
        </FormField>
        <FormField label="Ever had HBV testing — Test History">
          {(c) => <Select {...c} value={f.hbvHistory} onChange={(e) => set("hbvHistory")(e.target.value)} placeholder="Select Option" options={YES_NO} />}
        </FormField>
        <FormField label="Result of HBV Test">
          {(c) => <Select {...c} value={f.hbvResult} onChange={(e) => set("hbvResult")(e.target.value)} placeholder="Select Option" options={TEST_RESULT} />}
        </FormField>
      </FormSection>

          </>
        )}

        {step === 2 && (
          <>
      {/* 5. ASSIST Score */}
      <FormSection title="Alcohol, Smoking and Substance Involvement Screening Test (ASSIST) Score" columns={2}>
        <FormField label="ASSIST Score For Alcohol Use">
          {(c) => <Select {...c} value={f.assistAlcohol} onChange={(e) => set("assistAlcohol")(e.target.value)} placeholder="Select ASSIST Score" options={ASSIST_SCORE} />}
        </FormField>
        <FormField label="ASSIST Score For Other Drugs">
          {(c) => <Select {...c} value={f.assistOther} onChange={(e) => set("assistOther")(e.target.value)} placeholder="Select ASSIST Score" options={ASSIST_SCORE} />}
        </FormField>
      </FormSection>

      {/* 6. Treatment Details */}
      <FormSection title="Treatment Details">
        <FormField label="Previous Treatment for Substance use">
          {(c) => <Select {...c} value={f.previousTreatment} onChange={(e) => set("previousTreatment")(e.target.value)} placeholder="Select Previous Treatment" options={PREVIOUS_TREATMENT} />}
        </FormField>
        <FormField label="Source of Referral">
          {(c) => <Select {...c} value={f.sourceOfReferral} onChange={(e) => set("sourceOfReferral")(e.target.value)} placeholder="Select Source of Referral" options={SOURCE_OF_REFERRAL} />}
        </FormField>
        <FormField label="Ever hospitalized for treatment of substance use">
          {(c) => <Select {...c} value={f.everHospitalized} onChange={(e) => set("everHospitalized")(e.target.value)} placeholder="Select Option" options={YES_NO} />}
        </FormField>
      </FormSection>

      {/* 7. Miscellaneous */}
      <FormSection title="Miscellaneous">
        <FormField label="Average Daily Expenditure on Drugs">
          {(c) => <Input {...c} type="number" min={0} value={f.avgExpenditure} onChange={(e) => set("avgExpenditure")(e.target.value)} placeholder="₹ per day" />}
        </FormField>
        <FormField label="Source of Money for Drug Use">
          {(c) => <Select {...c} value={f.moneySource} onChange={(e) => set("moneySource")(e.target.value)} placeholder="Select Option" options={MONEY_SOURCE} />}
        </FormField>
        <FormField label="Ever apprehended by police for drug-related offense">
          {(c) => <Select {...c} value={f.everApprehended} onChange={(e) => set("everApprehended")(e.target.value)} placeholder="Select Option" options={YES_NO} />}
        </FormField>
        <FormField label="Any history of substance use in the family">
          {(c) => <Select {...c} value={f.familyHistory} onChange={(e) => set("familyHistory")(e.target.value)} placeholder="Select Option" options={YES_NO} />}
        </FormField>
        <FormField label="How many days ago was the substance last consumed?">
          {(c) => <Input {...c} type="number" min={0} value={f.daysSinceLast} onChange={(e) => set("daysSinceLast")(e.target.value)} placeholder="Days" />}
        </FormField>
        <FormField label="Patient's Motivation During the time of admission">
          {(c) => <Select {...c} value={f.motivation} onChange={(e) => set("motivation")(e.target.value)} placeholder="Select Patient's Motivation" options={MOTIVATION} />}
        </FormField>
      </FormSection>

      {/* 8. Diagnosis */}
      <FormSection title="Diagnosis" columns={2}>
        <FormField label="Provisional Diagnosis (as per ICD 11)" required error={err("provisionalDiagnosis")}>
          {(c) => (
            <Select {...c} value={f.provisionalDiagnosis} onChange={(e) => set("provisionalDiagnosis")(e.target.value)} placeholder="Select Provisional Diagnosis" options={PROVISIONAL_DIAGNOSIS} invalid={errors.has("provisionalDiagnosis")} />
          )}
        </FormField>
      </FormSection>
          </>
        )}

        {step === 3 && (
          <div className="flex flex-col gap-5">
            <p className="text-sm text-ink-muted">
              Review the details below, then submit the registration. Use{" "}
              <span className="font-semibold text-ink">Back</span> to make changes.
            </p>
            <ReviewSection title="Patient Details">
              <ReviewItem label="Date of Admission" value={f.dateOfAdmission} />
              <ReviewItem label="Name" value={f.name} />
              <ReviewItem label="Gender" value={labelOf(GENDERS, f.gender)} />
              <ReviewItem label="Age" value={f.age} />
              <ReviewItem label="State" value={labelOf(STATES, f.state)} />
              <ReviewItem label="District" value={labelOf(districtOptions, f.district)} />
              <ReviewItem label="Place of Residence" value={labelOf(PLACE_OF_RESIDENCE, f.placeOfResidence)} />
              <ReviewItem label="Marital Status" value={labelOf(MARITAL_STATUS, f.maritalStatus)} />
              <ReviewItem label="Education" value={labelOf(EDUCATION, f.education)} />
              <ReviewItem label="Occupation" value={labelOf(OCCUPATION, f.occupation)} />
              <ReviewItem label="Contact Number" value={f.contactNumber} />
              <ReviewItem label="Category" value={labelOf(CATEGORY, f.category)} />
            </ReviewSection>
            <ReviewSection title="Substance Use">
              {recordedDrugs.length === 0 ? (
                <ReviewItem label="Drugs recorded" value="None" />
              ) : (
                recordedDrugs.map((r, i) => (
                  <ReviewItem
                    key={r._key}
                    label={`Drug ${i + 1}`}
                    value={`${labelOf(DRUGS, r.drug)}${r.ageOfFirstUse ? ` · first use age ${r.ageOfFirstUse}` : ""}`}
                  />
                ))
              )}
              <ReviewItem label="IV drug use (ever)" value={labelOf(YES_NO, f.ivEver)} />
              <ReviewItem label="HCV result" value={labelOf(TEST_RESULT, f.hcvResult)} />
              <ReviewItem label="HBV result" value={labelOf(TEST_RESULT, f.hbvResult)} />
            </ReviewSection>
            <ReviewSection title="Assessment & Diagnosis">
              <ReviewItem label="ASSIST (alcohol)" value={labelOf(ASSIST_SCORE, f.assistAlcohol)} />
              <ReviewItem label="ASSIST (other drugs)" value={labelOf(ASSIST_SCORE, f.assistOther)} />
              <ReviewItem label="Previous treatment" value={labelOf(PREVIOUS_TREATMENT, f.previousTreatment)} />
              <ReviewItem label="Motivation" value={labelOf(MOTIVATION, f.motivation)} />
              <ReviewItem label="Provisional Diagnosis" value={labelOf(PROVISIONAL_DIAGNOSIS, f.provisionalDiagnosis)} />
            </ReviewSection>
          </div>
        )}
      </Wizard>
    </form>
  );
}
