# One task, one branch — across sessions (MANDATORY)

**A task keeps its branch even when it changes session.** Before touching a file,
work out whether the requested work already has a branch. If it does, continue
there. If not, create one. Never commit to `main`.

Rationale and the incidents behind each clause: `docs/rules-rationale/branch-continuity.md`.

## 1. Read the inventory — it arrives on its own

`.claude/hooks/session-branch-inventory.sh` (SessionStart) prints the current
branch, worktrees, recent branches and PR states into context. It reports only;
it never switches or stashes. If it was silent, run this by hand:

```bash
git status --short && git branch --show-current
git branch -vv && git worktree list
gh pr list --state all --limit 20 --json number,title,state,headRefName
```

## 2. Match the instruction to a branch

Match on the **subject** — component, portal, token family, page, defect — using,
in order: the branch name, its commits (`git log --oneline main..<branch>`), its PR
title. A commit that edited the file beats a shared word in a branch name.

## 3. Decide, and state the decision in your first response

| Inventory shows | Do |
|---|---|
| One related branch, PR open or none | **Use it.** |
| One related branch, PR merged/closed | **Branch fresh from `main`.** Never reuse. |
| No related branch | Create `<type>/<slug>` — `feat/ fix/ ds/ docs/ chore/`. |
| Two or more plausible | **Ask.** Do not guess. |

## 4. Two things make switching unsafe here — check both BEFORE `git switch`

- **A dirty tree is a stop.** Uncommitted changes follow you onto the wrong branch.
  If they are yours, you are already on the right branch. If they are **another
  session's**, leave them untouched — no stash, no commit, no switch.
- **A branch held by another worktree cannot be checked out again.** `git worktree
  list` tells you first. Never force it, never delete the branch — it may hold
  uncommitted work.

Either case: take a worktree instead.

```bash
git worktree add <scratchpad>/wt-<slug> <existing-branch>      # resume
git worktree add <scratchpad>/wt-<slug> -b <type>/<slug> main  # start
```

Remove it when the work lands, and only then delete the branch.

## 5. Resume, then sync

```bash
git fetch origin && git merge origin/main
```

Merge, never rebase (see `CLAUDE.md`). Sync on resuming **and** before the PR — the
second one is the half people skip, and the reason long branches conflict.

## Checklist

- [ ] Inventory read before the first edit
- [ ] Subject matched against branch names → commits → PRs
- [ ] Merged/closed PR means branch fresh, not reuse
- [ ] Ambiguity resolved by asking
- [ ] Dirty tree or held branch → worktree, nothing switched
- [ ] Resumed branch synced with `git merge origin/main`
- [ ] Chosen branch and evidence stated in the first response
- [ ] Not `main`. Never `main`.
