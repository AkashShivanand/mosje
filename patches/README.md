# Dependency patches

Applied by `patch-package` from the root `postinstall` script, so every `npm install`
and `npm ci` — local, CI and Vercel — gets them. A patch is a stopgap for a defect we
cannot fix in our own code; each one says when it can go.

## `next+16.3.6.patch` — dev-server race on `prerender-manifest.json`

**Development only.** The patched file is `dist/server/dev/next-dev-server.js`, which
`next build` and the deployed site never load.

**The defect.** The first time a route with `generateStaticParams` renders, the dev
server reads `.next/dev/prerender-manifest.json`, adds the route, and writes it back
with a plain `writeFile`. Two such routes rendering for the first time together race:
one request reads the file while the other is mid-write, `JSON.parse` throws
(`Unexpected end of JSON input`, or `Unexpected non-whitespace character after JSON`
when two writes interleave) and that request answers **500**. A retry succeeds, the
stack shows only `at JSON.parse (<anonymous>)`, and which page loses is random — on
1 Oct 2026 a DBIM crawl reported the Detailed Demand for Grant register as broken, and
a re-crawl failed four different pages instead.

**The patch.** Serialises the read-modify-write behind one in-process promise, and
replaces the file by `rename` from a temporary file, the way Next already writes its
Turbopack manifests (`lib/fs/write-atomic.js`). It also closes the lost-update window
where two routes' entries overwrote each other.

**Evidence** (cold `next dev`, the 357-page DBIM crawl):

| Build | Concurrency | 500s |
|---|---|---|
| unpatched | 8 | 4 (a different set each run) |
| patched | 8 | 0 |
| patched | 24 | 0 |

**When to remove it.** Still present in Next 16.3.8. On a Next upgrade, check
`dist/server/dev/next-dev-server.js` for the plain `writeFile` of `PRERENDER_MANIFEST`:
if it is gone, delete this patch (and `patch-package` with it, if it is the last one).
If it remains, regenerate the patch for the new version with `npx patch-package next`.
`patch-package` fails the install loudly when a patch no longer applies, so an upgrade
cannot drop it silently.
