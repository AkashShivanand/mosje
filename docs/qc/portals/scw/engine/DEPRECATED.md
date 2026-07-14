# DEPRECATED — use the shared engine

These per-portal scripts (`assemble.py`, `diff.py`, `extract_live.py`, `extract_live_authed.py`,
`extract_figma.snippet.js`, the `candidates_*.json` and `figma/` / `live/` intermediates) were the
SCW precursors to the reusable engine. They are kept only to reproduce the committed SCW report.
**Do not copy this pattern for new portals.**

Use the project-agnostic engine instead:

    tools/design-audit/            # reusable engine + per-project config
    tools/design-audit/README.md   # how to run on any project

To re-run SCW on the engine, create `tools/design-audit/projects/scw/audit.config.json` from
`tools/design-audit/projects/_template/` (see `projects/_template/README.md`).
