import { getDbimEvents } from "@/lib/website-dbim/connect";
import { DbimEventList } from "./EventList";
import "./connect.css";

const PER_PAGE = 10;

/**
 * Connect › Events: upcoming beside past. The split is at today (IST), which is why
 * the page is rendered per request — an event moves from one list to the other overnight.
 */
export function DbimEvents({ page: asked = 1 }: { page?: number }) {
  const today = new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Kolkata" }).format(new Date());
  const { upcoming, past } = getDbimEvents(today);
  const pageCount = Math.max(1, Math.ceil(past.length / PER_PAGE));
  const page = Math.min(Math.max(1, Math.floor(asked) || 1), pageCount);
  return (
    <div className="db-split">
      <aside className="db-split__side db-split__side--static">
        <div className="db-lead-box">
          {upcoming.length === 0 ? (
            <h2>No Upcoming Events</h2>
          ) : (
            <>
              <h2>Upcoming Events</h2>
              <ul className="db-upcoming">
                {upcoming.map((e) => (
                  <li key={e.key}>
                    <p className="db-upcoming__title">{e.title}</p>
                    <p className="db-upcoming__when">
                      {[e.place, e.start].filter(Boolean).join(" | ")}
                    </p>
                  </li>
                ))}
              </ul>
            </>
          )}
        </div>
      </aside>
      <div className="db-split__main">
        <DbimEventList
          events={past.slice((page - 1) * PER_PAGE, page * PER_PAGE)}
          total={past.length}
          page={page}
          pageCount={pageCount}
        />
      </div>
    </div>
  );
}
