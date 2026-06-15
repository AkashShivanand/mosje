import Link from "next/link";
import {
  Accessibility,
  ArrowRight,
  FileText,
  HeartHandshake,
  Phone,
  Search,
} from "lucide-react";
import { UserShell } from "@/components/user-shell";
import { Button, Card } from "@/components/ui";

type ServiceCard = {
  icon: typeof HeartHandshake;
  title: string;
  description: string;
  actionLabel: string;
  href: string;
};

const PRIMARY_SERVICES: ServiceCard[] = [
  {
    icon: HeartHandshake,
    title: "Join as a Volunteer",
    description:
      "Offer your time to assist senior citizens in your community. Help with daily errands, technology literacy, or provide emotional support.",
    actionLabel: "Register Profile",
    href: "/volunteer",
  },
  {
    icon: FileText,
    title: "SAGE Registration",
    description:
      "Are you an organization or innovator? Register for the Seniorcare Ageing Growth Engine (SAGE) to submit your products, apply for funding.",
    actionLabel: "Apply as Organisation",
    href: "/sage-registration",
  },
];

const SECONDARY_SERVICES: ServiceCard[] = [
  {
    icon: Search,
    title: "Browse Service Directory",
    description:
      "Find Old Age Homes, Healthcare Facilities and Centers, Caregiver's available in your specific state. View Centre details.",
    actionLabel: "Search Facilities",
    href: "/our-services",
  },
  {
    icon: Accessibility,
    title: "Free Assisted Living Devices",
    description:
      "Apply for assisted living devices for eligible senior citizens offering from age-related disabilities.",
    actionLabel: "View Scheme Details",
    href: "#",
  },
];

function ServiceTile({ icon: Icon, title, description, actionLabel, href }: ServiceCard) {
  return (
    <Card className="flex flex-col p-6">
      <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-brandwash text-navy">
        <Icon className="h-6 w-6" />
      </div>
      <h3 className="text-lg font-bold text-ink">{title}</h3>
      <p className="mt-2 flex-1 text-sm leading-relaxed text-ink-muted">{description}</p>
      <Link
        href={href}
        className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-navy hover:underline"
      >
        {actionLabel}
        <ArrowRight className="h-4 w-4" />
      </Link>
    </Card>
  );
}

export default function HomePage() {
  return (
    <UserShell>
      <div className="space-y-6">
        {/* Hero band */}
        <div className="scw-hero relative overflow-hidden rounded-2xl p-8 text-white sm:p-10">
          <div
            aria-hidden
            className="pointer-events-none absolute -right-16 -top-16 h-64 w-64 rounded-full bg-white/10"
          />
          <div className="relative flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="max-w-2xl">
              <h2 className="text-3xl font-bold sm:text-4xl">Senior Citizens Welfare</h2>
              <p className="mt-3 text-base leading-relaxed text-white/90">
                Commit to creating a safe, inclusive environment that allows our senior citizens to
                age with dignity. Get your official Ministry certificate upon completion.
              </p>
            </div>
            <Link
              href="/epledge"
              className="inline-flex shrink-0 items-center gap-2 rounded-lg bg-white px-5 py-3 text-sm font-semibold text-navy shadow-sm transition-colors hover:bg-white/90"
            >
              Take the Pledge
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>

        {/* Volunteer + SAGE */}
        <div className="grid gap-6 md:grid-cols-2">
          {PRIMARY_SERVICES.map((s) => (
            <ServiceTile key={s.title} {...s} />
          ))}
        </div>

        {/* Directory + Devices + Need Help */}
        <div className="grid gap-6 md:grid-cols-3">
          {SECONDARY_SERVICES.map((s) => (
            <ServiceTile key={s.title} {...s} />
          ))}

          <Card className="flex flex-col border-saffron/30 bg-saffron-50 p-6">
            <h3 className="text-lg font-bold text-ink">Need Immediate Help?</h3>
            <p className="mt-2 flex-1 text-sm leading-relaxed text-ink-muted">
              The National Helpline provides guidance and fast intervention! 1492 is your helpline
              for senior citizens needing immediate assistance.
            </p>
            <Button variant="saffron" className="mt-4 w-full">
              <Phone className="h-4 w-4" />
              Call toll-free 14567
            </Button>
          </Card>
        </div>
      </div>
    </UserShell>
  );
}
