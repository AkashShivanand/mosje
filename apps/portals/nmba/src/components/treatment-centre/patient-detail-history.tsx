"use client";

import * as React from "react";
import type { Beneficiary, Patient } from "@/lib/treatment-centre/types";

/**
 * Read-only "Patient Detail History" view — mirrors the legacy NMBA treatment-centre
 * consolidated record modal (green section bands + label/value grid). Shared by the
 * IRCA patient list and the ODIC beneficiary list. Renders only the sections that
 * carry data, so a freshly-registered (un-discharged) record degrades gracefully.
 */

function DetailSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="overflow-hidden rounded-lg border border-line">
      <h3 className="bg-navy px-4 py-2.5 text-sm font-semibold text-white">{title}</h3>
      <dl className="grid grid-cols-1 gap-px bg-line sm:grid-cols-2 lg:grid-cols-4">{children}</dl>
    </section>
  );
}

function DetailRow({ label, value, wide = false }: { label: string; value?: React.ReactNode; wide?: boolean }) {
  const empty = value == null || value === "";
  return (
    <div className={`bg-white px-4 py-2.5 ${wide ? "sm:col-span-2 lg:col-span-4" : ""}`}>
      <dt className="text-xs font-medium text-ink-muted">{label}</dt>
      <dd className="mt-0.5 break-words text-sm text-ink">{empty ? "—" : value}</dd>
    </div>
  );
}

