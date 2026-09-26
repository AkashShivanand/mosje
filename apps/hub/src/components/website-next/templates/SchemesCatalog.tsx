"use client";

import { useEffect, useId, useMemo, useRef, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Button, Chip, Icon, RadioGroup, SectionTitle, SegmentedControl } from "@mosje/design-system";
import { OFFERINGS, PERSONAS, isOffering, isPersona } from "@/lib/website-next/schemes";
import {
  SCHEME_TYPES,
  findSchemes,
  groupByAdministrator,
  groupByOffering,
  offeringLabel,
  personaLabel,
  type FinderFilter,
} from "@/lib/website-next/scheme-view";
import { SchemeCard } from "./SchemeCard";
import "./schemes.css";

/**
 * Find a Scheme — the finder over the Department's scheme master (X-IA-04:
 * built on the 38 Annual Report-sourced records, not the 140-entry legacy list).
 *
 * Filters live in the URL (?who=&offer=&type=&q=&by=) so a result can be
 * shared, and so the home page's persona and offering links land here already
 * filtered. The records are tiny, so filtering happens in the browser and the
 * route stays static: the server prerenders the unfiltered catalogue (the
 * Suspense fallback), and the URL is applied on hydration.
 *
 * Counts appear ONLY on the group headings, computed from the master at render
 * (decisions 1 and 2 of the register). The number of results is announced to
 * screen readers when a filter changes it, and is not printed.
 *
 * Each group shows its first GROUP_PREVIEW cards; a real disclosure button
 * (aria-expanded) opens the rest, so an unfiltered visit is not an 11,000px
 * page. The heading's count always states the whole group.
 */

const GROUP_PREVIEW = 4;

type GroupBy = "offer" | "admin";

interface FinderState extends FinderFilter {
  by: GroupBy;
}

function readState(sp: URLSearchParams | null): FinderState {
  const who = sp?.get("who");
  const offer = sp?.get("offer");
  const type = sp?.get("type");
  return {
    who: isPersona(who) ? who : undefined,
    offer: isOffering(offer) ? offer : undefined,
    type: type && SCHEME_TYPES.includes(type) ? type : undefined,
    q: sp?.get("q")?.trim() || undefined,
    by: sp?.get("by") === "admin" ? "admin" : "offer",
  };
}

function toQuery(s: FinderState): string {
  const p = new URLSearchParams();
  if (s.who) p.set("who", s.who);
  if (s.offer) p.set("offer", s.offer);
  if (s.type) p.set("type", s.type);
  if (s.q) p.set("q", s.q);
  if (s.by === "admin") p.set("by", "admin");
  const q = p.toString();
  return q ? `?${q}` : "";
}

/** The live finder: reads and writes the URL. Must sit inside <Suspense>. */
export function SchemesCatalog() {
  const sp = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const state = useMemo(() => readState(sp), [sp]);
  const update = (next: Partial<FinderState>) => {
    router.replace(`${pathname}${toQuery({ ...state, ...next })}`, { scroll: false });
  };
  return <FinderView state={state} onChange={update} />;
}

/** The prerendered, unfiltered catalogue: the Suspense fallback. */
export function SchemesCatalogStatic() {
  return <FinderView state={{ by: "offer" }} onChange={() => {}} />;
}

