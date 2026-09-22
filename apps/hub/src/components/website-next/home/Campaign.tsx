import { T } from "@/components/i18n/translation-provider";
import Image from "next/image";
import Link from "next/link";
import {
  Band,
  Icon,
  SectionTitle,
  buttonClasses,
  orgLogoSrc,
} from "@mosje/design-system";

/**
 * The national campaign band — Nasha Mukt Bharat Abhiyaan.
 *
 * On the brand's own tint, not the campaign's green: DBIM §2.1 asks for one
 * primary colour group used consistently, so the campaign's colour lives in
 * its own mark and photograph, not in the page. No pledge counts: they were
 * typed snapshots with no live source on this site. Helpline 14446: Annual
 * Report 2025-26 §3.15.
 */
export function Campaign() {
  return (
    <Band
      as="section"
      tone="brand"
      spacing="xl"
      aria-labelledby="campaign-title"
    >
      <div className="wn-home-campaign__grid">
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
          <Image
            src={orgLogoSrc("nmba")}
            alt=""
            width={64}
            height={64}
            className="wn-home-campaign__mark"
          />
          <SectionTitle
            size="display"
            headingId="campaign-title"
            title={<T>Nasha Mukt Bharat Abhiyaan</T>}
            description={
              <T>
                The national campaign for a drug-free India. Take the pledge,
                volunteer as a Nasha Mukti Mitr, or find a de-addiction centre
                near you.
              </T>
            }
          />
          <div className="wn-home-campaign__actions">
            <Link
              href="/portals/nmba/epledge"
              className={buttonClasses("primary", "filled", "md")}
            >
              <T>Take the Pledge</T>
            </Link>
            <Link
              href="/website/de-addiction-centres"
              className={buttonClasses("primary", "outlined", "md")}
            >
              <T>Find a De-addiction Centre</T>
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
    </Band>
  );
}
