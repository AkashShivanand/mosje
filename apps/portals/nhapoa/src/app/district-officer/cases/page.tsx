"use client";

import * as React from "react";
import { Download } from "lucide-react";
import { PageHeader, SearchInput, Button } from "@/components/ui";
import { CaseTable } from "@/components/case-views";
import { useNhapoa } from "@/lib/store/store";
import { doQueue } from "@/lib/case-helpers";
import { cn } from "@/lib/utils";

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
      <PageHeader
        title="My Cases"
        subtitle={`${queue.length} cases assigned to your district`}
        action={<Button variant="outline"><Download className="h-4 w-4" /> Export</Button>}
      />

      <SearchInput placeholder="Search by ID, citizen name, category…" value={q} onChange={(e) => setQ(e.target.value)} className="mb-4 max-w-2xl" />

      <div className="mb-5 flex flex-wrap gap-2">
        {tabs.map((t) => (
          <button
            key={t.key}
            type="button"
            onClick={() => setTab(t.key)}
            className={cn(
              "rounded-lg border px-4 py-2 text-sm font-semibold transition-colors",
              tab === t.key ? "border-navy bg-navy text-white" : "border-line text-ink-muted hover:bg-black/5",
            )}
          >
            {t.label} ({t.count})
          </button>
        ))}
      </div>

      <CaseTable cases={filtered} detailBase="/district-officer/cases" />
    </div>
  );
}
