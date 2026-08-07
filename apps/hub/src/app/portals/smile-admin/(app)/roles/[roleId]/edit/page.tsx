"use client";

import Link from "next/link";
import { useParams, notFound, useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { PageHeader } from "@/components/smile-admin/shell/page-header";
import { PERMISSION_MATRIX, ROLES } from "@/lib/smile-admin/mock-data";
import { Button, Card, CardBody, CardHeader, CardTitle, Checkbox, Icon, Input, Label, buttonClasses } from "@mosje/design-system";

export default function RoleEditPage() {
  const { roleId } = useParams<{ roleId: string }>();
  const router = useRouter();
  const role = ROLES.find((r) => r.id === roleId);
  if (!role) notFound();

  const [name, setName] = useState(role.name);
  const [scope, setScope] = useState(role.scope);
  const [matrix, setMatrix] = useState(PERMISSION_MATRIX);

  const totalGranted = useMemo(
    () => matrix.reduce((s, g) => s + g.permissions.filter((p) => p.granted).length, 0),
    [matrix]
  );

  return (
    <div className="space-y-lg">
      <PageHeader
        breadcrumbs={[{ label: "Access Control" }, { label: "Roles", href: "/portals/smile-admin/roles" }, { label: role.name }]}
        title={`Edit · ${role.name}`}
        subtitle="Adjust scope and permissions for this role. Changes propagate after audit approval."
        actions={
          <div className="flex items-center gap-sm">
            <Link href="/portals/smile-admin/roles" className={buttonClasses("primary", "outlined", "sm")}><Icon name="arrow_back" size={14} /> Cancel</Link>
            <Button size="sm" onClick={() => router.push("/portals/smile-admin/roles")}><Icon name="save" size={14} /> Save changes</Button>
          </div>
        }
      />

      <div className="grid gap-lg lg:grid-cols-[1fr_2fr]">
        <Card>
          <CardHeader><CardTitle>Role details</CardTitle></CardHeader>
          <CardBody className="space-y-md">
            <div className="space-y-xs">
              <Label htmlFor="role-name">Role name</Label>
              <Input id="role-name" value={name} onChange={(e) => setName(e.target.value)} />
            </div>
            <div className="space-y-xs">
              <Label htmlFor="scope">Scope</Label>
              <select id="scope" className="h-10 w-full rounded-md border border-stroke-300 bg-white px-md text-body-2 shadow-xs hover:border-stroke-400 focus:border-primary" value={scope} onChange={(e) => setScope(e.target.value as typeof scope)}>
                <option>Central</option>
                <option>State</option>
                <option>District</option>
                <option>Field</option>
              </select>
            </div>
            <div className="rounded-md bg-primary-50/60 p-md">
              <div className="text-label-2 uppercase tracking-wide text-ink-muted">Granted permissions</div>
              <div className="text-display-5 font-bold text-primary">{totalGranted}</div>
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Permission matrix</CardTitle>
            <span className="inline-flex items-center gap-xs rounded-xs bg-primary-50 px-sm py-1 text-label-3 font-semibold text-primary">
              <Icon name="verified_user" size={12} /> {totalGranted} granted
            </span>
          </CardHeader>
          <CardBody className="space-y-lg">
            {matrix.map((group, gi) => (
              <div key={group.group} className="overflow-hidden rounded-md border border-stroke-200">
                <header className="flex items-center justify-between bg-neutral-50 px-md py-sm">
                  <div className="text-label-1 font-semibold uppercase tracking-wide text-ink-muted">{group.group}</div>
                  <button
                    className="text-label-3 font-semibold text-info hover:underline"
                    onClick={() => {
                      const allOn = group.permissions.every((p) => p.granted);
                      const next = matrix.map((g, idx) =>
                        idx === gi ? { ...g, permissions: g.permissions.map((p) => ({ ...p, granted: !allOn })) } : g
                      );
                      setMatrix(next);
                    }}
                  >
                    Toggle all
                  </button>
                </header>
                <ul className="divide-y divide-stroke-100">
                  {group.permissions.map((p, pi) => (
                    <li key={p.key} className="flex items-center justify-between gap-md px-md py-sm">
                      <div>
                        <div className="text-body-3 font-semibold text-ink">{p.label}</div>
                        <div className="font-mono text-label-3 text-ink-muted">{p.key}</div>
                      </div>
                      <Checkbox
                        checked={p.granted}
                        onChange={(e) => {
                          const next = matrix.map((g, idx) =>
                            idx === gi
                              ? { ...g, permissions: g.permissions.map((perm, pIdx) => (pIdx === pi ? { ...perm, granted: e.target.checked === true } : perm)) }
                              : g
                          );
                          setMatrix(next);
                        }}
                      />
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </CardBody>
        </Card>
      </div>
    </div>
  );
}
