"use client";

import { PageHeader, Button } from "@/components/nhapoa/ui";
import { SimpleCaseTable } from "@/components/nhapoa/case-views";
import { useNhapoa } from "@/lib/nhapoa/store/store";
import { Icon } from "@mosje/design-system";

export default function ApprovedCasesPage() {
  const { state } = useNhapoa();
  const cases = state.cases.filter((c) => ["APPROVED", "DISBURSED", "CLOSED"].includes(c.status));
  return (
    <div>
      <PageHeader
        title="Approved Cases"
        subtitle={`${cases.length} case${cases.length === 1 ? "" : "s"} approved and forwarded to Finance Officer`}
        action={<Button variant="outline"><Icon name="download" size={16} /> Export</Button>}
      />
      <SimpleCaseTable cases={cases} dateLabel="Approved On" emptyLabel="No approved cases yet." />
    </div>
  );
}
