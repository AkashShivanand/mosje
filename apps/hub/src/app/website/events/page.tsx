import type { Metadata } from "next";
import Link from "next/link";
import { EmptyState, Icon, Pagination } from "@mosje/design-system";
import { PageLayout } from "@/components/website-next/layout/PageLayout";
import { EventCard, EventGroupCard, eventDate } from "@/components/website-next/media/EventCard";
import { groupEvents } from "@/components/website-next/media/event-groups";
import { ListFilters } from "@/components/website-next/media/ListFilters";
import { organisationName } from "@/components/website-next/media/org-name";
import { getContentSyncedDate, getEvents } from "@/lib/website/content";
import { socialCard } from "@/lib/seo/social";
import "@/components/website-next/templates/media.css";

const TITLE = "Events";
const DESCRIPTION =
  "Programmes, trainings and observances held by the Department of Social Justice & Empowerment and its associated organisations.";

export const metadata: Metadata = {
  title: `${TITLE} | Department of Social Justice & Empowerment`,
  description: DESCRIPTION,
  ...socialCard({ title: TITLE, description: DESCRIPTION, url: "/website/events" }),
};

const PAGE_SIZE = 20;

/** Today's IST calendar date, decided once per request for the whole list ("Upcoming"). */
function istToday(): string {
  return new Date(Date.now() + 5.5 * 3600 * 1000).toISOString().slice(0, 10);
}

interface Props {
  searchParams: Promise<{ org?: string; year?: string; page?: string }>;
}

/**
 * Events — every event in the register (635), newest first, paged at twenty.
 *
 * WHAT THIS REPLACED: six events written into this file, with dates, venues and
 * highlights that the register does not contain. The list is now the ingested
 * `events.json`, sorted by the date each event was HELD (`startDate`), not the
 * date it was posted.
 *
 * STATES: populated · filtered to nothing (names the filter, offers Clear
 * Filters) · empty (the register has none) · too much (paged, page in the URL).
 * Loading and error cannot occur: the register is imported JSON resolved here.
 *
 * REPEAT POSTS (issue CON-15): posts with the same normalised title, the same
 * organisation and the same month are one entry — one card with the count and
 * a disclosure of each date and place. The rule, and why it is that narrow, is
 * in `media/event-groups.ts`. Paging counts entries, not posts.
 */
export default async function EventsPage({ searchParams }: Props) {
  const params = await searchParams;
  const all = [...getEvents()].sort((a, b) => (eventDate(b) ?? "").localeCompare(eventDate(a) ?? ""));

  const orgCodes = [...new Set(all.map((e) => e.organisation).filter((o): o is string => !!o))];
  const orgOptions = orgCodes
    .map((code) => ({ value: code, label: organisationName(code) ?? code }))
    .sort((a, b) => a.label.localeCompare(b.label));
  const years = [...new Set(all.map((e) => eventDate(e)?.slice(0, 4)).filter((y): y is string => !!y))].sort().reverse();

  const org = orgCodes.includes(params.org ?? "") ? params.org! : "";
  const year = years.includes(params.year ?? "") ? params.year! : "";

  const matching = all.filter((e) => (!org || e.organisation === org) && (!year || eventDate(e)?.startsWith(year)));
  /* Grouped after filtering: a group never straddles an organisation or a year, so the filters cannot split one. */
  const filtered = groupEvents(matching);
  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const page = Math.min(totalPages, Math.max(1, Number(params.page) || 1));
  const shown = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  const filterActive = !!(org || year);
  const today = istToday();

  const hrefFor = (n: number) => {
    const q = new URLSearchParams();
    if (org) q.set("org", org);
    if (year) q.set("year", year);
    if (n > 1) q.set("page", String(n));
    const s = q.toString();
    return s ? `/website/events?${s}` : "/website/events";
  };

  const filterWords = [org && organisationName(org), year && `held in ${year}`].filter(Boolean).join(", ");

  return (
    <PageLayout
      title={TITLE}
      breadcrumb={[{ label: "Media" }, { label: TITLE }]}
      description={DESCRIPTION}
      lastUpdated={getContentSyncedDate()}
    >
      <section className="wn-section" aria-label="Event list">
        <div className="sa-container">
          <ListFilters
            basePath="/website/events"
            fields={[
              { name: "org", label: "Organisation", value: org, allLabel: "All Organisations", options: orgOptions },
              { name: "year", label: "Year", value: year, allLabel: "All Years", options: years.map((y) => ({ label: y, value: y })) },
            ]}
          />

          <p className="wn-count" role="status">
            {filtered.length === 0
              ? filterActive
                ? "No events match these filters."
                : ""
              : `Showing ${((page - 1) * PAGE_SIZE + 1).toLocaleString("en-IN")}–${Math.min(page * PAGE_SIZE, filtered.length).toLocaleString("en-IN")} of ${filtered.length.toLocaleString("en-IN")} entries, covering ${matching.length.toLocaleString("en-IN")} events${filterActive ? ` (${filterWords})` : ""}`}
          </p>

          {all.length === 0 ? (
            <EmptyState
              icon={<Icon name="event" size={40} />}
              title="No Events Published"
              description="The Department has not published any events."
            />
          ) : filtered.length === 0 ? (
            <EmptyState
              icon={<Icon name="filter_alt_off" size={40} />}
              title="No Events Match These Filters"
              description={`No event in the register is from ${filterWords}. Clear the filters to see all ${all.length.toLocaleString("en-IN")} events.`}
              action={
                <Link href="/website/events" className="wn-filters__clear">
                  Clear Filters
                </Link>
              }
            />
          ) : (
            <>
              <ul className="wn-events">
                {shown.map((entry) =>
                  entry.events.length > 1 ? (
                    <EventGroupCard key={entry.key} events={entry.events} headingLevel={2} today={today} />
                  ) : (
                    <EventCard key={entry.key} event={entry.events[0]!} headingLevel={2} today={today} />
                  ),
                )}
              </ul>
              {totalPages > 1 && (
                <div className="wn-pager">
                  <Pagination page={page} totalPages={totalPages} hrefFor={hrefFor} label="Event pages" />
                </div>
              )}
            </>
          )}
        </div>
      </section>
    </PageLayout>
  );
}
