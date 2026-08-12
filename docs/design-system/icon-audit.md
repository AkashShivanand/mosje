# Icon usage audit — 2026-08-12

Does the estate actually use the icon system the [Iconography page](../../apps/hub/src/app/design-system/foundations/iconography/page.tsx)
documents? Run the audit and see:

```bash
node tools/icon-audit/check.mjs
```

Findings **1 and 2 are ratcheted** — frozen at today's counts and enforced in CI by
`npm run check:icon-scale`, so they can shrink but never grow. They are not being
swept, because the pages carrying them are going to be redesigned anyway (see the
decision under finding 1). Finding **3 is Figma-side** and reported only.

**Scope:** `apps/hub/src`, `packages/design-system`, `apps/storybook/stories` —
**762** `<Icon>` elements. The Iconography documentation page is excluded, since it
renders the whole scale and the whole catalogue deliberately.

---

## Summary

| # | Check | Result |
|---|---|---|
| — | **Accessible name** | ✅ **Fixed at source.** Was 533 of 718 unmarked. |
| 1 | **Size on the seven-step scale** | 🔒 510 on-scale · **213 off-scale, ratcheted** |
| 2 | **Sized by the `size` prop, not a CSS class** | 🔒 **4** sized by class, ratcheted |
| 3 | **Name in the Figma starter set** | ⚠️ **9** used names absent from Figma |
| — | Icon library discipline | ✅ No lucide / heroicons / react-icons anywhere |

---

## Fixed in this change: the accessible-name gap

This was the largest finding and it is already resolved, so it needs no follow-up.

A Material Symbols glyph is **real text content**. An unmarked
`<Icon name="arrow_back" />` is therefore announced by a screen reader as the stray
word *"arrow back"*. The Iconography page states the rule plainly — every icon is
**either hidden from assistive technology or given a label, with no third option** —
but as an unenforced convention it was missed at **533 of 718 call sites**, which is
what a convention depending on 533 separate acts of memory converges to.

Editing 533 call sites would have fixed today's instances and none of tomorrow's. The
fix went into the component instead (`packages/design-system/components/icon/icon.tsx`):

- `aria-label` given → the icon is meaningful. Exposed as `role="img"`, announced.
- otherwise → decorative. `aria-hidden="true"`.
- an explicit `aria-hidden={false}` still wins, for the rare glyph that must be in the
  tree without a label of its own.

`[GIGW 5.2]` · `[WCAG 1.1.1 A]`

---

## 1. Off-scale sizes — 213 call sites ✅ decided: ratcheted, not swept

The documented scale is seven steps, generated from the stylesheet: **16 · 20 · 24 ·
32 · 40 · 48 · 64**.

| Size | Count | On scale? |
|---:|---:|---|
| 16 | 359 | ✅ |
| 14 | **126** | ✖ |
| 20 | 121 | ✅ |
| 12 | **55** | ✖ |
| 18 | **18** | ✖ |
| 32 | 12 | ✅ |
| 40 | 11 | ✅ |
| 28 | **6** | ✖ |
| 48 | 5 | ✅ |
| 15 | **4** | ✖ |
| 56 | **2** | ✖ |
| 24 | 2 | ✅ |
| 10 | **1** | ✖ |
| 22 | **1** | ✖ |

**Why this is not auto-fixable.** `size={14}` at 126 sites is not a typo — someone
chose 14 to sit against 14px body text. The documentation gives the intended answer
(*"16px is the right size beside 14px body text"*), so the correct target is
**16**. But raising 126 glyphs by 2px changes row heights in dense admin tables
across seven live portals, and `size={10}` → 16 is a 60% jump. That is a visual
change to shipped product, and it is the user's call, not a script's.

**The decision (2026-08-12): let these go as the pages are redesigned, one by one.**
No sweep now. The pages carrying this debt are going to be rebuilt anyway, and a
redesign rewrites the icon sizing for free — so a sweep would be paid for twice, and
the first payment carries all the regression risk.

**What holds the line in the meantime** is a ratchet, not discipline:

```bash
npm run check:icon-scale          # the gate — runs in CI (Design System Quality)
npm run check:icon-scale:report   # the full picture, any time
npm run check:icon-scale:baseline # record the reduction after a redesign lands
```

`tools/icon-audit/scale-baseline.json` freezes today's counts **per file**. The gate:

| Change | Result |
|---|---|
| A new file starts sizing icons off-scale | ❌ fails |
| A baselined file's count **grows** | ❌ fails |
| A baselined file's count **shrinks** | ❌ fails — "run `--baseline` and commit it" |
| Nothing moved | ✅ passes |

Per file, not one global number — otherwise one page could add five off-scale icons
while another removed five, and the total would report clean. The shrink case failing
is the point: it is what stops a redesign's gain from being silently given back later.

All three failure modes were exercised before this shipped, because a gate nobody has
watched fail cannot be trusted.

**Mapping for whoever does the redesign:** 10 · 12 · 14 · 15 → **16** · 18 · 22 →
**20** · 28 → **24 or 32** (case by case) · 56 → **48 or 64** (case by case).

The heaviest files, as a rough ordering for the redesign queue:

| Off-scale | File |
|---:|---|
| 10 | `portals/smile-admin/(preview)/mobilised-options/page.tsx` |
| 9 | `components/eutthan/eutthan-cells.tsx` |
| 7 | `portals/nmba/treatment-centre/…/peer-educators/[id]/training/page.tsx` |
| 6 | `portals/nmba/treatment-centre/…/peer-educators/[id]/volunteers/page.tsx` |
| 6 | `app/reports/eutthan-admin/page.tsx` |
| 6 | `components/eutthan/eutthan-shell.tsx` |

