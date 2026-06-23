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
  Checkbox,
  Radio,
  Alert,
  Chip,
  type SelectOption,
} from "@mosje/design-system";
import { useToast } from "@/components/toast";
import { useTCStore } from "@/lib/treatment-centre/store";
import { FormSection } from "@/components/treatment-centre/tc-form";
import type { Patient } from "@/lib/treatment-centre/types";
import {
  YES_NO,
  PROVISIONAL_DIAGNOSIS,
} from "@/lib/treatment-centre/master-data";

// Options
const WITHDRAWAL_SYMPTOMS = ["Tremors", "Insomnia", "Nausea", "Aches and Pains", "Hallucinations", "Delirium", "Nil"];
const PSYCHIATRIC_SYMPTOMS = ["Depression", "Suicidal Ideations and Attempts", "Confusion", "Aggressive Outbursts", "Hallucinations", "Nil"];
const CHRONIC_PROBLEMS = ["Diabetes", "Liver Disorders", "Respiratory Problems (Pulmonary TB)", "Cardiac Problems", "Infections", "Nil"];
const OTHER_MEDICAL_PROBLEMS = ["Haematemesis", "Jaundice", "Abscesses", "Bleeding Piles", "Skin Problems", "Nil"];
const TREATMENT_RECEIVED_TYPES = ["Pharmacological", "Psychosocial", "Family Intervention", "Vocational Training", "Mindfulness"];
const RELAPSE_REASONS: SelectOption[] = [
  { label: "Peer Pressure", value: "peer-pressure" },
  { label: "Craving", value: "craving" },
  { label: "Stress / Family Conflict", value: "stress" },
  { label: "Easy Availability of Drugs", value: "availability" },
  { label: "Boredom / Idle Time", value: "boredom" },
  { label: "Other", value: "other" },
];
const REFERRAL_SERVICES = [
  "NACO – One Stop Centre",
  "Vocational Training Centre",
  "Tertiary Hospital for Medical Care",
  "Narcotics Anonymous",
  "Alcoholic Anonymous",
  "Others Specify",
];
const DISCHARGE_MOTIVATION: SelectOption[] = [
  { label: "Low", value: "low" },
  { label: "Moderate", value: "moderate" },
  { label: "High", value: "high" },
];

const TABS = [
  "Previous History",
  "Medication Dosage",
  "Counselling Sessions",
  "Referral & Home Visits",
  "Diagnosis & Discharge",
];

