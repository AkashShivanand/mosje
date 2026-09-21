"use client";

import { useEffect, useId, useMemo, useState } from "react";
import Link from "next/link";
import { Button, Icon, Search, Select } from "@mosje/design-system";
import type { Official } from "@/data/website";
import { EmailLinks, PhoneNumbers, Portrait, officialEmails, tidyAddress } from "./people-format";

export interface WhosWhoTeam {
  id: string;
  title: string;
  viewAllHref: string;
  officials: Official[];
}

const ALL = "all";

/**
 * Who's Who: the teams, a search over names and posts, and a team filter (NAV-17).
 *
 * On a phone every team is a disclosure — the first open, the rest closed — so
 * eleven teams are eleven headings rather than a page 9,000px long. A search
 * opens every team that has a match and hides every team that has none. On a
 * wide screen every team is always open and the toggle is not drawn.
 */
export function WhosWhoBrowser({ teams }: { teams: WhosWhoTeam[] }) {
  const [query, setQuery] = useState("");
  const [team, setTeam] = useState(ALL);
  const [open, setOpen] = useState<Record<string, boolean>>(() => ({ [teams[0]?.id ?? ""]: true }));
  const [ready, setReady] = useState(false);
  const uid = useId();

  useEffect(() => {
    const p = new URLSearchParams(window.location.search);
    /* eslint-disable react-hooks/set-state-in-effect -- one-off read of the URL after hydration */
    const q = p.get("q");
    const t = p.get("team");
    if (q) setQuery(q);
    if (t && teams.some((x) => x.id === t)) setTeam(t);
    setReady(true);
    /* eslint-enable react-hooks/set-state-in-effect */
  }, [teams]);

  useEffect(() => {
    if (!ready) return;
    const p = new URLSearchParams(window.location.search);
    if (query.trim()) p.set("q", query.trim());
    else p.delete("q");
    if (team !== ALL) p.set("team", team);
    else p.delete("team");
    const qs = p.toString();
    window.history.replaceState(window.history.state, "", `${window.location.pathname}${qs ? `?${qs}` : ""}`);
  }, [ready, query, team]);

  const q = query.trim().toLowerCase();
  const visible = useMemo(
    () =>
      teams
        .filter((t) => team === ALL || t.id === team)
        .map((t) => ({
          ...t,
          officials: q
            ? t.officials.filter((o) => o.name.toLowerCase().includes(q) || o.designation.toLowerCase().includes(q))
            : t.officials,
        }))
        .filter((t) => t.officials.length > 0),
    [teams, team, q],
  );
  const matches = visible.reduce((n, t) => n + t.officials.length, 0);
  const filterActive = q !== "" || team !== ALL;
  const reset = () => {
    setQuery("");
    setTeam(ALL);
  };
  const teamName = teams.find((t) => t.id === team)?.title;

  return (
    <>
      <form className="wn-who__tools" role="search" aria-label="Search Who's Who" onSubmit={(e) => e.preventDefault()}>
        <div className="wn-dir__field">
          <label htmlFor={`${uid}-q`} className="wn-dir__label">
            Name or Designation
          </label>
          <Search
            id={`${uid}-q`}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onClear={() => setQuery("")}
            size="md"
            placeholder="For example, Chairperson or Member Secretary"
          />
        </div>
        <div className="wn-dir__field">
          <label htmlFor={`${uid}-team`} className="wn-dir__label">
            Organisation
          </label>
          <Select
            id={`${uid}-team`}
            value={team}
            onChange={(e) => setTeam(e.target.value)}
            options={[{ label: "All Organisations", value: ALL }, ...teams.map((t) => ({ label: t.title, value: t.id }))]}
          />
        </div>
      </form>

      <div className={`wn-dir__bar${filterActive ? "" : " wn-dir__bar--idle"}`}>
        <p className="wn-dir__count" role="status">
          {filterActive
            ? matches === 0
              ? "No officers found"
              : `${matches} ${matches === 1 ? "officer" : "officers"} in ${visible.length} ${visible.length === 1 ? "organisation" : "organisations"}`
            : ""}
        </p>
        {filterActive && (
          <Button variant="neutral" appearance="text" size="sm" onClick={reset}>
            Clear Filters
          </Button>
        )}
      </div>

      {visible.length === 0 ? (
        <div className="wn-people-empty">
          <span className="wn-people-empty__icon" aria-hidden="true">
            <Icon name="search_off" size={32} />
          </span>
          <h2 className="wn-people-empty__title">No Officers Match</h2>
          <p className="wn-people-empty__text">
            No officer {teamName ? `of ${teamName} ` : ""}
            {q ? `has a name or designation containing “${query.trim()}”` : "is listed"}. The full telephone directories
            below list every officer.
          </p>
          <Button variant="primary" appearance="outlined" size="md" onClick={reset}>
            Clear Filters
          </Button>
        </div>
      ) : (
        <div className="wn-who__teams">
          {visible.map((t) => {
            const isOpen = filterActive || Boolean(open[t.id]);
            const bodyId = `${uid}-${t.id}`;
            const headingId = `${uid}-${t.id}-h`;
            return (
              <section key={t.id} className="wn-who__team" data-open={isOpen} aria-labelledby={headingId}>
                <div className="wn-who__team-head">
                  <h2 className="wn-who__team-title" id={headingId}>
                    <button
                      type="button"
                      className="wn-who__toggle"
                      aria-expanded={isOpen}
                      aria-controls={bodyId}
                      onClick={() => setOpen((s) => ({ ...s, [t.id]: !isOpen }))}
                    >
                      <span>{t.title}</span>
                      <span className="wn-who__toggle-icon" aria-hidden="true">
                        <Icon name="expand_more" size={24} />
                      </span>
                    </button>
                    <span className="wn-who__title-static">{t.title}</span>
                  </h2>
                  <Link href={t.viewAllHref} className="wn-who__all">
                    <span className="wn-who__all-text">
                      View All<span className="sr-only"> Officers of {t.title}</span>
                    </span>
                    <Icon name="arrow_forward" size={20} aria-hidden />
                  </Link>
                </div>
                <div id={bodyId} className="wn-who__body">
                  <ul className="wn-who__grid">
                    {t.officials.map((o) => (
                      <li key={`${o.name}-${o.designation}`}>
                        <OfficialCard official={o} />
                      </li>
                    ))}
                  </ul>
                </div>
              </section>
            );
          })}
        </div>
      )}
    </>
  );
}

