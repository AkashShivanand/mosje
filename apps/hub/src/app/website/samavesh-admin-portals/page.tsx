import type { Metadata } from "next";
import {
  ArrowUpRight,
  BarChart3,
  GraduationCap,
  HandCoins,
  LayoutDashboard,
  Lock,
  ShieldCheck,
  Users,
} from "lucide-react";
import { PageLayout } from "@/components/website/layout/PageLayout";

export const metadata: Metadata = {
  title: "SAMAVESH — Admin Portals — DoSJE",
  description:
    "Administrative consoles for MoSJE schemes and organisations (authorised access).",
};

interface AdminConsole {
  name: string;
  description: string;
  icon: typeof LayoutDashboard;
  href: string;
}

const CONSOLES: AdminConsole[] = [
  {
    name: "SMILE Admin Console",
    description: "Manage transgender welfare and beggary rehabilitation case workflows.",
    icon: LayoutDashboard,
    href: "#",
  },
  {
    name: "PM-AJAY MIS",
    description: "Component-wise fund tracking, Adarsh Gram and hostel monitoring.",
    icon: BarChart3,
    href: "#",
  },
  {
    name: "Scholarship Admin (NOS)",
    description: "Review, sanction and disburse National Overseas Scholarship awards.",
    icon: GraduationCap,
    href: "#",
  },
  {
    name: "NMBA Dashboard",
    description: "Track outreach drives, master volunteers and district-level progress.",
    icon: ShieldCheck,
    href: "#",
  },
  {
    name: "Grant-in-Aid Management",
    description: "Process GIA proposals, releases and utilisation certificates.",
    icon: HandCoins,
    href: "#",
  },
  {
    name: "NGO Monitoring Portal",
    description: "Onboard, verify and audit implementing agencies and NGOs.",
    icon: Users,
    href: "#",
  },
];

export default function AdminPortalsPage() {
  return (
    <PageLayout
      title="SAMAVESH — Admin Portals"
      breadcrumb={[{ label: "SAMAVESH" }, { label: "Admin Portals" }]}
      description="Administrative consoles for MoSJE schemes and organisations (authorised access)."
    >
      <section>
        <div className="mx-auto max-w-[1280px] px-4 py-10 md:py-12">
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {CONSOLES.map(({ name, description, icon: Icon, href }) => (
              <div
                key={name}
                className="flex flex-col rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md"
              >
                <span className="flex h-12 w-12 items-center justify-center rounded-lg bg-surface-muted text-gov-blue">
                  <Icon className="h-6 w-6" aria-hidden="true" />
                </span>
                <h2 className="mt-4 text-base font-semibold text-gov-blue-dark">
                  {name}
                </h2>
                <p className="mt-1.5 flex-1 text-sm leading-relaxed text-ink-muted">
                  {description}
                </p>
                <a
                  href={href}
                  className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-gov-blue hover:text-gov-blue-dark"
                >
                  Open Console
                  <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
                </a>
                <p className="mt-2 inline-flex items-center gap-1 text-xs text-gray-500">
                  <Lock className="h-3 w-3" aria-hidden="true" />
                  Authorised access
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </PageLayout>
  );
}
