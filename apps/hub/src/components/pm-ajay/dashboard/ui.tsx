"use client";

/*
 * PM-AJAY Dashboard — shared UI components.
 *
 * ── WHY THIS FILE STILL EXISTS, EXPORT BY EXPORT ────────────────────────────
 *
 * This kit was one of five found re-implementing components the design system
 * already ships (`check:shadow-ui`, tools/shadow-ui/check.mjs). It was the
 * worst of them on paper — eleven exports, not one design-system import — so it
 * was migrated first, as the reference for the other four.
 *
 * The migration found less to take than the count suggested, and the reason is
 * structural rather than an oversight: **PM-AJAY renders a DIFFERENT published
 * Figma library.** `pm-ajay.css` states it at the top — the MoSJE UX4G Portal
 * DS palette, of whose 58 entries exactly two resolve to a `--sa-*` value. Every
 * design-system component carries its own `.ds-*` stylesheet bound to `--sa-*`,
 * so a component is only safely adoptable here when its DOM SHAPE matches the
 * one `.pm-*` already styles. Where it does, `pm-ajay.css` is unlayered and the
 * design system's is inside `@layer components`, so the portal's skin wins and
 * the swap is provably pixel-identical. Where it does not, the design system
 * would bring layout of its own — `.ds-card` alone adds `display: flex`,
 * `flex-direction: column` and `overflow: hidden`, none of which `.pm-panel`
 * sets — and the swap silently reflows a live citizen-facing page.
 *
 *   export         design-system    verdict
 *   ─────────────  ───────────────  ──────────────────────────────────────────
 *   Status         Badge            ADOPTED. Both render one <span> with the
 *                                   children inline; `.pm-status` overrides
 *                                   every property `.ds-badge` sets.
 *   FilterSelect   Select           No. The design system's Select is a native
 *                                   <select>; this is a button + listbox filter
 *                                   chip. Different DOM, different keyboard
 *                                   model. RENAMED off the colliding name.
 *   SortableTable  DataTable        No. The design system's table paginates and
 *                                   does not sort; this sorts and does not
 *                                   paginate. Neither can express the other.
 *                                   RENAMED off the colliding name.
 *   DashboardFooter Footer          No. The design system's Footer wraps its
 *                                   children in `.ds-footer__in`, and every
 *                                   `.pm-footer` rule is a direct-child flex
 *                                   rule. RENAMED off the colliding name.
 *   DrillDownFilters FilterBar      No. The design system's FilterBar nests its
 *                                   controls in `.ds-filter-bar__controls`;
 *                                   `.pm-filters` is one flat flex row.
 *                                   RENAMED off the colliding name.
 *   KpiCard        MetricCard       No. MetricCard has no sparkline slot, and
 *                                   this puts the sparkline in the label row.
 *   Panel          Card             No. `.ds-card` adds flex-column layout and
 *                                   `overflow: hidden`; `.ds-card__header` adds
 *                                   16px of padding `.pm-panel-head` has not.
 *   SectionHead    SectionTitle     No. SectionTitle is a stacked text block;
 *                                   this is heading / rule / meta on one line.
 *   BarCell        Progress         No. Progress owns its own label row; this is
 *                                   a bare track plus a right-aligned figure
 *                                   sized to a table cell.
 *   Sidebar        SidebarNav       No. This carries an account footer, a
 *                                   sign-out control and per-item badge counts.
 *   pillClass      —                Not a component. A pure helper.
 *
 * FOUR NAMES WERE THE ACTIVE HAZARD, and renaming them is what this change
 * bought. `FilterSelect`, `SortableTable`, `Footer` and `DrillDownFilters` are all barrel
 * exports, so an import of any of them inside this portal resolved to whichever
 * module the editor offered first — with no error, and the wrong component
 * rendering. Renaming changes no markup, no class and no pixel; it only makes
 * the two things nameable apart.
 *
 * The two gaps worth closing in the DESIGN SYSTEM rather than here: it has no
 * sortable table, and no listbox-style filter select. Those are the two
 * components this dashboard most needed and could not get.
 */

