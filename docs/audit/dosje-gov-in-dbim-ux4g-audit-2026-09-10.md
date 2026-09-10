# dosje.gov.in — DBIM 3.0 · GIGW 3.0 · UX4G 3.0 compliance audit

**Target:** `https://www.dosje.gov.in/` — the LIVE departmental website, not the SAMAVESH clone
at `apps/hub/src/app/website/`.
**Audited:** 10 September 2026, 10:00–10:30 IST.
**Method:** live DOM and computed-style inspection at 1440×900 and 320×720, keyboard tab-walk,
network and asset-weight measurement, HTTP header and TLS inspection, PDF structure inspection,
static analysis of 13 downloaded pages.
**Gate:** `docs/compliance/COMPLIANCE-CHECKLIST.md` §1–15. Sources: `docs/guidelines/`.
**Divergence register consulted:** `docs/guidelines/README.md` — no finding below is one of the
estate's twelve recorded deliberate divergences.

> **Platform.** WordPress + Elementor Pro, `hello-elementor` parent with a `mosje` child theme,
> Bootstrap 5, `ux4g-min.css` / `ux4g.min.js` from the UX4G distribution, Bhashini translation
> plugin, served through CloudFront. 160 requests, **3.0 MB** on the home page, of which
> **1.28 MB is JavaScript**.

---

## Headline

| Measure | Result |
|---|---|
| Checklist items scored | **80** (4 further items are governance and cannot be verified externally) |
| PASS | **35** |
| PARTIAL | **19** |
| FAIL | **26** |
| **Compliance (PARTIAL counted as half)** | **55.6 %** |
| Compliance (strict — PARTIAL counted as fail) | 43.8 % |

For reference, the NIC DBIM audit of May 2026 (`docs/source-brd/MoSJE DBIM Audit.pdf`) scored the
site **56.52 % generic / 55.88 % ministry**. **Four months and a redesign later the score has not
moved.** The redesign fixed the things that are easy to see — the site now carries a real design
system, a proper footer lineage, dated content, a working faceted search and one of the most
complete accessibility widgets on any Indian government property — and left almost every item the
original audit flagged with a ⚠️ still open.

**The five that matter most, in order:**

1. **There is no `<h1>` on the home page or the search results page**, and every page in the estate
   opens with eight `<h5>` elements before its `<h1>`.
2. **The two most prominent buttons on the home page have no keyboard focus indicator at all** —
   not a weak one, none — and the ring that other controls do get measures 1.98:1 against white.
3. **Three of four sampled PDFs are untagged**, including a job-application form published as a
   phone photograph with no text layer.
4. **There is no Accessibility Statement**, which is both a GIGW mandate and the one page an
   auditor looks for first.
5. **There is no cookie consent**, while Google Analytics, Facebook and X all load unconditionally.

**And the thing that will surprise people:** the site ships **two primary colours**. `ux4g-min.css`
declares `--bs-primary: #613AF5` and `--bs-link-color: #613AF5` — UX4G's violet — together with a
complete violet 50→900 ramp. The department's key colour `#0373DF` is painted on top by later
overrides. Wherever an override was not written, the violet shows: the skip link, and every control
in the accessibility widget.

---

## §1 Colour & brand `[DBIM A]` — 1 PASS · 1 PARTIAL · 4 FAIL

| # | Item | Verdict | Evidence | Fix |
|---|---|---|---|---|
| 1.1 | One primary colour group `[DBIM 2.1]` ⚠️ | **FAIL** | `ux4g-min.css:root` — `--bs-primary:#613AF5`, `--bs-blue:#613AF5`, `--bs-link-color:#613AF5`, `--bs-link-hover-color:#774BFF`, plus `.bg-primary-50…900` / `.text-primary-*` / `.border-primary-*` utilities for the whole violet ramp (`#FAEFFF`→`#392095`). The department's `#0373DF` is applied by `common.css` overrides on top. Violet renders on `a.skip-link` (`color:#613AF5`) and throughout the accessibility widget (14 `#613AF5` fills). | Re-generate the UX4G Bootstrap build with `--bs-primary` set to `#0373DF` and the ramp re-derived from it, instead of overriding downstream. One key colour, one ramp. |
| 1.2 | Surfaces from a functional palette `[DBIM 2.2]` ⚠️ | **FAIL** | Ten unrelated one-off surface tints on the home page: `#e6f8fa`, `#f4f3f9`, `#fdf0f5`, `#ecd0ff`, `#eceef5`, `#ffedd5`, `#e7f0fd`, `#f8f9fa`, `#f9fafb`, `#f5f5f5`. No declared functional palette they derive from. | Define a functional surface scale off the key colour and neutral ramp; retire the one-offs. |
| 1.3 | Icons key colour or white `[DBIM 3.7]` ⚠️ | **PARTIAL** | Most icons are `#0373df` or white ✓. Exceptions: brand-coloured social glyphs (`#1877f2`, `#c13584`) and violet widget icons. | Brand glyphs are an accepted exception; state it. Fix the violet with 1.1. |
| 1.4 | Footer background = **darkest shade** `[DBIM 5.6]` ⚠️ | **FAIL** | `footer` main band renders `#0373df` — the **base** shade. `#014b92` (the darker shade) appears only on a narrow sub-strip. A third band above sits on `#e5eff9`. | Set the footer body to `#014b92` or darker. This one change also fixes finding 12.6a below. |
| 1.5 | Colour never the sole carrier `[WCAG 1.4.1]` | **PASS** | Links underline on hover and focus; no colour-only status encoding observed. | — |
| 1.6 | Tokens, not raw hex, in components | **FAIL** | `#0373DF` is typed as a literal more than twenty times across `common.css` and `style.css`, alongside `--bs-*` variables that already exist. | Consume `--bs-primary` (once 1.1 is fixed); stop hard-coding the hex. |

