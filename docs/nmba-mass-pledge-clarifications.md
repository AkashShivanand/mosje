# NMBA Mass Pledge Reporting — clarifications and working assumptions

**Module:** National Pledge Against Drug Abuse reporting, 18 August 2026
**Source requirement:** "NMBA Mass Pledge Reporting Form (18 August 2026 Only)" (DoSJE)
**Status:** built to the resolutions below · awaiting Ministry confirmation
**Last updated:** 21 July 2026

---

## How to read this

The source requirement specifies the five reporting forms field by field, but leaves
a number of questions open. Rather than stop, each was resolved to what we judged the
correct answer and the module was built to that resolution.

Every item below is a decision the Ministry can confirm or overturn. Each is isolated
in the code so that reversing one is a change of value, not a rebuild.

**This document is the only place these assumptions appear.** They are deliberately
kept out of the product interface: an officer filing a report on the day should see a
form, not a commentary on the requirement.

---

## A1 · Youth, Women and Others overlap, but Total is their sum

**Open question.** The form defines Total as the auto-sum of Youth, Women and Others.
As written a 22-year-old woman belongs to two of those buckets, so every reported total
would be inflated.

**Built to.** The three are redefined as a true partition, so the arithmetic is valid:

| Bucket | Definition |
|---|---|
| Youth | Participants under 30, any gender |
| Women | Female participants aged 30 and above |
| Others | Everyone else — males 30 and above, and any other gender 30 and above |

Total is computed and read-only. The definitions appear as helper text under each field.

**Why.** This is the smallest change that makes the sum correct. The alternative is to
capture gender and age band separately and derive both figures, which is more accurate
but departs further from the form the Ministry specified.

**If overturned.** Change the three definitions in `COUNT_HINTS` and the partition rule;
the total is derived, so nothing else moves.

---

## A2 · The same event could be counted twice

**Open question.** Form 1 asks a State/District/Block to name its **Coordinating Line
Ministry**. Form 2 asks that same Ministry to report its own events. A pledge event in
one district coordinated by, say, the Ministry of Education would be reported once by
the State and once by the Ministry — counted twice in the national figure.

**Built to.** The Coordinating Ministry field is **attribution only**. It never creates
a figure on that ministry's own total. Form 2 is exclusively for events a Ministry
organised itself. The dashboard shows ministry attribution as a separate view, labelled
as already counted in the State rollup.

**Why.** Without this the headline national number is inflated by every co-ordinated event.

---

## A3 · Whether tier figures are additive

**Open question.** Can Block, District and State figures be added together?

**Built to.** Yes. Each tier reports only the events it organised directly, so the
national total is the sum of all tiers plus the four organisation forms.

**Why.** The requirement gives three entry points into the approval chain, which implies
per-entity reporting rather than a district figure that already contains its blocks.

---

## A4 · What a "geo-tagged" photograph must prove

**Open question.** The requirement asks for geo-tagged photographs but does not say what
the geo-tag must be, or what happens when it is absent.

**Built to.** Coordinates come from the photograph's own EXIF GPS tag when present,
otherwise from the device's location at the moment of upload. A photograph that yields
neither is still accepted, flagged, and shown to the approving officer to judge.

**Why.** Photographs forwarded through WhatsApp or Telegram lose EXIF entirely, and that
is how field evidence actually moves. Requiring EXIF would reject a large share of
genuine submissions on the day. Hard-blocking on location would strand any officer who
declines the browser's location prompt.

---

## A5 · Whether 10 MB is per photograph or per submission

**Open question.** The requirement lists "Minimum: 1, Maximum: 4 JPEG/PNG; SIZE - 10MB".

**Built to.** Per photograph. One to four photographs, JPEG or PNG, up to 10 MB each.

**Why.** The size sits alongside the per-file format, so per-file is the natural reading
and the more generous one for reporters.

**Note.** Photographs are re-encoded on upload to a view copy and a thumbnail. Originals
are not retained.

---

## A6 · Routing when the coordinating agency is not SJE

**Open question.** The approval workflow is scoped in the requirement to "the case of the
coordinating agency being SJE". It does not say what happens otherwise.

**Built to.** Routing is identical regardless of coordinating ministry:
Block → District → State, with entry at any tier. The ministry named does not alter the chain.

**Why.** The chain reflects administrative hierarchy, not which ministry sponsored the
event. A separate route per ministry would need a parallel approver set that does not exist.

---

## A7 · There is no rejection path

**Open question.** The workflow shows only forward approvals. An approver's only options
would be to accept a figure they believe is wrong, or leave it pending forever — which
silently zeroes that block's participation.

