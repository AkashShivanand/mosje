# E-Anudaan (dev) — defects found during design recon

**Environment:** `https://eanudaan-admin-dev.mosje.in` · `https://eanudaan-user-dev.mosje.in`
**Found:** 12 August 2026
**How:** Signing in as each role from the shared "Portal access — dev and UAT test logins" sheet
and walking every screen reachable from the sidebar. Read-only throughout — no form was
submitted, no application was created or modified, and no workflow action was fired.
**Browsers:** Chrome (headed) and headless Chrome via Playwright, viewport 1440×1000.

Ordered by severity. D1 blocks end-to-end testing of the whole product.

---

## D1 — BLOCKER: the Programme Director console is not implemented

The Programme Director is the **final sanctioning authority** — the last step of the
Grant-in-Aid approval chain. On dev the role signs in successfully but has no working console,
so **no application can be approved end-to-end on this environment.**

**Reproduce**

1. Go to `https://eanudaan-admin-dev.mosje.in/login`
2. Sign in as **`9200000811`** (Programme Director) with the dev password
3. Observe the landing page and the sidebar

**Expected:** a sanction desk listing applications awaiting the PD's YES/NO decision.

**Actual**

| Observation | Detail |
|---|---|
| Lands on | `/dashboard` |
| Main content | **Empty** — the `<main>` element has **0 child nodes** |
| Sidebar | **Three items only:** `NGO Directory`, `Audit Trail`, `Notifications` |
| Sanction desk | **Absent** — nothing in the nav points to `/dashboard/sm2/pd` |
| `/dashboard/sm2/pd` (direct) | Renders an **empty main** |
| `Audit Trail` (sidebar click) | **Redirects to `/dashboard/sm2/pd`** and renders nothing |
| `Notifications` (sidebar click) | **Redirects to `/dashboard/sm2/pd`** and renders nothing |
| `NGO Directory` | ✅ works — 20 rows, full columns |
| Console errors | None, other than D5 below |
| Network | **Zero API calls** on `/dashboard` and `/dashboard/sm2/pd` |

**The zero-API-calls detail is the diagnostic one:** nothing is failing to load or erroring.
No request is made at all, so the route resolves to a component that renders nothing. This is
un-built, not broken-at-runtime.

**Note for whoever triages this:** the same page reliably OOMs *headless* Chrome during login
(`Target page, context or browser has been closed`), surviving a 4 GB JS heap,
`--disable-dev-shm-usage`, and blocking images/media/fonts. That crash is worth a look in its
own right, but it is a separate issue from the missing console — the page is empty, not heavy.

---

## D2 — Dead credential: `9200000032`

Listed in the access sheet as a second PMU Field Officer. Login is **rejected**.

**Reproduce:** sign in at `/login` as `9200000032` with the dev password → stays on `/login`.

**Evidence it is not rate-limiting:** rejected in an initial batch run, again alone ~40 minutes
later, and again after a 5-minute backoff — while other accounts signed in successfully in the
same windows. Either the account is disabled or the credential in the sheet is wrong.

---

## D3 — Mislabelled credential: `9000000033`

The access sheet labels this **"JS – Finance"**. It is not — signing in lands on
`/dashboard/pmu/field` with a sidebar **byte-identical to the PMU Field Officer account**
(`9200000812`).

**Reproduce:** sign in as `9000000033`, compare the landing route and sidebar against
`9200000812`. They match.

**Impact:** there is no JS-Finance account available for testing, and anyone working from the
sheet will believe there is. Either the label or the account's role assignment is wrong.

---

## D4 — Auth endpoint rate-limits without a distinguishable response

Accounts that sign in successfully begin **rejecting valid credentials** after repeated logins,
returning the same "stay on `/login`" outcome as a genuinely bad credential. There is no
distinguishing message, status, or `Retry-After`.

**Reproduce:** sign in and out as several roles in quick succession (~10 logins within a few
minutes). Subsequent attempts with known-good credentials fail. A **5-minute pause** clears it —
`pd-aso`, `ifd-so` and `ifd-ds` all failed and then succeeded unchanged after backoff.

**Impact:** the failure is indistinguishable from a bad password, which is what initially led us
to suspect the credentials in D2. Automated testing against dev needs either a higher threshold
or a distinguishable 429.

---

