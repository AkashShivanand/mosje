"use client";

import * as React from "react";
import { useTCStore } from "@/lib/nmba/treatment-centre/store";
import { TCListPage } from "@/components/nmba/treatment-centre/tc-list";
import { FormField, Input, Modal, Button } from "@mosje/design-system";
import type { ColumnDef } from "@/components/nmba/data-table";

type CentreSummary = {
  sno: number;
  centreId: number;
  name: string;
  type: string;
  totalAdmitted: number;
  totalFollowUps: number;
  totalReadmissions: number;
};

export default function USCentresReportPage() {
  const store = useTCStore();
  const [startDate, setStartDate] = React.useState("2026-01-01");
  const [endDate, setEndDate] = React.useState("2026-12-31");
  const [drillDownCentre, setDrillDownCentre] = React.useState<CentreSummary | null>(null);

  // Grouped counts by centre name
  const centers: CentreSummary[] = React.useMemo(() => {
    const list = [
      { centreId: 654, name: "IRCA De-Addiction Centre (Demo)", type: "IRCA" },
      { centreId: 653, name: "ODIC Outreach & Drop-in Centre (Demo)", type: "ODIC" },
      { centreId: 656, name: "CPLI Community Centre (Demo)", type: "CPLI" },
      { centreId: 651, name: "District De-Addiction Centre (Demo)", type: "DDAC" },
    ];

    return list.map((c, idx) => {
      let admitted = 0;
      let followUps = 0;
      let readmissions = 0;

      if (c.type === "IRCA" || c.type === "DDAC") {
        admitted = store.patients.filter(
          (p) => p.dateOfAdmission >= startDate && p.dateOfAdmission <= endDate
        ).length;
        readmissions = store.readmissions.filter(
          (r) => r.readmissionDate >= startDate && r.readmissionDate <= endDate
        ).length;
      }
      if (c.type === "ODIC" || c.type === "DDAC") {
        admitted += store.beneficiaries.filter(
          (b) => b.dateOfRegistration >= startDate && b.dateOfRegistration <= endDate
        ).length;
      }
      
      followUps = store.followUps.filter(
        (f) => f.followUpDate >= startDate && f.followUpDate <= endDate
      ).length;

      return {
        sno: idx + 1,
        centreId: c.centreId,
        name: c.name,
        type: c.type,
        totalAdmitted: admitted,
        totalFollowUps: followUps,
        totalReadmissions: readmissions,
      };
    });
  }, [store.patients, store.beneficiaries, store.followUps, store.readmissions, startDate, endDate]);

  const drillDownData = React.useMemo(() => {
    if (!drillDownCentre) return [];
    
    if (drillDownCentre.type === "IRCA" || drillDownCentre.type === "DDAC") {
      return store.patients
        .filter((p) => p.dateOfAdmission >= startDate && p.dateOfAdmission <= endDate)
        .map((p) => ({
          regNo: p.registrationNumber,
          name: p.name,
          date: p.dateOfAdmission,
          status: p.registrationProgress,
        }));
    } else {
      return store.beneficiaries
        .filter((b) => b.dateOfRegistration >= startDate && b.dateOfRegistration <= endDate)
        .map((b) => ({
          regNo: b.registrationNumber,
          name: b.name,
          date: b.dateOfRegistration,
          status: b.registrationProgress,
        }));
    }
  }, [drillDownCentre, store.patients, store.beneficiaries, startDate, endDate]);

  const columns: ColumnDef<CentreSummary>[] = [
    { key: "sno", header: "S.No" },
    { key: "name", header: "Centre Name" },
    { key: "type", header: "Centre Type" },
    { key: "totalAdmitted", header: "Total Admitted" },
    { key: "totalFollowUps", header: "Total Follow-Ups" },
    { key: "totalReadmissions", header: "Total Readmissions" },
    {
      key: "actions",
      header: "Action",
      render: (r) => (
        <button
          type="button"
          onClick={() => setDrillDownCentre(r)}
          className="rounded bg-navy/10 px-2.5 py-1 text-xs font-semibold text-navy hover:bg-navy/20"
        >
          View Roster
        </button>
      ),
    },
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
        title="Treatment Centre Report Date Wise"
        columns={columns}
        data={centers}
        searchKeys={["name", "type"]}
        fileName={`centres-report-${startDate}-to-${endDate}`}
      />

      {drillDownCentre && (
        <Modal
          open={!!drillDownCentre}
          onClose={() => setDrillDownCentre(null)}
          title={`Patient Roster — ${drillDownCentre.name}`}
          footer={<Button type="button" variant="primary" onClick={() => setDrillDownCentre(null)}>Close</Button>}
          size="lg"
        >
          <div className="flex flex-col gap-4">
            <p className="text-sm text-ink-muted">
              Showing active beneficiaries/patients registered between <span className="font-semibold text-ink">{startDate}</span> and <span className="font-semibold text-ink">{endDate}</span>.
            </p>

            <div className="overflow-x-auto rounded-lg border border-line bg-white">
              <table className="min-w-full text-sm">
                <thead>
                  <tr className="bg-surface-muted text-left text-xs font-semibold uppercase tracking-wide text-ink-muted border-b border-line">
                    <th className="px-4 py-2">S.No</th>
                    <th className="px-4 py-2">Reg. Number</th>
                    <th className="px-4 py-2">Patient Name</th>
                    <th className="px-4 py-2">Admission/Registration Date</th>
                    <th className="px-4 py-2">Progress Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-line">
                  {drillDownData.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="px-4 py-6 text-center text-ink-muted">No records found for this center in selected date range.</td>
                    </tr>
                  ) : (
                    drillDownData.map((row, idx) => (
                      <tr key={idx} className="hover:bg-brandwash">
                        <td className="px-4 py-2">{idx + 1}</td>
                        <td className="px-4 py-2 font-mono text-navy font-semibold">{row.regNo}</td>
                        <td className="px-4 py-2 text-ink font-medium">{row.name}</td>
                        <td className="px-4 py-2 text-ink-muted">{row.date}</td>
                        <td className="px-4 py-2">
                          <span className={`inline-flex items-center rounded px-2 py-0.5 text-xs font-semibold ${
                            row.status === "Completed" ? "bg-green-100 text-green-800" :
                            row.status === "In Progress" ? "bg-yellow-100 text-yellow-800" : "bg-gray-100 text-gray-800"
                          }`}>
                            {row.status}
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
