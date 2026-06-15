import { MoreVertical, Plus } from "lucide-react";
import {
  Button,
  DataTable,
  Pagination,
  PageHeader,
} from "@/components/ui";
import { cn } from "@/lib/utils";
import { ASSISTED_DEVICES, DEVICES_TOTAL } from "@/lib/mock-data";

const COLUMNS = [
  { key: "title", label: "Title" },
  { key: "description", label: "Description" },
  { key: "active", label: "Is Active" },
  { key: "actions", label: "Actions" },
];

function Toggle({ on }: { on: boolean }) {
  return (
    <span
      role="switch"
      aria-checked={on}
      className={cn(
        "inline-flex h-6 w-11 items-center rounded-full p-0.5 transition-colors",
        on ? "bg-navy" : "bg-line"
      )}
    >
      <span
        className={cn(
          "h-5 w-5 rounded-full bg-white shadow transition-transform",
          on ? "translate-x-5" : "translate-x-0"
        )}
      />
    </span>
  );
}

export default function AssistedDevicesPage() {
  return (
    <div>
      <PageHeader
        title="RVY Assisted Devices"
        action={
          <Button variant="primary">
            <Plus className="h-4 w-4" />
            Add New
          </Button>
        }
      />

      <DataTable columns={COLUMNS}>
        {ASSISTED_DEVICES.map((d) => (
          <tr key={d.title}>
            <td className="max-w-[14rem] truncate px-6 py-4 font-medium text-ink">
              {d.title}
            </td>
            <td className="px-6 py-4 text-ink-muted">
              <span className="line-clamp-1 block max-w-[28rem]">{d.description}</span>
            </td>
            <td className="px-6 py-4">
              <Toggle on={d.active} />
            </td>
            <td className="px-6 py-4">
              <button
                aria-label="Device actions"
                className="rounded-md p-1.5 text-ink-muted hover:bg-black/5"
              >
                <MoreVertical className="h-4 w-4" />
              </button>
            </td>
          </tr>
        ))}
      </DataTable>

      <Pagination total={DEVICES_TOTAL} totalPages={23} />
    </div>
  );
}
