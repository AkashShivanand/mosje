# Standards precedence — quality first, then DBIM, GIGW, UX4G

**The order of authority, highest first:**

1. **Current design-craft standards.** What a well-made, modern interface requires:
   readability, hierarchy, density that suits the task, WCAG 2.2 AA, sensible
   responsive behaviour. This is the floor we never go below.
2. **DBIM** — Digital Brand Identity Manual (brand, colour, icons, typography).
3. **GIGW 3.0** — Guidelines for Indian Government Websites.
4. **UX4G** — the national design system.

2, 3 and 4 are adopted **wherever they fit without hampering quality**. Where one of
them would force a worse interface, quality wins and the deviation is **documented**,
not hidden.

## The rule that this exists to stop

**When a government standard specifies a set of values, ADD what is missing. Do not
DELETE what quality needs.**

A standard's list is a **floor, not a ceiling**. It tells you what must be available;
it does not tell you that nothing else may exist. Reading a mandatory clause as
exclusive, and deleting working values to satisfy it, degrades the product in the
name of compliance — which serves nobody, least of all the citizen using the page.

### How this was learned (2026-08-12)

DBIM 3.0 §3.4 defines four icon sizes — 24, 32, 48, 64 — and §3.7.i says "icon size
must be as per Section 3.4". The SAMAVESH scale held 16, 20, 24, 32, 40.

The correct fix was to **add 48 and 64**. What was done instead was to make the scale
exactly DBIM's four and delete 16, 20 and 40 — reading §3.7.i as exclusive.

That was wrong on the merits. §3.4 describes the **downloadable asset bank** on the
DBIM Toolkit: each icon is published as PNG/WEBP/SVG in four sizes. It is not a
statement that a 16px inline icon is forbidden. And a 24px minimum is simply worse
design: **16px is the correct size beside 14px body text**, and it was 358 of 713
call sites for that reason. Forcing 24px would have visibly enlarged icons in every
dense table, button and form row in the estate.

The scale is now **16, 20, 24, 32, 40, 48, 64** — DBIM's four, plus the three smaller
steps interface work needs.

## The accessibility baseline is WCAG 2.2 AA (project rule, 2026-08-13)

**This estate targets WCAG 2.2 Level AA.** Not 2.1. GIGW 3.0 binds India's government
properties to WCAG **2.1** AA, and that remains a true statement about GIGW — but 2.2 is a
strict superset of 2.1, so conforming to 2.2 satisfies GIGW and exceeds it. Where a document
describes *what GIGW requires*, it correctly still says 2.1; where it states *our own target*,
it says 2.2.

**What adopting 2.2 actually adds** — these are now in scope and previously were not:

| Criterion | Level | What it requires |
| --- | --- | --- |
| 2.4.11 Focus Not Obscured (Minimum) | AA | A focused control must not be entirely hidden by sticky headers or overlays |
| 2.5.7 Dragging Movements | AA | Anything draggable needs a single-pointer alternative |
| **2.5.8 Target Size (Minimum)** | AA | **24×24 CSS px**, or adequate spacing |
| 3.2.6 Consistent Help | A | Help mechanisms appear in the same relative order across pages |
| 3.3.7 Redundant Entry | A | Don't ask for the same information twice in a process |
| 3.3.8 Accessible Authentication (Minimum) | AA | No cognitive function test without an alternative |

**2.5.8 is the one that changes day-to-day work**, and it is the one most often misquoted.
The AA minimum is **24×24**, not 44×44 — 44×44 is **2.5.5 Target Size (Enhanced), Level AAA**,
which we do not claim. UX4G separately recommends 44×44 **on mobile**; treat that as a
recommendation for touch contexts, not a WCAG failure on a pointer surface.

Getting this wrong in an audit is worse than not auditing: calling a 40×40 desktop icon
button a "critical WCAG failure" sits it beside real failures and devalues both.

**2.4.11 has a direct consequence for this estate**: both mastheads are `sticky`, so a focused
element must never end up underneath them. Check it whenever the header height changes.

## Where this does NOT apply

**Accessibility is not a standard we trade against quality — it is part of quality.**
GIGW's WCAG 2.1 AA requirements (contrast, resize to 200%, reflow, keyboard, language
of parts, non-text contrast) are never "fitted in where convenient". They are the
first-priority floor, not the third-priority guideline. If a design conflicts with
them, the design changes.

The same is true of anything with a legal or safety character: mandatory pages,
the State Emblem's correct use, privacy and consent behaviour.

What IS negotiable is **prescriptive brand and asset specification** — a fixed list of
sizes, a specific asset format, an exact icon bank — where following it literally
would produce a worse interface than following its intent.

## What to do when they conflict

1. **Read the source, not a paraphrase.** The compliance checklist is a secondary
   source. DBIM's icon sizes live inside Figure 8 and 9 as images, not in the text
   layer — the numbers were only confirmed by rendering the PDF page.
2. **Work out what the clause is actually governing** — an asset bank, a rendered UI,
   a brand mark. A mandate on published assets is not automatically a mandate on
   every pixel of the interface.
3. **Satisfy it additively where you can.** Missing values get added. Existing values
   that serve the product stay.
4. **If it genuinely conflicts, quality wins — and you write down why.** In the token
   description, in `design.md`, and on the documentation page. A deviation that is
   recorded is a decision; an undocumented one is a defect.
5. **Never silently degrade the product to make a checklist go green.**

A precedent already set the pattern: UX4G's typography page recommends **justified
alignment** for column layouts. DBIM 4.1.1 requires left-aligned body text, and
justification measurably harms dyslexic readers. SAMAVESH is left-aligned throughout
and records that UX4G line as superseded. Same reasoning, same outcome.

## Checklist when a standard says "must"

- [ ] Read the primary source, including figures — not the checklist summary
- [ ] Identify what it governs: assets, brand, or rendered interface
- [ ] Can it be satisfied by **adding**? If so, add and change nothing else
- [ ] If it would remove or worsen something, does quality actually require that thing?
      Say what breaks, with counts (e.g. "358 call sites are 16px beside 14px text")
- [ ] Accessibility conflicts are resolved in the standard's favour, always
- [ ] Record the outcome — token description, `design.md`, the docs page
