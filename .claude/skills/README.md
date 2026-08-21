# MoSJE project skills

Skills are situational instruction sets Claude loads — automatically (matched on their `description`) or on demand when you type `/<name>`. This file is the **authoritative index of every skill authored for this project** (the ones living in `.claude/skills/`), plus a reference list of external skills the project relies on.

> Each project skill is a folder `.claude/skills/<name>/SKILL.md` with `name` + `description` frontmatter (and optionally `user-invocable` / `allowed-tools`).

---

## Project-authored skills

### 1. `gov-compliance`
| | |
|---|---|
| **Purpose** | Apply or audit Government of India web standards — **DBIM** (Digital Brand Identity Manual) + **GIGW 3.0** + **UX4G** — for any MoSJE page, component, or portal. |
| **When it triggers** | Building or reviewing UI that must meet brand, accessibility, and government-website compliance (i.e. every MoSJE public property). |
| **Invoke** | Auto-loads on relevant UI work, or `/gov-compliance`. |
| **Inputs** | The target page/component file(s); the authoritative checklist `docs/compliance/COMPLIANCE-CHECKLIST.md`. |
| **Outputs** | *Mode A (Building):* compliance-by-construction guidance. *Mode B (Auditing):* a section-by-section PASS/FAIL/N/A scorecard with `file:line` evidence, an overall compliance %, and a prioritized fix list. |
| **Tools** | Read, Grep, Glob, Bash. Delegates deep checks to the `accessibility-auditor` and `design-system-guardian` agents. |
| **Location** | `.claude/skills/gov-compliance/SKILL.md` |

### 2. `figma-page-organiser`
| | |
|---|---|
| **Purpose** | Organise a messy Figma handoff page of portal screens into the MoSJE house convention — numbered grey portal `SECTION`s (`#EAEAEA`), feature sub-sections (`#E3E3E3`), frames named `Role / Screen / State`, and sections hugged to content. |
| **When it triggers** | A Figma page (e.g. in the `MoSJE Portal — Handoff` file) has scattered, duplicate-named, or ungrouped screen frames that need tidying the way the **E-Utthan** and **SCW** pages were done. |
| **Invoke** | `/figma-page-organiser` (also auto-matches on "organise this Figma page like eutthan/SCW"). |
| **Inputs** | The Figma page `node-id`; the portal's recon `docs/research/<host>/INVENTORY.md` for real screen names; the E-Utthan reference page (`node-id=4226-36929`). Requires the `figma-use` skill + Figma MCP tools loaded. |
| **Outputs** | A reorganised Figma page (grey hierarchy, numbered titles, `Role / Screen / State` frame names, hugged sections) and an optional refreshed `docs/design-handoffs/<Portal>-Handoff.md` §2 taxonomy. |
| **Tools** | Read, Grep, Glob, Bash (the Figma writes happen via the `use_figma` MCP tool under the `figma-use` skill). |
| **Location** | `.claude/skills/figma-page-organiser/SKILL.md` |
| **Encodes** | Hard-won `use_figma` techniques: clone child arrays before `.sort()`; **bounded top-of-frame text scan** to avoid plugin timeouts on content-heavy frames; **active-step detection by stepper-label fill colour**; deepest-first `resizeWithoutConstraints` to hug sections. |

---

## Vendored skill packs (third-party, checked in)

### `layers-*` — Layers of Product Design (9 skills)

