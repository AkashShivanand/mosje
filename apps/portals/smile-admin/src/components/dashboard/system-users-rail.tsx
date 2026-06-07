import { Building, GraduationCap, Home, Landmark, MapPin, UserSquare2, Users2 } from "lucide-react";
import type { SystemUserStat } from "@/lib/mock-data";
import { formatNumber } from "@/lib/utils";

const ICONS = {
  state: Landmark,
  district: MapPin,
  agency: Building,
  surveyor: GraduationCap,
  shelter: Home,
};

export function SystemUsersRail({ items }: { items: SystemUserStat[] }) {
  const total = items.reduce((s, i) => s + i.value, 0);
  return (
    <aside className="h-full overflow-hidden rounded-lg border border-stroke-200 bg-white shadow-xs">
      <header className="flex items-center justify-between gap-md border-b border-stroke-100 bg-neutral-50/60 px-lg py-md">
        <div className="flex items-center gap-sm">
          <span className="grid h-7 w-7 place-items-center rounded-sm bg-primary text-white">
            <Users2 className="h-4 w-4" />
          </span>
          <div className="leading-tight">
            <div className="text-label-2 font-semibold text-foreground">System Users</div>
            <div className="text-label-3 text-foreground-hint">
              {formatNumber(total)} total · live
            </div>
          </div>
        </div>
      </header>
      <ul className="divide-y divide-stroke-100">
        {items.map((s) => {
          const Icon = (ICONS as Record<string, typeof UserSquare2>)[s.icon] ?? UserSquare2;
          const pct = total > 0 ? Math.max(2, Math.round((s.value / total) * 100)) : 0;
          return (
            <li
              key={s.label}
              className="group flex items-center justify-between gap-md px-lg py-md transition-colors hover:bg-primary-50/40"
            >
              <div className="flex min-w-0 items-center gap-md">
                <span className="grid h-9 w-9 shrink-0 place-items-center rounded-md bg-primary-50 text-primary ring-1 ring-inset ring-primary-100">
                  <Icon className="h-[18px] w-[18px]" />
                </span>
                <div className="min-w-0">
                  <div className="truncate text-body-2 font-medium text-foreground">
                    {s.label}
                  </div>
                  <div className="mt-1 h-1 w-32 overflow-hidden rounded-full bg-neutral-100">
                    <div
                      className="h-full rounded-full bg-primary transition-all"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              </div>
              <span className="shrink-0 text-title-2 font-bold tabular-nums text-foreground">
                {formatNumber(s.value)}
              </span>
            </li>
          );
        })}
      </ul>
    </aside>
  );
}
