import Image from "next/image";
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
  featuredImage,
  description,
  actions,
}: PageHeroProps) {
  // Use explicit featuredImage or check if logoSrc is a wide banner
  const bannerImage = featuredImage ?? (logoSrc && (logoSrc.includes("Banner") || logoSrc.includes("banner") || logoSrc.includes("NCSC-2") || logoSrc.includes("smile-beggary")) ? logoSrc : undefined);
  const actualLogo = logoSrc && logoSrc !== bannerImage ? logoSrc : undefined;

  return (
    <>
      {/* 1. Breadcrumbs sit in their own white bar above the hero */}
      <div className="bg-white border-b border-gray-100 relative z-20">
        <div className="sa-container py-3">
          <Breadcrumb items={breadcrumb} />
        </div>
      </div>

      {/* 2. Blue hero section */}
      <section className="relative overflow-hidden bg-[var(--sa-color-primaryScale-600)]">
        <div className="sa-container relative py-10 md:py-14">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
            {/* Left Content Column */}
            <div className="lg:col-span-7 xl:col-span-8 flex gap-5 md:gap-6 items-stretch">
              {/* Left Accent Pipe */}
              <div className="w-1.5 rounded-full bg-white shrink-0" aria-hidden="true" />
              
              <div className="flex flex-col justify-center">
                <div className="flex items-center gap-3 mb-3 flex-wrap">
                  {actualLogo && (
                    <div className="h-12 w-12 relative rounded-full bg-white p-1 shadow-sm shrink-0 overflow-hidden border border-white/40">
                      <Image src={actualLogo} alt={title} fill className="object-contain p-0.5" />
                    </div>
                  )}
                  {badge && (
                    <span className="inline-block rounded bg-white/20 px-2.5 py-1 text-xs font-bold text-white uppercase tracking-wide">
                      {badge}
                    </span>
                  )}
                </div>

                <h1 className="text-[30px] sm:text-[36px] font-bold leading-tight text-white">
                  {title}
                </h1>
                {description && (
                  <p className="mt-3 text-[15px] md:text-[17px] leading-relaxed text-white/95 max-w-3xl">
                    {description}
                  </p>
                )}
                {actions && <div className="mt-6">{actions}</div>}
              </div>
            </div>

            {/* Right Side Graphic: Circular Photo Plaque with Halo Effect (Figma 3751:10132) */}
            <div className="lg:col-span-5 xl:col-span-4 flex items-center justify-center lg:justify-end select-none">
              <div className="relative w-[260px] h-[260px] sm:w-[300px] sm:h-[300px] md:w-[340px] md:h-[340px] flex items-center justify-center">
                {/* Ambient Halo Glow */}
                <div
                  className="absolute inset-2 rounded-full bg-white/20 blur-2xl transform scale-105 pointer-events-none"
                  aria-hidden="true"
                />
                {bannerImage ? (
                  <div className="relative w-full h-full rounded-full overflow-hidden border-4 border-white/40 shadow-2xl bg-white/10 backdrop-blur-sm">
                    <Image
                      src={bannerImage}
                      alt={title}
                      fill
                      className="object-cover"
                      priority
                    />
                  </div>
                ) : (
                  <div className="relative w-full h-full rounded-full border-4 border-white/40 bg-gradient-to-br from-white/25 to-white/10 shadow-2xl flex flex-col items-center justify-center p-6 text-center backdrop-blur-sm">
                    <Image
                      src="/website/images/National_Emblem_logo_white.svg"
                      alt="National Emblem of India"
                      width={90}
                      height={110}
                      className="drop-shadow-lg"
                    />
                    <div className="text-white font-bold tracking-widest text-[10px] leading-tight uppercase opacity-95 drop-shadow-sm mt-3">
                      Ministry of Social Justice<br />&amp; Empowerment
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
