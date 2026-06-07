"use client";

import { useState } from "react";
import { KeyRound } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { PageHeader } from "@/components/shell/page-header";
import { DataToolbar, SearchField } from "@/components/data/data-toolbar";
import { PERMISSION_MATRIX } from "@/lib/mock-data";

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
              <Badge tone="primary">{g.permissions.length}</Badge>
            </CardHeader>
            <CardContent className="space-y-sm">
              {g.permissions.map((p) => (
                <div key={p.key} className="flex items-start gap-md rounded-md border border-stroke-100 p-md">
                  <div className="grid h-8 w-8 shrink-0 place-items-center rounded-sm bg-primary-50 text-primary">
                    <KeyRound className="h-4 w-4" />
                  </div>
                  <div className="flex-1">
                    <div className="text-body-2 font-semibold text-foreground">{p.label}</div>
                    <div className="font-mono text-label-3 text-foreground-muted">{p.key}</div>
                  </div>
                  <Checkbox checked={p.granted} disabled />
                </div>
              ))}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
