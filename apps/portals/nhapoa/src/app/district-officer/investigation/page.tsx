"use client";

import { PageHeader } from "@/components/ui";
import { CaseTable } from "@/components/case-views";
import { useNhapoa } from "@/lib/store/store";

export default function DOInvestigationPage() {
  const { state } = useNhapoa();
  const cases = state.cases.filter((c) => c.status === "UNDER_INVESTIGATION");
  return (
    <div>
      <PageHeader title="Investigation" subtitle={`${cases.length} case${cases.length === 1 ? "" : "s"} under active investigation`} />
      <CaseTable cases={cases} detailBase="/district-officer/cases" />
    </div>
  );
}
