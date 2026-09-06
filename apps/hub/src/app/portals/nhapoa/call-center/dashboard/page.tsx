import Link from "next/link";
import { PortalPageHeader, Card } from "@/components/nhapoa/ui";
import { Icon } from "@mosje/design-system";

const ACTIONS = [
  { href: "/portals/nhapoa/call-center/caller", icon: "call", title: "Look up caller", desc: "Look up or create the caller record from their mobile." },
  { href: "/portals/nhapoa/call-center/register-grievance", icon: "note_add", title: "Start registration", desc: "File a grievance on the caller's behalf." },
  { href: "/portals/nhapoa/call-center/query", icon: "chat", title: "Log a query", desc: "Record a first-time-resolution (FTR) query." },
  { href: "/portals/nhapoa/call-center/queries", icon: "folder_open", title: "View query log", desc: "Search and resolve logged queries." },
  { href: "/portals/nhapoa/call-center/directory", icon: "group", title: "Search directory", desc: "Find officers state- and district-wise across the country." },
  { href: "/portals/nhapoa/call-center/track", icon: "find_in_page", title: "Track a grievance", desc: "Share the reference and track progress for the caller." },
];

const PROCESS = [
  { step: "1", title: "Identify Caller", desc: "Look up or create the caller record from their mobile." },
  { step: "2", title: "Understand Need", desc: "Log the query, or proceed to register a grievance." },
  { step: "3", title: "Register / Resolve", desc: "File the grievance, or mark a first-time query resolved." },
  { step: "4", title: "Track & Inform", desc: "Share the reference and track progress for the caller." },
];

export default function CallCenterDashboard() {
  return (
    <div>
      <PortalPageHeader title="Call-Centre Dashboard" meta="Handle caller requests — register grievances, log queries, and search the directory." />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {ACTIONS.map(({ href, icon: iconName, title, desc }) => (
          <Link key={href} href={href} className="group flex flex-col rounded-2xl border border-line bg-white p-5 shadow-card transition-colors hover:border-navy/30">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-navy/10 text-navy"><Icon name={iconName} size={20} /></span>
            <h3 className="mt-3 text-title-2 text-ink">{title}</h3>
            <p className="mt-1 flex-1 text-body-3 text-ink-muted">{desc}</p>
            <span className="mt-3 inline-flex items-center gap-1 text-label-2 font-semibold text-navy">Open <Icon name="arrow_forward" size={14} className="transition-transform group-hover:translate-x-0.5" /></span>
          </Link>
        ))}
        <Link href="/portals/nhapoa/call-center/faq" className="group flex flex-col rounded-2xl border border-line bg-white p-5 shadow-card transition-colors hover:border-navy/30">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-navy/10 text-navy"><Icon name="help" size={20} /></span>
          <h3 className="mt-3 text-title-2 text-ink">Open Help & FAQs</h3>
          <p className="mt-1 flex-1 text-body-3 text-ink-muted">Answer common caller questions.</p>
          <span className="mt-3 inline-flex items-center gap-1 text-label-2 font-semibold text-navy">Open <Icon name="arrow_forward" size={14} /></span>
        </Link>
      </div>

      <Card className="mt-6 p-6">
        <h2 className="text-title-2 text-ink">Call Handling Process</h2>
        <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {PROCESS.map((p) => (
            <div key={p.step} className="rounded-xl border border-line p-4">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-navy text-label-1 font-semibold text-white">{p.step}</span>
              <p className="mt-3 text-title-3 text-ink">{p.title}</p>
              <p className="mt-1 text-body-3 text-ink-muted">{p.desc}</p>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
