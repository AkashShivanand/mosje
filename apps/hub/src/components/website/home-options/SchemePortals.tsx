import Image from "next/image";
import Link from "next/link";
import { Icon, SectionTitle } from "@mosje/design-system";
import { SCHEME_MARKS, type SchemeMark } from "./schemes";

/**
 * Scheme portals in the upper fold — two placements for the Secretary's review.
 *
 * A · `rail`    a full-width band directly beneath the hero carousel
 * B · `overlap` a raised card that rides the bottom edge of the hero
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

/** Option B — a raised card overlapping the hero's lower edge. */
export function SchemePortalsOverlap() {
  return (
    <section className="relative isolate bg-transparent" aria-labelledby="scheme-portals-heading">
      <div className="sa-container -mt-12 pb-4 md:-mt-16">
        <div className="rounded-2xl border border-border bg-surface p-5 shadow-lg md:p-6">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h2 id="scheme-portals-heading" className="text-title-1 text-primary-dark">
              Scheme Portals
            </h2>
            <AllPortals />
          </div>
          <div className="mt-4">
            <Tiles compact />
          </div>
        </div>
      </div>
    </section>
  );
}
