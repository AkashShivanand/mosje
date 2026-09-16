import * as React from "react";
import { cn } from "../../utils/cn";
import { Icon } from "../utilities/icon";
import { Badge } from "../feedback/badge";
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
  /**
   * The reader must DO something — answer a deficiency, upload a document.
   * Derive it from the live record, never store it: it clears when the record
   * no longer needs the action, not when the entry is read.
   * (`docs/specs/notification-object.md`)
   */
  actionRequired?: boolean;
  /** Deadline for that action, ISO. Printed as "Respond by 30 Sep 2026". */
  dueAt?: string;
  /**
   * What this ONE deadline is called, where the list's `dueLabel` is not true of it: a
   * utilisation certificate is "File by 31 Mar 2027", not "Respond by". Falls back to the list's
   * `dueLabel`, so a list of one kind of deadline still sets it once.
   *
   * The overdue wording is not per item: an entry that is late reads "Was due" whatever the verb
   * was, because the thing to say then is the same for every kind of deadline.
   */
  dueLabel?: string;
  /**
   * The deadline has passed. Say it explicitly where the record knows — a
   * certificate the department has already chased, an extension granted.
   *
   * Left out, it is DERIVED from `dueAt` against the list's `now`, and without a
   * `now` it is not derived at all. Never from `Date.now()` inside the render:
   * the server and the browser would disagree on the boundary day and React
   * would report a hydration mismatch on a government page.
   */
  overdue?: boolean;
  /** The portal or organisation that raised it — "E-Anudaan". Printed in the meta line. */
  source?: string;
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
  /**
   * The tag on an entry that needs the reader to act.
   * @default "Action Needed"
   */
  actionLabel?: string;
  /**
   * Print the `actionLabel` tag on action-required entries. A caller that already
   * heads the group with the same words turns it off, so it is not said twice.
   * @default true
   */
  showActionTag?: boolean;
  /**
   * Printed before an action's deadline, where the entry does not name its own. An item's
   * `dueLabel` wins, for a list that mixes kinds of deadline.
   * @default "Respond by"
   */
  dueLabel?: string;
  /**
   * Printed before the deadline of an OVERDUE entry, in place of `dueLabel`.
   * @default "Was due"
   */
  overdueDueLabel?: string;
  /**
   * The tag on an entry whose deadline has passed. A word beside an icon, in the
   * error family — never the colour alone (WCAG 1.4.1).
   * @default "Overdue"
   */
  overdueLabel?: string;
  /**
   * What "now" is, for deciding whether a `dueAt` has passed: an ISO string, a
   * timestamp, or a Date. Resolve it ONCE per page — in a server component, or
   * after hydration — and hand the same value to every list on the screen, so a
   * dashboard tile and the notification panel cannot disagree about which items
   * are overdue.
   *
   * Omitted, nothing is derived and only an item's own `overdue` marks one.
   */
  now?: string | number | Date;
  /**
   * The heading element for each day. `h3` suits a page section; a panel that
   * cannot know its nesting level (a popover) passes `"p"`.
   * @default "h3"
   */
  dayHeadingAs?: "h2" | "h3" | "h4" | "p";
  /** The app's router link (`next/link`) for entries with an `href`. Defaults to a plain anchor. */
  linkAs?: React.ElementType;
  className?: string;
}

const TONE_ICON: Record<EventTone, string> = {
  neutral: "history",
  info: "info",
  success: "check_circle",
  warning: "warning",
  danger: "error",
};

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

/**
 * "14 Sep 2026, 12:07 PM". Built from parts rather than `toLocaleString("en-IN")`, which
 * prints "14 Sept 2026, 12:07 pm" — a four-letter month and a lower-case meridiem that no
 * other date on the estate uses (screen QA, 13 Sep 2026).
 */
function stamp(iso: string, withDate: boolean): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return iso;
  const h = date.getHours();
  const time = `${String(h % 12 || 12).padStart(2, "0")}:${String(date.getMinutes()).padStart(2, "0")} ${h < 12 ? "AM" : "PM"}`;
  if (!withDate) return time;
  return `${String(date.getDate()).padStart(2, "0")} ${MONTHS[date.getMonth()]} ${date.getFullYear()}, ${time}`;
}

/**
 * "30 Sep 2026" — built from the same parts as `stamp`, and for the same reason.
 * This one used `toLocaleDateString("en-IN")`, which prints "30 Sept 2026": a
 * four-letter month, so one row of a notification could carry two spellings of a
 * month — the deadline's and the timestamp's.
 */
