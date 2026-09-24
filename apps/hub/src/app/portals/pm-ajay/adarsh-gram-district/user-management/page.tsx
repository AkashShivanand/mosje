"use client";

/* Adarsh Gram — District: User Management.
   Rebuilt from pm-ajay.dosje.gov.in/adarsh-gram-district/user-management.

   DS Audit: WorklistScreen ✅ (owns all seven states, the pager and the phone cards) ·
   Modal ✅ · FormField ✅ · Input ✅ · Select ✅ · Search ✅ · ErrorSummary ✅ · Badge ✅ ·
   Button ✅ · Icon ✅. Nothing added.

   The live search field's placeholder names a "username" the register does not carry —
   `PortalUser` has no login identifier of its own, only name, designation, mobile and
   level — so the search here covers those three instead of promising a field that is
   not on the record. "Add User" is a Modal rather than a new route: the brief scopes
   this build to `/user-management` itself, and the live product gives no separate
   add-user screen to reproduce — a labelled dialog on this page is the add flow. */

import * as React from "react";
import {
  Badge,
  Button,
  ErrorSummary,
  FormField,
  Icon,
  Input,
  Modal,
  Search,
  Select,
  WorklistScreen,
  screenCopy,
  type ErrorSummaryItem,
  type WorklistColumn,
} from "@mosje/design-system";
import { DISTRICT_SCOPE, PROVENANCE_LINE, USERS, type PortalUser } from "@/lib/pm-ajay/district/registers";

const LEVELS: PortalUser["level"][] = ["District", "Block", "Village"];

interface Draft {
  name: string;
  designation: string;
  level: PortalUser["level"] | "";
  mobile: string;
}

const EMPTY: Draft = { name: "", designation: "", level: "", mobile: "" };

const COLUMNS: WorklistColumn<PortalUser>[] = [
  { key: "name", header: "Name", priority: 1 },
  { key: "designation", header: "Designation", priority: 2 },
  { key: "level", header: "Level", priority: 2 },
  { key: "mobile", header: "Mobile", priority: 3 },
  {
    key: "status",
    header: "Status",
    priority: 1,
    render: (row) => <Badge status={row.status === "Active" ? "success" : "neutral"}>{row.status}</Badge>,
  },
  { key: "lastSignIn", header: "Last Sign-in", priority: 3, render: (row) => row.lastSignIn ?? "Never signed in" },
];

