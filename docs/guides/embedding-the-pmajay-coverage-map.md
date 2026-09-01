# Embedding the PM-AJAY coverage map in WordPress (Elementor)

The Scheme Coverage section — the whole card, from the two layer keys at the top
to Download CSV at the bottom — is served as a standalone route and framed by
the WordPress page. One deployment, one codebase, and the embed updates when the
estate does.

**Route:** `/embed/pmajay-coverage`

---

## 1. Paste this into an Elementor **HTML** widget

Add an *HTML* widget where the map should appear and paste the block below. Change
nothing except `EMBED_SRC` if the estate is served from another host.

```html
<div class="pmajay-embed">
  <iframe
    src="https://mosje-samavesh.vercel.app/embed/pmajay-coverage"
    title="PM-AJAY Scheme Coverage — villages declared as Adarsh Gram and hostels sanctioned under the scheme"
    loading="lazy"
    scrolling="no"
    style="width:100%;border:0;display:block;height:1700px"
  ></iframe>
</div>

<script>
(function () {
  var wrap = document.currentScript.closest('.pmajay-embed');
  var frame = wrap.querySelector('iframe');
  window.addEventListener('message', function (e) {
    // Accept height reports from the embed and nothing else. Check the ORIGIN
    // before trusting the payload: any page on the internet can postMessage
    // into this window.
    if (e.source !== frame.contentWindow) return;
    var d = e.data;
    if (!d || d.type !== 'pmajay-embed:height') return;
    var h = parseInt(d.height, 10);
    if (h > 0 && h < 20000) frame.style.height = h + 'px';
  });
})();
</script>
```

**Why the script.** An iframe does not grow with its contents; the host sets a
height and the frame scrolls inside it. This one is not a fixed block — it
changes height when a reader drills into a state, when the hostel filters wrap
on a narrow screen, and when the village list's empty state replaces ten rows
with one sentence. The frame measures itself and posts its height; this listener
applies it. Without the script the embed still works — it just keeps the
`1700px` fallback, which is tall enough for the default view.

**Elementor settings for the section holding it:** no extra padding (the card
brings its own), and full width if the surrounding content column is narrower
than about 900px. Below that the card stacks its map above the list on its own.

---

## 2. Allow the department's domain to frame it

Two deliberate holes had to be opened, and both are in this repository rather
than in WordPress.

### The site gate

`apps/hub/src/proxy.ts` lists embed routes in `EMBED_ROUTES`, which the gate
skips. A framed password wall is not a wall — nobody can type into it, so the
embed would simply render as a login box inside the article.

The list is explicit, not a `/embed/*` prefix, so a new embed route is public
only when someone adds it there.

### `frame-ancestors`

`apps/hub/next.config.ts` sends a CSP on `/embed/:path*` naming the hosts allowed
to frame it, and deliberately does **not** send `X-Frame-Options` on those routes
— `SAMEORIGIN` would deny the frame in any browser that ignored the CSP.

Default: `'self' https://dosje.gov.in https://*.dosje.gov.in`

To add a staging or preview host, set the environment variable — no code change:

```
EMBED_FRAME_ANCESTORS='self' https://dosje.gov.in https://*.dosje.gov.in https://staging.example.gov.in
```

> **Never set this to `*`.** It would let any site on the internet put a
> Government of India map inside their own page, under their own branding, with
> their own text around it.

---

## 3. What the embed deliberately does not carry

No masthead, no footer, no breadcrumb, no accessibility widget, no chat
launcher, no demo rail. The host page has its own chrome and its own
accessibility controls; a second set inside a frame is two of everything the
citizen has to tell apart.

The accessibility widget is the part worth stating plainly.
`.claude/rules/accessibility-entry-point.md` requires it on every page and calls
a page without a door to it a WCAG regression — but an embed is not a page. It
has no `<h1>`, no navigation and no landing route, and the page the reader is
actually on supplies the door. Two widgets inside one visual page is exactly the
"two doors" defect that rule exists to prevent, so honouring its intent means
leaving ours out. See `NotInEmbed`.

**If this is ever embedded in a host with no accessibility controls of its own,
that decision has to be revisited.**

---

## 4. What it costs the host page

| | |
|---|---|
| Initial payload | the section, its tokens, and a 22 KB gzipped mirrored snapshot |
| Village name index | 83 KB gzipped, fetched only when a reader types two characters into the search |
| Live figures | fetched server-side, revalidated hourly, falling back to the committed snapshot |

Nothing is fetched from the reader's browser to the department's API — the frame
talks to the estate, and the estate talks to the MIS.

---

## 5. Checking it worked

- The card renders with its heading, the map, the ranked list and Download CSV.
- No password wall, and no second accessibility button floating over the article.
- The frame grows and shrinks as you drill into a state — if it does not, the
  script in step 1 is missing or the origin check is rejecting the message.
- Nothing scrolls inside the frame.
