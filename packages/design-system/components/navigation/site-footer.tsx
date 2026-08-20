import * as React from "react";
import { cn } from "../../utils/cn";
import { Icon } from "../icon/icon";
import "./site-footer.css";

export interface SiteFooterLink {
  label: string;
  href: string;
  /** Opens in a new window, announced to assistive tech and marked `noreferrer`. */
  external?: boolean;
}

export interface SiteFooterColumn {
  heading: string;
  /** Stable DOM id so the `<nav>` is labelled BY the visible heading. */
  id: string;
  links: SiteFooterLink[];
}

export interface SiteFooterSocial {
  /** Human name, e.g. "X (formerly Twitter)" — never a CSS class name. */
  label: string;
  href: string;
  /** Single `d` attribute for a 24×24 viewBox brand mark. */
  path: string;
}

export interface SiteFooterCredit {
  src: string;
  alt: string;
  href: string;
  width: number;
  height: number;
  /** Rendered before the logo, e.g. "Powered by". */
  prefix?: string;
}

export interface SiteFooterProps extends React.HTMLAttributes<HTMLElement> {
  /** Emblem or logo for the identity lockup. Pass a rendered `next/image`. */
  emblem?: React.ReactNode;
  /** Organisation lines, coarsest first. The last is emphasised. */
  organisation: string[];
  /** Postal address, rendered inside `<address>`. */
  address?: string;
  /** The footer's single call to action. */
  cta?: { label: string; href: string };
  social?: SiteFooterSocial[];
  /**
   * Slot in the colophon, beside the copyright and last-updated. The estate
   * puts `<VisitorCounter />` here. It sat under the social rail until it was
   * clear that a visit count is PAGE METADATA, not identity — grouped with the
   * other two provenance statements it stops being a statistic competing with
   * the emblem.
   */
  colophonSlot?: React.ReactNode;
  columns: SiteFooterColumn[];
  /** [DBIM 5.6] Required. The mandated lineage sentence for the org type. */
  lineage: string;
  credits?: SiteFooterCredit[];
  /** [DBIM 5.6] Website Policy, Help, Feedback, Sitemap. */
  policyLinks: SiteFooterLink[];
  /** [DBIM 5.6] Required. Other government platforms. */
  relatedLinks?: SiteFooterLink[];
  copyright: string;
  /** [DBIM 5.6] "Last Updated On" for the *respective page*. */
  lastUpdated?: string;
  /**
   * Router-aware link for internal hrefs — pass `next/link`. External links
   * always use a plain anchor. Defaults to `<a>`.
   */
  linkAs?: React.ElementType;
  /** Content max-width, kept in sync with the header. @default 1280 */
  maxWidth?: number;
}

/** Announces an external destination without adding visual noise. */
function NewWindow() {
  return <span className="sr-only"> (opens in a new window)</span>;
}

/**
 * SiteFooter — the public-website footer for the SAMAVESH estate.
 *
 * STRUCTURAL, NOT CONTENT-BOUND. Every label, href and logo arrives as a prop,
 * so the MoSJE routes live in the app and this component can serve any site in
 * the estate. The DS also ships `Footer`, which is a different thing: the slim
 * single-band *app-shell* footer for portals. Do not merge them — one is
 * chrome under an authenticated workflow, the other is the statutory footer of
 * a public information site, and they answer to different clauses.
 *
 * TWO BANDS, TWO JOBS
 *   1. The working footer — who this is, how to reach them, where to go next.
 *   2. The statutory bar  — lineage, policies, credits, copyright, last-updated.
 * A third "Need Support?" strip used to sit on top. It was folded into the
 * identity column: it held one heading, one sentence and one button across the
 * full width, and cost ~120px of height to say what the button says alone.
 *
 * COLOUR comes entirely from `site-footer.css`, which binds to the mode-aware
 * `--sa-color-primaryScale-*` family. See the contract at the top of that file.
 *
 * ACCESSIBILITY
 *   · `contentinfo` landmark, named by a visually-hidden `<h2>`.
 *   · Every `<nav>` is `aria-labelledby` its own visible heading.
 *   · Every external link is `rel="noreferrer"` and says it opens a new window.
 *   · One focus ring, defined once, applying to every control in the subtree.
 *   · Brand glyphs are `aria-hidden`; the accessible name sits on the link.
 */
