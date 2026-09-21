import { Icon } from "@mosje/design-system";
import { facetLabel, type WebsiteSearchEntry } from "@/lib/website/search";
import { formatDate, isoDate } from "@/components/website-next/ui/format";

const isExternal = (href: string) => /^https?:\/\//.test(href);
const DEVANAGARI = /[ऀ-ॿ]/;

/**
 * One search result: where it sits (a breadcrumb path), what kind of thing it
 * is (a type chip), its title as the one link, and a two-line snippet
 * (issue X-SRCH-01).
 *
 * The title is the link and its hit area covers the row, so a result is one Tab
 * stop with one accessible name (LAY-07). Documents live on the Department's
 * CDN, so they open in a new window and say so (ACC-17).
 *
 * `data-result-index` is what `ResultClickTracker` reads to log which result a
 * reader chose — the measurement half of the search brief.
 */
export function SearchResult({ entry, index }: { entry: WebsiteSearchEntry; index: number }) {
  const external = isExternal(entry.href);
  const path = external ? ["dosje.gov.in", entry.section] : ["Home", entry.section];
  return (
    <li className="wn-result">
      <p className="wn-result__path">
        <span className="wn-result__chip">{facetLabel(entry.type)}</span>
        <span className="sr-only">, found in: </span>
        {path.map((p, i) => (
          <span key={`${p}-${i}`}>
            {i > 0 && (
              <span className="wn-result__sep" aria-hidden>
                <Icon name="chevron_right" size={16} />
              </span>
            )}
            {p}
          </span>
        ))}
      </p>
      <h3 className="wn-result__title" lang={DEVANAGARI.test(entry.title) ? "hi" : undefined}>
        <a
          href={entry.href}
          data-result-index={index}
          className="wn-result__link"
          {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
        >
          {entry.title}
          {external && (
            <>
              {" "}
              <span className="wn-result__ext" aria-hidden>
                <Icon name="open_in_new" size={16} />
              </span>
              <span className="sr-only">(opens in a new window)</span>
            </>
          )}
        </a>
      </h3>
      {entry.description && <p className="wn-result__snippet">{entry.description}</p>}
      {entry.updated && formatDate(entry.updated) !== entry.updated && (
        <p className="wn-result__meta">
          Updated <time dateTime={isoDate(entry.updated)}>{formatDate(entry.updated)}</time>
        </p>
      )}
    </li>
  );
}
