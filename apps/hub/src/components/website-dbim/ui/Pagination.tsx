"use client";

import { Button, Icon, IconButton } from "@mosje/design-system";
import "./ui.css";

export interface DbimPaginationProps {
  page: number;
  pageCount: number;
  onChange: (page: number) => void;
  label?: string;
  className?: string;
}

/**
 * The pages to show, with "…" gaps — the reference's pattern: on page 1 of 11 it
 * reads 1 2 3 4 … 11. Near either end four pages show beside the far end; in the
 * middle, the current page and its neighbours sit between the first and last.
 */
export function dbimPageItems(page: number, count: number): (number | "gap")[] {
  if (count <= 6) return Array.from({ length: count }, (_, i) => i + 1);
  if (page <= 3) return [1, 2, 3, 4, "gap", count];
  if (page >= count - 2) return [1, "gap", count - 3, count - 2, count - 1, count];
  return [1, "gap", page - 1, page, page + 1, "gap", count];
}

/** The reference's round-numbered pager, centred under a list. Renders nothing for one page. */
export function DbimPagination({ page, pageCount, onChange, label = "Pagination", className }: DbimPaginationProps) {
  if (pageCount <= 1) return null;
  const items = dbimPageItems(page, pageCount);
  return (
    <nav aria-label={label} className={["db-pager", className].filter(Boolean).join(" ")}>
      <ul className="db-pager__list">
        <li>
          <IconButton
            variant="neutral"
            appearance="text"
            className="db-pager__step"
            aria-label="Previous page"
            disabled={page <= 1}
            onClick={() => onChange(page - 1)}
            icon={<Icon name="chevron_left" size={24} weight={700} />}
          />
        </li>
        {items.map((it, i) =>
          it === "gap" ? (
            <li key={`gap-${i}`} className="db-pager__gap" aria-hidden="true">
              ...
            </li>
          ) : (
            <li key={it}>
              <Button
                variant="neutral"
                appearance="text"
                className={it === page ? "db-pager__page is-current" : "db-pager__page"}
                aria-label={`Page ${it}`}
                aria-current={it === page ? "page" : undefined}
                onClick={() => onChange(it)}
              >
                {it}
              </Button>
            </li>
          ),
        )}
        <li>
          <IconButton
            variant="neutral"
            appearance="text"
            className="db-pager__step"
            aria-label="Next page"
            disabled={page >= pageCount}
            onClick={() => onChange(page + 1)}
            icon={<Icon name="chevron_right" size={24} weight={700} />}
          />
        </li>
      </ul>
    </nav>
  );
}
