import Image from "next/image";
import Link from "next/link";
import { Icon, SitePageHeader } from "@mosje/design-system";
import { Breadcrumb, type Crumb } from "./Breadcrumb";

export interface PageHeroProps {
  title: string;
  breadcrumb: Crumb[];
  badge?: string;
  logoSrc?: string;
  featuredImage?: string;
  description?: string;
  lastUpdated?: string;
  actions?: React.ReactNode;
  /**
   * Which of the handoff's two header levels this page takes.
   *
   * Pass it from a route that KNOWS — the organisation route knows whether it is
   * rendering an organisation's own front page or something beneath it, and says
   * so. Everything else falls back to the rule below, which is the honest guess:
   * a page with a real photograph is a landing page, and a page without one is
   * not made into one by inventing a picture.
   */
  level?: "landing" | "inner";
  /**
   * Where the L2 eyebrow goes back to — the parent organisation.
   *
   * With it, the eyebrow is the handoff's back link: an arrow and the parent's
   * name. Without it, the same text renders as a plain label, because an arrow
   * that goes nowhere is worse than no arrow.
   */
  backHref?: string;
}

/**
 * The website's page header — `SitePageHeader` from the design system, wired to
 * this app's content shapes.
 *
 * ── WHAT CHANGED, AND WHY THE EMBLEM CIRCLE IS GONE FROM MOST PAGES ──────────
 * This component used to draw the L1 layout on EVERY page, and where a page had
 * no image it filled the circle with the National Emblem and the ministry's name
 * — a 340px decorative plaque, on pages whose actual subject was the prose below
 * it. That is a fallback deciding the layout: no page asked for a portrait, so
 * every page got one anyway.
 *
 * The handoff has a level for exactly this: L2, a band with a back link and a
 * title. Pages with a real photograph keep L1; the rest take L2 and give the
 * fold back to their own content.
 *
 * ── THE BREADCRUMB BAR IS NOT PART OF THE BAND ───────────────────────────────
 * It sits in its own white strip above, as it did before, because it belongs to
 * the page chrome rather than to the banner — and because the design-system
 * component has no opinion about a breadcrumb, which is this app's own concern.
 *
 * `lastUpdated` is read off the same object by `PageLayout` and handed to
 * `SiteFooter` (DBIM 5.6 wants "Last Updated On" for the page). It stays in the
 * props and is deliberately not destructured here.
 */
export function PageHero({
  title,
  breadcrumb,
  badge,
  logoSrc,
  featuredImage,
  description,
  actions,
  level,
  backHref,
}: PageHeroProps) {
  /*
   * A wide banner arriving through `logoSrc` is a portrait, not a mark. The
   * string matching is inherited and is not good — it tests for "Banner" and for
   * two specific file names — but it is load-bearing for the pages that rely on
   * it, so it is preserved rather than quietly dropped. It wants replacing with
   * a real `featuredImage` on those records.
   */
  const bannerFromLogo =
    logoSrc &&
    (logoSrc.includes("Banner") ||
      logoSrc.includes("banner") ||
      logoSrc.includes("NCSC-2") ||
      logoSrc.includes("smile-beggary"))
      ? logoSrc
      : undefined;

  const portrait = featuredImage ?? bannerFromLogo;
  const mark = logoSrc && logoSrc !== portrait ? logoSrc : undefined;
  const variant = level ?? (portrait ? "landing" : "inner");

  return (
    <>
      <div className="bg-white border-b border-gray-100 relative z-20">
        <div className="sa-container py-3">
          <Breadcrumb items={breadcrumb} />
        </div>
      </div>

      <SitePageHeader
        variant={variant}
        title={title}
        eyebrow={
          badge && backHref ? (
            <Link href={backHref} className="inline-flex items-center gap-2 text-inherit hover:underline">
              <Icon name="arrow_left_alt" size={24} />
              <span>{badge}</span>
            </Link>
          ) : (
            badge
          )
        }
        lead={description}
        actions={actions}
        logo={
          mark ? (
            <span className="relative block size-[72px] overflow-hidden rounded-full border border-white/40 bg-white p-1.5">
              <Image src={mark} alt="" fill className="object-contain p-0.5" />
            </span>
          ) : undefined
        }
        media={
          portrait ? (
            <span className="relative block size-[300px] overflow-hidden rounded-full border-4 border-white/40 shadow-2xl">
              <Image src={portrait} alt="" fill className="object-cover" priority />
            </span>
          ) : undefined
        }
      />
    </>
  );
}
