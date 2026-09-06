import Link from "next/link";
import { UserShell } from "@/components/scw/user-shell";
import { Button, PeriodFilter, Pagination, SearchInput } from "@/components/scw/ui";
import { EVENTS, EVENTS_TOTAL } from "@/lib/scw/mock-data";
import { INDIAN_STATES } from "@/lib/scw/states";
import { Icon , Card} from "@mosje/design-system";

export default function VolunteerDashboardPage() {
  return (
    <UserShell
      user={{
        name: "Mallu Vikram Sai Reddy",
        email: "vikrammallu123@gmail.com",
        initials: "MV",
      }}
    >
      <div className="space-y-6">
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
              <Icon name="arrow_forward" size={16} />
            </Link>
          </div>
        </div>

        {/* Two-column layout */}
        <div className="grid gap-6 lg:grid-cols-3">
          {/* LEFT: opportunities */}
          <div className="lg:col-span-2">
            <h2 className="text-label-3 uppercase text-ink-hint">
              Upcoming Opportunities Near You
            </h2>

            <div className="mt-4 flex flex-col gap-3 sm:flex-row">
              <SearchInput
                placeholder="Search event name, city, district..."
                className="flex-1"
              />
              <PeriodFilter
                options={INDIAN_STATES}
                defaultLabel="All States"
                className="sm:w-44"
              />
              <PeriodFilter options={[]} defaultLabel="All Districts" className="sm:w-44" />
            </div>

            <div className="mt-4 space-y-3">
              {EVENTS.map((ev) => (
                <Card key={ev.sno} className="p-5">
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="min-w-0">
                      <h3 className="text-title-2 text-ink">{ev.name}</h3>
                      <div className="mt-2 flex items-center gap-1.5 text-body-2 text-ink-muted">
                        <Icon name="calendar_today" size={16} className="shrink-0 text-ink-hint" />
                        {ev.start}
                      </div>
                      <div className="mt-1 flex items-center gap-1.5 text-body-2 text-ink-muted">
                        <Icon name="location_on" size={16} className="shrink-0 text-ink-hint" />
                        {ev.address}
                      </div>
                    </div>
                    <Button variant="primary" className="shrink-0">
                      View Details
                    </Button>
                  </div>
                </Card>
              ))}
            </div>

            <Pagination total={EVENTS_TOTAL} totalPages={24} />
          </div>

          {/* RIGHT rail */}
          <div className="space-y-6">
            {/* Stat card */}
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-navy to-navy-700 p-6 text-white shadow-card">
              <div className="flex items-start justify-between">
                <div className="text-label-3 uppercase text-white/80">
                  This Month
                </div>
                <Icon name="schedule" size={20} className="text-white/80" />
              </div>
              <div className="mt-4 text-headline-2 tabular-nums">0</div>
              <div className="mt-1 text-body-2 text-white/90">Hours Volunteered</div>
            </div>

            {/* Service directory */}
            <Card className="p-6">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-brandwash text-navy">
                <Icon name="search" size={20} />
              </div>
              <h3 className="mt-4 text-title-2 text-ink">Browse Service Directory</h3>
              <p className="mt-2 text-body-2 text-ink-muted">
                Find Old Age Homes, Healthcare Facilities, and Geriatric Caregivers available in
                your specific state and district.
              </p>
              <Link
                href="/portals/scw/our-services"
                className="mt-4 inline-flex items-center gap-1.5 text-label-1 text-navy hover:underline"
              >
                Search Facilities
                <Icon name="arrow_forward" size={16} />
              </Link>
            </Card>

            {/* Need help */}
            <Card className="border-saffron/30 bg-saffron-50 p-6">
              <h3 className="text-title-2 text-ink">Need Immediate Help?</h3>
              <p className="mt-2 text-body-2 text-ink-muted">
                The National Helpline provides guidance and field intervention 7 days a week.
              </p>
              <Button variant="saffron" className="mt-4 w-full">
                <Icon name="call" size={16} />
                Call Toll-Free 14567
              </Button>
            </Card>
          </div>
        </div>
      </div>
    </UserShell>
  );
}
