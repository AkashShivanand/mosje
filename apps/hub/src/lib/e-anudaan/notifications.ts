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
import { ngoApplications } from "./selectors.ts";
import { ucDue } from "./registers.ts";
import { isReadBy } from "./store/persistence.ts";
import { ROLES, reviewKeyOf } from "./roles.ts";
import type { EAnudaanState, GrantApplication, NotificationEntry, RoleId } from "./types.ts";

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
  if (t.includes("sanctioned") || t.includes("approved") || t.includes("verified")) return "success";
  if (t.includes("rejected")) return "danger";
  if (t.includes("deficiency") || t.includes("returned")) return "warning";
  return "info";
}

/**
 * Where a notice about an application opens: the applicant's own record, or the officer's review
 * screen. A role that reviews nothing (the PMU) has no review screen, so its notices do not link.
 */
function applicationHref(role: RoleId, applicationId: string): string | undefined {
  const id = encodeURIComponent(applicationId);
  if (role === "ngo") return `${BASE}/ngo/my-applications/${id}`;
  const def = ROLES[role];
  const key = def.caps.includes("review") ? reviewKeyOf(def) : null;
  return key ? `${BASE}/dashboard/sm2/${key}/review/${id}` : undefined;
}

/**
 * The body without what the title and subject already say. Bodies are written "Application <id> —
 * <remarks>." and read, under "Application Submitted", as "Application … — Application submitted."
 * (parity inventory §5, §31). The reference moves to the subject; remarks that only repeat the
 * title are dropped.
 */
function noteOf(entry: NotificationEntry): { subject?: string; note?: string } {
  const body = entry.body.replace(/\.{2,}$/, ".");
  const m = /^(Application|Project) (\S+) — (.*)$/.exec(body);
  if (!m) return { note: body };
  const plain = (t: string) => t.toLowerCase().replace(/[^a-z]/g, "");
  const remark = m[3]!.trim();
  return { subject: `${m[1]} ${m[2]}`, note: plain(remark) === plain(entry.title) ? undefined : remark };
}

function updateItem(entry: NotificationEntry, role: RoleId): EventItem {
  return {
    id: entry.id,
    at: entry.at,
    action: entry.title,
    ...noteOf(entry),
    tone: toneFor(entry.title),
    unread: !isReadBy(entry, role),
    href: entry.href ?? (entry.applicationId ? applicationHref(role, entry.applicationId) : undefined),
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
            tone: "warning",
            actionRequired: true,
            href: `${BASE}/ngo/my-applications/deficiencies`,
          } satisfies EventItem;
        })
      : [];

  /* A utilisation certificate due is the other thing that waits on the NGO. Live notifies
     "1st instalment released — UC due" with Open →; ours had a UC form nothing linked to. Derived
     from the file, like the deficiency above, so it clears when the certificate is filed. */
  if (role === "ngo" && state.ngos[0]) {
    for (const app of ucDue(state, state.ngos[0].id)) {
      actions.push({
        id: `uc-${app.id}`,
        at: app.sanction!.sanctionedAt,
        action: "Utilisation certificate due",
        subject: `Project ${app.institutionId} · FY ${app.financialYear}`,
        note: `File the certificate for the grant sanctioned under order ${app.sanction!.orderNo}.`,
        tone: "warning",
        actionRequired: true,
        href: `${BASE}/ngo/my-applications/${encodeURIComponent(app.id)}/uc`,
      } satisfies EventItem);
    }
  }

  /* A "Deficiency raised" update about an application that is still waiting on
     the NGO is the action above, told twice. Keep the action; drop the echo. */
  const waiting = new Set(actions.filter((a) => a.id.startsWith("action-")).map((a) => a.id.replace(/^action-/, "")));
  const updates = state.notifications
    .filter((n) => n.audience.includes(role))
    .filter((n) => !(n.applicationId && waiting.has(n.applicationId) && /deficiency/i.test(n.title)))
    .map((n) => updateItem(n, role));

  const byNewest = (a: EventItem, b: EventItem) => Date.parse(b.at) - Date.parse(a.at);
  return [...actions.sort(byNewest), ...updates.sort(byNewest)];
}
