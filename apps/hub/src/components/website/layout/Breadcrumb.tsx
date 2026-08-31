import Link from "next/link";
import { Icon } from "@mosje/design-system";

export interface Crumb {
  label: string;
  href?: string;
}

/**
 * GIGW-compliant breadcrumb: a labelled nav landmark, an ordered list, and
 * `aria-current="page"` on the LAST crumb only.
 *
 * ── WHY THE `isLast` TEST IS ON THE ARIA, NOT JUST THE LINK ──────────────────
 * A crumb renders as plain text in two quite different situations: it is the
 * page you are on, or it is a section that has no landing page. This estate uses
 * the second constantly — "Department", "Documents", "Connect", "Associated
 * Organisations" are mega-menu categories with no route behind them, and 64
 * pages pass one as a middle crumb.
 *
 * The old markup treated both the same and stamped `aria-current="page"` on
 * every text crumb. On all 64 of those pages a screen-reader user was told twice
 * that they were on the current page, once about a section they were not on.
 * `aria-current` marks exactly one thing; two is worse than none, because the
 * wrong one comes first.
 *
 * ── IS A NON-LINKED MIDDLE CRUMB GOOD PRACTICE? ──────────────────────────────
 * It is defensible and it is this estate's convention: the trail describes where
 * the page sits, and a section is a real level of that hierarchy even when it
 * has no page of its own. What is NOT defensible is offering it as a link to
 * somewhere it does not go — "Associated Organisations" used to point at
 * `/website`, which is exactly where the Home crumb beside it already went.
 * Label it, do not link it, and do not claim it is the current page.
 */
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
              ) : isLast ? (
                <span aria-current="page" className="font-medium text-ink">
                  {c.label}
                </span>
              ) : (
                /* A section with no landing page. Not a link, and NOT the
                   current page — so it carries neither an href nor aria-current. */
                <span className="text-ink-muted">{c.label}</span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
