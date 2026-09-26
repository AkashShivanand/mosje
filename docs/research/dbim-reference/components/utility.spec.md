# Utility pages — spec

Owner: the utility-pages builder. Routes under `apps/hub/src/app/website-dbim/`:
`policies`, `policies/[policy]`, `related-links`, `important-links`, `sitemap`, `help`,
`cookies`, `feedback`, `search`, `persona/[slug]`. Components in
`components/website-dbim/utility/` (stylesheet `utility.css`, classes `db-u-*`). Data in
`lib/website-dbim/utility.ts`.

Every page is `<DbimPage>`; it owns the banner, breadcrumb, h1, sub-tab bar and the
1320px container with its 32px top/bottom section padding. Values below are the
reference's computed styles at 1440 (`inspect.py`), converted to our 16px root.

## Shared pieces

| Piece | Reference | Values |
|---|---|---|
| **Link row** (`.announcementbox`) | Related Links, Important Links, Search | white, 1px `#EBEAEA` border (neutral-100), radius 8, padding 8/32, margin-bottom 6, min-height 58, flex row, align centre. Title 14px/24px 400, ink. ≤991px: column, pill right-aligned under the title (390 shot). |
| **Pill** (`.download-btn`) | same | `#D2DFFF` (primary-100) ground, `#162F6A` (primary-800) ink, radius 4, padding 8/12, gap 8, 12px/18px 600 uppercase, letter-spacing 0.12px, 24px Material icon; hover `#A3BBF3` (primary-200). `open_in_new` for an external site, `arrow_forward` for an internal page, `download` for a file. |
| **Policy text** (`.policyContent`) | Policies, Help, Cookies | p 14px (`--db-fs-p`) / 22px, letter-spacing 0.16px, margin-bottom 10; h2 20px (`--db-fs-h2`) 400, `#162F6A`, margin-bottom 10, letter-spacing −0.12px. |
| **Filter bar** | Related Links, Important Links, Help | the kit's `DbimFilterBar` (search 375 max; `10 per page` select 180 on the right). |
| **No data** | Search, every empty list | the kit's `DbimEmptyState` — centred "No Data Available." 17.5px 700. |

## Pages

