# UX4G adoption plan

| | |
|---|---|
| **Programme** | MoSJE / DoSJE websites and portals |
| **Prepared by** | Akash Kumar, Designer |
| **Date** | 04 August 2026 |
| **Status** | For review |
| **Deliverable** | The Figma design file |
| **Working against** | UX4G Design System 3.0 (Figma kit) |
| **Companion documents** | `UX4G-Clarification-Questionnaire`, `UX4G-Adoption-Tracker` |

---

## What has been asked

UX4G is now the design standard for all projects under DIC and NeGD. Five things follow:

| # | Direction | Timing |
|---|---|---|
| 1 | UX4G only. No other design system or component library for new work | Immediate |
| 2 | Full transition | Three months |
| 3 | Weekly status report in the prescribed format | From the first week of August |
| 4 | Build missing components to UX4G principles and contribute them back | Ongoing |
| 5 | No parallel or project-specific libraries | Immediate |

We are glad to take this on. The directive also allows teams to raise genuine obstacles within
fifteen days, and we intend to use that window for one point noted below.

---

## Where we are starting from

We are in a better position than a standing start. **Our existing designs were already built on
UX4G 2.0**, so this is a version upgrade rather than a move from an unrelated system. The
foundations, the component thinking and the typeface are already shared.

Two things shape the work from here.

**Component names and structures may have changed between 2.0 and 3.0.** Figma matches components
by name when a library is replaced, so we cannot assume the two versions line up. We will compare
them and build a mapping before touching the library, and rebuild only where the mapping does not
hold. Checking first is the difference between a smooth upgrade and unlinking work that already
exists.

**We have not yet measured how much of our Figma work is built from library components.** Screens
assembled from library components pick up an upgrade almost automatically. Screens with detached or
hand-drawn elements have to be reworked individually. This single measurement affects the timeline
more than anything else, and it is the first thing we will do. We will publish the figure in the
first weekly report rather than commit to a rate we cannot yet evidence.

On the build side, the picture varies by portal. Some already use our shared components heavily,
others hardly at all. The portals with the most to do are also, helpfully, the ones with the least
finished design work, so the order of work below reflects that.

---

## How we plan to do it

### Follow UX4G's own setup

UX4G asks teams to duplicate the Community file, move it into their team project, and publish it as
their own library. We will do that once, and use that single library across every portal.

### Upgrade the library rather than replace it

We will map 2.0 against 3.0 first, then upgrade in place wherever names and structures allow, so
existing screens keep their links and pick up the new styling. Where 3.0 has genuinely restructured
something, we rebuild that component deliberately rather than letting a replacement break the link
silently.

We will test this on one portal before applying it more widely.

### Apply ministry branding through Theme Craft

This fits together more neatly than we first assumed. DBIM asks for one primary colour group built
from a key colour and its variants, with backgrounds and surfaces drawn from a functional palette.
UX4G lets a department apply its own colours through Theme Craft. So UX4G provides the components
and the means to theme them, and DBIM tells us what to theme them to.

On typography the two already agree, since both specify Noto Sans.

The only places they could point in different directions are a few structural rules in DBIM, such
as the footer using the darkest shade of the key colour group, and icons using either the key
colour or white. We have asked about those, and in the meantime we follow DBIM for identity and
UX4G for everything else.

### Build what UX4G does not yet cover

A good share of our work is for officials rather than citizens: dense tables, dashboards, approval
chains, maps and monitoring screens. UX4G 3.0 covers citizen service journeys well, and these sit
outside that scope. We will build them on UX4G's foundations, record each one, and offer them back
under clause 4. We would rather contribute something reusable than solve it only for ourselves.

### The one obstacle we are raising

UX4G ships its web version in a form intended for a different way of building sites than the one
our portals use. Adding it directly would disturb pages that already work. On the build side we
therefore match UX4G's specifications rather than loading its files, and we would like to offer
that work back as a contribution.

We are raising this under clause 2 not to seek an exemption, but because building something useful
seems a better answer than asking to be excused.

---

## What would help to have settled

