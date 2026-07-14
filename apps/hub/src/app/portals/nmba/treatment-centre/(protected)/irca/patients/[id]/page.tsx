"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter, useParams } from "next/navigation";
import { ArrowLeft, Plus, Trash2, Save, FileText, ChevronRight, ChevronLeft } from "lucide-react";
import {
  Button,
  Input,
  Textarea,
  Select,
  FormField,
  Alert,
  Chip,
  Tabs,
  TabPanel,
  type TabDef,
  type SelectOption,
} from "@mosje/design-system";
import { useToast } from "@/components/nmba/toast";
import { useTCStore } from "@/lib/nmba/treatment-centre/store";
import { FormSection } from "@/components/nmba/treatment-centre/tc-form";
import type { Patient } from "@/lib/nmba/treatment-centre/types";
import {
  YES_NO,
  PROVISIONAL_DIAGNOSIS,
  MOTIVATION_STAGES,
} from "@/lib/nmba/treatment-centre/master-data";

// Options — captured verbatim from the legacy clinical-record tabs (2026-06-23).
const WITHDRAWAL_SYMPTOMS = ["Tremors", "Insomnia", "Nausea", "Aches and Pains", "Hallucinations", "Delirium", "Restlessness", "Seizures", "Nil"];
const PSYCHIATRIC_SYMPTOMS = ["Depression", "Suicidal Ideations and Attempts", "Confusion", "Aggressive Outbursts", "Hallucinations", "Paranoia", "Nil"];
const CHRONIC_PROBLEMS = ["Diabetes", "Liver Disorders", "Respiratory Problems (Pulmonary TB/Chronic Bronchitis/Bronchial Asthama)", "Cardiac Problems", "Infections", "Nil"];
const OTHER_MEDICAL_PROBLEMS = ["Haematemesis", "Jaundice", "Abscesses", "Bleeding Piles", "Skin Problems", "Any Other", "Nil"];
const TREATMENT_RECEIVED_TYPES = ["Pharmacological", "Psychosocial", "Family Intervention", "Vocational Training", "Mindfulness"];
const RELAPSE_REASONS: SelectOption[] = [
  { label: "Peer Pressure", value: "Peer Pressure" },
  { label: "Withdrawal Symptoms", value: "Withdrawal Symptoms" },
  { label: "Interpersonal Problems", value: "Interpersonal Problems" },
  { label: "Exposure to Triggers", value: "Exposure to Triggers" },
  { label: "Stress", value: "Stress" },
  { label: "Lack of Social Support", value: "Lack of Social Support" },
  { label: "Low self-efficacy", value: "Low self-efficacy" },
  { label: "Positive life events", value: "Positive life events" },
  { label: "Negative life events", value: "Negative life events" },
  { label: "Others-specify", value: "Others-specify" },
  { label: "Nil", value: "Nil" },
];
const REFERRAL_SERVICES = [
  "ICTC",
  "NACO – One Stop Centre",
  "Vocational Training Centre",
  "Tertiary Hospital for Medical Care",
  "Narcotics Anonymous",
  "Alcoholic Anonymous",
  "Others Specify",
];
/** Year-of-last-treatment dropdown — current year down to 2001 (matches live). */
const TREATMENT_YEARS: SelectOption[] = Array.from({ length: new Date().getFullYear() - 2000 }, (_, i) => {
  const y = String(new Date().getFullYear() - i);
  return { label: y, value: y };
});

const TAB_DEFS: TabDef[] = [
  { id: "history", label: "Previous History" },
  { id: "dosage", label: "Medication Dosage" },
  { id: "counselling", label: "Counselling Sessions" },
  { id: "referral", label: "Referral & Home Visits" },
  { id: "discharge", label: "Diagnosis & Discharge" },
];

function MultiSelectChips({
  options,
  selectedValues,
  onChange,
  ariaLabel,
}: {
  options: string[];
  selectedValues: string[];
  onChange: (vals: string[]) => void;
  ariaLabel: string;
}) {
  return (
    <div role="group" aria-label={ariaLabel} className="flex flex-wrap gap-2">
      {options.map((opt) => {
        const isSelected = selectedValues.includes(opt);
        return (
          <Chip
            key={opt}
            selected={isSelected}
            onSelectedChange={(val) => {
              if (val) {
                // If selecting 'Nil', deselect everything else. If selecting anything else, deselect 'Nil'.
                if (opt === "Nil") {
                  onChange(["Nil"]);
                } else {
                  onChange([...selectedValues.filter((v) => v !== "Nil"), opt]);
                }
              } else {
                onChange(selectedValues.filter((v) => v !== opt));
              }
            }}
          >
            {opt}
          </Chip>
        );
      })}
    </div>
  );
}

