"use client";

import * as React from "react";
import type { Beneficiary, Patient } from "@/lib/nmba/treatment-centre/types";

/**
 * Read-only "Patient Detail History" view — mirrors the legacy NMBA treatment-centre
 * consolidated record modal (navy section bands + label/value grid + repeating
 * tables). Shared by the IRCA patient list and the ODIC beneficiary list.
 *
 * Two design goals, matching the legacy record exactly:
 *  1. COVERAGE — every field the legacy modal shows is rendered: basic details,
 *     drug-use, substance-use/risk behaviour, the criminal/legal Ever/Last-month
 *     matrix, family history, dosage, the three counselling streams, referral &
 *     home visits, and diagnosis/discharge.
 *  2. SCALABILITY — every repeating group (drug use, dosage, counselling, home
 *     visits) renders as a numbered table that grows to N entries, with a live
 *     entry-count in its caption. Sections with no data are hidden so a
 *     freshly-registered (un-discharged) record degrades gracefully.
 */

function DetailSection({
  title,
  cols = 4,
  children,
}: {
  title: string;
  cols?: 2 | 4;
  children: React.ReactNode;
}) {
  const grid =
    cols === 2 ? "grid-cols-1 sm:grid-cols-2" : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4";
  return (
    <section className="overflow-hidden rounded-lg border border-line">
      <h3 className="bg-navy px-4 py-2.5 text-sm font-semibold text-white">{title}</h3>
      <dl className={`grid gap-px bg-line ${grid}`}>{children}</dl>
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

/**
 * Numbered, count-aware repeating table — the workhorse for scalable groups.
 * Returns null when there are no rows so empty sections never render.
 */
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
      <h3 className="flex items-center justify-between gap-2 bg-navy px-4 py-2.5 text-sm font-semibold text-white">
        <span>{caption}</span>
        <span className="rounded-full bg-white/15 px-2 py-0.5 text-xs font-medium tabular-nums">
          {rows.length} {rows.length === 1 ? "entry" : "entries"}
        </span>
      </h3>
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="bg-brandwash text-left text-xs font-semibold uppercase tracking-wide text-navy">
              <th scope="col" className="px-4 py-2.5 w-14">
                S.No.
              </th>
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
                <td className="px-4 py-2.5 font-medium tabular-nums text-ink-muted">{i + 1}</td>
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

/** The criminal/legal Ever vs. Last-One-Month matrix from the legacy record. */
function MatrixTable({
  caption,
  rows,
  footnote,
}: {
  caption: string;
  rows: Array<{ reason: string; ever?: string; lastMonth?: string }>;
  footnote?: { label: string; value?: string };
}) {
  return (
    <section className="overflow-hidden rounded-lg border border-line">
      <h3 className="bg-navy px-4 py-2.5 text-sm font-semibold text-white">{caption}</h3>
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="bg-brandwash text-left text-xs font-semibold uppercase tracking-wide text-navy">
              <th scope="col" className="px-4 py-2.5">
                Reason
              </th>
              <th scope="col" className="px-4 py-2.5 w-40">
                Ever
              </th>
              <th scope="col" className="px-4 py-2.5 w-40">
                Last One Month
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line">
            {rows.map((r) => (
              <tr key={r.reason} className="align-top">
                <th scope="row" className="px-4 py-2.5 text-left font-medium text-ink">
                  {r.reason}
                </th>
                <td className="px-4 py-2.5 text-ink">{r.ever || "—"}</td>
                <td className="px-4 py-2.5 text-ink">{r.lastMonth || "—"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {footnote && footnote.value ? (
        <div className="border-t border-line bg-white px-4 py-2.5">
          <dt className="text-xs font-medium text-ink-muted">{footnote.label}</dt>
          <dd className="mt-0.5 break-words text-sm text-ink">{footnote.value}</dd>
        </div>
      ) : null}
    </section>
  );
}

const list = (arr?: string[]) => (arr && arr.length ? arr.join(", ") : "");

/**
 * Ordered (legacy label → clinicalDetails key) map for the Substance Use & Risk
 * Behaviour block. Keys match the register form's submit mapping exactly.
 */
const SUBSTANCE_FIELDS: Array<[label: string, key: string]> = [
  ["Intravenous Drug Use Ever", "IV drug use (ever)"],
  ["Intravenous Drug in Last 3 Months", "IV drug use (last 3 months)"],
  ["Sharing Needles/Syringes Ever", "Shared needles (ever)"],
  ["Sharing Needles (Last 3 Months)", "Shared needles (last 3 months)"],
  ["Sexual Practices", "Sexual practices"],
  ["Ever had HCV Testing", "HCV test history"],
  ["Result of HCV Test", "HCV result"],
  ["Ever had HBV Testing", "HBV test history"],
  ["Result of HBV Test", "HBV result"],
  ["ASSIST Score for Alcohol Use", "ASSIST score (alcohol)"],
  ["ASSIST Score for Other Drugs", "ASSIST score (other drugs)"],
  ["Previous Treatment for Substance Use", "Previous treatment"],
  ["If Yes, Treatment Taken From", "Treatment taken from"],
  ["Source of Referral", "Source of referral"],
  ["Ever Hospitalised for Substance Use", "Ever hospitalised"],
  ["Average Daily Expenditure on Drugs (₹)", "Avg. daily expenditure (₹)"],
  ["Source of Money for Drug Use", "Source of money"],
  ["Ever Apprehended by Police", "Ever apprehended"],
];

/** Criminal/legal matrix: (reason → ever-key, last-month-key). */
const LEGAL_MATRIX: Array<[reason: string, everKey: string, lastKey: string]> = [
  ["For Selling", "Apprehended — for selling (ever)", "Apprehended — for selling (last month)"],
  ["For Possession", "Apprehended — for possession (ever)", "Apprehended — for possession (last month)"],
  [
    "For Unruly Behaviour Under the Influence",
    "Apprehended — unruly behaviour (ever)",
    "Apprehended — unruly behaviour (last month)",
  ],
  ["Any Other Crime (e.g. stealing)", "Apprehended — other crime (ever)", "Apprehended — other crime (last month)"],
];

/** Full read-only history for an IRCA clinical patient. */
export function PatientDetailHistory({ patient: p }: { patient: Patient }) {
  const cd = (key: string) => p.clinicalDetails?.[key];

  const drugRows = (p.drugUse ?? []).filter((d) => d.drug);
  const dosage = (p.dosageLog ?? []).filter((d) => d.date || d.medication || d.complaints);
  const individual = (p.individualCounselling ?? []).filter((c) => c.date || c.issues);
  const group = (p.groupCounselling ?? []).filter((c) => c.date || c.issues);
  const family = (p.familyCounselling ?? []).filter((c) => c.date || c.issues);
  const visits = (p.homeVisits ?? []).filter((h) => h.date || h.purpose || h.outcome);

  const hasClinical = !!p.clinicalDetails && Object.keys(p.clinicalDetails).length > 0;
  const hasLegal = LEGAL_MATRIX.some(([, e, l]) => cd(e) || cd(l)) || !!cd("Other crime (specify)");

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
    p.finalDiagnosis ||
    p.dischargeDate ||
    p.dischargeMotivation ||
    p.dischargeMedication ||
    p.dischargeRemark ||
    p.medicalComorbidity ||
    p.psychiatricComorbidity ||
    p.neurologicalCondition ||
    p.followUpDate;

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
        headers={[
          "Drug Name",
          "Age of First Use",
          "Reason of Initiation/Use",
          "Use in Last 3 Months",
          "Daily/Near Daily Use",
          "Duration of Regular Use (Monthly)",
        ]}
        rows={drugRows.map((d) => [d.drug, d.ageOfFirstUse, d.reason, d.usedLast3Months, d.dailyUse, d.durationMonths])}
      />

      {hasClinical && (
        <DetailSection title="Substance Use & Risk Behaviour" cols={2}>
          {SUBSTANCE_FIELDS.map(([label, key]) => (
            <DetailRow key={key} label={label} value={cd(key)} />
          ))}
        </DetailSection>
      )}

      {hasLegal && (
        <MatrixTable
          caption="Ever Apprehended by Police for Drug-related Offence"
          rows={LEGAL_MATRIX.map(([reason, everKey, lastKey]) => ({
            reason,
            ever: cd(everKey),
            lastMonth: cd(lastKey),
          }))}
          footnote={{ label: "Please specify (in case of any other crime)", value: cd("Other crime (specify)") }}
        />
      )}

      {(hasClinical || p.provisionalDiagnosis) && (
        <DetailSection title="Family History, Motivation & Diagnosis" cols={2}>
          <DetailRow label="Any History of Substance Use in the Family" value={cd("Family history of substance use")} />
          <DetailRow label="Days Since Substance Last Consumed" value={cd("Days since last use")} />
          <DetailRow label="Patient's Motivation at the Time of Admission" value={cd("Motivation at admission")} />
          <DetailRow label="Provisional Diagnosis (as per ICD-11)" value={p.provisionalDiagnosis} />
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
        headers={["Date of Medication", "Complaints", "Medication", "Reason for Changing Medication", "Remarks by Physician"]}
        rows={dosage.map((d) => [d.date, d.complaints, d.medication, d.changeReason, d.remarks])}
      />

      <DetailTable
        caption="Individual Counselling"
        headers={["Counselling Date", "Issue Dealt With"]}
        rows={individual.map((c) => [c.date, c.issues])}
      />
      <DetailTable
        caption="Group Counselling"
        headers={["Counselling Date", "Issue Dealt With"]}
        rows={group.map((c) => [c.date, c.issues])}
      />
      <DetailTable
        caption="Family Intervention Counselling"
        headers={["Counselling Date", "Issue Dealt With"]}
        rows={family.map((c) => [c.date, c.issues])}
      />

      {(list(p.referralServices) || p.referralRemark) && (
        <DetailSection title="Referral Services" cols={2}>
          <DetailRow
            label="Referral Services"
            value={
              p.referralServices?.includes("Others Specify") && p.referralOtherSpecify
                ? `${list(p.referralServices)} (${p.referralOtherSpecify})`
                : list(p.referralServices)
            }
          />
          <DetailRow label="Referral Remark" value={p.referralRemark} />
        </DetailSection>
      )}
      <DetailTable
        caption="Details of Home Visit"
        headers={["Date of Home Visit", "Purpose of Home Visit", "Outcome of Home Visit"]}
        rows={visits.map((h) => [h.date, h.purpose, h.outcome])}
      />

      {hasDischarge && (
        <DetailSection title="Diagnosis & Discharge" cols={2}>
          <DetailRow label="Final Diagnosis of the Patient (as per ICD-11)" value={p.finalDiagnosis} />
          <DetailRow label="Medical Comorbidity" value={p.medicalComorbidity} />
          <DetailRow label="Psychiatric Comorbidity" value={p.psychiatricComorbidity} />
          <DetailRow label="Neurological Condition" value={p.neurologicalCondition} />
          <DetailRow label="Patient's Motivation at the Time of Discharge" value={p.dischargeMotivation} />
          <DetailRow label="Medication Prescribed at the Time of Discharge" value={p.dischargeMedication} />
          <DetailRow label="Remark at the Time of Discharge" value={p.dischargeRemark} />
          <DetailRow label="Date of Discharge" value={p.dischargeDate} />
          <DetailRow label="Date of Follow-Up" value={p.followUpDate} />
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
        headers={[
          "Drug Name",
          "Age of First Use",
          "Reason of Initiation/Use",
          "Use in Last 3 Months",
          "Daily/Near Daily Use",
          "Duration of Regular Use (Monthly)",
        ]}
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
