"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Plus, Trash2 } from "lucide-react";
import {
  Input,
  Textarea,
  Select,
  FormField,
  Checkbox,
  Button,
  Radio,
  Alert,
  type SelectOption,
  type StepperStep,
} from "@mosje/design-system";
import { useToast } from "@/components/toast";
import { useTCStore } from "@/lib/treatment-centre/store";
import { FormSection } from "@/components/treatment-centre/tc-form";
import { Wizard, ReviewItem, ReviewSection } from "@/components/treatment-centre/tc-wizard";
import type { Beneficiary, DrugUseRow } from "@/lib/treatment-centre/types";
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
  districtsForState,
} from "@/lib/treatment-centre/master-data";

function labelOf(options: SelectOption[], value: string): string {
  return options.find((o) => o.value === value)?.label ?? value;
}

const STEPS: StepperStep[] = [
  { label: "Registration", description: "Identity" },
  { label: "Demographics", description: "Address & background" },
  { label: "Substance Use", description: "Drug details" },
  { label: "Review", description: "Confirm & submit" },
];

/** Required fields owned by each input step. */
const STEP_REQUIRED: Record<number, readonly string[]> = {
  0: ["dateOfRegistration", "referredBy", "name", "age", "gender", "contactNumber", "category"],
  1: ["state", "district", "placeOfResidence"],
  2: [],
};

/** Human labels for the error summary. */
const FIELD_LABELS: Record<string, string> = {
  dateOfRegistration: "Date of Registration",
  referredBy: "Referred By",
  name: "Name",
  age: "Age",
  gender: "Gender",
  contactNumber: "Contact Number",
  category: "Category",
  state: "State",
  district: "District",
  placeOfResidence: "Place of Residence",
  governmentId: "Government ID",
  governmentIdNumber: "Government ID Number",
  drug: "At least one drug-use row",
};

