# One task, one branch — across sessions (MANDATORY)

**A task keeps its branch even when it changes session.** Before touching a file in a
new session, work out whether the requested work already has a branch. If it does, that
branch is where the work continues. If it does not, create one and stay in it.

A context window ending is not the end of a task. The branch is the thread that survives
it — so "which branch does this instruction belong to?" is the **first** question of a
session, answered before any edit, not after.

This rule sits under `CLAUDE.md` → *Branching & merging*, and adds nothing that
contradicts it: never commit to `main`, keep branches short-lived, sync from `main`,
and never reuse a branch whose PR is already closed.

## Step 0 — The inventory arrives on its own

A `SessionStart` hook — `.claude/hooks/session-branch-inventory.sh`, wired in
`.claude/settings.json` — prints the inventory into context at the start of every
session: the current branch and its dirty count, every worktree, the fifteen most
recent local branches with their last commit subject, and the state of the last
twenty PRs. It **reports only**; it never switches, stashes, or creates anything.

That exists because a rule with no gate has a half-life — the lesson this repo
already learned in `documentation-ds-linkage.md`, and again in the incident below.
Read what the hook prints; it is Step 1 already done for you.

The hook degrades quietly and always exits 0: no `gh` drops the PR section, a
non-git directory produces nothing, and every call is capped at five seconds. **A
session that will not start is worse than a missing inventory.** So if it is
silent, run Step 1 by hand rather than concluding there was nothing to find.

## Step 1 — Take the inventory before deciding anything

Three commands, every session, before the first edit. The hook runs these for you,
so this is the manual fallback and the way to refresh mid-session:

```bash
git status --short && git branch --show-current   # what is here, and is it dirty
git branch -vv                                    # every branch, its upstream, its last subject
git worktree list                                 # which branches are checked out elsewhere
```

Add `gh pr list --state all --limit 20 --json number,title,state,headRefName` when a
candidate branch exists — its PR state decides whether the branch may be reused at all
(Step 3).

## Step 2 — Match the instruction to a branch

Match on the **subject of the work** — the component, portal, token family, page or
defect named in the instruction — in this order of evidence:

1. **Branch name.** This estate names branches after their subject
   (`ds/accessibility-bar-hardening`, `ds/radius-audit`, `fix/tabs-overflow-polish`), so
   the name is usually decisive.
2. **The branch's commit subjects** — `git log --oneline main..<branch>`. A name can be
   vague; the commits rarely are.
3. **Its PR title and body**, when it has one.

Prefer the branch whose commits touch the **same files** the instruction implies. A
shared word in a branch name is weaker evidence than a commit that edited the file.

## Step 3 — Decide, and say which branch and why

| What the inventory shows | What you do |
|---|---|
| One related branch, PR **open** or no PR yet | **Use it.** This is the case the rule exists for. |
| One related branch, PR **merged or closed** | **Do NOT reuse it.** Branch fresh from current `main`. Reusing a landed branch is already banned in `CLAUDE.md` and it is how a closed PR's commits get stranded. |
| No related branch | Create `<type>/<short-slug>` from current `main` — `feat/ fix/ ds/ docs/ chore/`. |
| **Two or more** plausible branches | **Ask.** Do not guess between them; picking wrong splits one task across two branches, which is the exact mess this rule prevents. |

**State the decision in your first response** — which branch, and on what evidence. A
silent switch is indistinguishable from a mistake when the user reads the diff later.

## Step 4 — The two things that make switching unsafe here

Check both **before** `git switch`. Neither is hypothetical; both occurred on
2026-08-19, in one afternoon, in this repo.

**A dirty working tree is a stop, not an obstacle.** Uncommitted changes follow you
across a `git switch` and land on the wrong branch. Ask which is true:

- The changes belong to *this* task → then you are already on the right branch; carry on.
- The changes are **someone else's in-flight work** → leave them exactly where they are.
  Do not stash, do not commit them, do not switch out from under them. Work in a
  separate worktree instead (Step 5).

**A branch checked out in another worktree cannot be checked out again.** Git refuses,
and it is correct to. `git worktree list` tells you before you try. Do not force it, do
not delete the other worktree, and do not delete the branch — on 2026-08-19 two branch
deletions failed for exactly this reason, and each was holding uncommitted work that a
force would have destroyed. If the branch you need lives in another worktree:

- If that worktree is idle and yours, **work in it**.
- If another session is live in it — the tell is commits or file changes appearing that
  you did not make — **ask the user** rather than contending for it.

## Step 5 — Use a worktree when the tree is not yours to move

When the working tree is dirty with work that is not yours, or the branch you need is
held elsewhere, do not fight for the checkout. Take a separate worktree:

```bash
git worktree add <scratchpad>/wt-<slug> <existing-branch>       # resume a branch
git worktree add <scratchpad>/wt-<slug> -b <type>/<slug> main   # start a new one
```

Remove it when the work lands (`git worktree remove`), and only then delete the branch —
never while a worktree still holds it.

## Step 6 — Resume, then sync

A branch resumed in a later session is a branch that has been sitting still while `main`
moved. Before adding to it:

```bash
git fetch origin && git merge origin/main
```

Merge, do not rebase — `CLAUDE.md` records why. Sync on resuming and again before the
PR, which is the half people skip and the reason long branches conflict.

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

## Checklist at the start of every session

- [ ] The SessionStart inventory read — or, if it was silent, Step 1 run by hand — **before** the first edit
- [ ] The instruction's subject matched against branch names, then commits, then PRs
- [ ] Candidate branch's PR state checked — merged/closed means branch fresh, not reuse
- [ ] Ambiguity between two branches resolved by **asking**, not guessing
- [ ] Working tree dirty? Nothing switched; a worktree used instead
- [ ] Branch held by another worktree? Not forced, not deleted
- [ ] Resumed branch synced with `git merge origin/main`
- [ ] The chosen branch, and the evidence for it, stated in the first response
- [ ] Not `main`. Never `main`.
