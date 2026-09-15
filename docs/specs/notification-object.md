# What a Notification Is on This Estate

> Status: adopted 2026-09-15. Owner: SAMAVESH design system (`@mosje/design-system`).
> Pilot: E-Anudaan. Decided by a council review of the navbar-bell proposal; the
> reasoning is in the PR that introduced `NotificationBell`.

Written **before** the bell, because the word was already doing three different
jobs on the estate and a bell would have fused them.

## 1. Three things share the word. Only one is a notification.

| Thing | Example | What it is | Where it lives |
|---|---|---|---|
| **Update** | "Application sanctioned" · "Deficiency raised" | Something that happened to *this reader's* business | **The bell**, and the portal's notifications page |
| **Task** | "6 applications awaiting my action" | Work the reader's *role* owns | The **work queue** — the dashboard and the sidebar counts. Never the bell. |
| **Broadcast** | SMILE-Admin's message to 12,420 surveyors | Something an administrator **sends** | A sending tool, named **Broadcasts**, never "Notifications" |

**The SMILE-Admin example in the first proposal was wrong.** Its "Notifications"
page is a sending tool. It is renamed **Broadcasts** so the estate has one meaning
for one word. A broadcast becomes an *update* in each recipient's bell once
recipients have portal accounts; the sending tool never shows a bell count.

## 2. The object

A notification is an `EventItem` (`packages/design-system/components/data-display/event-list.tsx`) —
the same object the audit log and comment thread use, so a notification and the
same event on the case read identically. Three fields were added for it:

| Field | Type | Meaning |
|---|---|---|
| `id`, `at`, `action`, `subject`, `actor`, `actorRole`, `note`, `tone`, `href` | existing | unchanged |
| `unread` | `boolean` | Not yet opened. Cleared by reading, or by "Mark updates as read". |
| **`actionRequired`** | `boolean` | The reader must **do** something (answer a deficiency, upload a document). **Derived from the live record, never stored as a flag.** It clears when the record no longer needs the action — never by reading. |
| **`dueAt`** | ISO string | The deadline for that action, when the department sets one. Printed as "Respond by 30 Sep 2026". |
| **`source`** | `string` | The portal or organisation that raised it — "E-Anudaan", "NOS". Printed in the meta line. Prepares a cross-portal inbox; one portal may leave it out. |

## 3. Rules

1. **The count is one expression.** `notificationCount(items)` — action-required
   items plus unread updates — is exported from the design system. The bell, the
   notifications page and anything else that prints a count call it. Two surfaces
   computing their own count is the defect `data-state-completeness.md` §2 names.
2. **Action-required items cannot be dismissed.** "Mark all as read" is labelled
   **"Mark updates as read"** and does not touch them. They sit at the top of the
   panel under "Action Needed" until the record changes.
3. **Tasks stay out.** An officer's queue already has a count on the dashboard; a
   bell repeating it would be a second, disagreeable answer to the same question.
4. **One door.** Where a portal shows the bell, the sidebar "Notifications" item
   and any account-menu "Notifications" item are removed. The page still exists;
   the bell's "View All Notifications" and the phone tap lead to it.
5. **No feed, no bell.** `SiteHeader` renders the bell only when a portal passes a
   `notifications` object with an `href` to a real notifications page. It is off by
   default for all twenty portals.
6. **Every state is designed.** Loading (no count, `aria-busy`), error (a warning
   mark on the bell, "Try again" in the panel), empty ("Nothing new. You are up to
   date."), populated, too many (newest six in the panel, the rest one link away).

## 4. Who a bell does not reach, and what reaches them

A citizen or NGO who signs in twice a year is not on the page when their
application is returned; SMS and email reach them. When they do sign in, a
**Since Your Last Visit** summary on the landing screen states what changed, built
from the same items and the same `notificationCount`. The bell is for the reader
who is already here.

## 5. Not decided here

- **Ownership across portals.** Each portal emits its own items today. A shared
  store that one portal writes and another reads (an NOS release shown to an
  E-Anudaan NGO) needs an owner, a schema version and a rollback path. Recorded,
  not built.
- **Who writes a notification.** Updates in the pilot derive from the audit trail,
  so no officer authors one. Portals whose events are not already audited need that
  decision before they get a bell.
- **Route guard.** On a phone the bell is a link. The design system does not own the
  router (`screen-templates.md` §4), so a portal with unsaved-form protection passes
  `onNavigate` and cancels there. E-Anudaan has no route guard today.
