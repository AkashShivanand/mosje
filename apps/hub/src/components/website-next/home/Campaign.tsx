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
                The national campaign for a drug-free India, run with the States
                across every district.
              </T>
            }
          />
          {/* ONE ACTION, and it is the campaign itself. This band used to carry
              "Take the Pledge" and "Find a De-addiction Centre"; both now have a
              section of their own further down the page — the pledges are gathered
              with the Senior Citizens pledge and the volunteering registers, and the
              locator is the whole tool rather than a link to it. Three doors to two
              destinations is the duplication ui-restraint-and-copy.md §1 bans. */}
          <div className="wn-home-campaign__actions">
            <Link
              href="/portals/nmba"
              className={buttonClasses("primary", "filled", "md")}
            >
              <T>Go to the campaign portal</T>
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
