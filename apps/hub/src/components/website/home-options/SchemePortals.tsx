import Image from "next/image";
import Link from "next/link";
import { Icon, SectionTitle } from "@mosje/design-system";
import { SCHEME_MARKS, type SchemeMark } from "./schemes";

/**
 * Scheme portals in the upper fold — two placements for the Secretary's review.
 *
 * A · `rail`    a full-width band directly beneath the hero carousel
 * B · `strip`   a slim one-line strip directly beneath the hero
 *
 * Nothing overlaps the banner — ruled out in review, 2026-09-17.
 *
 * Both render the same marks from `SCHEME_MARKS`, so choosing one is a layout
 * decision only.
 */

function SchemeLink({ scheme, children, className }: { scheme: SchemeMark; children: React.ReactNode; className: string }) {
  if (scheme.external) {
    return (
      <a href={scheme.portalHref} target="_blank" rel="noreferrer" className={className}>
        {children}
        <span className="sr-only"> (opens in a new tab)</span>
      </a>
    );
  }
  return (
    <Link href={scheme.portalHref} className={className}>
      {children}
    </Link>
  );
}

const TILE =
  "group flex h-full flex-col items-center gap-3 rounded-xl border border-border bg-surface p-4 text-center transition hover:border-primary hover:shadow-md focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary";

function Tiles({ compact = false }: { compact?: boolean }) {
  return (
    <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
      {SCHEME_MARKS.map((scheme) => (
        <li key={scheme.abbr}>
          <SchemeLink scheme={scheme} className={TILE}>
            <Image
              src={scheme.markSrc}
              alt=""
              width={compact ? 56 : 72}
              height={compact ? 56 : 72}
              className={compact ? "h-14 w-14 object-contain" : "h-[72px] w-[72px] object-contain"}
            />
            <span className="text-label-1 text-ink group-hover:text-primary-dark">{scheme.abbr}</span>
            <span className="text-body-3 text-ink-muted">{scheme.name}</span>
          </SchemeLink>
        </li>
      ))}
    </ul>
  );
}

function AllPortals() {
  return (
    <Link href="/portals" className="inline-flex items-center gap-1 text-label-1 text-primary-dark hover:underline">
      View All Portals <Icon name="arrow_forward" size={16} aria-hidden />
    </Link>
  );
}

/** Option A — a band of its own, straight after the hero. */
export function SchemePortalsRail() {
  return (
    <section className="border-b border-border bg-surface" aria-labelledby="scheme-portals-heading">
      <div className="sa-container py-10">
        <SectionTitle
          headingId="scheme-portals-heading"
          title="Scheme Portals"
          description="Apply for, track and manage the Department's schemes on their own portals."
        >
          <AllPortals />
        </SectionTitle>
        <div className="mt-6">
          <Tiles />
        </div>
      </div>
    </section>
  );
}

/** Option B — a slim strip under the banner: marks and short names on one line. */
export function SchemePortalsStrip() {
  return (
    <section className="border-b border-border bg-primary-50" aria-labelledby="scheme-portals-heading">
      <div className="sa-container flex flex-col gap-4 py-5 lg:flex-row lg:items-center lg:gap-8">
        <h2 id="scheme-portals-heading" className="shrink-0 text-title-1 text-primary-dark">
          Scheme Portals
        </h2>
        <ul className="grid flex-1 grid-cols-3 gap-2 sm:grid-cols-6">
          {SCHEME_MARKS.map((scheme) => (
            <li key={scheme.abbr}>
              <SchemeLink
                scheme={scheme}
                className="flex items-center gap-2 rounded-lg bg-surface px-2 py-2 transition hover:shadow-md focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
              >
                <Image src={scheme.markSrc} alt="" width={36} height={36} className="h-9 w-9 shrink-0 object-contain" />
                <span className="text-label-1 text-ink">{scheme.abbr}</span>
                <span className="sr-only">{scheme.name}</span>
              </SchemeLink>
            </li>
          ))}
        </ul>
        <div className="shrink-0">
          <AllPortals />
        </div>
      </div>
    </section>
  );
}
