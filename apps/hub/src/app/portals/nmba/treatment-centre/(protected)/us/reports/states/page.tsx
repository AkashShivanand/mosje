"use client";

import * as React from "react";
import { useTCStore } from "@/lib/nmba/treatment-centre/store";
import { TCListPage } from "@/components/nmba/treatment-centre/tc-list";
import { FormField, Input } from "@mosje/design-system";
import type { ColumnDef } from "@/components/nmba/data-table";
import { STATES } from "@/lib/nmba/treatment-centre/master-data";

type StateSummary = {
  sno: number;
  state: string;
  numCentres: number;
  totalAdmitted: number;
  totalFollowUps: number;
  totalReadmissions: number;
};

export default function USStatesReportPage() {
  const store = useTCStore();
  const [startDate, setStartDate] = React.useState("2026-01-01");
  const [endDate, setEndDate] = React.useState("2026-12-31");

  const stateData: StateSummary[] = React.useMemo(() => {
    return STATES.map((stOption, idx) => {
      const stateName = stOption.label;

      const matchingPatients = store.patients.filter(
        (p) => p.state === stateName && p.dateOfAdmission >= startDate && p.dateOfAdmission <= endDate
      );
      const matchingBeneficiaries = store.beneficiaries.filter(
        (b) => b.state === stateName && b.dateOfRegistration >= startDate && b.dateOfRegistration <= endDate
      );
      
      const admitted = matchingPatients.length + matchingBeneficiaries.length;

      const patientRegs = new Set(matchingPatients.map((p) => p.registrationNumber));
      const beneficiaryRegs = new Set(matchingBeneficiaries.map((b) => b.registrationNumber));

      const followUps = store.followUps.filter(
        (f) =>
          (patientRegs.has(f.registrationNumber) || beneficiaryRegs.has(f.registrationNumber)) &&
          f.followUpDate >= startDate &&
          f.followUpDate <= endDate
      ).length;

      const readmissions = store.readmissions.filter(
        (r) =>
          patientRegs.has(r.registrationNumber) &&
          r.readmissionDate >= startDate &&
          r.readmissionDate <= endDate
      ).length;

      const numCentres = admitted > 0 ? 1 : 0;

      return {
        sno: idx + 1,
        state: stateName,
        numCentres,
        totalAdmitted: admitted,
        totalFollowUps: followUps,
        totalReadmissions: readmissions,
      };
    })
    .filter((st) => st.totalAdmitted > 0)
    .map((st, idx) => ({ ...st, sno: idx + 1 }));
  }, [store.patients, store.beneficiaries, store.followUps, store.readmissions, startDate, endDate]);

  const columns: ColumnDef<StateSummary>[] = [
    { key: "sno", header: "S.No" },
    { key: "state", header: "State Name" },
    { key: "numCentres", header: "Active Centres" },
    { key: "totalAdmitted", header: "Total Admitted" },
    { key: "totalFollowUps", header: "Total Follow-Ups" },
    { key: "totalReadmissions", header: "Total Readmissions" },
  ];

  return (
    <div className="flex flex-col gap-6">
      <div className="rounded-xl border border-line bg-white p-5 flex flex-wrap gap-4 items-end">
        <div className="w-48">
          <FormField label="Start Date">
            {(c) => <Input {...c} type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />}
          </FormField>
        </div>
        <div className="w-48">
          <FormField label="End Date">
            {(c) => <Input {...c} type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />}
          </FormField>
        </div>
      </div>

      <TCListPage
        title="State Report Date Wise"
        columns={columns}
        data={stateData}
        searchKeys={["state"]}
        fileName={`states-report-${startDate}-to-${endDate}`}
      />
    </div>
  );
}
