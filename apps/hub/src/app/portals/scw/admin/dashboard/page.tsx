import Link from "next/link";
import { Card, PeriodFilter, StatusPill } from "@/components/scw/ui";
import {
  DASHBOARD_STATS,
  SAGE_APPLICATIONS,
  RECENT_ACTIVITY,
  VOLUNTEERS,
} from "@/lib/scw/mock-data";

const PERIODS = ["Last 7 Days", "Last 30 Days", "Last 90 Days"];

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <Card className="px-7 py-6">
      <div className="text-sm text-ink-muted">{label}</div>
      <div className="mt-3 text-4xl font-bold tracking-tight text-ink">{value}</div>
    </Card>
  );
}

function ActionLink({ status, id }: { status: string; id: string }) {
  const approved = status === "Approved";
  return (
    <Link
      href={`/portals/scw/admin/sage-applications/${id}`}
      className="text-sm font-medium text-navy hover:underline"
    >
      {approved ? "View Details" : "Review"}
    </Link>
  );
}

export default function AdminDashboard() {
  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-ink">Dashboard</h1>
        <PeriodFilter options={PERIODS} defaultLabel="All" className="w-44" />
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <Stat label="Total Pledges" value={DASHBOARD_STATS.totalPledges} />
        <Stat label="Volunteer Registrations" value={DASHBOARD_STATS.volunteerRegistrations} />
        <Stat label="SAGE Applications" value={DASHBOARD_STATS.sageApplications} />
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Recent SAGE Applications */}
        <Card className="lg:col-span-2">
          <div className="flex items-center justify-between px-6 py-5">
            <h2 className="text-lg font-bold text-ink">Recent SAGE Applications</h2>
            <Link href="/portals/scw/admin/sage-applications" className="text-sm font-medium text-navy hover:underline">
              View all
            </Link>
          </div>
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-y border-line text-xs uppercase tracking-wide text-ink-muted">
                <th className="px-6 py-3 font-semibold">Organisation Name</th>
                <th className="px-6 py-3 font-semibold">Date</th>
                <th className="px-6 py-3 font-semibold">Status</th>
                <th className="px-6 py-3 font-semibold">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {SAGE_APPLICATIONS.slice(0, 5).map((a) => (
                <tr key={a.id}>
                  <td className="max-w-[18rem] truncate px-6 py-4 font-medium text-ink">{a.organisation}</td>
                  <td className="px-6 py-4 text-ink-muted">{a.date}</td>
                  <td className="px-6 py-4"><StatusPill status={a.status} /></td>
                  <td className="px-6 py-4"><ActionLink status={a.status} id={a.id} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>

        {/* Recent Platform Activity */}
        <Card className="px-6 py-5">
          <h2 className="mb-4 text-lg font-bold text-ink">Recent Platform Activity</h2>
          <ul className="space-y-5">
            {RECENT_ACTIVITY.map((item, i) => {
              const [before, after] = item.text.split("{{e}}");
              return (
                <li key={i} className="flex gap-3">
                  <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-navy" />
                  <div>
                    <p className="text-sm text-ink">
                      {before}
                      <span className="font-semibold">{item.emphasis}</span>
                      {after}
                    </p>
                    <p className="mt-0.5 text-xs text-ink-hint">{item.when}</p>
                  </div>
                </li>
              );
            })}
          </ul>
        </Card>
      </div>

      {/* Volunteer Applications */}
      <Card className="mt-6 lg:w-2/3">
        <div className="flex items-center justify-between px-6 py-5">
          <h2 className="text-lg font-bold text-ink">Volunteer Applications</h2>
          <Link href="/portals/scw/admin/volunteers" className="text-sm font-medium text-navy hover:underline">
            View all
          </Link>
        </div>
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-y border-line text-xs uppercase tracking-wide text-ink-muted">
              <th className="px-6 py-3 font-semibold">Name</th>
              <th className="px-6 py-3 font-semibold">Date</th>
              <th className="px-6 py-3 font-semibold">Status</th>
              <th className="px-6 py-3 font-semibold">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line">
            {VOLUNTEERS.slice(0, 5).map((v) => (
              <tr key={v.id}>
                <td className="px-6 py-4 font-medium text-ink">{v.name}</td>
                <td className="px-6 py-4 text-ink-muted">{v.date}</td>
                <td className="px-6 py-4"><StatusPill status={v.status} /></td>
                <td className="px-6 py-4">
                  <Link href={`/portals/scw/admin/volunteers/${v.id}`} className="text-sm font-medium text-navy hover:underline">
                    {v.status === "Approved" ? "View Details" : "Review"}
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  );
}
