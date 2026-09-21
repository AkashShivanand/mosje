import Link from "next/link";
import { Icon, SectionTitle, buttonClasses } from "@mosje/design-system";
import { PageLayout } from "@/components/website-next/layout/PageLayout";
import { PERSONAS, type Scheme } from "@/lib/website-next/schemes";
import {
  MASTER_DATE,
  SCHEME_STATUS,
  applyRoutes,
  displayName,
  divisionsOf,
  expandSource,
  offeringLabel,
  relatedSchemes,
} from "@/lib/website-next/scheme-view";
import { SchemeCard } from "./SchemeCard";
import "./schemes.css";

function External({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <a href={href} target="_blank" rel="noopener noreferrer">
      {children}
      <span className="wn-apply__ext" aria-hidden>
        <Icon name="open_in_new" size={16} />
      </span>
      <span className="sr-only"> (opens in a new window)</span>
    </a>
  );
}

/**
 * T — Scheme page. One fixed spine for every scheme (X-IA-08, CON-13), in the
 * order a reader's questions arrive: what it is and who runs it, who it is for,
 * what it provides, whom it names, where to apply, the sources, and related
 * schemes. Every line is the master's, which cites the Annual Report 2025-26,
 * the Demand for Grants 2026-27 or the PIB Year-End Review; nothing is added.
 */