| | |
|---|---|
| **Source** | [jamiemill/layers-skills](https://github.com/jamiemill/layers-skills) — MIT, by Jamie Mill. Site: <https://layers.jamiemill.com/> |
| **Install** | `npx skills add jamiemill/layers-skills` — installed **both** globally (`~/.claude/skills/` → `~/.agents/skills/`) and vendored here as real files so the repo is self-contained for anyone who clones it. Pinned in `skills-lock.json` at the repo root. |
| **Purpose** | Seven layers of design decision-making across three zones. Diagnoses **which layer a problem is actually at** before anyone draws a screen. Outputs are decisions — markdown + mermaid — not mockups. |
| **Why it's here** | This estate's toolkit is top-heavy. We have nine-plus ways to audit a *surface* and, before this, nothing that produced a job story, a domain concept map, or an object model. With **13 legacy sites, 20 portals, 33+ organisations and 60 schemes**, our hardest problems are Layer 2 (vocabulary) and Layer 5 (object model) — not Layer 7. |
| **Invoke** | `/layers-intro` first (framework context every other layer skill depends on), then `/layers-orient` to find the bottleneck, or jump straight to a layer. |

**The seven layers**

| # | Layer | Zone | Skill | Produces |
|---|---|---|---|---|
| 1 | Observed behaviour | Problem | `/layers-observed-behaviour` | Confidence-rated findings about what users do |
| 2 | The domain | Problem | `/layers-domain` | Concept map, terminology conflicts, bounded contexts |
| 3 | User needs | Problem | `/layers-user-needs` | Prioritised job stories — needs, pains, desires |
| 4 | Product & service strategy | Solution | `/layers-product-strategy` | Opportunity Solution Tree, prioritised bets |
| 5 | Conceptual model | Solution | `/layers-conceptual-model` | Object map, relationships, state diagrams, vocabulary |
| 6 | Interaction structure & flow | Solution | `/layers-interaction-flow` | Breadboards, edge cases, failure paths |
| 7 | Surface | Solution | `/layers-surface` | Surface audit traced down to its causing layer |

Plus `/layers-intro` (orientation) and `/layers-orient` (diagnostic — rates every layer
Strong / Partial / Assumed / Weak / Not started / N/A and names the bottleneck).

**MoSJE-specific guidance**

- **Layer 7 is not theirs.** `/layers-surface` knows nothing about WCAG 2.2 AA, DBIM,
  GIGW 3.0, UX4G or `@mosje/tokens`. Surface work routes to `/design-review` +
  `/gov-compliance` + the `accessibility-auditor` agent. Use `/layers-surface` only to trace
  a surface defect *down* to the layer that caused it.
- **Layer 4 overlaps** `/office-hours` and `/plan-ceo-review`. The Opportunity Solution Tree
  is a different lens, not better advice — reach for it when you want the artefact.
- **Layer 6 chains into `/spec`.** Breadboard first (cheap, structural), then `/spec` for the
  executable back half.
- **Highest-value first run:** `/layers-domain` over the 60-scheme corpus. One concept map
  serves the website copy, the chatbot's intent matching, the scheme-finder filters and the
  Figma annotations — which currently drift because that mapping is implicit in four places.
- **Second run:** `/layers-conceptual-model` on the objects shared across portals — is
  "Applicant" the same object in NSFDC and NOS? Does "Application" hold the same states in
  SMILE and PM-AJAY? That contract is what lets shared page-level DS templates hold up past
  the login screen.
- **Capture is opt-in and brief by design** (the pack's own principle 9). Decision notes
  belong in `docs/research/` or `docs/specs/`; don't let it generate reports nobody rereads.

**Updating.** Because it's installed in both scopes, update both or they drift:

```bash
npx skills update layers-intro -g          # global copy
npx skills update layers-intro -p          # project copy (this repo)
```

**Review before trusting.** These are third-party instruction files that run with full agent
permissions. Audited at install (2026-08-21): 709 lines of markdown across 9 files, no shell
execution, no credential references, no `allowed-tools` escalation, one benign VSCode
marketplace link. Re-audit the diff on every update.

---

## External skills the project uses (not authored here)

These live outside `.claude/skills/` but are part of how this workspace operates:

- **`clone-website`** — installed globally at `~/.claude/skills/clone-website/`. The engine for reverse-engineering a page from any legacy source site and rebuilding it faithfully. How the website and portal replicas grow. Invoke `/clone-website <url>`.
- **Figma plugin skills** — `figma-use` (mandatory before any `use_figma` call), `figma-generate-design`, `figma-generate-library`, `figma-code-connect`. Used for design-system ↔ Figma sync and for `figma-page-organiser`.
- **`layers-*`** — also installed globally at `~/.claude/skills/layers-*`, so the pack works outside this repo too. See “Vendored skill packs” above.
- **Project commands** (`.claude/commands/`, not skills): `/review`, `/a11y`, `/qa`, `/new-portal`, `/sync-figma`.
- **Project agents** (`.claude/agents/`): `code-reviewer`, `accessibility-auditor`, `design-system-guardian`, `debugger`.

---

## Add a project skill when…

…there's a repeatable, MoSJE-specific procedure worth capturing. Create `.claude/skills/<name>/SKILL.md` with `name` + `description` frontmatter, keep the body tight and procedural, and **add a row to the "Project-authored skills" table above** so this index stays complete.