/** A repeatable list of counselling-session cards (Session no. · Date · Issues). */
function SessionCardList({
  title,
  description,
  rows,
  onAdd,
  onRemove,
  onUpdate,
  issuesPlaceholder,
}: {
  title: string;
  description: string;
  rows: Array<{ sessionNo: string; date: string; issues: string }>;
  onAdd: () => void;
  onRemove: (idx: number) => void;
  onUpdate: (idx: number, patch: { date?: string; issues?: string }) => void;
  issuesPlaceholder: string;
}) {
  const headingId = React.useId();
  return (
    <div className="flex flex-col gap-4">
      <div>
        <h2 id={headingId} className="text-base font-semibold text-navy">{title}</h2>
        <p className="mt-1 text-xs text-ink-muted">{description}</p>
      </div>
      <ol className="flex flex-col gap-3" aria-labelledby={headingId}>
        {rows.map((row, idx) => (
          <li key={idx} className="rounded-xl border border-line bg-surface-muted/50 p-4">
            <div className="mb-3 flex items-center justify-between gap-2">
              <span className="inline-flex items-center gap-2 text-sm font-semibold text-navy">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-navy/10 text-xs font-bold text-navy" aria-hidden="true">
                  {row.sessionNo}
                </span>
                Session {row.sessionNo}
              </span>
              {rows.length > 1 && (
                <button
                  type="button"
                  onClick={() => onRemove(idx)}
                  aria-label={`Remove session ${row.sessionNo}`}
                  className="inline-flex h-9 items-center gap-1.5 rounded-lg px-2.5 text-xs font-semibold text-danger-fg hover:bg-danger-fg/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-danger-fg"
                >
                  <Trash2 className="h-3.5 w-3.5" aria-hidden /> Remove
                </button>
              )}
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <FormField label="Date">
                {(c) => <Input {...c} type="date" value={row.date} onChange={(e) => onUpdate(idx, { date: e.target.value })} />}
              </FormField>
              <FormField label="Issues Dealt With" className="sm:col-span-2">
                {(c) => <Textarea {...c} rows={2} value={row.issues} onChange={(e) => onUpdate(idx, { issues: e.target.value })} placeholder={issuesPlaceholder} />}
              </FormField>
            </div>
          </li>
        ))}
      </ol>
      <div>
        <Button type="button" appearance="outlined" iconLeft={<Plus className="h-4 w-4" />} onClick={onAdd}>
          Add session
        </Button>
      </div>
    </div>
  );
}

