# Portal DS ↔ SAMAVESH — Merge Plan & Token Diff

> **Goal:** merge the two Figma design systems into one `@mosje/tokens` source so the public website and the portals render from a single contract — *logically correct, without breaking existing designs*.
> **Files** (identical node IDs in both — Portal is a lineage fork of SAMAVESH):
> - SAMAVESH (public website / UX4G): `T3bkN5gNKfaNeY6dpT6FwF`
> - PORTAL: `u5eMCdX3a3mMZgnsHNn8XX`
> Method: exhaustive page-by-page MCP diff (5 parallel agents, every component page). Date 2026-06-13. Supersedes the summary in `figma-portal-ds-audit.md`.

---

## 0. Verdict

**The two files are the SAME design system.** Both share one `Color Styles` collection (`3791:8911`, modes `Blue - Light` + `Blue - Dark`) whose **primitive ramps are identical mode-for-mode**. Portal is the **newer, refined fork**: it re-points a handful of semantic aliases (darker status, lighter ink), adds an **Info** family + `navbar-bg`, makes **typography responsive** (Desktop/Tablet/Mobile), and adds components. Verified by reading `valuesByMode` directly via the Plugin API.

| Question you asked | Answer |
|---|---|
| 1. Do Portal colours = SAMAVESH **Blue-Dark** mode? | **The colour *modes* are the same in both files** — identical primitive ramps in Light *and* Dark. Earlier "greys differ" was a mode mis-read (Light↔Dark). Our **code only models the primary half** of Blue-Dark; the neutral/secondary mode-swap was never ported. |
| 2. Identical at token level + platform type scales? | **Colour primitives: yes** (2 nits — `Primary/100` Light, `Neutral/1100`). Difference is the **semantic alias layer** (§1.2). **Type: Portal IS responsive** — `Desktop/Tablet/Mobile` modes; SAMAVESH is single-mode. (Corrects the first audit.) |
| 3. Portal has more components? | **Yes, substantially** — see §3. New Icon page, +16 Card families, rebuilt Badges, Radio Card, Toggle w/Label, Search Small. |
| 4. Merge plan | §4–§6. |

---

## 1. Colour — read from `valuesByMode` (the authoritative diff)

> ⚠️ **Correction to the first audit.** Both files share **one** `Color Styles` collection (`VariableCollectionId:3791:8911`) with **two modes: `Blue - Light` and `Blue - Dark`**. The earlier "Bootstrap greys (web) vs Tailwind greys (portal)" claim was an artefact of reading SAMAVESH in Light and Portal in Dark. **The primitive ramps are the same in both files, mode-for-mode.** The real Portal change is in the *semantic alias* layer.

### 1.1 Primitive ramps — essentially IDENTICAL per mode (both files)
- **Neutral:** Light = UX4G greys (`50 #f8f9fa … 800 #1f2428 … 1000 #0a0d13`); Dark = Tailwind `gray` (`50 #f9fafb … 800 #1f2937 … 900 #111827`). **Same in both files.** (So "Bootstrap vs Tailwind" was really Light vs Dark of one ramp.)
- **Primary:** Light azure (`500 #0373df`), Dark navy (`500 #003366`) + 50–900 + 8–48% transparents. **Same in both files.**
- **Secondary:** Light saffron (`500 #f97316`), Dark green (`500 #198754`). **Same in both files.**
- **Success / Danger / Warning:** full 50–900 ramps, **identical in both files, both modes** (e.g. Warning `500 #bb772b`, `600 #a66a26`; Danger `500 #ec5042`, `600 #d64539`; Success `500 #2e7d32`, `600 #27682a`).

**The only primitive differences between the two files:**
| Primitive | Mode | SAMAVESH | PORTAL |
|---|---|---|---|
| `Primary/100` | Light | `#c6dcf9` | `#c8dbf0` |
| `Neutral/1100` | both | `#000000` | *(absent)* |
| `Primary Transparent/*` | Light | mode-following (`#0373df…`) | hardcoded navy (`#003366…`) |

