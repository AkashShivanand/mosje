"use client";

import { useState } from "react";
import { PageHeader } from "@/components/smile-admin/shell/page-header";
import { DataToolbar, SearchField } from "@/components/smile-admin/data/data-toolbar";
import { PERMISSION_MATRIX } from "@/lib/smile-admin/mock-data";
import { Badge, Card, CardBody, CardHeader, CardTitle, Checkbox, Icon } from "@mosje/design-system";

export default function PermissionsPage() {
  const [search, setSearch] = useState("");
  const filtered = PERMISSION_MATRIX.map((g) => ({
    ...g,
    permissions: g.permissions.filter(
      (p) => p.label.toLowerCase().includes(search.toLowerCase()) || p.key.includes(search.toLowerCase())
    ),
  })).filter((g) => g.permissions.length > 0);

  return (
    <div className="space-y-lg">
      <PageHeader
        breadcrumbs={[{ label: "Access Control" }, { label: "Permissions" }]}
        title="Permissions catalog"
        subtitle="Master list of every capability across the SMILE programme. Group them into roles on the Roles page."
      />

      <DataToolbar>
        <SearchField placeholder="Search permission keys / labels…" value={search} onChange={setSearch} />
      </DataToolbar>

      <div className="grid gap-lg lg:grid-cols-2 xl:grid-cols-3">
        {filtered.map((g) => (
          <Card key={g.group}>
            <CardHeader>
              <CardTitle>{g.group}</CardTitle>
              <Badge status="primary">{g.permissions.length}</Badge>
            </CardHeader>
            <CardBody className="space-y-sm">
              {g.permissions.map((p) => (
                <div key={p.key} className="flex items-start gap-md rounded-md border border-stroke-100 p-md">
                  <div className="grid h-8 w-8 shrink-0 place-items-center rounded-sm bg-primary-50 text-primary">
                    <Icon name="key" size={16} />
                  </div>
                  <div className="flex-1">
                    <div className="text-body-2 font-semibold text-ink">{p.label}</div>
                    <div className="font-mono text-label-3 text-ink-muted">{p.key}</div>
                  </div>
                  {/* Read-only: this page displays which permissions a role
                      holds, it does not grant them. Editing happens on
                      /roles/[roleId]/edit, so the box is disabled and the
                      handler can never fire. */}
                  <Checkbox checked={p.granted} disabled readOnly onChange={() => {}} />
                </div>
              ))}
            </CardBody>
          </Card>
        ))}
      </div>
    </div>
  );
}
