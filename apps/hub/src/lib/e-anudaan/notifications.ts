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
import { ucDue, ucDueBy } from "./registers.ts";
import { isReadBy } from "./store/persistence.ts";
import { GRADE_FULL, ROLES, reviewKeyOf } from "./roles.ts";
import { openDeficiencyOf, requestedAt } from "./applicant.ts";
import { DEFICIENCY, DIVISION_NAME } from "./glossary.ts";
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

/**
 * Who acted, as the reader should see it. Every notice read "System" (audit N-14), although the
 * audit trail records the seat that acted.
 *
 * An applicant is told the OFFICE, never the officer — the review call was explicit that officer
 * roles are not named to the applicant (T778–823) — so the NGO reads "Programme Division". An
 * officer reads the seat: "Under Secretary, Programme Division". The applicant's own act reads as
 * the organisation.
 */
export function actorFor(state: EAnudaanState, byRole: RoleId, reader: RoleId, ngoId?: string): string | undefined {
  if (byRole === "ngo") return state.ngos.find((n) => n.id === ngoId)?.name;
  const def = ROLES[byRole];
  if (!def) return undefined;
  const division = def.division ? DIVISION_NAME[def.division] : undefined;
  if (reader === "ngo") return division ?? "Ministry of Social Justice and Empowerment";
  if (def.grade) return division ? `${GRADE_FULL[def.grade]}, ${division}` : GRADE_FULL[def.grade];
  return def.label;
}

function updateItem(state: EAnudaanState, entry: NotificationEntry, role: RoleId): EventItem {
  const app = entry.applicationId ? state.applications.find((a) => a.id === entry.applicationId) : undefined;
  // The audit entry this notice was written from: same file, same instant.
  const acted = app ? [...app.audit].reverse().find((e) => e.at === entry.at) : undefined;
  return {
    id: entry.id,
    at: entry.at,
    action: entry.title,
    actor: acted ? actorFor(state, acted.byRole, role, app?.ngoId) : undefined,
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
          const open = openDeficiencyOf(app) ?? app.deficiencies[app.deficiencies.length - 1];
          return {
            id: `action-${app.id}`,
            // When the applicant was ASKED — `requestedAt`, the expression Pending Actions and the
            // application page read. `raisedAt` is when the ASO noted it inside the Ministry, and
            // printed 07 Aug here beside 10 Aug on those two screens (audit N-03).
            at: open ? requestedAt(app, open) : app.updatedAt,
            action: DEFICIENCY.raised,
            actor: open ? actorFor(state, open.communicatedBy ?? open.raisedBy, role, app.ngoId) : undefined,
            subject: `Application ${app.id}`,
            // Only where the Ministry recorded one: the response period is not published anywhere
            // we hold, and a deadline with no source does not go on a citizen's page.
            dueAt: open?.respondBy,
            // What the Section Officer sent. `detail` is the ASO's internal note and stays inside
            // the Ministry (types.ts); it was being printed to the applicant.
            note: open?.message,
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
        action: "Utilisation Certificate Due",
        actor: DIVISION_NAME.pd,
        // GFR 12-A: twelve months from the close of the year the grant was released for.
        dueAt: ucDueBy(app),
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
    .map((n) => updateItem(state, n, role));

  const byNewest = (a: EventItem, b: EventItem) => Date.parse(b.at) - Date.parse(a.at);
  /* Action items are sorted by WHEN THEY MUST BE ANSWERED, soonest first, so the most overdue is at
     the top: a utilisation certificate due last March used to sit below a deficiency raised
     yesterday, and both looked equally urgent (audit N-14). An item with no recorded due date is
     ranked by the date the Ministry asked, which is when its clock started. Updates stay
     newest-first: nothing is owed on them. */
  const clock = (e: EventItem) => Date.parse(e.dueAt ?? e.at);
  const bySoonestDue = (a: EventItem, b: EventItem) => clock(a) - clock(b) || Date.parse(a.at) - Date.parse(b.at);
  return [...actions.sort(bySoonestDue), ...updates.sort(byNewest)];
}
