import { PLEDGE_STATS } from "@/content/website/deaddiction-centres";
import { Icon } from "@mosje/design-system";

// Two front-page pledge channels. Each links to the NMBA portal's e-Pledge with a
// distinct channel so the (later) backend can route/segment the submissions.
// Plain <a> — cross-app link into the NMBA portal, which the hub mounts natively
// at /portals/nmba (a sibling of this site, not a route within it).
const PATHS = [
  {
    key: "non-user",
    href: "/portals/nmba/epledge?channel=non-user",
    label: "I'm a non-user",
    blurb: "Stay drug-free and help spread awareness where you live, study and work.",
    count: PLEDGE_STATS.ePledges,
    countLabel: "pledges",
  },
  {
    key: "recovered",
    href: "/portals/nmba/epledge?channel=recovered",
    label: "I'm a recovered user",
    blurb: "Stay on your recovery journey and inspire others to seek help.",
    count: PLEDGE_STATS.recoveredPledges,
    countLabel: "pledges",
  },
] as const;

export function DualPledge() {
  const total = (
    PLEDGE_STATS.ePledgesRaw + PLEDGE_STATS.recoveredPledgesRaw
  ).toLocaleString("en-IN");

  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
      <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 border-b border-gray-100 px-6 py-5 sm:px-8">
        <h3 className="text-[20px] font-semibold text-ink">Take the pledge</h3>
        <p className="text-[14px] text-ink-muted">
          <span className="font-semibold text-primary-dark">{total}</span> Indians have
          already pledged
        </p>
      </div>

      <ul className="divide-y divide-gray-100">
        {PATHS.map((p) => (
          <li key={p.key}>
            <a
              href={p.href}
              className="group flex items-center gap-5 px-6 py-6 transition-colors hover:bg-primary/[0.04] sm:gap-8 sm:px-8"
            >
              {/* momentum number — the hook */}
              <div className="w-[104px] shrink-0 sm:w-[132px]">
                <div className="text-[26px] font-bold leading-none tracking-tight text-primary-dark sm:text-[30px]">
                  {p.count}
                </div>
                <div className="mt-1 text-[12px] uppercase tracking-wide text-ink-muted">
                  {p.countLabel}
                </div>
              </div>

              <div className="h-12 w-px shrink-0 bg-gray-200" aria-hidden />

              <div className="min-w-0 flex-1">
                <div className="text-[17px] font-semibold text-ink">{p.label}</div>
                <p className="mt-1 text-[14px] leading-relaxed text-ink-muted">{p.blurb}</p>
              </div>

              <span className="ml-auto hidden shrink-0 items-center gap-1.5 text-[14px] font-semibold text-primary sm:inline-flex">
                Pledge
                <Icon name="arrow_forward" size={16} className="transition-transform group-hover:translate-x-1" />
              </span>
              <Icon name="arrow_forward" size={20} className="ml-auto shrink-0 text-primary transition-transform group-hover:translate-x-1 sm:hidden" aria-hidden />
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
