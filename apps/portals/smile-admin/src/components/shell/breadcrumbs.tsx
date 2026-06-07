"use client";

import Link from "next/link";
import { ChevronRight, Home } from "lucide-react";

export interface Crumb {
  label: string;
  href?: string;
}

export function Breadcrumbs({ items }: { items: Crumb[] }) {
  return (
    <nav aria-label="Breadcrumb" className="flex items-center text-label-2">
      <ol className="flex items-center gap-xs text-foreground-muted">
        <li>
          <Link
            href="/dashboard"
            aria-label="Dashboard"
            className="inline-flex items-center gap-xs rounded-sm text-foreground-hint transition-colors hover:text-primary"
          >
            <Home className="h-3.5 w-3.5" />
          </Link>
        </li>
        {items.map((c, i) => {
          const isLast = i === items.length - 1;
          return (
            <li key={i} className="inline-flex items-center gap-xs">
              <ChevronRight aria-hidden className="h-3 w-3 text-stroke-400" />
              {c.href && !isLast ? (
                <Link
                  href={c.href}
                  className="rounded-sm transition-colors hover:text-primary"
                >
                  {c.label}
                </Link>
              ) : (
                <span
                  aria-current={isLast ? "page" : undefined}
                  className="font-medium text-foreground"
                >
                  {c.label}
                </span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
