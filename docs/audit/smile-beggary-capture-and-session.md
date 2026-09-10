# SMILE — Beggary (admin, DEV): session-on-refresh defect, and what it cost the capture

**Recorded:** 2026-09-10 · **Host:** `https://smile-admin-dev.mosje.in` · **Role:** super-admin
**Belongs here, not on a screen:** this is pipeline and build-behaviour evidence
(`.claude/rules/ui-restraint-and-copy.md` §1). The citizen-facing consequence is written up as a
finding in the QC report; the measurements are here.

---

## 1. The defect: a hard refresh logs the user out on most routes

Press F5 (or open a route in a new tab, or follow a bookmarked deep link) and the admin is
returned to the sign-in page. It is not universal and it is not random — it is a race.

| | |
|---|---|
| Routes tested | 20 |
| Routes where a refresh **ended the session** | **15** |
| Routes that survived a refresh | 5 — `/city-profiling`, `/performance-stats`, `/users`, `/shelter-homes/beneficiaries`, `/fund-monitoring` |
| Cookie dropped | `smile_admin_token` |
| The 401 seen on every load | `GET https://smile-api-auth-dev.mosje.in/api/v1/auth/admin/session/hmac-secret` |

Routes that end the session on refresh:

`/dashboard` · `/roles` · `/permissions` · `/survey-locations` · `/surveyor-mapped` ·
`/beggary-schemes` · `/hotspot-approvals` · `/persons` · `/shelter-homes` ·
`/comprehensive-rehab/skill-training` · `/comprehensive-rehab/data` · `/notifications` ·
`/audit-log` · `/consent` · `/master-setting`

**Reading of the cause.** On a cold load the app fetches its session HMAC secret and, in
parallel, the page's own data. The secret call returns **401**. On a light page the session
validation settles before the data calls need it; on a heavy page it does not, and the app
treats the failure as "signed out" and clears the cookie. That is why the same route is not
reliably reproducible — `/city-profiling` failed in one pass and survived in another — and why
the heaviest route in the product, the landing dashboard, fails most consistently.

**Why it matters beyond the audit.** The landing route is the one an officer is most likely to
bookmark, refresh after a long form, or open in a second tab. Losing the session there costs
unsaved work and reads as an outage. It is written up as a **Blocker** in the QC report.

**Sign-in itself is healthy.** Credentials, the login POST, and in-app navigation all work
normally; a session created by signing in survives indefinitely as long as the document is not
reloaded. This is a page-load bootstrap defect, not an authentication defect.

## 2. What it cost the first capture run, and the gates that now prevent a repeat

The first run wrote **49 screenshots across four roles that were all the sign-in page**, and
reported success. The engine visits the landing route first, so the session died before screen
two and every later route rendered the login view under the name of the screen it should have
been.

Nothing caught it. The height gate passed (`pageH` equalled the PNG height — 1000px on every
screen, which was the giveaway nobody was checking for). The design-vs-live integrity check had
no design frames to compare against yet. And the engine's own `loginMarker` test compares the
**URL**, while this SPA renders its login view without changing the path.

Three gates now run at the end of every capture phase, and a failure exits non-zero so
`analyze`/`report` cannot run on top of bad captures:

| Gate | Fails when |
|---|---|
| `audit_no_login_pages` | a capture's extracted **text** is the login form — text, not URL |
| `audit_capture_integrity` | a live capture is byte-identical to its own design frame (this existed since NMBA r2 but **was never called from anywhere**) |
| `audit_design_frame_width` | a design frame PNG is not 1440px wide — the Figma MCP downscales any frame taller than `maxDimension`, and every crop and pin derived from it is then silently off by that scale factor |

The quarantined evidence is at
`tools/design-audit/projects/smile-admin/captures/_bad-login-pages-2026-09-10/`.

## 3. How this portal is captured now

`live.navMode: "spa"` — navigate by clicking the in-app sidebar anchor, never by reloading,
which is how a person moves through the product and is the only way to hold a session this build
cannot preserve across a document load. Three traps inside that, all fixed in the shared engine:

- a responsive shell renders its nav **twice** (hidden off-canvas copy first), so the click was
  landing on a node with no `offsetParent` and silently degrading back to a reload;
- an anchor under a collapsed group is absent from the DOM, so the groups are expanded and the
  anchor re-sought **before** any reload is considered;
- "navigate to the route you are already on" — the landing route — was itself the poisoning
  reload, and is now skipped.

When a session is lost anyway, the crawl re-authenticates and retries **in-app only**; it never
spends a fresh login on another reload.

**Residual cost:** roughly a third of routes still lose the session once and are recovered by
re-login, which is why a full four-role run takes appreciably longer here than on other portals.
That cost disappears when the refresh defect is fixed.