**Built to.** Approvers can **Approve** or **Return with remarks**. Remarks are mandatory
on a return. Returned reports become editable by the submitting officer and re-enter the
chain at the same tier. Every transition is recorded with actor, role, time and remarks.
Figures still in the chain are excluded from published totals and shown separately.

---

## A8 · Forms 2 to 5 sit outside the approval chain

**Open question.** Line Ministries, Spiritual Organisations, Higher Education Institutions
and GIAs have no approver above them. Do their figures publish unverified?

**Built to.** They publish on submission, tagged **Self-declared**. Chain-approved figures
are tagged **Verified**. Both appear, always distinguishable, and are never merged into a
single headline number.

**Why.** Excluding them understates national participation; blending them overstates its
reliability. Labelling preserves both.

---

## A9 · Authentication, and how many block logins are needed

**Open question.** The requirement resolves identity "as per login" for Forms 1 and 5 but
draws Forms 2–4 as open dropdowns, and notes that block credentials "are to be created".

**Built to.** All five forms sit behind login. Each non-geographic reporter gets one
pre-provisioned account, and **the organisation name is resolved from that account rather
than chosen from a dropdown**. The reporting officer's mobile is verified by one-time code
at submission. One report per account per event date.

**Why.** An unauthenticated form feeding a public national counter on a high-visibility
day is trivially spammable. Keeping a free dropdown on top of a login is worse than either
alone: an account could file under any other organisation's name, and because each name
looked like a different reporter, one credential could publish an unlimited number of
figures attributed to organisations that never signed in.

**Open operational item.** Provisioning roughly 7,000 block logins from the LGD directory
is a programme of work in its own right and needs its own decision.

---

## A10 · Whether 18 August is the event date or the reporting deadline

**Open question.** The requirement is titled "18 August 2026 Only" and pre-fills the date,
but does not say whether reporting closes the same day.

**Built to (revised 21 July 2026).** The reporting form is available **on 18 August 2026
only**, Indian local time. Before and after that date every role sees a read-only view of
what has been reported. The event date on the form is fixed and cannot be edited.

**Revision note.** This was initially built with a 18–25 August submission window, on the
reasoning that field reporting rarely completes same-day. The Ministry side has since
specified a single day, and the module now enforces that.

**Consequence to be aware of.** Any district that cannot report on the day — connectivity
failure, staff absence — has no route to submit afterwards, and its participation will be
absent from the national figure rather than late. If that risk is unacceptable, the
remedy is either a short grace period or an offline channel with back-entry by the State.

---

## A11 · Three lists were referenced but never supplied

**Open question.** The requirement refers to a Line Ministry list, "08 orgs" of spiritual
organisations, and a Higher Education Institution list. None were attached.

**Built to.**

| List | Status |
|---|---|
| Line Ministries | Real, from the public Government of India allocation of business |
| Higher Education Institutions | Real but partial — central universities and national institutes |
| Spiritual Organisations | **Placeholder.** Eight organisations with a public record of social service work, used so the form is testable |

All three live in one file and are replaced wholesale on confirmation.

**Why the placeholder is marked.** Naming eight organisations as the Ministry's roster,
without saying so, would misrepresent a decision that has not been taken.

---

## Data coverage in the current build

Block master data is a curated subset, not the LGD directory: **484 blocks across 54
districts in 18 States/UTs**. LGD lists roughly 7,000 blocks nationally.

Separately, the district master that predates this module covers 18 of the 36 States/UTs,
so the remaining States/UTs have no districts and therefore no blocks. Importing LGD in
full replaces both and is a mechanical swap.

---

## Summary for sign-off

| # | Question | Resolution | Confirm / Overturn |
|---|---|---|---|
| A1 | Overlapping participant buckets | Redefined as a true partition | |
| A2 | Same event counted twice | Coordinating ministry is attribution only | |
| A3 | Are tier figures additive | Yes — each tier reports its own events | |
| A4 | What "geo-tagged" must prove | EXIF, else device location, else flagged | |
| A5 | 10 MB per photo or total | Per photograph | |
| A6 | Routing when coordinator is not SJE | Chain is unchanged | |
| A7 | No rejection path | Return with mandatory remarks, then resubmit | |
| A8 | Forms 2–5 unverified | Published as Self-declared, never merged | |
| A9 | Authentication and block logins | Login-resolved identity, OTP, one report per account | |
| A10 | Event date or reporting deadline | **Form open on 18 August only** | |
| A11 | Three missing lists | Two real, spiritual organisations placeholder | |