function OfficialCard({ official: o }: { official: Official }) {
  const address = tidyAddress(o.address, o.phone);
  const hasEmail = officialEmails(o.email).length > 0;
  const hasFacts = Boolean(o.room || o.intercom || o.phone || hasEmail || address);
  return (
    <article className="wn-who__card">
      <Portrait src={o.photo} alt={`${o.name}, ${o.designation}`} />
      <div className="wn-who__who">
        <h3 className="wn-who__name">
          {o.slug ? <Link href={`/website/official/${o.slug}`}>{o.name}</Link> : o.name}
        </h3>
        <p className="wn-who__role">{o.designation}</p>
      </div>
      {hasFacts && (
        <dl className="wn-people-facts">
          {o.phone && (
            <div>
              <dt>Telephone</dt>
              <dd>
                <PhoneNumbers value={o.phone} />
              </dd>
            </div>
          )}
          {o.intercom && (
            <div>
              <dt>Intercom</dt>
              <dd>{o.intercom}</dd>
            </div>
          )}
          {hasEmail && (
            <div>
              <dt>Email</dt>
              <dd>
                <EmailLinks value={o.email} />
              </dd>
            </div>
          )}
          {o.room && (
            <div>
              <dt>Room</dt>
              <dd>{o.room}</dd>
            </div>
          )}
          {address && (
            <div>
              <dt>Address</dt>
              <dd>{address}</dd>
            </div>
          )}
        </dl>
      )}
    </article>
  );
}
