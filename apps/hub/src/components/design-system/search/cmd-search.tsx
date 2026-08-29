"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import Fuse from "fuse.js";
import { Icon } from "@mosje/design-system";
import { SEARCH_DATA, type SearchEntry } from "@/lib/design-system/search-data.generated";
import "./cmd-search.css";

type CategoryFilter = "all" | "component" | "foundation" | "pattern" | "resource";

interface CategoryTab {
  id: CategoryFilter;
  label: string;
  type?: SearchEntry["type"];
  icon: string;
}

const CATEGORIES: CategoryTab[] = [
  { id: "all", label: "All", icon: "search" },
  { id: "component", label: "Components", type: "component", icon: "widgets" },
  { id: "foundation", label: "Foundations", type: "foundation", icon: "palette" },
  { id: "pattern", label: "Patterns", type: "pattern", icon: "dashboard_customize" },
  { id: "resource", label: "Resources", type: "resource", icon: "menu_book" },
];

const fuse = new Fuse(SEARCH_DATA, {
  keys: [
    { name: "title", weight: 0.5 },
    { name: "keywords", weight: 0.3 },
    { name: "description", weight: 0.15 },
    { name: "section", weight: 0.05 },
  ],
  threshold: 0.35,
  includeScore: true,
});

/** Quick popular search shortcuts shown when query is empty. */
const POPULAR_PAGES = SEARCH_DATA.filter((item) =>
  [
    "Button",
    "Color",
    "Typography",
    "Tabs",
    "Accessibility Bar",
    "Data Table",
    "Aadhaar Input",
    "Modal Dialog",
    "Design Tokens",
  ].includes(item.title)
);

