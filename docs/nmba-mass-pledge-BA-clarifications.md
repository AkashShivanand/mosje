# NMBA Mass Pledge Reporting — points requiring confirmation

**To:** Business Analyst / DoSJE
**Re:** "NMBA Mass Pledge Reporting Form (18 August 2026 Only)"
**Date:** 21 July 2026 · **Event date:** 18 August 2026 · **Working days remaining:** 28

---

## Summary

The module is built and working. To keep to the 18 August date we resolved each open
point ourselves and built to that resolution, rather than waiting.

Everything below is a decision that belongs to the Ministry. Please confirm or correct.
**If we do not hear back, we will ship what is described in the "We have assumed" column.**

Three items are hard blockers — we cannot finalise without them. They are marked **BLOCKER**.

---

## A. Blockers — we need these to finish

### 1. The Line Ministry / Department list — **BLOCKER**
The form specifies a dropdown "as per the list". No list was attached.

*We have assumed:* the published Government of India allocation-of-business list of Union
Ministries, with MoSJE pinned to the top as the form requires.

**Please send:** the definitive list, or confirm ours is acceptable.

---

### 2. The eight Spiritual Organisations — **BLOCKER**
The form specifies "Drop-down (of 08 orgs)". The eight were never named.

*We have assumed:* eight placeholder organisations, clearly labelled in the interface as
provisional, purely so the form could be tested.

**Please send:** the eight organisations the Ministry intends to include. We are not
willing to present an invented list as the Ministry's roster.

---

### 3. The Higher Education Institution list — **BLOCKER**
The form specifies a dropdown "as per the list". No list was attached.

*We have assumed:* a partial list of central universities and national institutes.

**Please send:** the definitive list, or confirm whether it should be drawn from AISHE.

---

## B. Decisions that change the reported numbers

### 4. Youth, Women and Others overlap — the Total is currently wrong as specified
The form defines **Total = Youth + Women + Others**. As written, a 22-year-old woman
belongs in both "Youth" and "Women", so she is counted twice. Every reported total would
be inflated, including the national figure.

*We have assumed* the three are meant to be mutually exclusive, and defined them as:

| Category | Definition used |
|---|---|
| Youth | Participants under 30, any gender |
| Women | Female participants aged 30 and above |
| Others | Everyone else (males 30+, any other gender 30+) |

**Please confirm** these definitions, or tell us the intended split. Note that under our
definition "Women" excludes women under 30, which some reviewers may find counter-intuitive.

---

### 5. The same event could be counted twice
A State reports its event on Form 1 and names a **Coordinating Line Ministry**. That same
Ministry reports its own events on Form 2. Without a rule, one event coordinated by, say,
the Ministry of Education is counted once by the State and once by the Ministry.

*We have assumed:* the Coordinating Ministry field is **attribution only** and never adds
to that ministry's own total. Form 2 is only for events a Ministry organised itself.

**Please confirm.** If ministries are expected to also report State-coordinated events, the
national total will need a de-duplication rule.

---

### 6. Are tier figures additive?
*We have assumed* each tier (Block, District, State) reports only the events it organised
directly, so the national total is the sum of all tiers.

**Please confirm** a District figure does not already include its Blocks.

---

### 7. Unverified figures published alongside verified ones
Forms 2 to 5 (Ministries, Spiritual Organisations, Institutions, GIAs) have no approver
above them, so nothing checks them.

*We have assumed:* they publish immediately, labelled **Self-declared**, and are shown
separately from **Verified** figures that passed the State approval chain. The two are
never added into a single headline number.

**Please confirm** this is acceptable for a figure that may be quoted publicly.

---

## C. Process and workflow

### 8. There is no rejection path in the specified workflow
The workflow shows only forward approvals. As specified, an approver who believes a figure
is wrong can only accept it or leave it pending forever — which silently removes that
block's participation from the count.

*We have assumed:* approvers can **Approve** or **Return with remarks** (remarks mandatory).
Returned reports become editable and re-enter at the same tier. Every step is recorded.

