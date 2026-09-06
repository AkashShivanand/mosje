import Image from "next/image";
import Link from "next/link";
import { Icon, SitePageHeader } from "@mosje/design-system";
import { PageTrail, type Crumb } from "./page-trail";

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
  /**
   * This page draws a fact card that overlaps the band's lower edge, so the band
   * should reserve room for it. Set by the organisation route, which knows
   * whether the organisation has facts to show.
   */
  hasOverlappingFacts?: boolean;
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
  hasOverlappingFacts,
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

  const photo = featuredImage ?? bannerFromLogo;
  const mark = logoSrc && logoSrc !== photo ? logoSrc : undefined;
  const variant = level ?? (photo ? "landing" : "inner");

  /*
   * A LANDING PAGE ALWAYS GETS THE PORTRAIT; AN INNER PAGE NEVER DOES.
   *
   * This is the distinction that matters, and an earlier pass got it half right
   * by dropping the plaque from everything. The handoff's L1 is built around the
   * haloed circle on the trailing edge — without it the band is two thirds empty
   * blue — while its L2 has no picture at all.
   *
   * So: on a landing page, fall back through the department's own marks rather
   * than leaving the space blank. On an inner page, nothing, whatever exists.
   */
  const portrait =
    variant === "landing"
      ? (photo ?? mark ?? "/website/images/National_Emblem_logo_white.svg")
      : undefined;
  const portraitIsEmblem = variant === "landing" && !photo && !mark;

  return (
    <>
      <div className="bg-white border-b border-gray-100 relative z-20">
        <div className="sa-container py-3">
          <PageTrail items={breadcrumb} />
        </div>
      </div>

      <SitePageHeader
        variant={variant}
        reservesOverlap={hasOverlappingFacts}
        title={title}
        eyebrow={
          badge && backHref ? (
            /*
             * A LINK, and it stays one: this goes to a known URL — the parent
             * organisation — not backwards through history. A button would
             * strip it of middle-click, of open-in-new-tab, and of the address
             * a screen reader reads out.
             *
             * The underline is on the TEXT ONLY. Putting `hover:underline` on
             * the anchor drew a rule under the arrow glyph too, which reads as a
             * typographic error rather than a link.
             */
            <Link
              href={backHref}
              className="group inline-flex items-center gap-2 text-inherit no-underline"
            >
              <Icon name="arrow_left_alt" size={20} aria-hidden />
              <span className="group-hover:underline">{badge}</span>
            </Link>
          ) : (
            badge
          )
        }
        lead={description}
        actions={actions}
        logo={
          mark ? (
            /*
             * 100px, as the handoff sets it. It was 72 and read as an
             * afterthought beside a 40px title.
             *
             * EXPLICIT width/height, not `fill`. With `fill` and no `sizes`,
             * Next picked a 36px candidate off the srcset and upscaled it into a
             * 100px circle — the mark arrived soft to the point of looking
             * blank. A real intrinsic size lets it optimise for the size the
             * logo is actually drawn at, and `priority` keeps an above-the-fold
             * mark out of the lazy queue.
             */
            <span className="grid size-[100px] place-items-center overflow-hidden rounded-full border border-white/40 bg-white">
              <Image
                src={mark}
                alt=""
                width={100}
                height={100}
                priority
                className="size-[84px] object-contain"
              />
            </span>
          ) : undefined
        }
        media={
          portrait ? (
            /*
             * 340px. The handoff's portrait is 385 inside a 489 plaque; at the
             * estate's 1320 cap the trailing column is ~416, so the picture takes
             * 340 and its rings bleed past the column into the band — which is
             * what the frame does too, clipping the outermost ring at the right
             * edge. The band already carries `overflow: clip` for exactly this.
             */
            <span className="relative block size-[340px] overflow-hidden rounded-full bg-white/10">
              <Image
                src={portrait}
                alt=""
                fill
                /* A photograph fills the circle; a mark or the emblem is padded
                   so it is not cropped into by the round frame. */
                className={portraitIsEmblem || !photo ? "object-contain p-12" : "object-cover"}
                priority
              />
            </span>
          ) : undefined
        }
      />
    </>
  );
}