### `/policies`, `/policies/[policy]` (`policies`)
Hero `DBIM_HEROES.policies`; tabs `DBIM_POLICY_TABS` (Terms of Use at `/policies`, then
Privacy, Hyperlink, Copyright, Accessibility Statement). Breadcrumb Home / Website
Policies; h1 = tab label. Body = policy text, full width. Headings h2 blue.
Content: the estate's policy pages (`app/website/{terms-conditions,privacy-policy,
hyperlinking-policy,copyright,accessibility-statement}`) transcribed into
`DBIM_POLICIES` in `utility.ts`, links re-pointed at DBIM routes. Unknown slug →
`notFound()`.

### `/related-links` (`RelatedLinks`)
Hero `DBIM_HEROES.relatedLinks`, no tabs. Filter bar (search only, "Search Related
Links"), then link rows, each "VISIT WEBSITE" (external, new tab). Content: the
redesign footer's Related Links (`components/website-next/chrome/Footer.tsx`) — National
Portal of India, myScheme, CPGRAMS, MyGov, Open Government Data.

### `/important-links` (`important_links`)
Default hero. Filter bar: search + per page (10/15/20). Rows: one per Division of the
Department (`DIVISIONS`, as the classic Important Links rail groups them). A division
with an internal page → "KNOW MORE" → `/ministry/our-division/<id>`; a division whose
only destination is another website (Public Grievance → CPGRAMS) → "VISIT WEBSITE".
The list is `DBIM_IMPORTANT_LINKS` in `utility.ts`, the one the home section imports.

### `/sitemap` (`sitemap`)
Default hero. Built from `DBIM_MENU`, `DBIM_POLICY_TABS`, `DBIM_FOOTER_LINKS`,
`DBIM_UTILITY_LINKS` and `DBIM_PERSONAS` — never typed.
- "Home" row: `home` icon 24 + 14px 600, ink; padding-bottom 10, bottom border 1px
  neutral-100, margin-bottom 24.
- Section title (Ministry …): 14px/21px 600 primary-800, padding-bottom 10, bottom
  border, margin-bottom 24. Rendered as h2.
- Item: padding 8/32, bottom border, 14px/21px; `chevron_right` 24 primary-600, link ink.
The reference's third level ("Directory page 1…13") is its CMS's pagination, not pages,
and is not reproduced.

### `/help` (`help`)
Hero `DBIM_HEROES.help`. Filter bar (search) filters the table rows by document type or
program. "Help" 20px 500 (h2), margin-bottom 36. Then policy text: bold "Viewing
Information in Various File Formats" (h3, 14px 700), paragraph, table: bordered, th
5px padding 700, td 8px padding, 1px ink borders, links primary-600 underlined.
The reference's table is clipped by a fixed-height box with broken icons; the clone
shows the whole table, which scrolls sideways inside its own region on a phone.
Content: `app/website/help` (plug-ins, paragraph, "Accessibility and Other Help" list).

### `/cookies` (`cookies`)
Hero help.jpg (`DBIM_HEROES.help`), h1 "Cookie Policy" (the estate's one name).
Intro p 14px/21px. h2 20px 500 uppercase, margin-bottom 10. Setting box: 1px
neutral-100 border, radius 8, padding 8/16; label 14px 700; description 14px/24px; switch
row "Off [36×20 switch] On", 14px/20px, gap 5. Essential switches on + disabled
(primary-800 at 50 %); the optional switch off + disabled (primary-200).
Content: the estate's `STORED` list (six items) as Essential; Optional carries the
estate's statement that none are set. The first stored item is the DBIM notice's own
`dbim-cookie-consent` cookie (chrome/CookieConsent.tsx), not the redesign's local-storage
key. The button (primary-800, white, 600, radius 4, padding 8/12) is **Save Preferences**
while no choice is stored — it records `custom` through the notice's
`setDbimCookieConsent`, so the notice steps aside — and **Withdraw Preference** once one is,
which clears the cookie and brings the notice back.

### `/feedback` (`feedback`)
Default hero (reference: its own wave art, which we do not have → default). Card 645
wide centred (col-md-6 of 1320), white, radius 10, shadow 0 5 10 rgba(0,0,0,.15),
padding 25. Note right-aligned 14px/21px, red `*`. Labels 16px 700, margin-bottom 5;
inputs 34 tall, 1px `#DEE2E6` border (neutral-200), radius 4, padding 4/8, 16px;
textarea 80 tall. Submit right-aligned, the kit pill style (12px 600, padding 8/12);
**grey (neutral-100 / neutral-700) is the reference's DISABLED state**, so the clone's
enabled Submit is the primary-100 pill.
Behaviour (from `components/website-next/templates/FeedbackForm.tsx`): client
validation only, no backend; a valid submit shows the confirmation. Name and Email
required, email format checked, Mobile optional (10 digits), Suggestions 10–2000
characters. Errors under each field, `aria-invalid`, focus moves to the first invalid
field. CAPTCHA: the estate's `BotCheck mode="invisible"` + `useBotCheck` (draws nothing
unless it fails). The reference's image CAPTCHA with audio is **not** reproduced — the
estate has none, and a drawn one that checks nothing would be a fake.

### `/search` (`search`)
Default hero, Home / Search. `?q=` read on the server; the estate's `searchIndex()` +
`rank()` (`lib/website/search`). Each hit's redesign address is mapped to its DBIM page
(`dbimSearchTarget` in `utility.ts`); hits with no DBIM page are left out; duplicates
collapse. Rows = link rows (pill KNOW MORE / VISIT WEBSITE / DOWNLOAD). 10 per page via
`?page=`, `DbimPagination`. States: no query → "No Data Available."; query with nothing
→ `Results for “q”` + "No Data Available."; too short → the estate's prompt.

### `/persona/[slug]` (`persona_…`)
Default hero, h1 "For <Persona>", Home / For <Persona>. Grid: 880 wide centred (col-md-8),
two columns of 425, gap 15 × 24. Tile: white, 1px `#5279D7` (primary-400) border, radius
10, padding 16, gap 12, min-height 100, 48px icon; text 14px/26px 500 primary-800 with
the key word 700; arrow square 40×40 primary-200, radius 4, bottom 5 right 8,
`arrow_forward`. ≤991px: one column. The whole tile is the link.
Personas `student`, `beneficiary`, `government-official`, `researcher`
(`DBIM_PERSONAS`, from `app/website/for-*`). `generateStaticParams`; else `notFound()`.

## Accessibility
One h1 (DbimPage). Headings in order (h2 sections). Every input labelled. External links
say "(opens in a new tab)". Focus: 2px primary-800 outline, offset 2. Rows are `<ul>`.
Result counts in `role="status"`.
