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
/**
 * THE LINK LANDS ON THE SENTENCE, not at the top of a long address.
 *
 * A text fragment (`#:~:text=start,end`) tells the browser to scroll to the
 * quoted passage and highlight it. The release runs to thousands of words and
 * the quotation sits in its middle; without this a reader who follows the link
 * to check what was said has to hunt for it.
 *
 * Verified against the live release before it was written: the passage appears
 * verbatim, "We emphasize saturation … rightfully theirs." A fragment that does
 * not match is IGNORED — the reader lands at the top, exactly as before — so
 * this degrades to the plain link in browsers that do not implement it, and the
 * day PIB re-words the page.
 */
const SOURCE_PASSAGE = `${SOURCE}#:~:text=We%20emphasize%20saturation,rightfully%20theirs.`;

export function PmQuote() {
  return (
    <section className="wn-pmq" aria-labelledby="wn-pmq-title">
      <h2 id="wn-pmq-title" className="ds-hdr-sr">
        <T>Quote from the Prime Minister</T>
      </h2>
      <div className="sa-container">
        {/* A CARD, NOT A BAND. The quotation is the most quotable thing on the
            page and the page already carries several tinted bands, so a band
            of its own put it in competition with them. The card gives it an
            edge of its own, and it holds the portrait — which floated on the
            band before, a cut-out with nothing behind it. */}
        <div className="wn-pmq__card">
          {/* Decorative: the quotation is already marked up as a blockquote. */}
          <Icon
            name="format_quote"
            size={64}
            className="wn-pmq__mark"
            aria-hidden
          />

          <div className="wn-pmq__body">
            <blockquote className="wn-pmq__text" cite={SOURCE}>
              <p>{QUOTE}</p>
            </blockquote>

            <div className="wn-pmq__foot">
              <div>
                <p className="wn-pmq__who">{ATTRIBUTION}</p>
                <p className="wn-pmq__where">
                  {EVENT} · <time dateTime={DATE_TIME}>{DATE}</time>
                </p>
              </div>
              <Button
                href={SOURCE_PASSAGE}
                external
                linkAs={Link}
                variant="primary"
                appearance="filled"
                size="sm"
                className="wn-pmq__action"
              >
                <T>Read the Full Address</T>
              </Button>
            </div>
          </div>

          <div className="wn-pmq__figure">
            <Image
              src="/website/images/pm-quote/prime-minister.png"
              alt="Shri Narendra Modi, Prime Minister of India"
              width={500}
              height={532}
              sizes="(max-width: 767px) 60vw, 351px"
              className="wn-pmq__portrait"
              priority={false}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
