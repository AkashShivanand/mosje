import Link from "next/link";
import { SmilePageHeader } from "@/components/smile-admin/shell/page-header";
import type { Crumb } from "./breadcrumbs";
import { EmptyState, Icon, buttonClasses } from "@mosje/design-system";

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
      <SmilePageHeader title={title} subtitle={subtitle} breadcrumbs={breadcrumbs} />
      <EmptyState
        icon={<Icon name="build" size={28} />}
        title="Module under construction"
        description={
          what ??
          "This module is wired into the navigation and routing layer. Detailed views, tables, forms, and analytics are being assembled."
        }
        action={
          <div className="flex flex-wrap items-center justify-center gap-sm">
            <Link href={backHref} className={buttonClasses("primary", "outlined", "md")}>Back to dashboard</Link>
            <Link href="/portals/smile-admin/persons" className={buttonClasses("primary", "filled", "md")}>
                <Icon name="handyman" size={16} /> See a built module
              </Link>
          </div>
        }
      />
    </div>
  );
}