| By | What | Affects |
|---|---|---|
| 07 Aug | The prescribed weekly reporting format | The first report |
| 18 Aug | Whether a 2.0 to 3.0 mapping already exists | How we upgrade the library |
| 18 Aug | How adoption will be checked, and who confirms it | What we build towards |
| 18 Aug | Whether already-built portals are in scope, or new work only | The size of the job |

Where something is still open on its date, we proceed on the assumption recorded in the
questionnaire and note it in the register. We would rather keep moving and document our reasoning
than pause the work.

---

## Plan by phase

Thirteen weeks, 04 August to 31 October.

**Week 1. Measure and start.** Measure how much of our Figma work uses library components. Send the
questionnaire. Raise the three most useful questions on the Thursday call. File the first weekly
report.

**Weeks 2 to 3. Set up the library.** Duplicate the UX4G 3.0 kit and publish it as our library.
Apply the ministry's key colour group through Theme Craft. Check colour contrast across every
combination. Raise the clause 2 point.

**Weeks 4 to 6. Map and upgrade.** Compare our 2.0 components against 3.0 and write the mapping.
Upgrade the library in place where names allow, rebuild where they do not, and check a sample of
every portal to confirm nothing has become unlinked. Begin building the components UX4G does not
cover.

**Weeks 7 to 11. Work through the portals.** Start with the portal that already uses our shared
components most, so the method is proven before it is applied widely. Then the website, then the
portals with the most to bring across.

**Week 8 is a checkpoint.** If the rate we are actually achieving will not reach the deadline, we
would rather say so then, with figures, than late in October.

**Weeks 12 to 13. Contribute and close.** Package the components we have built and submit them.
Publish the decision register. Final report.

---

## Reporting

What counts as "using UX4G" has not yet been defined, and it is the first thing we have asked
about. Until it is settled we will report the most objective measure we can produce: how closely
our components match UX4G's specifications, measured rather than judged, with the method shared
alongside each report.

The figure will start modest and rise. The trend is the useful part.

---

## The decision register

Every choice we make that differs from UX4G as supplied, and every question that goes unanswered,
is recorded with a date and a reason.

It means that if anyone asks later why something looks the way it does, there is a written answer
rather than a recollection. It is shared with each weekly report so nothing arrives as a surprise.

---

## Risks

| Risk | Likelihood | Impact | What we do about it |
|---|---|---|---|
| Replacing the library unlinks components across our files, because 2.0 and 3.0 names differ | Medium | Very high | Map the versions first, upgrade in place, and test on one portal before going wider |
| Fewer of our Figma screens use library components than hoped | High | High | Measured in week 1, before we commit to a rate |
| What counts as compliant is defined late | Medium | High | Report the most objective measure available and keep the register, so any definition can be evidenced afterwards |
| UX4G has nothing yet for tables, dashboards, charts or maps | High | High | Build on its foundations, record each, offer back |
| A newer UX4G version lands mid-project | Medium | High | Finish against 3.0 and treat the upgrade as separate work |
| Structural DBIM colour rules conflict with UX4G component styling | Low | Medium | Asked in the questionnaire; following DBIM for identity in the meantime |
| Already-approved designs need approving again | Medium | High | Settle it before week 7 |
| The report format differs from what is expected | Medium | High | Ask for the format before 07 August |

---

## Capacity

The plan currently assumes the design work is done by one person. That assumption came from a
conversation about the build rather than the design, so we would like it confirmed before the
timeline is fixed.

The honest position is that the deadline is comfortably reachable if most screens inherit their
styling from the upgraded library, and difficult if a large share have to be reworked individually.
Week 1 tells us which of those we are in, and we will report it either way.

---

## In short

We are adopting UX4G 3.0, building on the 2.0 work already in place.

One thing we would like recorded: the ministry's colour group, applied through UX4G's own theming
tool, as DBIM requires.

One obstacle we raise: UX4G's web version is not currently supplied in a form that suits how our
portals are built. We would like to help close that gap rather than be excused from it.

One thing that would help before we are measured: a definition of what "using UX4G" means, and who
confirms it.