## §2 Iconography `[DBIM B]` — 0 PASS · 2 PARTIAL · 4 FAIL

| # | Item | Verdict | Evidence | Fix |
|---|---|---|---|---|
| 2.1 | Consistent style sitewide `[DBIM 3.3]` | **PARTIAL** | Four icon systems coexist: Font Awesome 5 Free (39 glyphs), Font Awesome 5 Brands (5), Elementor `eicons` (8), plus 42 inline `<svg>` and PNG marks. | Pick one. |
| 2.2 | Icons from the DBIM toolkit `[DBIM 3.5]` | **FAIL** | Font Awesome, not the DBIM toolkit. | Adopt the DBIM set, or record the divergence with a reason. |
| 2.3 | PNG / SVG / WEBP only `[DBIM 3.7]` | **FAIL** | **51 icons are webfont glyphs**, which is none of the three permitted formats. A webfont icon also inherits `color` and disappears under the widget's "Hide Images" / high-contrast modes in a way an `<svg>` does not. | Replace the icon fonts with inline SVG. |
| 2.4 | Sizes ∈ 24/32/48/64 `[DBIM 3.7]` ⚠️ | **FAIL** | Measured icon font-sizes: **14px ×31**, 12px ×4, 20px ×4, 25px ×4, 16px ×1 — and only **5 at 24px**. 44 of 51 are off-scale, and 25px is off-scale by one pixel, which reads as an accident rather than a decision. | Snap every icon to 24/32/48/64. |
| 2.5 | Correct proportion, never stretched `[DBIM 3.7]` | **FAIL** | `open_in_new_icon.svg` is 12×12 natural and renders **12×24** — stretched 2× on one axis. `Indian-Flag.svg` is 33×22 natural and renders **33×24**. | Set explicit width and height, or `object-fit: contain`. |
| 2.6 | Contrast on an image/banner `[DBIM 3.7]` | **PARTIAL** | The SAMAVESH band's emblem and arrow sit on saffron `#f97316` at the same 2.80:1 as its text. | Fix with 12.6. |

## §3 Typography `[DBIM C]` — 6 PASS · 1 PARTIAL · 2 FAIL

| # | Item | Verdict | Evidence | Fix |
|---|---|---|---|---|
| 3.1 | Noto Sans `[DBIM 4.1]` | **PASS** | 2,923 of 2,976 elements resolve to `"Noto Sans", sans-serif`. One stray `Roboto` declaration (a third-party embed). | — |
| 3.2 | Body left-aligned; table alignment `[DBIM 4.1.1]` ⚠️ | **PASS** | No centred body copy found. | — |
| 3.3 | No ALL-CAPS paragraphs `[DBIM 4.1.1]` ⚠️ | **PASS** | Only short labels are capitalised — `COMMISSIONS`, `CORPORATIONS`, `FOUNDATION / AUTONOMOUS BODIES`, `SCHEME SPECIFIC THEMATIC PORTALS`, `CUMULATIVE DISBURSEMENT`. No capitalised sentences. *Advisory:* these breach the Title Case convention the estate applies to headings. | Title Case the menu column headings and stat labels. |
| 3.4 | DBIM type scale `[DBIM 4.3.1]` ⚠️ | **FAIL** | DBIM specifies desktop H1 36 / H2 24 / H3 20. Measured: **no H1 at all on the home and search pages**; H2 28/32 w600; H3 28/40 w600 — *identical in size to H2*; H4 16/20; **H5 14/24 — smaller than H6 16/20**, so the ramp inverts. Separately, **84 elements render at 12px and 4 at 10px**. H2's 32px leading on 28px type is **1.14**, below DBIM §4 iii's 1.2–1.5 band. | Rebuild the ramp so each level is strictly smaller than the one above; raise the 10–12px text to at least 14px, and secondary body copy to 16px. |
| 3.5 | Text contrast `[DBIM 4.4][WCAG 1.4.3]` ⚠️ | **FAIL** | See §12.6 — seven distinct failing pairs. | See §12.6. |
| 3.6 | Buttons: uniform padding `[DBIM 4.5]` | **PASS** | Consistent Bootstrap `.btn` sizing. | — |
| 3.7 | Distinct enabled/hover/focus/disabled `[DBIM 4.5]` ⚠️ | **PARTIAL** | Enabled, hover and disabled are all distinct ✓. **Focus is missing on the home page's own buttons** — see §12.3. | See §12.3. |
| 3.8 | Noticeable hover change `[DBIM 4.5]` ⚠️ | **PASS** | Colour and underline changes throughout. | — |
| 3.9 | 200% resize; reflow at 320px `[WCAG 1.4.4/1.4.10]` | **PASS** | At a 320px viewport `documentElement.scrollWidth` is **320** — no horizontal page scroll, nothing clipped. A genuinely good result and better than most government sites. | — |

## §4 Header & footer `[DBIM D]` — 5 PASS · 2 PARTIAL

