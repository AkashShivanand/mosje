import Link from "next/link";
import {
  DataTable,
  FilterSelect,
  Pagination,
  PageHeader,
  SearchInput,
  StatusPill,
} from "@/components/ui";
import { VOLUNTEERS, VOLUNTEERS_TOTAL } from "@/lib/mock-data";
import { INDIAN_STATES } from "@/lib/states";

const PERIODS = ["Last 7 Days", "Last 30 Days", "Last 90 Days"];

const COLUMNS = [
  { key: "name", label: "Name" },
  { key: "type", label: "Volunteer Type" },
  { key: "date", label: "Date" },
  { key: "status", label: "Status" },
  { key: "action", label: "Action" },
];

export default function VolunteersPage() {
  return (
    <div>
      <PageHeader title="Volunteers" />

      <div className="mb-4 flex flex-col gap-3 sm:flex-row">
        <SearchInput placeholder="Search volunteers..." className="flex-1" />
        <FilterSelect options={PERIODS} defaultLabel="All" className="w-full sm:w-44" />
        <FilterSelect
          options={INDIAN_STATES}
          defaultLabel="All States"
          className="w-full sm:w-52"
        />
      </div>

      <DataTable columns={COLUMNS}>
        {VOLUNTEERS.map((v) => (
          <tr key={v.id}>
            <td className="px-6 py-4 font-medium text-ink">{v.name}</td>
            <td className="px-6 py-4 text-ink-muted">{v.type}</td>
            <td className="px-6 py-4 text-ink-muted">{v.date}</td>
            <td className="px-6 py-4">
              <StatusPill status={v.status} />
            </td>
            <td className="px-6 py-4">
              <Link
                href={`/admin/volunteers/${v.id}`}
                className="text-sm font-medium text-navy hover:underline"
              >
                {v.status === "Approved" ? "View Details" : "Review"}
              </Link>
            </td>
          </tr>
        ))}
      </DataTable>

      <Pagination total={VOLUNTEERS_TOTAL} totalPages={36} />
    </div>
  );
}