export default function UserManagementPage() {
  const [users, setUsers] = React.useState<PortalUser[]>(USERS);
  const [query, setQuery] = React.useState("");
  const [addOpen, setAddOpen] = React.useState(false);
  const [draft, setDraft] = React.useState<Draft>(EMPTY);
  const [errors, setErrors] = React.useState<ErrorSummaryItem[]>([]);

  const rows = React.useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return users;
    return users.filter((u) => `${u.name} ${u.designation} ${u.mobile}`.toLowerCase().includes(q));
  }, [users, query]);

  const activeFilterCount = query.trim() ? 1 : 0;

  const toggleStatus = (id: string) => {
    setUsers((prev) =>
      prev.map((u) => (u.id === id ? { ...u, status: u.status === "Active" ? "Inactive" : "Active" } : u)),
    );
  };

  const openAdd = () => {
    setDraft(EMPTY);
    setErrors([]);
    setAddOpen(true);
  };

  const closeAdd = () => setAddOpen(false);

  const set = (key: keyof Draft) => (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setDraft((d) => ({ ...d, [key]: event.target.value }));
  };

  const onAddSubmit = () => {
    const found: ErrorSummaryItem[] = [];
    if (!draft.name.trim()) found.push({ fieldId: "user-name", message: "Enter the officer's name." });
    if (!draft.designation.trim())
      found.push({ fieldId: "user-designation", message: "Enter the officer's designation." });
    if (!draft.level) found.push({ fieldId: "user-level", message: "Choose the level this user works at." });
    if (!/^[0-9 ]{10,13}$/.test(draft.mobile.trim()))
      found.push({ fieldId: "user-mobile", message: "Enter a ten-digit mobile number." });
    setErrors(found);
    if (found.length > 0) return;

    setUsers((prev) => [
      ...prev,
      {
        id: `u-${Date.now()}`,
        name: draft.name.trim(),
        designation: draft.designation.trim(),
        level: draft.level as PortalUser["level"],
        mobile: draft.mobile.trim(),
        status: "Active",
        lastSignIn: null,
      },
    ]);
    closeAdd();
  };

  return (
    <>
      <WorklistScreen
        eyebrow="Adarsh Gram"
        title="User Management"
        meta={`District, block and village-level accounts with access to this portal, for ${DISTRICT_SCOPE.district}, ${DISTRICT_SCOPE.state}. ${PROVENANCE_LINE}`}
        actions={
          <Button iconLeft={<Icon name="person_add" size={20} />} onClick={openAdd}>
            Add User
          </Button>
        }
        filters={
          <Search
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            onClear={() => setQuery("")}
            placeholder="Name, role or mobile"
            aria-label="Search users"
          />
        }
        activeFilterCount={activeFilterCount}
        onClearFilters={() => setQuery("")}
        columns={COLUMNS}
        rows={rows}
        registerTotal={users.length}
        getRowId={(row) => row.id}
        noun="user"
        pluralNoun="users"
        rowActions={(row) => (
          <Button
            size="sm"
            appearance="text"
            variant={row.status === "Active" ? "danger" : "success"}
            onClick={() => toggleStatus(row.id)}
          >
            {row.status === "Active" ? "Deactivate" : "Activate"}
          </Button>
        )}
        emptyAction={<Button onClick={openAdd}>Add the first user</Button>}
        copy={screenCopy({
          emptyTitle: "No user has been added to this district's portal yet",
          emptyDescription: "Add the district, block and village officers who need access to this account.",
          filteredTitle: "No user matches that search",
          filteredDescription: "Clear the search to see the whole list.",
        })}
      />

      <Modal
        open={addOpen}
        onClose={closeAdd}
        dirty={JSON.stringify(draft) !== JSON.stringify(EMPTY)}
        title="Add User"
        size="md"
        footer={
          <>
            <Button appearance="text" onClick={closeAdd}>
              Cancel
            </Button>
            <Button onClick={onAddSubmit}>Save User</Button>
          </>
        }
      >
        {errors.length > 0 ? <ErrorSummary errors={errors} headingLevel={3} /> : null}

        <FormField
          label="Name"
          id="user-name"
          required
          error={errors.find((e) => e.fieldId === "user-name")?.message}
        >
          {(control) => <Input {...control} value={draft.name} onChange={set("name")} placeholder="Officer's full name" />}
        </FormField>

        <FormField
          label="Designation"
          id="user-designation"
          required
          error={errors.find((e) => e.fieldId === "user-designation")?.message}
        >
          {(control) => (
            <Input
              {...control}
              value={draft.designation}
              onChange={set("designation")}
              placeholder="e.g. Panchayat Secretary"
            />
          )}
        </FormField>

        <FormField
          label="Level"
          id="user-level"
          required
          error={errors.find((e) => e.fieldId === "user-level")?.message}
        >
          {(control) => (
            <Select {...control} value={draft.level} onChange={set("level")} placeholder="Select the level">
              {LEVELS.map((level) => (
                <option key={level} value={level}>
                  {level}
                </option>
              ))}
            </Select>
          )}
        </FormField>

        <FormField
          label="Mobile Number"
          id="user-mobile"
          required
          hint="Ten digits, the officer's own number."
          error={errors.find((e) => e.fieldId === "user-mobile")?.message}
        >
          {(control) => (
            <Input {...control} inputMode="numeric" autoComplete="tel" value={draft.mobile} onChange={set("mobile")} placeholder="10-digit mobile" />
          )}
        </FormField>
      </Modal>
    </>
  );
}
