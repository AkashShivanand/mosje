import * as React from "react";
import { cn } from "../../utils/cn";
import { Icon } from "../icon/icon";
import { BrandGlyph, type BrandGlyphName } from "../icon/brand-glyph";
import "./site-footer.css";

/**
 * Which surface this footer is ending.
 *
 * `website` — the front door of a public information site. Carries wayfinding
 * (navigation columns, social, an optional support strip) on top of the
 * statutory apparatus.
 *
 * `portal` — chrome under an authenticated workflow. Carries the statutory
 * apparatus and nothing else: a portal has its own navigation, and a citizen
 * mid-application does not need a sitemap. It is a VARIANT rather than a second
 * component because the statutory half is identical and must stay identical —
 * a separate portal footer is a second thing to keep DBIM-compliant, and the
 * one that already existed drifted into being used by nobody.
 */
export type SiteFooterVariant = "website" | "portal";

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
  /**
   * Which brand mark to draw. A NAME, not path data: the marks live in the DS
   * so every rail in the estate draws the same optically-normalised set, and
   * so a footer's content file never carries a kilobyte of vendor artwork.
   */
  icon: BrandGlyphName;
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

export interface SiteFooterSupport {
  heading: string;
  /** One sentence. The strip exists to explain the button; without it, don't use it. */
  body?: string;
  cta: { label: string; href: string };
}