function FinderView({ state, onChange }: { state: FinderState; onChange: (s: Partial<FinderState>) => void }) {
  const uid = useId();
  const [panelOpen, setPanelOpen] = useState(false);
  const [q, setQ] = useState(state.q ?? "");
  const lastPushed = useRef(state.q ?? "");

  // The URL is the source of truth; follow it when it changes from outside
  // (back button, a Clear link), but not while the reader is typing.
  useEffect(() => {
    if ((state.q ?? "") !== lastPushed.current) {
      lastPushed.current = state.q ?? "";
      setQ(state.q ?? "");
    }
  }, [state.q]);

  useEffect(() => {
    const t = q.trim();
    if (t === lastPushed.current) return;
    const id = window.setTimeout(() => {
      lastPushed.current = t;
      onChange({ q: t || undefined });
    }, 300);
    return () => window.clearTimeout(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps -- debounce on the typed value only
  }, [q]);

  const results = useMemo(() => findSchemes(state), [state]);
  const groups = useMemo(
    () => (state.by === "admin" ? groupByAdministrator(results) : groupByOffering(results, state)),
    [results, state],
  );

  const active: { key: keyof FinderFilter; label: string }[] = [];
  if (state.who) active.push({ key: "who", label: personaLabel(state.who) });
  if (state.offer) active.push({ key: "offer", label: offeringLabel(state.offer) });
  if (state.type) active.push({ key: "type", label: state.type });
  if (state.q) active.push({ key: "q", label: `“${state.q}”` });
  const anyActive = active.length > 0;
  const clearAll = () => {
    setQ("");
    lastPushed.current = "";
    onChange({ who: undefined, offer: undefined, type: undefined, q: undefined });
  };

  const n = results.length;
  const statusText = anyActive
    ? n === 0
      ? `No scheme matches ${active.map((a) => a.label).join(" and ")}.`
      : `${n} ${n === 1 ? "scheme matches" : "schemes match"} ${active.map((a) => a.label).join(" and ")}.`
    : "";

  // Opened groups close again when the result set changes, so a new filter
  // never lands the reader in the middle of a long, previously opened list.
  const resultKey = `${toQuery(state)}`;
  const [opened, setOpened] = useState<{ key: string; ids: Set<string> }>({ key: resultKey, ids: new Set() });
  const openIds = opened.key === resultKey ? opened.ids : new Set<string>();
  const toggleGroup = (id: string) => {
    const next = new Set(openIds);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setOpened({ key: resultKey, ids: next });
  };

  const panelId = `${uid}-filters`;

  return (
    <div className="wn-finder">
      <Button
        variant="neutral"
        appearance="outlined"
        className="wn-finder__toggle"
        aria-expanded={panelOpen}
        aria-controls={panelId}
        onClick={() => setPanelOpen((o) => !o)}
        iconLeft={<Icon name="tune" size={20} />}
      >
        <span>{panelOpen ? "Hide Filters" : "Show Filters"}</span>
        {anyActive && <span className="wn-finder__toggle-note">{active.map((a) => a.label).join(", ")}</span>}
      </Button>

      <aside id={panelId} className="wn-finder__panel" data-open={panelOpen} aria-label="Filter schemes">
        <div className="wn-finder__search">
          <label htmlFor={`${uid}-q`} className="wn-finder__label">
            Search Schemes
          </label>
          <div className="wn-finder__field">
            <span aria-hidden className="wn-finder__field-icon">
              <Icon name="search" size={20} />
            </span>
            <input
              id={`${uid}-q`}
              type="search"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Scheme name or keyword"
              autoComplete="off"
            />
          </div>
        </div>

        <Facet title="Type" defaultOpen>
          <RadioGroup
            name={`${uid}-type`}
            legend="Type"
            hideLegend
            size="sm"
            value={state.type ?? ""}
            onChange={(v) => onChange({ type: v || undefined })}
            options={[{ value: "", label: "All Types" }, ...SCHEME_TYPES.map((t) => ({ value: t, label: t }))]}
          />
        </Facet>
        <Facet title="Who It Is For" defaultOpen>
          <RadioGroup
            name={`${uid}-who`}
            legend="Who It Is For"
            hideLegend
            size="sm"
            value={state.who ?? ""}
            onChange={(v) => onChange({ who: isPersona(v) ? v : undefined })}
            options={[{ value: "", label: "All Groups" }, ...PERSONAS.map((p) => ({ value: p.id, label: p.label }))]}
          />
        </Facet>
        <Facet title="What You Get" defaultOpen>
          <RadioGroup
            name={`${uid}-offer`}
            legend="What You Get"
            hideLegend
            size="sm"
            value={state.offer ?? ""}
            onChange={(v) => onChange({ offer: isOffering(v) ? v : undefined })}
            options={[
              { value: "", label: "All Kinds of Support" },
              ...OFFERINGS.map((o) => ({ value: o.id, label: o.label })),
            ]}
          />
        </Facet>

        {anyActive && (
          <Button variant="primary" appearance="outlined" size="sm" onClick={clearAll} className="wn-finder__clear">
            Clear Filters
          </Button>
        )}
      </aside>

      <div className="wn-finder__results">
        <div className="wn-finder__bar">
          <p role="status" aria-live="polite" className="sr-only">
            {statusText}
          </p>
          {n > 0 && (
            <div className="wn-finder__groupby">
              <span className="wn-finder__groupby-label" aria-hidden>
                Group By
              </span>
              <SegmentedControl<GroupBy>
                ariaLabel="Group results by"
                value={state.by}
                options={[
                  { value: "offer", label: "What You Get" },
                  { value: "admin", label: "Administered By" },
                ]}
                onChange={(by) => onChange({ by })}
              />
            </div>
          )}
        </div>

        {anyActive && (
          <ul className="wn-finder__active" aria-label="Filters applied">
            {active.map((a) => (
              <li key={a.key}>
                <Chip
                  size="sm"
                  dismissLabel={`Remove filter: ${a.label}`}
                  onDismiss={() => {
                    if (a.key === "q") {
                      setQ("");
                      lastPushed.current = "";
                    }
                    onChange({ [a.key]: undefined });
                  }}
                >
                  {a.label}
                </Chip>
              </li>
            ))}
          </ul>
        )}

        {n === 0 ? (
          <div className="wn-finder__none">
            <span aria-hidden className="wn-finder__none-icon">
              <Icon name="search_off" size={32} />
            </span>
            <h2 className="wn-finder__none-title">No Scheme Matches These Filters</h2>
            <p>
              No scheme of the Department is recorded for {active.map((a) => a.label).join(" and ")}. Remove a
              filter, or clear them all to see every scheme.
            </p>
            <Button variant="primary" appearance="filled" size="md" onClick={clearAll}>
              Clear Filters
            </Button>
          </div>
        ) : (
          groups.map((g) => {
            const hid = `${uid}-g-${g.id}`;
            const listId = `${uid}-l-${g.id}`;
            const open = openIds.has(g.id);
            const more = g.schemes.length > GROUP_PREVIEW;
            const shown = open || !more ? g.schemes : g.schemes.slice(0, GROUP_PREVIEW);
            return (
              <section key={g.id} className="wn-finder__group" aria-labelledby={hid}>
                <SectionTitle as={2} headingId={hid} title={g.title} count={g.schemes.length} />
                <ul className="wn-finder__list" id={listId}>
                  {shown.map((s) => (
                    <li key={s.id}>
                      <SchemeCard scheme={s} who={state.who} />
                    </li>
                  ))}
                </ul>
                {more && (
                  <p className="wn-finder__more">
                    <Button
                      variant="primary"
                      appearance="outlined"
                      size="md"
                      aria-expanded={open}
                      aria-controls={listId}
                      onClick={() => toggleGroup(g.id)}
                    >
                      {open ? `Show Fewer in ${g.title}` : `Show All ${g.schemes.length} in ${g.title}`}
                    </Button>
                  </p>
                )}
              </section>
            );
          })
        )}
      </div>
    </div>
  );
}

function Facet({ title, defaultOpen, children }: { title: string; defaultOpen?: boolean; children: React.ReactNode }) {
  const [open, setOpen] = useState(Boolean(defaultOpen));
  const id = useId();
  return (
    <div className="wn-facet">
      <div className="wn-facet__heading">
        <Button
          variant="neutral"
          appearance="text"
          className="wn-facet__toggle"
          aria-expanded={open}
          aria-controls={id}
          onClick={() => setOpen((o) => !o)}
          iconRight={
            <span aria-hidden className="wn-facet__chev" data-open={open}>
              <Icon name="expand_more" size={20} />
            </span>
          }
        >
          {title}
        </Button>
      </div>
      <div id={id} hidden={!open} className="wn-facet__body">
        {children}
      </div>
    </div>
  );
}
