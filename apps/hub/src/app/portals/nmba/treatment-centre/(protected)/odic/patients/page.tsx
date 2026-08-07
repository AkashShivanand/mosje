"use client";

import * as React from "react";
import Link from "next/link";
import { Icon, Modal } from "@mosje/design-system";
import { useTCStore } from "@/lib/nmba/treatment-centre/store";
import { useTCSession } from "@/lib/nmba/treatment-centre/session-context";
import { TCListPage } from "@/components/nmba/treatment-centre/tc-list";
import { BeneficiaryDetailHistory } from "@/components/nmba/treatment-centre/patient-detail-history";
import type { ColumnDef } from "@/components/nmba/data-table";
import type { Beneficiary } from "@/lib/nmba/treatment-centre/types";

type Row = Beneficiary & {
  sno: number;
  treatmentCenter: string;
  occupation: string;
  education: string;
  maritalStatus: string;
  employment: string;
  address: string;
  followUpDate: string;
};

export default function OdicPatientsPage() {
  const store = useTCStore();
  const session = useTCSession();
  const [viewing, setViewing] = React.useState<Beneficiary | null>(null);

  // Drop-in-centre beneficiaries only — Outreach beneficiaries have their own list.
  const rows: Row[] = store.beneficiaries
    .filter((b) => b.kind === "Drop-in Centre")
    .map((b, i) => {
      const latestFollowUp = store.followUps
        .filter((p) => p.registrationNumber === b.registrationNumber)
        .map((p) => p.followUpDate)
        .sort()
        .at(-1);
      return {
        ...b,
        sno: i + 1,
        treatmentCenter: session.centerName,
        occupation: b.details?.["Occupation"] ?? "",
        education: b.details?.["Education"] ?? "",
        maritalStatus: b.details?.["Marital status"] ?? "",
        employment: b.details?.["Employment"] ?? "",
        address: b.details?.["Current address"] ?? "",
        followUpDate: latestFollowUp ?? "",
      };
    });

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
    { key: "treatmentCenter", header: "Treatment Center" },
    { key: "age", header: "Age" },
    { key: "gender", header: "Gender" },
    { key: "occupation", header: "Occupation", render: (r) => <>{r.occupation || "—"}</> },
    { key: "education", header: "Education", render: (r) => <>{r.education || "—"}</> },
    { key: "maritalStatus", header: "Marital Status", render: (r) => <>{r.maritalStatus || "—"}</> },
    { key: "employment", header: "Employment Status", render: (r) => <>{r.employment || "—"}</> },
    { key: "address", header: "Address", render: (r) => <>{r.address || "—"}</> },
    { key: "state", header: "State" },
    { key: "dateOfRegistration", header: "Registration Date" },
    { key: "followUpDate", header: "Date of Follow-up", render: (r) => <>{r.followUpDate || "—"}</> },
    {
      key: "actions",
      header: "Action",
      noExport: true,
      render: (r) => (
        <button
          type="button"
          onClick={() => setViewing(r)}
          className="inline-flex items-center gap-1 rounded bg-navy/10 px-2 py-1 text-xs font-semibold text-navy hover:bg-navy/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-navy"
        >
          View Details
        </button>
      ),
    },
  ];

  return (
    <>
      <TCListPage
        title="ODIC Patient Registration List"
        columns={columns}
        data={rows}
        searchKeys={["registrationNumber", "name", "gender", "occupation", "education", "state"]}
        fileName="odic-beneficiaries"
        action={
          <Link href="/portals/nmba/treatment-centre/odic/register" className="inline-flex items-center gap-1.5 rounded-lg bg-white px-3 py-1.5 text-sm font-semibold text-navy hover:bg-white/90">
            <Icon name="add" size={16} /> New Registration
          </Link>
        }
      />

      <Modal
        open={!!viewing}
        onClose={() => setViewing(null)}
        title={viewing ? `Beneficiary Detail History — ${viewing.registrationNumber}` : "Beneficiary Detail History"}
        size="lg"
      >
        {viewing && <BeneficiaryDetailHistory beneficiary={viewing} />}
      </Modal>
    </>
  );
}