**Please confirm** the return route is acceptable, and who may use it.

---

### 9. What happens when the coordinating agency is not SJE
The workflow is scoped in the document to "the case of the coordinating agency being SJE".
It does not say what happens otherwise.

*We have assumed:* the route is unchanged — Block → District → State — whichever ministry
coordinated the event.

**Please confirm.**

---

### 10. Reporting is open on 18 August only — please confirm the risk is accepted
Per your latest instruction, the form is available **on 18 August only** (Indian time).
Before and after that date, all roles see a read-only view of what was reported.

**Consequence we need acknowledged:** any district that cannot report on the day — network
failure, staff absence, local disruption — has **no route to submit afterwards**. Its
participation will be absent from the national figure rather than late.

**Please confirm** this is accepted. If not, the options are a short grace period (we had
originally assumed 18–25 August), or letting the State enter figures on a district's behalf
afterwards.

---

## D. Access and identity

### 11. How Ministries, Spiritual Organisations and Institutions sign in
The form shows these three as open dropdowns, which implies no login. Forms 1 and 5 resolve
identity "as per login".

*We have assumed:* all five forms sit behind a login, each organisation gets one
pre-provisioned account, and **the organisation name comes from the account rather than a
dropdown**.

**Why this matters:** a login plus a free dropdown is worse than either alone. During
testing we confirmed that combination would let one account file under any other
organisation's name, any number of times, with the figures published to the public counter.
Resolving the name from the account closes that.

**Please confirm**, and tell us who owns issuing these accounts.

---

### 12. Block logins — roughly 7,000 of them
The document notes "Login credentials for all blocks (as per LGD) are to be created".

**Please confirm:**
- Should accounts be created for **all** LGD blocks, or only participating ones?
- Who issues and distributes them, and by when?
- Is there an existing LGD-linked user directory we should draw from, or do we build one?

This is an operational programme, not a development task, and it is the largest unresolved
risk to the 18 August date.

---

### 13. Mobile number verification
*We have assumed:* the reporting officer's mobile is verified by one-time code before a
report can be submitted, and one report is allowed per account per event date.

**Please confirm**, and tell us which SMS gateway to use.

---

## E. Evidence and file handling

### 14. What must a "geo-tagged" photograph prove?
The form requires geo-tagged photographs but does not define what the geo-tag must be, or
what happens when it is missing.

*We have assumed:* location is taken from the photograph's own GPS data when present,
otherwise from the device at the moment of upload. Photographs with neither are **still
accepted**, flagged, and shown to the approving officer to judge.

**Why:** photographs forwarded over WhatsApp lose their GPS data entirely, and that is how
field evidence actually travels. Rejecting them would turn away a large share of genuine
reports on the day.

**Please confirm** we should not reject photographs for a missing geo-tag.

---

### 15. Is 10 MB per photograph or per submission?
*We have assumed:* per photograph — one to four photographs, JPEG or PNG, up to 10 MB each.

**Please confirm.** Note that photographs are automatically compressed on upload; originals
are not retained.

---

## Response tracker

| # | Item | Blocker | Confirm / Correct |
|---|---|:---:|---|
| 1 | Line Ministry list | ● | |
| 2 | Eight Spiritual Organisations | ● | |
| 3 | Higher Education Institution list | ● | |
| 4 | Youth / Women / Others definitions | | |
| 5 | Coordinating ministry double-count rule | | |
| 6 | Tier figures additive | | |
| 7 | Self-declared figures published | | |
| 8 | Return-with-remarks route | | |
| 9 | Routing when coordinator is not SJE | | |
| 10 | Single-day window — risk accepted | | |
| 11 | Organisation login and identity | | |
| 12 | ~7,000 block logins — ownership and timing | | |
| 13 | Mobile OTP and SMS gateway | | |
| 14 | Definition of "geo-tagged" | | |
| 15 | 10 MB per photo or per submission | | |

---

**Most urgent:** items 1–3 (the missing lists) and item 12 (block logins), because they
have external dependencies and the longest lead time.
