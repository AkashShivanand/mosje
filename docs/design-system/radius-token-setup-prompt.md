# Prompt — set up the corner radius tokens to the same standard as spacing

> Hand this to an agent (or a person) as the whole brief. It carries the **measured**
> starting state so nobody begins blind, states what is already correct so nobody
> "fixes" it, and lists the traps that cost real time during the spacing migration.
>
> Written 2026-08-18, immediately after the spacing ladder was value-named and its
> library bindings brought to 100%. Baseline figures below were read from the live
> library, not assumed.
>
> **Provenance note.** A live "last 30 days" sweep of community practice was requested
> but could not be run — the `last30days` skill is present as documentation only, with
> no research scripts and no API keys configured. Everything below is grounded in (a) the
> DTCG specification as of this assistant's knowledge cutoff and (b) this repository's
> own verified, currently-passing contract. Treat any claim about *very recent* upstream
> DTCG changes as unverified, and check
> `https://tr.designtokens.org/format/` before acting on the `$type` note in §6.

---

## 0. Read first

- `.claude/rules/design-system.md` — the spacing section is the worked precedent
- `.claude/rules/documentation-ds-linkage.md` — the 100%-bound threshold
- `.claude/rules/component-authoring.md` — §1 tokenise everything, §10 ordering
- `.claude/rules/standards-precedence.md` — how to handle a UX4G conflict
- `packages/design-system/design.md` §G

Figma library: `3FF5l0SMNIwdpZrKkeyPTm`. Never a copy — two stale duplicates exist.

---

## 1. Measured starting state

**Tier 1 — `ref/radius/*`, Radius collection, 12 variables, all hidden, all `CORNER_RADIUS`:**

```
none 0 · xxs 2 · xs 4 · sm 6 · md 8 · lg 12 · xl 16 · 2xl 20 · 3xl 24 · 4xl 32 · 5xl 40 · full 999
```

**Tier 2 — `shape/*`, same collection, 12 variables, all published, all `CORNER_RADIUS`.**

**Parity is already perfect: 1:1 with Tier 1, no value in either without a counterpart.**

### What is ALREADY RIGHT — do not disturb

1. Tiering is correct: `ref/radius/*` hidden, `shape/*` published.
2. Scopes are correct and uniform: `CORNER_RADIUS` on all 24. Nothing to narrow.
3. Every variable has a `codeSyntax` and a non-empty description.
4. **The `shape/*` descriptions are ROLE-based and genuinely good** — `shape/sm` "inputs
   and text-entry controls", `shape/md` "buttons and standard controls", `shape/lg`
   "cards and panels", `shape/xl` "modal surfaces", `shape/full` "pills and circles".
   That is real semantic value the spacing families never had. **Preserve it.**
5. `src/primitive.json` `radius` and `src/semantic.json` `shape` mirror the library exactly.

---

## 2. The actual defects — these are the job

### D1 · Radii are not bound on the canvas (the big one)

The Colour documentation page alone carries **1,632 raw corner radii, 0% bound**, on the
page `figma-documentation-style.md` designates as the reference every other documentation
page copies. `documentation-ds-linkage.md` puts radii in the 100%-bound list with no
exemption. **The rest of the library has never been measured for radius** — spacing was
censused three times, radius zero times.

### D2 · Raw radii in code

```
36 × border-radius: 999px      → shape/full
22 × border-radius: 9999px     → shape/full   (and note 999 vs 9999 — two spellings of "pill")
18 × border-radius:999px       → shape/full
16 × border-radius: 8px        → shape/md
16 × border-radius: 2px        → shape/xxs
14 × border-radius:8px         → shape/md
```

### D3 · No gate

Radius has no equivalent of `check:space-linkage`. Colour has six contract tests, spacing
now has twelve assertions, icons have a ratchet. Radius has nothing, which is why D1 went
uncounted for as long as it has.

### D4 · No documentation page

FOUNDATION has Typography, Colour, Effects, Layout Grid, Spacing, Motion, Density,
Iconography. There is no Radius/Shape page.

---

## 3. The naming decision — and why radius is NOT spacing

**Do not assume the spacing answer transfers. It probably does not.** Spacing was
value-named for two measured reasons; check each against radius honestly:

| Reason spacing was renamed | Does it apply to radius? |
|---|---|
| The same label meant different values in different families (`l` = 16/24/20/56) | **NO.** There is one semantic family, `shape/*`. `shape/md` is unambiguous. |
| A T-shirt ramp cannot absorb a mid-step without renaming everything above | **YES.** There is no slot between `md` (8) and `lg` (12). |

So only half the argument carries. Weigh three options and **put the recommendation to the
human before executing** — this is a rename of a published surface either way.

- **A · Leave the T-shirt names.** Cheapest. Keeps the role descriptions, which are the
  best thing about the current setup. Accepts the insertion problem.
