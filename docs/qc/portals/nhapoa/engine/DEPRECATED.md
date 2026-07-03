# DEPRECATED — use the shared engine

These per-portal scripts (`cap_role.py`, `author.py`, `qc_geometry.py`, `run_all.sh`) were the
NHAPOA precursors to the reusable engine. They are kept only to reproduce the committed NHAPOA
report. **Do not copy this pattern for new portals.**

Use the project-agnostic engine instead:

    tools/design-audit/            # reusable engine + per-project config
    tools/design-audit/README.md   # how to run on any project

NHAPOA's config already exists at `tools/design-audit/projects/nhapoa/`.