function DetailTable({
  caption,
  headers,
  rows,
}: {
  caption: string;
  headers: string[];
  rows: Array<Array<React.ReactNode>>;
}) {
  if (rows.length === 0) return null;
  return (
    <section className="overflow-hidden rounded-lg border border-line">
      <h3 className="bg-navy px-4 py-2.5 text-sm font-semibold text-white">{caption}</h3>
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="bg-brandwash text-left text-xs font-semibold uppercase tracking-wide text-navy">
              {headers.map((h) => (
                <th key={h} scope="col" className="px-4 py-2.5">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-line">
            {rows.map((cells, i) => (
              <tr key={i} className="align-top">
                {cells.map((c, j) => (
                  <td key={j} className="px-4 py-2.5 text-ink">
                    {c == null || c === "" ? "—" : c}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

const list = (arr?: string[]) => (arr && arr.length ? arr.join(", ") : "");

/** Full read-only history for an IRCA clinical patient. */
export function PatientDetailHistory({ patient: p }: { patient: Patient }) {
  const drugRows = (p.drugUse ?? []).filter((d) => d.drug);
  const dosage = (p.dosageLog ?? []).filter((d) => d.date || d.medication);
  const individual = (p.individualCounselling ?? []).filter((c) => c.date || c.issues);
  const group = (p.groupCounselling ?? []).filter((c) => c.date || c.issues);
  const family = (p.familyCounselling ?? []).filter((c) => c.date || c.issues);
  const visits = (p.homeVisits ?? []).filter((h) => h.date || h.purpose);
  const clinical = Object.entries(p.clinicalDetails ?? {});
  const hasHistory =
    list(p.withdrawalSymptoms) ||
    list(p.psychiatricSymptoms) ||
    list(p.chronicProblems) ||
    list(p.otherMedicalProblems) ||
    p.headInjury ||
    p.previousDrugTreatment ||
    list(p.treatmentReceivedTypes) ||
    p.relapseReason;
  const hasDischarge =
    p.finalDiagnosis || p.dischargeDate || p.dischargeMotivation || p.dischargeMedication || p.dischargeRemark;

  return (
    <div className="flex flex-col gap-5">
      <DetailSection title="Patient Basic Details">
        <DetailRow label="Registration Number" value={p.registrationNumber} />
        <DetailRow label="Date of Registration" value={p.dateOfAdmission} />
        <DetailRow label="Name of the Patient" value={p.name} />
        <DetailRow label="Contact Number" value={p.contactNumber} />
        <DetailRow label="Age" value={p.age} />
        <DetailRow label="Gender" value={p.gender} />
        <DetailRow label="Category" value={p.category} />
        <DetailRow label="Place of Residence" value={p.placeOfResidence} />
        <DetailRow label="State" value={p.state} />
        <DetailRow label="District" value={p.district} />
        <DetailRow label="Marital Status" value={p.maritalStatus} />
        <DetailRow label="Living Arrangement" value={p.livingArrangements} />
        <DetailRow label="Employment Status" value={p.employment} />
        <DetailRow label="Income (Monthly)" value={p.income} />
        <DetailRow label="Educational Status" value={p.education} />
        <DetailRow label="Occupational Status" value={p.occupation} />
        <DetailRow
          label="Government ID"
          value={p.governmentId ? `${p.governmentId}${p.governmentIdNumber ? ` — ${p.governmentIdNumber}` : ""}` : ""}
        />
        <DetailRow label="Treatment Centre" value={p.treatmentCenter} />
        <DetailRow label="Current Address" value={p.currentAddress} wide />
        <DetailRow label="Permanent Address" value={p.permanentAddress} wide />
      </DetailSection>

      <DetailTable
        caption="Drug Use Details"
        headers={["Drug", "Age of First Use", "Reason for Initiation/Use", "Use in Last 3 Months", "Daily/Near Daily", "Duration (months)"]}
        rows={drugRows.map((d) => [d.drug, d.ageOfFirstUse, d.reason, d.usedLast3Months, d.dailyUse, d.durationMonths])}
      />

      {clinical.length > 0 && (
        <DetailSection title="Behaviour, Testing, Assessment & Legal History">
          {clinical.map(([label, value]) => (
            <DetailRow key={label} label={label} value={value} />
          ))}
          <DetailRow label="Provisional Diagnosis (ICD-11)" value={p.provisionalDiagnosis} wide />
        </DetailSection>
      )}

      {hasHistory && (
        <DetailSection title="Previous Clinical & Treatment History">
          <DetailRow label="Withdrawal Symptoms in the Past" value={list(p.withdrawalSymptoms)} wide />
          <DetailRow label="Past Psychiatric Symptoms" value={list(p.psychiatricSymptoms)} wide />
          <DetailRow label="History of Chronic Health Problems" value={list(p.chronicProblems)} wide />
          <DetailRow label="History of Other Medical Problems" value={list(p.otherMedicalProblems)} wide />
          <DetailRow label="History of Head Injury" value={p.headInjury} />
          <DetailRow label="Previous Drug Treatment History" value={p.previousDrugTreatment} />
          <DetailRow label="Year of Last Treatment" value={p.prevTreatmentYear} />
          <DetailRow label="Duration of Treatment (days)" value={p.prevTreatmentDuration} />
          <DetailRow label="Name & Place of Treatment Centre" value={p.prevTreatmentCenter} />
          <DetailRow label="Type of Treatment Received" value={list(p.treatmentReceivedTypes)} />
          <DetailRow
            label="Reason for Current Relapse"
            value={p.relapseReason === "Others-specify" && p.relapseReasonOther ? p.relapseReasonOther : p.relapseReason}
          />
        </DetailSection>
      )}

      <DetailTable
        caption="Details of Dosage During the Treatment Period"
        headers={["Date", "Complaints", "Medication", "Reason for Changing Medication", "Remarks by Physician"]}
        rows={dosage.map((d) => [d.date, d.complaints, d.medication, d.changeReason, d.remarks])}
      />

      <DetailTable
        caption="Counselling — Individual Sessions"
        headers={["Session No.", "Date", "Issues Dealt With"]}
        rows={individual.map((c) => [c.sessionNo, c.date, c.issues])}
      />
      <DetailTable
        caption="Counselling — Group Therapy Sessions"
        headers={["Session No.", "Date", "Issues Dealt With"]}
        rows={group.map((c) => [c.sessionNo, c.date, c.issues])}
      />
      <DetailTable
        caption="Counselling — Family Sessions"
        headers={["Session No.", "Date", "Issues Dealt With"]}
        rows={family.map((c) => [c.sessionNo, c.date, c.issues])}
      />

      {(list(p.referralServices) || p.referralRemark || visits.length > 0) && (
        <DetailSection title="Referral Services & Details of Home Visit">
          <DetailRow
            label="Referral Services"
            value={
              p.referralServices?.includes("Others Specify") && p.referralOtherSpecify
                ? `${list(p.referralServices)} (${p.referralOtherSpecify})`
                : list(p.referralServices)
            }
            wide
          />
          <DetailRow label="Referral Remark" value={p.referralRemark} wide />
        </DetailSection>
      )}
      <DetailTable
        caption="Home Visits"
        headers={["Date of Home Visit", "Purpose of Home Visit", "Outcome of Home Visit"]}
        rows={visits.map((h) => [h.date, h.purpose, h.outcome])}
      />

      {hasDischarge && (
        <DetailSection title="Diagnosis & Discharge">
          <DetailRow label="Final Diagnosis (ICD-11)" value={p.finalDiagnosis} wide />
          <DetailRow label="Medical Comorbidity" value={p.medicalComorbidity} />
          <DetailRow label="Psychiatric Comorbidity" value={p.psychiatricComorbidity} />
          <DetailRow label="Neurological Condition" value={p.neurologicalCondition} />
          <DetailRow label="Patient's Motivation at Discharge" value={p.dischargeMotivation} />
          <DetailRow label="Date of Discharge" value={p.dischargeDate} />
          <DetailRow label="Date of Follow-Up" value={p.followUpDate} />
          <DetailRow label="Medication Prescribed at Discharge" value={p.dischargeMedication} wide />
          <DetailRow label="Remark at Discharge" value={p.dischargeRemark} wide />
        </DetailSection>
      )}
    </div>
  );
}

/** Lighter read-only history for an ODIC drop-in / outreach beneficiary. */
export function BeneficiaryDetailHistory({ beneficiary: b }: { beneficiary: Beneficiary }) {
  const drugRows = (b.drugUse ?? []).filter((d) => d.drug);
  const details = Object.entries(b.details ?? {});
  return (
    <div className="flex flex-col gap-5">
      <DetailSection title="Beneficiary Basic Details">
        <DetailRow label="Registration Number" value={b.registrationNumber} />
        <DetailRow label="Date of Registration" value={b.dateOfRegistration} />
        <DetailRow label="Name" value={b.name} />
        <DetailRow label="Contact Number" value={b.contactNumber} />
        <DetailRow label="Age" value={b.age} />
        <DetailRow label="Gender" value={b.gender} />
        <DetailRow label="Category" value={b.category} />
        <DetailRow label="Place of Residence" value={b.placeOfResidence} />
        <DetailRow label="State" value={b.state} />
        <DetailRow label="District" value={b.district} />
        <DetailRow label="Referred By" value={b.referredBy} />
        <DetailRow label="Registration Type" value={b.kind} />
        <DetailRow
          label="Government ID"
          value={b.governmentId ? `${b.governmentId}${b.governmentIdNumber ? ` — ${b.governmentIdNumber}` : ""}` : ""}
        />
      </DetailSection>

      <DetailTable
        caption="Drug Use Details"
        headers={["Drug", "Age of First Use", "Reason for Initiation/Use", "Use in Last 3 Months", "Daily/Near Daily", "Duration (months)"]}
        rows={drugRows.map((d) => [d.drug, d.ageOfFirstUse, d.reason, d.usedLast3Months, d.dailyUse, d.durationMonths])}
      />

      {details.length > 0 && (
        <DetailSection title="Additional Details">
          {details.map(([label, value]) => (
            <DetailRow key={label} label={label} value={value} />
          ))}
        </DetailSection>
      )}
    </div>
  );
}
