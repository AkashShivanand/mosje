import { ArrowRight, Users, RefreshCw } from "lucide-react";
import { buttonClasses } from "@mosje/design-system";
import { PLEDGE_STATS } from "@/content/deaddiction-centres";

// Two front-page pledge channels. Each links to the NMBA portal's e-Pledge with a
// distinct channel so the (later) backend can route/segment the submissions.
// Plain <a> — cross-app link that must bypass this site's `/website` basePath.
const CHANNELS = [
  {
    key: "non-user",
    href: "/portals/nmba/epledge?channel=non-user",
    icon: Users,
    title: "I am a Non-User",
    blurb:
      "Pledge to stay drug-free and help spread awareness in your family, school, and community.",
    stat: PLEDGE_STATS.ePledges,
    statLabel: "e-pledges taken so far",
  },
  {
    key: "recovered",
    href: "/portals/nmba/epledge?channel=recovered",
    icon: RefreshCw,
    title: "I am a Recovered User",
    blurb:
      "Pledge to stay on your recovery journey and inspire others to seek help and rebuild their lives.",
    stat: PLEDGE_STATS.recoveredPledges,
    statLabel: "recovered users pledged",
  },
] as const;

export function DualPledge() {
  return (
    <div>
      <h3 className="text-[22px] font-semibold leading-tight text-gov-blue-dark">
        Take the Pledge
      </h3>
      <p className="mt-1 text-[15px] text-ink-muted">
        Choose the pledge that applies to you.
      </p>

      <div className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-2">
        {CHANNELS.map((c) => {
          const Icon = c.icon;
          return (
            <a
              key={c.key}
              href={c.href}
              className="group flex h-full flex-col rounded-lg border border-gray-200 bg-white p-6 shadow-sm transition hover:border-gov-blue/40 hover:shadow-md"
            >
              <span className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-md bg-gov-blue/10 text-gov-blue">
                <Icon className="h-5 w-5" />
              </span>
              <span className="mt-4 text-[18px] font-medium text-ink">{c.title}</span>
              <span className="mt-2 flex-1 text-[15px] leading-relaxed text-ink-muted">
                {c.blurb}
              </span>
              <span className="mt-4 border-t border-gray-100 pt-3 text-[13px] text-ink-muted">
                <span className="font-semibold text-gov-blue-dark">{c.stat}</span>{" "}
                {c.statLabel}
              </span>
              <span
                className={buttonClasses("primary", "text", "sm", "mt-3 self-start")}
                aria-hidden="true"
              >
                Take the pledge
                <span className="ds-btn__icon">
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </span>
              </span>
            </a>
          );
        })}
      </div>
    </div>
  );
}
