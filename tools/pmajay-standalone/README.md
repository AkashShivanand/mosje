# Exporting a component as a standalone embed

**This directory is a one-off deliverable, not a product surface**, and it is
built to stay that way. But the *machinery* is the reusable part, and the next
export should not have to rediscover what this one paid for.

Read this before exporting a different component.

---

## What this is, and what it deliberately is not

`npm run build:pmajay-standalone` bundles one component into files the
department hosts on its own server, with no runtime call back to this estate.
It was built for the PM-AJAY coverage card and used once.

It is **not** wired into anything:

| | |
|---|---|
| App code importing this tool | **none** — the dependency runs one way only |
| CI jobs | **none** |
| Build output in git | **none** — `dist/` is gitignored |
| Cost of deleting the directory | one npm script, and the two functions below |

That isolation is the point. Delete this directory and the estate does not
notice.

### The one thread into app code

Two exports in `apps/hub/src/lib/website/pmajay-villages.ts` exist **only** for
this tool and have no caller in the app:

- `setVillageIndexSource(url)` — points the index at a file beside the script
  rather than at the hub's public folder.
- `primeVillageIndex(body)` — fills the index from data already on the page,
  for the single-file build.

They are small, documented at their definition, and harmless. If this directory
is ever removed, they go with it.

---

## What carries over to the next component, and what does not

**`build.mjs` and `host.css` are the reusable ~90%.** `entry.tsx` is the
per-component file and will be rewritten each time — it names the component, its
data, and its providers.

Everything below is in `build.mjs` or `host.css` and applies to *any* component
pulled out of this estate. Each one is here because it failed first.

### 1. A shadow root needs its CSS as a string; esbuild emits it as a file

Hence two passes: bundle once to collect the CSS, rewrite it, inline it into the
second build through `define`. Do not try to `import` the CSS text.

### 2. `:root` never matches a shadow host

The whole token contract resolves to nothing without the `:root` → `:host`
rewrite. `html` and `body` selectors go the same way — there is no html or body
inside a shadow tree.

### 3. There are two Reacts in this workspace

19.2.7 at the root, 19.2.4 under `apps/hub`. Unpinned, the entry and the design
system take one and everything under `apps/hub/src` takes the other. It fails as
`Cannot read properties of null (reading 'useSyncExternalStore')` — a hook
nobody wrote, in a file nobody edited. The `alias` block pins both.

### 4. `process` does not exist in a browser

App code reads `process.env.NEXT_PUBLIC_*`, which Next would have substituted at
build time. Unshimmed it throws while evaluating, the custom element never
registers, and **the page shows nothing** with the cause only in the console —
the loudest failure with the quietest symptom. A `banner`, not a `define`:
esbuild rejects `({})` as an invalid define value.

### 5. The token contract must be imported explicitly

In the hub it arrives via `globals.css`, which nothing here loads. Without
`tokens.css` and `icons.css` the card **lays out perfectly and renders
colourless** — structurally correct and visually absent, which reads as a
styling opinion rather than a missing file.

### 6. A shadow root blocks selectors, not inheritance — and not the UA

Two separate problems, both in `host.css`:

- **Inherited properties cross the boundary.** Font, colour and letter-spacing
  come in from the host page unless the element states its own.
- **The browser's own stylesheet still applies inside.** The design system is
  authored against Tailwind Preflight, which nothing loads here, so the UA
  defaults came back: Chrome's `2px outset` bevel on every button, an underline
  on every link, and `box-sizing: content-box` under a system authored entirely
  against `border-box`.

`host.css` is Preflight's subset for the elements in play, and it lives in the
**`base` layer**. Unlayered, `*, ::before, ::after { border: 0 solid }` beats
every layered rule in the estate and erases the component's own hairlines
instead of only the UA's bevels.

### 7. `@font-face` cannot live in a shadow root, so rename the family

A font registry is per-document, so the icon face must be declared into the
host's `<head>` or glyphs render as the literal word `chevron_right`. That is
the **only** style this kind of embed puts in a page it does not own — so it
gets a private family name (`"PMAJAY Symbols"`), renamed in the shadow CSS to
match. Under its real name, a host already loading Material Symbols ends up with
two faces claiming one family and its own icons silently change.

### 8. Weigh the payload before bundling it

The village index took the bundle from 195 KB gzipped to 278 — 30% of every
download, for a lookup most readers never run. Split into a sibling file fetched
on the second character typed. The single-file build inlines it again and says
so, because one paste is worth 83 KB to some installs and not to others.

**Both are built and the guide states the tradeoff** rather than choosing for
the department: `docs/guides/embedding-the-pmajay-coverage-map.md`.

---

## Doing the next export

1. Copy this directory. Rewrite `entry.tsx` only — the component, its data, its
   providers, and any sidecar asset.
2. Adjust `VILLAGES_SRC` and the single-file inline block, or drop both if the
   new component has no sidecar.
3. Rewrite the documentation header in `build.mjs`. It is written for whoever
   opens the pasted file cold with no access to this repository; that is the
   only documentation that travels with the paste.
4. Set the size ceiling deliberately.
5. **Verify against a hostile theme, not an empty page.** Every defect above
   survived a clean test page. The one that catches them is a host with
   `body { font-family: Georgia; color: #7a0000 }`, `button { background:
   hotpink !important }`, `input { border: 4px dashed purple !important }`,
   `* { box-sizing: content-box }`, and its own copy of the icon font. Measure
   the host's computed styles before and after — do not eyeball it.
6. Check the network log shows **only** the files you shipped. Any request to a
   `mosje` or `vercel.app` host means the wrong build is deployed.

## Still open

The design system's `icons.css` loads **Material Symbols from
`fonts.gstatic.com`** — 5.3 MB for the eight glyphs this card uses, and the last
external request a government page makes here. Subsetting it to those glyphs and
inlining it as a `data:` URI removes it. It needs `fonttools`, which was not
installed on the build machine.
