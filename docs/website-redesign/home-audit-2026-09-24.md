# Home Page Audit — 24 September 2026

`/website` on PR #580, audited at **1440×900** and **375×812**, after the day's
rebuild (`98c9df57`). Checked: axe-core against WCAG 2.0/2.1/2.2 A and AA plus
best-practice, the console, every HTTP response, heading order, horizontal
overflow at 375 and 320, target sizes against SC 2.5.8, a 58-stop keyboard walk,
`prefers-reduced-motion`, every image, and each section against its Figma frame.

Evidence: `shots/home-audit/` and the section sheets captured with this pass.

## Verdict

**Ready, with one defect of our own.** Eleven link rows are two to five pixels
short of the 24×24 target minimum, in the two sections rebuilt today. Everything
else this page owns is clean; the remaining findings belong to the third-party
accessibility widget and to a design the data cannot fill.

| | desktop | phone |
|---|---|---|
| Page height | 9,718px (was 13,051 this morning) | 16,611px (was 20,787) |
| axe violations from our markup | **0** | **0** |
| Console errors | none | none |
| HTTP ≥ 400 | none | none |
| Horizontal overflow | none | none (nor at 320) |
| `<h1>` | one | one |
| Heading order | no skipped levels | no skipped levels |
| Broken images | none | none |
| Truncated or cut titles | none | none |

## 1 · Our defect: eleven link rows under 24px (WCAG 2.2 SC 2.5.8, AA)

A link that is its own row is not covered by the criterion's "inline" exception —
that exception is for a target inside a sentence. These are 19–22px tall against
a 24px minimum.

| Where | Rows | Height |
|---|---|---|
| Our Offerings · scheme titles (`.wn-off__scheme-name a`) | 3 | 22px |
| Our Offerings · What's New items (`.wn-off__news-link`) | 3 of 6 — the rest wrap to two lines and clear it | 19px |
| Our Offerings · What's New "View All" (`.wn-off__news-all`) | 1 | 20px |
| Activity Corner · card titles (`.wn-act__title a`) | 4 | 22px |

Eleven at 1440; four at 375, where more of the titles wrap and clear the minimum
on their own. Both sections were built today, so this is new. The fix is a
minimum height or vertical padding on the link itself, not on its row — a row
that is tall enough while its link is not still fails.

**Not counted:** four genuinely inline links, which the exception covers.

## 2 · The UX4G accessibility widget — third party, reported upstream

| Finding | axe rule | Impact | Count |
|---|---|---|---|
| Five `<header>` elements inside the widget's panel become banner landmarks beside the page's own | `landmark-no-duplicate-banner`, `landmark-unique` | moderate | 2 |
| Positive `tabindex` on the panel's close button and its sixteen feature rows | `tabindex` | serious | 18 |

Both are in markup the vendor injects. `.claude/rules/accessibility-entry-point.md`
§7 puts the panel's interior out of bounds — it is a MeitY control, and the one
thing this estate may not do is reach inside it. They are the only axe findings
on the page at either width, and they are identical at both, so nothing about
this page causes them. **Worth raising with the widget's maintainers.**

## 3 · Clean, and checked rather than assumed

- **Keyboard**: 58 stops walked. Every one carries a visible focus indicator —
  including the two that first looked bare: the masthead search draws its ring on
  the field wrapper, and the carousel dots draw theirs on a `::before`, so an
  element-level check reports a false negative on both. **Nothing** came to rest
  underneath the sticky masthead (SC 2.4.11).
- **Reduced motion**: with `prefers-reduced-motion: reduce`, nothing on the page
  is still animating — the logo marquee and the banner carousel both stop.
- **Reflow (SC 1.4.10)**: no horizontal scroll at 375 or at 320. The carousel's
  off-screen slides extend past the viewport inside their own clipped track,
  which is how a track works.
- **Images**: 59 on the page, none broken, none missing a declared size. The
  first banner slide is eager; every later one is lazy.
- **Headings**: one `<h1>`, twelve `<h2>`, no level skipped. The What's New
  heading reads "campaignWhat's New" in `textContent` because of the Material
  Symbols ligature — the glyph carries `aria-hidden="true"`, so a screen reader
  hears "What's New".

## 4 · Against the design

Every section matches its Figma frame in structure and order, with the
divergences already recorded in each component's source and in the changelog:
no invented descriptions on document, event or organisation cards; What's New
does not auto-scroll; the tabs carry no icons; the figures bar is flat where the
design paints a gradient; the divisions list stays.

**One section still does not match, and cannot yet.** "Explore our Social Media
Platforms" draws real Facebook, X and Instagram posts — avatars, text, photographs,
like and comment counts. No feed publishes them to this site and no snapshot of
them is committed, so the page shows the Department's five official accounts
instead. It needs an API or an export from the Department; fabricated posts on a
departmental page are not an option.

## 5 · Worth a decision, not defects

- **The centre locator paginates 483 centres into 97 pages of five** on the home
  page. That is the page-size decision taken when the locator was added here
  (ten on its own page, five here); 97 is what 483 divided by five looks like in
  a pager.
- **The demo flask and the assistant launcher** sit over content in several
  phone captures. The flask is demo tooling and will not be in production; the
  assistant is real chrome and yields on surfaces marked for it.
