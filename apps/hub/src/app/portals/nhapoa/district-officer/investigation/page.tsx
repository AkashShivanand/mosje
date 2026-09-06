"use client";

import { PortalPageHeader } from "@/components/nhapoa/ui";
import { CaseTable } from "@/components/nhapoa/case-views";
import { useNhapoa } from "@/lib/nhapoa/store/store";

export default function DOInvestigationPage() {
  const { state } = useNhapoa();
  const cases = state.cases.filter((c) => c.status === "UNDER_INVESTIGATION");
  return (
    <div>
      <PortalPageHeader title="Investigation" meta={`${cases.length} case${cases.length === 1 ? "" : "s"} under active investigation`} />
      <CaseTable cases={cases} detailBase="/portals/nhapoa/district-officer/cases" />
    </div>
  );
}