## D5 — Font Awesome stylesheet blocked by CSP (admin portal)

```
Loading the stylesheet
'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css'
violates the following Content Security Policy directive:
"style-src 'self' 'unsafe-inline' https://fonts.googleapis.com".
Note that 'style-src-elem' was not explicitly set, so 'style-src' is used as a fallback.
The action has been blocked.
```

**Reproduce:** sign in to the admin portal and open the browser console.

The page's own CSP does not allow `cdnjs.cloudflare.com`, so the icon font never loads. Either
add the host to `style-src` or self-host the icon font. Worth checking whether any icons are
silently falling back — we did not audit every screen for this.

---

## D6 — Utilisation Certificate route unreachable

`/ngo/my-applications/:id/uc` returns **"Application not found."** for every id tried, including
a **sanctioned** application — precisely the state a UC should apply to.

**Reproduce**

1. Sign in to the NGO portal as `LGN3712`
2. `My Applications` → filter **Approved** → open `LGCY/85779` (detail URL
   `/ngo/my-applications/77026`) — the detail screen loads correctly
3. Navigate to `/ngo/my-applications/77026/uc`

**Actual:** *"Application not found. / Back to My Applications"*

Suggests the UC route keys off a different identifier from the detail route, or its precondition
is never satisfiable for this account.

---

## D7 — "Online Inspection Meeting" is a stub

`/ngo/my-applications/:id/inspection/meeting` renders **only an `<h1>` reading
"Online Inspection Meeting"** — no body, no controls, no join affordance. Reachable and
non-erroring, but empty.

This is the NGO end of the admin portal's BharatVC online-inspection feature (the IFD review
screen carries a `Schedule BharatVC` action), so the two halves do not currently meet.

---

## D8 — Minor: fields documented as read-only are editable

On the application wizard, step 1, several fields carry helper text reading
*"Read-only — sourced from NGO-Darpan / your login"* (NGO name, NGO-Darpan Unique ID). In the
DOM they are **not** `readOnly` and accept input.

**Reproduce:** NGO portal → `Select Scheme` → SHRESHTA Mode 2 → `Continue` → type into
"Name of NGO / VO".

Either enforce read-only or drop the claim — as it stands, a value the UI says is authoritative
can be overwritten by the applicant.

---

## Observation, not a defect: AI document validation

Worth flagging because it is undocumented anywhere we could find. The NGO application detail
screen shows a **per-document AI verdict** (`AI: pending`, `AI: not valid`) with the model's
reasoning surfaced to the applicant. An observed failure on a PAN upload:

> "This is a list of district nodal officers, not a PAN card. Please upload the organisation's
> PAN card issued by the Income Tax Department. The document does not contain a Permanent
> Account Number (PAN) in the format AAAAA9999A. No Income Tax Department branding or PAN card
> details are present in this document."

Two things worth confirming with the team: whether this verdict is advisory or blocking, and how
it interacts with the officer's own per-document review on the admin side (they are separate
fields on the same document).

---

## Reproducing the capture itself

Everything above came out of `tools/design-audit/projects/e-anudaan/` in the MoSJE repo.

```bash
cd tools/design-audit

# credentials — gitignored, never committed
cp projects/_template/secrets.example.json projects/e-anudaan/secrets.json
# then fill in each role's dev password

python3 engine/run.py --project e-anudaan --phase capture          # all roles
python3 engine/run.py --project e-anudaan --phase capture --role pd-aso   # one role
```

Two per-project drivers cover what the declarative crawl cannot reach:

```bash
cd projects/e-anudaan
python3 capture_review.py pd-aso ifd-aso     # review screens (no nav links to them)
python3 capture_resilient.py programme-director   # per-route isolation for the crashing role
```

Output lands in `projects/e-anudaan/captures/live/` as one full-page PNG plus one
computed-CSS JSON per screen (100 screens, 53 routes, ~44 MB — gitignored).

**If roles start failing to log in, that is D4** — pause 5 minutes and retry, rather than
assuming the credentials are wrong.

The NGO portal's login is CAPTCHA-protected and cannot be automated; a human signs in and the
authenticated session is then driven read-only.

Full screen-by-screen findings:
- `docs/research/eanudaan-admin-dev.mosje.in/INVENTORY.md`
- `docs/research/eanudaan-user-dev.mosje.in/INVENTORY.md`