function dueDate(iso: string): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return iso;
  return `${String(date.getDate()).padStart(2, "0")} ${MONTHS[date.getMonth()]} ${date.getFullYear()}`;
}

/** The item's own claim wins; otherwise the deadline is compared with `now`, when there is one. */
function isOverdue(event: EventItem, nowMs: number | null): boolean {
  if (event.overdue !== undefined) return event.overdue;
  if (nowMs === null || !event.dueAt) return false;
  const due = new Date(event.dueAt).getTime();
  return !Number.isNaN(due) && due < nowMs;
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
 * Five rules it enforces:
 *
 * 1. **A note is never truncated.** On a departmental record the reason an
 *    application was returned is the most important text on the screen, and an
 *    ellipsis in the middle of it is a defect.
 * 2. **Unread is a WORD, not a dot.** A coloured dot is invisible to a screen
 *    reader and to anyone who cannot distinguish it; the row carries a visually
 *    hidden "Unread" as well.
 * 3. **A system action says "System".** An empty actor column reads as missing
 *    data, and on an audit trail that is the worst thing it could read as.
 * 4. **Overdue is a WORD and an ICON.** A deadline that has passed is marked
 *    "Overdue" beside `event_busy` in the error family, never by colour alone,
 *    and the deadline itself changes from "Respond by" to "Was due". It is
 *    derived from `now` — which the page resolves once — or stated by the item.
 * 5. **The empty state is written.** "No activity recorded yet" is the answer to
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
  actionLabel = "Action Needed",
  dueLabel = "Respond by",
  overdueDueLabel = "Was due",
  overdueLabel = "Overdue",
  now,
  showActionTag = true,
  dayHeadingAs: DayHeading = "h3",
  linkAs,
  className,
}: EventListProps): React.JSX.Element {
  const LinkTag = linkAs ?? "a";
  const parsedNow = now === undefined ? Number.NaN : new Date(now).getTime();
  const nowMs = Number.isNaN(parsedNow) ? null : parsedNow;
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
          {group.key ? <DayHeading className="ds-events__day">{group.key}</DayHeading> : null}
          <ol className="ds-events__list" aria-label={group.key ? `${label} — ${group.key}` : label}>
            {group.items.map((event) => {
              const tone = event.tone ?? "neutral";
              const overdue = isOverdue(event, nowMs);
              const body = (
                <>
                  <span className="ds-events__action">{event.action}</span>
                  {event.subject ? <span className="ds-events__subject"> {event.subject}</span> : null}
                </>
              );
              return (
                <li
                  key={event.id}
                  className={cn(
                    "ds-events__item",
                    `ds-events__item--${tone}`,
                    event.actionRequired && "ds-events__item--action",
                    overdue && "ds-events__item--overdue",
                  )}
                >
                  <span className="ds-events__mark" aria-hidden="true">
                    <Icon name={event.icon ?? TONE_ICON[tone]} size={20} />
                  </span>
                  <div className="ds-events__body">
                    <p className="ds-events__line">
                      {event.unread ? <span className="ds-events__sr">{unreadLabel}: </span> : null}
                      {event.href ? (
                        <LinkTag className="ds-events__link" href={event.href}>
                          {body}
                        </LinkTag>
                      ) : (
                        body
                      )}
                    </p>
                    {/* An overdue entry ALWAYS draws this line, even where the caller has turned
                        the Action Needed tag off (the notification panel heads its own section
                        with those words): "Overdue" is not the same fact, and a section heading
                        does not say it. */}
                    {overdue || (event.actionRequired && (showActionTag || event.dueAt)) ? (
                      <p className="ds-events__flag">
                        {/* The library's own chip, as the Figma row instances it — Badge,
                            Warning for the deadline ahead and Danger for the one gone by,
                            not a pill this component draws for itself. */}
                        {overdue ? (
                          <Badge status="danger" size="sm" className="ds-events__tag">
                            <Icon name="event_busy" size={16} aria-hidden />
                            {overdueLabel}
                          </Badge>
                        ) : showActionTag ? (
                          <Badge status="warning" size="sm" className="ds-events__tag">
                            {actionLabel}
                          </Badge>
                        ) : null}
                        {event.dueAt ? (
                          <span className="ds-events__due">
                            {overdue ? overdueDueLabel : event.dueLabel ?? dueLabel}{" "}
                            <time dateTime={event.dueAt}>{dueDate(event.dueAt)}</time>
                          </span>
                        ) : null}
                      </p>
                    ) : null}
                    <p className="ds-events__meta">
                      {event.source ? <span className="ds-events__source">{event.source} · </span> : null}
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