function MultiSelectChips({
  options,
  selectedValues,
  onChange,
}: {
  options: string[];
  selectedValues: string[];
  onChange: (vals: string[]) => void;
}) {
  return (
    <div className="flex flex-wrap gap-2">
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

export default function ClinicalWizardPage() {
  const params = useParams();
  const id = params.id as string;
  const store = useTCStore();
  const router = useRouter();
  const { toast } = useToast();

  const patient = store.patients.find((p) => p.id === id);

  // Core wizard states
  const [activeTab, setActiveTab] = React.useState(0);

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

  // Tab 2 States
  const [dosageLog, setDosageLog] = React.useState<
    Array<{ date: string; complaints: string; medication: string; changeReason: string; remarks: string }>
  >(patient?.dosageLog || [{ date: "", complaints: "", medication: "", changeReason: "", remarks: "" }]);

  // Tab 3 States
  const [individualCounselling, setIndividualCounselling] = React.useState<
    Array<{ sessionNo: string; date: string; issues: string }>
  >(patient?.individualCounselling || [{ sessionNo: "1", date: "", issues: "" }]);
  const [familyCounselling, setFamilyCounselling] = React.useState<
    Array<{ sessionNo: string; date: string; issues: string }>
  >(patient?.familyCounselling || [{ sessionNo: "1", date: "", issues: "" }]);

  // Tab 4 States
  const [referralServices, setReferralServices] = React.useState<string[]>(patient?.referralServices || []);
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

  if (!patient) {
    return (
      <div className="p-8 text-center">
        <h1 className="text-xl font-bold text-ink">Patient not found</h1>
        <p className="text-sm text-ink-muted mt-2">The patient record you are looking for does not exist.</p>
        <Link
          href="/treatment-centre/irca/patients"
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
          familyCounselling: familyCounselling.filter((c) => c.date || c.issues),
          registrationProgress: patient.registrationProgress === "Pending" ? "In Progress" : patient.registrationProgress,
        };
      case 3:
        return {
          referralServices,
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
      setActiveTab((t) => Math.min(t + 1, TABS.length - 1));
    }
  };

  const handleSubmitDischarge = (e: React.FormEvent) => {
    e.preventDefault();
    const payload = getTabPayload();
    
    // Ensure final diagnosis and discharge date are entered before complete
    if (!finalDiagnosis) {
      toast("Final Diagnosis is required.", "error");
      return;
    }
    if (!dischargeDate) {
      toast("Discharge Date is required.", "error");
      return;
    }

    store.updatePatient(patient.id, {
      ...payload,
      registrationProgress: "Completed",
    });

    toast("Patient clinical record completed & discharged.", "success");
    router.push("/treatment-centre/irca/patients");
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
              href="/treatment-centre/irca/patients"
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

      {/* Tabs */}
      <div className="flex border-b border-line overflow-x-auto bg-white rounded-lg p-1 border">
        {TABS.map((t, idx) => (
          <button
            key={t}
            type="button"
            onClick={() => {
              // Auto-save previous tab before moving
              handleSaveTab(false);
              setActiveTab(idx);
            }}
            className={`flex-1 min-w-[150px] text-center px-4 py-2.5 text-xs font-semibold rounded-md transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-navy ${
              activeTab === idx
                ? "bg-navy text-white shadow-sm"
                : "text-ink-muted hover:text-ink hover:bg-black/5"
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {/* Form content */}
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
                  />
                )}
              </FormField>

              <FormField label="Past Psychiatric Symptoms">
                {() => (
                  <MultiSelectChips
                    options={PSYCHIATRIC_SYMPTOMS}
                    selectedValues={psychiatricSymptoms}
                    onChange={setPsychiatricSymptoms}
                  />
                )}
              </FormField>

              <FormField label="History of Chronic Health Problems">
                {() => (
                  <MultiSelectChips
                    options={CHRONIC_PROBLEMS}
                    selectedValues={chronicProblems}
                    onChange={setChronicProblems}
                  />
                )}
              </FormField>

              <FormField label="History of Other Medical Problems">
                {() => (
                  <MultiSelectChips
                    options={OTHER_MEDICAL_PROBLEMS}
                    selectedValues={otherMedicalProblems}
                    onChange={setOtherMedicalProblems}
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
                    <Input
                      {...c}
                      type="number"
                      min={1990}
                      max={new Date().getFullYear()}
                      value={prevTreatmentYear}
                      onChange={(e) => setPrevTreatmentYear(e.target.value)}
                      placeholder="YYYY"
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
                  />
                )}
              </FormField>

              <div className="max-w-md">
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
              </div>
            </FormSection>
          </div>
        )}

        {activeTab === 1 && (
          <div className="flex flex-col gap-6">
            <div>
              <h2 className="text-base font-semibold text-navy">Medication &amp; Dosage Log</h2>
              <p className="text-xs text-ink-muted mt-1">
                Record medication changes and complaints during the treatment period. Medication dates must be after registration date.
              </p>
            </div>

            <div className="overflow-x-auto border border-line rounded-lg">
              <table className="min-w-full text-sm">
                <thead>
                  <tr className="bg-brandwash text-left text-xs font-semibold uppercase tracking-wide text-navy">
                    <th scope="col" className="px-4 py-3">Date *</th>
                    <th scope="col" className="px-4 py-3">Complaints</th>
                    <th scope="col" className="px-4 py-3">Medication</th>
                    <th scope="col" className="px-4 py-3">Reason for Change</th>
                    <th scope="col" className="px-4 py-3">Physician Remarks</th>
                    <th scope="col" className="px-4 py-3 w-16"><span className="sr-only">Actions</span></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-line">
                  {dosageLog.map((row, idx) => (
                    <tr key={idx} className="align-top hover:bg-black/[0.01]">
                      <td className="px-3 py-2 min-w-[150px]">
                        <Input
                          aria-label={`Medication date row ${idx + 1}`}
                          type="date"
                          min={patient.dateOfAdmission}
                          value={row.date}
                          onChange={(e) => updateDosageRow(idx, { date: e.target.value })}
                        />
                      </td>
                      <td className="px-3 py-2">
                        <Input
                          aria-label={`Complaints row ${idx + 1}`}
                          value={row.complaints}
                          onChange={(e) => updateDosageRow(idx, { complaints: e.target.value })}
                          placeholder="Symptoms/complaints"
                        />
                      </td>
                      <td className="px-3 py-2">
                        <Input
                          aria-label={`Medication row ${idx + 1}`}
                          value={row.medication}
                          onChange={(e) => updateDosageRow(idx, { medication: e.target.value })}
                          placeholder="Medicine name &amp; dosage"
                        />
                      </td>
                      <td className="px-3 py-2">
                        <Input
                          aria-label={`Reason for changing row ${idx + 1}`}
                          value={row.changeReason}
                          onChange={(e) => updateDosageRow(idx, { changeReason: e.target.value })}
                          placeholder="Why changed (if any)"
                        />
                      </td>
                      <td className="px-3 py-2">
                        <Input
                          aria-label={`Physician remarks row ${idx + 1}`}
                          value={row.remarks}
                          onChange={(e) => updateDosageRow(idx, { remarks: e.target.value })}
                          placeholder="Doctor comments"
                        />
                      </td>
                      <td className="px-3 py-2 text-center">
                        <button
                          type="button"
                          onClick={() => removeDosageRow(idx)}
                          aria-label={`Remove dosage row ${idx + 1}`}
                          className="inline-flex h-9 w-9 items-center justify-center rounded text-danger-fg hover:bg-black/5"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div>
              <Button
                type="button"
                appearance="outlined"
                iconLeft={<Plus className="h-4 w-4" />}
                onClick={addDosageRow}
              >
                Add Row
              </Button>
            </div>
          </div>
        )}

        {activeTab === 2 && (
          <div className="flex flex-col gap-8">
            {/* Individual Counselling */}
            <div className="flex flex-col gap-4">
              <div>
                <h2 className="text-base font-semibold text-navy">Individual Counselling Sessions</h2>
                <p className="text-xs text-ink-muted mt-1">Log session dates and core issues dealt with.</p>
              </div>

              <div className="overflow-x-auto border border-line rounded-lg">
                <table className="min-w-full text-sm">
                  <thead>
                    <tr className="bg-brandwash text-left text-xs font-semibold uppercase tracking-wide text-navy">
                      <th scope="col" className="px-4 py-3 w-28">Session No.</th>
                      <th scope="col" className="px-4 py-3 w-48">Date</th>
                      <th scope="col" className="px-4 py-3">Issues Dealt With</th>
                      <th scope="col" className="px-4 py-3 w-16"><span className="sr-only">Actions</span></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-line">
                    {individualCounselling.map((row, idx) => (
                      <tr key={idx} className="align-top hover:bg-black/[0.01]">
                        <td className="px-4 py-3 font-semibold text-navy vertical-align-middle">
                          {row.sessionNo}
                        </td>
                        <td className="px-3 py-2">
                          <Input
                            aria-label={`Individual Session date row ${idx + 1}`}
                            type="date"
                            value={row.date}
                            onChange={(e) => updateIndividualRow(idx, { date: e.target.value })}
                          />
                        </td>
                        <td className="px-3 py-2">
                          <Input
                            aria-label={`Individual Session issues row ${idx + 1}`}
                            value={row.issues}
                            onChange={(e) => updateIndividualRow(idx, { issues: e.target.value })}
                            placeholder="Cognitive reframing, relapse prevention planning, etc."
                          />
                        </td>
                        <td className="px-3 py-2 text-center">
                          <button
                            type="button"
                            onClick={() => removeIndividualRow(idx)}
                            aria-label={`Remove session ${row.sessionNo}`}
                            className="inline-flex h-9 w-9 items-center justify-center rounded text-danger-fg hover:bg-black/5"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div>
                <Button
                  type="button"
                  appearance="outlined"
                  iconLeft={<Plus className="h-4 w-4" />}
                  onClick={addIndividualRow}
                >
                  Add Session
                </Button>
              </div>
            </div>

            {/* Family Counselling */}
            <div className="flex flex-col gap-4">
              <div>
                <h2 className="text-base font-semibold text-navy">Family Intervention &amp; Counselling Sessions</h2>
                <p className="text-xs text-ink-muted mt-1">Log family engagement sessions.</p>
              </div>

              <div className="overflow-x-auto border border-line rounded-lg">
                <table className="min-w-full text-sm">
                  <thead>
                    <tr className="bg-brandwash text-left text-xs font-semibold uppercase tracking-wide text-navy">
                      <th scope="col" className="px-4 py-3 w-28">Session No.</th>
                      <th scope="col" className="px-4 py-3 w-48">Date</th>
                      <th scope="col" className="px-4 py-3">Issues Dealt With</th>
                      <th scope="col" className="px-4 py-3 w-16"><span className="sr-only">Actions</span></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-line">
                    {familyCounselling.map((row, idx) => (
                      <tr key={idx} className="align-top hover:bg-black/[0.01]">
                        <td className="px-4 py-3 font-semibold text-navy vertical-align-middle">
                          {row.sessionNo}
                        </td>
                        <td className="px-3 py-2">
                          <Input
                            aria-label={`Family Session date row ${idx + 1}`}
                            type="date"
                            value={row.date}
                            onChange={(e) => updateFamilyRow(idx, { date: e.target.value })}
                          />
                        </td>
                        <td className="px-3 py-2">
                          <Input
                            aria-label={`Family Session issues row ${idx + 1}`}
                            value={row.issues}
                            onChange={(e) => updateFamilyRow(idx, { issues: e.target.value })}
                            placeholder="Codependency education, communication skills, family dynamics, etc."
                          />
                        </td>
                        <td className="px-3 py-2 text-center">
                          <button
                            type="button"
                            onClick={() => removeFamilyRow(idx)}
                            aria-label={`Remove session ${row.sessionNo}`}
                            className="inline-flex h-9 w-9 items-center justify-center rounded text-danger-fg hover:bg-black/5"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div>
                <Button
                  type="button"
                  appearance="outlined"
                  iconLeft={<Plus className="h-4 w-4" />}
                  onClick={addFamilyRow}
                >
                  Add Session
                </Button>
              </div>
            </div>
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
                  />
                )}
              </FormField>

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
                <h2 className="text-base font-semibold text-navy">Details of Home Visits</h2>
                <p className="text-xs text-ink-muted mt-1">Log home visits conducted by staff.</p>
              </div>

              <div className="overflow-x-auto border border-line rounded-lg">
                <table className="min-w-full text-sm">
                  <thead>
                    <tr className="bg-brandwash text-left text-xs font-semibold uppercase tracking-wide text-navy">
                      <th scope="col" className="px-4 py-3 w-48">Date of Home Visit</th>
                      <th scope="col" className="px-4 py-3">Purpose</th>
                      <th scope="col" className="px-4 py-3">Outcome</th>
                      <th scope="col" className="px-4 py-3 w-16"><span className="sr-only">Actions</span></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-line">
                    {homeVisits.map((row, idx) => (
                      <tr key={idx} className="align-top hover:bg-black/[0.01]">
                        <td className="px-3 py-2">
                          <Input
                            aria-label={`Home visit date row ${idx + 1}`}
                            type="date"
                            value={row.date}
                            onChange={(e) => updateHomeVisitRow(idx, { date: e.target.value })}
                          />
                        </td>
                        <td className="px-3 py-2">
                          <Input
                            aria-label={`Home visit purpose row ${idx + 1}`}
                            value={row.purpose}
                            onChange={(e) => updateHomeVisitRow(idx, { purpose: e.target.value })}
                            placeholder="Reason for visit"
                          />
                        </td>
                        <td className="px-3 py-2">
                          <Input
                            aria-label={`Home visit outcome row ${idx + 1}`}
                            value={row.outcome}
                            onChange={(e) => updateHomeVisitRow(idx, { outcome: e.target.value })}
                            placeholder="Family feedback/observation"
                          />
                        </td>
                        <td className="px-3 py-2 text-center">
                          <button
                            type="button"
                            onClick={() => removeHomeVisitRow(idx)}
                            aria-label={`Remove home visit row ${idx + 1}`}
                            className="inline-flex h-9 w-9 items-center justify-center rounded text-danger-fg hover:bg-black/5"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
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
          <form onSubmit={handleSubmitDischarge} className="flex flex-col gap-6">
            <FormSection title="Final Medical &amp; Psychiatric Diagnosis" columns={2}>
              <FormField label="Final Diagnosis (ICD-11)" required>
                {(c) => (
                  <Select
                    {...c}
                    value={finalDiagnosis}
                    onChange={(e) => setFinalDiagnosis(e.target.value)}
                    placeholder="Select Diagnosis"
                    options={PROVISIONAL_DIAGNOSIS}
                    required
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
                    placeholder="Select Motivation Level"
                    options={DISCHARGE_MOTIVATION}
                  />
                )}
              </FormField>

              <FormField label="Discharge Date" required>
                {(c) => (
                  <Input
                    {...c}
                    type="date"
                    min={patient.dateOfAdmission}
                    value={dischargeDate}
                    onChange={(e) => setDischargeDate(e.target.value)}
                    required
                  />
                )}
              </FormField>

              <FormField label="Scheduled Follow-Up Date">
                {(c) => (
                  <Input
                    {...c}
                    type="date"
                    min={dischargeDate || patient.dateOfAdmission}
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

        {activeTab < TABS.length - 1 ? (
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
