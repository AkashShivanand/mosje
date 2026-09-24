import Image from "next/image";
import { Carousel } from "@mosje/design-system";
import { getCcpsBanners } from "@/lib/website-next/ccps";

/**
 * The top banner carousel (DBIM 3.0 §A.4.1 ii), at the live site's 1800×600.
 *
 * The first slide is the CCPS banner (§7.4.1 i; live feed where configured,
 * otherwise the one dosje.gov.in serves — lib/website-next/ccps.ts); then the
 * Department's own banners, the four the live home page carries. The images hold no text (DBIM: banner text is
 * HTML, never baked in), so each carries a description of what it shows.
 *
 * It advances every seven seconds, as the live site's does, with the
 * controls on the banner's bottom edge (`controls="overlay"`). WCAG 2.2.2 is
 * met by the Carousel itself: a visible Pause, rotation held while the
 * pointer or focus is on it, and no motion at all under reduced motion.
 */
const SLIDES = [
  {
    src: "/website/images/banners/banner-1a.jpg",
    alt: "The Prime Minister with Ministers and senior officials at a public event",
  },
  {
    src: "/website/images/banners/banner-2a.jpg",
    alt: "A group photograph before a statue of Dr. B. R. Ambedkar",
  },
  {
    src: "/website/images/banners/banner-3a.jpg",
    alt: "An award presentation at a Nasha Mukt Bharat Abhiyaan event",
  },
  {
    src: "/website/images/banners/banner-5a.jpg",
    alt: "The 29th meeting of the Coordination Committee on the Protection of Civil Rights Act, 1955 and the SC/ST (Prevention of Atrocities) Act, 1989",
  },
];

export async function Banner() {
  const ccps = await getCcpsBanners();
  return (
    <div className="wn-home-banner">
      <Carousel label="Banners" autoPlay interval={7} controls="overlay">
        {ccps.map((b, i) => {
          const img = (
            <Image
              src={b.src}
              alt={b.alt}
              width={1800}
              height={600}
              unoptimized
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
        {SLIDES.map((s, i) => (
          <Image
            key={s.src}
            src={s.src}
            alt={s.alt}
            width={1800}
            height={600}
            sizes="100vw"
            /* Only when the department's own banners are absent does this become
               the first slide, and therefore the LCP. */
            priority={ccps.length === 0 && i === 0}
            className="wn-home-banner__img"
          />
        ))}
      </Carousel>
    </div>
  );
}
