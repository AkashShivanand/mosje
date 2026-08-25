import type { Metadata } from "next";
import { PageLayout } from "@/components/website/layout/PageLayout";
import { Icon } from "@mosje/design-system";

export const metadata: Metadata = {
  title: "SAMAVESH — Admin Portals — DoSJE",
  description:
    "Administrative consoles for MoSJE schemes and organisations (authorised access).",
};

interface AdminConsole {
  name: string;
  description: string;
  icon: string;
  href: string;
}

const CONSOLES: AdminConsole[] = [
  {
    name: "SMILE Admin Console",
    description: "Manage transgender welfare and beggary rehabilitation case workflows.",
    icon: "dashboard",
    href: "#",
  },
  {
    name: "PM-AJAY MIS",
    description: "Component-wise fund tracking, Adarsh Gram and hostel monitoring.",
    icon: "bar_chart",
    href: "#",
  },
  {
    name: "Scholarship Admin (NOS)",
    description: "Review, sanction and disburse National Overseas Scholarship awards.",
    icon: "school",
    href: "#",
  },
  {
    name: "NMBA Dashboard",
    description: "Track outreach drives, master volunteers and district-level progress.",
    icon: "verified_user",
    href: "#",
  },
  {
    name: "Grant-in-Aid Management",
    description: "Process GIA proposals, releases and utilisation certificates.",
    icon: "paid",
    href: "#",
  },
  {
    name: "NGO Monitoring Portal",
    description: "Onboard, verify and audit implementing agencies and NGOs.",
    icon: "group",
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
        <div className="sa-container py-10 md:py-12">
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {CONSOLES.map(({ name, description, icon: iconName, href }) => (
              <div
                key={name}
                className="flex flex-col rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md"
              >
                <span className="flex h-12 w-12 items-center justify-center rounded-lg bg-surface-muted text-primary">
                  <Icon name={iconName} aria-hidden="true" />
                </span>
                <h2 className="mt-4 text-base font-semibold text-primary-dark">
                  {name}
                </h2>
                <p className="mt-1.5 flex-1 text-sm leading-relaxed text-ink-muted">
                  {description}
                </p>
                <a
                  href={href}
                  className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:text-primary-dark"
                >
                  Open Console
                  <Icon name="arrow_outward" size={16} aria-hidden="true" />
                </a>
                <p className="mt-2 inline-flex items-center gap-1 text-xs text-gray-500">
                  <Icon name="lock" size={12} aria-hidden="true" />
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
