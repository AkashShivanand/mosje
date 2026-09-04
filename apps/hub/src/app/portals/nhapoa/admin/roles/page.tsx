"use client";

import { PageHeader, Card } from "@/components/nhapoa/ui";
import { Icon } from "@mosje/design-system";

const COLS = ["Citizen", "DM/DC", "SHO", "State", "Finance", "Central", "Call Ctr", "Admin"];

// RBAC matrix (captured from the live Role Management screen). 1 = permitted.
const MATRIX: [string, number[]][] = [
  ["Submit Grievance", [1, 0, 0, 0, 0, 0, 1, 1]],
  ["Track Grievance Status", [1, 1, 1, 1, 1, 1, 1, 1]],
  ["Review Assigned Cases", [0, 1, 1, 0, 0, 0, 0, 1]],
  ["Request Clarification from Citizen", [0, 1, 1, 0, 0, 0, 0, 1]],
  ["Upload Investigation Evidence", [0, 1, 1, 0, 0, 0, 0, 1]],
  ["Mark Case Inspected (PS)", [0, 0, 1, 0, 0, 0, 0, 1]],
  ["Submit Recommendation", [0, 1, 1, 0, 0, 0, 0, 1]],
  ["Approve / Send Back Resolution", [0, 0, 0, 1, 0, 0, 0, 1]],
  ["Process Fund Disbursement", [0, 0, 0, 0, 1, 0, 0, 1]],
  ["View All Grievances (All States)", [0, 0, 0, 0, 0, 1, 0, 1]],
  ["View State Grievances Only", [0, 0, 0, 1, 1, 0, 0, 1]],
  ["View District Cases Only", [0, 1, 1, 0, 0, 0, 0, 1]],
  ["Register Grievance on Behalf", [0, 0, 0, 0, 0, 0, 1, 1]],
  ["Manage Caller Records", [0, 0, 0, 0, 0, 0, 1, 1]],
  ["Log & Resolve Queries", [0, 0, 0, 0, 0, 0, 1, 1]],
  ["Allocate State Funds", [0, 0, 0, 0, 0, 1, 0, 1]],
  ["Manage Users & Roles", [0, 0, 0, 0, 0, 0, 0, 1]],
];

export default function RolesPage() {
  return (
    <div>
      <PageHeader title="Role Management" subtitle="RBAC permission matrix — least-privilege principle" />
      <Card className="overflow-x-auto p-0">
        <table className="w-full min-w-[880px] text-left text-body-2">
          <thead>
            <tr className="border-b border-line bg-surface-muted text-label-3 uppercase text-ink-hint">
              <th className="sticky left-0 bg-surface-muted px-5 py-3.5 font-semibold">Permission / Module</th>
              {COLS.map((c) => <th key={c} className="px-3 py-3.5 text-center font-semibold">{c}</th>)}
            </tr>
          </thead>
          <tbody className="divide-y divide-line">
            {MATRIX.map(([perm, cells]) => (
              <tr key={perm} className="hover:bg-surface-muted/60">
                <td className="sticky left-0 bg-white px-5 py-3 font-medium text-ink">{perm}</td>
                {cells.map((v, i) => (
                  <td key={i} className="px-3 py-3 text-center">
                    {v ? <Icon name="check" size={16} className="mx-auto text-approve-fg" /> : <span className="text-ink-hint">·</span>}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  );
}
