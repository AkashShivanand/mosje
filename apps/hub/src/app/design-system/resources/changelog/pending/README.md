# Changelog entries that do not have a version yet

**Adding a changelog line? Put one JSON file in this folder. Do not edit
`page.tsx`, and do not choose a version number.**

```jsonc
// pending/site-footer-digital-india.json
{
  "kind": "Fixed",
  "text": "THE FOOTER'S Digital India CREDIT IS THE CANONICAL MARK. …"
}
```

`kind` is one of `Breaking`, `Added`, `Changed`, `Fixed`, `Removed`. A
`Breaking` entry should also carry `"migration"`, saying where a consumer goes
to migrate.

Name the file after the change, not after yourself or the branch —
`site-footer-digital-india.json`, not `akash-3.json`. The name is never shown;
it only has to be unique, and a descriptive one makes a merge obvious.

## Why a folder of files instead of a list in the page

Every branch used to add its release block to the top of the `RELEASES` array in
`page.tsx`. That meant every branch touched the same line, picked the same next
version number, and moved the same `current: true` flag — three guaranteed
collisions, on a file that already had 2,490 lines of history under it.

On 2026-09-16 one small chore branch needed **three merges of `main` in under an
hour**, and all three conflicted here and nowhere else. The project's own remedy
for it — *keep both sets of entries, renumber the unmerged branch upward* — is a
remedy for a wound that did not need inflicting.

Two branches adding two different files merge cleanly, because git has nothing
to reconcile: no shared line, no shared number, no shared flag.

## Where the version comes from

**It is assigned on `main`, after the merge, never in a branch.** That is the
whole point: a number chosen in a branch is a guess about what will land first,
and when the guess is wrong it is a conflict.

Until then the entries render on the changelog page under **Unreleased**, so the
work is visible the moment it lands rather than waiting for someone to cut a
release.

To cut one, on `main`:

```bash
npm run changelog:release
```

That folds every file here into a new release at the top of `page.tsx`, takes
the next minor version from the newest one already there, stamps today's date,
moves the `Current` badge, and deletes the files it folded. Review the diff and
commit it like any other change.

`npm run changelog:release -- --dry-run` prints what it would do and writes
nothing. `-- --version v1.0.0` overrides the computed number, for the day the
next release is not a minor bump.
