"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import {
  Input,
  Textarea,
  Select,
  FormField,
  Checkbox,
  type SelectOption,
  type StepperStep,
} from "@mosje/design-system";
import { useToast } from "@/components/toast";
import { useTCStore } from "@/lib/treatment-centre/store";
import { FormSection } from "@/components/treatment-centre/tc-form";
import { Wizard, ReviewItem, ReviewSection } from "@/components/treatment-centre/tc-wizard";
import type { Beneficiary } from "@/lib/treatment-centre/types";
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
  districtsForState,
} from "@/lib/treatment-centre/master-data";

function labelOf(options: SelectOption[], value: string): string {
  return options.find((o) => o.value === value)?.label ?? value;
}

const STEPS: StepperStep[] = [
  { label: "Registration", description: "Identity" },
  { label: "Demographics", description: "Address & background" },
  { label: "Review", description: "Confirm & submit" },
];

/** Required fields owned by each input step. */
const STEP_REQUIRED: Record<number, readonly string[]> = {
  0: ["dateOfRegistration", "referredBy", "name", "age", "gender", "contactNumber", "category"],
  1: ["state", "district", "placeOfResidence"],
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
  });
  const [sameAddress, setSameAddress] = React.useState(false);
  const [step, setStep] = React.useState(0);
  const [errors, setErrors] = React.useState<Set<string>>(new Set());
  const [submitError, setSubmitError] = React.useState("");
  const errorSummaryRef = React.useRef<HTMLDivElement>(null);
  const submittingRef = React.useRef(false);

  // Warn before leaving with unsaved data (browser refresh/close/external nav).
  React.useEffect(() => {
    const dirty = !submittingRef.current && Object.values(f).some(Boolean);
    if (!dirty) return;
    const handler = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = "";
    };
    window.addEventListener("beforeunload", handler);
    return () => window.removeEventListener("beforeunload", handler);
  }, [f]);

  const set = (key: string) => (value: string) => setF((prev) => ({ ...prev, [key]: value }));
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
      return missing;
    },
    [f],
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
    for (const s of [0, 1]) {
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
      ["Government ID", labelOf(GOVERNMENT_ID, f.governmentId)],
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
            <FormField label="Government ID">
              {(c) => <Select {...c} value={f.governmentId} onChange={(e) => set("governmentId")(e.target.value)} placeholder="Select Government ID" options={GOVERNMENT_ID} />}
            </FormField>
          </FormSection>
        )}

        {step === 2 && (
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
            </ReviewSection>
          </div>
        )}
      </Wizard>
    </form>
  );
}
