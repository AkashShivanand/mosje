# Design and build sync

| | |
|---|---|
| **Prepared by** | Akash Kumar, Designer |
| **Date** | 05 August 2026 |
| **Status** | Working plan |
| **Runs with** | UX4G adoption plan — same pass, not a separate exercise |

---

## The problem

Some modules were designed by business analysts without the design team involved. Those modules
were then built. So for that part of the estate there is no design file worth calling a source of
truth, the screens were never reviewed, and whatever the BAs produced exists in mixed formats or
not at all.

The result is that design and build have drifted apart in a way we cannot see module by module.

## What we are doing about it

Three things at once, in a single pass:

1. Work out which modules were done without us.
2. Bring those modules up to design-team standard, redesigning them properly.
3. Rebuild them in Figma on UX4G 3.0, so the design file becomes the source of truth.

The important decision is that this is **not a separate project from the UX4G move**. Every one of
these modules has to be opened for UX4G regardless. Opening them once and doing both is
considerably cheaper than doing UX4G now and redesign later, and it avoids asking the build team to
absorb two rounds of change.

---

## The one risk worth naming upfront

Redesigning properly means the scope of each module is unknown until it is opened. That is
genuinely different from re-theming, where the work is predictable.

The plan handles this with a triage step in stage 3. Not every screen needs the same treatment, and
sorting them honestly is what keeps the work bounded. Without that step, "redesign as we go" grows
without limit and collides with the transition deadline.

---

## Stage 1 — Find out what we are dealing with

*Weeks 1 to 2, alongside the UX4G setup work*

We cannot sync what we have not identified, and we do not currently have a reliable list.

**Build a module register.** Every module across every portal, with one of four labels:

- Design-team led — we designed it, a Figma source exists
- BA led — designed outside the design team
- Mixed — parts of both
- Unknown — needs checking

**How to classify without guessing.** Three signals, in order of reliability:

1. Does a Figma frame for it exist in our own file? If yes, design-team led.
2. Is there a handoff document or spec in the repository? Those live in known folders and are quick
   to check.
3. Ask the BA or the developer who built it. Fastest for anything the first two leave unresolved.

**Collect whatever the BAs produced**, in whatever form it exists. Some of it appears to have been
generated with AI assistance, so it may be working HTML, written specifications, or screen
descriptions rather than design files. All of it is useful as a record of intent, even where it is
not usable as design. Where nothing survives, the running application is the only record, and stage
2 covers that.

**Output:** a module register with a label, an artefact link, and a note on what is missing.

---

## Stage 2 — Capture what is actually built

*Weeks 2 to 3*

For BA-led modules the built screens are the real specification, so we record them properly before
changing anything.

We already run a capture tool for design QC that logs in as each role, walks the screens, and
records both the rendered screen and its underlying styling. Most portals are already set up in it.
Extending it to cover the BA-led modules is a configuration change rather than new work, which is
why this stage is short.

Interactive states matter here and are easy to miss: form validation, empty states, loading, error
messages, modals, multi-step flows. These are exactly the states BA-led modules tend to leave
undefined, and they are the states we will have to design.

**Output:** a complete visual record of every BA-led screen and state, per role.

---

## Stage 3 — Triage

*Week 3. This is the stage that controls the size of everything after it.*

Every captured screen is sorted into one of three tiers. The tier decides how much work it gets.

**Tier 1 — Bring onto UX4G, no redesign.** The structure is sound, the flow works, the hierarchy is
sensible. It needs UX4G components and nothing else. Expect most screens to land here.

**Tier 2 — Targeted fix.** Broadly workable but with specific problems: a confusing form layout, a
weak hierarchy, an unnecessary step, a missing state. We redesign those parts and leave the rest.

**Tier 3 — Full redesign.** The flow itself is wrong, or it cannot be made accessible, or UX4G has
an established pattern that supersedes it entirely.

**What we judge each screen against**, so the tier is a finding rather than an opinion:

- Can the user finish the task without getting stuck?
- Is the most important thing on the screen the most prominent thing?
- Does it meet the accessibility standard we hold everything else to?
- Does it behave like the rest of the estate, or does it invent its own conventions?
- Does UX4G already have a pattern for this?

**Output:** every screen with a tier and a written reason. This is both the scope estimate and the
answer when someone asks later why a module took the time it did.

---

## Stage 4 — Redesign and rebuild in Figma

*Weeks 4 to 11, module by module*

Each module is rebuilt in Figma using UX4G 3.0 components, applying its triage tier. UX4G adoption
and redesign happen in the same sitting.

**Sequence the modules to match the UX4G portal order**, so no portal is opened twice. Where a
portal contains both design-team-led and BA-led modules, do them together. This is the single
biggest saving in the plan and it costs nothing but scheduling.

Where a module has genuinely no surviving artefact and the built version is poor, treat it as new
design work and size it separately rather than pretending it is a sync.

---

## Stage 5 — Hand back and close the loop

*Ongoing from week 5*

Once a module is rebuilt, the Figma file becomes the source of truth for it and the build is
brought into line. The same capture tool then verifies the match, so the check is mechanical rather
than a reading of two screens side by side.

Redesigned screens will create build work the development team has not planned for. Flag each one
as soon as its tier is set, not when the design is finished, so it can be scheduled rather than
absorbed.

**Re-approval.** Tier 2 and tier 3 screens change what stakeholders have already seen and in some
cases signed off. Agree the rule before we start: our proposal is that tier 1 needs no further
approval, tier 2 is shown for information, and tier 3 goes back for sign-off.

---

## Stage 6 — Stop it happening again

*Week 2, and it is cheap*

The reason this work exists is that modules reached build without a design checkpoint. Three small
changes prevent a repeat, and none of them slow the BAs down:

- Every module carries a field recording whether it is design-led or BA-led. Visible from the start,
  not discovered afterwards.
- One short design review before a module goes to build. A checkpoint, not a gate.
- Give the BAs the UX4G kit and a short starter guide. If they are going to sketch flows, and they
  will, it is far better that they sketch in the right components. That turns their early work into
  something we can build on rather than something we have to undo.

The third point matters most. BAs drafting screens is not the problem. Drafting them in a vacuum is.

---

## Why this is efficient

Four things do the work:

**One pass instead of two.** These modules must be opened for UX4G anyway. Redesigning at the same
time avoids a second round of change for both teams.

**The capture tooling already exists.** Discovery and verification reuse the design QC engine rather
than being done by hand.

**Triage means most screens are cheap.** Only tier 3 is genuinely expensive, and it should be a
minority. Sorting honestly is what makes "redesign properly" affordable.

**Scheduling by portal, not by module.** Each portal gets opened once.

---

## Reporting

Two figures each week, kept separate so neither hides the other:

- How much of the estate is on UX4G
- How much of the BA-led work has been brought up to standard

Alongside them, the tier mix. If tier 3 turns out to be a much larger share than expected, that is
the early signal that the scope has grown, and it is better raised in week 4 than in October.

---

## What we need to get started

- Confirmation of the redesign approach and the re-approval rule in stage 5
- Names of who to ask when a module's origin is unclear
- Whatever BA artefacts can be gathered, in any format
- Agreement that tier 3 modules are sized separately rather than absorbed into the transition
