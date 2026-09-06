"use client";

import { PortalPageHeader, Button } from "@/components/nhapoa/ui";
import { SimpleCaseTable } from "@/components/nhapoa/case-views";
import { useNhapoa } from "@/lib/nhapoa/store/store";
import { Icon } from "@mosje/design-system";

export default function SentBackPage() {
  const { state } = useNhapoa();
  const cases = state.cases.filter((c) => c.status === "SENT_BACK");
  return (
    <div>
      <PortalPageHeader
        title="Sent Back Cases"
        meta={`${cases.length} case${cases.length === 1 ? "" : "s"} returned to DM/DC Offices for rework`}
        actions={<Button variant="outline"><Icon name="download" size={16} /> Export</Button>}
      />
      <SimpleCaseTable cases={cases} dateLabel="Sent Back On" emptyLabel="No cases have been sent back yet." />
    </div>
  );
}
