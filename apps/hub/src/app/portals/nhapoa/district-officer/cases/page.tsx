"use client";

import * as React from "react";
import { PortalPageHeader, SearchInput } from "@/components/nhapoa/ui";
import { CaseTable } from "@/components/nhapoa/case-views";
import { useNhapoa } from "@/lib/nhapoa/store/store";
import { doQueue } from "@/lib/nhapoa/case-helpers";
import { Icon, Button, Tabs } from "@mosje/design-system";

type Tab = "all" | "new" | "action";

export default function DOCasesPage() {
  const { state } = useNhapoa();
  const queue = doQueue(state.cases);
  const [tab, setTab] = React.useState<Tab>("all");
  const [q, setQ] = React.useState("");

  const isNew = (s: string) => s === "SUBMITTED";
  const isAction = (s: string) => s === "ASSIGNED" || s === "UNDER_INVESTIGATION" || s === "SENT_BACK";

  const filtered = queue
    .filter((c) => (tab === "all" ? true : tab === "new" ? isNew(c.status) : isAction(c.status)))
    .filter((c) => {
      if (!q.trim()) return true;
      const s = q.toLowerCase();
      return c.refNo.toLowerCase().includes(s) || c.complainant.name.toLowerCase().includes(s) || c.category.toLowerCase().includes(s);
    });

  const tabs: { key: Tab; label: string; count: number }[] = [
    { key: "all", label: "All", count: queue.length },
    { key: "new", label: "New", count: queue.filter((c) => isNew(c.status)).length },
    { key: "action", label: "Action Needed", count: queue.filter((c) => isAction(c.status)).length },
  ];

  return (
    <div>
      <PortalPageHeader
        title="My Cases"
        meta={`${queue.length} cases assigned to your district`}
        actions={<Button appearance="outlined" iconLeft={<Icon name="download" size={16} />}>Export</Button>}
      />

      <SearchInput placeholder="Search by ID, citizen name, category…" value={q} onChange={(e) => setQ(e.target.value)} className="mb-4 max-w-2xl" />

      <div className="mb-5">
        <Tabs
          idBase="do-cases"
          ariaLabel="Case status"
          indicator="pill"
          track="none"
          size="s"
          tabs={tabs.map((t) => ({ id: t.key, label: `${t.label} (${t.count})` }))}
          active={Math.max(0, tabs.findIndex((t) => t.key === tab))}
          onChange={(i) => setTab(tabs[i]!.key)}
        />
      </div>

      <CaseTable cases={filtered} detailBase="/portals/nhapoa/district-officer/cases" />
    </div>
  );
}
