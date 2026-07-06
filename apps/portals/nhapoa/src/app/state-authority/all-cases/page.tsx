"use client";

import * as React from "react";
import { PageHeader, SearchInput } from "@/components/ui";
import { SimpleCaseTable } from "@/components/case-views";
import { useNhapoa } from "@/lib/store/store";

export default function AllCasesPage() {
  const { state } = useNhapoa();
  const [q, setQ] = React.useState("");
  const cases = state.cases.filter((c) => !q.trim() || c.refNo.toLowerCase().includes(q.toLowerCase()) || c.complainant.name.toLowerCase().includes(q.toLowerCase()) || c.category.toLowerCase().includes(q.toLowerCase()));
  return (
    <div>
      <PageHeader title="All Cases" subtitle={`${state.cases.length} cases across your jurisdiction`} />
      <SearchInput placeholder="Search by ID, citizen name, category…" value={q} onChange={(e) => setQ(e.target.value)} className="mb-4 max-w-2xl" />
      <SimpleCaseTable cases={cases} />
    </div>
  );
}
