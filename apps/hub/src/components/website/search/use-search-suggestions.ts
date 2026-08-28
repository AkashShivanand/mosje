"use client";

import * as React from "react";
import type { SearchSuggestion } from "@mosje/design-system";
import { facetLabel, type WebsiteSearchType } from "@/lib/website/search/types";

/** How long the field stays quiet after the last keystroke. */
const DEBOUNCE_MS = 150;

/** Below this, a query matches so much that suggesting from it is noise. */
const MIN_LENGTH = 2;

interface ApiSuggestion {
  title: string;
  description: string;
  href: string;
  type: WebsiteSearchType;
  section: string;
  iconName: string;
}

/**
 * Autocomplete rows for a query, fetched from `/api/website/search`.
 *
 * THREE THINGS THIS GETS RIGHT that a naive fetch-on-keystroke does not:
 *
 *  1. It DEBOUNCES (150ms). Typing "scholarship" is eleven keystrokes and would
 *     otherwise be eleven requests, ten of them already stale on arrival.
 *  2. It ABORTS the in-flight request when a new one starts, so a slow response
 *     for "sch" cannot land after a fast one for "scholarship" and overwrite it.
 *     Out-of-order responses are the classic autocomplete bug and they are far
 *     more likely on the connections this site is actually used over.
 *  3. It returns the LAST GOOD rows while a new query is in flight, rather than
 *     emptying the list. An autocomplete that blanks between keystrokes flickers,
 *     and a list that disappears under the pointer is a WCAG 1.4.13 problem as
 *     well as an irritating one.
 */
/**
 * Stable empty array.
 *
 * Identity matters here: `Search` resets its keyboard highlight whenever the
 * `suggestions` reference changes, so returning a fresh `[]` each render would
 * clear the highlight on every keystroke and make the arrow keys unusable.
 */
const NONE: SearchSuggestion[] = [];

export function useSearchSuggestions(query: string): SearchSuggestion[] {
  const [fetched, setFetched] = React.useState<SearchSuggestion[]>(NONE);
  const trimmed = query.trim();

  React.useEffect(() => {
    const term = query.trim();
    // Too short to suggest from. Handled during render below rather than by
    // clearing state here — a setState in an effect body costs a second render
    // pass on every keystroke.
    if (term.length < MIN_LENGTH) return;

    const controller = new AbortController();
    const timer = setTimeout(() => {
      fetch(`/api/website/search?q=${encodeURIComponent(term)}`, {
        signal: controller.signal,
      })
        .then((response) => (response.ok ? response.json() : null))
        .then((data: { suggestions?: ApiSuggestion[] } | null) => {
          if (!data?.suggestions) return;
          setFetched(
            data.suggestions.map((item) => ({
              id: item.href,
              label: item.title,
              description: item.description,
              group: facetLabel(item.type),
              iconName: item.iconName,
            })),
          );
        })
        .catch(() => {
          // An aborted or failed lookup leaves the previous rows in place. The
          // reader can always press Enter — suggestions are never the only route.
        });
    }, DEBOUNCE_MS);

    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [query]);

  return trimmed.length < MIN_LENGTH ? NONE : fetched;
}
