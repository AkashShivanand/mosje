import Image from "next/image";
import Link from "next/link";
import { Button, Icon } from "@mosje/design-system";

import { T } from "@/components/i18n/translation-provider";

/**
 * The Prime Minister's quote — DBIM 3.0 §7.3(iv), Annexure checklist D (8–10).
 *
 * Figma: "05 · PM Quote — Options", Option 1 (Light Band, Photograph Right), chosen
 * over the deep-blue band and the citation card because a 42-word quote reads best
 * as dark ink on a pale ground, and because the band carries the department's own
 * brand tint rather than a second accent colour.
 *
 * What DBIM asks for, and where each lands:
 *  - the photograph on a TRANSPARENT background, from an authorised source → `portrait`
 *  - a quote relevant to the Department, citing the EVENT and DATE        → `EVENT`, `DATE`
 *  - preferably within one year of today                                  → see below
 *  - set in the darkest shade of the colour group                         → `text/brand/primary/bolder`
 *  - followed by a link to where it was delivered                         → `SOURCE`
 *  - after the banner and before the Ministry section                     → its place in `page.tsx`
 *
 * THE QUOTE IS REAL AND VERBATIM, from PIB's English rendering of the Address to the
 * Nation on the 79th Independence Day, Red Fort, 15 August 2025 (PRID 2156749). It
 * names social justice outright, which is the Department's own mandate. It is a month
 * past DBIM's "preferably within one year", so it is the one to replace when a newer
 * sector quote is issued.
 *
 * THE CHAKRA IS DECORATIVE and sits behind the portrait at the band's own tint, as in
 * Figma. It carries no alt text: the State Emblem's chakra here is ornament, and a
 * screen reader announcing it would say something the page does not mean.
 */
const QUOTE =
  "We emphasize saturation, because if there is any true execution of social justice, it is in saturation where no eligible person is left out, where the government goes to the eligible person’s home, and ensures they get what is rightfully theirs.";
const ATTRIBUTION = "Shri Narendra Modi, Prime Minister of India";
const EVENT = "Address to the Nation on the 79th Independence Day, Red Fort";
const DATE = "15 August 2025";
const DATE_TIME = "2025-08-15";
const SOURCE = "https://pib.gov.in/PressReleasePage.aspx?PRID=2156749";

export function PmQuote() {
  return (
    <section className="wn-pmq" aria-labelledby="wn-pmq-title">
      <h2 id="wn-pmq-title" className="ds-hdr-sr">
        <T>Quote from the Prime Minister</T>
      </h2>
      <div className="sa-container wn-pmq__in">
        <div className="wn-pmq__quote">
          {/* Decorative: the quotation is already marked up as a blockquote. */}
          <Icon name="format_quote" size={64} className="wn-pmq__mark" aria-hidden="true" />
          <blockquote className="wn-pmq__text" cite={SOURCE}>
            <p>{QUOTE}</p>
          </blockquote>
          <div className="wn-pmq__copy">
            <div>
              <p className="wn-pmq__who">{ATTRIBUTION}</p>
              <p className="wn-pmq__where">
                {EVENT} · <time dateTime={DATE_TIME}>{DATE}</time>
              </p>
            </div>
            <Button
              href={SOURCE}
              external
              linkAs={Link}
              variant="primary"
              appearance="outlined"
              size="sm"
              className="wn-pmq__action"
            >
              <T>Read the Full Address</T>
            </Button>
          </div>
        </div>

        <div className="wn-pmq__figure">
          <Image
            src="/website/images/pm-quote/ashoka-chakra.png"
            alt=""
            aria-hidden="true"
            width={600}
            height={600}
            className="wn-pmq__chakra"
          />
          <Image
            src="/website/images/pm-quote/prime-minister.png"
            alt="Shri Narendra Modi, Prime Minister of India"
            width={500}
            height={532}
            sizes="(max-width: 767px) 60vw, 432px"
            className="wn-pmq__portrait"
            priority={false}
          />
        </div>
      </div>
    </section>
  );
}
