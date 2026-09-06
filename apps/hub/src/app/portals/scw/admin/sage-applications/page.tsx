import Link from "next/link";
import {
  TableShell,
  PeriodFilter,
  StaticPager,
  PortalPageHeader,
  SearchInput,
  StatusPill,
} from "@/components/scw/ui";
import { SAGE_APPLICATIONS, SAGE_TOTAL } from "@/lib/scw/mock-data";

const PERIODS = ["Last 7 Days", "Last 30 Days", "Last 90 Days"];

const COLUMNS = [
  { key: "organisation", label: "Organisation Name" },
  { key: "date", label: "Date" },
  { key: "status", label: "Status" },
  { key: "action", label: "Action" },
];

export default function SageApplicationsPage() {
  return (
    <div>
      <PortalPageHeader
        title="SAGE Applications"
        actions={<PeriodFilter options={PERIODS} defaultLabel="All" className="w-44" />}
      />

      <div className="mb-4">
        <SearchInput placeholder="Search by organisation..." />
      </div>

      <TableShell columns={COLUMNS}>
        {SAGE_APPLICATIONS.map((a) => (
          <tr key={a.id}>
            <td className="max-w-[22rem] truncate px-6 py-4 font-medium text-ink">
              {a.organisation}
            </td>
            <td className="px-6 py-4 text-ink-muted">{a.date}</td>
            <td className="px-6 py-4">
              <StatusPill status={a.status} />
            </td>
            <td className="px-6 py-4">
              <Link
                href={`/portals/scw/admin/sage-applications/${a.id}`}
                className="text-label-1 text-navy hover:underline"
              >
                {a.status === "Approved" ? "View Details" : "Review"}
              </Link>
            </td>
          </tr>
        ))}
      </TableShell>

      <StaticPager total={SAGE_TOTAL} totalPages={41} />
    </div>
  );
}
