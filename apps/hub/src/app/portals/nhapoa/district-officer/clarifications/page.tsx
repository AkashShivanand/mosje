"use client";

import { PortalPageHeader, Card } from "@/components/nhapoa/ui";
import { Icon } from "@mosje/design-system";

export default function DOClarificationsPage() {
  return (
    <div>
      <PortalPageHeader title="Clarifications" meta="0 clarifications · 0 citizen responses requiring your action" />
      <Card className="flex flex-col items-center justify-center px-6 py-20 text-center">
        <Icon name="feedback" size={40} className="text-ink-hint" />
        <p className="mt-4 text-title-3 text-ink">No open clarifications.</p>
        <p className="mt-1 text-body-3 text-ink-hint">Raise a clarification from any case to request more information from the citizen.</p>
      </Card>
    </div>
  );
}
