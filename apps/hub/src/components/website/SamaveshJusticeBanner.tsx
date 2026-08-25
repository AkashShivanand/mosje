import Image from "next/image";
import Link from "next/link";
import { Icon, buttonClasses } from "@mosje/design-system";

/**
 * The SAMAVESH banner, as designed: one photographic card with the sunset behind it
 * and the citizen group breaking above its top edge.
 *
 * It used to ship `portal-banner-images.png` — a flat raster of the whole Figma comp,
 * headline, subline and Explore button included — parked beside a re-typeset copy of
 * the same words. So every string on this banner rendered twice, once as text and once
 * as pixels, and the pixel copy could not resize, could not be translated by the
 * language switcher and had no text alternative. On a public government page that is a
 * WCAG 1.4.5 failure, not a fidelity gap.
 *
 * The comp is now split into the two things it actually is: `samavesh-banner-sky.jpg`
 * (background, decorative) and `samavesh-banner-people.png` (the group, matted out of
 * its white studio ground). Everything else on the card is real DOM.
 *
 * Geometry is expressed relative to the card, not in pixels: positions as percentages,
 * type in `cqw` against the card's own container-query width. The design's card is
 * 1272px wide but `.sa-container` currently resolves to 1136, and that number is still
 * under review (design says 1320, CLAUDE.md says 1280, the build says 1200). Sizing
 * everything against the card means the composition holds its Figma proportions at
 * whichever width it lands on — with fixed px kept below `md`, where cqw would shrink
 * the type past legibility.
 */
export function SamaveshJusticeBanner() {
  return (
    <section className="bg-surface overflow-hidden" aria-labelledby="samavesh-banner-heading">
      <div className="sa-container pt-14 pb-12 md:pt-20 md:pb-14">
        {/* `@container` scopes the cqw type below to the card's own width, so the
            composition holds its Figma proportions whether the container resolves
            to 1136, 1272 or 1320. */}
        <div className="@container relative">
          {/* The card. Clipped, so the sky's corners are the card's corners.
              The aspect ratio is applied from `lg` ONLY. `aspect-ratio` together
              with `min-height` resolves the other way round — the box takes its
              height from min-h and then derives its WIDTH from the ratio — so at
              390px this rendered a 1187px-wide card, saved from breaking the page
              only by the section's overflow clip. Below lg the card is sized by a
              plain min-height instead. */}
          <div className="relative min-h-[300px] overflow-hidden rounded-2xl sm:min-h-[260px] lg:aspect-[1272/300] lg:min-h-0">
            <Image
              src="/website/images/samavesh-banner-sky.jpg"
              alt=""
              aria-hidden="true"
              fill
              sizes="(max-width: 768px) 100vw, 1272px"
              className="object-cover object-bottom"
              priority
            />
          </div>

          {/* The group sits OUTSIDE the clipped card so it can break above its top
              edge, exactly as the design has it. Hidden below lg — the same
              breakpoint the cqw type starts at, so there is no width where the
              figures are present but the text is not yet sized to the card. */}
          <div className="pointer-events-none absolute left-[45%] top-[-18%] hidden h-[118%] w-[57%] lg:block">
            <Image
              src="/website/images/samavesh-banner-people.png"
              alt="Citizens of India — the communities SAMAVESH brings services to."
              fill
              sizes="(max-width: 1024px) 0px, 724px"
              className="object-contain object-bottom"
              priority
            />
          </div>

          {/* Content sits above both images. */}
          {/* Text column is 746 of the card's 1272 (58.6%), starting at 96 (7.5%) —
              the design's measure, which keeps the subline on one line and stops
              short of the leftmost figure. */}
          <div className="absolute inset-0 z-10 flex flex-col justify-center px-[6%] lg:pl-[7.5%] lg:pr-[34%]">
            <div className="flex items-center gap-3 lg:gap-[1.1cqw]">
              <Image
                src="/website/images/samavesh.png"
                alt=""
                aria-hidden="true"
                width={78}
                height={80}
                className="h-[44px] w-auto sm:h-[60px] lg:h-[6.29cqw]"
              />
              <div>
                <p className="text-[18px] font-bold leading-tight tracking-[0.01em] text-ink sm:text-[21px] lg:text-[1.89cqw]">
                  SAMAVESH
                </p>
                <p className="mt-0.5 text-[10px] leading-[1.45] text-ink-muted sm:text-[11px] lg:text-[0.94cqw]">
                  Social Justice and Marginalised Advancement
                  <br />
                  Vistaar of Empowerment Services Hub.
                </p>
              </div>
            </div>

            <h2
              id="samavesh-banner-heading"
              className="mt-2 text-[26px] font-bold leading-[1.12] tracking-[-0.01em] text-ink sm:text-[32px] lg:mt-[0.63cqw] lg:text-[3.3cqw]"
            >
              Justice. Equality. Dignity.
            </h2>

            <p className="mt-1.5 text-[14px] leading-[1.4] text-ink-muted sm:text-[15px] lg:text-[1.34cqw]">
              SAMAVESH brings every social justice service into one trusted, transparent portal.
            </p>

            <div className="mt-4 lg:mt-[1.26cqw]">
              <Link
                href="/website/samavesh-citizen-portals"
                className={buttonClasses("primary", "filled", "md", "bg-ink text-white hover:bg-ink-strong rounded-lg px-5")}
              >
                Explore
                <span className="ds-btn__icon" aria-hidden="true">
                  <Icon name="arrow_forward" size={16} />
                </span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