const todayIso = () => new Date().toISOString().slice(0, 10);

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

  const [f, setF] = React.useState<Record<string, string>>({
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
    governmentIdNumber: "",
  });
  const [sameAddress, setSameAddress] = React.useState(false);
  
  const emptyDrugRow: DrugUseRow = {
    drug: "",
    ageOfFirstUse: "",
    reason: "",
    usedLast3Months: "",
    dailyUse: "",
    durationMonths: "",
  };
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

  // Warn before leaving with unsaved data (browser refresh/close/external nav).
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

  const updateDrugRow = (i: number, patch: Partial<DrugUseRow>) =>
    setDrugRows((prev) => prev.map((row, idx) => (idx === i ? { ...row, ...patch } : row)));

  const addDrugRow = () => {
    keyRef.current += 1;
    setDrugRows((prev) => [...prev, { ...emptyDrugRow, _key: `row-${keyRef.current}` }]);
  };

  const removeDrugRow = (i: number) => {
    setDrugRows((prev) => {
      const filtered = prev.filter((_, idx) => idx !== i);
      return filtered.length === 0 ? [{ ...emptyDrugRow, _key: `row-${keyRef.current}` }] : filtered;
    });
  };

  const districtOptions = f.state ? districtsForState(f.state) : [];
  const err = (key: string): string | undefined => {
    if (!errors.has(key)) return undefined;
    if (key === "contactNumber" && f.contactNumber) return "Enter a valid 10-digit mobile number.";
    if (key === "age" && f.age) return "Enter a valid age between 1 and 120.";
    if (key === "dateOfRegistration" && f.dateOfRegistration) return "Date cannot be in the future.";
    return "This field is required.";
  };

  const missingForStep = React.useCallback(
    (s: number): Set<string> => {
      const missing = new Set<string>();
      for (const key of STEP_REQUIRED[s] ?? []) if (!f[key]) missing.add(key);
      if (s === 0) {
        if (f.contactNumber && f.contactNumber.length !== 10) missing.add("contactNumber");
        if (f.age) {
          const n = Number(f.age);
          if (!Number.isInteger(n) || n < 1 || n > 120) missing.add("age");
        }
        if (f.dateOfRegistration && f.dateOfRegistration > todayIso()) missing.add("dateOfRegistration");
      }
      if (s === 1) {
        if (f.governmentId && !f.governmentIdNumber) missing.add("governmentIdNumber");
      }
      if (s === 2) {
        if (!drugRows.some((r) => r.drug)) missing.add("drug");
      }
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

    // Optional demographics — captured, no longer discarded on submit.
    const detailPairs: Array<[string, string]> = [
      ["Current address", f.currentAddress],
      ["Permanent address", f.permanentAddress],
      ["Education", labelOf(EDUCATION, f.education)],
      ["Occupation", labelOf(OCCUPATION, f.occupation)],
      ["Employment", labelOf(EMPLOYMENT, f.employment)],
      ["Income", labelOf(INCOME, f.income)],
      ["Marital status", labelOf(MARITAL_STATUS, f.maritalStatus)],
      ["Living arrangements", labelOf(LIVING_ARRANGEMENTS, f.livingArrangements)],
    ];
    const details = Object.fromEntries(detailPairs.filter(([, v]) => v && v.trim()));

    const beneficiary: Omit<Beneficiary, "id"> = {
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
      governmentIdNumber: f.governmentIdNumber || undefined,
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
            : "Drop In Centre Beneficiary Registration"}
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
        {step === 0 && (
          <>
            <FormSection
              title={kind === "Outreach" ? "Details of Outreach" : "Details of DIC"}
              columns={2}
            >
              <FormField label="Date of Registration" required error={err("dateOfRegistration")}>
                {(c) => <Input {...c} type="date" max={todayIso()} value={f.dateOfRegistration} onChange={(e) => set("dateOfRegistration")(e.target.value)} invalid={errors.has("dateOfRegistration")} />}
              </FormField>
              <FormField label="Referred By" required error={err("referredBy")}>
                {(c) => <Select {...c} value={f.referredBy} onChange={(e) => set("referredBy")(e.target.value)} placeholder="Select Referred By" options={REFERRED_BY} invalid={errors.has("referredBy")} />}
              </FormField>
            </FormSection>

            <FormSection title="Beneficiary Identity">
              <FormField label="Name of the Beneficiary" required error={err("name")}>
                {(c) => <Input {...c} autoComplete="name" value={f.name} onChange={(e) => set("name")(e.target.value)} placeholder="Full name" invalid={errors.has("name")} />}
              </FormField>
              <FormField label="Age" required error={err("age")}>
                {(c) => <Input {...c} autoComplete="off" type="number" min={1} max={120} step={1} value={f.age} onChange={(e) => set("age")(e.target.value)} placeholder="Age" invalid={errors.has("age")} />}
              </FormField>
              <FormField label="Gender" required error={err("gender")}>
                {(c) => <Select {...c} value={f.gender} onChange={(e) => set("gender")(e.target.value)} placeholder="Select Gender" options={GENDERS} invalid={errors.has("gender")} />}
              </FormField>
              <FormField label="Contact Number" required error={err("contactNumber")}>
                {(c) => <Input {...c} autoComplete="tel-national" type="tel" inputMode="numeric" maxLength={10} value={f.contactNumber} onChange={(e) => set("contactNumber")(e.target.value.replace(/\D/g, ""))} placeholder="10-digit number" invalid={errors.has("contactNumber")} />}
              </FormField>
              <FormField label="Category" required error={err("category")}>
                {(c) => <Select {...c} value={f.category} onChange={(e) => set("category")(e.target.value)} placeholder="Select Category" options={CATEGORY} invalid={errors.has("category")} />}
              </FormField>
            </FormSection>
          </>
        )}

        {step === 1 && (
          <FormSection title="Demographics & Address">
            <FormField label="State" required error={err("state")}>
              {(c) => <Select {...c} value={f.state} onChange={(e) => { set("state")(e.target.value); set("district")(""); }} placeholder="Select State" options={STATES} invalid={errors.has("state")} />}
            </FormField>
            <FormField label="District" required error={err("district")}>
              {(c) => <Select {...c} value={f.district} onChange={(e) => set("district")(e.target.value)} placeholder="Select District" options={districtOptions} disabled={!f.state} invalid={errors.has("district")} />}
            </FormField>
            <FormField label="Place of Residence" required error={err("placeOfResidence")}>
              {(c) => <Select {...c} value={f.placeOfResidence} onChange={(e) => set("placeOfResidence")(e.target.value)} placeholder="Select Residence" options={PLACE_OF_RESIDENCE} invalid={errors.has("placeOfResidence")} />}
            </FormField>
            <FormField label="Current Address">
              {(c) => <Textarea {...c} rows={2} value={f.currentAddress} onChange={(e) => set("currentAddress")(e.target.value)} />}
            </FormField>
            <FormField label="Permanent Address">
              {(c) => <Textarea {...c} rows={2} value={f.permanentAddress} onChange={(e) => set("permanentAddress")(e.target.value)} disabled={sameAddress} />}
            </FormField>
            <div className="flex items-center">
              <Checkbox
                checked={sameAddress}
                onChange={(e) => {
                  setSameAddress(e.target.checked);
                  if (e.target.checked) setF((p) => ({ ...p, permanentAddress: p.currentAddress }));
                }}
                label="Same as Current Address"
              />
            </div>
            <FormField label="Educational Status">
              {(c) => <Select {...c} value={f.education} onChange={(e) => set("education")(e.target.value)} placeholder="Select Education" options={EDUCATION} />}
            </FormField>
            <FormField label="Occupational Status">
              {(c) => <Select {...c} value={f.occupation} onChange={(e) => set("occupation")(e.target.value)} placeholder="Select Occupation" options={OCCUPATION} />}
            </FormField>
            <FormField label="Employment Status">
              {(c) => <Select {...c} value={f.employment} onChange={(e) => set("employment")(e.target.value)} placeholder="Select Employment" options={EMPLOYMENT} />}
            </FormField>
            <FormField label="Income (monthly)">
              {(c) => <Select {...c} value={f.income} onChange={(e) => set("income")(e.target.value)} placeholder="Select Income" options={INCOME} />}
            </FormField>
            <FormField label="Marital Status">
              {(c) => <Select {...c} value={f.maritalStatus} onChange={(e) => set("maritalStatus")(e.target.value)} placeholder="Select Marital Status" options={MARITAL_STATUS} />}
            </FormField>
            <FormField label="Living Arrangements">
              {(c) => <Select {...c} value={f.livingArrangements} onChange={(e) => set("livingArrangements")(e.target.value)} placeholder="Select Living Arrangement" options={LIVING_ARRANGEMENTS} />}
            </FormField>
            <FormField label="Government ID" error={err("governmentId")}>
              {(c) => <Select {...c} value={f.governmentId} onChange={(e) => set("governmentId")(e.target.value)} placeholder="Select Government ID" options={GOVERNMENT_ID} invalid={errors.has("governmentId")} />}
            </FormField>
            {f.governmentId && (
              <FormField label="Government ID Number" required error={err("governmentIdNumber")}>
                {(c) => <Input {...c} value={f.governmentIdNumber} onChange={(e) => set("governmentIdNumber")(e.target.value)} placeholder="Enter ID number" invalid={errors.has("governmentIdNumber")} />}
              </FormField>
            )}
          </FormSection>
        )}

        {step === 2 && (
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
                          <legend className="sr-only">{`Daily Use — row ${i + 1}`}</legend>
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
                      <td className="px-2 py-2 text-right">
                        <Button appearance="text" type="button" onClick={() => removeDrugRow(i)} aria-label={`Delete row ${i + 1}`} className="text-red-600 hover:text-red-800">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="mt-4">
              <Button appearance="outlined" type="button" onClick={addDrugRow} className="inline-flex items-center gap-2">
                <Plus className="h-4 w-4" /> Add Substance
              </Button>
            </div>
          </section>
        )}

        {step === 3 && (
          <div className="flex flex-col gap-5">
            <p className="text-sm text-ink-muted">
              Review the details below, then submit the registration. Use{" "}
              <span className="font-semibold text-ink">Back</span> to make changes.
            </p>
            <ReviewSection title="Registration & Identity">
              <ReviewItem label="Date of Registration" value={f.dateOfRegistration} />
              <ReviewItem label="Referred By" value={labelOf(REFERRED_BY, f.referredBy)} />
              <ReviewItem label="Name" value={f.name} />
              <ReviewItem label="Age" value={f.age} />
              <ReviewItem label="Gender" value={labelOf(GENDERS, f.gender)} />
              <ReviewItem label="Contact Number" value={f.contactNumber} />
              <ReviewItem label="Category" value={labelOf(CATEGORY, f.category)} />
            </ReviewSection>
            <ReviewSection title="Demographics & Address">
              <ReviewItem label="State" value={labelOf(STATES, f.state)} />
              <ReviewItem label="District" value={labelOf(districtOptions, f.district)} />
              <ReviewItem label="Place of Residence" value={labelOf(PLACE_OF_RESIDENCE, f.placeOfResidence)} />
              <ReviewItem label="Education" value={labelOf(EDUCATION, f.education)} />
              <ReviewItem label="Occupation" value={labelOf(OCCUPATION, f.occupation)} />
              <ReviewItem label="Employment" value={labelOf(EMPLOYMENT, f.employment)} />
              <ReviewItem label="Income" value={labelOf(INCOME, f.income)} />
              <ReviewItem label="Marital Status" value={labelOf(MARITAL_STATUS, f.maritalStatus)} />
              <ReviewItem label="Living Arrangements" value={labelOf(LIVING_ARRANGEMENTS, f.livingArrangements)} />
              <ReviewItem label="Government ID" value={labelOf(GOVERNMENT_ID, f.governmentId)} />
              {f.governmentIdNumber && <ReviewItem label="Government ID Number" value={f.governmentIdNumber} />}
            </ReviewSection>
            <ReviewSection title="Substance Use Details">
              {drugRows.filter((r) => r.drug).length === 0 ? (
                <p className="text-sm text-ink-muted col-span-2">No drugs recorded</p>
              ) : (
                drugRows.filter((r) => r.drug).map((r, i) => (
                  <div key={i} className="col-span-2 border-b border-line pb-2 last:border-0 last:pb-0">
                    <p className="font-semibold text-sm text-navy">{labelOf(DRUGS, r.drug)}</p>
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-2 mt-1 text-xs">
                      <div><span className="text-ink-muted">Age of first use:</span> {r.ageOfFirstUse || "N/A"}</div>
                      <div><span className="text-ink-muted">Reason:</span> {labelOf(INITIATION_REASONS, r.reason) || "N/A"}</div>
                      <div><span className="text-ink-muted">Used last 3 months:</span> {r.usedLast3Months || "N/A"}</div>
                      <div><span className="text-ink-muted">Daily use:</span> {r.dailyUse || "N/A"}</div>
                      <div><span className="text-ink-muted">Duration:</span> {r.durationMonths ? `${r.durationMonths} months` : "N/A"}</div>
                    </div>
                  </div>
                ))
              )}
            </ReviewSection>
          </div>
        )}
      </Wizard>
    </form>
  );
}
