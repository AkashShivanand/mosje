# MoSJE [Handoff] — design change log extract

Source: Figma file `Ds5qx61QsI0ZkYSrLKxo0A` (lastModified 2026-09-17T07:34Z). Text read from every frame named *Change Log* / *Design Changelog*, in reading order, plus the 14 Sep 2026 Scheme Discovery Read Me (the most recent dated decision record in the file). Emoji markers kept as in Figma.

## Change log › Design Changelog (`3816:22780`) — Most complete consolidated log (Nov 2025)

**Design Changelog**
**Changes on**
### Nov 7, 2025
- ✅  Added
- Profile details view under Leadership Section of Organisation Details Page
**Changes on**
### Nov 11, 2025
- 🗑️  Deleted
- Removed Organisation Chart based on internal discussion and we are using Who’s Who and Directory to show organisation structure.
- ✅  Added
- Bookings Page and Booking Details View under Organisation Details Page Mobile Responsive Designs for Organisation Details Page Mobile Responsive Designs for Ministry Pages
**Changes on**
### Nov 14, 2025
- 🎾 Changed
- Updated Directory Desktop and Mobile UI to accommodate grouping of contact informations.

## Home › Design Changelog (`3997:63972`)

**Design Changelog**
- Home
**Changes on**
### Nov 14, 2025
- ✅  Added
- Dashboard UI

## Ministry › Design Changelog (`4263:65466`)

**Design Changelog**
- Ministry
**Changes on**
### Nov 11, 2025
- 🗑️  Deleted
- Removed Organisation Chart based on internal discussion and we are using Who’s Who and Directory to show organisation structure.
- ✅  Added
- Mobile Responsive Designs for Ministry Pages
**Changes on**
### Nov 14, 2025
- 🎾 Changed
- Updated Directory Desktop and Mobile UI to accommodate grouping of contact informations.

## Associated Organisations › Design Changelog (`3816:22713`)

**Design Changelog**
- Associated Organisations
**Changes on**
### Nov 7, 2025
- ✅  Added
- Profile details view under Leadership Section of Organisation Details Page
**Changes on**
### Nov 11, 2025
- ✅  Added
- Bookings Page and Booking Details View under Organisation Details Page Mobile Responsive Designs for Organisation Details Page
**Changes on**
### Nov 19, 2025
- ✅  Added
- Associated Organisation Items updated with provided organisation list.

## Home › Change Log (`7622:73098`)

### 8 June, 2026
**Change Log**
- Home Page
- Icons sizes matched with DBIM compliant sizes.
- Cookie consent modal added.
- Link

## DBIM › Change Log (`7702:46818`) — DBIM compliance pass

### 8 June, 2026
**Change Log**
- Home Page
- Icons sizes matched with DBIM compliant sizes.
- A cookie consent modal has been implemented. Headshot images have been replaced with ones featuring a clear white background. Key mandated elements: Archives, Website Policy, Related Links, and Feedback links have been added in the footer.
- Added the video duration display in the gallery section, featuring a more responsive hover state (To preview video while user hovers over the video thumbnail). Click here to View

## Offerings › 00 · Read Me — Decisions, Open Questions, Assets › Read Me — Scheme Discovery, Finalised (`52451:12338`)

_Decisions recorded at the review of 14 September 2026 (organisation filter label agreed 15 Sep). Two-column frame, read left column then right._

