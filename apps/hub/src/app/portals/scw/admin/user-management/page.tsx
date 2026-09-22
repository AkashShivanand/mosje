import {
  TableShell,
  StaticPager,
  PortalPageHeader,
  SearchInput,
} from "@/components/scw/ui";
import { ADMIN_USERS, USERS_TOTAL } from "@/lib/scw/mock-data";
import { AddUserDrawer } from "./add-user-drawer";
import { Icon, IconButton } from "@mosje/design-system";

const COLUMNS = [
  { key: "name", label: "Name" },
  { key: "mobile", label: "Mobile Number" },
  { key: "email", label: "Email Address" },
  { key: "role", label: "Role" },
  { key: "actions", label: "Actions" },
];

export default function UserManagementPage() {
  return (
    <div>
      <PortalPageHeader title="User Management" actions={<AddUserDrawer />} />

      <div className="mb-4">
        <SearchInput placeholder="Search for users by name, mobile number or email" />
      </div>

      <TableShell columns={COLUMNS}>
        {ADMIN_USERS.map((u) => (
          <tr key={u.email}>
            <td className="px-6 py-4 font-medium text-ink">{u.name}</td>
            <td className="px-6 py-4 text-ink-muted">{u.mobile}</td>
            <td className="px-6 py-4 text-ink-muted">{u.email}</td>
            <td className="px-6 py-4 text-ink-muted">{u.role}</td>
            <td className="px-6 py-4">
              <div className="flex items-center gap-2">
                <IconButton icon={<Icon name="edit" size={16} />} aria-label="Edit user" tooltip variant="neutral" appearance="text" size="sm" />
                <IconButton icon={<Icon name="delete" size={16} />} aria-label="Delete user" tooltip variant="danger" appearance="text" size="sm" />
              </div>
            </td>
          </tr>
        ))}
      </TableShell>

      <StaticPager total={USERS_TOTAL} totalPages={4} />
    </div>
  );
}
