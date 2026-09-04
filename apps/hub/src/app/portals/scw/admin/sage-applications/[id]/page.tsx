import Link from "next/link";
import { Button, Card, StatusPill } from "@/components/scw/ui";
import { SAGE_DETAIL } from "@/lib/scw/mock-data";
import { DetailTabs } from "./detail-tabs";
import { Icon } from "@mosje/design-system";

export default async function SageApplicationDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await params;

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link
            href="/portals/scw/admin/sage-applications"
            aria-label="Back to SAGE Applications"
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-line text-ink-muted transition-colors hover:bg-black/5"
          >
            <Icon name="arrow_back" size={20} />
          </Link>
          <h1 className="text-headline-1 text-ink">{SAGE_DETAIL.organisation}</h1>
          <StatusPill status={SAGE_DETAIL.status} />
        </div>
        <div className="flex items-center gap-3">
          <Button variant="danger">Reject</Button>
          <Button variant="outline">Approve</Button>
        </div>
      </div>

      <Card className="p-6 sm:p-8">
        <DetailTabs detail={SAGE_DETAIL} />
      </Card>

      <p className="mt-4 px-1 text-body-3 text-ink-hint">
        Submitted on {SAGE_DETAIL.submitted} · Last updated {SAGE_DETAIL.updated}
      </p>
    </div>
  );
}
