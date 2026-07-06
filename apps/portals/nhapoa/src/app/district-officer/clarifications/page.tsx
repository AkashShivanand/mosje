"use client";

import { MessageSquareWarning } from "lucide-react";
import { PageHeader, Card } from "@/components/ui";

export default function DOClarificationsPage() {
  return (
    <div>
      <PageHeader title="Clarifications" subtitle="0 clarifications · 0 citizen responses requiring your action" />
      <Card className="flex flex-col items-center justify-center px-6 py-20 text-center">
        <MessageSquareWarning className="h-10 w-10 text-ink-hint" />
        <p className="mt-4 text-sm font-semibold text-ink">No open clarifications.</p>
        <p className="mt-1 text-xs text-ink-hint">Raise a clarification from any case to request more information from the citizen.</p>
      </Card>
    </div>
  );
}