| # | Item | Verdict | Evidence | Fix |
|---|---|---|---|---|
| 4.1 | State Emblem, correct ratio `[DBIM 5.1]` | **PASS** | `National-Emblem-logo.svg`, 32×52 natural, rendered 32×52 — undistorted. (Its weight fails §5.2.) | — |
| 4.2 | Named by org type `[DBIM 5.2]` | **PASS** | "Government of India / Ministry of Social Justice & Empowerment / **Department of Social Justice & Empowerment**" — full lineage, correct order. | — |
| 4.3 | Lockup black-on-white or white-on-dark `[DBIM 5.3]` | **PASS** | Both variants shipped (`National-Emblem-logo.svg`, `National_Emblem_logo_white.svg`). | — |
| 4.4 | DBIM header components, all subcomponents accessible `[DBIM 5.4]` | **PARTIAL** | Header structure is right. But all six top-level mega-menu items are `<a href="#">` rather than buttons carrying `aria-expanded`, and a **Search submit button sits at `top: -159941px` while remaining focusable** (see §12.3). | Convert disclosure triggers to `<button aria-expanded>`; remove or `inert` the off-screen submit. |
| 4.5 | Footer key info + lineage `[DBIM 5.6]` ⚠️ | **PASS** | GoI → Ministry → Department, postal address, socials, visitor count, Digital India Corporation / MeitY attribution, "Last Updated: 10 Sep 2026", and the five policy links. This is a genuine fix of an original-audit ⚠️. | — |
| 4.6 | Emblem + brand + search + skip-link, consistent `[GIGW]` | **PASS** | All present on every page sampled. | — |
| 4.7 | Prominent india.gov.in link, new window `[GIGW]` | **PARTIAL** | `india-gov-1.png` is present in Related Links and opens a new window ✓ — but the link's only content is an image with `alt=""`, so it has **no accessible name**. | Give the image real alt text. |

## §5 Logo `[DBIM E]` — 1 PASS · 1 FAIL

| # | Item | Verdict | Evidence | Fix |
|---|---|---|---|---|
| 5.1 | Accurate, not scaled disproportionately `[DBIM 5.5]` | **PASS** | — | — |
| 5.2 | Permitted format, **< 100 KB** `[DBIM 5.5]` ⚠️ | **FAIL** | `National-Emblem-logo.svg` = **196 KB**; `National_Emblem_logo_white.svg` = **195 KB**; `Indian-Flag.svg` = 33 KB (passes). Both emblems are roughly **2× the DBIM ceiling**. Gzip brings them to 71 / 67 KB on the wire, but the published asset is what DBIM measures. | Run the emblems through SVGO. A two-colour emblem has no business at 196 KB; expect 10–20 KB. |

## §6 Imagery `[DBIM F]` — 4 PASS · 2 PARTIAL · 1 FAIL

| # | Item | Verdict | Evidence | Fix |
|---|---|---|---|---|
| 6.1 | Background / banner **< 500 KB** `[DBIM 6.1.1]` | **PASS** | Hero banners 245–291 KB each (`banner-1a`…`banner-5a`, 1800×600). | — |
| 6.2 | Thumbnails **< 100 KB** `[DBIM 6.1.1]` ⚠️ | **PASS** | 12–60 KB. *Advisory:* `schemes-768x768.jpg` is a 768×768 file drawn at 150×150, downloaded six times. | Ship a 300px variant. |
| 6.3 | Hi-res < 5 MB, thumbnail + download `[DBIM 6.1.1]` | **PARTIAL** | Images comply. The Annual Report 2023-24 PDF is **6.7 MB** with no lighter alternative offered. | Publish a compressed or chapter-split version alongside. |
| 6.4 | JPEG / PNG / WEBP only `[DBIM 6.1.1]` | **PASS** | JPEG, PNG and SVG only. *Advisory:* no WEBP anywhere — a free ~30% saving on a 3 MB page. | — |
| 6.5 | Licensed, no third-party watermark `[DBIM 6.1.3]` | **PASS** | None observed. | — |
| 6.6 | Headshots per DBIM `[DBIM 6.1.4]` ⚠️ | **PARTIAL** | Source sizes are inconsistent: Minister 160×160 (rendered 153), the two Ministers of State 96×96. The Minister's portrait is upscaled by its container. | Export all three at one size, at ≥2× the largest rendered box. |
| 6.7 | Meaningful images have alt `[WCAG 1.1.1]` | **FAIL** | **6 `<img>` carry no `alt` attribute at all** (all six `schemes-768x768.jpg` scheme tiles). A further **80 of 96 carry `alt=""`** — including both persona tiles, the 1321×436 SAMAVESH banner and the Digital India mark, each of which is **the only content inside a link**, so the link is nameless. | Give every image that is the sole content of a link a description of the link's destination. |

## §7 Content `[DBIM G + Ministry E/F]` — 8 PASS · 3 PARTIAL · 2 FAIL · 1 N/A