export const SiteFooter = React.forwardRef<HTMLElement, SiteFooterProps>(function SiteFooter(
  {
    emblem,
    organisation,
    address,
    cta,
    social,
    colophonSlot,
    columns,
    lineage,
    credits,
    policyLinks,
    relatedLinks,
    copyright,
    lastUpdated,
    linkAs: Link = "a",
    maxWidth = 1280,
    className,
    ...rest
  },
  ref,
) {
  const inStyle = { maxWidth } as React.CSSProperties;

  const renderLink = (link: SiteFooterLink, cls: string) =>
    link.external ? (
      <a href={link.href} target="_blank" rel="noreferrer" className={cls}>
        {link.label}
        <Icon name="open_in_new" size={16} />
        <NewWindow />
      </a>
    ) : (
      <Link href={link.href} className={cls}>
        {link.label}
      </Link>
    );

  return (
    <footer ref={ref} className={cn("ds-sitefooter", className)} {...rest}>
      <h2 className="sr-only">Site footer</h2>

      {/* ── Band 1 · the working footer ───────────────────────────────── */}
      <div className="ds-sitefooter__in" style={inStyle}>
        <div className="ds-sitefooter__body">
          <div className="ds-sitefooter__ident">
            <div className="ds-sitefooter__ident-group">
              <div className="ds-sitefooter__lockup">
              {emblem}
                <div className="ds-sitefooter__lockup-text">
                  {organisation.map((line, i) => (
                    <p
                      key={line}
                      className={cn(
                        "ds-sitefooter__org",
                        i === organisation.length - 1 && "ds-sitefooter__org--lead",
                      )}
                    >
                      {line}
                    </p>
                  ))}
                </div>
              </div>

              {address && (
                <address className="ds-sitefooter__address">
                  <Icon name="location_on" size={16} />
                  <span>{address}</span>
                </address>
              )}
            </div>

            {/* Second group: how to reach them. Separated from the identity
                above by a doubled gap, so the column reads as two things. */}
            <div className="ds-sitefooter__ident-group">
              {cta && (
                <Link href={cta.href} className="ds-sitefooter__cta">
                  {cta.label}
                  <Icon name="arrow_forward" size={16} />
                </Link>
              )}

              {social && social.length > 0 && (
              <nav aria-label="Social media">
                <ul className="ds-sitefooter__social">
                  {social.map((s) => (
                    <li key={s.label}>
                      <a
                        href={s.href}
                        target="_blank"
                        rel="noreferrer"
                        className="ds-sitefooter__social-link"
                      >
                        <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
                          <path d={s.path} />
                        </svg>
                        <span className="sr-only">
                          {s.label}
                          <NewWindow />
                        </span>
                      </a>
                    </li>
                  ))}
                </ul>
              </nav>
              )}
            </div>
          </div>

          <div className="ds-sitefooter__cols">
            {columns.map((col) => (
              <nav key={col.id} aria-labelledby={col.id}>
                <h3 id={col.id} className="ds-sitefooter__colhead">
                  {col.heading}
                </h3>
                <ul className="ds-sitefooter__list">
                  {col.links.map((link) => (
                    <li key={link.label}>{renderLink(link, "ds-sitefooter__link")}</li>
                  ))}
                </ul>
              </nav>
            ))}
          </div>
        </div>
      </div>

      {/* ── Band 2 · the statutory bar ────────────────────────────────── */}
      <div className="ds-sitefooter__statutory">
        <div className="ds-sitefooter__in" style={inStyle}>
          {/* Statute and navigation share the left column: same register, and
              the organisational marks opposite them are a different one. */}
          <div className="ds-sitefooter__statute">
            <p className="ds-sitefooter__lineage">{lineage}</p>

            <div className="ds-sitefooter__inline-navs">
              {/* No visible label on either nav. `aria-label` names them for
                  assistive tech, which is where the label was doing real work;
                  on screen they were two uppercase eyebrows inside one small
                  band, which the links did not need and which is the single
                  most templated thing a footer can do. */}
              <nav aria-label="Website policies">
                <ul className="ds-sitefooter__inline">
                  {policyLinks.map((link) => (
                    <li key={link.label}>{renderLink(link, "ds-sitefooter__link")}</li>
                  ))}
                </ul>
              </nav>

              {relatedLinks && relatedLinks.length > 0 && (
                <nav aria-label="Related government links">
                  <ul className="ds-sitefooter__inline">
                    {relatedLinks.map((link) => (
                      <li key={link.label}>{renderLink(link, "ds-sitefooter__link")}</li>
                    ))}
                  </ul>
                </nav>
              )}
            </div>
          </div>

          {credits && credits.length > 0 && (
            <div className="ds-sitefooter__credits">
              {credits.map((c) => (
                <React.Fragment key={c.href}>
                  {c.prefix && <span>{c.prefix}</span>}
                  <a
                    href={c.href}
                    target="_blank"
                    rel="noreferrer"
                    className="ds-sitefooter__credit-link"
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={c.src} alt={c.alt} width={c.width} height={c.height} />
                    <NewWindow />
                  </a>
                </React.Fragment>
              ))}
            </div>
          )}

          <div className="ds-sitefooter__colophon">
            <p>{copyright}</p>
            {lastUpdated && (
              <p>
                Last Updated: <time>{lastUpdated}</time>
              </p>
            )}
            {colophonSlot}
          </div>
        </div>
      </div>
    </footer>
  );
});
