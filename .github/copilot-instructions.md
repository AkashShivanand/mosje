# MoSJE — for GitHub Copilot

> **Read [`AGENTS.md`](./AGENTS.md) — it is the single source of truth for this repo.**
>
> This file exists only so that tools looking for this filename find their way there.
> It is deliberately thin: the guardrails live in one place so they cannot drift
> between tools. Do not add rules here — add them to `AGENTS.md` or to the
> canonical bodies in `.claude/rules/`, which are plain markdown any agent can read.

## Before your first edit

```bash
npm run branches
```

A task keeps its branch across sessions. Find out whether this work already has a
branch and continue there; never commit to `main` (`.husky/pre-commit` will refuse).
Full procedure: `AGENTS.md` → *Branch procedure*.
