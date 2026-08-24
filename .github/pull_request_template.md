<!--
  GITHUB ACTIONS IS BLOCKED ON BILLING, so the checks on this PR are not a
  signal. They report `failure` after about three seconds without having run
  anything. A red tick here means nothing; a green one would mean nothing
  either. The block clears when the billing period resets.

  Until then the gate is YOU, and it runs before the merge button, not after.
-->

## What this changes



## Verified

- [ ] `npm run verify` passes locally — lint + lint:css + check + build, exactly what Apps CI runs
- [ ] Vercel's preview build is green (the only automated check still running — a red Vercel is never noise)

<!--
  If a step genuinely cannot be run — a Next build inside a git worktree, say,
  where Turbopack rejects the symlinked node_modules — say WHICH step and why,
  rather than ticking the box. An unverified claim is worse than a stated gap.
-->
