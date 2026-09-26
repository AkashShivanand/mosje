"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Button, Search } from "@mosje/design-system";
import { useSearchSuggestions } from "@/components/website/search/use-search-suggestions";

interface SearchFieldProps {
  /** The query already in the URL, so the field opens showing what was searched. */
  initialQuery?: string;
  /** Focus on mount — only where searching is the reason the reader is here. */
  autoFocus?: boolean;
  /** The visible label. */
  label?: string;
  /** A description under the label, e.g. on the 404 page. */
  hint?: string;
}

/**
 * The site search field with a VISIBLE label and a visible Search button
 * (issues X-SRCH-01, NAV-11) — the DS `Search` atom with the site's
 * autocomplete (`use-search-suggestions`, the combobox pattern the masthead
 * uses), so a reader refining a search meets the control that brought them.
 *
 * The URL is the state: submitting navigates to `/website/search?q=…`, which
 * keeps the back button working and the result set shareable. Suggestions are
 * never the only route — Enter on the raw text always searches [DBIM 9.viii].
 */
export function SearchField({ initialQuery = "", autoFocus = false, label = "Search This Website", hint }: SearchFieldProps) {
  const router = useRouter();
  const [query, setQuery] = React.useState(initialQuery);
  const suggestions = useSearchSuggestions(query);
  const inputRef = React.useRef<HTMLInputElement>(null);
  const id = React.useId();

  React.useEffect(() => {
    if (autoFocus) inputRef.current?.focus();
  }, [autoFocus]);

  const submit = (value: string) => {
    const trimmed = value.trim();
    router.push(trimmed ? `/website/search?q=${encodeURIComponent(trimmed)}` : "/website/search");
  };

  return (
    <form
      className="wn-searchfield"
      role="search"
      aria-label="Site search"
      onSubmit={(e) => {
        e.preventDefault();
        submit(query);
      }}
    >
      <label htmlFor={`${id}-q`} className="wn-searchfield__label">
        {label}
      </label>
      {hint && (
        <p id={`${id}-hint`} className="wn-searchfield__hint">
          {hint}
        </p>
      )}
      <div className="wn-searchfield__row">
        <div className="wn-searchfield__input">
          <Search
            ref={inputRef}
            id={`${id}-q`}
            size="lg"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            onClear={() => setQuery("")}
            suggestions={suggestions}
            onSuggestionSelect={(suggestion) => router.push(suggestion.id)}
            placeholder="Scheme, organisation, document or officer"
            aria-describedby={hint ? `${id}-hint` : undefined}
            name="q"
          />
        </div>
        <Button type="submit" variant="primary" size="lg">
          Search
        </Button>
      </div>
    </form>
  );
}
