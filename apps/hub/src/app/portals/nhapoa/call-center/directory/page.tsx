"use client";

import * as React from "react";
import { PortalPageHeader, SearchInput } from "@/components/nhapoa/ui";
import { useNhapoa } from "@/lib/nhapoa/store/store";
import { ROLES } from "@/lib/nhapoa/roles";
import type { RoleId } from "@/lib/nhapoa/store/types";
import { Card } from "@mosje/design-system";

export default function DirectoryPage() {
  const { state } = useNhapoa();
  const [q, setQ] = React.useState("");

  const officers = state.users.map((u) => ({
    name: u.name,
    username: u.username,
    role: ROLES[u.role as Exclude<RoleId, "citizen">]?.label ?? u.role,
    email: `${u.username}@sambal-test.local`,
    location: [u.district, u.state].filter(Boolean).join(", ") || "—",
  }));

  const rows = officers.filter((o) => !q.trim() || o.name.toLowerCase().includes(q.toLowerCase()) || o.username.toLowerCase().includes(q.toLowerCase()) || o.role.toLowerCase().includes(q.toLowerCase()));

  return (
    <div>
      <PortalPageHeader title="Directory Search" meta={`${officers.length} officers across all states`} />
      <SearchInput placeholder="Name, username or role (e.g. Nodal, SHO)…" value={q} onChange={(e) => setQ(e.target.value)} className="mb-4 max-w-2xl" />
      {rows.length === 0 ? (
        <Card className="px-6 py-16 text-center text-body-2 text-ink-muted">No officers match your search.</Card>
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-line bg-white shadow-card">
          <table className="w-full min-w-[720px] text-left text-body-2">
            <thead>
              <tr className="border-b border-line text-label-3 uppercase text-ink-hint">
                <th className="px-5 py-3.5 font-semibold">Name</th>
                <th className="px-5 py-3.5 font-semibold">Type of Officer</th>
                <th className="px-5 py-3.5 font-semibold">Email</th>
                <th className="px-5 py-3.5 font-semibold">Location</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {rows.map((o) => (
                <tr key={o.username} className="hover:bg-surface-muted/60">
                  <td className="px-5 py-4"><div className="font-medium text-ink">{o.name}</div><div className="font-mono text-body-3 text-ink-hint">{o.username}</div></td>
                  <td className="px-5 py-4 text-ink">{o.role}</td>
                  <td className="px-5 py-4 font-mono text-body-3 text-ink-muted">{o.email}</td>
                  <td className="px-5 py-4 text-ink-muted">{o.location}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