One exception worth knowing about: **`apps/storybook/stories/Icon.stories.tsx` holds 5**
(an 18px icon in a Button, four 28px status icons). That file is not a page and will
never be "redesigned", so it will sit in the baseline until someone spends the two
minutes. It is baselined rather than fixed only because the no-sweep decision was
taken as a blanket one.

---

## 2. Sized by CSS class — 4 call sites ⚠️ genuine defect

Setting an icon's box with `h-*`/`w-*` does **not** set the `opsz` optical-size axis.
Material Symbols is a variable font: the glyph gets drawn for one size and displayed
at another, so stroke weight and spacing are subtly wrong. It also silently escapes
the size scale.

| File | Line | Class |
|---|---:|---|
| `apps/hub/src/app/portals/smile-admin/(app)/surveys/[id]/page.tsx` | 107 | `h-[18px] w-[18px]` |
| `apps/hub/src/app/portals/smile-admin/(app)/surveys/[id]/page.tsx` | 120 | `h-[18px] w-[18px]` |
| `apps/hub/src/app/portals/smile-admin/(preview)/mobilised-options/page.tsx` | 54 | `h-[18px] w-[18px] text-primary md:h-[22px] md:w-[22px]` |
| `apps/hub/src/components/smile-admin/dashboard/system-users-rail.tsx` | 42 | `h-[18px] w-[18px]` |

**Fix:** replace the sizing classes with `size={20}` (keep any colour class). The
responsive one at `mobilised-options:54` currently steps 18 → 22 across the `md`
breakpoint; the scale's equivalent is a flat `size={20}`, since the DS has no
responsive icon-size mechanism and a 2px breakpoint step is not worth inventing one.

Bundled with finding 1 because the fix changes rendered size by the same 2px.

---

## 3. Catalogue drift — 9 names ⚠️ Figma-side

These are used in code but absent from the 223-icon starter set synced from Figma
section 02. **Not errors** — the set is explicitly *"a starting point, not a limit"* —
but the sheet claims to hold *"every icon the estate and the Portal DS between them
call for"*, and right now it does not.

`currency_rupee` · `expand_more` · `favorite` · `inbox` · `local_hospital` ·
`payments` · `search_off` · `support_agent` · `task_alt`

Two are worth a second look rather than a straight addition:

- **`expand_more`** duplicates **`keyboard_arrow_down`**, which *is* in the set and is
  used more widely. Same glyph, two names. Pick one — `keyboard_arrow_down` — and
  migrate, rather than adding the synonym to Figma.
- **`currency_rupee`** sits beside **`currency_rupee_circle`**, which is in the set.
  Both are legitimate; add the plain one.

In the other direction, **105 of the 223** starter icons are not yet used in code.
That is expected for a starter set and needs no action.

### Also Figma-side: three missing colour swatches

Figma section 05 swatches six icon colour roles. The system defines **nine** — `info`,
`disabled` and `inverse` ship as `--sa-icon-*` custom properties with no swatch. The
web page documents all nine; Figma should add the three.

### Also Figma-side: three superseded vectors

Recorded on the Figma page itself and repeated here so it is tracked in code:
`external-link`, `language-switch` and `syllabus` duplicate `open_in_new`,
`translate_indic` and `auto_stories`. They survive only because live instances would
break on deletion. Migrate the instances, then delete the three components.

---

## What is already healthy

- **No competing icon library.** No `lucide-react`, `@heroicons`, or `react-icons`
  import anywhere in the estate. The two grep hits are prose in `design.md` and the
  changelog.
- **Adoption is broad** — 762 `<Icon>` elements across 248 files. The system is in
  use; the gaps above are calibration, not adoption.
- **Inline `<svg>` is now confined to legitimate cases** — the National Emblem and
  favicons, social/brand marks with no Material equivalent (`SocialMedia.tsx`), and
  hand-rolled data visualisation (`charts.tsx`, `india-map.tsx`, `LeafVine.tsx`).

  This was **not** true when the audit started, and it is the one finding that was
  fixed rather than reported. Six hand-drawn duplicates of Material Symbols were
  living in the design system's **own documentation chrome** — the strictest case
  under `.claude/rules/documentation-ds-linkage.md`, which requires documentation to
  be *built from* the system it documents:

  | File | Was | Now |
  |---|---|---|
  | `docs-kit/terminal-code.tsx` | hand-drawn tick, 14px | `<Icon name="check" size={16} />` |
  | `docs-kit/terminal-code.tsx` | hand-drawn clipboard, 14px | `<Icon name="content_copy" size={16} />` |
  | `docs-layout/docs-header.tsx` | hand-drawn X, 18px | `<Icon name="close" size={20} />` |
  | `docs-layout/docs-header.tsx` | hand-drawn hamburger, 18px | `<Icon name="menu" size={20} />` |
  | `docs-layout/docs-header.tsx` | hand-drawn magnifier, 14px | `<Icon name="search" size={16} />` |
  | `search/cmd-search.tsx` | hand-drawn magnifier, 16px | `<Icon name="search" size={16} />` |

  Safe to fix without the caution that applies to finding 1: this is docs chrome, not
  a live portal, and every replacement lands **on** the size scale (14 → 16, 18 → 20)
  rather than merely preserving an off-scale value.

---

*Generated by `tools/icon-audit/check.mjs`. Re-run after any change to the scale, the
catalogue, or icon usage — the script reads the scale and the catalogue from their
sources, so it tracks them rather than holding a copy.*
