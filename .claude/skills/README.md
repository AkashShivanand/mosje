# MoSJE project skills

Skills are situational instruction sets Claude loads automatically (by `description`/`paths`) or you invoke with `/name`.

## What we use today
- **`clone-website`** (installed globally at `~/.claude/skills/clone-website/`) — the engine for reverse-engineering a page from any of the 13 legacy source sites and rebuilding it faithfully in `dosje/`. This is how the website grows. Invoke with `/clone-website <url>`.
- **Figma skills** (from the Figma plugin): `figma-use`, `figma-generate-design`, `figma-generate-library`, `figma-code-connect` — used in phase 2 for the design-system ↔ Figma sync (see `/sync-figma`).
- **Project commands** live in `.claude/commands/`: `/review`, `/a11y`, `/qa`, `/new-portal`, `/sync-figma`.

## Add a project skill here when…
…there's a repeatable, MoSJE-specific procedure worth capturing — e.g. a `gov-compliance` skill encoding the **DBIM** (Digital Brand Identity Manual) + **GIGW** rules from `Documents/MoSJE DBIM Audit.pdf`, or a `scheme-page` skill for the standard scheme-detail layout. Create `.claude/skills/<name>/SKILL.md` with `name` + `description` frontmatter.

> Candidate, not yet built: **`gov-compliance`** — extract the DBIM audit findings into an enforceable checklist so every page can be checked against the official standard. Ask Claude to build it when you're ready.
