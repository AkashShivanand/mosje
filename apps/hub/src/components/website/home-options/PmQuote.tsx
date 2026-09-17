import { Icon } from "@mosje/design-system";

/**
 * PM Quote — DBIM 3.0 §7.3(iv) and Annexure checklist D (items 8–10).
 *
 * What DBIM requires, and where each lands here:
 *  - the PM image with a TRANSPARENT background, from an authorised source
 *    (pmindia.gov.in or the DBIM Toolkit image bank)       → `PM_QUOTE.image`
 *  - a quote relevant to the Department, citing EVENT and DATE → `event`, `date`
 *  - preferably within one year of today                   → see `date`
 *  - set in the DARKEST shade of the colour group          → `text-primary-900`
 *  - followed by a hyperlink to where it was delivered     → `sourceHref`
 *  - it sits after the ticker and before the Ministry section (DBIM homepage order)
 *
 * PENDING BEFORE PUBLICATION: the image file and a verbatim quote must come from
 * the DBIM Toolkit / pmindia.gov.in. The quote below is the candidate from the PM's
 * address at the Samajik Adhikarita Shivir, Prayagraj — the Department's own camp —
 * and it is older than DBIM's one-year preference. Both are recorded on the approval
 * sheet; the component does not change when they are swapped.
 */
export const PM_QUOTE = {
  quote:
    "It is the responsibility of the government to ensure that every person is benefited and every person gets justice.",
  attribution: "Shri Narendra Modi, Prime Minister of India",
  event: "Samajik Adhikarita Shivir, Prayagraj",
  date: "29 February 2020",
  sourceHref: "https://www.pmindia.gov.in/en/news_updates/pms-address-at-samajik-adhikarita-shivir-in-prayagraj-uttar-pradesh/",
  /** Transparent-background PNG from the DBIM Toolkit. Null until supplied. */
  image: null as string | null,
};

function Portrait({ size }: { size: "lg" | "sm" }) {
  const box = size === "lg" ? "h-44 w-40 md:h-56 md:w-48" : "h-28 w-24";
  if (PM_QUOTE.image) {
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={PM_QUOTE.image} alt="Shri Narendra Modi, Prime Minister of India" className={`${box} object-contain object-bottom`} />;
  }
  return (
    <div
      role="img"
      aria-label="Image slot for the Prime Minister's photograph, to be supplied from the DBIM Toolkit"
      className={`${box} flex shrink-0 items-end justify-center rounded-t-full border-2 border-dashed border-primary/40 bg-primary-50 text-primary-dark`}
    >
      <Icon name="person" size={size === "lg" ? 96 : 56} aria-hidden />
    </div>
  );
}

function Citation() {
  return (
    <p className="mt-4 text-body-2 text-ink-muted">
      <span className="font-semibold text-ink">{PM_QUOTE.attribution}</span>
      <span className="block">
        {PM_QUOTE.event}, {PM_QUOTE.date}
      </span>
      <a
        href={PM_QUOTE.sourceHref}
        target="_blank"
        rel="noreferrer"
        className="mt-2 inline-flex items-center gap-1 font-semibold text-primary-900 underline-offset-2 hover:underline"
      >
        Read the Address <Icon name="open_in_new" size={14} aria-hidden />
        <span className="sr-only">(opens pmindia.gov.in in a new tab)</span>
      </a>
    </p>
  );
}

/** Option A — full-width band, image left, per DBIM's illustrative figure 54. */
export function PmQuoteBand() {
  return (
    <section className="bg-surface-muted" aria-label="Prime Minister's Message">
      <div className="sa-container flex flex-col items-center gap-6 pt-10 md:flex-row md:items-end md:gap-12 md:pt-8">
        <Portrait size="lg" />
        <figure className="max-w-3xl pb-10 md:pb-12">
          <blockquote className="text-headline-3 text-primary-900">“{PM_QUOTE.quote}”</blockquote>
          <figcaption>
            <Citation />
          </figcaption>
        </figure>
      </div>
    </section>
  );
}

/** Option B — a compact card that replaces the unattributed quote inside About Us. */
export function PmQuoteCard() {
  return (
    <figure className="mt-6 flex items-end gap-4 overflow-hidden rounded-xl border border-border bg-surface pr-5 pt-4 shadow-sm">
      <div className="pl-4">
        <Portrait size="sm" />
      </div>
      <div className="pb-4">
        <blockquote className="text-title-1 text-primary-900">“{PM_QUOTE.quote}”</blockquote>
        <figcaption>
          <Citation />
        </figcaption>
      </div>
    </figure>
  );
}
