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

1. **Purged unaliased deployments.** `vercel remove <project> --safe --yes`, run
   repeatedly. `--safe` keeps the live production deployment and each branch's
   current preview URL; everything superseded goes.
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
for each branch still on origin — and deletes everything else. That took the project
from 806 retained deployments to 13.

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
- **Move the 44 MB of QC report PDFs out of `apps/hub/public/reports`.** Smaller
  effect — unchanged files dedupe across deployments — but it lowers the floor
  every deployment starts from.
