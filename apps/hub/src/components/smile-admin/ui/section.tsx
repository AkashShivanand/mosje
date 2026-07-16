import * as React from "react";
import { cn } from "@/lib/smile-admin/utils";

export function SectionTitle({
  eyebrow,
  title,
  description,
  count,
  children,
  className,
}: {
  eyebrow?: string;
  title?: string;
  description?: string;
  count?: number | string;
  children?: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("flex items-end justify-between gap-md", className)}>
      <div className="min-w-0 space-y-xxs">
        {eyebrow ? (
          <div className="text-label-3 font-semibold uppercase tracking-[0.12em] text-foreground-hint">
            {eyebrow}
          </div>
        ) : null}
        {title ? (
          <div className="flex items-center gap-sm">
            <h2 className="text-headline-5 font-semibold tracking-tight text-foreground">
              {title}
            </h2>
            {count !== undefined ? (
              <span className="inline-flex h-5 min-w-[20px] items-center justify-center rounded-full bg-neutral-100 px-1.5 text-label-3 font-semibold tabular-nums text-foreground-muted ring-1 ring-inset ring-stroke-200">
                {count}
              </span>
            ) : null}
          </div>
        ) : null}
        {description ? (
          <p className="text-body-3 text-foreground-muted">{description}</p>
        ) : null}
      </div>
      {children ? <div className="flex items-center gap-sm">{children}</div> : null}
    </div>
  );
}
