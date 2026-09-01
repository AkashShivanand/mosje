# Embedding the PM-AJAY coverage map in WordPress (Elementor)

The Scheme Coverage section — the whole card, from the two layer keys at the top
to Download CSV at the bottom — ships as **two files you upload to the
department's own server**. Nothing is fetched from a MoSJE origin at runtime.

```bash
npm run build:pmajay-standalone
# → dist/pmajay-standalone/pmajay-coverage-map.js    211 KB gzipped
# → dist/pmajay-standalone/pmajay-villages.json       81 KB gzipped
```

---

## 1. Upload both files

Put them in the **same directory** on the WordPress server — the Media Library
is fine. The script finds the JSON beside itself, so no path needs configuring.

If the host insists on separate locations, point at it explicitly:

```html
<pmajay-coverage-map villages-src="https://example.gov.in/data/pmajay-villages.json"></pmajay-coverage-map>
```

## 2. Paste this into an Elementor **HTML** widget

```html
<pmajay-coverage-map></pmajay-coverage-map>
<script src="/wp-content/uploads/pmajay/pmajay-coverage-map.js" defer></script>
```

That is the whole integration. No iframe, no height script, no CSP change, no
gate exemption — the card is part of the page and grows with its own content.

---

## What the two files are, and why two

| | |
|---|---|
| `pmajay-coverage-map.js` | React, the design system, the token contract, the India outlines and the mirrored snapshot — 211 KB gzipped |
| `pmajay-villages.json` | 10,157 village names, **fetched only when someone types two characters** into the search — 81 KB gzipped |

Bundled together they came to 278 KB gzipped, and 30% of every page load would
have been an index most readers never touch. Split, a page where nobody searches
a village never pays for it. It is the same rule the estate's own site uses.

## How it stays out of the theme's way

The card is a custom element with a **shadow root**, which is the only thing that
gives both directions of isolation:

- The theme's CSS cannot reach in and restyle a government chart.
- The estate's token contract cannot leak out and restyle the theme.

Verified against a deliberately hostile theme (`body { font-family: Georgia;
color: #7a0000 }`, `button { background: hotpink !important }`, `input { border:
4px dashed purple }`): the card rendered in Noto Sans with its own palette, and
the theme's button was still hotpink afterwards.

**Two things a shadow root does *not* do**, both handled in `host.css`:

- **Inherited properties still cross the boundary.** Font, colour and
  letter-spacing come in from the host unless the element states its own. It
  does.
- **`box-sizing` is not inherited, and defaults to `content-box`** inside a tree
  the estate's reset never reached. Every width in the design system is authored
  against `border-box`.

## The data it shows

The snapshot committed in this repository, dated by `PMAJAY_REACH_AS_ON`. The
bundle has no live feed by construction — it takes the same code path the site
takes when the department's API does not answer, so it draws the mirror and says
so.

**Re-run the build after refreshing the snapshot**, or the embedded card will
keep showing the old figures while the site shows new ones.

## The one external request

The design system's `icons.css` loads **Material Symbols from
`fonts.gstatic.com`**. That is not a MoSJE origin, so it meets the requirement as
stated — but it is a third-party request from a government page, and it pulls
5.3 MB for the eight glyphs this card uses.

**Recommended follow-up:** subset the font to those eight glyphs and inline it as
a `data:` URI, which removes the last external request and most of the weight.
It needs `fonttools`, which was not available on the build machine.

## Checking it worked

- The card renders with its heading, the map, the ranked list and Download CSV.
- The page's own fonts and colours are unchanged around it.
- DevTools → Network shows requests only for the two files above (plus the
  Google font). **Any request to a `mosje` or `vercel.app` host means the wrong
  build is deployed.**
- Typing two characters into the search loads the village index and returns
  matches.
