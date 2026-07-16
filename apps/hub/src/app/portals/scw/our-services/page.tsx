import { MapPin, Navigation } from "lucide-react";
import { UserShell } from "@/components/scw/user-shell";
import { Button, Card, PageHeader, SearchInput } from "@/components/scw/ui";
import { FACILITIES, FACILITY_LEGEND } from "@/lib/scw/mock-data";
import { cn } from "@/lib/scw/utils";

export default function OurServicesPage() {
  return (
    <UserShell>
      <PageHeader title="Our Services" />
      <p className="-mt-4 mb-6 text-sm text-ink-muted">
        Browse public welfare programs, residential facilities, and caregiving services available in
        your region.
      </p>

      {/* Search row */}
      <div className="mb-6 flex flex-col gap-3 sm:flex-row">
        <SearchInput
          placeholder="Search by NGO name, project type, city, district, state, PIN or address"
          className="flex-1"
        />
        <Button className="shrink-0">
          <Navigation className="h-4 w-4" />
          Near Me
        </Button>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Map panel */}
        <Card className="relative overflow-hidden p-0">
          <div
            className="relative min-h-[480px] bg-slate-100"
            style={{
              backgroundImage:
                "radial-gradient(circle at 30% 35%, rgba(37,99,235,0.10) 0, transparent 40%), radial-gradient(circle at 70% 65%, rgba(22,163,74,0.10) 0, transparent 40%), linear-gradient(0deg, rgba(15,23,42,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(15,23,42,0.05) 1px, transparent 1px)",
              backgroundSize: "100% 100%, 100% 100%, 40px 40px, 40px 40px",
            }}
          >
            {/* Legend */}
            <div className="absolute bottom-4 left-4 rounded-xl bg-white/95 p-4 shadow-card backdrop-blur">
              <p className="mb-2 text-xs font-bold uppercase tracking-wide text-ink-hint">
                Legend
              </p>
              <ul className="space-y-2">
                {FACILITY_LEGEND.map((item) => (
                  <li key={item.label} className="flex items-center gap-2 text-sm text-ink">
                    <span
                      className="h-3 w-3 shrink-0 rounded-full"
                      style={{ backgroundColor: item.color }}
                    />
                    <span>{item.label}</span>
                    <span className="text-ink-hint">({item.count})</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </Card>

        {/* Facilities list */}
        <div className="flex max-h-[540px] flex-col">
          <h2 className="mb-3 text-sm font-bold text-ink">Facilities (732)</h2>
          <div className="space-y-4 overflow-y-auto pr-1">
            {FACILITIES.map((facility) => {
              const isHome = facility.category === "Senior Citizen Homes";
              return (
                <Card key={facility.name} className="p-5">
                  <div className="flex items-start justify-between gap-3">
                    <span
                      className={cn(
                        "inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold",
                        isHome
                          ? "bg-approve-bg text-approve-fg"
                          : "bg-slate-100 text-slate-600"
                      )}
                    >
                      {facility.category}
                    </span>
                    <span className="shrink-0 text-xs font-semibold text-ink-muted">
                      {facility.distance}
                    </span>
                  </div>
                  <h3 className="mt-3 font-bold text-ink">{facility.name}</h3>
                  <p className="mt-2 flex items-start gap-1.5 text-sm text-ink-muted">
                    <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-ink-hint" />
                    <span>{facility.address}</span>
                  </p>
                  <Button className="mt-4 w-full">
                    <Navigation className="h-4 w-4" />
                    Get Directions
                  </Button>
                </Card>
              );
            })}
          </div>
        </div>
      </div>
    </UserShell>
  );
}
