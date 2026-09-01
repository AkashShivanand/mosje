# Embedding the PM-AJAY coverage map in WordPress (Elementor)

The Scheme Coverage section — the whole card, from the two layer keys at the top
to Download CSV at the bottom — is handed over as **files the department hosts
itself**. Nothing is fetched from a MoSJE origin at runtime.

```bash
npm run build:pmajay-standalone
```

| File | Size | What it is |
|---|---|---|
| `pmajay-coverage-map.html` | 1,491 KB raw · **295 KB gzipped** | **One paste.** Everything inline, no upload |
| `pmajay-coverage-map.js` | 1,060 KB raw · **212 KB gzipped** | The card, as a file |
| `pmajay-villages.json` | 426 KB raw · **81 KB gzipped** | The village index, fetched on demand |

Two installs, both supported. Pick by whether the department can put files on
its own server.

---

## Option A — one paste, no upload (default)

Open `dist/pmajay-standalone/pmajay-coverage-map.html`, copy the whole file, and
paste it into an Elementor **HTML** widget. That is the entire integration: no
upload, no file path, no plugin, no settings screen, no CSP change.

The file opens with a header written for whoever inherits it — what the three
blocks are, which one is safe to delete, and exactly what the page inherits.
**Do not strip that header.** It is the only documentation that travels with the
paste, and the person who next opens it will not have this repository.

## Option B — two files, when page weight matters

Upload `pmajay-coverage-map.js` and `pmajay-villages.json` to the **same
directory** on the WordPress server (the Media Library is fine), then paste:

```html
<pmajay-coverage-map></pmajay-coverage-map>
<script src="/wp-content/uploads/pmajay/pmajay-coverage-map.js" defer></script>
```

The script finds the JSON beside itself, so no path needs configuring. If the
host keeps media and scripts in different places, name it:

```html
<pmajay-coverage-map villages-src="https://example.gov.in/data/pmajay-villages.json"></pmajay-coverage-map>
```

### Which to use

Option A costs **83 KB gzipped more on every page view**, and inline script is
**not cached across pages** — a reader visiting three pages carrying the card
downloads it three times, where a file is fetched once. It is also markup stored
in the post, so the builder re-serialises the whole thing on every save and the
editor gets slow to work in.

Option B is the one to reach for if the card appears on several pages, or if
page weight is being watched. Otherwise Option A's simplicity is worth the 83 KB
— that is a judgement for whoever runs the site, which is why both are built.

---

## What it does to the rest of the page

**Nothing, with two named exceptions.** The card renders inside a **shadow
root**, which is the only mechanism that isolates in both directions at once:

- The theme's CSS cannot reach in and restyle a government chart.
- The estate's 557 KB token contract cannot leak out and restyle the theme.

The two things that do reach the host document, both deliberate:

1. **One `@font-face`**, injected into `<head>`, for the icon glyphs. A font
   registry is per-document — a face declared inside a shadow root is ignored —
   so this one is unavoidable. It is named **`"PMAJAY Symbols"`**, deliberately
   a name nothing else uses, so a host already loading Material Symbols or Font
   Awesome cannot end up with two faces claiming one family. It carries no
   selector and matches no element of the host's.
2. **One custom element name**, `pmajay-coverage-map`.

No global styles, no classes added to the host's markup, no existing element
touched, no global event handlers.

**Verified, not asserted.** Against a deliberately hostile theme — `body
{ font-family: Georgia; color: #7a0000 }`, `button { background: hotpink
!important }`, `input { border: 4px dashed purple !important }`, `* { box-sizing:
content-box }`, and a Material Symbols face of the host's own — every host
element measured identical before and after, and the card rendered in Noto Sans
with its own palette and its own icons.

### Two things a shadow root does *not* do

Both are handled in `tools/pmajay-standalone/host.css`, and both were found by
running the bundle rather than by reasoning about it:

- **Inherited properties still cross the boundary.** Font, colour and
  letter-spacing come in from the host unless the element states its own. It
  does.
- **The browser's own stylesheet still applies inside.** The design system is
  authored against Tailwind Preflight, which nothing loads here, so the
  user-agent defaults it exists to flatten came back — every breadcrumb and
  pager control rendered with Chrome's `2px outset` bevel on a grey ground, and
  every link came back underlined. That is the mirror image of the risk everyone
  worries about with an embed: the host page was never in danger, the *card* was,
  from styles the host does not control. `host.css` is Preflight's subset for
  the elements this card uses, in the `base` layer so it cannot outrank the
  card's own hairlines.

---

## The data it shows

The snapshot committed in this repository, dated by `PMAJAY_REACH_AS_ON`. The
bundle has no live feed by construction — it takes the same code path the site
takes when the department's API does not answer, so it draws the mirror and says
so.

**Re-run the build and re-paste after the snapshot is refreshed**, or the
embedded card will keep showing the old figures while the site shows new ones.

## The one external request

The design system's `icons.css` loads **Material Symbols from
`fonts.gstatic.com`**. That is not a MoSJE origin, so it meets the requirement as
stated — but it is a third-party request from a government page, and it pulls
5.3 MB for the eight glyphs this card uses.

**Recommended follow-up:** subset the font to those eight glyphs and inline it as
a `data:` URI, which removes the last external request and most of the weight.
It needs `fonttools`, which was not available on the build machine.

## Checking it worked

- The card renders with its two layer keys, the map, the ranked list, the pager
  and Download CSV inside one bordered card.
- The page's own fonts, colours and icons are unchanged around it.
- Buttons inside the card have **no bevel** and links are **not underlined at
  rest** — if either appears, `host.css` did not reach the build.
- DevTools → Network shows requests only for the file(s) above (plus the Google
  font). **Any request to a `mosje` or `vercel.app` host means the wrong build is
  deployed.**
- Typing two characters into the search returns matches — from the inline block
  under Option A, from the fetched JSON under Option B.
