import { MoreVertical, Plus } from "lucide-react";
import {
  Button,
  DataTable,
  FilterSelect,
  Pagination,
  PageHeader,
  SearchInput,
} from "@/components/ui";
import { FACILITY_TYPES, IPSRC_HOMES, IPSRC_TOTAL } from "@/lib/mock-data";
import { INDIAN_STATES } from "@/lib/states";

const COLUMNS = [
  { key: "ngo", label: "NGO Name" },
  { key: "projectType", label: "Project Types" },
  { key: "state", label: "State" },
  { key: "district", label: "District" },
  { key: "address", label: "Address" },
  { key: "actions", label: "Actions" },
];

export default function SageHomesPage() {
  return (
    <div>
      <PageHeader
        title="IPSrC Homes"
        action={
          <Button variant="primary">
            <Plus className="h-4 w-4" />
            Add New
          </Button>
        }
      />

      <div className="mb-4 flex flex-col gap-3 lg:flex-row">
        <SearchInput
          placeholder="Search by ngo name, state, district or address"
          className="flex-1"
        />
        <FilterSelect
          options={FACILITY_TYPES}
          defaultLabel="All Facility Types"
          className="w-full lg:w-52"
        />
        <FilterSelect
          options={INDIAN_STATES}
          defaultLabel="All States"
          className="w-full lg:w-44"
        />
        <FilterSelect
          options={[]}
          defaultLabel="All Districts"
          className="w-full lg:w-44"
        />
      </div>

      <DataTable columns={COLUMNS}>
        {IPSRC_HOMES.map((h) => (
          <tr key={h.ngo}>
            <td className="max-w-[16rem] truncate px-6 py-4 font-medium text-ink">
              {h.ngo}
            </td>
            <td className="whitespace-nowrap px-6 py-4 text-ink-muted">
              {h.projectType}
            </td>
            <td className="px-6 py-4 text-ink-muted">{h.state}</td>
            <td className="px-6 py-4 text-ink-muted">{h.district}</td>
            <td className="max-w-[18rem] truncate px-6 py-4 text-ink-muted">
              {h.address}
            </td>
            <td className="px-6 py-4">
              <button
                aria-label="Home actions"
                className="rounded-md p-1.5 text-ink-muted hover:bg-black/5"
              >
                <MoreVertical className="h-4 w-4" />
              </button>
            </td>
          </tr>
        ))}
      </DataTable>

      <Pagination total={IPSRC_TOTAL} totalPages={74} />
    </div>
  );
}