export function SchemeDetail({ scheme: s }: { scheme: Scheme }) {
  const routes = applyRoutes(s);
  const primary = routes.find((r) => r.href);
  const status = SCHEME_STATUS[s.id];
  const divisions = divisionsOf(s);
  const personas = PERSONAS.filter((p) => s.who.includes(p.id));
  const related = relatedSchemes(s);
  const name = displayName(s);

  return (
    <PageLayout
      title={name}
      badge={s.type}
      breadcrumb={[
        { label: "Schemes & Services" },
        { label: "Find a Scheme", href: "/website/schemes-services" },
        { label: name },
      ]}
      lastUpdated={MASTER_DATE}
      actions={
        primary?.href ? (
          <a
            href={primary.href}
            className={buttonClasses("primary", "filled", "md")}
            {...(primary.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
          >
            {primary.action}
            {primary.external && (
              <>
                <Icon name="open_in_new" size={20} aria-hidden />
                <span className="sr-only"> (opens in a new window)</span>
              </>
            )}
          </a>
        ) : undefined
      }
    >
      <div className="wn-section">
        <div className="sa-container wn-split">
          <article className="wn-spine" aria-labelledby="page-title">
            {status && (
              <p className="wn-status">
                <span className="wn-status__icon" aria-hidden>
                  <Icon name="info" size={20} />
                </span>
                <span>
                  <strong>{status.label}. </strong>
                  {status.detail}
                </span>
              </p>
            )}

            <section className="wn-spine__block" aria-labelledby="what-you-get">
              <h2 id="what-you-get" className="wn-spine__h2">What You Get</h2>
              <p className="wn-spine__text">{s.provides}</p>
              <ul className="wn-spine__chips" aria-label="Kind of support">
                {s.offers.map((o) => (
                  <li key={o}>
                    <Link href={`/website/schemes-services?offer=${o}`} className="wn-chip">
                      {offeringLabel(o)}
                    </Link>
                  </li>
                ))}
              </ul>
            </section>

            <section className="wn-spine__block" aria-labelledby="who-it-is-for">
              <h2 id="who-it-is-for" className="wn-spine__h2">Who It Is For</h2>
              <p className="wn-spine__text">{s.named}</p>
              <ul className="wn-spine__chips" aria-label="Groups the scheme names">
                {personas.map((p) => (
                  <li key={p.id}>
                    <Link href={`/website/schemes-services?who=${p.id}`} className="wn-chip">
                      {p.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </section>

            {routes.length > 0 && (
              <section className="wn-spine__block" aria-labelledby="where-to-apply">
                <h2 id="where-to-apply" className="wn-spine__h2">Where to Apply</h2>
                <ul className="wn-apply-list">
                  {routes.map((r) => (
                    <li key={r.id} className="wn-apply">
                      <span className="wn-apply__icon" aria-hidden>
                        <Icon name={r.href?.startsWith("tel:") ? "call" : r.href ? "language" : "apartment"} size={24} />
                      </span>
                      <span>
                        {r.href ? (
                          r.external ? (
                            <External href={r.href}>{r.action}</External>
                          ) : (
                            <a href={r.href}>{r.action}</a>
                          )
                        ) : (
                          r.action
                        )}
                      </span>
                    </li>
                  ))}
                </ul>
              </section>
            )}

            <section className="wn-spine__block" aria-labelledby="sources">
              <h2 id="sources" className="wn-spine__h2">Sources</h2>
              <ul className="wn-sources">
                {s.sources.map((code) => {
                  const src = expandSource(code);
                  return (
                    <li key={code}>{src.href ? <External href={src.href}>{src.text}</External> : src.text}</li>
                  );
                })}
                {status && !s.sources.includes(status.source) && <li>{expandSource(status.source).text}</li>}
              </ul>
            </section>
          </article>

          <aside className="wn-aside wn-aside--sticky" aria-label="Scheme details">
            <div className="wn-panel">
              <h2 className="wn-panel__title">Administered By</h2>
              <dl className="wn-facts">
                {s.umbrella && (
                  <div>
                    <dt>Part of</dt>
                    <dd>{s.umbrella}</dd>
                  </div>
                )}
                {divisions.length > 0 && (
                  <div>
                    <dt>{divisions.length > 1 ? "Divisions" : "Division"}</dt>
                    {divisions.map((d) => (
                      <dd key={d.href}>
                        <Link href={d.href}>{d.label}</Link>
                      </dd>
                    ))}
                  </div>
                )}
                <div>
                  <dt>Type</dt>
                  <dd>{s.type}</dd>
                </div>
              </dl>
            </div>
          </aside>
        </div>
      </div>

      {related.length > 0 && (
        <section className="wn-section wn-section--muted" aria-labelledby="related-schemes">
          <div className="sa-container">
            <SectionTitle headingId="related-schemes" title="Related Schemes" />
            <ul className="wn-scheme-grid" style={{ marginTop: "var(--sa-stack-24)" }}>
              {related.map((r) => (
                <li key={r.id}>
                  <SchemeCard scheme={r} />
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}
    </PageLayout>
  );
}

interface LegacySection {
  heading?: string;
  html: string;
}

/**
 * A scheme listing carried over from the old site that is not a master scheme (a
 * corporation's loan product, an umbrella page, a Foundation scheme — issue
 * X-IA-04) and has something on it. Listings that ARE master schemes, or are
 * empty, never reach here: the route redirects them (legacy-schemes.ts). Its text
 * is shown as the site published it, in the redesign's content template, with no
 * standfirst (the old one was often copied from another page) and no link back
 * to the old site.
 */
export function LegacySchemeDetail({
  title,
  sections,
  website,
  lastUpdated,
}: {
  title: string;
  sections: LegacySection[];
  website?: string;
  lastUpdated?: string;
}) {
  return (
    <PageLayout
      title={title}
      breadcrumb={[
        { label: "Schemes & Services" },
        { label: "Find a Scheme", href: "/website/schemes-services" },
        { label: title },
      ]}
      lastUpdated={lastUpdated}
    >
      <div className="wn-section">
        <div className="sa-container wn-split">
          <article className="wn-prose wn-legacy min-w-0" aria-labelledby="page-title">
            {sections.map((sec, i) => (
              <section key={sec.heading ?? i}>
                {sec.heading && <h2>{sec.heading}</h2>}
                <div dangerouslySetInnerHTML={{ __html: sec.html }} />
              </section>
            ))}
          </article>
          {website && (
            <aside className="wn-aside wn-aside--sticky" aria-label="Related">
              <div className="wn-panel">
                <h2 className="wn-panel__title">Related Links</h2>
                <ul>
                  <li>
                    <External href={website}>Scheme Website</External>
                  </li>
                </ul>
              </div>
            </aside>
          )}
        </div>
      </div>
    </PageLayout>
  );
}
