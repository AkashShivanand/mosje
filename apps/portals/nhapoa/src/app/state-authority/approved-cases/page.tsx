"use client";

import { Download } from "lucide-react";
import { PageHeader, Button } from "@/components/ui";
import { SimpleCaseTable } from "@/components/case-views";
import { useNhapoa } from "@/lib/store/store";

export default function ApprovedCasesPage() {
  const { state } = useNhapoa();
  const cases = state.cases.filter((c) => ["APPROVED", "DISBURSED", "CLOSED"].includes(c.status));
  return (
    <div>
      <PageHeader
        title="Approved Cases"
        subtitle={`${cases.length} case${cases.length === 1 ? "" : "s"} approved and forwarded to Finance Officer`}
        action={<Button variant="outline"><Download className="h-4 w-4" /> Export</Button>}
      />
      <SimpleCaseTable cases={cases} dateLabel="Approved On" emptyLabel="No approved cases yet." />
    </div>
  );
}
