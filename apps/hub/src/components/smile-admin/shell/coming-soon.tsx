import Link from "next/link";
import { Hammer, Wrench } from "lucide-react";
import { Button } from "@/components/smile-admin/ui/button";
import { EmptyState } from "@/components/smile-admin/ui/empty-state";
import { PageHeader } from "@/components/smile-admin/shell/page-header";
import type { Crumb } from "./breadcrumbs";

export function ComingSoon({
  title,
  subtitle,
  breadcrumbs,
  backHref = "/portals/smile-admin/dashboard",
  what,
}: {
  title: string;
  subtitle?: string;
  breadcrumbs: Crumb[];
  backHref?: string;
  what?: string;
}) {
  return (
    <div className="space-y-lg">
      <PageHeader title={title} subtitle={subtitle} breadcrumbs={breadcrumbs} />
      <EmptyState
        icon={<Wrench className="h-7 w-7" />}
        title="Module under construction"
        description={
          what ??
          "This module is wired into the navigation and routing layer. Detailed views, tables, forms, and analytics are being assembled."
        }
        action={
          <div className="flex flex-wrap items-center justify-center gap-sm">
            <Button variant="outline" asChild>
              <Link href={backHref}>Back to dashboard</Link>
            </Button>
            <Button asChild>
              <Link href="/portals/smile-admin/persons">
                <Hammer className="h-4 w-4" /> See a built module
              </Link>
            </Button>
          </div>
        }
      />
    </div>
  );
}
