<!--
  CI IS THE GATE. Apps CI and Design System Quality both run on every PR and
  both must be green before merge.

  This block previously said GitHub Actions was blocked on billing and that a
  green tick meant nothing. That stopped being true; the note did not, so
  reviewers were being told to disregard the only automated signal the estate
  has — which is exactly how a ratchet silently stops ratcheting.
-->

## What this changes



## Verified

- [ ] `npm run verify` passes locally — lint + lint:css + check + build, exactly what Apps CI runs
- [ ] Apps CI and Design System Quality are green, and Vercel's preview build deployed

<!--
  If a step genuinely cannot be run — a Next build inside a git worktree, say,
  where Turbopack rejects the symlinked node_modules — say WHICH step and why,
  rather than ticking the box. An unverified claim is worse than a stated gap.
-->
