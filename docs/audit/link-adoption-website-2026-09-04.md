# Link adoption — the website, first pass

**Scope:** `apps/hub/src/app/website/**` and `apps/hub/src/components/website/**`.
**Branch:** `ds/link-adoption-website`. **Date:** 2026-09-04.

---

## 1. What was actually wrong — and what was not

The `Link` component's own docstring cites two counts from the survey that
justified building it: 194 hand-rolled brand-coloured anchors across the hub, and
"twenty-nine of the fifty-eight `target="_blank"` call sites carried no `rel`".

**The `rel` half of that is no longer true and should not be repeated.** Measured
on 2026-09-04 by parsing every JSX `<a>` and `<Link>` opening tag in
`apps/hub/src` — not by a line-based grep, which misses a `rel` written on the
following line and was how the figure was first mis-read in this session:

| | Count |
|---|---:|
| `target="_blank"` elements, hub-wide | 57 |
| …carrying neither `noopener` nor `noreferrer` | **0** |

Every external link on the estate is already safe against reverse tabnabbing.

**What IS wrong is different, and it was unanimous.** Of the 22 external links in
the website scope, **22 announced nothing**: no open-in-new glyph for the people
who can see, and no text in the accessible name for the people who cannot.

GIGW 3.0 requires telling the reader when a link opens a new window. That
requirement had no component behind it, so every call site was left to remember
it, and none did. That is the defect this pass closes.

---

## 2. `Button` gained `external`, because two of the 22 are buttons

Five of the 22 are styled as buttons via `buttonClasses(...)` on a raw `<a>`.
Per the design-system-first rule, the missing capability goes into the DS before
it is used, so `Button`'s link form now takes `external` with exactly the
contract `Link` already carried: sets `target`/`rel`, draws the glyph, appends a
visually hidden "(opens in a new tab)" to the accessible name.

Three decisions inside that are worth stating:

- **`external` is gated on `href`.** A `<button>` cannot navigate, so announcing
  that it opens a tab would be a lie and drawing the glyph would advertise it.
- **A caller's own `iconRight` wins over the glyph.** Passing one is a deliberate
  statement about what the control means. The hidden warning is added either way,
  so the announcement is never the thing that gets dropped.
- **`.ds-sr-only` is declared in `button.css`, not borrowed.** Same standalone
  pattern `link.css`, `chip.css` and `wizard.css` use — a component stylesheet
  that depends on another file's class breaks the moment that file is not loaded.

---

## 3. The one external link deliberately NOT marked `external`

`DocumentCatalog`'s **"Download PDF"** carries `download`, so the browser saves
the file rather than opening a tab. Marking it `external` would have appended
"(opens in a new tab)" to a control that opens no tab — a false statement in the
accessible name, which is worse than the silence it replaced. It keeps
`target="_blank"` (and so still takes `Button`'s automatic `rel`), and its label
already says what it does.

The sibling **"View Online"** does open a tab, and is `external`.

---

## 4. What changed visually, and what did not

| Surface | Change |
|---|---|
| Prose links inside `.gov-prose` | **None.** `.gov-prose a` is unlayered CSS, and unlayered beats every `@layer`, so it still supplies the colour and underline. The DS focus ring does apply, because that rule sets no `outline`. |
| Standalone CTAs previously carrying `underline` | Underline is now on hover and focus rather than at rest. Permitted by WCAG 2.2 §1.4.1 because these are not inside a block of text, and it is the DS's settled position for a standalone link. |
| Social-handle chips (`OrganisationDetail`) | The trailing open-in-new glyph now takes the label's colour instead of `text-neutral-subtle`. |
| Hand-rolled `focus-visible:outline-*` utilities on `SocialMedia`'s share link | Removed — the token-bound DS focus ring replaces them. |

The pill, chip and coloured-CTA classNames are all preserved: Tailwind utilities
sit in `@layer utilities`, which outranks the DS's `@layer components`, so
`bg-primary`, `text-white`, `rounded-full` and the rest still win.

---

## 5. Deferred, with reasons

- **`.gov-prose a` is unlayered.** It should move into `@layer base` so DS link
  tokens reach prose links, but it also styles injected/scraped organisation HTML,
  so the change needs its own visual pass. Not touched here.
- **The `href="#"` placeholder links.** Roughly 30 across six website pages
  (`policies-acts-rules-*`, `organisation-under-division-social-division`,
  `list-of-research-evaluation-studies`, `contact-person`) point at `#`. They are
  content gaps, not styling gaps — fixing them needs the department's real
  destinations, and they were left exactly as found.
- **Category C: standalone "Read more" links that are not external.** Perhaps 40
  more hand-rolled `text-primary hover:underline` anchors and `next/link`s in this
  scope. They are not defective today, only inconsistent, so they belong in a
  second pass rather than inflating this one.
- **Card-wrapper affordances** (`PageHero`'s badge, `Offerings`, `search`'s result
  rows) look like links but are whole-card click targets. `Link` is the wrong
  component for them and they were left alone.
- **The portals.** 35 of the 57 external links hub-wide are outside the website.

---

## 6. Two things found while verifying, neither introduced here

**The estate says the new-window warning two different ways.** Measured across
`packages/design-system`:

| Wording | Components |
|---|---|
| "(opens in a new tab)" | `Link`, `Button` (new), `PortalCard`, `ContentNav`, `nav-parts`, `DocumentLibrary` |
| "(opens in a new window)" | `SiteFooter`, `SiteHeader` |

`Button` follows `Link`, which is the majority. Reconciling the two is a DS-wide
copy decision touching two more components, their docs pages and their tests, so
it is recorded rather than done here.

**One external link on every page carries no `rel` — and it is not ours.** A
footer credit anchor rendered with `class="copyright-text"` and `target="_blank"`
has no `rel` at all. It does not exist anywhere in `apps/hub/src` or
`packages/design-system`: it is injected at runtime by the third-party UX4G
accessibility widget, the same markup `floating-element-placement.md` notes we
cannot annotate. It is recorded here so the next person auditing links does not
spend an afternoon looking for it in the source.

---

## 7. Naming

Four files imported `next/link` as `Link`, colliding with the DS component. They
now import it as `NextLink`, leaving `Link` to mean the design-system component
everywhere in the website scope. `next/link` remains correct for internal
navigation — the rename is about which name is the default, not about replacing it.
