---
paths:
  - ".github/workflows/**"
  - "tools/local-ci/**"
  - ".husky/**"
---

# CI runs here too, and it is derived from the workflows (MANDATORY)

**`npm run ci` executes the same steps as `.github/workflows/*.yml`, read FROM those
files rather than copied into a second list.** Add a gate to CI and it runs locally on the
next invocation, with nothing to remember.

---

## 1. Why this exists

Twice in two weeks the remote was not the safety net it was assumed to be.

- **2026-08-23.** A `useSearchParams()` without a Suspense boundary reached `main`.
  Production served a four-hour-old build. Typecheck, lint and `npm run check` are all
  blind to a prerender error — only `next build` sees it.
- **2026-09-04.** GitHub stopped assigning runners: *"The job was not started because
  recent account payments have failed or your spending limit needs to be increased."*
  Every workflow died in about three seconds with `runner=""` and **zero steps**, on every
  branch and every session, while pull requests still displayed check names. For part of
  that evening nothing whatsoever was enforced, anywhere.

The second one is the important one. A gate that is red is a gate that is working. A gate
that never starts, on a private repo where branch protection was unavailable, is an
absence that looks like coverage.

And the local half had quietly drifted: `npm run verify` runs four things — lint,
lint:css, check, build — while the two workflows between them run **twenty-eight**. The
token drift gate, three package test suites, four Storybook gates, the accessibility
suite and the production audit had no local equivalent at all.

---

## 2. The commands

| Command | Runs | When |
|---|---|---|
| `npm run ci` | every `run:` step in both workflows, plus the local-only case audit | **before opening or merging a PR** |
| `npm run ci:fast` | the same, minus the build, Playwright install and Storybook smoke | while iterating |
| `npm run ci:list` | what would run, and what would be skipped and why | when something is unexpectedly absent |
| `npm run ci:clean` | a throwaway worktree at `HEAD`, `npm ci` from the lockfile, then the suite | before a release, or when a dependency moved |
| `npm run check:case` | the case audit alone | seconds; also runs in `pre-push` |

Useful flags: `--only=<substring>`, `--skip=<substring>`, `--workflow=apps|ds`,
`--keep-going`.

---

## 3. What is local-ONLY, and why that is not a mistake

The runner adds one step the workflows do not have and should not:

**Case sensitivity.** macOS is case-insensitive, so
`import … from "../Components/button"` resolves here and fails on ubuntu with *Module not
found*. On the Linux runner the compiler already enforces this; here nothing does. The
audit checks every relative import against the real directory entries, and that no two
tracked paths differ only by case.

A local CI that only mirrors the remote one is blind exactly where the two platforms
differ. That is the point of the step, not an inconsistency.

---

## 4. The three things it does not prove — say them, do not bury them

Printed at the end of every run, because a runner that implies full parity is the failure
mode this whole file exists to prevent.

1. **A clean install.** These gates run against whatever npm has hoisted here over months.
   `apps-ci.yml` records a consolidation that *"kept passing locally purely on stale
   hoisted node_modules — a state `npm ci` would never reproduce"*. This bit again while
   the runner was being built: a symlinked `node_modules` resolved `@mosje/design-system`
   to a different branch's source and reported a healthy tree as broken. **`--clean` is
   the only honest answer**, and it tests the COMMIT, not your working tree.
2. **Linux.** The case audit covers the one class this platform hides. It does not cover
   line endings, a native module that builds differently, path length, or a
   locale-dependent sort.
3. **That it ran at all.** A hook is advisory; `git push --no-verify` skips it. Only a
   required status check is a gate. **Branch protection is free on a public repository** —
   `AGENTS.md` records that it was unavailable because it "needs GitHub Pro on a private
   repo", and that `main` once stayed red for three days across twenty runs unnoticed as a
   direct result.

---

## 5. The hook, and why it is calibrated rather than maximal

```
push to main       → npm run ci        the full suite
push anywhere else → case audit + hub typecheck    seconds
```

**A hook people bypass is worse than no hook**, because it manufactures the belief that
something was checked. Several minutes on every feature-branch push buys one week of
compliance and then a habit of `--no-verify`. So the branch path is deliberately cheap and
catches the two things a branch push actually gets wrong — a broken type, and a wrongly
cased import that this filesystem hides.

**The full suite before a PR is a human step.** There is no local hook at merge time,
because merges happen server-side.

---

## Checklist

- [ ] `npm run ci` green before opening or merging a PR
- [ ] `npm run ci:clean` when a dependency moved, or before a release
- [ ] A new CI gate needs no local change — confirm with `npm run ci:list`
- [ ] A local-only check is justified by a PLATFORM difference, not by convenience
- [ ] Branch protection enabled whenever the repository is public
