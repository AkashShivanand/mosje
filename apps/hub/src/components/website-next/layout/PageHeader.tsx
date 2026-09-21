import Image from "next/image";
import Link from "next/link";
import { Breadcrumb, Icon } from "@mosje/design-system";
import type { Crumb } from "@/components/website/layout/page-trail";
import { formatDate, isoDate } from "@/components/website-next/ui/format";

export type { Crumb };

export interface PageHeaderProps {
  /** The page's one <h1>. The browser-tab title starts with it (issue SEO-06). */
  title: string;
  /** The trail BELOW Home. A crumb with no href is a section with no landing page. */
  breadcrumb: Crumb[];
  /** One sentence saying what the page is for. Never a copy of another section's. */
  description?: string;
  /** The page's stored modification date — never today's date (issue MAN-05). */
  lastUpdated?: string;
  /** A short status or type label above the title, e.g. "Statutory Body". */
  badge?: string;
  /** An organisation's mark, drawn whole at its own proportions. */
  logoSrc?: string;
  /** A photograph for landing-level pages (organisations). */
  featuredImage?: string;
  /** At most one primary action (issue LAY-05). */
  actions?: React.ReactNode;
  /** "landing" gives an organisation page room for its image; "inner" is the default. */
  level?: "landing" | "inner";
  afterBreadcrumb?: React.ReactNode;
  logoAside?: React.ReactNode;
  /** Kept for the page files' existing props. The redesign never auto-advances a
   *  carousel in a page header (WCAG 2.2.2); the first slide becomes the image. */
  heroSlides?: { src: string; alt: string }[];
  heroSlidesLabel?: string;
  backHref?: string;
}

/**
 * The one page header of the redesign (issues LAY-09, LAY-14, LAY-02).
 *
 * The classic site opened listing pages on a 340px banner and organisation pages
 * on a header that filled the first screen and offered no action. Here every page
 * gets the same short header — breadcrumb, title, one line, the date the page
 * last changed — on the content column's own left edge, and the first screen is
 * the page's content.
 */
export function WebsitePageHeader({
  title,
  breadcrumb,
  description,
  lastUpdated,
  badge,
  logoSrc,
  featuredImage,
  actions,
  level = "inner",
  afterBreadcrumb,
  logoAside,
  heroSlides,
}: PageHeaderProps) {
  const image = featuredImage ?? heroSlides?.[0]?.src;
  const imageAlt = heroSlides?.[0]?.alt ?? "";
  const updated = formatDate(lastUpdated);
  const showImage = level === "landing" && image;

  return (
    <header className="wn-pagehead" data-level={level}>
      <div className="sa-container">
        <Breadcrumb linkAs={Link} items={[{ label: "Home", href: "/website", icon: "home" }, ...breadcrumb]} />
        {afterBreadcrumb}
        <div className={`wn-pagehead__body${showImage ? " wn-pagehead__body--media" : ""}`}>
          <div className="wn-pagehead__text">
            {(logoSrc || logoAside) && (
              <div className="wn-pagehead__mark">
                {logoSrc ? (
                  <Image src={logoSrc} alt="" width={72} height={72} className="wn-pagehead__logo" />
                ) : (
                  logoAside
                )}
              </div>
            )}
            <div className="wn-pagehead__copy">
              {badge && <p className="wn-pagehead__badge">{badge}</p>}
              <h1 className="wn-pagehead__title" id="page-title">
                {title}
              </h1>
              {description && <p className="wn-pagehead__lead">{description}</p>}
              {updated && (
                <p className="wn-pagehead__meta">
                  <Icon name="update" size={20} aria-hidden />
                  <span>
                    Last updated <time dateTime={isoDate(lastUpdated)}>{updated}</time>
                  </span>
                </p>
              )}
            </div>
          </div>
          {actions && <div className="wn-pagehead__actions">{actions}</div>}
          {showImage && (
            <div className="wn-pagehead__media">
              <Image src={image} alt={imageAlt} fill sizes="(min-width: 1024px) 420px, 100vw" className="object-cover" priority />
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
