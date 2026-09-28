import Image from "next/image";
import { Carousel } from "@mosje/design-system";
import { getHomeBanners } from "@/lib/website-shared/home-banners";

/**
 * The top banner carousel (DBIM 3.0 §A.4.1 ii), at the live site's 1800×600.
 *
 * The slides are the ones every design of the website shows —
 * lib/website-shared/home.ts: the CCPS banner always first (§7.4.1 i; live from
 * the feed, or its local copy), then the live home page's own banners. The images hold no text
 * (DBIM: banner text is HTML, never baked in), so each carries a description of
 * what it shows.
 *
 * It advances every seven seconds, as the live site's does, with the
 * controls on the banner's bottom edge (`controls="overlay"`). WCAG 2.2.2 is
 * met by the Carousel itself: a visible Pause, rotation held while the
 * pointer or focus is on it, and no motion at all under reduced motion.
 */
export async function Banner() {
  const slides = await getHomeBanners();
  return (
    <div className="wn-home-banner">
      <Carousel label="Banners" autoPlay interval={7} controls="overlay">
        {slides.map((b, i) => {
          const img = (
            <Image
              src={b.src}
              alt={b.alt}
              width={b.width}
              height={b.height}
              sizes="100vw"
              /* A CCPS feed image is on MyGov's host, which the image
                 optimiser is not configured for. */
              unoptimized={/^https?:\/\//.test(b.src)}
              /* THE FIRST SLIDE IS THE LARGEST CONTENTFUL PAINT on this page, and
                 Next said so in the dev log. Without this it is lazy like the rest,
                 so the biggest thing above the fold waits for the loader. Only the
                 first: the others are behind it and must stay lazy. */
              priority={i === 0}
              className="wn-home-banner__img"
            />
          );
          return b.href ? (
            <a
              key={b.src}
              href={b.href}
              target="_blank"
              rel="noopener noreferrer"
            >
              {img}
              <span className="sr-only"> (opens in a new window)</span>
            </a>
          ) : (
            <div key={b.src}>{img}</div>
          );
        })}
      </Carousel>
    </div>
  );
}
