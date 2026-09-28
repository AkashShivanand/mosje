import Image from "next/image";
import { Icon } from "@mosje/design-system";
import { PM_QUOTE } from "@/lib/website-shared/home";

/**
 * PM Quote — DBIM 3.0 §7.3(iv) and Annexure checklist D (items 8–10), as a band:
 * image left, per DBIM's illustrative figure 54.
 *
 * The quotation, its citation and the photograph are shared with every design of
 * the website — PM_QUOTE in lib/website-shared/home.ts, with its source. Until
 * 28 Sep 2026 this band kept its own copy and drew an empty photograph slot, while
 * the transparent portrait DBIM asks for was already in the estate.
 */
function Portrait() {
  const img = PM_QUOTE.image.cutout;
  return (
    <Image
      src={img.src}
      alt={PM_QUOTE.image.alt}
      width={img.width}
      height={img.height}
      sizes="(max-width: 767px) 240px, 320px"
      className="h-auto w-60 shrink-0 md:w-80"
    />
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
        href={PM_QUOTE.passageHref}
        target="_blank"
        rel="noreferrer"
        className="mt-2 inline-flex items-center gap-1 font-semibold text-primary-900 underline-offset-2 hover:underline"
      >
        Read the Full Address <Icon name="open_in_new" size={16} aria-hidden />
        <span className="sr-only">(opens {PM_QUOTE.source.name} in a new tab)</span>
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
