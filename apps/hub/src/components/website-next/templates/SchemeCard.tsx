import Link from "next/link";
import { Icon } from "@mosje/design-system";
import type { PersonaId, Scheme } from "@/lib/website-next/schemes";
import { administeredBy, applyRoutes, displayName, offeringShort, offersTo } from "@/lib/website-next/scheme-view";
import "./schemes.css";

interface SchemeCardProps {
  scheme: Scheme;
  /** The chosen group, so the support chips list only what the scheme gives that group. */
  who?: PersonaId;
  /** Keeps the outline sequential: h3 under a group's h2. */
  headingLevel?: 3 | 4;
}

/**
 * One scheme, one link (LAY-07): the name is the anchor and its ::after covers
 * the card. The one exception is where to apply: a route with a confirmed
 * address (a portal, a helpline number) is its own link, raised above the card's
 * hit area (8 Sep decision 6: apply links go to the portal, or to the scheme page
 * that carries it). A route with no confirmed address is named, not linked.
 */
export function SchemeCard({ scheme: s, who, headingLevel = 3 }: SchemeCardProps) {
  const H = `h${headingLevel}` as const;
  const by = administeredBy(s);
  const routes = applyRoutes(s);
  return (
    <article className="wn-scheme">
      {by && <p className="wn-scheme__by">{by}</p>}
      <H className="wn-scheme__title">
        <Link href={`/website/schemes-services/${s.id}`} className="wn-scheme__link">
          {displayName(s)}
        </Link>
      </H>
      <p className="wn-scheme__provides">{s.provides}</p>
      <p className="wn-scheme__named">
        <span className="wn-scheme__term">For </span>
        {s.named}
      </p>
      <ul className="wn-scheme__chips" aria-label="Kind of support and type">
        {offersTo(s, who).map((o) => (
          <li key={o} className="wn-chip">
            {offeringShort(o)}
          </li>
        ))}
        <li className="wn-chip wn-chip--quiet">{s.type}</li>
      </ul>
      {routes.length > 0 && (
        <p className="wn-scheme__apply">
          <span className="wn-scheme__apply-icon" aria-hidden>
            <Icon name="how_to_reg" size={20} />
          </span>
          <span>
            {routes.map((r, i) => (
              <span key={r.id}>
                {i > 0 && <span aria-hidden> · </span>}
                {r.href ? (
                  <a
                    href={r.href}
                    className="wn-scheme__apply-link"
                    {...(r.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                  >
                    {r.action}
                    {r.external && (
                      <>
                        <span className="wn-scheme__apply-ext" aria-hidden>
                          <Icon name="open_in_new" size={16} />
                        </span>
                        <span className="sr-only"> (opens in a new window)</span>
                      </>
                    )}
                  </a>
                ) : (
                  r.action
                )}
              </span>
            ))}
          </span>
        </p>
      )}
    </article>
  );
}
