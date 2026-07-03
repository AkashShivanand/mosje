# Typography Token Comparison — UX4G DS · Portal DS · SAMAVESH DS

> Complete extraction of every typography **variable** (all modes) and every **text style** (named ramp)
> from the three Figma libraries, mapped side by side. Nothing omitted.
> Source: Figma Plugin API dumps, 2026-07-02.

## The three libraries

| # | Library | File key | Type collection | Modes | Type vars | Text styles |
|---|---------|----------|-----------------|-------|-----------|-------------|
| A | **MoSJE — UX4G DS** | `T3bkN5gNKfaNeY6dpT6FwF` | `Text Styles` | `Text Styles` (1) | 21 | 21 |
| B | **MoSJE Portal DS** | `u5eMCdX3a3mMZgnsHNn8XX` | `Typography` | `Desktop`, `Tablet`, `Mobile` (3) | 79 (+2 counters) | 24 |
| C | **SAMAVESH DS** (benchmark) | `qyzTEy8dlb3ssYctlkMX5o` | `Typography` | `Text Styles` (1) | 21 | 21 |

**Headline finding: A (UX4G) and C (SAMAVESH) are the same typography system.** Identical variable names,
identical values, identical 21 text styles — the only difference is the collection is named `Text Styles`
in UX4G and `Typography` in SAMAVESH. **Portal DS (B) is the one that diverges**: semantic per-role tokens,
three responsive modes, negative display tracking, and live line-height / letter-spacing / paragraph-spacing
variables (which A and C lost — see note below).

> ⚠️ **Orphaned tokens in A & C:** UX4G and SAMAVESH once had `Line Heights/*` and `Letter Spacing/*`
> variable collections. Those collections were **deleted**; the variables now have no collection but the
> text styles still hold stale bindings to them. They are listed below under "orphaned" — they are NOT live
> tokens you can pick, only frozen references inside the text styles.

---

## 1. Font family (STRING · scope FONT_FAMILY)

| UX4G DS (A) | Portal DS (B) | SAMAVESH DS (C) | Value (all modes) |
|-------------|---------------|-----------------|-------------------|
| `Font Family/Headings` | `font-family/heading` | `Font Family/Headings` | Noto Sans |
| `Font Family/Label & Body` | `font-family/body` | `Font Family/Label & Body` | Noto Sans |

## 2. Font weight / style (STRING · scope FONT_STYLE)

| UX4G DS (A) | Portal DS (B) | SAMAVESH DS (C) | Value (all modes) |
|-------------|---------------|-----------------|-------------------|
| `Font Weights/noto-sans-0` | `font-weight/regular` | `Font Weights/noto-sans-0` | Regular |
| `Font Weights/noto-sans-1` | `font-weight/medium` | `Font Weights/noto-sans-1` | Medium |
| `Font Weights/noto-sans-2` | `font-weight/semibold` | `Font Weights/noto-sans-2` | SemiBold |
| `Font Weights/noto-sans-3` | *(none — no Bold in Portal type vars)* | `Font Weights/noto-sans-3` | Bold |

## 3. Font size (FLOAT · scope FONT_SIZE)

**A & C** use a raw numeric ramp (mode-invariant, single value). **B** uses semantic per-role names with
three responsive modes. Bridged by pixel value.

### 3a. UX4G / SAMAVESH raw ramp (identical in both; single mode)

| UX4G (A) | SAMAVESH (C) | px |
|----------|--------------|----|
| `Font Size/0` | `Font Size/0` | 11 |
| `Font Size/1` | `Font Size/1` | 12 |
| `Font Size/2` | `Font Size/2` | 14 |
| `Font Size/3` | `Font Size/3` | 16 |
| `Font Size/4` | `Font Size/4` | 20 |
| `Font Size/5` | `Font Size/5` | 22 |
| `Font Size/6` | `Font Size/6` | 24 |
| `Font Size/7` | `Font Size/7` | 28 |
| `Font Size/8` | `Font Size/8` | 32 |
| `Font Size/9` | `Font Size/9` | 40 |
| `Font Size/10` | `Font Size/10` | 48 |
| `Font Size/11` | `Font Size/11` | 56 |
| `Font Size/12` | `Font Size/12` | 64 |
| `Font Size/13` | `Font Size/13` | 72 |
| `Font Size/14` | `Font Size/14` | 80 |

*(Font Size/1, /2, /3 also carry LINE_HEIGHT + PARAGRAPH_SPACING scopes — they double as small line-height/spacing values.)*

### 3b. Portal DS semantic font-size (3 modes)

