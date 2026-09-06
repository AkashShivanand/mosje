import { TableShell, StaticPager, PortalPageHeader } from "@/components/scw/ui";
import { ASSISTED_DEVICES, DEVICES_TOTAL } from "@/lib/scw/mock-data";
import { Badge, Icon, Button } from "@mosje/design-system";

const COLUMNS = [
  { key: "title", label: "Title" },
  { key: "description", label: "Description" },
  { key: "active", label: "Is Active" },
  { key: "actions", label: "Actions" },
];

export default function AssistedDevicesPage() {
  return (
    <div>
      <PortalPageHeader
        title="RVY Assisted Devices"
        actions={
          <Button>
            <Icon name="add" size={16} />
            Add New
          </Button>
        }
      />

      <TableShell columns={COLUMNS}>
        {ASSISTED_DEVICES.map((d) => (
          <tr key={d.title}>
            <td className="max-w-[14rem] truncate px-6 py-4 font-medium text-ink">
              {d.title}
            </td>
            <td className="px-6 py-4 text-ink-muted">
              <span className="line-clamp-1 block max-w-[28rem]">{d.description}</span>
            </td>
            <td className="px-6 py-4">
              <Badge status={d.active ? "success" : "neutral"}>
                {d.active ? "Active" : "Inactive"}
              </Badge>
            </td>
            <td className="px-6 py-4">
              <button
                aria-label="Device actions"
                className="rounded-md p-1.5 text-ink-muted hover:bg-black/5"
              >
                <Icon name="more_vert" size={16} />
              </button>
            </td>
          </tr>
        ))}
      </TableShell>

      <StaticPager total={DEVICES_TOTAL} totalPages={23} />
    </div>
  );
}
