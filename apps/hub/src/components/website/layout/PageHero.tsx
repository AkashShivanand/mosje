import Image from "next/image";
import Link from "next/link";
import { Icon, SitePageHeader,
  Carousel,
  markNeedsGround,
} from "@mosje/design-system";
import { PageTrail, type Crumb } from "./page-trail";

export interface PageHeroProps {
  /**
   * Photographs for the header's circular carousel — the second of the landing
   * header's two media variants.
   *
   * When present it replaces the still portrait: the source page cycles four
   * pictures of the campaign in the same circle the estate draws one in, and
   * cloning that as a single still lost three of the four. `mediaLabel` goes
   * with it, because a carousel is not decorative — see `SitePageHeader`.
   */
  heroSlides?: { src: string; alt: string }[];
  /** Names the carousel, e.g. "Nasha Mukt Bharat Abhiyaan photographs". */
  heroSlidesLabel?: string;
  title: string;
  breadcrumb: Crumb[];
  /**
   * Rendered between the breadcrumb bar and the title band.
   *
   * For a call to action a source page puts above its own title — NMBA's green
   * "Join Nasha Mukt Bharat Abhiyaan" band. It sits BELOW the trail rather than
   * above it: the breadcrumb is how a reader knows where they are, so it stays
   * the first thing under the navigation on every page of the estate, and a
   * promotional band does not get to come before it.
   */
  afterBreadcrumb?: React.ReactNode;
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
   * Rendered BESIDE the organisation's mark, inside the header's logo slot.
   *
   * For the helpline badge that appears when the campaign band is dismissed. It
   * goes in the logo slot rather than beside the component because that slot IS
   * the row the mark sits in — "beside the mark" means inside it — and because
   * anything placed after `SitePageHeader` would sit under the title instead.
   */
  logoAside?: React.ReactNode;
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
  afterBreadcrumb,
  badge,
  logoSrc,
  featuredImage,
  description,
  actions,
  level,
  backHref,
  hasOverlappingFacts,
  logoAside,
  heroSlides,
  heroSlidesLabel,
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

  const hasCarousel = (heroSlides?.length ?? 0) > 0;
  const photo = featuredImage ?? bannerFromLogo;
  const mark = logoSrc && logoSrc !== photo ? logoSrc : undefined;
  const variant = level ?? (photo || hasCarousel ? "landing" : "inner");

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

      {afterBreadcrumb}

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
             * NO WHITE DISC AND NO RING — that was a code invention, and the
             * heavy stroke it drew is not in either design that specifies this
             * frame. The handoff's `Logo` (3751:10135) is a 100x100 frame with
             * NO fill, NO stroke and NO radius, holding a 100x100 image edge to
             * edge; the NMBA frame (51586:22013) draws its green seal bare on
             * the blue the same way. The build wrapped an 84px mark in a 100px
             * white circle with a `border-white/40` hairline, so eight pixels of
             * white ran all the way round every organisation mark on the estate
             * and read as a thick stroke the designer never drew.
             *
             * The disc was presumably defensive — a dark mark on transparent
             * would need a ground. Measured across all seventeen marks against
             * the band's lighter stop, it is not needed: the four near-black
             * wordmarks sit at 4.31:1, and the coloured seals carry their own
             * internal contrast, which is what the handoff relies on. A mark
             * that genuinely cannot hold the band is an ARTWORK problem for that
             * organisation, not a reason to put a white circle behind all of
             * them.
             *
             * EXPLICIT width/height, not `fill`. With `fill` and no `sizes`,
             * Next picked a 36px candidate off the srcset and upscaled it into a
             * 100px circle — the mark arrived soft to the point of looking
             * blank. A real intrinsic size lets it optimise for the size the
             * logo is actually drawn at, and `priority` keeps an above-the-fold
             * mark out of the lazy queue.
             */
            <div className="flex items-center gap-4">
              <span
                className={
                  markNeedsGround(mark)
                    ? "grid size-[100px] place-items-center overflow-hidden rounded-full bg-white"
                    : "grid size-[100px] place-items-center"
                }
              >
                <Image
                  src={mark}
                  alt=""
                  width={100}
                  height={100}
                  priority
                  className={markNeedsGround(mark) ? "size-[84px] object-contain" : "size-[100px] object-contain"}
                />
              </span>
              {logoAside}
            </div>
          ) : undefined
        }
        mediaLabel={hasCarousel ? heroSlidesLabel : undefined}
        media={
          hasCarousel ? (
            /*
             * THE DESIGN SYSTEM'S OWN `Carousel`, not a second one.
             *
             * It already carries the WAI-ARIA pattern, the pause control, the
             * reduced-motion rule and the dot behaviour the library documents —
             * dots are buttons with `aria-current`, never tabs, because a
             * tablist promises a roving arrow-key model this does not have.
             * What the header adds is the SHAPE: the circle, and the controls
             * lifted onto it. A component that already exists does not get
             * written twice so one page can be round.
             */
            <span className="sa-siteheader__carousel">
              <Carousel label={heroSlidesLabel ?? "Photographs"}>
                {heroSlides!.map((s) => (
                  <Image
                    key={s.src}
                    src={s.src}
                    alt={s.alt}
                    width={340}
                    height={340}
                    className="size-full object-cover"
                    priority
                  />
                ))}
              </Carousel>
            </span>
          ) : portrait ? (
            /*
             * THE PICTURE ONLY. The round frame, its size and its translucent
             * ground are `SitePageHeader`'s — this used to wrap the image in a
             * `size-[340px] overflow-hidden rounded-full bg-white/10` span, and
             * the second caller of that slot did not know it had to, which is
             * why the plaque is now drawn by the component. Do not put the
             * circle back here.
             *
             * What stays is the one thing that depends on the ARTWORK: a
             * photograph fills the circle, while a mark or the State Emblem is
             * padded so the round edge does not crop into it.
             */
            <Image
              src={portrait}
              alt=""
              width={340}
              height={340}
              className={portraitIsEmblem || !photo ? "object-contain p-12" : "object-cover"}
              priority
            />
          ) : undefined
        }
      />
    </>
  );
}