- **B · Value-name it** (`shape/8`, `shape/12`) for consistency with spacing. Consistent
  and expandable, but *destroys the role mapping* — `shape/md` says "button", `shape/8`
  does not. That is a real loss and radius, unlike spacing, has something to lose.
- **C · Keep the ladder, add role aliases** — `shape/control` → 8, `shape/card` → 12,
  `shape/pill` → 999. Best of both, at the cost of a third layer to keep honest.

**Recommendation to argue for: A now, C later.** The measured defect is D1/D2 (nothing is
bound), not the names. Renaming first would be motion without progress, and it would spend
the migration budget on the half of the problem that is not hurting anyone.

---

## 4. Execution order

1. **Census first, exactly as spacing was done.** Walk every page, classify every
   `cornerRadius` / `topLeftRadius` / … as `tier2` (`shape/*`), `tier1` (`ref/radius/*`),
   `crossFamily` (a space or size token on a radius property — check for this, the inverse
   defect cost 38,799 bindings the other way), `ghost`, `remote` or `raw`.
2. **Build the gate before rebinding**, so the gain is locked in and cannot be given back.
   Mirror `packages/tokens/build/figma-space-audit.mjs` + `test/space-linkage.test.mjs`:
   per-page ratchet, fails on growth *and* on un-rebaselined improvement.
3. **Rebind, mains before instance overrides** (see §5).
4. **Fix code** — codemod the raw values in D2. `9999px` and `999px` both become
   `var(--sa-shape-full)`.
5. **Re-census, rebaseline, commit.**
6. **Documentation page**, house style, sibling record frame.

---

## 5. Traps — every one of these cost time during the spacing work

1. **One page per `use_figma` invocation.** Batching pages returns partial,
   non-deterministic trees — Navbar read 2,885 / 1,685 / 1,669 on identical code, and
   `findAll(() => true)` returned the same node count every time, so a node-count sanity
   check cannot see it.
2. **Renaming a Figma variable does NOT update its `codeSyntax` or `description`.** 51
   variables silently kept handing developers the old CSS name. If you rename, rewrite both.
3. **Figma binds by variable id**, so a rename is safe for every node on canvas. Renaming
   is not the risky part; forgetting the two fields above is.
4. **Instance overrides do not follow their main.** Rebind mains first, then sweep the
   overrides directly — ~13,500 of the spacing bindings were overrides.
5. **Scopes filter the picker; they never retro-unbind.** Narrowing a scope does not clean
   up existing wrong bindings.
6. **Declare renames in `RENAMES` and prove them value-preserving BEFORE rebaselining the
   fixtures** — the un-regenerated fixture is the evidence. Then delete the entries.
7. **An empty auto-layout frame cannot hug below ~100px**, so you cannot express a small
   size with padding alone. Use a rectangle and declare it a specimen.
8. **Do not delete a superseded variable without a binding sweep.** That is exactly what
   strands a node on a ghost; the library still carries 4,771 of them.
9. **Per-page totals drift across a library re-sync** without anyone editing. Confirm no
   real binding changed before treating a ratchet failure as a regression.

---

## 6. DTCG conformance — verify, do not assume

Check the radius tree the same way spacing was checked:

- names contain no `{` `}` `.` and do not begin with `$`
- no leaf carries children
- every alias resolves
- every token has `$description`
- **every token has a resolvable `$type`** — `radius` in `primitive.json` should declare
  `$type: "dimension"`, and `shape` in `semantic.json` must too. The spacing families were
  missing this and it was invisible until checked.

**Known, deliberate divergence:** dimension values are strings (`"8px"`) rather than the
newer object form (`{ value: 8, unit: "px" }`). This is repo-wide and is what Style
Dictionary consumes. Do not change it for radius alone — it is a whole-token-set decision.

**`full` = 999px deserves a decision of its own.** It is not a dimension in the same sense
as the others; it is "fully rounded". Options: keep 999 as a sentinel (document it), or
express it as `9999px`/`50%` — but note code already disagrees with itself (999 vs 9999),
so pick one and codemod both.

---

## 7. Done means

- [ ] Census committed; every page classified
- [ ] `npm run check:radius-linkage` exists, runs in Design System Quality, and **every
      failure mode has been exercised by deliberately breaking it**
- [ ] 0 raw radii on all documentation pages; library-wide raw count frozen in a baseline
- [ ] 0 cross-family bindings (no space/size token on a radius property)
- [ ] Code: no raw `border-radius` outside a declared specimen
- [ ] `design.md`, `.claude/rules/design-system.md` and the web Shape page updated together
- [ ] Figma Radius documentation page, house style, 100% bound, with a sibling record frame
- [ ] Tokens, design-system, hub typecheck, ds-linkage all green