### 1.2 Semantic aliases — where Portal actually differs (applies in BOTH modes)
Same primitive values, but Portal **re-points** the semantic tokens:
| Semantic token | SAMAVESH → | PORTAL → | Effect |
|---|---|---|---|
| `Neutral/Source` | `Neutral/800` | `Neutral/700` | base ink one step lighter |
| `Text/Hint` | `Neutral/700` | `Neutral/500` | hints lighter |
| `Text/Primary` (Light) | `Primary/700` | `Primary/Source` | brighter primary text |
| `Text/Secondary` (Light) | `Secondary/800` | `Secondary/600` | lighter secondary |
| `Success/Source` | `Success/500` (`#2e7d32`) | `Success/600` (`#27682a`) | darker (AA) |
| `Danger/Source` | `Danger/500` (`#ec5042`) | `Danger/600` (`#d64539`) | darker (AA) |
| `Warning/Source` | `Warning/500` (`#bb772b`) | `Warning/600` (`#a66a26`) | darker (AA) |
| **`Info/Source`** | *(absent)* | `Info/600` (`#1558b0`) | **net-new family** |
| **`Text/Info`** | *(absent)* | `@Info/Source` | **new** |
| **`navbar-bg`** | *(absent)* | `#ffffffcc` | **new** |

Portal also carries the full **Info** ramp (`50 #e8f0fe … 600 #1558b0 … 900 #081e43`) + Info transparents — the +12 variable count vs SAMAVESH (127 → 139).

### 1.3 Focus ring
| | SAMAVESH | PORTAL |
|---|---|---|
| colour | `rgba(3,115,223,0.48)` (azure@48%) | `rgba(0,51,102,0.48)` (navy@48%) |
| **spread** | **4px** | **2px** |