export default function ClinicalWizardPage() {
  const params = useParams();
  const id = params.id as string;
  const store = useTCStore();
  const router = useRouter();
  const { toast } = useToast();

  const patient = store.patients.find((p) => p.id === id);

  // Core wizard states
  const [activeTab, setActiveTab] = React.useState(0);
  const tabsId = React.useId();
  // Inline (non-toast) validation for the discharge step.
  const [dischargeErrors, setDischargeErrors] = React.useState<Set<string>>(new Set());
  const dischargeErrorRef = React.useRef<HTMLDivElement>(null);

  // Tab 1 States
  const [withdrawalSymptoms, setWithdrawalSymptoms] = React.useState<string[]>(patient?.withdrawalSymptoms || []);
  const [psychiatricSymptoms, setPsychiatricSymptoms] = React.useState<string[]>(patient?.psychiatricSymptoms || []);
  const [chronicProblems, setChronicProblems] = React.useState<string[]>(patient?.chronicProblems || []);
  const [otherMedicalProblems, setOtherMedicalProblems] = React.useState<string[]>(patient?.otherMedicalProblems || []);
  const [headInjury, setHeadInjury] = React.useState(patient?.headInjury || "");
  const [previousDrugTreatment, setPreviousDrugTreatment] = React.useState(patient?.previousDrugTreatment || "");
  const [prevTreatmentYear, setPrevTreatmentYear] = React.useState(patient?.prevTreatmentYear || "");
  const [prevTreatmentDuration, setPrevTreatmentDuration] = React.useState(patient?.prevTreatmentDuration || "");
  const [prevTreatmentCenter, setPrevTreatmentCenter] = React.useState(patient?.prevTreatmentCenter || "");
  const [treatmentReceivedTypes, setTreatmentReceivedTypes] = React.useState<string[]>(patient?.treatmentReceivedTypes || []);
  const [relapseReason, setRelapseReason] = React.useState(patient?.relapseReason || "");
  const [relapseReasonOther, setRelapseReasonOther] = React.useState(patient?.relapseReasonOther || "");

  // Tab 2 States
  const [dosageLog, setDosageLog] = React.useState<
    Array<{ date: string; complaints: string; medication: string; changeReason: string; remarks: string }>
  >(patient?.dosageLog || [{ date: "", complaints: "", medication: "", changeReason: "", remarks: "" }]);

  // Tab 3 States
  const [individualCounselling, setIndividualCounselling] = React.useState<
    Array<{ sessionNo: string; date: string; issues: string }>
  >(patient?.individualCounselling || [{ sessionNo: "1", date: "", issues: "" }]);
  const [groupCounselling, setGroupCounselling] = React.useState<
    Array<{ sessionNo: string; date: string; issues: string }>
  >(patient?.groupCounselling || [{ sessionNo: "1", date: "", issues: "" }]);
  const [familyCounselling, setFamilyCounselling] = React.useState<
    Array<{ sessionNo: string; date: string; issues: string }>
  >(patient?.familyCounselling || [{ sessionNo: "1", date: "", issues: "" }]);

  // Tab 4 States
  const [referralServices, setReferralServices] = React.useState<string[]>(patient?.referralServices || []);
  const [referralOtherSpecify, setReferralOtherSpecify] = React.useState(patient?.referralOtherSpecify || "");
  const [referralRemark, setReferralRemark] = React.useState(patient?.referralRemark || "");
  const [homeVisits, setHomeVisits] = React.useState<
    Array<{ date: string; purpose: string; outcome: string }>
  >(patient?.homeVisits || [{ date: "", purpose: "", outcome: "" }]);

  // Tab 5 States
  const [finalDiagnosis, setFinalDiagnosis] = React.useState(patient?.finalDiagnosis || patient?.provisionalDiagnosis || "");
  const [medicalComorbidity, setMedicalComorbidity] = React.useState(patient?.medicalComorbidity || "");
  const [psychiatricComorbidity, setPsychiatricComorbidity] = React.useState(patient?.psychiatricComorbidity || "");
  const [neurologicalCondition, setNeurologicalCondition] = React.useState(patient?.neurologicalCondition || "");
  const [dischargeMotivation, setDischargeMotivation] = React.useState(patient?.dischargeMotivation || "");
  const [dischargeMedication, setDischargeMedication] = React.useState(patient?.dischargeMedication || "");
  const [dischargeRemark, setDischargeRemark] = React.useState(patient?.dischargeRemark || "");
  const [dischargeDate, setDischargeDate] = React.useState(patient?.dischargeDate || "");
  const [followUpDate, setFollowUpDate] = React.useState(patient?.followUpDate || "");

  // Move focus to the discharge error summary when validation fails (after DOM commit).
  React.useEffect(() => {
    if (dischargeErrors.size > 0) dischargeErrorRef.current?.focus();
  }, [dischargeErrors]);

  if (!patient) {
    return (
      <div className="p-8 text-center">
        <h1 className="text-xl font-bold text-ink">Patient not found</h1>
        <p className="text-sm text-ink-muted mt-2">The patient record you are looking for does not exist.</p>
        <Link
          href="/portals/nmba/treatment-centre/irca/patients"
          className="mt-4 inline-flex items-center text-sm font-semibold text-navy hover:underline"
        >
          <ArrowLeft className="h-4 w-4 mr-1.5" /> Back to Patient List
        </Link>
      </div>
    );
  }

  // Save current tab details to store
  const getTabPayload = (): Partial<Patient> => {
    switch (activeTab) {
      case 0:
        return {
          withdrawalSymptoms,
          psychiatricSymptoms,
          chronicProblems,
          otherMedicalProblems,
          headInjury,
          previousDrugTreatment,
          prevTreatmentYear,
          prevTreatmentDuration,
          prevTreatmentCenter,
          treatmentReceivedTypes,
          relapseReason,
          relapseReasonOther: relapseReason === "Others-specify" ? relapseReasonOther : "",
          registrationProgress: patient.registrationProgress === "Pending" ? "In Progress" : patient.registrationProgress,
        };
      case 1:
        return {
          dosageLog: dosageLog.filter((d) => d.date || d.medication),
          registrationProgress: patient.registrationProgress === "Pending" ? "In Progress" : patient.registrationProgress,
        };
      case 2:
        return {
          individualCounselling: individualCounselling.filter((c) => c.date || c.issues),
          groupCounselling: groupCounselling.filter((c) => c.date || c.issues),
          familyCounselling: familyCounselling.filter((c) => c.date || c.issues),
          registrationProgress: patient.registrationProgress === "Pending" ? "In Progress" : patient.registrationProgress,
        };
      case 3:
        return {
          referralServices,
          referralOtherSpecify: referralServices.includes("Others Specify") ? referralOtherSpecify : "",
          referralRemark,
          homeVisits: homeVisits.filter((h) => h.date || h.purpose),
          registrationProgress: patient.registrationProgress === "Pending" ? "In Progress" : patient.registrationProgress,
        };
      case 4:
        return {
          finalDiagnosis,
          medicalComorbidity,
          psychiatricComorbidity,
          neurologicalCondition,
          dischargeMotivation,
          dischargeMedication,
          dischargeRemark,
          dischargeDate,
          followUpDate,
          registrationProgress: dischargeDate ? "Completed" : "In Progress",
        };
      default:
        return {};
    }
  };

  const handleSaveTab = (next = false) => {
    const payload = getTabPayload();
    store.updatePatient(patient.id, payload);
    toast("Progress saved successfully.", "success");

    if (next) {
      setActiveTab((t) => Math.min(t + 1, TAB_DEFS.length - 1));
    }
  };

  const handleSubmitDischarge = (e: React.FormEvent) => {
    e.preventDefault();
    const payload = getTabPayload();

    // Inline validation tied to each field (no transient toast — WCAG 3.3.1).
    const missing = new Set<string>();
    if (!finalDiagnosis) missing.add("finalDiagnosis");
    if (!dischargeDate) missing.add("dischargeDate");
    if (missing.size > 0) {
      setDischargeErrors(missing);
      return;
    }
    setDischargeErrors(new Set());

    store.updatePatient(patient.id, {
      ...payload,
      registrationProgress: "Completed",
    });

    toast("Patient clinical record completed & discharged.", "success");
    router.push("/portals/nmba/treatment-centre/irca/patients");
  };

  // repeatable helpers for tab 2
  const addDosageRow = () => {
    setDosageLog((prev) => [...prev, { date: "", complaints: "", medication: "", changeReason: "", remarks: "" }]);
  };
  const removeDosageRow = (idx: number) => {
    setDosageLog((prev) => prev.filter((_, i) => i !== idx));
  };
  const updateDosageRow = (idx: number, patch: Partial<typeof dosageLog[0]>) => {
    setDosageLog((prev) => prev.map((item, i) => (i === idx ? { ...item, ...patch } : item)));
  };

  // repeatable helpers for tab 3
  const addIndividualRow = () => {
    setIndividualCounselling((prev) => [
      ...prev,
      { sessionNo: String(prev.length + 1), date: "", issues: "" },
    ]);
  };
  const removeIndividualRow = (idx: number) => {
    setIndividualCounselling((prev) => prev.filter((_, i) => i !== idx).map((item, i) => ({ ...item, sessionNo: String(i + 1) })));
  };
  const updateIndividualRow = (idx: number, patch: Partial<typeof individualCounselling[0]>) => {
    setIndividualCounselling((prev) => prev.map((item, i) => (i === idx ? { ...item, ...patch } : item)));
  };

  const addGroupRow = () => {
    setGroupCounselling((prev) => [
      ...prev,
      { sessionNo: String(prev.length + 1), date: "", issues: "" },
    ]);
  };
  const removeGroupRow = (idx: number) => {
    setGroupCounselling((prev) => prev.filter((_, i) => i !== idx).map((item, i) => ({ ...item, sessionNo: String(i + 1) })));
  };
  const updateGroupRow = (idx: number, patch: Partial<typeof groupCounselling[0]>) => {
    setGroupCounselling((prev) => prev.map((item, i) => (i === idx ? { ...item, ...patch } : item)));
  };

  const addFamilyRow = () => {
    setFamilyCounselling((prev) => [
      ...prev,
      { sessionNo: String(prev.length + 1), date: "", issues: "" },
    ]);
  };
  const removeFamilyRow = (idx: number) => {
    setFamilyCounselling((prev) => prev.filter((_, i) => i !== idx).map((item, i) => ({ ...item, sessionNo: String(i + 1) })));
  };
  const updateFamilyRow = (idx: number, patch: Partial<typeof familyCounselling[0]>) => {
    setFamilyCounselling((prev) => prev.map((item, i) => (i === idx ? { ...item, ...patch } : item)));
  };

  // repeatable helpers for tab 4
  const addHomeVisitRow = () => {
    setHomeVisits((prev) => [...prev, { date: "", purpose: "", outcome: "" }]);
  };
  const removeHomeVisitRow = (idx: number) => {
    setHomeVisits((prev) => prev.filter((_, i) => i !== idx));
  };
  const updateHomeVisitRow = (idx: number, patch: Partial<typeof homeVisits[0]>) => {
    setHomeVisits((prev) => prev.map((item, i) => (i === idx ? { ...item, ...patch } : item)));
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Page Header */}
      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between border-b border-line pb-4">
        <div>
          <div className="flex items-center gap-2">
            <Link
              href="/portals/nmba/treatment-centre/irca/patients"
              className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-line bg-white text-ink hover:bg-black/5"
              aria-label="Back to patients list"
            >
              <ArrowLeft className="h-4 w-4" />
            </Link>
            <div>
              <h1 className="text-xl font-bold text-ink">Clinical Case File</h1>
              <p className="text-xs text-ink-muted mt-0.5">
                Patient: <span className="font-semibold text-navy">{patient.name}</span> ({patient.registrationNumber}) · Adm: {patient.dateOfAdmission}
              </p>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button
            type="button"
            appearance="outlined"
            iconLeft={<Save className="h-4 w-4" />}
            onClick={() => handleSaveTab(false)}
          >
            Save Progress
          </Button>
        </div>
      </div>

      {/* Tabs — WAI-ARIA Tabs pattern (roving tabindex, arrow/Home/End keys). */}
      <Tabs
        tabs={TAB_DEFS}
        active={activeTab}
        ariaLabel="Clinical record sections"
        idBase={tabsId}
        onChange={(idx) => {
          handleSaveTab(false); // auto-save current tab before moving
          setActiveTab(idx);
        }}
      />

      {/* Form content */}
      <TabPanel idBase={tabsId} tabId={TAB_DEFS[activeTab]!.id}>
      <div className="bg-white rounded-xl border border-line p-6 min-h-[400px]">
        {activeTab === 0 && (
          <div className="flex flex-col gap-6">
            <FormSection title="Clinical History: Past Symptoms & Medical Issues" columns={1}>
              <FormField label="Withdrawal Symptoms in the Past">
                {() => (
                  <MultiSelectChips
                    options={WITHDRAWAL_SYMPTOMS}
                    selectedValues={withdrawalSymptoms}
                    onChange={setWithdrawalSymptoms}
                    ariaLabel="Withdrawal Symptoms in the Past"
                  />
                )}
              </FormField>

              <FormField label="Past Psychiatric Symptoms">
                {() => (
                  <MultiSelectChips
                    options={PSYCHIATRIC_SYMPTOMS}
                    selectedValues={psychiatricSymptoms}
                    onChange={setPsychiatricSymptoms}
                    ariaLabel="Past Psychiatric Symptoms"
                  />
                )}
              </FormField>

              <FormField label="History of Chronic Health Problems">
                {() => (
                  <MultiSelectChips
                    options={CHRONIC_PROBLEMS}
                    selectedValues={chronicProblems}
                    onChange={setChronicProblems}
                    ariaLabel="History of Chronic Health Problems"
                  />
                )}
              </FormField>

              <FormField label="History of Other Medical Problems">
                {() => (
                  <MultiSelectChips
                    options={OTHER_MEDICAL_PROBLEMS}
                    selectedValues={otherMedicalProblems}
                    onChange={setOtherMedicalProblems}
                    ariaLabel="History of Other Medical Problems"
                  />
                )}
              </FormField>
            </FormSection>

            <FormSection title="Injuries & Prior Treatments" columns={2}>
              <FormField label="History of Head Injury">
                {(c) => (
                  <Select
                    {...c}
                    value={headInjury}
                    onChange={(e) => setHeadInjury(e.target.value)}
                    placeholder="Select Option"
                    options={YES_NO}
                  />
                )}
              </FormField>

              <FormField label="Previous Drug Treatment History">
                {(c) => (
                  <Select
                    {...c}
                    value={previousDrugTreatment}
                    onChange={(e) => setPreviousDrugTreatment(e.target.value)}
                    placeholder="Select Option"
                    options={YES_NO}
                  />
                )}
              </FormField>
            </FormSection>

            {previousDrugTreatment === "Yes" && (
              <FormSection title="Previous Treatment Details" columns={3}>
                <FormField label="Year of Last Treatment">
                  {(c) => (
                    <Select
                      {...c}
                      value={prevTreatmentYear}
                      onChange={(e) => setPrevTreatmentYear(e.target.value)}
                      placeholder="Select Year"
                      options={TREATMENT_YEARS}
                    />
                  )}
                </FormField>
                <FormField label="Duration of Treatment (in days)">
                  {(c) => (
                    <Input
                      {...c}
                      type="number"
                      min={1}
                      value={prevTreatmentDuration}
                      onChange={(e) => setPrevTreatmentDuration(e.target.value)}
                      placeholder="Days"
                    />
                  )}
                </FormField>
                <FormField label="Name & Place of Treatment Centre">
                  {(c) => (
                    <Input
                      {...c}
                      value={prevTreatmentCenter}
                      onChange={(e) => setPrevTreatmentCenter(e.target.value)}
                      placeholder="Centre name & city"
                    />
                  )}
                </FormField>
              </FormSection>
            )}

            <FormSection title="Current Relapse Context" columns={1}>
              <FormField label="Types of Treatment Received in Past">
                {() => (
                  <MultiSelectChips
                    options={TREATMENT_RECEIVED_TYPES}
                    selectedValues={treatmentReceivedTypes}
                    onChange={setTreatmentReceivedTypes}
                    ariaLabel="Types of Treatment Received in Past"
                  />
                )}
              </FormField>

              <div className="grid gap-4 md:grid-cols-2">
                <FormField label="Reason for Current Relapse">
                  {(c) => (
                    <Select
                      {...c}
                      value={relapseReason}
                      onChange={(e) => setRelapseReason(e.target.value)}
                      placeholder="Select Relapse Reason"
                      options={RELAPSE_REASONS}
                    />
                  )}
                </FormField>
                {relapseReason === "Others-specify" && (
                  <FormField label="Reason for Current Relapse (specify)">
                    {(c) => (
                      <Input
                        {...c}
                        value={relapseReasonOther}
                        onChange={(e) => setRelapseReasonOther(e.target.value)}
                        placeholder="Specify the relapse reason"
                      />
                    )}
                  </FormField>
                )}
              </div>
            </FormSection>
          </div>
        )}

        {activeTab === 1 && (
          <div className="flex flex-col gap-6">
            <div>
              <h2 id="dosage-log-heading" className="text-base font-semibold text-navy">Medication &amp; Dosage Log</h2>
              <p className="text-xs text-ink-muted mt-1">
                Record medication changes during the treatment period — each entry gets its own card. Dates must be on or after the registration date.
              </p>
            </div>

            <ol className="flex flex-col gap-4" aria-labelledby="dosage-log-heading">
              {dosageLog.map((row, idx) => (
                <li key={idx} className="rounded-xl border border-line bg-surface-muted/50 p-4 sm:p-5">
                  {/* Card header: entry number + remove */}
                  <div className="mb-4 flex items-center justify-between gap-2">
                    <span className="inline-flex items-center gap-2 text-sm font-semibold text-navy">
                      <span className="flex h-6 w-6 items-center justify-center rounded-full bg-navy/10 text-xs font-bold text-navy" aria-hidden="true">
                        {idx + 1}
                      </span>
                      Entry {idx + 1}
                    </span>
                    {dosageLog.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeDosageRow(idx)}
                        aria-label={`Remove entry ${idx + 1}`}
                        className="inline-flex h-9 items-center gap-1.5 rounded-lg px-2.5 text-xs font-semibold text-danger-fg hover:bg-danger-fg/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-danger-fg"
                      >
                        <Trash2 className="h-3.5 w-3.5" aria-hidden /> Remove
                      </button>
                    )}
                  </div>

                  {/* Responsive field grid: 1 → 2 columns */}
                  <div className="grid grid-cols-1 gap-x-4 gap-y-4 sm:grid-cols-2">
                    <FormField label="Date" required>
                      {(c) => (
                        <Input {...c} type="date" min={patient.dateOfAdmission} value={row.date} onChange={(e) => updateDosageRow(idx, { date: e.target.value })} />
                      )}
                    </FormField>
                    <div className="hidden sm:block" />
                    <FormField label="Complaints">
                      {(c) => (
                        <Textarea {...c} rows={2} value={row.complaints} onChange={(e) => updateDosageRow(idx, { complaints: e.target.value })} placeholder="Symptoms / complaints" />
                      )}
                    </FormField>
                    <FormField label="Medication">
                      {(c) => (
                        <Textarea {...c} rows={2} value={row.medication} onChange={(e) => updateDosageRow(idx, { medication: e.target.value })} placeholder="Medicine name & dosage" />
                      )}
                    </FormField>
                    <FormField label="Reason for Change">
                      {(c) => (
                        <Textarea {...c} rows={2} value={row.changeReason} onChange={(e) => updateDosageRow(idx, { changeReason: e.target.value })} placeholder="Why changed (if any)" />
                      )}
                    </FormField>
                    <FormField label="Physician Remarks">
                      {(c) => (
                        <Textarea {...c} rows={2} value={row.remarks} onChange={(e) => updateDosageRow(idx, { remarks: e.target.value })} placeholder="Doctor comments" />
                      )}
                    </FormField>
                  </div>
                </li>
              ))}
            </ol>

            <div>
              <Button
                type="button"
                appearance="outlined"
                iconLeft={<Plus className="h-4 w-4" />}
                onClick={addDosageRow}
              >
                Add another entry
              </Button>
            </div>
          </div>
        )}

        {activeTab === 2 && (
          <div className="flex flex-col gap-8">
            <SessionCardList
              title="Individual Counselling Sessions"
              description="Log session dates and core issues dealt with."
              rows={individualCounselling}
              onAdd={addIndividualRow}
              onRemove={removeIndividualRow}
              onUpdate={updateIndividualRow}
              issuesPlaceholder="Cognitive reframing, relapse prevention planning, etc."
            />

            <SessionCardList
              title="Group Therapy Sessions"
              description="Log group therapy session dates and issues dealt with."
              rows={groupCounselling}
              onAdd={addGroupRow}
              onRemove={removeGroupRow}
              onUpdate={updateGroupRow}
              issuesPlaceholder="Peer sharing, coping skills, etc."
            />

            <SessionCardList
              title="Family Intervention & Counselling Sessions"
              description="Log family engagement sessions."
              rows={familyCounselling}
              onAdd={addFamilyRow}
              onRemove={removeFamilyRow}
              onUpdate={updateFamilyRow}
              issuesPlaceholder="Codependency education, communication skills, family dynamics, etc."
            />
          </div>
        )}

        {activeTab === 3 && (
          <div className="flex flex-col gap-6">
            <FormSection title="Referral Services" columns={1}>
              <FormField label="Referrals Given to Other Services">
                {() => (
                  <MultiSelectChips
                    options={REFERRAL_SERVICES}
                    selectedValues={referralServices}
                    onChange={setReferralServices}
                    ariaLabel="Referrals Given to Other Services"
                  />
                )}
              </FormField>

              {referralServices.includes("Others Specify") && (
                <div className="max-w-xl">
                  <FormField label="Referral Service (specify)">
                    {(c) => (
                      <Input
                        {...c}
                        value={referralOtherSpecify}
                        onChange={(e) => setReferralOtherSpecify(e.target.value)}
                        placeholder="Specify the other referral service"
                      />
                    )}
                  </FormField>
                </div>
              )}

              <div className="max-w-xl">
                <FormField label="Referral Remarks">
                  {(c) => (
                    <Textarea
                      {...c}
                      rows={2}
                      value={referralRemark}
                      onChange={(e) => setReferralRemark(e.target.value)}
                      placeholder="Provide specifications or details for selected referrals..."
                    />
                  )}
                </FormField>
              </div>
            </FormSection>

            <div className="flex flex-col gap-4">
              <div>
                <h2 id="home-visits-heading" className="text-base font-semibold text-navy">Details of Home Visits</h2>
                <p className="text-xs text-ink-muted mt-1">Log home visits conducted by staff.</p>
              </div>

              <ol className="flex flex-col gap-3" aria-labelledby="home-visits-heading">
                {homeVisits.map((row, idx) => (
                  <li key={idx} className="rounded-xl border border-line bg-surface-muted/50 p-4">
                    <div className="mb-3 flex items-center justify-between gap-2">
                      <span className="inline-flex items-center gap-2 text-sm font-semibold text-navy">
                        <span className="flex h-6 w-6 items-center justify-center rounded-full bg-navy/10 text-xs font-bold text-navy" aria-hidden="true">
                          {idx + 1}
                        </span>
                        Visit {idx + 1}
                      </span>
                      {homeVisits.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeHomeVisitRow(idx)}
                          aria-label={`Remove visit ${idx + 1}`}
                          className="inline-flex h-9 items-center gap-1.5 rounded-lg px-2.5 text-xs font-semibold text-danger-fg hover:bg-danger-fg/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-danger-fg"
                        >
                          <Trash2 className="h-3.5 w-3.5" aria-hidden /> Remove
                        </button>
                      )}
                    </div>
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      <FormField label="Date of Home Visit">
                        {(c) => <Input {...c} type="date" value={row.date} onChange={(e) => updateHomeVisitRow(idx, { date: e.target.value })} />}
                      </FormField>
                      <div className="hidden sm:block" />
                      <FormField label="Purpose">
                        {(c) => <Textarea {...c} rows={2} value={row.purpose} onChange={(e) => updateHomeVisitRow(idx, { purpose: e.target.value })} placeholder="Reason for visit" />}
                      </FormField>
                      <FormField label="Outcome">
                        {(c) => <Textarea {...c} rows={2} value={row.outcome} onChange={(e) => updateHomeVisitRow(idx, { outcome: e.target.value })} placeholder="Family feedback / observation" />}
                      </FormField>
                    </div>
                  </li>
                ))}
              </ol>
              <div>
                <Button
                  type="button"
                  appearance="outlined"
                  iconLeft={<Plus className="h-4 w-4" />}
                  onClick={addHomeVisitRow}
                >
                  Add Home Visit
                </Button>
              </div>
            </div>
          </div>
        )}

        {activeTab === 4 && (
          <form onSubmit={handleSubmitDischarge} className="flex flex-col gap-6" noValidate>
            {dischargeErrors.size > 0 && (
              <div ref={dischargeErrorRef} tabIndex={-1} className="focus-visible:outline-none">
                <Alert status="error">
                  Please complete {dischargeErrors.size} required field{dischargeErrors.size > 1 ? "s" : ""}:{" "}
                  {[...dischargeErrors]
                    .map((k) => (k === "finalDiagnosis" ? "Final Diagnosis" : "Discharge Date"))
                    .join(", ")}
                  .
                </Alert>
              </div>
            )}
            <FormSection title="Final Medical &amp; Psychiatric Diagnosis" columns={2}>
              <FormField
                label="Final Diagnosis (ICD-11)"
                required
                error={dischargeErrors.has("finalDiagnosis") ? "Final Diagnosis is required." : undefined}
              >
                {(c) => (
                  <Select
                    {...c}
                    value={finalDiagnosis}
                    onChange={(e) => {
                      setFinalDiagnosis(e.target.value);
                      setDischargeErrors((prev) => {
                        const n = new Set(prev);
                        n.delete("finalDiagnosis");
                        return n;
                      });
                    }}
                    placeholder="Select Diagnosis"
                    options={PROVISIONAL_DIAGNOSIS}
                    invalid={dischargeErrors.has("finalDiagnosis")}
                  />
                )}
              </FormField>

              <FormField label="Medical Comorbidity (if any)">
                {(c) => (
                  <Input
                    {...c}
                    value={medicalComorbidity}
                    onChange={(e) => setMedicalComorbidity(e.target.value)}
                    placeholder="e.g. Chronic Liver Disease"
                  />
                )}
              </FormField>

              <FormField label="Psychiatric Comorbidity (if any)">
                {(c) => (
                  <Input
                    {...c}
                    value={psychiatricComorbidity}
                    onChange={(e) => setPsychiatricComorbidity(e.target.value)}
                    placeholder="e.g. Major Depressive Disorder"
                  />
                )}
              </FormField>

              <FormField label="Neurological Condition (if any)">
                {(c) => (
                  <Input
                    {...c}
                    value={neurologicalCondition}
                    onChange={(e) => setNeurologicalCondition(e.target.value)}
                    placeholder="e.g. Peripheral Neuropathy"
                  />
                )}
              </FormField>
            </FormSection>

            <FormSection title="Discharge Planning &amp; Follow-Up" columns={2}>
              <FormField label="Patient's Motivation at Discharge">
                {(c) => (
                  <Select
                    {...c}
                    value={dischargeMotivation}
                    onChange={(e) => setDischargeMotivation(e.target.value)}
                    placeholder="Select Patient's Motivation"
                    options={MOTIVATION_STAGES}
                  />
                )}
              </FormField>

              <FormField
                label="Discharge Date"
                required
                error={dischargeErrors.has("dischargeDate") ? "Discharge Date is required." : undefined}
              >
                {(c) => (
                  <Input
                    {...c}
                    type="date"
                    min={patient.dateOfAdmission}
                    value={dischargeDate}
                    onChange={(e) => {
                      setDischargeDate(e.target.value);
                      setDischargeErrors((prev) => {
                        const n = new Set(prev);
                        n.delete("dischargeDate");
                        return n;
                      });
                    }}
                    invalid={dischargeErrors.has("dischargeDate")}
                  />
                )}
              </FormField>

              <FormField label="Date of Follow-Up" hint="Must be on or before today">
                {(c) => (
                  <Input
                    {...c}
                    type="date"
                    max={new Date().toISOString().slice(0, 10)}
                    value={followUpDate}
                    onChange={(e) => setFollowUpDate(e.target.value)}
                  />
                )}
              </FormField>
            </FormSection>

            <FormSection title="Discharge Notes &amp; Medications" columns={1}>
              <div className="max-w-xl">
                <FormField label="Medications Prescribed at Discharge">
                  {(c) => (
                    <Textarea
                      {...c}
                      rows={3}
                      value={dischargeMedication}
                      onChange={(e) => setDischargeMedication(e.target.value)}
                      placeholder="List prescription details for post-discharge care..."
                    />
                  )}
                </FormField>
              </div>

              <div className="max-w-xl">
                <FormField label="Remarks at Discharge">
                  {(c) => (
                    <Textarea
                      {...c}
                      rows={3}
                      value={dischargeRemark}
                      onChange={(e) => setDischargeRemark(e.target.value)}
                      placeholder="Physician and counsellor final remarks..."
                    />
                  )}
                </FormField>
              </div>
            </FormSection>

            <div className="flex justify-end border-t border-line pt-4">
              <Button type="submit" iconLeft={<FileText className="h-4 w-4" />}>
                Complete Clinical Record &amp; Discharge
              </Button>
            </div>
          </form>
        )}
      </div>
      </TabPanel>

      {/* Navigation Buttons */}
      <div className="flex justify-between border-t border-line pt-4 bg-white p-4 rounded-xl border">
        <Button
          type="button"
          appearance="outlined"
          disabled={activeTab === 0}
          iconLeft={<ChevronLeft className="h-4 w-4" />}
          onClick={() => {
            handleSaveTab(false);
            setActiveTab((t) => Math.max(t - 1, 0));
          }}
        >
          Previous Tab
        </Button>

        {activeTab < TAB_DEFS.length - 1 ? (
          <Button
            type="button"
            iconRight={<ChevronRight className="h-4 w-4" />}
            onClick={() => handleSaveTab(true)}
          >
            Save &amp; Next
          </Button>
        ) : (
          <Button
            type="button"
            appearance="filled"
            iconLeft={<FileText className="h-4 w-4" />}
            onClick={handleSubmitDischarge}
          >
            Discharge Patient
          </Button>
        )}
      </div>
    </div>
  );
}
