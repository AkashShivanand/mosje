import Link from "next/link";
import { ArrowRight, Calendar, Clock, MapPin, Phone, Search } from "lucide-react";
import { UserShell } from "@/components/user-shell";
import {
  Button,
  Card,
  FilterSelect,
  Pagination,
  SearchInput,
} from "@/components/ui";
import { EVENTS, EVENTS_TOTAL } from "@/lib/mock-data";
import { INDIAN_STATES } from "@/lib/states";

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

        {/* Two-column layout */}
        <div className="grid gap-6 lg:grid-cols-3">
          {/* LEFT: opportunities */}
          <div className="lg:col-span-2">
            <h3 className="text-xs font-bold uppercase tracking-wide text-ink-hint">
              Upcoming Opportunities Near You
            </h3>

            <div className="mt-4 flex flex-col gap-3 sm:flex-row">
              <SearchInput
                placeholder="Search event name, city, district..."
                className="flex-1"
              />
              <FilterSelect
                options={INDIAN_STATES}
                defaultLabel="All States"
                className="sm:w-44"
              />
              <FilterSelect options={[]} defaultLabel="All Districts" className="sm:w-44" />
            </div>

            <div className="mt-4 space-y-3">
              {EVENTS.map((ev) => (
                <Card key={ev.sno} className="p-5">
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="min-w-0">
                      <h4 className="font-bold text-ink">{ev.name}</h4>
                      <div className="mt-2 flex items-center gap-1.5 text-sm text-ink-muted">
                        <Calendar className="h-4 w-4 shrink-0 text-ink-hint" />
                        {ev.start}
                      </div>
                      <div className="mt-1 flex items-center gap-1.5 text-sm text-ink-muted">
                        <MapPin className="h-4 w-4 shrink-0 text-ink-hint" />
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
                <div className="text-xs font-semibold uppercase tracking-wide text-white/80">
                  This Month
                </div>
                <Clock className="h-5 w-5 text-white/80" />
              </div>
              <div className="mt-4 text-4xl font-bold">0</div>
              <div className="mt-1 text-sm text-white/90">Hours Volunteered</div>
            </div>

            {/* Service directory */}
            <Card className="p-6">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-brandwash text-navy">
                <Search className="h-5 w-5" />
              </div>
              <h4 className="mt-4 text-base font-bold text-ink">Browse Service Directory</h4>
              <p className="mt-2 text-sm leading-relaxed text-ink-muted">
                Find Old Age Homes, Healthcare Facilities, and Geriatric Caregivers available in
                your specific state and district.
              </p>
              <Link
                href="/our-services"
                className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-navy hover:underline"
              >
                Search Facilities
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Card>

            {/* Need help */}
            <Card className="border-saffron/30 bg-saffron-50 p-6">
              <h4 className="text-base font-bold text-ink">Need Immediate Help?</h4>
              <p className="mt-2 text-sm leading-relaxed text-ink-muted">
                The National Helpline provides guidance and field intervention 7 days a week.
              </p>
              <Button variant="saffron" className="mt-4 w-full">
                <Phone className="h-4 w-4" />
                Call Toll-Free 14567
              </Button>
            </Card>
          </div>
        </div>
      </div>
    </UserShell>
  );
}
