# dosje.gov.in — Consolidated Issue & Recommendation Register (for the redesign)

Compiled 2026-09-21. De-duplicated: the website issue register (2,015 issues, itself the merge of the Drive QC tracker, the Friday design report, the design-QC of build vs Figma and the 10 Sep compliance audit) is the backbone; items from other docs appear only where the register has no sitewide row.

**Source keys** — REG = issue register `apps/hub/src/data/website-issues/issues.json` (branch commit b4eafc5b, worktree `…/15b366b8…/scratchpad/wt-issue-register`; NOT on main) · CA = `docs/audit/dosje-gov-in-compliance-audit-2026-09-10.md` · FR = Friday design report HP/AU/OD/OF/DO/EG/CT points (`…/15b366b8…/scratchpad/friday/website-design-audit.html`, `consol/friday-points.json`) · DR = `docs/qc/portals/website/design/DESIGN-REPORT.md` · QA = `docs/qc/portals/website/DESIGN-QA-REPORT.md` (152 build-vs-design findings, folded into REG scope "Build vs design") · IA = `docs/research/website-ia-persona-discoverability-2026-08.md` · SP = `docs/audit/website-schemes-placement-2026-09-09.md` · SIA = `docs/plans/schemes-section-ia-2026-09-09.md` · SR = `docs/research/schemes-review-2026-09-14.md` · SD = `docs/audit/service-discovery-2026-09-09-director-audit.md` · GOV = `docs/plans/2026-09-03-dosje-governance-and-cms-plan-of-action.md` · SB = `docs/specs/website-search-brief.md` · CC = `docs/compliance/COMPLIANCE-CHECKLIST.md`.

**Scale.** REG: 2,015 issues — 178 Blocker · 986 Major · 758 Minor · 93 Nit; 187 sitewide/template rows (listed below) + 1,828 page-level rows (P/T/Q ids) rolled up in §1b. Broken links: 586 URLs (495 docs/images 403/404, 48 external dead). Duplicates: 824 pages/records in duplicate groups. Scores (CA, 10 Sep): DBIM 51.3% · GIGW 42.1% (WCAG subset 26.1%) · UX4G 37.5%.

## 1. Issues by category (sitewide / template level)

### IA / Navigation — 39

| ID | Issue | Sev | Source | Redesign must |
|---|---|---|---|---|
| NAV-01 | No citizen starting point on the home page | Blocker | REG | Right after the hero, add a task row in citizen language — Find a Scheme · Apply · Track Application · File a Grievance · Helplines — and a matching task entry in the menu. |
| COD-01 | About Us has broken HTML | Major | REG | Close the open elements (probably in a pasted content block) and re-validate. |
| DUP-01 | 238 pages are exact copies of another page | Major | REG | Keep one of each group; 301-redirect the rest; check titles for duplicates before publishing. |
| DUP-02 | Files uploaded twice; titles that differ only in capitals | Major | REG | Merge each pair, keep the Title Case version, redirect the other. |
| DUP-03 | Hundreds of records share one title | Major | REG | Put the distinguishing fact in the title — case, party and date; place and date; the organisation's name. |
| DUP-04 | Numbered page addresses beside un-numbered twins | Major | REG | Give every page a descriptive address; merge true copies; redirect old addresses and set canonicals to the original. |
| NAV-02 | Links labelled with the wrong destination | Major | REG | Label each link by where it goes; point the NCW link to ncw.nic.in. |
| NAV-03 | Two in three Schemes entries are not schemes of this Department | Major | REG | Keep only the Department's schemes in the list; move State schemes to a labelled State directory, loan products to their corporations and documents to Documents; merge duplicates with redirects; nest sub-schemes under their parent. |
| NAV-04 | Documents library filled with NCBC hearing notices | Major | REG | Move the Central List of OBCs to its own searchable table (State · caste · notification) and hearings to an NCBC register; keep Documents for documents. |
| NAV-05 | Personas: two of four, a carousel for two, and jargon | Major | REG, CA, FR HP-14 | At minimum (Friday report HP-14): add a count such as “2 of 5”, put the arrows on one line with the persona name, and keep illustrations rather than photographs. |
| NAV-06 | Tenders do not link to the tender portal | Major | REG, CA | Link each tender to its record on the portal where bids are submitted. |
| NAV-07 | Organisation pages look and work like another website | Major | REG | Use one masthead and one component set across the ministry and every organisation page. |
| NAV-12 | Our Offerings carries too much text | Major | REG, FR HP-10 | Cut each card to category · title · link; move the detail to the scheme page. |
| NAV-13 | What's New scrolls inside its own box | Major | REG | Give What's New its own Latest Updates section, paged rather than scrolling inside the card. |
| NAV-14 | Tenders and vacancies are cards, so they cannot be compared | Major | REG, FR OF-04 | Use the Circulars table for Tenders, Vacancies, Documents and Notices: sortable columns, one action per row, rows that stack on phones. |
| NAV-15 | Filters that do not apply to the list | Major | REG, FR OF-03/DO-01 | Show only the filters that apply to each list — Tenders: organisation, status, closing date; Vacancies: organisation, post, closing date — and hide any filter with one option. |
| NAV-16 | Gallery shows one card per photo | Major | REG, FR EG-02 | Show albums: one thumbnail per event with its name and photo count; open the album to see its photos, each with alt text. |
| NAV-17 | Who's Who: no name search; filters list sections and portals | Major | REG | Add a name search that matches names and designations; build the job-title filter from a clean list of posts; list only organisations in the organisation filter; on phones let each team open and close. |
| COD-02 | Invalid element nesting in the shared templates | Minor | REG | Remove the empty <output> elements; use <div> where a <span> holds block content; move page styles into the stylesheet. |
| COD-03 | Tables and frames pasted with obsolete attributes | Minor | REG | Paste as plain text, style tables in CSS and remove the obsolete attributes. |
| COD-04 | Duplicate ids in inline SVG icons | Minor | REG | Give each inline SVG unique ids. |
| COD-05 | aria-label placed where it has no effect | Minor | REG | Move the name to the interactive element or use visible text. |
| LAY-13 | Organisation pages repeat near-identical sections | Minor | REG, FR OD-05 | Put them in one Documents section with tabs. |
| NAV-08 | No breadcrumb on organisation pages | Minor | REG | Add the breadcrumb to every page below the home page. |
| NAV-09 | The 404 page offers no way back | Minor | REG | Add the search field and five popular links. |
| NAV-10 | The address without “www” redirects with “:443” in it | Minor | REG | Redirect to https://www.dosje.gov.in/ with no port. |
| NAV-18 | Menu arrows suggest a submenu that is not there | Minor | REG, FR HP-04 | Remove the arrow; the hover highlight is enough. **Resolved 2026-09-23:** the hover chevron is gone from `Navbar/MegaMenuItem` in Figma (22 Sep) and from `MegaMenuItem` in code (23 Sep). The 22 Sep note claimed both when only Figma had changed, so the two disagreed for a day; the row's hover lift and outline carry the affordance, and the 24px the chevron reserved now lets a long organisation name sit on one line. |
| COD-06 | Leftover placeholder markup in the footer | Nit | REG | Delete it. |
| X-IA-01 | Two live ministry sites (dosje.gov.in, socialjustice.gov.in) with divergent menus and non-overlapping schemes (PM-SURAJ, TAPAS absent from dosje) | Major | IA | Consolidate to one site; 301 legacy; one taxonomy (R8) |
| X-IA-02 | Top nav is division/artefact-shaped (6 of 7 menus name things the Ministry has); no task entry (eligible/apply/track/complain) | Major | IA, REG NAV-01 | Task-and-audience primary nav: Find Support · Apply & Track · Our Organisations · Rules & Reports · Tenders & Careers · About (R2) — subject to stakeholder menu decision (see §2) |
| X-IA-03 | Associated Organisations menu = 18 bare acronyms under administrative headings; footer Important Links grouped by internal division | Major | IA | Lead with full plain-language name, acronym second; regroup by citizen need |
| X-IA-04 | Schemes list: 140 entries, only 48 are Department schemes (46 State schemes unlabelled, 21 corporation loan products, 12 docs/tables/lists, 4 org duplicates, 3 empty dupes, 22 empty pages) | Blocker | SP, SIA | Split into Department schemes (20 top-level + 12 components) · Loans & Credit (21) · State schemes under DWBDNC, State named (46) · Where to Apply; move docs out; redirect dupes |
| X-IA-05 | Schemes filed as organisations (NMBA, SMILE, Transgender portal absent from scheme records); umbrella schemes not modelled as parent/component | Major | IA D5, SIA | One canonical home per record; umbrella → components; scheme status chip Open/Closed/Merged into/Closed — never delete merged schemes |
| X-IA-06 | Category field: 14 values (4 single-record), 20 untagged; 27/141 no target group; only 2 multi-valued | Major | IA D3, SIA | Replace with two controlled facets: Who It Is For (11 groups) × What You Get (10 kinds of support); multi-valued |
| X-IA-07 | Personas decorative: 2 of 4 DBIM personas on home; persona pages link to unfiltered lists; URL leaks CMS (/home-page/for-…) | Major | IA D2, CA Obs D, REG NAV-05 | Real filtered audience landings incl. Student & Researcher; persona tags on content; clean URLs |
| X-IA-08 | Scheme page has no fixed spine; administered-by, who-it-is-for, where-to-apply absent | Major | SIA §7, IA R5 | One scheme template: name · status · administered/delivered by · who it is for · what you get · eligibility · where to apply · components · documents · performance |
| X-IA-09 | 24 live pages and 10 record-detail types have no design frame | Major | DR DES-C-01/02 | Design one content-page, one document-register and one record-detail template; map every live page to one |
| X-IA-10 | Soft 404s (HTTP 200 for missing pages); leftover Bootstrap demo select "One/Two/Three" in footer; numeric scheme slugs | Minor | IA D8 | Real 404 status; purge demo markup; descriptive slugs + redirects |
| X-IA-11 | Page-wise ownership undefined: who in the Ministry maintains which page; same info typed in many places (Directory/Contact) | Major | GOV | Role & responsibility map per page; central pages assembled from organisation records, not retyped; each org publishes its own vacancies/tenders/documents |

