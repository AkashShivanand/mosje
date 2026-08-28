import Image from "next/image";
import { Breadcrumb, type Crumb } from "./Breadcrumb";

export interface PageHeroProps {
  title: string;
  breadcrumb: Crumb[];
  badge?: string;
  logoSrc?: string;
  description?: string;
  lastUpdated?: string;
  actions?: React.ReactNode;
}

/**
 * Title band for inner pages: breadcrumb + optional badge/logo + H1 + optional intro.
 *
 * `lastUpdated` is part of the props because `PageLayout` reads it off the same
 * hero object and hands it to `SiteFooter`; the hero itself stopped rendering a
 * stamp when it was redesigned to the Figma treatment. DBIM 5.6 still requires
 * "Last Updated On" for the respective page and the footer is where it now
 * appears — so the prop stays, and this component does not destructure it.
 */
export function PageHero({
  title,
  breadcrumb,
  badge,
  logoSrc,
  description,
  actions,
}: PageHeroProps) {
  return (
    <>
      {/* 1. Breadcrumbs sit in their own white bar above the hero */}
      <div className="bg-white border-b border-gray-100 relative z-20">
        <div className="sa-container py-3">
          <Breadcrumb items={breadcrumb} />
        </div>
      </div>

      {/* 2. Blue hero section */}
      <section className="relative overflow-hidden bg-[#0373DF]">
        <div className="sa-container relative py-12 md:py-16">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
            {/* Left Content Column */}
            <div className="lg:col-span-8 flex gap-5 md:gap-6 items-stretch">
              {/* Left Accent Pipe */}
              <div className="w-1.5 rounded-full bg-white shrink-0" aria-hidden="true" />
              
              <div className="flex flex-col justify-center">
                {badge && (
                  <span className="inline-block rounded bg-white/20 px-2.5 py-1 text-xs font-bold text-white uppercase tracking-wide mb-3 self-start">
                    {badge}
                  </span>
                )}
                <h1 className="text-[32px] sm:text-[40px] font-bold leading-tight text-white">
                  {title}
                </h1>
                {description && (
                  <p className="mt-3 text-[16px] md:text-[18px] leading-relaxed text-white/95 max-w-3xl">
                    {description}
                  </p>
                )}
                {actions && <div className="mt-6">{actions}</div>}
                {/* No date here. GIGW 3.0 §5.1.5 requires every important entry
                    page to publish its last reviewed/modified date, and DBIM 5.6
                    names the footer as where "Last Updated On" lives — PageLayout
                    already passes this same value to SiteFooter, so the rule is
                    met once, on this page. Printing it in the banner as well put
                    two different-looking dates on one screen (this one, and the
                    data-currency stamp on the dashboard) with nothing to tell a
                    reader which governed the figures. The Figma banner carries
                    no date either. */}
              </div>
            </div>

            {/* Right Side Graphic / Circular Plaque */}
            <div className="lg:col-span-4 absolute right-0 top-1/2 -translate-y-1/2 hidden md:flex items-center justify-end pointer-events-none opacity-20 lg:opacity-100 select-none pr-8">
              {logoSrc ? (
                 <div className="h-48 w-48 relative rounded-full shadow-2xl border-4 border-white overflow-hidden bg-white">
                   <Image src={logoSrc} alt={title} fill className="object-contain p-4" />
                 </div>
              ) : (
                /* Default 3D Ministry Plaque Representation */
                <div className="w-[380px] h-[380px] rounded-full border-[10px] border-[#0256a8] bg-[#0365c4] shadow-2xl flex items-center justify-center relative translate-x-12">
                  <div className="w-[320px] h-[320px] rounded-full border-2 border-[#024991] bg-gradient-to-br from-[#047aeb] to-[#025bb3] flex flex-col items-center justify-center text-center p-8 gap-4 shadow-inner">
                    <Image
                      src="/website/images/National_Emblem_logo_white.svg"
                      alt="National Emblem of India"
                      width={100}
                      height={120}
                      className="drop-shadow-md"
                    />
                    <div className="text-white font-bold tracking-widest text-[11px] leading-tight uppercase opacity-90 drop-shadow-sm">
                      Ministry of Social Justice<br />&amp; Empowerment
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
