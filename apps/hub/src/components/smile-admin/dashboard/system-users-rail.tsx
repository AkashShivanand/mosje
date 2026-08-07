import type { SystemUserStat } from "@/lib/smile-admin/mock-data";
import { formatNumber } from "@/lib/smile-admin/utils";
import { Icon } from "@mosje/design-system";

/** Material Symbols name per system-user category. */
const ICONS: Record<string, string> = {
  state: "account_balance",
  district: "location_on",
  agency: "business",
  surveyor: "school",
  shelter: "home",
};

export function SystemUsersRail({ items }: { items: SystemUserStat[] }) {
  const total = items.reduce((s, i) => s + i.value, 0);
  return (
    <aside className="h-full overflow-hidden rounded-lg border border-stroke-200 bg-white shadow-xs">
      <header className="flex items-center justify-between gap-md border-b border-stroke-100 bg-neutral-50/60 px-lg py-md">
        <div className="flex items-center gap-sm">
          <span className="grid h-7 w-7 place-items-center rounded-sm bg-primary text-white">
            <Icon name="groups" size={16} />
          </span>
          <div className="leading-tight">
            <div className="text-label-2 font-semibold text-ink">System Users</div>
            <div className="text-label-3 text-ink-hint">
              {formatNumber(total)} total · live
            </div>
          </div>
        </div>
      </header>
      <ul className="divide-y divide-stroke-100">
        {items.map((s) => {
          const iconName = ICONS[s.icon] ?? "account_box";
          const pct = total > 0 ? Math.max(2, Math.round((s.value / total) * 100)) : 0;
          return (
            <li
              key={s.label}
              className="group flex items-center justify-between gap-md px-lg py-md transition-colors hover:bg-primary-50/40"
            >
              <div className="flex min-w-0 items-center gap-md">
                <span className="grid h-9 w-9 shrink-0 place-items-center rounded-md bg-primary-50 text-primary ring-1 ring-inset ring-primary-100">
                  <Icon name={iconName} className="h-[18px] w-[18px]" />
                </span>
                <div className="min-w-0">
                  <div className="truncate text-body-2 font-medium text-ink">
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
              <span className="shrink-0 text-title-2 font-bold tabular-nums text-ink">
                {formatNumber(s.value)}
              </span>
            </li>
          );
        })}
      </ul>
    </aside>
  );
}