| # | Item | Verdict | Evidence | Fix |
|---|---|---|---|---|
| 7.1 | Complete & up to date; archival dated `[DBIM A.5.6]` | **PASS** | "Last Updated: 10 Sep 2026" on every page sampled; notices carry dates. | — |
| 7.2 | No spelling / grammar errors `[DBIM 7.1.3.3]` ⚠️ | **FAIL** | Live in *Latest Updates*: "**ln**viting Expression of **ln**terest-cum-proposal…" — a lowercase **L** where a capital **I** belongs, twice in one title. A copy-paste artefact from a PDF. | Correct the notice title; check the rest of the import batch for the same substitution. |
| 7.3 | Date format DD MMM YYYY `[DBIM A.5.6]` | **PASS** | `22 Apr 2026`, `23 Dec 2025`, `12 Aug 2026`, `10 Sep 2026` — day before month throughout. | — |
| 7.4 | Titles Dr./Shri/Smt. uniform `[DBIM A.5.6]` ⚠️ | **PASS** | "Dr. Virendra Kumar", "Shri Ramdas Athawale", "Shri B. L. Verma" — consistent. | — |
| 7.5 | Documents as **accessible** PDF `[DBIM A.5.6]` | **FAIL** | No editable formats published ✓. But of four sampled PDFs, **three have no `/StructTreeRoot`, no `/MarkInfo /Marked true` and no `/Lang`** — untagged, so a screen reader gets an unstructured character stream at best. The worst is `Application_for_the_post_of_DD_TRG.pdf` (2.7 MB), produced by **"Adobe Scan for iOS"** — a photograph of a form, with no text layer at all, published as a job application. The fourth (`advertisement-E-5-10.12.2025_1.pdf`) *is* properly tagged with `/Lang(en-IN)`, which proves the capability exists and is applied inconsistently. | Re-publish the untagged files as tagged PDF/UA; OCR or re-typeset the scanned form, and offer an HTML form as the primary route. |
| 7.6 | External links HTTPS, identifiable, validated `[DBIM A.5.6]` | **PARTIAL** | Zero `http://` links ✓. But **26 `target="_blank"` links on one scheme page give no textual new-window warning** — the `open_in_new` icon carries `alt=""`. And `/schemes-and-services/`, a top-level destination, **301-redirects to the home page**; `/documents/` returns 404. | Add "(opens in a new window)" to the accessible name; fix the two routes. |
| 7.7 | Objectives / functions as a list `[DBIM A.5.1.1]` ⚠️ | **PASS** | PM-AJAY renders "The objectives of the Scheme are to:" followed by a real `<ol>`. Another original-audit ⚠️ genuinely fixed. | — |
| 7.8 | Minister names, portfolios, hierarchy `[DBIM A.5.1.2/3]` | **PASS** | Correct and current. | — |
| 7.9 | Offering title ≤ 150 chars `[DBIM A.5.2]` | **PARTIAL** | Three home-page item titles exceed 150 characters — **158**, **208** and **245**. | Give long notices a short display title and keep the full title as the document title. |
| 7.10 | Document titles ≤ 250 chars `[DBIM A.5.3/A.5.4]` | **PASS** | Longest measured 245. | — |
| 7.11 | Periodic documents versioned with release date `[DBIM A.5.3]` ⚠️ | **PASS** | Annual Report 2025-26 (English and Hindi), 2024-25, 2023-24. | — |
| 7.12 | Videos captioned + dated `[DBIM A.5.4.2]` ⚠️ | **N/A** | No `<video>` on the pages sampled. Not assessed. | Assess the Video Gallery separately. |
| 7.13 | CIO / WIM / Appellate / PIO contact; geotagging `[DBIM A.5.5]` ⚠️ | **PARTIAL** | 14 Google Map embeds on Contact Us ✓. PIO, CVO and Appellate Authority named **for the subordinate corporations**, and a CPIO Directory exists ✓. But **"Web Information Manager" and "Chief Information Officer" appear nowhere on the site** — zero occurrences. GIGW requires the WIM to be designated and published. | Publish the WIM's name, designation, email and phone on Contact Us. |
| 7.14 | Ministerial images and officers by seniority `[DBIM A.5.6]` | **PASS** | Minister, then the two Ministers of State. | — |

## §8 Personas `[DBIM Ministry B]` — 0 PASS · 2 PARTIAL · 1 FAIL

| # | Item | Verdict | Evidence | Fix |
|---|---|---|---|---|
| 8.1 | Relevant personas on the homepage `[DBIM A.2]` | **FAIL** | "Explore User Personas" offers **two of the four DBIM names — Beneficiary and Government Official**. **Student and Researcher are absent**, on a department whose largest schemes are scholarships. | Add Student and Researcher. |
| 8.2 | Persona-based navigation `[DBIM A.2]` | **PARTIAL** | The two that exist route to `/for-beneficiary/` and `/for-government-official/` ✓. Both tiles are image-only links with `alt=""`, so neither has an accessible name. | Add alt text; add the two missing routes. |
| 8.3 | Content tagged to personas `[DBIM A.3]` | **PARTIAL** | Scheme pages carry topic chips ("adarsh gram", "Educational Infrastructure", "SC Community Development") — **topic** tags, not **persona** tags. | Add a persona facet to the taxonomy and expose it in search. |

## §9 Forms `[DBIM Ministry G]` — 0 PASS · 1 PARTIAL · 1 FAIL

| # | Item | Verdict | Evidence | Fix |
|---|---|---|---|---|
| 9.1 | Instructions at the start `[DBIM B]` | **PARTIAL** | Search and the feedback panel rely on placeholder text alone. | Add a visible instruction line. |
| 9.2 | Keyboard-friendly, every field labelled, errors announced `[WCAG 3.3]` | **FAIL** | The two feedback textareas ("Describe your issues here…", "Suggested Feedback") have **no `<label>`, no `aria-label` and no `aria-labelledby`** — placeholder only, which disappears on input and is not a label. Search inputs and both checkboxes are correctly labelled ✓. | Add real labels. |

## §10 Search & metadata `[DBIM H]` — 1 PASS · 1 PARTIAL

