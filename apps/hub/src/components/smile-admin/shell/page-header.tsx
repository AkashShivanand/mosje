import { PageHeader as DsPageHeader } from "@mosje/design-system";
import { Breadcrumbs, type Crumb } from "./breadcrumbs";
import { cn } from "@/lib/smile-admin/utils";

/**
 * The page's opening block — a trail, the design system's `PageHeader`, and a
 * row of page-level metadata beneath it.
 *
 * The title block is the system's, so it receives the system's fixes; what is
 * smile-admin's is the trail above and the meta row below, neither of which the
 * system models. That is also why this does not carry the system's name: an
 * import of `PageHeader` here used to resolve to either one, silently.
 */
export function SmilePageHeader({
  eyebrow,
  title,
  subtitle,
  breadcrumbs,
  actions,
  meta,
  className,
}: {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  breadcrumbs?: Crumb[];
  actions?: React.ReactNode;
  meta?: React.ReactNode;
  className?: string;
}) {
  return (
    <header className={cn("space-y-sm", className)}>
      {breadcrumbs ? <Breadcrumbs items={breadcrumbs} /> : null}
      <DsPageHeader eyebrow={eyebrow} title={title} meta={subtitle} actions={actions} />
      {meta ? <div className="flex flex-wrap items-center gap-md">{meta}</div> : null}
    </header>
  );
}