export interface SiteFooterProps extends React.HTMLAttributes<HTMLElement> {
  /** @default "website" */
  variant?: SiteFooterVariant;
  /**
   * The optional support strip — a heading, a sentence and one call to action,
   * in a band of its own above the footer. OMIT IT AND IT DOES NOT RENDER;
   * there is no empty state and no placeholder.
   *
   * It is a separate band rather than an item in the identity column because a
   * call to action needs the sentence that explains it. Folded into the column
   * it became a naked button between an address and a row of social marks, and
   * a button with no context is worse than no button.
   *
   * Ignored when `variant="portal"` — an authenticated workflow has its own
   * help affordances and does not need a marketing invitation under it.
   */
  supportStrip?: SiteFooterSupport;
  /** Emblem or logo for the identity lockup. Pass a rendered `next/image`. */
  emblem?: React.ReactNode;
  /** Organisation lines, coarsest first. The last is emphasised. */
  organisation: string[];
  /** Postal address, rendered inside `<address>`. Website variant only. */
  address?: string;
  /** Website variant only. */
  social?: SiteFooterSocial[];
  /** Website variant only. Four columns is the tested shape; more will wrap. */
  columns?: SiteFooterColumn[];
  /** [DBIM 5.6] Required on BOTH variants. The mandated lineage sentence. */
  lineage: string;
  /** [DBIM 5.6] "Hyperlinked logos". Rendered on both variants. */
  credits?: SiteFooterCredit[];
  /** [DBIM 5.6] Website Policy, Help, Feedback, Sitemap. Required on both. */
  policyLinks: SiteFooterLink[];
  /** [DBIM 5.6] Required element. Other government platforms. */
  relatedLinks?: SiteFooterLink[];
  copyright: string;
  /** [DBIM 5.6] "Last Updated On" for the *respective page*. */
  lastUpdated?: string;
  /**
   * Slot in the colophon, beside the copyright and last-updated. The estate
   * puts `<VisitorCounter />` here — a visit count is page metadata, not
   * identity, and grouping it with the other provenance lines stops it
   * competing with the emblem.
   */
  colophonSlot?: React.ReactNode;
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
 * SiteFooter — the statutory footer for the SAMAVESH estate, in two variants.
 *
 * ── WHAT IT IS ────────────────────────────────────────────────────────────
 * STRUCTURAL, NOT CONTENT-BOUND. Every label, href, logo and sentence arrives
 * as a prop, so the MoSJE routes live in the app and this component serves any
 * site or portal in the estate.
 *
 * ── THE SHAPE, AND WHY ────────────────────────────────────────────────────
 * Three zones, in priority order, because a government footer has three jobs
 * and the previous version mixed all three at one weight:
 *
 *   0. Support strip  — OPTIONAL, opt-in, absent from the DOM when unused
 *   1. The working footer — identity, address, social, four link columns
 *   2. The statutory bar  — lineage, credits, policies, colophon
 *
 * `variant="portal"` renders zone 2 alone. That is the whole difference, and
 * it is why this is a variant: the statutory half is the half that must stay
 * DBIM-compliant, and it is now impossible for a portal to have a footer that
 * drifts from the website's on that half.
 *
 * ── DBIM 5.6 ──────────────────────────────────────────────────────────────
 * The six required elements are Website Policy, Sitemap, Related Links, Help,
 * Feedback and Last Updated On, plus the lineage sentence and the hyperlinked
 * logos. `lineage`, `policyLinks` and `copyright` are REQUIRED PROPS on both
 * variants for that reason — a footer without them is not a government footer,
 * and making them optional would let a caller ship one that is not.
 *
 * ── COLOUR ────────────────────────────────────────────────────────────────
 * Comes entirely from `site-footer.css`, bound to the mode-aware
 * `--sa-color-primaryScale-*` family. Never pass a background through
 * `className`; see the contract at the top of that file.
 *
 * ── ACCESSIBILITY ─────────────────────────────────────────────────────────
 *   · `contentinfo` landmark, named by a visually-hidden `<h2>`.
 *   · Every `<nav>` is labelled — by its visible heading where it has one,
 *     by `aria-label` where the label would be an on-screen eyebrow.
 *   · Every external link is `rel="noreferrer"` and says it opens a new window.
 *   · One focus ring, defined once, applying to every control in the subtree.
 *   · Brand glyphs are `aria-hidden`; the accessible name sits on the link.
 */
export const SiteFooter = React.forwardRef<HTMLElement, SiteFooterProps>(function SiteFooter(
  {
    variant = "website",
    supportStrip,
    emblem,
    organisation,
    address,
    social,
    columns,
    lineage,
    credits,
    policyLinks,
    relatedLinks,
    copyright,
    lastUpdated,
    colophonSlot,
    linkAs: Link = "a",
    maxWidth = 1280,
    className,
    ...rest
  },
  ref,
) {
  const isWebsite = variant === "website";
  const inStyle = { maxWidth } as React.CSSProperties;

  /**
   * AN ICON MARKS A DISTINCTION. Where every link in a group is external, the
   * group already says so and five repeated arrows are noise — so `markExternal`
   * is false for a wholly-external list and true for a mixed one, decided from
   * the data rather than by the caller.
   *
   * It is also load-bearing for layout: the arrow costs 20px, and in a 164px
   * column that is the difference between "National Portal of India" (153px)
   * sitting on one line and wrapping onto two.
   *
   * The accessible name is unaffected either way — every external link keeps
   * its "(opens in a new window)" note and its `rel`.
   */
  const renderLink = (link: SiteFooterLink, markExternal = true) =>
    link.external ? (
      <a href={link.href} target="_blank" rel="noreferrer" className="ds-sitefooter__link">
        {link.label}
        {markExternal && <Icon name="open_in_new" size={16} />}
        <NewWindow />
      </a>
    ) : (
      <Link href={link.href} className="ds-sitefooter__link">
        {link.label}
      </Link>
    );

  /** True when a group mixes internal and external, so the arrow tells them apart. */
  const isMixed = (links: SiteFooterLink[]) =>
    links.some((l) => l.external) && links.some((l) => !l.external);

  return (
    <footer
      ref={ref}
      className={cn("ds-sitefooter", `ds-sitefooter--${variant}`, className)}
      {...rest}
    >
      <h2 className="sr-only">Site footer</h2>

      {/* ── Zone 0 · the optional support strip ───────────────────────── */}
      {isWebsite && supportStrip && (
        <div className="ds-sitefooter__support">
          <div className="ds-sitefooter__in" style={inStyle}>
            <div>
              <p className="ds-sitefooter__support-title">{supportStrip.heading}</p>
              {supportStrip.body && (
                <p className="ds-sitefooter__support-body">{supportStrip.body}</p>
              )}
            </div>
            <Link href={supportStrip.cta.href} className="ds-sitefooter__cta">
              {supportStrip.cta.label}
              <Icon name="arrow_forward" size={16} />
            </Link>
          </div>
        </div>
      )}

      {/* ── Zone 1 · the working footer ───────────────────────────────── */}
      {isWebsite && (
        <div className="ds-sitefooter__in" style={inStyle}>
          <div className="ds-sitefooter__body">
            <div className="ds-sitefooter__ident">
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
                          <BrandGlyph name={s.icon} size={24} />
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

            {Boolean(columns?.length) && (
              <div className="ds-sitefooter__cols">
                {columns!.map((col) => (
                  <nav key={col.id} aria-labelledby={col.id}>
                    <h3 id={col.id} className="ds-sitefooter__colhead">
                      {col.heading}
                    </h3>
                    <ul className="ds-sitefooter__list">
                      {col.links.map((link) => (
                        <li key={link.label}>{renderLink(link)}</li>
                      ))}
                    </ul>
                  </nav>
                ))}

              </div>
            )}

            {/* [DBIM 5.6] Related Links — wayfinding, so it lives in the
                working band, but laid out WIDE rather than as a sixth column.
                Six columns is one vertical rhythm more than the eye wants to
                parse in a footer, and this group is short enough to spend the
                width the four columns leave over. */}
            {relatedLinks && relatedLinks.length > 0 && (
              <nav className="ds-sitefooter__wide" aria-labelledby="ds-footer-related">
                <h3 id="ds-footer-related" className="ds-sitefooter__colhead">
                  Related Links
                </h3>
                <ul className="ds-sitefooter__list">
                  {relatedLinks.map((link) => (
                    <li key={link.label}>{renderLink(link, isMixed(relatedLinks))}</li>
                  ))}
                </ul>
              </nav>
            )}
          </div>
        </div>
      )}

      {/* ── Zone 2 · the statutory bar — BOTH variants ─────────────────── */}
      <div className="ds-sitefooter__statutory">
        <div className="ds-sitefooter__in" style={inStyle}>
          <p className="ds-sitefooter__lineage">{lineage}</p>

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

          {/* Policies and related links share one wrapped row. They were two
              stacked rows of undifferentiated grey under two uppercase
              eyebrows; both are "links out of here", and the external ones
              already carry an arrow that says which is which. Both navs keep
              their `aria-label`, which is where the label was doing work. */}
          <div className="ds-sitefooter__inline-navs">
            <nav aria-label="Website policies">
              <ul className="ds-sitefooter__inline">
                {policyLinks.map((link) => (
                  <li key={link.label}>{renderLink(link)}</li>
                ))}
              </ul>
            </nav>

            {/* On the WEBSITE these render as a column up in the working band.
                The portal variant has no working band, so they render here —
                DBIM 5.6 requires the element on both variants, and moving it
                for layout reasons must not quietly drop it from one of them. */}
            {!isWebsite && relatedLinks && relatedLinks.length > 0 && (
              <nav aria-label="Related government links">
                <ul className="ds-sitefooter__inline">
                  {relatedLinks.map((link) => (
                    <li key={link.label}>{renderLink(link, isMixed(relatedLinks))}</li>
                  ))}
                </ul>
              </nav>
            )}
          </div>

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