| # | Item | Verdict | Evidence | Fix |
|---|---|---|---|---|
| 10.1 | Search works across HTML + documents `[DBIM 9]` | **PASS** | `?s=scholarship` → "**Found 119 results**", faceted by content type ("Scheme and Service (33)"), documents included. Genuinely good. *Advisory:* the results page has no `<h1>`. | — |
| 10.2 | Complete metadata + persona tags `[DBIM A.5.6]` | **PARTIAL** | Title ✓, description ✓, `viewport` ✓, UTF-8 ✓, `sitemap_index.xml` with 17+ document sitemaps ✓, `robots.txt` ✓. But **`<html lang="en-US">` on a Government of India site** (should be `en-IN`), **no `<meta name="keywords">`**, no persona tags, no `hreflang` despite Bhashini translation. | Set `lang="en-IN"`; add keywords and `hreflang`. |

## §11 Privacy & consent `[DBIM G]` — 2 FAIL

| # | Item | Verdict | Evidence | Fix |
|---|---|---|---|---|
| 11.1 | Cookie consent banner at the bottom `[DBIM 7.6.1]` ⚠️ | **FAIL** | **No consent mechanism anywhere** — no element matching `cookie` or `consent` in class or id, and the word "cookie" does not appear in the rendered page. Meanwhile Google Analytics (`G-097K5TMNKB`), a Facebook page plugin, X/Twitter widgets and a MyScheme AI assistant all load **before any consent could be given**. | Add a bottom-anchored consent banner and gate the analytics and social embeds behind it. |
| 11.2 | Consent in the user's preferred language `[DBIM 7.6.1]` ⚠️ | **FAIL** | Follows from 11.1. Bhashini is present and could serve the consent copy in 22 languages. | Route the consent string through Bhashini. |

## §12 Accessibility — WCAG 2.2 AA `[GIGW + UX4G]` — 2 PASS · 1 PARTIAL · 5 FAIL

**This is the section that decides the audit.**