**Scheme Discovery — Finalised for Handoff**
- Options decided at the review with Ma'am on 14 September 2026. Screens in sections 01–05 are bound to the SAMAVESH Design System. Content is the Department's own; counts come from the classification of every Schemes & Services listing (docs/audit/website-schemes-placement-2026-09-09.csv).
**Decided**
- 1. Home page — Our Offerings, Schemes tab. A row of chips for the eleven Types of Applicant (SAMAVESH Chip); the selected chip is solid blue (Emphasis=Solid) and the first type is selected on load. Choosing a type shows the Department's portal or helpline for it first, then up to three schemes, then View All Schemes for that type. Drawn for Students and Senior Citizens.
- 2. View All Schemes opens Schemes & Services with that type already ticked and a Showing chip. Arriving directly, nothing is ticked and every scheme is shown.
- 3. Schemes & Services — filters in a side panel: Type (Schemes, Services) first, then Type of Applicant with pictures (more than one can be ticked), then Type of Benefit, collapsible. Results are grouped under the ten Types of Benefit, each heading with its count. A group with no schemes for the filters in force is not drawn.
- 4. Labels everywhere: Type of Applicant, Type of Benefit, Explore Specific Benefits. The benefit type is Care, Health and Shelter.
- 5. Menu — Associated Organisations lists organisations only: Commissions, Corporations, Foundation / Autonomous Bodies. The scheme portals sit in the schemes menu, with a full-width View All Schemes button. An organisation's own page says which schemes it implements.
- 6. Scheme Details — one format for every scheme. Key links at the top, in this order: Overview, Eligibility Criteria, Process, Updates, Apply for the Scheme. Sections follow the same order, then Documents, FAQs and Contact & Support. A section with no content is not shown. Updates opens the scheme dashboard; Apply for the Scheme opens the application form in a new tab, announced as leaving the website.
- 7. Assistant — asks the same two things (Type of Applicant, Type of Benefit) from the same mapping. Its wording is to be reviewed. Not drawn here.
**Needed before build**
- Every listing tagged Scheme or Service, and the one-to-many mapping of schemes to Type of Applicant and Type of Benefit confirmed by the divisions and shared with Ma'am.
- For each Type of Applicant: the portal or helpline shown first. For each scheme: its dashboard link and application form link.
- Documents, duplicate listings and organisation pages removed from the Schemes & Services list, so the counts describe schemes.
**Agreed next, not drawn here**
- A map of Department-funded centres — senior citizen homes, shelters, de-addiction centres, Garima Greh, PM-AJAY projects — with layers, Near Me, a district filter, and name, address and phone for the nearest centres; connect through the helpline or chatbot after a one-time login. The team is to send Ma'am the list of missing data (much is in e-Anudaan).
- Home photo gallery: latest four or five events up front — Chintan Shivir, 15 August, pledge events — once the media division confirms.
**Known gaps in this handoff**
- Scheme Details keeps the existing page's hero image, benefit cards, documents table and FAQ accordion from MoSJE Portal DS; its navbar, footer, breadcrumb, key links, Updates and Apply sections are SAMAVESH. The mobile page has no Benefits section today.
- Pictures for Persons Affected by Substance Use and Victims of Atrocities are 110 px sources — replace with art of at least 216 px.
- The Type of Applicant chips are one choice at a time: build them as a radio group (role radiogroup, arrow keys move, one tab stop) with an accessible name “Type of Applicant”, not as toggle buttons. The answer panel below updates in place, so announce it with a polite live region.
- The selected chip is drawn with local overrides until the SAMAVESH library is published; after publishing, switch it to Chip Emphasis=Solid and clear the overrides. Code: <Chip selected emphasis="solid">.
- Flagged for SAMAVESH: Site Footer (Mobile) cuts off its last legal link; Checkbox centres its label when stretched; Search master is 25 px tall.
- Local components in this section — Applicant Tile, Applicant Filter Row, Applicant Header, Portal Band, Result Row, Benefit Group Heading — are candidates for SAMAVESH.
**Open — kept as they are today**
- Menu label: Offerings stays for now. To be renamed Schemes Offered or Programmes Offered (Offerings is not a word government websites use).
- Tenders and Vacancies: stay under Offerings for now. They are to move out of the schemes menu; where they go is not decided. A scheme's own vacancy (for example, PM-AJAY PMU posts) may also appear inside that scheme.
- Organisation filter on Schemes & Services reads All Organisations & Scheme Portals (agreed 15 September). The menu label itself is still to be finalised.
