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
 * It does not advance by itself: `Carousel` defaults to still, with previous,
 * next and a dot for each slide, so nothing moves that a reader did not move
 * (WCAG 2.2.2). The live site's carousel auto-advanced.
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
      <Carousel label="Banners">
        {ccps.map((b) => {
          const img = (
            <Image
              src={b.src}
              alt={b.alt}
              width={1800}
              height={600}
              unoptimized
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
        {SLIDES.map((s) => (
          <Image
            key={s.src}
            src={s.src}
            alt={s.alt}
            width={1800}
            height={600}
            sizes="100vw"
            className="wn-home-banner__img"
          />
        ))}
      </Carousel>
    </div>
  );
}
