import { Breadcrumbs, type Crumb } from "./breadcrumbs";
import { cn } from "@/lib/smile-admin/utils";

export function PageHeader({
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
      <div className="flex flex-wrap items-end justify-between gap-md">
        <div className="min-w-0 space-y-xxs">
          {eyebrow ? (
            <div className="text-label-3 font-semibold uppercase tracking-[0.14em] text-primary">
              {eyebrow}
            </div>
          ) : null}
          <h1 className="text-headline-3 font-bold tracking-tight text-ink sm:text-headline-2">
            {title}
          </h1>
          {subtitle ? (
            <p className="max-w-prose text-body-2 text-ink-muted">{subtitle}</p>
          ) : null}
        </div>
        {actions ? (
          <div className="flex flex-wrap items-center gap-sm">{actions}</div>
        ) : null}
      </div>
      {meta ? <div className="flex flex-wrap items-center gap-md">{meta}</div> : null}
    </header>
  );
}
