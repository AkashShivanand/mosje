import Link from "next/link";
import { Icon } from "@mosje/design-system";

export interface Crumb {
  label: string;
  href?: string;
}

/** GIGW-compliant breadcrumb: a labelled nav landmark with an ordered list and aria-current. */
export function Breadcrumb({ items }: { items: Crumb[] }) {
  return (
    <nav aria-label="Breadcrumb">
      <ol className="flex flex-wrap items-center gap-1.5 text-[13px] text-ink-muted">
        <li className="flex items-center gap-1.5">
          <Link href="/website" className="flex items-center gap-1 hover:text-primary hover:underline">
            <Icon name="home" size={14} />
            <span>Home</span>
          </Link>
        </li>
        {items.map((c, i) => {
          const isLast = i === items.length - 1;
          return (
            <li key={`${c.label}-${i}`} className="flex items-center gap-1.5">
              <Icon name="keyboard_arrow_right" size={14} className="text-gray-400" aria-hidden="true" />
              {c.href && !isLast ? (
                <Link href={c.href} className="hover:text-primary hover:underline">
                  {c.label}
                </Link>
              ) : (
                <span aria-current="page" className="font-medium text-ink">
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
