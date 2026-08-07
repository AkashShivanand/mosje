"use client";

import Link from "next/link";
import { Icon } from "@mosje/design-system";

export interface Crumb {
  label: string;
  href?: string;
}

export function Breadcrumbs({ items }: { items: Crumb[] }) {
  return (
    <nav aria-label="Breadcrumb" className="flex items-center text-label-2">
      <ol className="flex items-center gap-xs text-ink-muted">
        <li>
          <Link
            href="/portals/smile-admin/dashboard"
            aria-label="Dashboard"
            className="inline-flex items-center gap-xs rounded-sm text-ink-hint transition-colors hover:text-primary"
          >
            <Icon name="home" size={14} />
          </Link>
        </li>
        {items.map((c, i) => {
          const isLast = i === items.length - 1;
          return (
            <li key={i} className="inline-flex items-center gap-xs">
              <Icon name="keyboard_arrow_right" size={12} aria-hidden className="text-stroke-400" />
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
                  className="font-medium text-ink"
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
