"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Button, EmptyState, Icon, Pagination, Search, Select } from "@mosje/design-system";
import { PageLayout } from "@/components/website/layout/PageLayout";
import "@/components/website/templates/record-library.css";
import "../gallery/gallery.css";

export interface ClassicEventCard {
  slug: string;
  title: string;
  /** YYYY-MM-DD, for ordering only. */
  sortKey: string;
  when?: string;
  organisation?: string;
  cover?: string;
}

/**
 * STATES: populated, empty, filtered-to-nothing (worded differently, with the
 * reset), and too-much — paged at twenty-four, never scrolled inside a card.
 * Loading and error cannot occur: the register is imported JSON resolved on the
 * server. Cards reuse the gallery's grid so the two registers read alike.
 */
const PAGE_SIZE = 24;

export function EventsClient({
  title,
  description,
  lastUpdated,
  events,
}: {
  title: string;
  description: string;
  lastUpdated?: string;
  events: ClassicEventCard[];
}) {
  const [query, setQuery] = useState("");
  const [organisation, setOrganisation] = useState("All");
  const [page, setPage] = useState(1);

  const organisations = useMemo(() => {
    const seen = new Set<string>();
    for (const e of events) if (e.organisation) seen.add(e.organisation);
    return [...seen].sort();
  }, [events]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return events.filter((e) => {
      if (organisation !== "All" && e.organisation !== organisation) return false;
      if (q && !e.title.toLowerCase().includes(q)) return false;
      return true;
    });
  }, [events, query, organisation]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const current = Math.min(page, totalPages);
  const shown = filtered.slice((current - 1) * PAGE_SIZE, current * PAGE_SIZE);

  const filterActive = query.trim() !== "" || organisation !== "All";
  const reset = () => {
    setQuery("");
    setOrganisation("All");
    setPage(1);
  };

  return (
    <PageLayout
      title={title}
      breadcrumb={[{ label: "Events & Gallery" }, { label: "Events" }]}
      description={description}
      lastUpdated={lastUpdated}
    >
      <section className="sa-record-library">
        <div className="sa-container">
          <div className="sa-record-library__filters">
            <div className="sa-record-library__search">
              <Search
                value={query}
                onChange={(e) => { setQuery(e.target.value); setPage(1); }}
                onClear={() => { setQuery(""); setPage(1); }}
                size="sm"
                placeholder="Search events by title"
                aria-label="Search events by title"
              />
            </div>

            {organisations.length > 1 && (
              <label className="sa-record-library__filter">
                <span className="sa-record-library__filter-label">Organisation</span>
                <Select
                  appearance="filter"
                  value={organisation}
                  onChange={(e) => { setOrganisation(e.target.value); setPage(1); }}
                  options={[
                    { label: "All organisations", value: "All" },
                    ...organisations.map((o) => ({ label: o, value: o })),
                  ]}
                />
              </label>
            )}

            {filterActive && (
              <Button variant="neutral" appearance="text" size="sm" onClick={reset}>
                Reset Filters
              </Button>
            )}
          </div>

          <p className="sa-record-library__count" role="status">
            {filtered.length.toLocaleString("en-IN")} {filtered.length === 1 ? "event" : "events"}
            {filterActive && ` of ${events.length.toLocaleString("en-IN")}`}
          </p>

          {events.length === 0 ? (
            <EmptyState
              icon={<Icon name="event" size={40} />}
              title="No Events Published"
              description="The Department has not published any events."
            />
          ) : filtered.length === 0 ? (
            <EmptyState
              icon={<Icon name="search_off" size={40} />}
              title="No Events Match These Filters"
              description={`All ${events.length.toLocaleString("en-IN")} events were excluded by the filters above. Clear them to see every event the Department has published.`}
              action={
                <Button variant="primary" appearance="outlined" size="sm" onClick={reset}>
                  Reset Filters
                </Button>
              }
            />
          ) : (
            <>
              <ul className="sa-gallery-grid">
                {shown.map((e) => (
                  <li key={e.slug} className="sa-gallery-card">
                    <Link href={`/website/events/${e.slug}`} className="sa-gallery-card__link">
                      <span className="sa-gallery-card__frame">
                        {e.cover ? (
                          <Image
                            src={e.cover}
                            alt=""
                            fill
                            className="sa-gallery-card__image"
                            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                          />
                        ) : (
                          <Icon name="event" size={40} className="sa-gallery-card__placeholder" />
                        )}
                        {e.when && <span className="sa-gallery-card__type">{e.when}</span>}
                      </span>
                      <span className="sa-gallery-card__title">{e.title}</span>
                    </Link>
                    {e.organisation && <span className="sa-gallery-card__meta">{e.organisation}</span>}
                  </li>
                ))}
              </ul>

              <div className="sa-gallery-pager">
                <Pagination page={current} totalPages={totalPages} onPageChange={setPage} label="Event pages" />
              </div>
            </>
          )}
        </div>
      </section>
    </PageLayout>
  );
}