function highlightMatch(text: string, query: string): React.ReactNode {
  if (!query.trim()) return text;
  const parts = text.split(new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")})`, "gi"));
  return parts.map((part, i) =>
    part.toLowerCase() === query.toLowerCase() ? (
      <mark key={i} className="cmd-highlight">
        {part}
      </mark>
    ) : (
      part
    )
  );
}

interface CmdSearchProps {
  onClose: () => void;
}

export function CmdSearch({ onClose }: CmdSearchProps): React.JSX.Element {
  const router = useRouter();
  const [query, setQuery] = React.useState("");
  const [category, setCategory] = React.useState<CategoryFilter>("all");
  const [focusIdx, setFocusIdx] = React.useState(0);
  const inputRef = React.useRef<HTMLInputElement>(null);
  const resultListRef = React.useRef<HTMLDivElement>(null);
  const activeItemRef = React.useRef<HTMLAnchorElement | null>(null);

  // Compute filtered search results
  const results = React.useMemo(() => {
    let pool: SearchEntry[];
    const trimmed = query.trim();

    if (trimmed) {
      pool = fuse.search(trimmed).map((r) => r.item);
    } else {
      pool = category === "all" ? POPULAR_PAGES : SEARCH_DATA;
    }

    if (category !== "all") {
      pool = pool.filter((item) => item.type === category);
    }

    return trimmed ? pool.slice(0, 20) : pool.slice(0, 10);
  }, [query, category]);

  // Focus input on mount and lock background scroll
  React.useEffect(() => {
    inputRef.current?.focus();
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prevOverflow;
    };
  }, []);

  // Scroll focused element into view smoothly during arrow key navigation
  React.useEffect(() => {
    if (activeItemRef.current) {
      activeItemRef.current.scrollIntoView({ block: "nearest" });
    }
  }, [focusIdx]);

  const navigateTo = (href: string) => {
    onClose();
    router.push(href);
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setFocusIdx((i) => (results.length > 0 ? Math.min(i + 1, results.length - 1) : 0));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setFocusIdx((i) => Math.max(i - 1, 0));
    } else if (e.key === "Escape") {
      e.preventDefault();
      onClose();
    } else if (e.key === "Enter" && results[focusIdx]) {
      e.preventDefault();
      navigateTo(results[focusIdx].href);
    }
  };

  return (
    <div
      className="cmd-overlay"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Search SAMAVESH documentation"
    >
      <div className="cmd-modal" onClick={(e) => e.stopPropagation()} onKeyDown={onKeyDown}>
        {/* Search Header Input Row */}
        <div className="cmd-search-row">
          <Icon name="search" size={20} className="cmd-search-icon" />
          <input
            ref={inputRef}
            className="cmd-search-input"
            placeholder="Search components, foundations, tokens, patterns…"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setFocusIdx(0);
            }}
            aria-label="Search documentation"
            aria-autocomplete="list"
            aria-controls="cmd-results-list"
            aria-expanded={results.length > 0}
            type="search"
            role="combobox"
          />
          {query.length > 0 && (
            <button
              className="cmd-clear-btn"
              onClick={() => {
                setQuery("");
                setFocusIdx(0);
                inputRef.current?.focus();
              }}
              aria-label="Clear search input"
              type="button"
            >
              <Icon name="close" size={16} />
            </button>
          )}
          <kbd onClick={onClose} className="cmd-esc-badge" title="Close search (Esc)">
            Esc
          </kbd>
        </div>

        {/* Category Filter Chips */}
        <div className="cmd-categories" role="tablist" aria-label="Filter results by category">
          {CATEGORIES.map((tab) => {
            const isSelected = category === tab.id;
            return (
              <button
                key={tab.id}
                role="tab"
                aria-selected={isSelected}
                className={`cmd-cat-pill${isSelected ? " is-active" : ""}`}
                onClick={() => {
                  setCategory(tab.id);
                  setFocusIdx(0);
                  inputRef.current?.focus();
                }}
                type="button"
              >
                <Icon name={tab.icon} size={16} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Screen Reader Result Announcement */}
        <div className="cmd-sr-status" role="status" aria-live="polite">
          {query.trim()
            ? `${results.length} result${results.length === 1 ? "" : "s"} found for ${query}`
            : ""}
        </div>

        {/* Results Container */}
        <div
          ref={resultListRef}
          id="cmd-results-list"
          className="cmd-results"
          role="listbox"
          aria-label="Search results"
        >
          {results.length === 0 ? (
            <div className="cmd-empty">
              <Icon name="search_off" size={32} className="cmd-empty__icon" />
              <p className="cmd-empty__title">
                No matching results for &ldquo;<strong>{query}</strong>&rdquo;
              </p>
              <p className="cmd-empty__desc">
                Try searching with broader terms or check spelling.
              </p>
              <div className="cmd-empty__suggestions">
                <span className="cmd-empty__suggestion-label">Suggested searches:</span>
                {["Button", "Color", "Accessibility Bar", "Tabs", "Tokens"].map((term) => (
                  <button
                    key={term}
                    className="cmd-empty__chip"
                    onClick={() => {
                      setQuery(term);
                      setFocusIdx(0);
                      inputRef.current?.focus();
                    }}
                    type="button"
                  >
                    {term}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <>
              {!query.trim() && (
                <div className="cmd-results__section-title">
                  {category === "all" ? "Popular Documentation" : `${CATEGORIES.find((c) => c.id === category)?.label}`}
                </div>
              )}
              {results.map((item, i) => {
                const isFocused = i === focusIdx;
                return (
                  <a
                    key={item.href}
                    ref={isFocused ? (el) => { activeItemRef.current = el; } : undefined}
                    href={item.href}
                    className={`cmd-result${isFocused ? " is-focused" : ""}`}
                    role="option"
                    aria-selected={isFocused}
                    onClick={(e) => {
                      e.preventDefault();
                      navigateTo(item.href);
                    }}
                  >
                    <span className="cmd-result__icon" aria-hidden="true">
                      <Icon name={item.iconName || "description"} size={20} />
                    </span>
                    <div className="cmd-result__body">
                      <div className="cmd-result__header">
                        <span className="cmd-result__label">
                          {highlightMatch(item.title, query)}
                        </span>
                        {item.badge && (
                          <span className={`cmd-result__badge cmd-result__badge--${item.badge.toLowerCase()}`}>
                            {item.badge}
                          </span>
                        )}
                        <span className="cmd-result__section">{item.section}</span>
                      </div>
                      <div className="cmd-result__desc">
                        {highlightMatch(item.description, query)}
                      </div>
                    </div>
                    <div className="cmd-result__action" aria-hidden="true">
                      <Icon name="arrow_forward" size={16} />
                    </div>
                  </a>
                );
              })}
            </>
          )}
        </div>

        {/* Footer Navigation Hints */}
        <div className="cmd-footer">
          <div className="cmd-footer__hints">
            <span>
              <kbd>↑</kbd>
              <kbd>↓</kbd> navigate
            </span>
            <span>
              <kbd>↵</kbd> select
            </span>
            <span>
              <kbd>Esc</kbd> close
            </span>
          </div>
          <span className="cmd-footer__count">
            {results.length} item{results.length === 1 ? "" : "s"}
          </span>
        </div>
      </div>
    </div>
  );
}