Colour follows the primary per mode (so it's already mode-derived); **spread (4→2px) is a real per-mode value** to add.

---

## 2. Typography — Portal IS responsive across platforms (correction)

> ⚠️ **Correction to the first audit.** Portal’s `Typography` collection (`3791:8912`) has **three modes — `Desktop` / `Tablet` / `Mobile`** (81 vars, **55 responsive**). SAMAVESH’s equivalent (`Text Styles`) has a **single mode** (21 vars). The earlier "no platform type scales" claim was wrong — the responsive scale lives in variable *modes*, not style-name prefixes.

Portal type ramp is far richer: `display-1..6`, `headline-1..6`, `title-1..3`, `body-1..3`, `label-1..3`, plus `paragraph-spacing/*` and a `font-weight/bold` (SAMAVESH only has regular/medium/semibold). Font sizes step down per breakpoint, e.g.:

| Role | Desktop | Tablet | Mobile |
|---|---|---|---|
| display-1 | 56 / lh 64 | 48 / 56 | 40 / 48 |
| display-2 | 48 / 56 | 40 / 48 | 32 / 40 |
| headline-1 | 32 / 40 | 28 / 36 | 24 / 32 |
| headline-3 | 24 / 32 | 20 / 28 | 18 / 24 |
| headline-5 | 18 / 24 | 16 / 24 | 15 / 20 |
| title-1 | 20 / 28 | 18 / 24 | 16 / 24 |
| body-1 | 16 / 24 | 15 / 24 | 14 / 20 |
| body-2 | 14 / 20 | 14 / 20 | 13 / 20 |
| label-1/2/3 | 14/12/11 | (same) | (same) — labels are non-responsive |

- **Letter-spacing:** Portal zeroes tracking on heading/title/body/label roles; only `display-*` carries (negative) tracking that also scales per breakpoint. SAMAVESH carries Material-style positive tracking (0.1–0.5px) on body/label/title.
- **Token naming:** SAMAVESH numeric (`Font Size/2`); Portal semantic (`font-size/body-2`). Our `@mosje/tokens` already uses semantic names, so naming doesn't affect code.
- Both keep **Noto Sans** (heading + body roles).

➡️ Type merges as: adopt Portal’s richer **responsive** ramp (Desktop/Tablet/Mobile) as the canonical scale; SAMAVESH’s static set is the Desktop column with Material tracking — model tracking as a per-mode/brand override.

---

## 3. Component inventory diff (what Portal added / changed / removed)

| Component | SAMAVESH | PORTAL | Merge action |
|---|---|---|---|
| **Icon page** (`2316:246`) | — *(absent)* | **224 icons**, 24px, Rounded+Filled, `active`/`default` pairs; heavy gov/scheme/MIS vocabulary (Aadhaar, DigiLocker, NMBA, SHe-Box, recruitment, dashboard…) | **ADD** as shared icon library |
| **Card** | 4 base (Vertical/Horizontal × Outlined/Elevated) | base 4 **+ ~16 families**: KPI(+trend), Hero/Hero-slider, template-tile L/S, Link int/ext, ID Card, Events/Gallery, Profile, facility, benefits, type-1/2/3, progress-indicator, gradient-outline | **ADD** new families; base 4 unchanged structurally |
| **Badges** | 3 types × 3 colours (~13 symbols) | **rebuilt**: Dot/Digit/Text/Text-w-Pulse/Text-w-Icon × 6 colours × Size(Default/Large) × Emphasis(Default/Medium/High/Low) + pulse/icon flags | **REPLACE** (treat as new component; keep old as legacy) |
| **Radio** | 10 (Selected × State) | +**Radio Card** family (+4) | **ADD** Radio Card |
| **Toggle** | 20 (Selected × State × Size) | +**Type=w/Label** (+10, 64px wide) → 30 | **ADD** w/Label |
| **Search** | 5 (State), Default size | +**Size=Small** (+5, 40px tall) → 10 | **ADD** Small size |
| **Chips** | 21 (Type × State × Selected × Disabled); Default/Dropdown/Leading types | 14: dropped Dropdown/Leading, added **w/Icon**, folded Disabled into State; chip bigger (radius 8→6, pad 6/12→8/16, h 32→36) | **RECONCILE** — Portal’s is the newer shape; keep web variant if site uses dropdown chips |
| **Buttons** | Primary/Success/Danger/Default/**Inverted**; state `Hover` | **removed Inverted**; `Hover`→`Hovered`; pinned `h-40`, `py 10→8` | **KEEP Inverted in code** (additive); align state naming |
| Alerts/Toasts | 8 statuses × 2 | identical structure; taller (bigger type) | mode-driven (type) only |
| Checkbox | 15 | 15 — **identical** | no change |
| Empty State | 3 | 3 — identical (−4px customize) | no change |
| Loader | 18 | 18 — identical (recolour only) | mode-driven only |
| Avatars | 32 + 20 personas | **identical** | no change |
| Accessibility Bar/Widget | full | **identical** | no change |
| Logos & Misc Icons | 43 + 6-size brand logo | **identical** | no change |

➡️ Portal is a **superset**: same shared core, minus the Inverted button, plus a large additive layer (icons, cards, badge system, extra control variants).

---

## 4. Proposed merged `@mosje/tokens` architecture

One DTCG source, **two brand modes** on the existing `$extensions.mosje` machinery.

```
primitive.json
  color.primaryRamp.light  = gov-blue  (#0373df…)   ← exists
  color.primaryRamp.dark   = navy      (#003366…)   ← exists  (= portal primary)
  color.neutralRamp.bootstrap (#f8f9fa…#1f2428)     ← NEW: today's greys, renamed
  color.neutralRamp.tailwind  (#f9fafb…#111827)     ← NEW: portal greys (full gray scale)
  color.statusRamp.web     {success#2e7d32, danger#ec5042, warning#bb772b, info=primary}
  color.statusRamp.portal  {success#27682a, danger#d64539, warning#a66a26, info#1558b0,
                            + 100/300/600 emphasis ramps}
semantic.json   (per-token $extensions.mosje.colorModes.portal overrides)
  color.text.*       light → bootstrap neutral ; portal → tailwind neutral
  color.border.*     light → bootstrap          ; portal → tailwind
  color.status.*     web                        ; portal muted + ramps
  color.focus.ring   primary@48% (auto per mode)
  focus.spread       4px (default)              ; portal → 2px        ← NEW token
  type.*             tracking + heading sizes    ; portal → ls 0, headline 18, body3 13  ← per-mode
```

- **Default/unset mode = SAMAVESH (web).** Website renders exactly as today.
- **`data-color-mode="portal"`** = navy + Tailwind greys + muted status + 2px focus + 0 tracking + 18px headings.
- Apps consume the **same `--ds-*` names**; only resolved values change per mode. No app code changes for the website.
- Components (Icon library, new Cards, Badge system, Radio Card, Toggle w/Label, Search Small) are built into `@mosje/design-system` as **additive** exports.

---

## 5. Correction to the SAMAVESH side (do this regardless of merge)

Our code currently has `status.warning = {color.yellow.500} = #ffd323`. **The real SAMAVESH Figma `Warning/Source` = `#bb772b`** (resolved by two independent agents off the Warning toast-status node). `#ffd323` is the MoSJE *brand* gov-yellow, not the UX4G *semantic* warning.

➡️ **Recommend:** set web-mode `status.warning = #bb772b`; keep `#ffd323` as the brand-layer `brand.yellow` only. (Confirm before changing — it shifts warning UI from bright-yellow to amber.)

---

## 6. Non-breaking migration sequence

1. **Land the already-approved §-task-1 fixes** (danger tonal, mid-greys, text-disabled) — done in source, awaiting commit.
2. **Add the `portal` colour mode** to `primitive.json`/`semantic.json`: navy primary (reuse `primaryRamp.dark`), Tailwind `neutralRamp.tailwind`, `statusRamp.portal` (+ emphasis ramps), `focus.spread` token, type per-mode overrides. Website default untouched → **zero visual change to dosje**.
3. `npm run build -w @mosje/tokens` → `npm test` (the `--ds-*` contract test must stay green) → `npm --prefix apps/dosje run build` green.
4. **Point one portal at the new mode** (e.g. smile-admin) via `data-color-mode="portal"`; visually verify against the Portal Figma. Iterate.
5. **Build the additive components** into `@mosje/design-system` (Icon library first — highest reuse; then Badge system, new Cards, control variants). Keep the website’s Inverted button + dropdown chips as legacy variants so nothing breaks.
6. **Correct web Warning** (`#bb772b`) once confirmed (§5).
7. Roll the remaining portals onto `@mosje/design-system` incrementally; verify each app builds after each step (per design-system rules).

---

## 7. Open items / confirm
- **Figma collection + mode names** (e.g. is it literally one collection with "Web"/"Portal" modes?) can’t be read via MCP read tools — needs the Figma Plugin API (`figma.variables.getLocalVariableCollections`) or the Variables REST API (Enterprise + token). Confirm before finalising the DTCG mode keys.
- **Portal Badges page metadata is unreachable** (timed out 3×); its variant matrix was reconstructed from `get_design_context` union types — exact per-variant nodes unconfirmed.
- **Info colour:** Portal alerts alias Info→navy primary, but Portal badges use a distinct `info #1558b0`. Decide whether merged Info is "alias primary" or a real hue (recommend the real `#1558b0` ramp).
- Tailwind `gray` 800/900 (`#1f2937`/`#111827`) not yet observed in Portal — fill from Tailwind defaults when building `neutralRamp.tailwind`.
