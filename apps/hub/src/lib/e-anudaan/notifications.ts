/**
 * E-Anudaan's notifications, in the design system's shape — the ONE selector the
 * masthead bell, both notifications pages and the dashboard read.
 *
 * What counts as a notification is defined estate-wide in
 * `docs/specs/notification-object.md`. For this portal that means:
 *
 * - **Action needed (NGO only).** An application in `DeficiencyRaised`. Derived
 *   from the application, not from the notification feed, so it clears when the
 *   NGO responds — reading it does not clear it. The expression is the same one
 *   the NGO dashboard's "Needs Action" card uses, so the two cannot disagree.
 * - **Updates.** `state.notifications` for the signed-in role.
 * - **Not included: the officer's queue.** An officer's files awaiting action
 *   already have a count on the dashboard; a bell repeating it would be a second
 *   answer to the same question.
 */
import type { EventItem, EventTone } from "@mosje/design-system";
import { ngoApplications } from "./selectors";
import type { EAnudaanState, GrantApplication, NotificationEntry, RoleId } from "./types";

const BASE = "/portals/e-anudaan";

/** Applications waiting on the NGO. The dashboard's "Needs Action" count reads this too. */
export function ngoActionApplications(state: EAnudaanState): GrantApplication[] {
  const ngo = state.ngos[0];
  return ngo ? ngoApplications(state, ngo.id).filter((a) => a.status === "DeficiencyRaised") : [];
}

/** The notifications page for a role — the bell's `href`. */
export function notificationsHref(role: RoleId): string {
  return role === "ngo" ? `${BASE}/ngo/notifications` : `${BASE}/dashboard/notifications`;
}

function toneFor(title: string): EventTone {
  const t = title.toLowerCase();
  if (t.includes("sanctioned")) return "success";
  if (t.includes("rejected")) return "danger";
  if (t.includes("deficiency") || t.includes("returned")) return "warning";
  return "info";
}

function updateItem(entry: NotificationEntry, role: RoleId): EventItem {
  return {
    id: entry.id,
    at: entry.at,
    action: entry.title,
    /* Seeded bodies end "remarks." + "." — print one full stop. */
    note: entry.body.replace(/\.{2,}$/, "."),
    actor: "E-Anudaan",
    tone: toneFor(entry.title),
    unread: !entry.read,
    href:
      role === "ngo" && entry.applicationId
        ? `${BASE}/ngo/my-applications/${encodeURIComponent(entry.applicationId)}`
        : undefined,
  };
}

/** Newest first: action-required entries, then this role's updates. */
export function notificationItems(state: EAnudaanState, role: RoleId | null): EventItem[] {
  if (!role) return [];

  const actions: EventItem[] =
    role === "ngo"
      ? ngoActionApplications(state).map((app) => {
          const open = app.deficiencies.find((d) => !d.respondedAt) ?? app.deficiencies[app.deficiencies.length - 1];
          return {
            id: `action-${app.id}`,
            at: open?.raisedAt ?? app.updatedAt,
            action: "Deficiency response requested",
            subject: `Application ${app.id}`,
            note: open?.detail,
            actor: "E-Anudaan",
            tone: "warning",
            actionRequired: true,
            href: `${BASE}/ngo/my-applications/deficiencies`,
          } satisfies EventItem;
        })
      : [];

  /* A "Deficiency raised" update about an application that is still waiting on
     the NGO is the action above, told twice. Keep the action; drop the echo. */
  const waiting = new Set(actions.map((a) => a.id.replace(/^action-/, "")));
  const updates = state.notifications
    .filter((n) => n.audience.includes(role))
    .filter((n) => !(n.applicationId && waiting.has(n.applicationId) && /deficiency/i.test(n.title)))
    .map((n) => updateItem(n, role));

  const byNewest = (a: EventItem, b: EventItem) => Date.parse(b.at) - Date.parse(a.at);
  return [...actions.sort(byNewest), ...updates.sort(byNewest)];
}
