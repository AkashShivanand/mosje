"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Search } from "@mosje/design-system";
import { useSearchSuggestions } from "./use-search-suggestions";

interface SearchPageFieldProps {
  /** The query already in the URL, so the field opens showing what was searched. */
  initialQuery: string;
  /** Focus on mount. True on the empty state, where searching is the only reason to be here. */
  autoFocus?: boolean;
}

/**
 * The results page's own search field.
 *
 * The SAME `Search` atom as the masthead, with the same autocomplete — a reader
 * who has landed here and wants to refine should not meet a different control
 * from the one that brought them. `[GIGW 5.2]`
 */
export function SearchPageField({ initialQuery, autoFocus = false }: SearchPageFieldProps) {
  const router = useRouter();
  const [query, setQuery] = React.useState(initialQuery);
  const suggestions = useSearchSuggestions(query);
  const inputRef = React.useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    if (autoFocus) inputRef.current?.focus();
  }, [autoFocus]);

  // The URL is the state, so a fresh query is a navigation — which keeps the back
  // button working through a refinement, and keeps the result set shareable.
  const submit = (value: string) => {
    const trimmed = value.trim();
    router.push(trimmed ? `/website/search?q=${encodeURIComponent(trimmed)}` : "/website/search");
  };

  return (
    <Search
      ref={inputRef}
      size="lg"
      value={query}
      onChange={(event) => setQuery(event.target.value)}
      onClear={() => setQuery("")}
      onSubmit={submit}
      suggestions={suggestions}
      onSuggestionSelect={(suggestion) => router.push(suggestion.id)}
      placeholder="Search schemes, organisations, documents…"
      aria-label="Search this website"
    />
  );
}
