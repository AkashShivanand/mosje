import { Pencil, Trash2 } from "lucide-react";
import {
  DataTable,
  Pagination,
  PageHeader,
  SearchInput,
} from "@/components/scw/ui";
import { ADMIN_USERS, USERS_TOTAL } from "@/lib/scw/mock-data";
import { AddUserDrawer } from "./add-user-drawer";

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
      <PageHeader title="User Management" action={<AddUserDrawer />} />

      <div className="mb-4">
        <SearchInput placeholder="Search for users by name, mobile number or email" />
      </div>

      <DataTable columns={COLUMNS}>
        {ADMIN_USERS.map((u) => (
          <tr key={u.email}>
            <td className="px-6 py-4 font-medium text-ink">{u.name}</td>
            <td className="px-6 py-4 text-ink-muted">{u.mobile}</td>
            <td className="px-6 py-4 text-ink-muted">{u.email}</td>
            <td className="px-6 py-4 text-ink-muted">{u.role}</td>
            <td className="px-6 py-4">
              <div className="flex items-center gap-2">
                <button
                  aria-label="Edit user"
                  className="rounded-md p-1.5 text-amber-500 hover:bg-amber-50"
                >
                  <Pencil className="h-4 w-4" />
                </button>
                <button
                  aria-label="Delete user"
                  className="rounded-md p-1.5 text-red-500 hover:bg-red-50"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </td>
          </tr>
        ))}
      </DataTable>

      <Pagination total={USERS_TOTAL} totalPages={4} />
    </div>
  );
}