| Token | Desktop | Tablet | Mobile |
|-------|:-------:|:------:|:------:|
| `font-size/display-1` | 56 | 48 | 40 |
| `font-size/display-2` | 48 | 40 | 32 |
| `font-size/display-3` | 40 | 32 | 28 |
| `font-size/display-4` | 32 | 28 | 24 |
| `font-size/display-5` | 28 | 24 | 22 |
| `font-size/display-6` | 24 | 22 | 20 |
| `font-size/headline-1` | 32 | 28 | 24 |
| `font-size/headline-2` | 28 | 24 | 20 |
| `font-size/headline-3` | 24 | 20 | 18 |
| `font-size/headline-4` | 20 | 18 | 16 |
| `font-size/headline-5` | 18 | 16 | 15 |
| `font-size/headline-6` | 16 | 15 | 14 |
| `font-size/title-1` | 20 | 18 | 16 |
| `font-size/title-2` | 18 | 16 | 15 |
| `font-size/title-3` | 16 | 15 | 14 |
| `font-size/body-1` | 16 | 15 | 14 |
| `font-size/body-2` | 14 | 14 | 13 |
| `font-size/body-3` | 13 | 14 | 13 |
| `font-size/label-1` | 14 | 14 | 14 |
| `font-size/label-2` | 12 | 12 | 12 |
| `font-size/label-3` | 11 | 11 | 11 |

## 4. Line height (FLOAT · scope LINE_HEIGHT)

### 4a. UX4G / SAMAVESH — ORPHANED (deleted collection, single value; still referenced by text styles)

| UX4G / SAMAVESH token | px |
|-----------------------|----|
| `Line Heights/0` | 100 |
| `Line Heights/2` | 80 |
| `Line Heights/3` | 72 |
| `Line Heights/4` | 56 |
| `Line Heights/5` | 48 |
| `Line Heights/6` | 40 |
| `Line Heights/7` | 32 |
| `Line Heights/8` | 28 |
| `Line Heights/9` | 24 |
| `Line Heights/10` | 20 |
| `Line Heights/11` | 16 |

*(No `Line Heights/1` — index gap. Values are frozen; these are not selectable live tokens.)*

### 4b. Portal DS semantic line-height (live; 3 modes)

| Token | Desktop | Tablet | Mobile |
|-------|:-------:|:------:|:------:|
| `line-height/display-1` | 64 | 56 | 48 |
| `line-height/display-2` | 56 | 48 | 40 |
| `line-height/display-3` | 48 | 40 | 36 |
| `line-height/display-4` | 40 | 36 | 32 |
| `line-height/display-5` | 36 | 32 | 28 |
| `line-height/display-6` | 32 | 28 | 28 |
| `line-height/headline-1` | 40 | 36 | 32 |
| `line-height/headline-2` | 36 | 32 | 28 |
| `line-height/headline-3` | 32 | 28 | 24 |
| `line-height/headline-4` | 28 | 24 | 24 |
| `line-height/headline-5` | 24 | 24 | 20 |
| `line-height/headline-6` | 24 | 20 | 20 |
| `line-height/title-1` | 28 | 24 | 24 |
| `line-height/title-2` | 24 | 24 | 20 |
| `line-height/title-3` | 24 | 20 | 20 |
| `line-height/body-1` | 24 | 24 | 20 |
| `line-height/body-2` | 20 | 20 | 20 |
| `line-height/body-3` | 20 | 20 | 20 |
| `line-height/label-1` | 20 | 20 | 20 |
| `line-height/label-2` | 16 | 16 | 16 |
| `line-height/label-3` | 16 | 16 | 16 |

## 5. Letter spacing (FLOAT · scope LETTER_SPACING)

### 5a. UX4G / SAMAVESH — ORPHANED (deleted collection; still referenced by text styles)

| UX4G / SAMAVESH token | value |
|-----------------------|-------|
| `Letter Spacing/1` | 0.15 |
| `Letter Spacing/2` | 0.10 |
| `Letter Spacing/3` | 0.50 |
| `Letter Spacing/4` | 0.25 |
| `Letter Spacing/5` | 0.40 |

### 5b. Portal DS semantic letter-spacing (live; 3 modes)

| Token | Desktop | Tablet | Mobile |
|-------|:-------:|:------:|:------:|
| `letter-spacing/display-1` | -1.12 | -0.96 | -0.80 |
| `letter-spacing/display-2` | -0.96 | -0.80 | -0.64 |
| `letter-spacing/display-3` | -0.60 | -0.48 | -0.42 |
| `letter-spacing/display-4` | -0.32 | -0.28 | -0.24 |
| `letter-spacing/display-5` | -0.28 | -0.24 | -0.22 |
| `letter-spacing/display-6` | 0 | 0 | 0 |
| `letter-spacing/heading` | 0 | 0 | 0 |
| `letter-spacing/title` | 0 | 0 | 0 |
| `letter-spacing/body` | 0 | 0 | 0 |
| `letter-spacing/label` | 0 | 0 | 0 |

