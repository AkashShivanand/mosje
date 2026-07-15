"use client";

import { Download } from "lucide-react";
import { PageHeader, Button } from "@/components/nhapoa/ui";
import { SimpleCaseTable } from "@/components/nhapoa/case-views";
import { useNhapoa } from "@/lib/nhapoa/store/store";

export default function SentBackPage() {
  const { state } = useNhapoa();
  const cases = state.cases.filter((c) => c.status === "SENT_BACK");
  return (
    <div>
      <PageHeader
        title="Sent Back Cases"
        subtitle={`${cases.length} case${cases.length === 1 ? "" : "s"} returned to DM/DC Offices for rework`}
        action={<Button variant="outline"><Download className="h-4 w-4" /> Export</Button>}
      />
      <SimpleCaseTable cases={cases} dateLabel="Sent Back On" emptyLabel="No cases have been sent back yet." />
    </div>
  );
}