import {
  useState,
  useRef,
  useEffect,
  useMemo,
  useId,
  type CSSProperties,
  type ReactNode,
} from "react";
import Link from "next/link";
import { Badge, type BadgeStatus } from "@mosje/design-system";
import { Sparkline } from "./charts";
import { useAuth } from "@/store/pm-ajay/auth-context";
import {
  STATES,
  FY,
  SCHEMES,
  PERIODS,
  districtsFor,
  VIEWS,
  type Kpi,
  type StateRow,
  type ViewId,
} from "@/lib/pm-ajay/data";

// basePath is applied automatically by Next.js to <Link>/<Image>/router —
// keep in-app paths basePath-relative (empty prefix) so it is not doubled.
const BASE = "/portals/pm-ajay";

const LOWER_BETTER =
  /Alert|Pending|Blocked|Overdue|Rejected|Returned|Audit|Unspent|Processing|Utilization Time/i;

export function pillClass(kpi: Kpi): "good" | "bad" | "flat" {
  if (!kpi.delta || kpi.dir === "flat") return "flat";
  const lower = kpi.type === "days" || LOWER_BETTER.test(kpi.label);
  return (lower ? kpi.dir === "down" : kpi.dir === "up") ? "good" : "bad";
}
const arrow = (d: string) =>
  d === "up" ? "trending_up" : d === "down" ? "trending_down" : "trending_flat";

/* ---- KPI card (CardKpi style) ---- */
export function KpiCard({
  kpi,
  showSpark,
  hero,
}: {
  kpi: Kpi;
  showSpark?: boolean;
  hero?: boolean;
}) {
  const pc = pillClass(kpi);
  const sparkColor =
    kpi.tone === "green"
      ? "var(--sa-color-status-success)"
      : kpi.tone === "amber"
      ? "var(--sa-color-status-warning)"
      : kpi.tone === "red"
      ? "var(--sa-color-status-danger)"
      : "var(--pm-accent)";
  const prefix = kpi.type === "amount" ? "₹" : "";
  const dirWord = pc === "good" ? "up" : pc === "bad" ? "down" : "steady";
  return (
    <div className={"pm-kpi" + (hero ? " hero" : "")}>
      <div className="pm-kpi-top">
        <div className="pm-kpi-label">{kpi.label}</div>
        {showSpark && kpi.spark && (
          <Sparkline data={kpi.spark} color={sparkColor} w={hero ? 88 : 72} h={hero ? 30 : 26} />
        )}
      </div>
      <div className="pm-kpi-value">
        {prefix}
        {kpi.value}
        {kpi.unit && <span className="u">{kpi.unit}</span>}
      </div>
      <div className="pm-kpi-foot">
        {kpi.delta && (
          <span className={"pm-pill " + pc}>
            <span className="material-symbols-rounded" aria-hidden="true">
              {arrow(kpi.dir)}
            </span>
            <span>{kpi.delta}</span>
            <span className="sr-only"> {dirWord}</span>
          </span>
        )}
        {kpi.sub && <span className="pm-kpi-sub">{kpi.sub}</span>}
      </div>
    </div>
  );
}

export function SectionHead({ title, meta }: { title: string; meta?: string }) {
  return (
    <div className="pm-secthead">
      <h2>{title}</h2>
      <span className="rule" />
      {meta && <span className="meta">{meta}</span>}
    </div>
  );
}

export function Panel({
  title,
  sub,
  children,
  style,
}: {
  title?: string;
  sub?: string;
  children: ReactNode;
  style?: CSSProperties;
}) {
  return (
    <div className="pm-panel" style={style}>
      {title && (
        <div className="pm-panel-head">
          <div>
            <h3>{title}</h3>
            {sub && <div className="sub">{sub}</div>}
          </div>
        </div>
      )}
      {children}
    </div>
  );
}

