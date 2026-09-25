import Image from "next/image";
import Link from "next/link";
import { Button } from "@mosje/design-system";

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
        {/* A CARD ON THE PAGE'S OWN GROUND, which is what the design draws:
            the section frame carries a blue gradient that is switched OFF in
            the file, so the card sits on white and its hairline, its shadow
            and the portrait's panel are the whole of its edge. A tinted band
            was tried under it and read as a seam between the hero photograph
            and the card — a third ground in 40px — and the page already
            carries several tinted bands for the card to compete with. */}
        <div className="wn-pmq__card">

          {/* THE PHOTOGRAPH IS THE DESIGN'S OWN, taken from the card's image
              fill rather than matched by eye — a different portrait stood here,
              in a navy jacket, against the saffron one the design places on a
              saffron panel. It FILLS the panel, as drawn: the design stretches
              it edge to edge and crops it, so `cover` reproduces that framing
              within a pixel rather than floating a contained cut-out.
              RESOLUTION IS AN OPEN ITEM AND IT IS OURS, not the DBIM
              Toolkit's. The Figma layer is named "PM Photograph (DBIM Toolkit
              — pending)" and both of its image fills are 488x409, which is all
              the design file holds. Against a 351px desktop panel and a 356px
              phone band on a 2x screen that is upscaled roughly 1.5x, and it
              shows. The estate's own rule is 3x the largest surface
              (ds-documentation-standard.md §3), so this wants a portrait about
              1050px wide from an authorised source. Nothing here upscales it
              in the meantime — decided 25 Sep 2026 not to wait on the
              Toolkit. */}
          <div className="wn-pmq__figure">
            <Image
              src="/website/images/pm-quote/prime-minister-saffron.png"
              alt="Shri Narendra Modi, Prime Minister of India"
              fill
              sizes="(max-width: 1023px) 100vw, 351px"
              className="wn-pmq__portrait"
              priority={false}
            />
          </div>
          <div className="wn-pmq__body">
          {/* THE QUOTATION MARK IS THE DESIGN'S OWN VECTOR, exported from the
              card's `Quote Mark` node rather than approximated. It is not an
              <Icon> for two reasons: Material Symbols publishes only
              `format_quote`, which is a CLOSING mark, and the estate's icon
              scale tops out at 64 against the 128 the design draws — a
              contract `check:icon-audit` holds per file. Its fill and its 40%
              are set in CSS, so the mark follows the brand mode rather than
              carrying the exported hex. It is decorative: the quotation is
              already marked up as a blockquote. */}
          <svg
            className="wn-pmq__mark"
            viewBox="0 0 128 128"
            aria-hidden
            focusable="false"
          >
            <path d="M96.3725 53.7067C94.1325 53.7067 91.9458 54.0801 89.8658 54.6134C90.3458 53.0134 90.7725 51.3601 91.5725 49.92C92.1591 48.2667 93.1191 46.8267 94.0791 45.4401C94.8791 43.8934 96.2658 42.8267 97.2791 41.4934C98.3458 40.2134 99.7858 39.3601 100.959 38.2934C102.079 37.1734 103.572 36.5867 104.746 35.84C105.972 35.1467 107.039 34.3467 108.212 33.9734C109.332 33.4934 110.292 33.1201 111.092 32.8001C112.692 32.1601 113.599 31.7334 113.599 31.7334L111.039 21.3867C111.039 21.3867 109.866 21.6534 107.839 22.1334C106.826 22.4001 105.599 22.6667 104.159 23.0401C102.719 23.3067 101.172 24.0534 99.4658 24.6934C97.7591 25.4401 95.7858 25.9734 93.9725 27.2001C92.1591 28.3734 90.0258 29.3334 88.1591 30.8801C86.3458 32.4801 84.1591 33.8667 82.5591 35.8934C80.7991 37.8134 79.0391 39.7867 77.7058 42.0801C76.1591 44.2667 75.0925 46.6667 73.9725 49.0134C72.9591 51.3601 72.1591 53.8134 71.4658 56.16C70.1858 60.8534 69.6525 65.3334 69.4391 69.1734C69.2791 73.0134 69.3858 76.2134 69.5991 78.5067C69.7058 79.5734 69.8125 80.6401 69.9191 81.3867L70.0791 82.2934C71.1458 95.9467 82.3991 106.72 96.3725 106.72C110.986 106.72 122.826 94.8801 122.826 80.2667C122.826 65.6534 110.986 53.8134 96.3725 53.8134V53.7067ZM32.4791 53.7067C30.2391 53.7067 28.0525 54.0801 25.9725 54.6134C26.4525 53.0134 26.8791 51.3601 27.6791 49.92C28.2658 48.2667 29.2258 46.8267 30.1858 45.4401C30.9858 43.8934 32.3725 42.8267 33.3858 41.4934C34.4525 40.2134 35.8925 39.3601 37.0658 38.2934C38.1858 37.1734 39.6791 36.5867 40.8525 35.84C42.0791 35.1467 43.1458 34.3467 44.3191 33.9734C45.4391 33.4934 46.3991 33.1201 47.1991 32.8001C48.7991 32.1601 49.7058 31.7334 49.7058 31.7334L47.1458 21.3867C47.1458 21.3867 45.9725 21.6534 43.9458 22.1334C42.9325 22.4001 41.7058 22.6667 40.2658 23.0401C38.8258 23.3067 37.2791 24.0534 35.5725 24.6934C33.8658 25.4401 31.8925 25.9734 30.0791 27.2001C28.2658 28.3734 26.1325 29.3334 24.2658 30.8801C22.4525 32.4801 20.2658 33.8667 18.6658 35.8934C16.9058 37.8134 15.1458 39.7867 13.8125 42.0801C12.2658 44.2667 11.1991 46.6667 10.0791 49.0134C9.06579 51.3601 8.26579 53.8134 7.57245 56.16C6.29245 60.8534 5.75912 65.3334 5.54579 69.1734C5.38579 73.0134 5.49245 76.2134 5.70579 78.5067C5.81245 79.5734 5.91912 80.6401 6.02579 81.3867L6.18579 82.2934C7.25245 95.9467 18.5058 106.72 32.4791 106.72C47.0925 106.72 58.9325 94.8801 58.9325 80.2667C58.9325 65.6534 47.0925 53.8134 32.4791 53.8134V53.7067Z" />
          </svg>
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

        </div>
      </div>
    </section>
  );
}
