import Link from "next/link";
import {
  Button,
  TableShell,
  StaticPager,
  PortalPageHeader,
  SearchInput,
} from "@/components/scw/ui";
import { EVENTS, EVENTS_TOTAL } from "@/lib/scw/mock-data";
import { Icon } from "@mosje/design-system";

const COLUMNS = [
  { key: "sno", label: "S.No" },
  { key: "name", label: "Event Name" },
  { key: "start", label: "Start Date & Time" },
  { key: "end", label: "End Date & Time" },
  { key: "hours", label: "Total Hours" },
  { key: "address", label: "Address" },
  { key: "actions", label: "Actions" },
];

export default function EventsPage() {
  return (
    <div>
      <PortalPageHeader
        title="Events"
        actions={
          <Link href="/portals/scw/admin/events/add">
            <Button variant="primary">
              <Icon name="add" size={16} />
              Add New
            </Button>
          </Link>
        }
      />

      <div className="mb-4">
        <SearchInput placeholder="Search by event title, organizer, state..." />
      </div>

      <TableShell columns={COLUMNS}>
        {EVENTS.map((e) => (
          <tr key={e.sno}>
            <td className="px-6 py-4 text-ink-muted">{e.sno}</td>
            <td className="max-w-[18rem] truncate px-6 py-4 font-medium text-ink">
              {e.name}
            </td>
            <td className="whitespace-nowrap px-6 py-4 text-ink-muted">{e.start}</td>
            <td className="px-6 py-4 text-ink-muted">{e.end}</td>
            <td className="px-6 py-4 text-ink-muted">{e.hours}</td>
            <td className="max-w-[16rem] truncate px-6 py-4 text-ink-muted">
              {e.address}
            </td>
            <td className="px-6 py-4">
              <button
                aria-label="Event actions"
                className="rounded-md p-1.5 text-ink-muted hover:bg-black/5"
              >
                <Icon name="more_vert" size={16} />
              </button>
            </td>
          </tr>
        ))}
      </TableShell>

      <StaticPager total={EVENTS_TOTAL} totalPages={24} />
    </div>
  );
}
