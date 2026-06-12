"use client";
import * as React from "react";
import Fuse from "fuse.js";
import { SEARCH_DATA, type SearchEntry } from "@/lib/search-data";
import "./cmd-search.css";

const TYPE_ICONS: Record<SearchEntry["type"], string> = {
  foundation: "🎨",
  component: "🧩",
  resource: "📖",
  page: "🏠",
};

const fuse = new Fuse(SEARCH_DATA, {
  keys: ["title", "keywords", "section"],
  threshold: 0.3,
  includeScore: true,
});

interface CmdSearchProps {
  onClose: () => void;
}

export function CmdSearch({ onClose }: CmdSearchProps): React.JSX.Element {
  const [query, setQuery] = React.useState("");
  const [focusIdx, setFocusIdx] = React.useState(0);
  const inputRef = React.useRef<HTMLInputElement>(null);

  const results = React.useMemo(
    () => query.trim() ? fuse.search(query).map((r) => r.item) : SEARCH_DATA.slice(0, 8),
    [query]
  );

  React.useEffect(() => { inputRef.current?.focus(); }, []);
  React.useEffect(() => { setFocusIdx(0); }, [query]);

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") { e.preventDefault(); setFocusIdx((i) => Math.min(i + 1, results.length - 1)); }
    if (e.key === "ArrowUp")   { e.preventDefault(); setFocusIdx((i) => Math.max(i - 1, 0)); }
    if (e.key === "Escape")    { onClose(); }
    if (e.key === "Enter" && results[focusIdx]) {
      window.location.href = results[focusIdx].href;
      onClose();
    }
  };

  return (
    <div className="cmd-overlay" onClick={onClose} role="dialog" aria-label="Search" aria-modal="true">
      <div className="cmd-modal" onClick={(e) => e.stopPropagation()} onKeyDown={onKeyDown}>
        <div className="cmd-search-row">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
            <circle cx="7" cy="7" r="5.5" stroke="var(--ds-ink-muted)" strokeWidth="1.5" />
            <path d="m11 11 2.5 2.5" stroke="var(--ds-ink-muted)" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
          <input
            ref={inputRef}
            className="cmd-search-input"
            placeholder="Search SAMAVESH…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            aria-label="Search documentation"
            type="search"
          />
          <kbd onClick={onClose} style={{ cursor: "pointer" }}>Esc</kbd>
        </div>
        <div className="cmd-results" role="listbox" aria-label="Search results">
          {results.length === 0 ? (
            <p className="cmd-empty">No results for &ldquo;{query}&rdquo;</p>
          ) : (
            results.map((item, i) => (
              <a
                key={item.href}
                href={item.href}
                className={`cmd-result${i === focusIdx ? " is-focused" : ""}`}
                role="option"
                aria-selected={i === focusIdx}
                onClick={onClose}
              >
                <span className="cmd-result__icon" aria-hidden="true">
                  {TYPE_ICONS[item.type]}
                </span>
                <div>
                  <div className="cmd-result__label">{item.title}</div>
                  <div className="cmd-result__section">{item.section}</div>
                </div>
              </a>
            ))
          )}
        </div>
        <div className="cmd-footer">
          <span><kbd>↑</kbd><kbd>↓</kbd> navigate</span>
          <span><kbd>↵</kbd> open</span>
          <span><kbd>Esc</kbd> close</span>
        </div>
      </div>
    </div>
  );
}
