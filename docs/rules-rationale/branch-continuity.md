# Branch continuity — rationale and incident record

> Companion to `.claude/rules/branch-continuity.md`. The rule is the operative
> text and loads every session; this file is the evidence behind it and is read
> only when someone asks *why*.

## Why this rule exists

Work was being split across branches by accident because nothing said to look first. On
**2026-08-19** an audit found the accessibility-bar behaviour — designed, built and
verified in a browser the day before — sitting on `ds/accessibility-bar-hardening`,
unmerged and **never pushed**, while `main` shipped half the feature and six pages
carried a visible defect. A parallel branch, `ds/font-scale-working`, held an earlier
version of the same work under a different name. Two branches, one task, neither landed,
and no way for the next session to know either existed.

The same day showed the other half of the problem: eight local branches, two live
worktrees, and two sessions committing into the same tree at once. In that environment
"just switch branches" is not a safe default — which is why Step 4 exists.