## 6. Paragraph spacing (FLOAT · scope PARAGRAPH_SPACING)

**Only Portal DS (B) has paragraph-spacing as variables.** UX4G/SAMAVESH set paragraph spacing directly
on text styles (mostly 0) and reuse `Font Size/1–3` where non-zero.

| Token | Desktop | Tablet | Mobile |
|-------|:-------:|:------:|:------:|
| `paragraph-spacing/display-1` | 32 | 28 | 24 |
| `paragraph-spacing/display-2` | 32 | 28 | 20 |
| `paragraph-spacing/display-3` | 24 | 20 | 16 |
| `paragraph-spacing/display-4` | 24 | 20 | 16 |
| `paragraph-spacing/display-5` | 20 | 16 | 16 |
| `paragraph-spacing/display-6` | 20 | 16 | 16 |
| `paragraph-spacing/headline-1` | 24 | 24 | 20 |
| `paragraph-spacing/headline-2` | 24 | 20 | 16 |
| `paragraph-spacing/headline-3` | 20 | 16 | 16 |
| `paragraph-spacing/headline-4` | 20 | 16 | 16 |
| `paragraph-spacing/headline-5` | 16 | 16 | 12 |
| `paragraph-spacing/headline-6` | 16 | 12 | 12 |
| `paragraph-spacing/title-1` | 20 | 16 | 16 |
| `paragraph-spacing/title-2` | 16 | 16 | 12 |
| `paragraph-spacing/title-3` | 16 | 12 | 12 |
| `paragraph-spacing/body-1` | 16 | 16 | 12 |
| `paragraph-spacing/body-2` | 12 | 12 | 12 |
| `paragraph-spacing/body-3` | 12 | 12 | 12 |
| `paragraph-spacing/label-1` | 12 | 12 | 12 |
| `paragraph-spacing/label-2` | 8 | 8 | 8 |
| `paragraph-spacing/label-3` | 8 | 8 | 8 |

## 7. Non-typography vars inside Portal's Typography collection (for completeness)

| Token | Type | Value | Note |
|-------|------|-------|------|
| `Left Counter` | STRING | "0" | Component counter, scope ALL_SCOPES — not typography |
| `Right Counter` | STRING | "10" | Component counter, scope ALL_SCOPES — not typography |

---

## 8. Named type ramp — TEXT STYLES crosswalk (the apples-to-apples view)

Format: **size / line-height / letter-spacing / weight**. UX4G (A) and SAMAVESH (C) are identical, shown as
one column. Portal (B) shown for all three modes.

