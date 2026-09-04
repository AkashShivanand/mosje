import Link from "next/link";
import { Icon } from "@mosje/design-system";
import { UserShell } from "@/components/scw/user-shell";
import { Button, Card, SectionTitle } from "@/components/scw/ui";

type ServiceCard = {
  /** Material Symbols Rounded glyph name (snake_case). */
  icon: string;
  title: string;
  description: string;
  actionLabel: string;
  href: string;
  /** Newly launched schemes get a subtle "New" flag. */
  isNew?: boolean;
};

/* Section 1 — the senior citizen's own tools: their app, their entitlement, their directory. */
const CITIZEN_SERVICES: ServiceCard[] = [
  {
    icon: "support_agent",
    title: "JEEVAN",
    description:
      "Joint Elderly Empowerment & Virtual Assistance Network — a single-window mobile app giving senior citizens easy access to help, services and support.",
    actionLabel: "Download the App",
    href: "#",
    isNew: true,
  },
  {
    icon: "assist_walker",
    title: "ARJUN",
    description:
      "Apply for free assistive devices under the Rashtriya Vayoshri Yojana (RVY) for eligible senior citizens.",
    actionLabel: "Apply for Devices",
    href: "#",
    isNew: true,
  },
  {
    icon: "apartment",
    title: "Browse Service Directory",
    description:
      "Find Old Age Homes, healthcare facilities and geriatric caregivers available in your state and district.",
    actionLabel: "Search Facilities",
    href: "/portals/scw/our-services",
  },
];

/* Section 2 — ways to contribute, partner, or run the programme. */
const PARTNER_SERVICES: ServiceCard[] = [
  {
    icon: "volunteer_activism",
    title: "Join as a Volunteer",
    description:
      "Offer your time to assist senior citizens in your community — daily errands, digital literacy, or companionship.",
    actionLabel: "Register Profile",
    href: "/portals/scw/volunteer",
  },
  {
    icon: "science",
    title: "SAGE Registration",
    description:
      "Organisations and innovators can register for the Seniorcare Ageing Growth Engine (SAGE) to submit products and apply for funding.",
    actionLabel: "Apply as Organisation",
    href: "/portals/scw/sage-registration",
  },
  {
    icon: "health_and_safety",
    title: "SHATAYU",
    description:
      "Senior Holistic Care Assistance & Training For Your Utility — a national dashboard to track, certify and deploy trained geriatric caregivers.",
    actionLabel: "View Dashboard",
    href: "#",
    isNew: true,
  },
];

function ServiceTile({ icon, title, description, actionLabel, href, isNew }: ServiceCard) {
  return (
    <Link
      href={href}
      className="group flex flex-col rounded-2xl border border-line bg-white p-6 shadow-card transition-all hover:-translate-y-0.5 hover:border-navy/20 hover:shadow-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-navy/40"
    >
      <div className="mb-4 flex items-start justify-between">
        <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-brandwash text-navy">
          <Icon name={icon} size={24} aria-hidden />
        </span>
        {isNew && (
          <span className="rounded-full bg-saffron-50 px-2.5 py-1 text-label-3 uppercase text-saffron-600">
            New
          </span>
        )}
      </div>
      <h2 className="text-title-1 text-ink">{title}</h2>
      <p className="mt-2 flex-1 text-body-2 text-ink-muted">{description}</p>
      <span className="mt-4 inline-flex items-center gap-1.5 text-label-1 text-navy">
        {actionLabel}
        <Icon
          name="arrow_forward"
          size={18}
          className="transition-transform group-hover:translate-x-0.5"
          aria-hidden
        />
      </span>
    </Link>
  );
}

export default function HomePage() {
  return (
    <UserShell>
      <div className="space-y-8">
        {/* Hero band */}
        <div className="scw-hero relative overflow-hidden rounded-2xl p-8 text-white sm:p-10">
          <div
            aria-hidden
            className="pointer-events-none absolute -right-16 -top-16 h-64 w-64 rounded-full bg-white/10"
          />
          <div className="relative flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="max-w-measure">
              <h1 className="text-headline-1">Senior Citizens Welfare</h1>
              <p className="mt-3 text-body-1 text-white/90">
                Commit to creating a safe, inclusive environment that allows our senior citizens to
                age with dignity. Get your official Ministry certificate upon completion.
              </p>
            </div>
            <Link
              href="/portals/scw/epledge"
              className="inline-flex shrink-0 items-center gap-2 rounded-lg bg-white px-5 py-3 text-label-1 text-navy shadow-sm transition-colors hover:bg-white/90"
            >
              Take the Pledge
              <Icon name="arrow_forward" size={18} aria-hidden />
            </Link>
          </div>
        </div>

        {/* Emergency helpline — elevated so it is unmissable for a vulnerable audience */}
        <Card className="flex flex-col items-start gap-4 border-saffron/30 bg-saffron-50 p-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-4">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white text-saffron-600 shadow-sm">
              <Icon name="support" size={24} aria-hidden />
            </span>
            <div>
              <h2 className="text-title-2 text-ink">Need immediate help?</h2>
              <p className="mt-1 text-body-2 text-ink-muted">
                The National Helpline offers guidance and field intervention, 7 days a week.
              </p>
            </div>
          </div>
          <Button variant="saffron" className="w-full shrink-0 sm:w-auto">
            <Icon name="call" size={18} aria-hidden />
            Call Toll-Free 14567
          </Button>
        </Card>

        {/* Section 1 — Services for Senior Citizens */}
        <section>
          <SectionTitle>Services for Senior Citizens</SectionTitle>
          <div className="grid gap-6 md:grid-cols-3">
            {CITIZEN_SERVICES.map((s) => (
              <ServiceTile key={s.title} {...s} />
            ))}
          </div>
        </section>

        {/* Section 2 — Get Involved & Partner */}
        <section>
          <SectionTitle>Get Involved &amp; Partner</SectionTitle>
          <div className="grid gap-6 md:grid-cols-3">
            {PARTNER_SERVICES.map((s) => (
              <ServiceTile key={s.title} {...s} />
            ))}
          </div>
        </section>
      </div>
    </UserShell>
  );
}
