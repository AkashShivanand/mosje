import * as React from "react";
import { cn } from "@/lib/utils";

export function EmptyState({
  icon,
  title,
  description,
  action,
  className,
}: {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center gap-md rounded-lg border border-dashed border-stroke-300 bg-white px-lg py-3xl text-center",
        className,
      )}
    >
      {icon ? (
        <div className="grid h-14 w-14 place-items-center rounded-full bg-primary-50 text-primary ring-8 ring-primary-50/40">
          {icon}
        </div>
      ) : null}
      <div className="space-y-xs">
        <h3 className="text-title-2 font-semibold text-foreground">{title}</h3>
        {description ? (
          <p className="mx-auto max-w-md text-body-3 text-foreground-muted">{description}</p>
        ) : null}
      </div>
      {action ? <div className="pt-xs">{action}</div> : null}
    </div>
  );
}
