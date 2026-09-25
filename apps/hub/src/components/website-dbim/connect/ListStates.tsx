"use client";
/*
 * The list states every Media and Connect list shares (data-state-completeness.md):
 * the reader's own filter matched nothing, and the pager under a long list.
 * "Empty" is the kit's DbimEmptyState, rendered by each list.
 */
import * as React from "react";
import { Button } from "@mosje/design-system";
import { DbimPagination } from "@/components/website-dbim/ui/Pagination";

/** "Filtered to nothing": names what narrowed the list and offers to clear it. */
export function DbimNoMatch({ what, noun, onClear }: { what: string; noun: string; onClear: () => void }) {
  return (
    <div className="db-mc-nomatch" role="status">
      <span>
        No {noun} match {what}.
      </span>
      <Button appearance="text" size="sm" onClick={onClear}>
        Clear Filters
      </Button>
    </div>
  );
}

/** The pager; turning the page brings the top of the list back into view. */
export function DbimPager({ page, pageCount, onChange, target }: {
  page: number;
  pageCount: number;
  onChange: (n: number) => void;
  target: React.RefObject<HTMLElement | null>;
}) {
  if (pageCount <= 1) return null;
  return (
    <div className="db-mc-pager">
      <DbimPagination
        page={page}
        pageCount={pageCount}
        onChange={(p) => {
          onChange(p);
          target.current?.scrollIntoView({ block: "start" });
        }}
      />
    </div>
  );
}

/** "the search “x”", "the letter B", "the chosen category" — joined for DbimNoMatch. */
export function describeFilters(parts: (string | false | undefined)[]): string {
  const p = parts.filter((x): x is string => Boolean(x));
  if (p.length <= 1) return p[0] ?? "the chosen filters";
  return `${p.slice(0, -1).join(", ")} and ${p[p.length - 1]}`;
}
