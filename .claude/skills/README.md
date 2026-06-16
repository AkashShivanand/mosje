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

## External skills the project uses (not authored here)

These live outside `.claude/skills/` but are part of how this workspace operates:

- **`clone-website`** — installed globally at `~/.claude/skills/clone-website/`. The engine for reverse-engineering a page from any legacy source site and rebuilding it faithfully. How the website and portal replicas grow. Invoke `/clone-website <url>`.
- **Figma plugin skills** — `figma-use` (mandatory before any `use_figma` call), `figma-generate-design`, `figma-generate-library`, `figma-code-connect`. Used for design-system ↔ Figma sync and for `figma-page-organiser`.
- **Project commands** (`.claude/commands/`, not skills): `/review`, `/a11y`, `/qa`, `/new-portal`, `/sync-figma`.
- **Project agents** (`.claude/agents/`): `code-reviewer`, `accessibility-auditor`, `design-system-guardian`, `debugger`.

---

## Add a project skill when…

…there's a repeatable, MoSJE-specific procedure worth capturing. Create `.claude/skills/<name>/SKILL.md` with `name` + `description` frontmatter, keep the body tight and procedural, and **add a row to the "Project-authored skills" table above** so this index stays complete.
