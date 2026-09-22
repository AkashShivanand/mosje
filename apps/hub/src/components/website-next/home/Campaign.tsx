import Image from "next/image";
import Link from "next/link";
import { Icon, buttonClasses, orgLogoSrc } from "@mosje/design-system";

/**
 * The Department's national campaign, Nasha Mukt Bharat Abhiyaan, as its own
 * band rather than a slide in a carousel (issue ACC-11).
 *
 * No pledge counts: they were typed snapshots with no live source on this site,
 * and a figure without a source does not go on the page (live-data-fallback.md).
 * Helpline 14446: Annual Report 2025-26 §3.15.
 */
export function Campaign() {
  return (
    <section className="wn-home-campaign" aria-labelledby="campaign-title">
      <div className="sa-container wn-home-campaign__grid">
        <div className="wn-home-campaign__media">
          <Image
            src="/website/content/organisation/nmba-gallery-youth-awareness.jpg"
            alt="Young people at a Nasha Mukt Bharat Abhiyaan awareness programme"
            fill
            sizes="(min-width: 1024px) 560px, 100vw"
            className="wn-home-campaign__img"
          />
        </div>
        <div className="wn-home-campaign__copy">
          <Image src={orgLogoSrc("nmba")} alt="" width={56} height={56} className="wn-home-campaign__mark" />
          <h2 id="campaign-title" className="wn-home-campaign__title">
            Nasha Mukt Bharat Abhiyaan
          </h2>
          <p className="wn-home-campaign__lead">
            The national campaign for a drug-free India. Take the pledge, volunteer as a Nasha Mukti Mitr, or
            find a de-addiction centre near you.
          </p>
          <div className="wn-home-campaign__actions">
            <Link href="/portals/nmba/epledge" className={buttonClasses("primary", "filled", "md", undefined, "inverse")}>
              Take the Pledge
            </Link>
            <Link href="/website/de-addiction-centres" className={buttonClasses("primary", "outlined", "md", undefined, "inverse")}>
              Find a De-addiction Centre
            </Link>
          </div>
          <p className="wn-home-campaign__help">
            <Icon name="call" size={20} aria-hidden />
            <span>
              Toll-free helpline <a href="tel:14446">14446</a>
            </span>
          </p>
        </div>
      </div>
    </section>
  );
}
