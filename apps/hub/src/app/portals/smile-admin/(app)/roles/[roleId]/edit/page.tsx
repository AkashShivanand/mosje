"use client";

import Link from "next/link";
import { useParams, notFound, useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { ArrowLeft, Save, ShieldCheck } from "lucide-react";
import { Button } from "@/components/smile-admin/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/smile-admin/ui/card";
import { Checkbox } from "@/components/smile-admin/ui/checkbox";
import { Input } from "@/components/smile-admin/ui/input";
import { Label } from "@/components/smile-admin/ui/label";
import { PageHeader } from "@/components/smile-admin/shell/page-header";
import { PERMISSION_MATRIX, ROLES } from "@/lib/smile-admin/mock-data";

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
            <Button variant="outline" size="sm" asChild><Link href="/portals/smile-admin/roles"><ArrowLeft className="h-3.5 w-3.5" /> Cancel</Link></Button>
            <Button size="sm" onClick={() => router.push("/portals/smile-admin/roles")}><Save className="h-3.5 w-3.5" /> Save changes</Button>
          </div>
        }
      />

      <div className="grid gap-lg lg:grid-cols-[1fr_2fr]">
        <Card>
          <CardHeader><CardTitle>Role details</CardTitle></CardHeader>
          <CardContent className="space-y-md">
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
              <div className="text-label-2 uppercase tracking-wide text-foreground-muted">Granted permissions</div>
              <div className="text-display-5 font-bold text-primary">{totalGranted}</div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Permission matrix</CardTitle>
            <span className="inline-flex items-center gap-xs rounded-xs bg-primary-50 px-sm py-1 text-label-3 font-semibold text-primary">
              <ShieldCheck className="h-3 w-3" /> {totalGranted} granted
            </span>
          </CardHeader>
          <CardContent className="space-y-lg">
            {matrix.map((group, gi) => (
              <div key={group.group} className="overflow-hidden rounded-md border border-stroke-200">
                <header className="flex items-center justify-between bg-neutral-50 px-md py-sm">
                  <div className="text-label-1 font-semibold uppercase tracking-wide text-foreground-muted">{group.group}</div>
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
                        <div className="text-body-3 font-semibold text-foreground">{p.label}</div>
                        <div className="font-mono text-label-3 text-foreground-muted">{p.key}</div>
                      </div>
                      <Checkbox
                        checked={p.granted}
                        onCheckedChange={(c) => {
                          const next = matrix.map((g, idx) =>
                            idx === gi
                              ? { ...g, permissions: g.permissions.map((perm, pIdx) => (pIdx === pi ? { ...perm, granted: c === true } : perm)) }
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
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
