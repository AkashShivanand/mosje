import Link from "next/link";
import { Icon } from "@mosje/design-system";
import { SearchField } from "./SearchField";
import { POPULAR_LINKS } from "./popular-links";
import "@/components/website-next/templates/media.css";
import "./search.css";

/**
 * The body of the 404 and error pages (issues NAV-09, X-IA-10): a way forward,
 * never a status code, an endpoint or a stack trace. The site search field and
 * the five popular links, so a reader who arrived by a broken link can still
 * reach what they came for.
 *
 * `actions` carries the page's own buttons — "Try Again" on the error page.
 */
export function DeadEnd({ actions }: { actions?: React.ReactNode }) {
  return (
    <div className="wn-section">
      <div className="sa-container">
        <div className="wn-lost">
          {actions && <div className="wn-lost__actions">{actions}</div>}
          <SearchField label="Search This Website" hint="Search by scheme, organisation, document or officer." />
          <nav aria-labelledby="lost-links">
            <h2 id="lost-links" className="wn-lost__sub">
              Popular Links
            </h2>
            <ul className="wn-lost__links">
              {POPULAR_LINKS.map((l) => (
                <li key={l.href}>
                  <Link href={l.href}>
                    <span>{l.label}</span>
                    <Icon name="arrow_forward" size={20} aria-hidden />
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </div>
    </div>
  );
}
