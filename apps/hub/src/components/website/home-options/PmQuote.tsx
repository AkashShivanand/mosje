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
 *  - it sits after the banner and before the Ministry section (DBIM homepage order)
 *
 * THE QUOTE IS REAL. Verbatim from PIB's English rendering of the Prime Minister's
 * Independence Day address from the Red Fort, 15 August 2025 (PRID 2156749), checked
 * against the published page on 17 September 2026. It names social justice outright,
 * which is the Department's own mandate. It is one month past DBIM's "preferably
 * within one year", so it is the one to replace when a newer sector quote is issued.
 *
 * THE PHOTOGRAPH IS NOT YET SUPPLIED. No authorised transparent PM image exists in
 * this repository, and one is not invented: the slot renders until `image` is set
 * to the file from the DBIM Toolkit.
 */
export const PM_QUOTE = {
  quote:
    "We emphasize saturation, because if there is any true execution of social justice, it is in saturation where no eligible person is left out, where the government goes to the eligible person\u2019s home, and ensures they get what is rightfully theirs.",
  attribution: "Shri Narendra Modi, Prime Minister of India",
  event: "Address to the Nation on the 79th Independence Day, Red Fort",
  date: "15 August 2025",
  dateTime: "2025-08-15",
  sourceHref: "https://pib.gov.in/PressReleasePage.aspx?PRID=2156749",
  sourceName: "pib.gov.in",
  /** Transparent-background PNG from the DBIM Toolkit. Null until supplied. */
  image: null as string | null,
};

function Portrait() {
  const box = "h-44 w-40 md:h-56 md:w-48";
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
      <Icon name="person" size={96} aria-hidden />
    </div>
  );
}

function Citation() {
  return (
    <p className="mt-4 text-body-2 text-ink-muted">
      <span className="font-semibold text-ink">{PM_QUOTE.attribution}</span>
      <span className="block">
        {PM_QUOTE.event}, <time dateTime={PM_QUOTE.dateTime}>{PM_QUOTE.date}</time>
      </span>
      <a
        href={PM_QUOTE.sourceHref}
        target="_blank"
        rel="noreferrer"
        className="mt-2 inline-flex items-center gap-1 font-semibold text-primary-900 underline-offset-2 hover:underline"
      >
        Read the Full Address <Icon name="open_in_new" size={14} aria-hidden />
        <span className="sr-only">(opens {PM_QUOTE.sourceName} in a new tab)</span>
      </a>
    </p>
  );
}

/** Full-width band, image left, per DBIM's illustrative figure 54. */
export function PmQuoteBand() {
  return (
    <section className="bg-surface-muted" aria-label="Prime Minister's Message">
      <div className="sa-container flex flex-col items-center gap-6 pt-10 md:flex-row md:items-end md:gap-12 md:pt-8">
        <Portrait />
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