| Style | UX4G = SAMAVESH (A=C) | Portal · Desktop | Portal · Tablet | Portal · Mobile |
|-------|-----------------------|------------------|-----------------|-----------------|
| `Display/display-1` | 80 / 100 / 0 / Medium | 56 / 64 / -1.12 / Medium | 48 / 56 / -0.96 / Medium | 40 / 48 / -0.80 / Medium |
| `Display/display-2` | 72 / 100 / 0 / Medium | 48 / 56 / -0.96 / Medium | 40 / 48 / -0.80 / Medium | 32 / 40 / -0.64 / Medium |
| `Display/display-3` | 64 / 80 / 0 / Medium | 40 / 48 / -0.60 / Medium | 32 / 40 / -0.48 / Medium | 28 / 36 / -0.42 / Medium |
| `Display/display-4` | 56 / 72 / 0 / Medium | 32 / 40 / -0.32 / Medium | 28 / 36 / -0.28 / Medium | 24 / 32 / -0.24 / Medium |
| `Display/display-5` | 48 / 56 / 0 / Medium | 28 / 36 / -0.28 / Medium | 24 / 32 / -0.24 / Medium | 22 / 28 / -0.22 / Medium |
| `Display/display-6` | 40 / 48 / 0 / Medium | 24 / 32 / 0 / Medium | 22 / 28 / 0 / Medium | 20 / 28 / 0 / Medium |
| `Headline/headline-1` | 40 / 48 / 0 / SemiBold | 32 / 40 / 0 / SemiBold | 28 / 36 / 0 / SemiBold | 24 / 32 / 0 / SemiBold |
| `Headline/headline-2` | 32 / 40 / 0 / SemiBold | 28 / 36 / 0 / SemiBold | 24 / 32 / 0 / SemiBold | 20 / 28 / 0 / SemiBold |
| `Headline/headline-3` | 28 / 32 / 0 / SemiBold | 24 / 32 / 0 / SemiBold | 20 / 28 / 0 / SemiBold | 18 / 24 / 0 / SemiBold |
| `Headline/headline-4` | 24 / 28 / 0 / SemiBold | 20 / 28 / 0 / SemiBold | 18 / 24 / 0 / SemiBold | 16 / 24 / 0 / SemiBold |
| `Headline/headline-5` | 20 / 24 / 0 / SemiBold | 18 / 24 / 0 / SemiBold | 16 / 24 / 0 / SemiBold | 15 / 20 / 0 / SemiBold |
| `Headline/headline-6` | 16 / 20 / 0 / SemiBold | 16 / 24 / 0 / SemiBold | 15 / 20 / 0 / SemiBold | 14 / 20 / 0 / SemiBold |
| `Title/title-1` | 22 / 28 / 0 / Medium | 20 / 28 / 0 / Medium | 18 / 24 / 0 / Medium | 16 / 24 / 0 / Medium |
| `Title/title-2` | 16 / 24 / 0.15 / Medium | 18 / 24 / 0 / Medium | 16 / 24 / 0 / Medium | 15 / 20 / 0 / Medium |
| `Title/title-3` | 14 / 20 / 0.10 / Medium | 16 / 24 / 0 / Medium | 15 / 20 / 0 / Medium | 14 / 20 / 0 / Medium |
| `Body/body-1` | 16 / 24 / 0.50 / Regular | 16 / 24 / 0 / Regular | 15 / 24 / 0 / Regular | 14 / 20 / 0 / Regular |
| `Body/body-1-semibold` | *(none)* | 16 / 24 / 0 / SemiBold | 15 / 24 / 0 / SemiBold | 14 / 20 / 0 / SemiBold |
| `Body/body-2` | 14 / 20 / 0.25 / Regular | 14 / 20 / 0 / Regular | 14 / 20 / 0 / Regular | 13 / 20 / 0 / Regular |
| `Body/body-2-semibold` | *(none)* | 14 / 20 / 0 / SemiBold | 14 / 20 / 0 / SemiBold | 13 / 20 / 0 / SemiBold |
| `Body/body-3` | 12 / 16 / 0.40 / Regular | 13 / 20 / 0 / Regular | 14 / 20 / 0 / Regular | 13 / 20 / 0 / Regular |
| `Body/body-3-semibold` | *(none)* | 13 / 20 / 0 / SemiBold | 14 / 20 / 0 / SemiBold | 13 / 20 / 0 / SemiBold |
| `Label/label-1` | 14 / 20 / 0.10 / Medium | 14 / 20 / 0 / Medium | 14 / 20 / 0 / Medium | 14 / 20 / 0 / Medium |
| `Label/label-2` | 12 / 16 / 0.50 / Medium | 12 / 16 / 0 / Medium | 12 / 16 / 0 / Medium | 12 / 16 / 0 / Medium |
| `Label/label-3` | 11 / 16 / 0.50 / Medium | 11 / 16 / 0 / Medium | 11 / 16 / 0 / Medium | 11 / 16 / 0 / Medium |

**Text-style differences at a glance**
- Portal adds 3 styles UX4G/SAMAVESH don't have: `body-1/2/3-semibold` (21 → 24).
- Display tier: UX4G/SAMAVESH run **much larger** (80→40) than Portal (56→24), and use **0 tracking**;
  Portal uses **negative tracking** (-1.12 → 0) that also shrinks per mode.
- UX4G/SAMAVESH keep small positive letter-spacing on Title/Body/Label (0.10–0.50); Portal zeroes them.
- Body/Title/Headline/Label px are close between systems at desktop but Portal steps them down for tablet/mobile.

---

## 9. Naming convention map (one-line summary)

| Concept | UX4G (A) | Portal (B) | SAMAVESH (C) |
|---------|----------|------------|--------------|
| Collection | `Text Styles` | `Typography` | `Typography` |
| Modes | single `Text Styles` | `Desktop`/`Tablet`/`Mobile` | single `Text Styles` |
| Family | `Font Family/Headings`, `…/Label & Body` | `font-family/heading`, `…/body` | same as A |
| Weight | `Font Weights/noto-sans-0…3` | `font-weight/regular…bold` (no bold var) | same as A |
| Size | `Font Size/0…14` (raw ramp) | `font-size/<role>-<n>` (semantic) | same as A |
| Line height | `Line Heights/*` (orphaned) | `line-height/<role>-<n>` (live) | same as A (orphaned) |
| Letter spacing | `Letter Spacing/*` (orphaned) | `letter-spacing/<role>` (live) | same as A (orphaned) |
| Paragraph spacing | *(none — set on styles)* | `paragraph-spacing/<role>-<n>` | *(none)* |
| Named ramp | 21 text styles | 24 text styles (+semibold body) | 21 text styles (identical to A) |
