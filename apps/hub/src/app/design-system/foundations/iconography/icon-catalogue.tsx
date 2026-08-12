"use client";

import * as React from "react";
import { Icon } from "@mosje/design-system";
import { ICON_CATALOGUE } from "./icon-catalogue.data";

/**
 * The catalogue, and the one thing the web can do that the Figma sheet cannot.
 *
 * Figma's section 02 states the problem it is solving: "A text property cannot be
 * browsed visually, so this sheet is the browser — find the icon, copy the name."
 * A static sheet answers that with 223 tiles the reader scans by eye. The web can
 * answer it properly: filter by name, and copy the name on click rather than
 * making the reader retype a ligature they can only read off a screenshot.
 *
 * So this is a faithful sync of the same 223 icons, not a different catalogue —
 * the list is `icon-catalogue.data.ts`, generated from the Figma section. What
 * differs is only the affordance around it, which is the medium doing its job.
 */
export function IconCatalogue(): React.JSX.Element {
  const [query, setQuery] = React.useState("");
  const [copied, setCopied] = React.useState<string | null>(null);
  const timer = React.useRef<ReturnType<typeof setTimeout> | null>(null);

  React.useEffect(
    () => () => {
      if (timer.current) clearTimeout(timer.current);
    },
    [],
  );

  const needle = query.trim().toLowerCase().replace(/[\s-]+/g, "_");
  const shown = React.useMemo(
    () => (needle ? ICON_CATALOGUE.filter((n) => n.includes(needle)) : ICON_CATALOGUE),
    [needle],
  );

  function copy(name: string): void {
    void navigator.clipboard?.writeText(name).then(
      () => {
        setCopied(name);
        if (timer.current) clearTimeout(timer.current);
        timer.current = setTimeout(() => setCopied(null), 1600);
      },
      () => {
        /* Clipboard blocked (insecure origin, or permission denied). The name is
           visible under the glyph either way, so there is nothing to recover. */
      },
    );
  }

  return (
    <div className="icon-catalogue">
      <div className="icon-catalogue__controls">
        <label className="icon-catalogue__search">
          <Icon name="search" size={20} aria-hidden />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Filter 223 icons by name…"
            aria-label="Filter the icon catalogue by name"
            className="icon-catalogue__input"
          />
        </label>
        <p className="icon-catalogue__count" role="status">
          {shown.length === ICON_CATALOGUE.length
            ? `${ICON_CATALOGUE.length} icons`
            : `${shown.length} of ${ICON_CATALOGUE.length}`}
        </p>
      </div>

      {shown.length === 0 ? (
        <p className="icon-catalogue__empty">
          No icon in the starter set matches “{query}”. The set is a starting point, not a
          limit — any Material Symbols ligature works, so try the name at{" "}
          <a href="https://fonts.google.com/icons" target="_blank" rel="noopener noreferrer">
            fonts.google.com/icons
          </a>
          .
        </p>
      ) : (
        <ul className="icon-catalogue__grid">
          {shown.map((name) => (
            <li key={name}>
              <button
                type="button"
                className="icon-catalogue__tile"
                onClick={() => copy(name)}
                aria-label={`Copy icon name ${name}`}
              >
                <Icon name={name} size={24} aria-hidden />
                <code className="icon-catalogue__name">{name}</code>
                <span className="icon-catalogue__copied" aria-hidden={copied !== name}>
                  {copied === name ? "Copied" : ""}
                </span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