| # | Item | Verdict | Evidence | Fix |
|---|---|---|---|---|
| 12.1 | `lang`, one `<h1>`, headings nest, landmarks `[WCAG 1.3.1/2.4]` | **FAIL** | Landmarks present ✓ (`header`, `nav`, `main`, `footer`, `role=contentinfo`). But: **the home page has zero `<h1>`**, and so does the search results page. And **every page opens with eight `<h5>` elements** (the mega-menu's `COMMISSIONS` / `CORPORATIONS` / `FOUNDATION / AUTONOMOUS BODIES` / `SCHEME SPECIFIC THEMATIC PORTALS`, rendered twice) **before its `<h1>`**. The home page outline runs `H5 H5 H5 H5 H5 H5 H5 H5 H2 H4 H6 H6 …` — five levels of skip, no top level. A screen-reader user listing headings to orient themselves is handed the navigation menu's internal labels first and never reaches a page title. | Demote the mega-menu column labels to a non-heading element (or `<p role="presentation">`), and give the home and search pages a real `<h1>`. This is the single highest-value fix on the site. |
| 12.2 | Skip to main content `[WCAG 2.4.1]` | **PASS** | Works, reveals on focus and moves focus correctly. *Advisory:* there are **two** — a WordPress `.skip-link` "Skip to content" and an Elementor "Skip to Main Content", both targeting `#content`. | Remove one. |
| 12.3 | Full keyboard, no trap, **visible focus** `[WCAG 2.4.7/1.4.11]` | **FAIL** | Three separate defects, found by tab-walking 28 stops.<br>**(a) No focus indicator on the primary CTAs.** `a.btn.btn-primary` ("Admin Login") and `a.btn` ("Explore", in the SAMAVESH band) match `:focus-visible` yet compute to `outline-style: none` and `box-shadow: rgba(0,0,0,0) 0 0 0 0` — a **fully transparent** ring. The rule that would draw one, `.btn-primary:focus-visible{box-shadow:0 0 0 4px rgba(3,115,223,.48)}`, is scoped to `.single`, `.page` and `html .page-template`, none of which match the front page template. So the fix exists and simply never reaches the home page.<br>**(b) The ring that does render is too faint.** `rgba(3,115,223,0.48)` over white composites to `rgb(133,188,240)` — **1.98:1** against the white page and **2.27:1** against a `#0373DF` button. WCAG 1.4.11 requires **3:1**.<br>**(c) Phantom focus stops.** `button.e-search-submit` is `visibility: visible`, `tabindex 0` and positioned at **`top: -159941px`** — a keyboard user tabs to a control roughly 160,000 pixels above the viewport, with no way to know where focus went. A second copy sits at 0×0. Four `<output class="e-search-results-container">` elements, each 0px tall, are also in the tab order. | (a) Widen the `:focus-visible` selectors to all templates. (b) Raise the ring to a solid `#0373DF` at ≥2px, or `rgba(3,115,223,1)`. (c) Remove the off-screen submit buttons, or mark them `inert` / `tabindex="-1"`. |
| 12.4 | Custom widgets: correct ARIA, Esc / arrows `[WCAG 4.1.2]` | **PARTIAL** | Carousel arrows are `<div role="button" tabindex="0" aria-label="Previous slide">` — acceptable, though a native `<button>` is better. Slide dots carry `aria-label="Go to slide N"` ✓. But the **six mega-menu triggers are `<a href="#">`**, announced as links that go nowhere; the separate `.e-n-menu-dropdown-icon` buttons do carry state. Escape and arrow-key behaviour not verified in this pass. | Make the trigger a `<button aria-expanded>`; drop the duplicate icon button. |
| 12.5 | `prefers-reduced-motion` `[WCAG 2.3.3]` | **FAIL** | **Zero `prefers-reduced-motion` rules across `style.css`, `common.css` and `ux4gCustom.css`.** Four Swiper carousels auto-advance, plus Elementor `fadeIn` entrance animations. A visitor whose operating system asks for reduced motion gets none of it. *Mitigation:* the accessibility widget offers "Pause Animation" — but that is opt-in, and the OS preference is the one the standard names. | Add `@media (prefers-reduced-motion: reduce){ *{animation-duration:.01ms!important;transition-duration:.01ms!important} }` and stop Swiper autoplay under the same query. |
| 12.6 | Contrast ≥ 4.5:1 (≥3:1 large / UI) `[WCAG 1.4.3/1.4.11]` ⚠️ | **FAIL** | Seven measured failures.<br>**a. `#e2e6ea` on `#0373df` — 3.70:1** — the footer's entire link column ("About Ministry", "Vision & Mission", "Citizen charter"…) at 14px. The largest single population of failing text on the site.<br>**b. SAMAVESH band: white on `#f97316` — 2.80:1** for both the 28px "SAMAVESH" (needs 3:1) and the 16px strapline (needs 4.5:1). *This is the estate's own recorded divergence #8 — the site-wide banner is a known non-conformance. On the live site the remedy is the same one recorded there: darken the ground or invert to a tint.*<br>**c. `#0373df` on `#e5eff9` — 3.99:1** — "Get in Touch", the footer's primary call to action.<br>**d. `#0373df` on `#e6f8fa` — 4.24:1** — "View all Schemes".<br>**e. `#0373df` on `#f8f9fa` — 4.41:1** — "Know More".<br>**f. `#0373df` on `#f9fafb` — 4.44:1** — "View All Events".<br>**g. `#1877f2` on `#e7f0fd` — 3.69:1** — the Facebook tile label.<br>Items c–f are the same defect four times: **`#0373DF` is not a safe ink on a pale tint.** It clears 4.5:1 on pure white (4.50:1, by one hundredth) and fails on every tint the site pairs it with. | Use `#014b92` for text-on-tint (≥7:1 everywhere here) and keep `#0373DF` for fills. Darken the SAMAVESH ground, or use its tint tone. |
| 12.7 | UX4G Accessibility Widget `[UX4G]` | **PASS** | Present, and unusually complete — **19 features**: Bigger / Smaller Text, Text Spacing, Line Height, Dyslexia Friendly, ADHD Mode, three Saturation modes, Desaturate, Light-Dark, Invert Colors, Highlight Links, Text-to-Speech, Cursor, Pause Animation, Hide Images, Reset All. Reachable by `Ctrl+F2`. **This exceeds the checklist requirement and is the strongest single item in the audit.** | — |
| 12.8 | Publish an Accessibility Statement `[GIGW]` | **FAIL** | `/accessibility/`, `/accessibility-statement/` and `/screen-reader-access/` **all return 404**, and no link to any such page appears in the footer or anywhere on the home page. GIGW mandates both an accessibility statement and a screen-reader-access page. | Publish both, and link them from the footer policy row. |

## §13 Mandatory pages & policies `[GIGW]` — 2 PASS · 1 PARTIAL · 1 FAIL · 1 N/A

| # | Item | Verdict | Evidence | Fix |
|---|---|---|---|---|
| 13.1 | Home · Contact · Feedback/Grievance · Help · Sitemap · Search | **PARTIAL** | Home 200 ✓ · Contact Us 200 ✓ · Help 200 ✓ · Sitemap 200 ✓ · Search (`?s=`) ✓ · Grievances 200 ✓. **`/feedback/` returns 404**; feedback exists only as a floating widget whose textareas are unlabelled (§9.2). | Publish a Feedback page. |
| 13.2 | Terms · Privacy · Copyright · Hyperlinking | **PASS** | All four return 200 and are linked from the footer. | — |
| 13.3 | Accessibility Statement · Website Policies hub | **FAIL** | Neither exists (see §12.8). `/website-policies/` 404. | Publish both. |
| 13.4 | RTI · "Last Updated" stamp | **PASS** | `/rti/` 200 with a CPIO directory; "Last Updated: 10 Sep 2026" on every page. | — |
| 13.5 | Content Review / Management / Security / Backup policies `[GIGW Lifecycle]` | **N/A** | Internal governance documents; not externally verifiable. | Confirm internally. |

## §14 Technology, security & performance `[GIGW + DBIM I]` — 3 PASS · 2 PARTIAL · 1 N/A

| # | Item | Verdict | Evidence | Fix |
|---|---|---|---|---|
| 14.1 | Responsive, mobile-first `[DBIM 10.2]` | **PASS** | Clean 320px reflow. *Advisory:* carousel pagination dots are **6×6 px**, against WCAG 2.5.8's 24×24 minimum and UX4G's 44×44 — **56 targets on the home page measure under 24px**. | Enlarge the dots' hit area to 24×24 (the visual dot can stay small). |
| 14.2 | HTTPS + valid TLS `[GIGW]` | **PASS** | HTTP/2, cert `CN=dosje.gov.in` (Amazon RSA 2048 M04) valid to 24 Dec 2026, `Strict-Transport-Security: max-age=31536000; includeSubDomains`. No mixed content. | — |
| 14.3 | VAPT / "Safe to Host" `[GIGW]` | **N/A** | Not externally verifiable. | Confirm the certificate is current. |
| 14.4 | ISO 27001 / OWASP ASVS / Top 10 `[GIGW]` | **PARTIAL** | A strong header set: `X-Frame-Options: SAMEORIGIN`, `X-Content-Type-Options: nosniff`, `X-XSS-Protection`, `Referrer-Policy: strict-origin-when-cross-origin`, `Permissions-Policy: geolocation=(self)`, `frame-ancestors 'self'`. **But the CSP is `script-src 'self' 'unsafe-inline' 'unsafe-eval' https:`** — which permits inline script, `eval`, and any script from any HTTPS origin on the internet. That policy stops essentially no XSS. | Replace the `https:` wildcard with an explicit host allowlist and remove `unsafe-eval`; move toward nonces for the inline blocks. |
| 14.5 | Valid markup, no broken links, multi-browser `[GIGW]` | **PARTIAL** | `/schemes-and-services/` 301→home; `/documents/` 404; **60 links with no accessible name**; heading order broken sitewide. | See §7.6, §6.7, §12.1. |
| 14.6 | Hosted on gov.in / nic.in `[GIGW]` | **PASS** | `dosje.gov.in`, served via CloudFront (`x-amz-cf-pop: DEL54-P2`) with an S3/CloudFront media origin. | — |

*Performance, advisory:* 160 requests and **3.0 MB** on first load, **1.28 MB of it JavaScript** (jQuery, jQuery Migrate, Elementor Pro, Swiper ×2, DataTables + Buttons + JSZip + **pdfmake with embedded vfs_fonts**, Fancybox, Bhashini, UX4G, GA, X and Facebook widgets). `pdfmake` and `jszip` are export helpers for a data table and are loaded on the **home page**, which has no data table. On a 3G connection this is a multi-second wait before anything is interactive. GIGW asks for performance; this is the largest single lever.

## §15 Certification & governance `[GIGW]` — 2 PASS · 2 FAIL · 1 N/A

| # | Item | Verdict | Evidence | Fix |
|---|---|---|---|---|
| 15.1 | STQC CQW certification | **N/A** | Not externally verifiable, and **not claimed anywhere on the site**. | Publish the certificate if held. |
| 15.2 | GIGW compliance / accessibility statement published | **FAIL** | Neither is published (§12.8). | Publish. |
| 15.3 | Designated Web Information Manager | **FAIL** | Zero occurrences of "Web Information Manager", "WIM" or "Chief Information Officer" across the site. | Designate and publish. |
| 15.4 | Multilingual via Unicode | **PASS** | Noto Sans throughout, plus the **Bhashini** translation plugin with an in-page language switcher and a "Rate this translation" panel. Hindi documents published alongside English. | — |
| 15.5 | Integrations: india.gov.in, MyGov, MyScheme, CPGRAMS, RTI | **PASS** | All present in Related Links, plus an embedded **MyScheme AI assistant** (`aistore.myscheme.in`). | — |

---

## Prioritised fix list

### P0 — legal / accessibility, fix first

| # | Fix | Clause | Effort |
|---|---|---|---|
| 1 | Give the home and search pages an `<h1>`; demote the eight mega-menu `<h5>`s so no page starts at level 5 | WCAG 1.3.1 · §12.1 | Small — one template change, sitewide effect |
| 2 | Widen the `:focus-visible` button selectors so the home page's CTAs get a ring; raise the ring to solid `#0373DF` ≥2px | WCAG 2.4.7, 1.4.11 · §12.3a/b | Small |
| 3 | Remove or `inert` the search submit button parked at `top:-159941px`, its 0×0 twin, and the four 0px `<output>` elements | WCAG 2.4.7 · §12.3c | Small |
| 4 | Fix the seven contrast pairs — footer links to `#014b92` ground or lighter ink; `#0373DF` → `#014b92` for text on tints; darken or invert the SAMAVESH band | WCAG 1.4.3 · §12.6 | Small–Medium |
| 5 | Publish the **Accessibility Statement** and **Screen Reader Access** pages and link them from the footer | GIGW · §12.8, §13.3 | Small |
| 6 | Alt text for the 6 attribute-less images and the ~15 image-only links (scheme tiles, persona tiles, SAMAVESH banner, partner logos) | WCAG 1.1.1, 2.4.4 · §6.7 | Small |
| 7 | Label the two feedback textareas | WCAG 3.3.2 · §9.2 | Trivial |
| 8 | Add a `prefers-reduced-motion` block and stop carousel autoplay under it | WCAG 2.3.3 · §12.5 | Small |
| 9 | Re-publish the untagged PDFs as tagged PDF/UA; replace the scanned job-application form with an HTML form | GIGW, DBIM A.5.6 · §7.5 | Large — content operation |

### P1 — DBIM brand conformance

| # | Fix | Clause | Effort |
|---|---|---|---|
| 10 | Re-generate the UX4G Bootstrap build with `--bs-primary: #0373DF` and a ramp derived from it; delete the violet ramp | DBIM 2.1 · §1.1 | Medium |
| 11 | Footer background to the **darkest** shade of the key colour group | DBIM 5.6 · §1.4 | Trivial — and it fixes contrast finding 12.6a |
| 12 | Compress the two emblem SVGs from ~196 KB to under 100 KB | DBIM 5.5 · §5.2 | Trivial |
| 13 | Snap all 51 icons to 24/32/48/64 and move off icon webfonts to SVG | DBIM 3.7 · §2.3, §2.4 | Medium |
| 14 | Fix the two stretched icons (`open_in_new_icon.svg`, `Indian-Flag.svg`) | DBIM 3.7 · §2.5 | Trivial |
| 15 | Rebuild the heading ramp so H5 is not larger than H6 and H3 differs from H2; raise 10–12px text | DBIM 4.3.1 · §3.4 | Medium |
| 16 | Add the **Student** and **Researcher** personas | DBIM A.2 · §8.1 | Medium |

### P2 — content, privacy, performance

| # | Fix | Clause | Effort |
|---|---|---|---|
| 17 | Add a bottom-anchored cookie consent banner and gate GA / Facebook / X behind it, served through Bhashini | DBIM 7.6.1 · §11 | Medium |
| 18 | Correct "**ln**viting Expression of **ln**terest"; sweep the import batch for the same I/l substitution | DBIM 7.1.3.3 · §7.2 | Trivial |
| 19 | Publish the Web Information Manager's name and contact on Contact Us | GIGW · §7.13, §15.3 | Trivial — needs a departmental decision |
| 20 | `<html lang="en-IN">`; add `keywords` and `hreflang` | GIGW · §10.2 | Trivial |
| 21 | Fix `/schemes-and-services/` (301→home) and `/documents/` (404); add "(opens in a new window)" to the 26 `target="_blank"` names | GIGW · §7.6 | Small |
| 22 | Publish a `/feedback/` page | GIGW · §13.1 | Small |
| 23 | Enlarge the 6×6 px carousel dots' hit area to 24×24 | WCAG 2.5.8 · §14.1 | Trivial |
| 24 | Tighten the CSP: drop the `https:` wildcard and `unsafe-eval` | GIGW, OWASP · §14.4 | Medium |
| 25 | Stop loading `pdfmake` + `vfs_fonts` + `jszip` + DataTables on pages with no data table; ship WEBP | GIGW performance · §14 | Medium — biggest speed win |

### Governance — needs a person, not a commit

- STQC **CQW** certification: not claimed on the site. Publish it, or obtain it. `[GIGW §15.1]`
- **VAPT / Safe-to-Host** from a CERT-In / STQC empanelled auditor: not externally verifiable. `[GIGW §14.3]`
- **Web Information Manager** designation and publication. `[GIGW §15.3]`
- Content Review (quarterly), Content Management, Security and Backup policies. `[GIGW §13.5]`

---

## What the live site does better than expected

Recording these matters, because a list of failures alone misrepresents the build.

1. **The UX4G accessibility widget is one of the most complete on any Indian government site** — 19 features including ADHD Mode, dyslexia-friendly type, text-to-speech and animation pause, on `Ctrl+F2`.
2. **The 320px reflow is clean** — no horizontal scroll, nothing clipped. Rarer than it should be.
3. **Search genuinely works** — 119 results for "scholarship", faceted by content type, documents indexed.
4. **The security header set is strong** — HSTS with `includeSubDomains`, `frame-ancestors 'self'`, `nosniff`, a real `Referrer-Policy` and a `Permissions-Policy`. Only the CSP's `script-src` lets it down.
5. **Footer lineage, date formats, honorifics, seniority order and versioned annual reports** are all correct — five items the May 2026 audit flagged, now fixed.
6. **Bhashini is integrated properly**, with a language switcher and a translation-quality feedback panel.
7. **Focus styling was clearly thought about** — a 4px ring, `outline-offset: 5px` on links, a white ring on the blue footer. The defect is scope and opacity, not absence of intent.

---

## How this compares with the SAMAVESH clone

Not part of the gate, but useful for the department. Measured on `apps/hub/src/app/website` on the same day:

| Item | dosje.gov.in | SAMAVESH clone |
|---|---|---|
| `<h1>` on the home page | **none** | present |
| `<html lang>` | `en-US` | `en-IN` |
| Images with no `alt` attribute | 6 | 0 |
| Personas on the home page | 2 of 4 | 4 of 4 (Beneficiary, Student, Researcher, Government Official) |
| Primary colour groups declared | 2 (`#0373DF` + `#613AF5`) | 1 |
| Icon system | 4 (FA Free, FA Brands, eicons, SVG) | 1 (Material Symbols Rounded 300 as SVG) |
| Accessibility Statement page | 404 | `/website/accessibility` |
| Cookie consent | none | `WebsiteCookieNotice`, admin-toggleable |

The clone reproduces the SAMAVESH band's contrast problem, which is recorded as a deliberate
divergence (`docs/guidelines/README.md` #8) with `tone="tint"` as the one-word remedy. **That
remedy applies to the live site too, and it is the cheapest of the seven contrast fixes.**

---

## Method notes and limits

- Contrast was computed as WCAG 2.x relative luminance against the nearest opaque ancestor background, with alpha compositing. **Text over gradients and background images was excluded**, because the checker cannot sample them reliably — four candidates were discarded on that basis rather than reported (the statistics band computes to 4.50:1 white-on-`#0373DF` and passes).
- PDF tagging was determined by the presence of `/StructTreeRoot`, `/MarkInfo /Marked true` and `/Lang` in the file. Four documents were sampled from the home page; this is indicative, not a census of the ~17 document sitemaps.
- Keyboard behaviour was measured by a 28-stop tab-walk instrumented with a `focusin` listener; Escape and arrow-key handling inside the mega-menu and carousels was **not** verified.
- Video captioning (§7.12) was not assessed — no `<video>` appeared on the pages sampled.
- Pages inspected: `/`, `/contact-us/`, `/help/`, `/sitemap/`, `/rti/`, `/privacy-policy/`, `/terms-conditions/`, `/copyright-policy/`, `/hyperlinking-policy/`, `/grievance/`, `/whos-who/`, `/schemes-and-services/pradhan-mantri-anusuchit-jaati-abhyuday-yojna-pm-ajay/`, `/?s=scholarship`.
