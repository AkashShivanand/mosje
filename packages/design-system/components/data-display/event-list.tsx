import * as React from "react";
import { cn } from "../../utils/cn";
import { Icon } from "../utilities/icon";
import "./event-list.css";

export type EventTone = "neutral" | "info" | "success" | "warning" | "danger";

export interface EventItem {
  id: string;
  /** ISO timestamp. Rendered inside a <time> so the machine-readable form survives. */
  at: string;
  /**
   * Who acted. Leave it out for something the system did — the row then reads
   * "System", which is a truthful answer and not a blank.
   */
  actor?: string;
  /** The actor's role in the department — "District Nodal Officer". */
  actorRole?: string;
  /** What happened, in the department's words: "Returned for correction". */
  action: string;
  /** What it happened to: "Application 2026/PMS/01284". */
  subject?: string;
  /** A note the actor left. Quoted, and never truncated. */
  note?: string;
  /** Material Symbols name. Decorative — the action text carries the meaning. */
  icon?: string;
  /** @default "neutral" */
  tone?: EventTone;
  /** Not yet seen by this reader. Marked with a word, never a dot alone. */
  unread?: boolean;
  /** Where the entry leads, if anywhere. */
  href?: string;
}

export interface EventListProps {
  /** Events, newest first. The component does not sort — the order is the caller's claim. */
  events: EventItem[];
  /** Accessible name for the list. Required: "Audit log", "Recent activity". */
  label: string;
  /**
   * What to say when there is nothing. An audit log with no entries is a real
   * answer, not a broken panel.
   * @default "No activity recorded yet."
   */
  emptyText?: string;
  /**
   * `"day"` puts a dated heading above each day's entries — the right shape for
   * a long log. `"none"` prints the full stamp on every row.
   * @default "none"
   */
  grouping?: "none" | "day";
  /**
   * Announced beside an entry the reader has not seen.
   * @default "Unread"
   */
  unreadLabel?: string;
  className?: string;
}

const TONE_ICON: Record<EventTone, string> = {
  neutral: "history",
  info: "info",
  success: "check_circle",
  warning: "warning",
  danger: "error",
};

function stamp(iso: string, withDate: boolean): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return iso;
  return date.toLocaleString("en-IN", {
    ...(withDate ? { day: "2-digit" as const, month: "short" as const, year: "numeric" as const } : {}),
    hour: "2-digit",
    minute: "2-digit",
  });
}

function dayKey(iso: string): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return iso;
  return date.toLocaleDateString("en-IN", { day: "2-digit", month: "long", year: "numeric" });
}

/**
 * A dated, attributed record of things that happened.
 *
 * One component, because a comment, an audit entry and a notification are the
 * same object seen three ways: *someone did something to something, at a time,
 * and may have said why*. Building three of them produces three vocabularies for
 * one thing, and then a portal's audit log and its notification panel disagree
 * about what an actor is.
 *
 * `CommentThread` and `NotificationCentre` compose this. Used directly, it IS
 * the activity log and the audit trail — there is no separate component for
 * those, deliberately.
 *
 * Four rules it enforces:
 *
 * 1. **A note is never truncated.** On a departmental record the reason an
 *    application was returned is the most important text on the screen, and an
 *    ellipsis in the middle of it is a defect.
 * 2. **Unread is a WORD, not a dot.** A coloured dot is invisible to a screen
 *    reader and to anyone who cannot distinguish it; the row carries a visually
 *    hidden "Unread" as well.
 * 3. **A system action says "System".** An empty actor column reads as missing
 *    data, and on an audit trail that is the worst thing it could read as.
 * 4. **The empty state is written.** "No activity recorded yet" is the answer to
 *    the reader's question; a blank panel is not.
 *
 * It does not sort. The order it is handed is the order it renders, because the
 * caller knows whether the newest or the oldest entry belongs at the top and the
 * component does not.
 */
export function EventList({
  events,
  label,
  emptyText = "No activity recorded yet.",
  grouping = "none",
  unreadLabel = "Unread",
  className,
}: EventListProps): React.JSX.Element {
  if (events.length === 0) {
    return (
      <div className={cn("ds-events", "ds-events--empty", className)}>
        <p className="ds-events__empty">{emptyText}</p>
      </div>
    );
  }

  const groups: { key: string; items: EventItem[] }[] = [];
  if (grouping === "day") {
    for (const event of events) {
      const key = dayKey(event.at);
      const last = groups[groups.length - 1];
      if (last && last.key === key) last.items.push(event);
      else groups.push({ key, items: [event] });
    }
  } else {
    groups.push({ key: "", items: events });
  }

  return (
    <div className={cn("ds-events", className)}>
      {groups.map((group) => (
        <section key={group.key || "all"} className="ds-events__group">
          {group.key ? <h3 className="ds-events__day">{group.key}</h3> : null}
          <ol className="ds-events__list" aria-label={group.key ? `${label} — ${group.key}` : label}>
            {group.items.map((event) => {
              const tone = event.tone ?? "neutral";
              const body = (
                <>
                  <span className="ds-events__action">{event.action}</span>
                  {event.subject ? <span className="ds-events__subject"> {event.subject}</span> : null}
                </>
              );
              return (
                <li key={event.id} className={cn("ds-events__item", `ds-events__item--${tone}`)}>
                  <span className="ds-events__mark" aria-hidden="true">
                    <Icon name={event.icon ?? TONE_ICON[tone]} size={20} />
                  </span>
                  <div className="ds-events__body">
                    <p className="ds-events__line">
                      {event.unread ? <span className="ds-events__sr">{unreadLabel}: </span> : null}
                      {event.href ? (
                        <a className="ds-events__link" href={event.href}>
                          {body}
                        </a>
                      ) : (
                        body
                      )}
                    </p>
                    <p className="ds-events__meta">
                      <span className="ds-events__actor">{event.actor ?? "System"}</span>
                      {event.actorRole ? <span className="ds-events__role"> · {event.actorRole}</span> : null}
                      {" · "}
                      <time dateTime={event.at}>{stamp(event.at, grouping === "none")}</time>
                    </p>
                    {event.note ? <p className="ds-events__note">{event.note}</p> : null}
                  </div>
                  {event.unread ? <span className="ds-events__unread" aria-hidden="true" /> : null}
                </li>
              );
            })}
          </ol>
        </section>
      ))}
    </div>
  );
}