/* ---- Accessible listbox dropdown ---- */
export function FilterSelect({
  k,
  value,
  options,
  onChange,
}: {
  k: string;
  value: string;
  options: string[];
  onChange: (v: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const [hl, setHl] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const reactId = useId();
  const uid = "sel" + reactId.replace(/:/g, "");
  useEffect(() => {
    if (!open) return;
    const h = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, [open]);
  const openWith = () => {
    setHl(Math.max(0, options.indexOf(value)));
    setOpen(true);
  };
  const choose = (i: number) => {
    onChange(options[i] ?? "");
    setOpen(false);
    ref.current?.querySelector<HTMLButtonElement>(".pm-select-btn")?.focus();
  };
  const onKey = (e: React.KeyboardEvent) => {
    if (!open) {
      if (["Enter", " ", "ArrowDown", "ArrowUp"].includes(e.key)) {
        e.preventDefault();
        openWith();
      }
      return;
    }
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setHl((h) => (h + 1) % options.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setHl((h) => (h - 1 + options.length) % options.length);
    } else if (e.key === "Home") {
      e.preventDefault();
      setHl(0);
    } else if (e.key === "End") {
      e.preventDefault();
      setHl(options.length - 1);
    } else if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      choose(hl);
    } else if (e.key === "Escape" || e.key === "Tab") {
      setOpen(false);
    }
  };
  const isDefault = value === options[0];
  return (
    <div className="pm-select" ref={ref}>
      <button
        type="button"
        className={"pm-select-btn" + (isDefault ? "" : " on")}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={`${k}: ${value}`}
        onClick={() => (open ? setOpen(false) : openWith())}
        onKeyDown={onKey}
      >
        <span className="k" aria-hidden="true">
          {k}
        </span>
        <span>{value}</span>
        <span className="material-symbols-rounded" aria-hidden="true">
          {open ? "expand_less" : "expand_more"}
        </span>
      </button>
      {open && (
        <ul className="pm-menu" role="listbox" aria-label={k} aria-activedescendant={`${uid}-${hl}`} tabIndex={-1}>
          {options.map((o, i) => (
            <li key={o} role="presentation">
              <button
                type="button"
                id={`${uid}-${i}`}
                role="option"
                aria-selected={o === value}
                className={(o === value ? "sel" : "") + (i === hl ? " hl" : "")}
                onMouseEnter={() => setHl(i)}
                onClick={() => choose(i)}
              >
                {o}
                {o === value && (
                  <span className="material-symbols-rounded" aria-hidden="true">
                    check
                  </span>
                )}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export interface Filters {
  fy: string;
  state: string;
  district: string;
  scheme: string;
  period: string;
}

/* ---- Filter bar (scheme hidden on scheme views; contextual district) ---- */
const CROSS: ViewId[] = ["executive", "financial", "governance"];
export function DrillDownFilters({
  filters,
  set,
  reset,
  view,
  scope,
}: {
  filters: Filters;
  set: (k: keyof Filters, v: string) => void;
  reset: () => void;
  view: ViewId;
  scope: StateRow | null;
}) {
  const stateOpts = ["All India", ...STATES.map((s) => s.name)];
  const showScheme = CROSS.includes(view);
  const districts = scope ? districtsFor(scope) : [];
  const distOpts = ["All Districts", ...districts.map((d) => d.name)];
  const applied =
    filters.state !== "All India" ||
    (showScheme && filters.scheme !== "All Schemes") ||
    filters.fy !== FY[0] ||
    filters.period !== PERIODS[0] ||
    filters.district !== "All Districts";
  return (
    <div className="pm-filters" role="region" aria-label="Drill-down filters">
      <span className="fl">Drill-down</span>
      <FilterSelect k="FY" value={filters.fy} options={FY} onChange={(v) => set("fy", v)} />
      <FilterSelect k="State / UT" value={filters.state} options={stateOpts} onChange={(v) => set("state", v)} />
      {scope && <FilterSelect k="District" value={filters.district} options={distOpts} onChange={(v) => set("district", v)} />}
      {showScheme && <FilterSelect k="Scheme" value={filters.scheme} options={SCHEMES} onChange={(v) => set("scheme", v)} />}
      <FilterSelect k="Period" value={filters.period} options={PERIODS} onChange={(v) => set("period", v)} />
      {filters.period !== "Annual" && (
        <span className="pm-estimate">
          <span className="material-symbols-rounded" aria-hidden="true">
            info
          </span>
          {filters.period} — indicative
        </span>
      )}
      {applied && (
        <button type="button" className="pm-reset" onClick={reset}>
          <span className="material-symbols-rounded" aria-hidden="true">
            restart_alt
          </span>
          Reset filters
        </button>
      )}
      <span className="grow" />
      <span className="pm-updated">Data refreshed weekly · Last sync 04 Jun 2026</span>
    </div>
  );
}

/* ---- Sidebar ---- */
export function Sidebar({ view, setView }: { view: ViewId; setView: (v: ViewId) => void }) {
  const { account, signOut } = useAuth();
  return (
    <nav className="pm-side" aria-label="Dashboards">
      <div className="pm-side-title" id="pm-nav-h">
        Dashboards
      </div>
      <ul className="pm-nav" aria-labelledby="pm-nav-h">
        {VIEWS.map((v) => (
          <li key={v.id}>
            <button
              type="button"
              className={"pm-nav-item" + (v.id === view ? " active" : "")}
              aria-current={v.id === view ? "page" : undefined}
              onClick={() => setView(v.id as ViewId)}
            >
              <span className="material-symbols-rounded ic" aria-hidden="true">
                {v.icon}
              </span>
              <span className="lab">
                {v.label}
                <span className="sub">{v.sub}</span>
              </span>
              {v.badge && (
                <span className="pm-badge-count" aria-label={`${v.badge} items need attention`}>
                  {v.badge}
                </span>
              )}
            </button>
          </li>
        ))}
      </ul>

      {/* Unified Programme Dashboard link */}
      <div className="pm-side-unified">
        <Link href={`${BASE}/unified`} className="pm-nav-item unified-link">
          <span className="material-symbols-rounded ic" aria-hidden="true">dashboard_customize</span>
          <span className="lab">
            Unified Dashboard
            <span className="sub">All 60 indicators</span>
          </span>
          <span className="material-symbols-rounded" aria-hidden="true" style={{ fontSize: 14, marginLeft: "auto", opacity: 0.5 }}>
            open_in_new
          </span>
        </Link>
      </div>

      <div className="pm-side-foot">
        <div className="av" aria-hidden="true">
          {account?.avatar ?? "??"}
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div className="nm">{account?.name ?? "—"}</div>
          <div className="rl">{account?.designation ?? ""}</div>
        </div>
        <button
          type="button"
          className="pm-signout-btn"
          onClick={signOut}
          aria-label="Sign out"
          title="Sign out"
        >
          <span className="material-symbols-rounded" aria-hidden="true">logout</span>
        </button>
      </div>
    </nav>
  );
}

export function DashboardFooter() {
  return (
    <footer className="pm-footer">
      <span>
        © 2025 — Department of Social Justice &amp; Empowerment. Content owned by MoSJE. Designed, developed &amp;
        hosted by NIC.
      </span>
      <span className="lnk">
        <a href="#">Terms &amp; Conditions</a>
        <span className="vline" aria-hidden="true" />
        <a href="#">Privacy Policy</a>
      </span>
    </footer>
  );
}

/**
 * The dashboard's status pill, now the design system's `Badge` wearing the
 * portal's skin.
 *
 * THE ONE EXPORT IN THIS FILE THAT COULD BE ADOPTED WITHOUT MOVING A PIXEL, and
 * it is worth writing down why, because it is the test the other ten failed.
 * `Badge` renders exactly one `<span>` with the caller's children inline — the
 * same element this component rendered by hand — so the portal's `.pm-status`
 * rules still meet the node they were written for. `pm-ajay.css` is unlayered
 * and `badge.css` sits inside `@layer components`, so every property the two
 * disagree on (background, colour, font, padding, radius, gap) resolves to the
 * portal's.
 *
 * MEASURED IN THE BROWSER, not reasoned about: against a control span carrying
 * only `pm-status green`, the migrated pill differs on exactly ONE computed
 * property — `min-height`, 18px against 0 — and its border box is identical to
 * two decimal places, 70.21 x 18.67. The floor does not bind because the pill's
 * own content already stands at 18.67px, and text zoom can only push that up.
 * The other two properties the design system contributes are inert for the same
 * kind of reason: `justify-content: center` on a shrink-to-fit pill has no free
 * space to distribute, and the `--_bg`/`--_fg` pair is outranked by the
 * portal's `background` and `color` shorthands.
 *
 * `tone` stays the portal's vocabulary rather than becoming `BadgeStatus`,
 * because the four names are what `.pm-status.green` and its siblings key on.
 */
const BADGE_STATUS = {
  green: "success",
  amber: "warning",
  red: "danger",
  blue: "info",
} as const satisfies Record<PmTone, BadgeStatus>;

type PmTone = "green" | "amber" | "red" | "blue";

export function Status({
  tone,
  icon,
  children,
}: {
  tone: PmTone;
  icon?: string;
  children: ReactNode;
}) {
  return (
    <Badge status={BADGE_STATUS[tone]} className={"pm-status " + tone}>
      {icon && (
        <span className="material-symbols-rounded" aria-hidden="true">
          {icon}
        </span>
      )}
      {children}
    </Badge>
  );
}

export function BarCell({ pct, color, display }: { pct: number; color: string; display: string }) {
  return (
    <div className="pm-barcell">
      <div className="pm-bartrack" aria-hidden="true">
        <div className="pm-barfill" style={{ width: Math.min(100, pct) + "%", background: color }} />
      </div>
      <span style={{ font: "600 13px/1 var(--font-sans)", width: 44, textAlign: "right" }}>{display}</span>
    </div>
  );
}

export interface Column<T> {
  key: string;
  label: ReactNode;
  num?: boolean;
  sortable?: boolean;
  sortVal?: (r: T) => number | string;
  render?: (r: T, i: number) => ReactNode;
  cls?: string;
  thStyle?: CSSProperties;
  tdStyle?: CSSProperties;
}

interface SortState {
  key: string;
  dir: "asc" | "desc";
}

/* ---- Sortable, accessible data table ---- */
export function SortableTable<T extends { __label?: string }>({
  caption,
  columns,
  rows,
  getKey,
  onRowClick,
  initialSort,
  emptyText,
}: {
  caption?: string;
  columns: Column<T>[];
  rows: T[];
  getKey?: (r: T) => string | number;
  onRowClick?: (r: T) => void;
  initialSort?: SortState;
  emptyText?: string;
}) {
  const [sort, setSort] = useState<SortState | null>(initialSort || null);
  const sorted = useMemo(() => {
    if (!sort) return rows;
    const col = columns.find((c) => c.key === sort.key);
    if (!col) return rows;
    const val = (r: T): number | string =>
      col.sortVal ? col.sortVal(r) : ((r as Record<string, unknown>)[col.key] as number | string);
    return [...rows].sort((a, b) => {
      const x = val(a),
        y = val(b);
      const cmp = typeof x === "number" && typeof y === "number" ? x - y : String(x).localeCompare(String(y));
      return sort.dir === "asc" ? cmp : -cmp;
    });
  }, [rows, sort, columns]);
  const toggle = (key: string) =>
    setSort((s) => (s && s.key === key ? { key, dir: s.dir === "asc" ? "desc" : "asc" } : { key, dir: "desc" }));
  const ariaSort = (key: string) =>
    sort && sort.key === key ? (sort.dir === "asc" ? "ascending" : "descending") : "none";

  if (!rows.length)
    return (
      <div className="pm-nodata">
        <span className="material-symbols-rounded" aria-hidden="true">
          search_off
        </span>
        {emptyText || "No data for the selected filters."}
      </div>
    );
  return (
    <table className="pm-table">
      {caption && <caption className="sr-only">{caption}</caption>}
      <thead>
        <tr>
          {columns.map((c) => (
            <th
              key={c.key}
              className={(c.num ? "num " : "") + (c.sortable === false ? "" : "sortable")}
              aria-sort={c.sortable === false ? undefined : (ariaSort(c.key) as React.AriaAttributes["aria-sort"])}
              style={c.thStyle}
            >
              {c.sortable === false ? (
                c.label
              ) : (
                <button type="button" onClick={() => toggle(c.key)}>
                  {c.label}
                  <span className="material-symbols-rounded sortic" aria-hidden="true">
                    {sort && sort.key === c.key ? (sort.dir === "asc" ? "arrow_upward" : "arrow_downward") : "unfold_more"}
                  </span>
                </button>
              )}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {sorted.map((r, i) => {
          const clickable = !!onRowClick;
          return (
            <tr
              key={getKey ? getKey(r) : i}
              className={clickable ? "click" : ""}
              tabIndex={clickable ? 0 : undefined}
              role={clickable ? "button" : undefined}
              aria-label={clickable && r.__label ? `Drill into ${r.__label}` : undefined}
              onClick={clickable ? () => onRowClick!(r) : undefined}
              onKeyDown={
                clickable
                  ? (e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        onRowClick!(r);
                      }
                    }
                  : undefined
              }
            >
              {columns.map((c) => (
                <td key={c.key} className={c.num ? "num" : c.cls || ""} style={c.tdStyle}>
                  {c.render ? c.render(r, i) : ((r as Record<string, unknown>)[c.key] as ReactNode)}
                </td>
              ))}
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}
