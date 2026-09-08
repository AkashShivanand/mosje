# Vercel free tier hit 100% of both storage limits — 2026-09-08

Two emails from Vercel, both timestamped 2026-09-07 23:06, both saying the free
team had used 100% of a 10 GB allowance: **Function Storage** and **Deployment
Storage**. Nothing was broken; the platform was warning that the next deployment
had nowhere to go.

## What the numbers actually were

| Measurement | Value |
|---|---|
| Retained deployments, `mosje-samavesh` | 1,174 (798 preview · 376 production · 74 canceled/errored) |
| Retained deployments, other two projects | 76 (`sewa-management` 43, `srv-memorial-trust` 33) |
| Retention policy in force | 30 days on preview, production, canceled and errored alike; keep 10 |
| Peak deploy rate | 105 deployments on 2026-09-04 |
| Build output per deployment (`.next/server`) | ~560 MB — 440 MB of prerendered routes, 119 MB of chunks |
| Static payload per deployment (`apps/hub/public`) | 140 MB |
| Function bundle (`standalone/node_modules`) | 42 MB — already well traced, not the problem |

Both allowances are shared across every **retained** deployment, so the sum is
what counts, not any single build. At ~600 MB of build output apiece, the 10 GB
ceiling is reached in roughly **seventeen deployments** of unchanged files, and
far fewer once dedupe stops helping — which it does the moment a shared component
changes and all 1,300 prerendered pages are rewritten.

The heaviest route trees, for the record:

```
225M  .next/server/app/website/       (108M organisation/, 63M schemes-services/)
129M  .next/server/app/design-system/
 80M  .next/server/app/portals/
```

44 organisation pages produce 108 MB — about 460 KB per page once Next 16 has
written `.html`, six `.rsc` variants and the segment-cache entries for each.

## What was done

1. **Took the project from 1,174 retained deployments to 15**, against an explicit
   keep-list: the live production deployment, the four production builds before
   it, and the newest preview for each branch still on origin. The live site was
   checked before and after — `/` still redirects to the gate, `/gate` still
   answers 200, and the production deployment serving them was never a candidate
   for removal.
2. **Gated the build** — `scripts/vercel-ignore-build.sh`, wired through
   `apps/hub/vercel.json`. It skips a preview when the branch has no open pull
   request, and skips any commit whose changed files all sit outside the
   deployment (`docs/`, `Assets/`, `tools/`, `.claude/`, markdown — the same set
   `.vercelignore` already refuses to upload). Measured against the last 300
   commits: **11% of builds avoided**, plus the handful of pre-PR branch pushes.
3. **Made the purge repeatable** — `npm run vercel:prune`, which builds the
   keep-list itself rather than trusting `--safe`.

## What could not be done

**Retention cannot be shortened on this plan.** The dashboard's 30-day figure is
the floor, not a setting: `PATCH /v9/projects` rejects `deploymentExpiration` as
an unknown property, and no retention endpoint exists in the public API spec
(`/v1/projects/{id}/deployment-retention` and `/retention-policy` both 404). On
Pro this is a per-environment control; here the equivalent is running
`npm run vercel:prune` on a schedule.

**And `vercel remove --safe` is not the tool it sounds like.** Vercel gives every
deployment its own `-<hash>-` alias, so `--safe` reads nearly the whole history as
in use: it removed 213 of 1,174 and then reported nothing left to do, twice, while
the account was still at 100%. The prune therefore states its keep-list — the live
production deployment, the four production builds before it, and the newest preview
for each branch still on origin — and deletes everything else. That is what took the
project from 1,174 to 15.

Two things that only showed up in the doing, both now encoded in the script:
a deployment still **building** cannot be removed and the CLI *hangs* rather than
erroring — one such id stalled a batch of ten for three and a half minutes — and a
batch call fails whole, so a failed batch is retried one id at a time.

## Update, same day — branch previews are off by default

The measurement that settles it: **1,174 retained deployments filled exactly
10 GB, so the average retained deployment costs about 8.7 MB.** Deduplication is
doing the heavy lifting — the 140 MB of static assets is stored once, and a
deployment's marginal cost is only what changed. That inverts the conclusion
above: **the count is the problem, not the size of a build.**

798 of the 1,174 were branch previews, and they were rarely opened. So previews
are now off unless a push asks for one — the token `[preview]` in the commit
**subject** — which leaves roughly 376 deployments in a 30-day window, about a
third of the cap, and holds there because the window keeps rolling.

Only the subject line is matched, and that was learned the hard way: the commit
that introduced the rule described the token in its own body, matched itself, and
built the preview it had just switched off. A body discusses the token; a subject
is a person saying what the push is for.

| 30-day window | Retained | Storage |
|---|---|---|
| What happened | 1,174 | 100% of both caps |
| Previews off | ~376 | ~33% |
| Previews off, plus the docs-only rule | ~335 | ~29% |

**Nothing is lost by this.** Review and CI live on the pull request in GitHub
Actions and have never depended on Vercel building a preview. `main` has no branch
protection and no rulesets, so a preview check that does not report cannot block a
merge — checked, not assumed.

**Merging to `main` locally and pushing was considered and rejected.** It would cut
the same 798 deployments, but `.husky/pre-commit` refuses commits on `main` for a
reason: CI then reports after the deploy has already raced it. Turning previews off
achieves the storage saving without touching the branch discipline.

## What is still open

**The build output is the real ceiling, and it has not been addressed.** Purging
buys headroom; it does not change the fact that each deployment costs ~600 MB.
Two levers, neither taken yet because both change how the estate renders:

- **Stop prerendering every route at build time.** `website/organisation/` and
  `website/schemes-services/` prerender 1,300-odd pages into 171 MB. Rendering
  them on demand with ISR instead would cut the build output by roughly two
  thirds, at the cost of a slower first hit per page. For a password-gated
  prototype that trade looks right; for a public government site it needs a
  decision.
- **Drop the server source maps.** `.next/server` carries 2,549 `.map` files,
  **78 MB**, 14% of the build output, and production never reads them. Whether
  Vercel ships them inside the function has NOT been verified here — check that
  before spending the change.
- **Move the 44 MB of QC report PDFs out of `apps/hub/public/reports`.** This was
  on the list and was deliberately not done: PDFs that do not change dedupe across
  deployments, so they cost 44 MB once, not per build — against 600 MB of build
  output every time. Moving them means new URLs for documents a citizen can
  currently download, which is a worse trade than it looks. The two levers above
  are where the storage actually is.

## The measurements behind this

| Where the numbers came from | |
|---|---|
| Deployment counts, targets, ages, PR metadata | `vercel api /v6/deployments`, paged |
| Retention policy in force | `vercel api /v9/projects/<id>` → `deploymentExpiration` |
| Retention not settable | `PATCH /v9/projects` → 400 unknown property; two retention endpoints → 404 |
| Build output composition | `du` over `apps/hub/.next` from the 2026-09-08 06:28 build |
| Build-skip rate | the rule replayed over the last 300 commits |
| Live site unaffected | `curl` against `/` and `/gate` after the purge |