### Content — 32

| ID | Issue | Sev | Source | Redesign must |
|---|---|---|---|---|
| CON-03 | Official Language Act published with the wrong year | Blocker | REG | Correct the text against the gazetted Act. |
| CON-04 | PM-AJAY table prints “[object Object]” | Blocker | REG | Fix the rendering (the script writes an object where it should write one of its fields) and add a check that no cell contains “[object”. |
| CON-05 | PM-AJAY Hostel Status Report shows test data | Blocker | REG | Publish the real report or unpublish the page. |
| CON-07 | “NA” printed where there is no information | Blocker | REG, FR OF-02 | Never print NA: hide a field that is empty for every item, show a dash where one item is missing it, and fill tender closing dates. |
| CON-08 | Contact maps pinned to the wrong building | Blocker | REG | Re-pin each map to its office's address. |
| CON-10 | Misspellings in the Important Links drawer and in page addresses | Blocker | REG, CA | Correct the two labels; rename the two pages to correct addresses and 301-redirect the old ones. |
| CON-11 | List of Scheduled Castes misspells States | Blocker | REG | Correct against the current gazette notifications. |
| CON-12 | NCSC's leadership page names no Chairperson | Blocker | REG | Publish the Chairperson, Vice-Chairperson and Members with tenure, or state the vacancy formally. |
| LNK-01 | 495 document and image links do not open | Blocker | REG | Restore each missing upload or unpublish its record; block publishing a record whose file does not open; run a weekly link check. |
| CON-13 | Scheme pages do not describe the scheme | Major | REG | Write four blocks per scheme: what it is · who can apply · what they get · how to apply (with the portal link). |
| CON-14 | Section introductions copied from other sections | Major | REG | Write each section's own introduction. |
| CON-15 | The same event listed again and again | Major | REG, FR EG-01 | Group repeat posts into one event with its places, dates and photos, opening to a page that lists each place. |
| CON-16 | Dates written three ways; one dated in the future | Major | REG | Use one format (DD MMM YYYY) and validate dates on entry. |
| CON-17 | About Us: objectives in a paragraph, not a list | Major | REG, CA | Set objectives and functions as lists; on the home page, one sentence on purpose and audience, then Read More. |
| CON-23 | Who's Who: wrong title, email and phone numbers | Major | REG | Correct each against the body's own website: title Mrs.; NCBC Member contacts; NCSC Members' email and phone; post “Member”. |
| DOC-02 | Wrong file size beside downloads | Major | REG | Read the real byte size when a file is uploaded; show KB below 1 MB; hide the size if it is unknown. |
| LNK-02 | 48 links to other websites are dead | Major | REG | Point each at its current address or remove it; fix every “Apply Now” first. |
| ACC-25 | Acronyms lead where full names should | Minor | REG | Lead with the full name and give the acronym after it; expand every abbreviation the first time it appears on a page. |
| BRD-13 | Designations and title prefixes written inconsistently | Minor | REG, CA | Pick one form of each designation and prefix and use it everywhere. |
| CON-19 | Thousands of near-empty pages | Minor | REG | Give each record a one-line summary, the issuing office and the date — or list such records in a table instead of giving each its own page. |
| CON-20 | Record titles in capitals, stray quotes or trailing punctuation | Minor | REG, CA | Title Case; no surrounding quotes; no trailing full stop. |
| CON-21 | Ten different labels for the same few actions | Minor | REG, FR DO-02 | Adopt one word list by outcome — View Details (content), View Document (PDF), View All (listing), Apply Now, Track Application — and keep one action per document row. |
| CON-22 | Cookie banner repeats its first sentence | Minor | REG | Keep one sentence. |
| CON-24 | Who's Who: records reused for new officers, and one person entered four times | Minor | REG | Give each post-holder their own record and address (redirect the old address); keep one record per person and link it from each team. |
| CON-25 | Who's Who: spelling and formatting | Minor | REG | Correct the spellings and spacing; write every email and phone number one way. |
| CON-26 | Who's Who: three points for the Department to confirm | Minor | REG | Ask the Department and update the page. |
| DOC-04 | Titles too long for their cards | Minor | REG | Keep titles under 250 characters and write a short display title. |
| LNK-03 | 33 links could not be checked automatically | Minor | REG | Check each from a browser and fix any that fail. |
| X-CON-01 | 1,066 page-level content defects (104 Blocker): wrong/contradictory figures (~470), dates (~270), spelling (~250), copied text (~220), wrong titles (~200), empty/NA (~130), bad contacts (~100) | Blocker | REG (P/T ids) | Content QA pass per page before migration; do not migrate content verbatim |
| X-CON-02 | Six scheme standfirsts copied from other schemes; placeholder helpline on a scheme page | Blocker | SP §5 | Fix before anything else; per-scheme own copy |
| X-CON-03 | Administrative titles verbatim (longest 168 chars) as the citizen-facing name | Major | IA D4, IA R5 | Plain-language H1; official name retained beneath |
| X-CON-04 | Content that is a scanned image/photocopy (RTI Act, sewer-death statistics, Citizen Charter in PDF viewer) | Blocker | REG ACC-P099/P100/P153/P098 | Publish as HTML text/tables; PDF as secondary download |

### Accessibility / WCAG 2.2 AA — 31

| ID | Issue | Sev | Source | Redesign must |
|---|---|---|---|---|
| ACC-01 | The first Tab press darkens the page and blocks the mouse | Blocker | REG | Show the overlay only while the accessibility panel is open, never on focus. |
| ACC-02 | Skip link goes nowhere on most templates | Blocker | REG | Keep one skip link. Wrap each template's content in <main id="content" tabindex="-1"> so the existing link lands on it. |
| ACC-04 | Meaningful images are marked as decoration | Blocker | REG, CA | Write alt text for every image that carries meaning: the emblem → “Government of India”; a person → name and designation; a banner → its message. |
| ACC-06 | SAMAVESH band text and icons fail contrast | Blocker | REG, CA, FR HP-06 | Decide in the design, then change one style. |
| ACC-08 | Keyboard focus is invisible on buttons and pagination | Blocker | REG, CA | Apply one focus style to every focusable element: outline in focus/ring at focus/width, offset by focus/offset, with focus/ringInner on dark grounds. |
| ACC-03 | Headings do not form an outline | Major | REG, CA | Give every page one <h1> that matches its title (Elementor: heading → HTML Tag → H1; keep the look). |
| ACC-05 | Icon buttons and image links have no name | Major | REG, CA | Name every icon-only control with aria-label (“Accessibility options”). |
| ACC-07 | Blue text on light tints fails contrast | Major | REG | Set these texts to text/link/brand/default on light tints, and cookie descriptions to text/neutral/subtle. |
| ACC-10 | Elements forced into the Tab order with tabindex above 0 | Major | REG | Remove every positive tabindex; use 0 (focusable in order) or -1 (focusable by script only). |
| ACC-11 | Carousels, logo strip and ticker cannot be paused | Major | REG, CA | Add a visible Pause/Play button before each moving region; pause on hover and on keyboard focus; do not auto-advance when prefers-reduced-motion is set. |
| ACC-12 | Header controls: menu links, hidden search button and empty outputs in the Tab order | Major | REG, CA | Make each menu trigger a <button aria-expanded>; remove the off-screen search button from the Tab order while hidden; delete the four empty <output> elements. **Partly resolved 2026-09-22:** menu triggers are now `<button aria-expanded>` in the design system; the hidden-search-button and empty-output items are still open. |
| ACC-13 | “Important Links” tab cannot be reached by keyboard | Major | REG | Make the trigger a <button> named “Important Links” with aria-expanded; manage the drawer as a dialog — focus moves in, stays in, Escape closes it and focus returns to the tab. |
| ACC-14 | Accessibility and language buttons vanish in High Contrast mode | Major | REG | Draw both icons as inline SVG in currentColor, with a text label. |
| ACC-15 | Tap targets are too small | Major | REG, CA | Give every control a hit area of at least target/min, aiming for target/comfortable, keeping the drawn size (padding or an invisible ::before). |
| ACC-16 | Data tables are not marked up as tables | Major | REG, CA | Add the matching id to each DataTables table, scope="col" to header cells and a <caption> naming the table. |
| ACC-17 | New windows open without warning | Major | REG, CA | Add “(opens in a new window)” as visually hidden text or an icon with that name; mark links to non-government sites. |
| ACC-18 | Links in body text are told apart only by colour | Major | REG | Underline links inside running text. |
| ACC-19 | Embedded frames have no title | Major | REG | Give every iframe a title saying what it shows (“Map: office location”, “Facebook posts of the Ministry”). |
| ACC-21 | Filter results change without being announced | Major | REG | Show the result count in a role="status" element and update it on every change; show a distinct “No results for <filter> — Clear filter” message. |
| ACC-23 | Search and feedback fields have no labels | Major | REG, CA | Give each field a <label> (visually hidden for search) and one line of instructions above the feedback form. |
| ACC-26 | Control edges and carousel arrows are too faint | Major | REG | Give the arrows a solid backing in bg/neutral/inverse at 60% or more, with icons in text/neutral/inverse, and a hit area of target/comfortable. |
| ACC-27 | Links named only “View”, “Download” or “Read More” | Major | REG | Say what opens: “Download Annual Report 2025-26 (PDF, 4 MB)”, or add visually hidden text after “View”. |
| DOC-01 | Most published PDFs are not accessible | Major | REG, CA | Publish text-based, tagged PDFs: export from the source document with “tagged PDF” on, run OCR on scans, and set Title and Language. |
| LAY-03 | Listings have no loading, empty or no-results state | Major | REG | Show skeleton rows while loading; show “No results for <filter> — Clear filter” when a filter matches nothing; hide a block that has nothing to show. |
| ACC-20 | Landmarks duplicated or unnamed | Minor | REG | Remove role="contentinfo" from .mosje-visitor-counter; add aria-label="Main menu" and "Footer menu"; place the widgets inside a labelled region. |
| ACC-22 | CCPS banner's text is inside the image; on phones the slider dots cover its phone number | Minor | REG | Department: move the slider dots below the image so they never cover banner content. |
| ACC-24 | Card text is clipped when text spacing is increased | Minor | REG | Let card height follow the content (min-height instead of height). |
| ACC-28 | No visible text-size shortcut in the top bar | Minor | REG, FR HP-01 | Add A+ / A− beside the accessibility icon, or label the icon “Accessibility options (text size, contrast …)”. |
| X-ACC-01 | Zero prefers-reduced-motion rules against four autoplaying carousels; carousel dots 6×6px | Major | CA P0 #8, #10 | Honour reduced motion; no autoplay; 24×24 minimum hit area |
| X-ACC-02 | NIC validation sheet: Elementor tabs (Offerings, Our Organisations, Activity Corner) not keyboard-operable — disputed by vendor | Major | GOV §6 | Tabs as proper ARIA tablist; evidence by keyboard + screen-reader test, not plugin claim |
| X-ACC-03 | Only 26.1% of GIGW WCAG checkpoints pass (5 pass/2 partial/16 fail of 23) | Blocker | CA §2.2 | Redesign must be WCAG 2.2 AA by construction; accessibility audit gate before launch |

### GIGW 3.0 (mandatory pages, governance, interoperability) — 14

| ID | Issue | Sev | Source | Redesign must |
|---|---|---|---|---|
| MAN-01 | No Accessibility Statement | Blocker | REG, CA | Publish the page — the conformance target, known gaps with target dates, how the site was tested, and a contact for access problems — and link it in the footer on every page. |
| MAN-03 | Footer is missing DBIM's four required sections | Blocker | REG, CA | Add the four sections. Website Policy: one page linking Copyright, Hyperlinking, Privacy, Terms, Disclaimer, Accessibility Statement and Screen Reader Access. |
| MAN-07 | Contact Us has no phone, email, helplines or designated officers | Blocker | REG, CA, FR CT-01..03 | Organise the page by how people reach out — Call, Write, Visit — with the switchboard, helplines (tap-to-call), a departmental email and hours at the top. |
| MAN-08 | RTI page gives no guidance | Blocker | REG | Add how to file, the fee, the rtionline.gov.in link, the CPIO and First Appellate Authority with contacts, and the §4(1)(b) proactive-disclosure manuals. |
| MAN-02 | No Screen Reader Access page | Major | REG, CA | Publish the standard Screen Reader Access table (NVDA, JAWS, VoiceOver, TalkBack — website, free or commercial) and link it in the footer. |
| MAN-04 | No Disclaimer page | Major | REG | Publish a Disclaimer and link it under Website Policy. |
| LAY-04 | Printing a page prints the whole website | Minor | REG | Add @media print that hides site chrome and prints the page address and last-updated date. |
| MAN-09 | Footer links “Sitemap” and “Terms & Conditions” go through a redirect | Minor | REG | Link the final addresses: /home-page/sitemap/ and /home-page/terms-conditions/. |
| MAN-10 | Footer does not say who designed, developed and hosts the site | Minor | REG | State the designing, developing and hosting agency. |
| MAN-11 | No way to report a problem with a page | Minor | REG | Add “Report a problem with this page” to the footer, opening the feedback form with the page address filled in. |
| X-GIGW-01 | No MyScheme / India Portal / DigiLocker API integration (GIGW mandatory checkpoint 21) | Major | IA §B1, R7 | Publish scheme data as open API; register with myScheme |
| X-GIGW-02 | STQC CQW certification not claimed; VAPT/Safe-to-Host currency unconfirmed; no Web Information Manager published; content review/backup policies unpublished | Major | CA §9 Governance | Needs a person: obtain/publish certificates; designate WIM; publish review cadence |
| X-GIGW-03 | No Feedback page and no Website Policies hub | Major | CA P2 #30, REG MAN-03 | /feedback/ page; Website Policy hub linking all policy pages |
| X-GIGW-04 | Scanned job-application form instead of an HTML form | Major | CA P0 #11 | Accessible HTML form |

### DBIM 3.0 (brand) — 15

| ID | Issue | Sev | Source | Redesign must |
|---|---|---|---|---|
| BRD-01 | The site ships a second, violet primary colour | Major | REG, CA | Map the UX4G variables to the brand ramp after ux4g-min.css loads (--bs-primary → bg/brand/primary/bolder, --bs-link-color → text/link/brand/default), then take the one-colour-group decision (tracker T01) on one palette. |
| BRD-02 | Colours outside the functional palette | Major | REG, CA | Replace each tint with a palette token (bg/brand/primary/base, bg/brand/secondary/base, bg/neutral/subtle) and use one ink, text/neutral/base, for body text. |
| BRD-03 | Footer uses the base blue, not the darkest shade; its links fail contrast | Major | REG, CA | Set the footer to bg/brand/primary/boldest and its text to text/neutral/inverse — 11.4:1, AA and AAA. |
| BRD-04 | Icons from three families, in off-brand colours and formats | Major | REG, CA | Use one SVG icon set (the DBIM toolkit, or the estate's Material Symbols Rounded where the kit has none), coloured icon/brand/primary/bolder or text/neutral/inverse. |
| BRD-07 | Portraits stretched and inconsistent | Major | REG, CA | Commission one portrait set — same crop (head and shoulders), plain background, at least 600×600px — use object-fit: cover, and a designed placeholder where there is no photo. |
| BRD-11 | No PM Quote on the home page | Major | REG, CA | Add the PM Quote block in DBIM's format, with image and quote from an authorised source. |
| BRD-12 | Social media feeds show empty boxes | Major | REG, CA, FR HP-17/OD-06 | Replace the three feeds with static cards — platform icon, account name, one line and a link to the profile. |
| TYP-01 | Heading sizes are on neither DBIM's nor UX4G's scale | Major | REG, CA | Choose one scale (tracker T05) and map every text style to the type tokens: type/headline/1–6, type/title/1–3, type/body/1–3, type/label/1–3. |
| BRD-05 | Icon sizes outside DBIM's four | Minor | REG, CA | Render every icon at 24, 32, 48 or 64. |
| BRD-06 | Two icons are stretched | Minor | REG, CA | Draw each at its own proportions (set one dimension, or object-fit: contain). |
| TYP-03 | Fonts other than Noto Sans | Minor | REG, CA | Set every text style to ref/font/family/latin (Noto Sans); paste into the editor as plain text. |
| TYP-04 | Large headings do not use Noto Sans Display | Minor | REG, CA | Use ref/font/family/display for text type/display/4 and larger. |
| X-DBIM-01 | DBIM overall 51.3% (57.5% like-for-like); 15 checkpoints failed May and still fail; 3 of 4 tracker "Done" tasks do not verify | Major | CA §2.1, §11 | Redesign scored against all 80 DBIM checkpoints; tracker merged with GIGW/UX4G rows |
| X-DBIM-02 | National Emblem SVGs 196/195 KB (>100 KB); ministerial headshots inconsistent | Minor | CA P1 #14, #19 | Compress emblem <100 KB; one headshot spec |
| X-DBIM-03 | Header logo data does not change with language (NIC sheet, open) | Minor | GOV §6 | Lineage/logo text localised in every language |

### Visual design / UX4G / components — 48

| ID | Issue | Sev | Source | Redesign must |
|---|---|---|---|---|
| BRD-10 | No shared design system in the build | Major | REG | Rebuild the templates on one token set and one component library: one type ramp (type/*), one button family (cmp/button/radius), one radius scale (shape/*), one elevation scale (elevation/*), one container (container/content). |
| BRD-15 | Our Organisations cards: gradient, cut-off emblems, uneven line spacing | Major | REG, FR HP-12 | Remove the gradient; show every logo whole inside one fixed logo box; set names with normal line spacing (type/title/*); give every card the same structure — logo, full name, one line, destination. |
| DES-A-01 | The design draws #0373DF text on #EBF3FB | Major | REG, DR | Change the text colour style from #0373DF to text/link/brand/hover (nearest token to #014B92) (the site's dark blue (footer strip)) — 7.74:1 on #EBF3FB; or keep #0373DF and lighten the ground from #EBF3FB to bg/neutral/base (neare |
| DES-A-02 | The design draws #E2E6EA text on #0373DF | Major | REG, DR | Keep #E2E6EA and darken the ground from #0373DF to bg/brand/primary/bolder (nearest token to #0365C4) (5.07:1); or change the text colour style from #E2E6EA to text/neutral/inverse (the site's white) — 4.64:1 on #0373DF. |
| DES-A-03 | The design draws #0373DF text on #F8F9FA | Major | REG, DR | Change the text colour style from #0373DF to text/link/brand/hover (nearest token to #014B92) (the site's dark blue (footer strip)) — 8.22:1 on #F8F9FA; or keep #0373DF and lighten the ground from #F8F9FA to bg/neutral/base (neare |
| DES-A-04 | The design draws #FFFFFF text on #207BD3 | Major | REG, DR | Keep #FFFFFF and darken the ground from #207BD3 to bg/brand/primary/bolder (nearest token to #1F79CF) (6.36:1); or change the text colour style from #FFFFFF to #0A0A0A — 4.55:1 on #207BD3. |
| DES-A-05 | The design draws #FFFFFF text on #FF671F | Major | REG, DR | Keep #FFFFFF and darken the ground from #FF671F to bg/brand/secondary/bolder (nearest token to #FA651E) (4.97:1); or change the text colour style from #FFFFFF to text/neutral/subtle (nearest token to #374151) (the site's secondary |
| DES-A-06 | The design draws #FFFFFF text on #EC5042 | Major | REG, DR | Keep #FFFFFF and darken the ground from #EC5042 to bg/status/error/bolder (nearest token to #D0463A) (6.72:1); or change the text colour style from #FFFFFF to text/neutral/bolder (nearest token to #1F1F1F) — 4.57:1 on #EC5042. |
| DES-A-10 | 516 text layers use a typeface other than Noto Sans | Major | REG, DR | In each frame listed, select the text (Figma: Edit → Select all with same font) and apply the matching Noto Sans text style from the SAMAVESH library; Druk Wide and Poppins have no place in a Government of India page. |
| DES-A-11 | 1325 text layers are smaller than 12px | Major | REG, DR | Raise every layer below type/body/3 to Body/XS (type/body/3 / type/body/1 line height) — in practice the masthead lineage text (“Government of India”, type/label/2), the BETA badge and card meta lines. |
| DES-A-12 | Font sizes outside the UX4G type scale | Major | REG, DR | Re-point each off-scale text style to the step shown, in the SAMAVESH text styles, so the values developers read from the handoff are always on the UX4G scale. |
| DES-A-13 | Two Home designs, and two Schemes & Services designs | Major | REG, DR | Decide which is current and move the other to the Archive page: Home — keep 51821:33657 (newer) or 3453:7805 (✅ flow); Schemes & Services — adopt Scheme Discovery and archive the ✅ flow version, as its read-me proposes. |
| LAY-02 | Hero titles sit 20px off the content column | Major | REG | Put the hero title on the same left edge as the content: one container (container/content), one gutter. |
| LAY-07 | Cards are only partly clickable | Major | REG, FR OD-01 | Make every card one link. Put a single <a> on the card's title and stretch its hit area over the whole card (a ::after covering the card), so the card has one accessible name — the title — and one Tab stop. |
| LAY-08 | One content type, many card designs | Major | REG, FR HP-11/OF-01 | Agree one listing card and one document card and use them everywhere: organisation · title (two lines max) · one key date or status · one action pinned to the card's foot. |
| LAY-09 | Listing pages open with a 340px banner | Major | REG, FR OF-05 | Use a short header: breadcrumb, title, one line of description. |
| LAY-14 | Organisation page header fills the first screen and offers no actions | Major | REG, FR CT-04 | Build one compact organisation header in the design system and use it on every organisation page: breadcrumb; the logo whole at its own aspect ratio beside the name as the page heading (type/headline/1); one line saying what the b |
| TYP-02 | Text set below 12px | Major | REG, CA | Raise all text to at least type/body/3 (type/body/3). |
| BRD-08 | A 1.74 MB photo drawn 100px wide | Minor | REG, CA | Point the strip at Babuji-Photo-150x150.png. |
| BRD-14 | Gallery photographs cropped inconsistently | Minor | REG | Use one crop ratio for thumbnails and use photographs, not screenshots or posters. |
| BRD-16 | Partner logo strip looks pasted together | Minor | REG, FR HP-16 | Put every logo in the same size box, centred, with equal padding; use official logos with transparent backgrounds at their own proportions. |
| BRD-17 | Mega menu is grey while the header is white | Minor | REG, FR HP-03 | Make the menu bg/neutral/base with a thin border/neutral/subtle edge and elevation/dropdown. **Resolved 2026-09-23:** `bg/neutral/base` and the `border/neutral/subtle` edge landed in Figma and code on 22 Sep; the shadow did not. `Navbar/MegaMenu` and `Navbar/NavDropdown` bind `elevation/dropdown` in the library, while both panels in code still drew `elevation/modal` until 23 Sep — the 22 Sep note claimed the whole row. The simple dropdown is corrected with the mega panel, because one shadow for one kind of panel is the point. |
| BRD-18 | Gallery tabs are black | Minor | REG, FR EG-04 | Use the site's standard tab style (the one under Our Offerings). |
| BRD-19 | Missing images show a “No Image” box | Minor | REG | Design a fallback (a neutral tile with the organisation's mark or a category icon), or drop the image area when there is no image. |
| BRD-20 | Organisation page sections all sit on white | Minor | REG, FR OD-03 | Alternate bg/neutral/base and bg/neutral/subtlest in the same order on every organisation page. |
| DES-B-01 | Interaction and data states are almost entirely undrawn | Minor | REG, DR | Draw each as a variant on the SAMAVESH component (not per page), then place one example of each listing state on the Documents page of the handoff, so developers have a frame to build and QC has a frame to check against. |
| DES-B-02 | The DBIM-compliant screens exist at desktop width only (8 frames, 0 phone) | Minor | REG, DR | Draw the 375px version of each DBIM frame from the same components, then retire the superseded phone frames in the ✅ flow. |
| DES-B-03 | The DBIM-compliant footer exists on the DBIM page only | Minor | REG, DR | Make the DBIM page's footer the one Footer component (Archives, Website Policy, Related Links, Feedback, plus the existing lineage and policy row), swap it into every ✅ UI Flow frame (Figma: select the old footer instances → Swap  |
| DES-D-01 | Draw a visible focus state | Minor | REG, DR | Add a Focus variant to the Pagination component (page numbers and previous/next) and to the hero carousel slide: focus/ring outline, focus/width wide, at focus/offset. |
| DES-D-02 | Give every control a 44×44px hit area | Minor | REG, DR | In the Navbar, Footer and document-card components, set each link's hit area to target/comfortable tall (type/headline/4 text + type/body/3 vertical padding) with stack/8 between neighbours. |
| DES-D-03 | Put the DBIM 5.6 footer in every frame | Minor | REG, DR | Use the DBIM page's footer (Archives, Website Policy, Related Links, Feedback) as the only Footer component and swap it into all ✅ UI Flow frames. |
| DES-D-04 | Annotate heading levels on the frames | Minor | REG, DR | Label each heading on the handoff with its level — page title H1, section titles H2 (including the “Need Support?” band), card titles H3 — so the build does not pick tags by size. |
| DES-D-05 | Keep type on the UX4G scale | Minor | REG, DR | Remove the 8/10/11/13/15px styles from the file; use type/body/3, type/body/2 and type/body/1. |
| DES-D-06 | Make each gallery card open its album page | Minor | REG, DR | In the Events & Gallery design, draw the card click-through to a Gallery album page (title, date, organisation, photo grid, lightbox) and design that page; the live cards currently open a bare CDN image. |
| DES-D-07 | Write each page's own description | Minor | REG, DR | Provide the standfirst for every listing page in the design (the live Gallery page shows the Annual Reports description; the four audience pages share one sentence). |
| LAY-01 | Spacing, radius, shadow and layering off the UX4G scales | Minor | REG, CA, FR HP-05 | Snap spacing to the stack/* and section/* tokens, radii to shape/*, shadows to elevation/*, and layering to z/*. |
| LAY-05 | No clear primary action on content pages | Minor | REG | Give each page one primary action styled as the primary button. |
| LAY-06 | Labels sit as far from their values as from the next item | Minor | REG, FR OD-07 | Keep a label within stack/4–stack/8 of its value and stack/24 between items. |
| LAY-10 | About Us buttons: three equal buttons pushed to the left | Minor | REG, FR HP-08 | Either keep one link (About Us), or make three equal cards across the row, each with an icon, a title and one line. |
| LAY-11 | Dashboard strip describes each number differently | Minor | REG, FR HP-09 | Give every number the same parts — label, number, period, source — and make View Dashboard easy to find. |
| LAY-12 | About Us is 15,000px long with three table styles | Minor | REG, FR AU-01/AU-03 | Add a contents list at the top, one table style, collapsible reference tables, and a real timeline: date, one-line headline, two-line summary, Read More. |
| TYP-05 | Numbers in tables are not right-aligned | Minor | REG, CA | Right-align numeric columns. |
| TYP-06 | Title Case applied unevenly | Minor | REG | Use Title Case for every heading and navigation label. |
| TYP-07 | Justified text and paragraphs in capitals | Minor | REG | Left-align body text; write paragraphs in sentence case. |
| TYP-08 | Section introductions look like body text | Minor | REG | Use one section-heading pattern: title (type/headline/*), a short description (type/body/2 in text/neutral/subtle), then body text. |
| TYP-09 | Whole statements set in italics | Minor | REG | Set them in regular type; keep italics for short emphasis. |
| TYP-10 | Department name in the header is large and tight | Minor | REG, FR HP-02 | Set it one step down (type/title/1) with normal leading, and keep clear space between the name, search and Login. **Resolved 2026-09-23:** the ramp has no fixed step between 16 and 20 (Headline 5 and Title 1 are fluid, 18–20 and 18–22), so the department line takes Headline 6, 16/24 SemiBold — flat, so the masthead height no longer moves with the viewport. That landed in `BrandLockup` in Figma on 22 Sep (Tablet and Desktop at `Headline/headline-6`, Mobile and every Compact and Condensed variant at `Title/title-3`); the code still carried Headline 5 at the default rung until 23 Sep, so the line measured 20px and moved with the viewport for a day. The mobile and compact rungs in code were already right. |
| X-VIS-01 | UX4G depth system not adopted: 0% elevation conformance (6 ad-hoc shadows), ~15% z-index on scale, 36% radii off-scale, 19% spacing off base-4 (5px/10px) | Minor | CA §2.3 | Elevation L1–L4, z ladder, shape/*, base-4 spacing tokens only |

### Performance — 7

| ID | Issue | Sev | Source | Redesign must |
|---|---|---|---|---|
| PRF-01 | Pages are heavy and slow | Blocker | REG, CA | Work through PRF-02 to PRF-05; aim for under 1.5 MB and a Largest Contentful Paint under 2.5 s on the home page. |
| DOC-03 | Annual reports of 90–195 MB with no lighter version | Major | REG, CA | Compress for screen (usually under 10 MB) and offer chapters separately; keep the print-quality file as an option. |
| PRF-02 | CSS and JavaScript are unminified and oversized | Major | REG, CA | Minify CSS and JS; load export libraries only on pages with a table; drop unused page-builder bundles. |
| PRF-03 | Fonts loaded twice; ten console errors on every page | Major | REG | Self-host two subsetted WOFF2 weights of ref/font/family/latin, remove the Google Fonts request and set font-display: swap. |
| PRF-04 | Images unsized and not scaled for phones | Major | REG | Add width and height; serve srcset in modern formats; lazy-load everything below the fold. |
| PRF-05 | Slow server response and short cache lifetimes | Major | REG | Cache full pages for anonymous visitors; give versioned static files long cache lifetimes; defer non-critical CSS and JS. |
| PRF-06 | Home page shifts while loading on a slow phone | Minor | REG | Reserve space for the hero, the ticker and any late-loading band. |

### SEO / Metadata — 6

| ID | Issue | Sev | Source | Redesign must |
|---|---|---|---|---|
| SEO-02 | No keywords, persona tags or document metadata | Major | REG, CA | Add keywords and persona tags; map document records to the Metadata and Data Standards fields. |
| SEO-01 | Missing and reused page descriptions | Minor | REG | Write a 120–160 character description for each page. |
| SEO-03 | No sharing image, theme colour or manifest | Minor | REG | Add a default og:image and page-specific ones; add theme-color and a manifest. |
| SEO-04 | Structured data describes listings as articles | Minor | REG | Use GovernmentOrganization and WebSite on the home page and the right type per template. |
| SEO-05 | 296 reachable pages are missing from the XML sitemap | Minor | REG | Add or exclude (noindex) each page type deliberately. |
| SEO-06 | Page heading and browser-tab title differ | Minor | REG | Start the tab title with the page's H1. |

### Multilingual — 3

| ID | Issue | Sev | Source | Redesign must |
|---|---|---|---|---|
| LNG-01 | No maintained Hindi site | Blocker | REG | Publish and maintain a Hindi edition at its own addresses (/hi/…) with hreflang pairs; keep Bhashini for other languages; publish Hindi versions of documents where the Act requires both. |
| LNG-03 | Page language stays “en-US”, even in Hindi | Major | REG, CA | Set Site Language to English (India), which outputs lang="en-IN"; have the translator set lang to the language it switches to. |
| X-LNG-01 | Bhashini translation is machine translation of an English site; query translation loses proper nouns | Major | SB, CA §3.1 | Hindi edition maintained by hand; Bhashini for other 20 languages; per-language index later |

### Search — 4

| ID | Issue | Sev | Source | Redesign must |
|---|---|---|---|---|
| LNG-02 | Hindi search returns nothing | Blocker | REG | Index Hindi titles and content, and transliterations of scheme names. |
| NAV-11 | Search has no address and does not read documents | Major | REG | Give results an address (/search/?q=…) and index document text. |
| X-SRCH-01 | Clone: masthead search posts to /website/search which 404s | Blocker | SB | Build results route, index derived from site data, autocomplete, facets in URL, zero-result routing; gate: every route has an index entry |
| X-SRCH-02 | Live search matches tag substrings ("disability" → 18 of 19 irrelevant); PM-SURAJ unfindable; no persona facet | Major | IA D7, CA G45/M4 | Index the scheme model (names, synonyms, Hindi transliterations, keywords); persona facet; point to depwd.gov.in where relevant |

### Mobile — 5

| ID | Issue | Sev | Source | Redesign must |
|---|---|---|---|---|
| ACC-09 | At 200% zoom the sticky header covers 77% of the screen | Blocker | REG | Make the header sticky only when the window is at least 1024px wide and 640px tall; below 760px of height collapse it to one bar; hide the chatbot launcher and the edge tab on small windows. |
| MOB-01 | Phone menu lets the page scroll behind it | Major | REG | Lock page scroll while the menu is open and hide floating widgets. |
| MOB-02 | Tabs and cards clip at the edge on phones | Major | REG | Let tab rows wrap or scroll inside a labelled region. |
| MOB-03 | Tables overflow and the Directory runs 60,000px on phones | Major | REG | Put wide tables in a scrollable, labelled region; page the directory (e.g. |
| MOB-04 | Floating tab and chatbot cover content | Major | REG, FR HP-07 | Show the tab only after the hero has scrolled away; make it smaller; keep it clear of the chatbot; hide or shrink both below 1024px. |

### Trust / Security / Privacy — 8

| ID | Issue | Sev | Source | Redesign must |
|---|---|---|---|---|
| CON-02 | Test and deleted records are public | Blocker | REG | Unpublish them, return 410 Gone, and remove them from the sitemap and search. |
| CON-09 | Personal and free email addresses as official contacts | Blocker | REG | Replace them with @gov.in or @nic.in role addresses; remove personal addresses. |
| SEC-01 | The cookie banner does not stop tracking | Blocker | REG, CA | Load analytics, social embeds and third-party fonts only after “Accept All”; set nothing but strictly necessary cookies before a choice. |
| SEC-02 | Privacy Policy says only session cookies are used | Major | REG | List every cookie with its purpose and retention, the lawful basis and a grievance contact. |
| SEC-04 | Content-Security-Policy does not restrict scripts | Major | REG, CA | List the real script origins; remove 'unsafe-eval'; move inline scripts to files or use nonces. |
| CON-01 | Job feed from NCS shows employers' posts with no label saying where they come from | Minor | REG | Head the section “Jobs on the National Career Service (ncs.gov.in)” and add one line: “Posted by employers on NCS. |
| SEC-05 | Server software and API are advertised | Minor | REG | Suppress the Server header; restrict /wp-json/ to what the site needs. |
| SEC-06 | Cross-origin isolation headers missing | Minor | REG | Add both. |

### Data freshness / Archival — 7

| ID | Issue | Sev | Source | Redesign must |
|---|---|---|---|---|
| CON-06 | Figures that contradict each other | Blocker | REG | Take each figure from one source, once, and show its date. |
| MAN-05 | “Last Updated” shows today's date, not the last change | Blocker | REG | Print each page's stored modification date. |
| CON-18 | Annual Reports: no version or release date; wrong years | Major | REG, CA | Add a release-date column and correct each report's Year (tracker T36 / T37). |
| MAN-06 | No archive; closed tenders and vacancies stay live | Major | REG, CA | Add an Archives section. Move an item there automatically when its closing date passes, and show the archival date. |
| X-FR-01 | Scheme records that are status tables frozen in 2018; events feed item slugged test-2-state-rajasthan | Major | IA D8, SP §2 | Move to Dashboard/archive with as-on date; purge test records |
| X-FR-02 | Recent Documents not newest-first (NIC sheet, open) | Minor | GOV §6 | Sort by publish date desc everywhere; one Latest Updates feed |
| X-FR-03 | Schemes table client-rendered ("Loading…" in HTML) | Major | IA D8 | Server-render listings |

### 1b. Page-level roll-up (REG P/T/Q ids — 1,828 rows; fix per page, but the redesign template must make each class impossible)

| Category | Blocker | Major | Minor | Nit | Dominant patterns → template rule |
|---|---|---|---|---|---|
| Content Accuracy | 104 | 563 | 368 | 31 | contradictory figures, dates, typos, copied standfirsts, wrong titles, "NA"/empty cells, personal Gmail contacts → structured fields with validation; no free-text contacts; one source per figure |
| Accessibility | 24 | 116 | 58 | 4 | untitled/empty pages, CMS blocks published as pages, scanned documents as content, obfuscated emails, axe failures (ARIA children, unnamed selects/svgs, scrollable regions) → template h1 + content required; HTML over scans |
| Layout & Components | 5 | 54 | 129 | 40 | 320px reflow failures, unfocusable hero, uneven card grids, clipped embeds → responsive tables, one card, focus ring by default |
| Brand & Visual Design | 9 | 67 | 47 | 5 | contrast pairs (green 29,015 stat, badges #3C9718, SAMAVESH band), broken image placeholders, black video tiles → token-only palette, designed image fallback |
| Typography | 0 | 50 | 33 | 11 | Arial fallback, 13px/15px off-scale, justified text, missing spaces → Noto Sans + UX4G ramp only |
| Mobile & Responsive | 6 | 33 | 34 | 1 | tables cut at viewport, sideways scroll, clipped tabs → reflow at 320 |
| Navigation & IA | 1 | 13 | 19 | 0 | RTI no guidance, breadcrumb/back-link repeats, "for Student" titles → template breadcrumb + titled pages |
| Code Quality | 1 | 2 | 0 | 0 | dead internal links, gallery linking to CDN files, 590 orphan gallery pages → every published item reachable by navigation |

## 2. Stakeholder decisions and directives

| # | Decision / directive (brief) | Who / when | Source |
|---|---|---|---|
| 1 | No counts/numbers on discovery screens, frames or slides ("134" unvalidated; remove "12 active schemes", "19 schemes") | 8 Sep review | SD §2 #1–2, #14 |
| 2 | Exception: counts stay on the grouped Schemes page, one per heading, computed from the feed at render, never typed | 14 Sep (later) | SR §3 |
| 3 | Discovery = two axes, two screens: persona (Who It Is For) then offering (What the Department Offers); drop "who is this for" and State questions; community question absorbs life stage | 8 Sep review | SD §2 #4–8, #11 |
| 4 | One vocabulary across persona panel, finders, schemes pages, chatbot — one master of 11 groups; SC/OBC/DNT shown as separate variants | 8 Sep review | SD §2 #3, #12 |
| 5 | Sequence opens on a female figure (Students, drawn as a young woman) — "AS is a woman" | 8 Sep review | SD §2 #13 |
| 6 | Apply links go to the portal or to the scheme page that carries the portal | 8 Sep review | SD §2 #10 |
| 7 | Categories are ten kinds of support (adds Housing & Settlement, Awards & Recognition); live 13 tags retired | 11–12 Sep | SIA §4, SR §3 |
| 8 | Menu: three options to Ma'am — rename "Associated Organisations" → "Organisations & Scheme Portals" (M1b), portals under Offerings (M2), Schemes as own menu (M2b); same label everywhere incl. filter "All Organisations & Scheme Portals" — choice pending | 14 Sep review | SR §1 #1–4 |
| 9 | "View All Schemes" becomes a full-width outlined button under the portals, not a heading link | 14 Sep review | SR §1 #3 |
| 10 | Schemes page: left sidebar — Type (Schemes/Services) top, Target Group, Category collapsible; every card shows category + administering org/portal; results grouped with headings (by org / by category variants); first visit opens on MoSJE; DWBDNC alone gets Central/State split | 14 Sep review | SR §1 #5–10 |
| 11 | Logo strip: "big logos, make them smaller"; one uniform background for every mark, never mixed; real e-Anudaan mark | Lead (akash negi), early Sep call | GOV §5 D1 |
| 12 | Page-wise role creation & responsibility mapping; whoever owns a page maintains it; vacancies/tenders/documents published by each org's own login and aggregated | Lead / Sir, early Sep | GOV §0 A, §2.5 |
| 13 | Question whether WordPress is the right configuration ("same info entered in many places") | Lead, early Sep | GOV §0 B |
| 14 | Present decks live, never mail them ahead | 8 Sep review | SD §2 #18 |
| 15 | Personas carousel minimum fix: "2 of 5" count, arrows beside persona name, illustrations not photographs | Friday design report HP-14 | REG NAV-05 |
| 16 | Pending Ministry decisions: one-colour-group palette incl. retiring UX4G violet (tracker T01); type scale DBIM vs UX4G (T05); PM Quote content; SAMAVESH band option A/B; WIM designation; NCBC Secretary / Minister Gmail listing; State schemes publish or withdraw; Foundation schemes placement; 11 target groups (Students, Victims of Atrocities, Voluntary Organisations) to confirm | Ministry — 14 of 41 tracker tasks awaiting confirmation | CA §11.2, §11.6; REG BRD-01, TYP-01, ACC-06, CON-26; SIA §9; SR #11 |
| 17 | Standing: Title Case for all titles (applies to dept titles too); government register copy; no tricolour motif; Noto Sans; National Emblem as logo; dbim brand mode code-only | Standing instructions 2026-06-13 / 08-11 / 09-01 | CLAUDE.md, .claude/rules/ui-restraint-and-copy.md |

## 3. Mandatory page inventory (live IA the redesign must cover)

Live sitemap (`tools/design-audit/projects/website/inputs/live-sitemap.tsv`, 8,781 URLs): page 94 · documents 6,000 · events 635 · gallery 590 · official 453 · tender 312 · organisation 248 · vacancies 164 · schemes-and-services 138 · scheme-documents 100 · suo-moto-disclosure 14 · cpio 13 · booking 12 · updates 9. Audited set: `tools/design-audit/projects/website/inputs/pages.json` (120 = 94 pages + 1 sample per record type).

**Primary nav (live):** Department · Associated Organisations · Offerings · Documents · Events & Gallery · Connect (IA D1).

**Templates (PAGE-CLONE-PLAN, `docs/compliance/PAGE-CLONE-PLAN.md`):**

| Template | Pages |
|---|---|
| T1 Content/inner (~26) | about-us, about-the-division ×6 (social-defence, statistics, OBC, -2, base), welfare-of-the-other-backward-classes, drug-division, official-language-act/-background/activities, social-defence-faqs, grants-in-aid-to-ngos-faqs, guidelines-for-assisting-ngos, cessation-of-voluntary-organisation-activities, penalties-…-misutilization, inspection-and-monitoring-procedure, procedure-for-processing-grant-in-aid, prioritization-guidelines (slug misspelt "vuluntary"), handbook-on-social-welfare-statistics, list-of-research-evaluation-studies, assurances, special-mention-matters-377, list-of-scheduled-castes, organisation-under-division-social-division, policies-acts-rules-* ×3, miscellaneous, meta-data, advertisement, visitor-analytics, newsletter |
| T2 Listing/documents (~24) | schemes-services, vacancies, tenders, annual-reports, circulars-notifications, publications, acts-rules, forms-templates, notices, mou, advices, policies, resources, suo-moto-disclosure, updates, minutes-of-screening-committees ×2, detailed-demand-for-grant, list-of-de-blacklisted-ngos, grants-suspended-list-blacklisted-ngos, supreme-court-judgement, lok-sabha-question-answer |
| T3 Directory (~17) | mosje-directory, whos-who, chairpersons-office, contact-person, cpio, + org directories: ncbc, ncsk, dwbdnc, daf, daic, nbcfdc, nsfdc, nskfdc, nisd, scw, bjrnf, pm-ajay, nhaa |
| T4 Persona landing (4 → DBIM wants 4 incl. Student, Researcher) | home-page/for-beneficiary, for-student, for-researchers, for-government-official |
| T5 Policy/legal (GIGW mandatory) | home-page/privacy-policy, terms-conditions, copyright-policy, hyperlinking-policy, help, sitemap, cookies, rti — MISSING: accessibility-statement, screen-reader-access, disclaimer, website-policy hub, feedback, archives |
| T6 Contact | contact-us, contact-us-2 (duplicate) |
| T7 Record detail (10+ types) | organisation/* (248, each a mini-site with its own contact/meetings/RTI subpages), schemes-and-services/*, scheme-documents/*, documents/*, events/*, gallery/*, official/*, tender/*, vacancies/*, updates/*, cpio/*, suo-moto-disclosure/*, booking/* |
| T8 Gallery/events | gallery (albums needed), events, video gallery (empty) |
| T9 Hub/dashboard | home, dashboard, samavesh-citizen-portals, samavesh-admin-portals, footer-carousel (CMS block published as page) |

**Home page components required by DBIM:** hero (1800×600 banners), CCPS campaign banner, PM Quote (missing), persona entry (4), scheme/service entry, What's New / Latest Updates, statistics strip, organisations strip, social cards, footer with Archives · Website Policy · Related Links · Feedback + lineage, last-updated, visitor counter (CA §4–5, REG MAN-03, BRD-11).

**Scheme IA target (SIA §5):** /schemes-services hub → /schemes (20 + components) · /credit (21 products) · /state-schemes/<state> (46, DWBDNC) · /services (portals, helplines).

## Counts

| Category | Register sitewide rows | Added from other docs | Total |
|---|---|---|---|
| IA / Navigation | 28 | 11 | 39 |
| Content | 28 | 4 | 32 |
| Accessibility / WCAG 2.2 AA | 28 | 3 | 31 |
| GIGW 3.0 (mandatory pages, governance, interoperability) | 10 | 4 | 14 |
| DBIM 3.0 (brand) | 12 | 3 | 15 |
| Visual design / UX4G / components | 47 | 1 | 48 |
| Performance | 7 | 0 | 7 |
| SEO / Metadata | 6 | 0 | 6 |
| Multilingual | 2 | 1 | 3 |
| Search | 2 | 2 | 4 |
| Mobile | 5 | 0 | 5 |
| Trust / Security / Privacy | 8 | 0 | 8 |
| Data freshness / Archival | 4 | 3 | 7 |
| **Total** | **187** | **32** | **219** |
