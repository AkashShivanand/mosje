"use client";

import * as React from "react";
import Link from "next/link";
import { Plus } from "lucide-react";
import { Modal } from "@mosje/design-system";
import { useTCStore } from "@/lib/nmba/treatment-centre/store";
import { TCListPage } from "@/components/nmba/treatment-centre/tc-list";
import { ProgressBadge } from "@/components/nmba/treatment-centre/tc-form";
import { PatientDetailHistory } from "@/components/nmba/treatment-centre/patient-detail-history";
import type { ColumnDef } from "@/components/nmba/data-table";
import type { Patient, RegistrationProgress } from "@/lib/nmba/treatment-centre/types";

type Row = Patient & { sno: number };

export default function IrcaPatientsPage() {
  const store = useTCStore();
  const [viewing, setViewing] = React.useState<Patient | null>(null);

  const rows: Row[] = store.patients.map((p, i) => ({ ...p, sno: i + 1 }));

  const columns: ColumnDef<Row>[] = [
    { key: "sno", header: "S.No" },
    {
      key: "registrationNumber",
      header: "Registration Number",
      render: (r) => (
        <button
          type="button"
          onClick={() => setViewing(r)}
          className="font-mono text-navy hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-navy"
        >
          {r.registrationNumber}
        </button>
      ),
    },
    { key: "name", header: "Patient Name", render: (r) => <span className="font-semibold text-ink">{r.name}</span> },
    {
      key: "registrationProgress",
      header: "Registration Progress",
      render: (r) => <ProgressBadge value={r.registrationProgress as RegistrationProgress} />,
    },
    { key: "treatmentCenter", header: "Treatment Center" },
    { key: "age", header: "Age" },
    { key: "gender", header: "Gender" },
    { key: "occupation", header: "Occupation" },
    { key: "education", header: "Education" },
    { key: "maritalStatus", header: "Marital Status" },
    { key: "employment", header: "Employment Status" },
    { key: "state", header: "State" },
    { key: "district", header: "District" },
    { key: "dateOfAdmission", header: "Registration Date" },
    { key: "followUpDate", header: "Date of Follow-up", render: (r) => r.followUpDate || "—" },
    {
      key: "actions",
      header: "Action",
      noExport: true,
      render: (r) => (
        <div className="flex flex-wrap items-center gap-1.5">
          <Link
            href={`/portals/nmba/treatment-centre/irca/patients/${r.id}`}
            className="inline-flex items-center gap-1 rounded bg-navy/10 px-2 py-1 text-xs font-semibold text-navy hover:bg-navy/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-navy"
          >
            Clinical Wizard
          </Link>
          <Link
            href="/portals/nmba/treatment-centre/irca/follow-ups/new"
            className="inline-flex items-center rounded border border-line px-2 py-1 text-xs font-semibold text-ink hover:bg-black/5"
          >
            Follow-up
          </Link>
          <Link
            href="/portals/nmba/treatment-centre/irca/readmissions/new"
            className="inline-flex items-center rounded border border-line px-2 py-1 text-xs font-semibold text-ink hover:bg-black/5"
          >
            Re-Admission
          </Link>
        </div>
      ),
    },
  ];

  return (
    <>
      <TCListPage
        title="Patient Registration List"
        columns={columns}
        data={rows}
        searchKeys={[
          "registrationNumber",
          "name",
          "treatmentCenter",
          "gender",
          "occupation",
          "education",
          "maritalStatus",
          "employment",
          "state",
          "district",
        ]}
        fileName="irca-patients"
        action={
          <Link
            href="/portals/nmba/treatment-centre/irca/register"
            className="inline-flex items-center gap-1.5 rounded-lg bg-white px-3 py-1.5 text-sm font-semibold text-navy hover:bg-white/90"
          >
            <Plus className="h-4 w-4" /> New Registration
          </Link>
        }
      />

      <Modal
        open={!!viewing}
        onClose={() => setViewing(null)}
        title={viewing ? `Patient Detail History — ${viewing.registrationNumber}` : "Patient Detail History"}
        size="lg"
      >
        {viewing && <PatientDetailHistory patient={viewing} />}
      </Modal>
    </>
  );
}
