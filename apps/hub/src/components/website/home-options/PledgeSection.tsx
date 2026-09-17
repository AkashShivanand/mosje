import Image from "next/image";
import { Icon, SectionTitle } from "@mosje/design-system";
import { PLEDGE_POINTS } from "@/lib/scw/mock-data";

/**
 * "Take a Pledge" — Senior Citizens Welfare and Nasha Mukt Bharat Abhiyaan, side by side.
 *
 * A · `cards` two cards: SCW's pledge, and NMBA's two pledge channels with their counts
 * B · `band`  one brand band carrying all three pledge links
 *
 * NMBA KEEPS BOTH OF ITS CHANNELS (review, 2026-09-17). The homepage already offers
 * a non-user pledge and a recovered-user pledge, each with its own count; a single
 * "NMBA pledge" link would drop one of them and its data. The labels, blurbs, counts
 * and hrefs are the ones NmbaHomeCompact publishes.
 *
 * SCW publishes no pledge count, so none is shown — a metric neither source publishes
 * is left off the design (live-data-fallback.md).
 */

interface Channel {
  key: string;
  label: string;
  blurb: string;
  href: string;
  count: number | null;
}

interface Pledge {
  key: string;
  title: string;
  scheme: string;
  mark: string;
  /** The pledge's own opening line, where one channel carries the whole pledge. */
  line: string | null;
  channels: Channel[];
}

const PLEDGES: Pledge[] = [
  {
    key: "scw",
    title: "Pledge for Senior Citizens",
    scheme: "Senior Citizens Welfare",
    mark: "/website/images/org-logos/scw.png",
    line: PLEDGE_POINTS[0] ?? null,
    channels: [
      {
        key: "scw",
        label: "Pledge for Senior Citizens",
        blurb: "Respect, love and care for the senior citizens in your family and community.",
        href: "/portals/scw/epledge",
        count: null,
      },
    ],
  },
  {
    key: "nmba",
    title: "Pledge for a Drug-Free India",
    scheme: "Nasha Mukt Bharat Abhiyaan",
    mark: "/website/images/org-logos/nmba.png",
    line: null,
    channels: [
      {
        key: "non-user",
        label: "I’m a non-user",
        blurb: "Stay drug-free and help spread awareness where you live, study and work.",
        href: "/portals/nmba/epledge?channel=non-user",
        count: 2_520_056,
      },
      {
        key: "recovered",
        label: "I’m a recovered user",
        blurb: "Stay on your recovery journey and inspire others to seek help.",
        href: "/portals/nmba/epledge?channel=recovered",
        count: 660_523,
      },
    ],
  },
];

/** 25,20,056 — lakh/crore grouping. */
const indian = (n: number) => n.toLocaleString("en-IN");

function totalOf(p: Pledge): number | null {
  const counts = p.channels.map((c) => c.count).filter((c): c is number => c != null);
  return counts.length ? counts.reduce((a, b) => a + b, 0) : null;
}

const CTA =
  "inline-flex shrink-0 items-center gap-2 rounded-lg bg-primary-dark px-4 py-2 text-label-1 text-white transition-colors hover:bg-primary-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary";

/** Option A — twin cards. */
export function PledgeCards() {
  return (
    <section className="bg-primary-50" aria-labelledby="pledge-heading">
      <div className="sa-container py-12 md:py-16">
        <SectionTitle
          headingId="pledge-heading"
          title="Take a Pledge"
          description="Join citizens across India in commitments made under the Department's national campaigns."
        />
        <div className="mt-8 grid gap-6 md:grid-cols-2">
          {PLEDGES.map((p) => {
            const total = totalOf(p);
            return (
              <article key={p.key} className="flex flex-col rounded-xl border border-border bg-surface p-6 shadow-sm">
                <div className="flex items-center gap-4">
                  <Image src={p.mark} alt="" width={56} height={56} className="h-14 w-14 shrink-0 object-contain" />
                  <div className="min-w-0 flex-1">
                    <p className="text-label-3 uppercase text-ink-muted">{p.scheme}</p>
                    <h3 className="mt-0.5 text-title-1 text-ink">{p.title}</h3>
                  </div>
                </div>
                {total != null && (
                  <p className="mt-3 text-body-2 text-ink-muted">
                    <span className="font-semibold tabular-nums text-primary-dark">{indian(total)}</span> pledges taken
                  </p>
                )}

                {p.line ? (
                  <>
                    <blockquote className="mt-5 border-l-4 border-primary pl-4 text-body-1 italic text-ink">
                      {p.line}
                    </blockquote>
                    <div className="mt-6 flex flex-1 items-end justify-end">
                      <a href={p.channels[0]!.href} className={CTA}>
                        Take the Pledge <Icon name="arrow_forward" size={16} aria-hidden />
                      </a>
                    </div>
                  </>
                ) : (
                  <ul className="mt-4 flex-1 divide-y divide-border border-y border-border">
                    {p.channels.map((c) => (
                      <li key={c.key} className="flex flex-col gap-3 py-4 sm:flex-row sm:items-center sm:gap-4">
                        <div className="min-w-0 flex-1">
                          <h4 className="text-title-2 text-ink">{c.label}</h4>
                          <p className="mt-0.5 text-body-2 text-ink-muted">{c.blurb}</p>
                          {c.count != null && (
                            <p className="mt-1 text-label-2 tabular-nums text-primary-dark">{indian(c.count)} pledges</p>
                          )}
                        </div>
                        <a href={c.href} className={`${CTA} self-start sm:self-center`}>
                          Pledge <Icon name="arrow_forward" size={16} aria-hidden />
                        </a>
                      </li>
                    ))}
                  </ul>
                )}
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/** Option B — one band, every pledge link. */
export function PledgeBand() {
  const links = PLEDGES.flatMap((p) => p.channels.map((c) => ({ ...c, scheme: p.scheme, mark: p.mark })));
  return (
    <section className="bg-surface" aria-labelledby="pledge-heading">
      <div className="sa-container py-10">
        <div className="flex flex-col gap-6 rounded-2xl bg-gradient-to-r from-primary-900 to-primary-dark p-6 text-white md:p-8 lg:flex-row lg:items-center lg:justify-between">
          <div className="max-w-md">
            <h2 id="pledge-heading" className="text-headline-3 text-white">
              Take a Pledge
            </h2>
            <p className="mt-2 text-body-1 text-white/90">
              Stand with India&apos;s senior citizens, and for a drug-free India.
            </p>
          </div>
          <ul className="grid gap-3 sm:grid-cols-3">
            {links.map((l) => (
              <li key={l.key}>
                <a
                  href={l.href}
                  className="flex h-full items-center gap-3 rounded-xl bg-white px-4 py-3 text-primary-dark transition hover:bg-white/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                >
                  <Image src={l.mark} alt="" width={36} height={36} className="h-9 w-9 shrink-0 object-contain" />
                  <span className="flex min-w-0 flex-col">
                    <span className="text-label-1">{l.label}</span>
                    <span className="text-body-3 text-ink-muted">
                      {l.count != null ? `${indian(l.count)} pledges` : l.scheme}
                    </span>
                  </span>
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
