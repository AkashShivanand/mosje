"""Tier-B judgment findings for SMILE — Beggary (admin, DEV), authored 2026-09-10.

Every entry was read off the DESIGN frame and the BUILD capture side by side and re-verified
against the fresh images; none is carried from memory or from another portal's pass.
Rules applied: `~/.claude/skills/design-qc/references/audit-rules.md` — token-level style only,
no width/height, no copy rewrites, repeats consolidated into Global, severity from rubric.md.

(id, scope, screen, severity, category, title, design, build, fix)
"""

GLOBAL = [
# G01 (a page refresh signs the officer out) was REMOVED on the reviewer's instruction: this
# report raises DESIGN bugs only, and a session dropping on reload has no design counterpart to
# compare against. It is engineering, and it stays fully documented — with the measurement, 15 of
# 20 routes — in docs/audit/smile-beggary-capture-and-session.md.

 ("G02", "Global", "All list screens", "Major", "Color & Token",
  "The current page is a solid gold chip; the design outlines it in navy",
  "The active page is a white chip with a 1px navy #003366 outline and radius 8, its number in "
  "#1F2937. Every other page number is plain text on no fill. (Measured on the Users frame's own "
  ".page instances.)",
  "The active page is a solid gold #F5BE14 chip with black text. Gold appears nowhere else in the "
  "interface as a selected state, and it is not among the colours the SMILE Figma variables "
  "publish for an active control.",
  "Draw the active page as the design does — white fill, 1px #003366 outline, radius 8 — or, if a "
  "filled active state is wanted, fill it with the primary navy and set the number in white. Gold "
  "reads as a warning beside the Awaited and Pending chips these same tables carry. "
  "(Corrected 2026-09-10: an earlier draft of this finding called the build chip saffron/orange "
  "and the design chip navy-filled; measured, the build is #F5BE14 and the design is white with a "
  "navy outline.)"),

 ("G03", "Global", "All list screens", "Major", "Layout & Spacing",
  "The two halves of the pagination row are swapped",
  "Page numbers sit on the left, the record count and per-page selector on the right.",
  "The record count is on the left and the page numbers plus per-page selector are on the right — "
  "the mirror image, on every list screen.",
  "Return to the design's order: page numbers left, count and per-page right, so the control a "
  "reader reaches for is in the same place on every list in the estate."),

 ("G04", "Global", "All screens with a data table", "Major", "Typography",
  "The same table header is three different sizes depending on the screen",
  "One column-header style: Title Case at the body size in the primary navy, semibold.",
  "Measured across all 17 list screens: the header cell renders at 12px on fourteen of them, 14px "
  "on Users and City Profiling, and 11px on Performance Statistics. All of them are uppercased by "
  "text-transform and letterspaced, so the DOM says 'Name' and the screen says 'NAME'. On "
  "Notifications the twelve headers wrap onto two lines to fit.",
  "Pick one column-header style and bind every table to it — label-1 (14/20 Medium) is the closest "
  "published match. Three sizes for one element is what makes a set of list screens read as three "
  "different products; the uppercase is a separate decision to make deliberately, since it costs "
  "legibility and is what forces the two-line wrap."),

 ("G05", "Global", "All screens with KPI cards", "Minor", "Typography",
  "KPI card labels are uppercase, and some are truncated",
  "Card labels are Title Case at the label size, sitting above the figure — 'Total Users', "
  "'Identified/Surveyed', 'Total Notification'.",
  "Labels are uppercase and smaller, and where the label is long it is cut off with an ellipsis: "
  "the Notifications page reads 'TOTAL NOTIFIC…'.",
  "Set the label to Title Case at label-1 (14/20 Medium) and let the card grow to its content. A "
  "truncated label is a label the reader cannot use."),

 ("G06", "Global", "All screens with KPI cards", "Minor", "Color & Token",
  "KPI icons lost their tinted chip",
  "Each KPI icon sits in a rounded square filled with a light tint of that metric's colour, which "
  "is what makes the row of cards scannable.",
  "The icons are drawn bare on the card, in a flat colour, with no ground behind them.",
  "Restore the tinted rounded chip behind each KPI icon, using the same tint the design assigns to "
  "that metric."),

 ("G07", "Global", "Most list screens", "Minor", "Components & States",
  "The page-level export moved out of the header and became two buttons",
  "One 'Export' control sits on the header row at x=1349, level with the page title — on "
  "Beneficiary List, Consent Forms, Notifications, Survey Locations, Surveyor Mappings and the "
  "Dashboard. Users and Roles carry no export in the design at all.",
  "Two buttons, 'CSV' and 'PDF', sit above the title row at the top-right of the content area, out "
  "of line with the heading — including on Users and Roles, where the design draws none. The "
  "Beneficiary List has three: Download All (CSV), CSV and PDF.",
  "Return a single Export control to the header row aligned with the H1, and put the format choice "
  "inside it, so the header's action slot reads the same on every screen. Where the design has no "
  "export and the build does (Users, Roles), decide which is right and make both say so."),

 ("G08", "Global", "All screens", "Nit", "Content & Iconography",
  "The text-size controls gained plus and minus signs",
  "Three plain A glyphs at graduated sizes; size alone carries the meaning.",
  "The A glyphs carry superscript minus and plus signs.",
  "Confirm which is intended. If the signs stay, they belong in both the design and the build so "
  "the masthead is one specification."),

 ("G09", "Global", "All screens", "Minor", "Components & States",
  "The masthead's contrast control is now a light/dark toggle",
  "The accessibility bar carries a contrast control (the half-filled circle) beside the "
  "accessibility icon.",
  "That slot is a crescent moon labelled 'Light-Dark'; the neighbouring control is labelled "
  "'Invert Colors'. A theme switch and a contrast control are different affordances.",
  "Confirm the intent. GIGW expects a contrast affordance in the masthead; if light/dark replaces "
  "it, the contrast requirement needs to be met somewhere the reader can find it, and the design "
  "should be updated to match."),

 ("G11", "Global", "All screens", "Major", "Typography",
  "The sidebar is a different typeface and size from the design",
  "Every navigation label is Noto Sans at 14px — measured off the design frame's own text nodes "
  "(Dashboard, City Profiling, Performance Statistics, Users, Roles all report 14).",
  "The build renders the sidebar in the system stack (-apple-system) at 15px. Measured on Users, "
  "48 of the 181 on-canvas elements are in that stack and every one of them is a navigation item; "
  "across all 51 captures it is 2,128 elements.",
  "Set the sidebar to Noto Sans at 14px to match the design. The likely cause is a navigation "
  "component left on the framework's default sans stack rather than the app's."),

 ("G10", "Global", "All screens", "Major", "Responsive & A11y",
  "No accessibility statement is published",
  "The footer carries Terms & Conditions and Privacy Policy. There is no accessibility statement "
  "in the design either.",
  "Same — the footer publishes copyright, Terms & Conditions and Privacy Policy on all 22 screens "
  "checked, and no accessibility statement anywhere.",
  "Add an Accessibility Statement link to the footer and write the page behind it. GIGW 3.0 "
  "requires it on a Government of India property. This one is owed by the design as much as the "
  "build."),
]

SCREEN = [
 ("S01", "Screen", "Dashboard", "Major", "Components & States",
  "The Beneficiary Profile section was rebuilt with different charts",
  "Three cards across: Gender Distribution as a donut, Age Distribution as horizontal bars, and "
  "Beggar Type as a horizontal stacked bar, each with its own Export link and a one-line reading "
  "beneath it.",
  "Two wider cards: gender is drawn as a vertical bar chart behind Identification / Rehabilitation "
  "/ Mobilisation tabs, and the second card is a Swashraya donut. Age Distribution and Beggar Type "
  "are not on this row.",
  "Confirm the restructure is intended. If it is, the design frame needs to be brought up to it; "
  "if it is not, the three designed cards and their chart types should be restored."),

 ("S02", "Screen", "Dashboard", "Minor", "Components & States",
  "The six KPI cards became five, with two metrics merged",
  "Six equal cards: Identified/Surveyed, Mobilised, Shelter Assigned, Rehabilitated, Fund "
  "Disbursed, Fund Utilised.",
  "Five cards, one of which ('Shelter & Rehabilitation') holds two figures side by side, and "
  "'Rehabilitated' is presented as 'Combined Total Rehab'.",
  "Confirm the merge is intended and update the design frame to match, so the dashboard has one "
  "specification. A card holding two figures needs its own treatment in the design, not an "
  "improvised split."),

 ("S03", "Screen", "Dashboard", "Minor", "Layout & Spacing",
  "The KPI row lost its shared container",
  "The six cards sit inside one white panel under a PROGRAMME OVERVIEW rule, separated by hairline "
  "dividers, reading as a single block.",
  "The cards are separate surfaces with gaps between them.",
  "Restore the single panel with hairline dividers so the overview reads as one figure set rather "
  "than five unrelated tiles."),

 ("S04", "Screen", "Dashboard", "Minor", "Components & States",
  "The System Users panel's rows gained their own fills",
  "Rows sit flat on the navy panel; only the small leading icon has a lighter ground.",
  "Each row is a filled lighter-blue bar, and the longest label wraps onto two lines.",
  "Return the rows to flat-on-navy with the icon chip only, and keep the label on one line."),

 ("S05", "Screen", "Users", "Minor", "Components & States",
  "View Catalog sits on a different screen from the one the design puts it on",
  "Users carries two header actions: a secondary 'View Catalog' and the primary 'Onboard New User'.",
  "On Users that slot holds CSV and PDF instead. View Catalog is NOT missing from the build — it "
  "is on the ROLES screen, in the same header position (x=1154, y=158), on both super-admin and "
  "central-authority. The Roles design frame does not show it there.",
  "Confirm which screen owns View Catalog. If Users is right per the design, move it back and add "
  "it to the Roles frame's removal; if Roles is right, update both design frames to match. "
  "(Corrected 2026-09-10: an earlier draft of this finding said the action was absent from the "
  "build. It is not — it is on another screen.)"),

 ("S06", "Screen", "Users", "Minor", "Typography",
  "The Name column lost its emphasis",
  "The person's name is set semibold, which is what lets a reader scan the column.",
  "The name is set at the same weight as every other cell.",
  "Set the Name cell to weight 600, matching the design and the body-2-semibold style the "
  "variables publish."),

 ("S07", "Screen", "Users", "Nit", "Layout & Spacing",
  "The build carries two filters the design does not",
  "Search, All Roles, All Status.",
  "Search, All roles, All statuses, All States / UTs, All Districts.",
  "Confirm the extra filters are intended; if so, add them to the design frame. Showing all the "
  "relevant filters is the right instinct — this is a note, not a defect."),

 ("S08", "Screen", "Consent Forms", "Major", "Content & Iconography",
  "The breadcrumb puts Consent Forms under Access Control",
  "'Others › Consent Form' — the section the item actually belongs to.",
  "'Access Control / Consent Forms'. Consent Forms is not an access-control screen, and the "
  "sidebar files it elsewhere, so the breadcrumb contradicts the navigation.",
  "Point the breadcrumb's parent at the section the sidebar puts the screen in."),

 ("S09", "Screen", "Consent Forms", "Minor", "Components & States",
  "The date-range filter is not in the build",
  "A date-range field sits beside the search box, so submissions can be narrowed by when they "
  "arrived.",
  "There is no date filter; the row carries State, District and search instead.",
  "Add the date-range filter back. It is the only way to answer 'what came in this month' on a "
  "list that is paginated to 1,248 items."),

 ("S10", "Screen", "Consent Forms", "Minor", "Components & States",
  "The Submitted On column is not in the build",
  "Columns end with Document and Submitted On.",
  "The table ends at Document; the submission date is not shown.",
  "Restore the Submitted On column — a consent record without its date cannot be reconciled."),

 ("S11", "Screen", "Consent Forms", "Minor", "Color & Token",
  "Agency names are drawn as orange links",
  "The Implementing Agency / NGO value is plain body text.",
  "The value is an orange link. Orange is the estate's accent colour, not its link colour, and it "
  "reads as a warning state in a column that also carries Awaited chips.",
  "If the value should be a link, use the primary navy; if it should not, set it as body text."),

 ("S12", "Screen", "Notifications", "Minor", "Components & States",
  "The empty state sits under a full twelve-column table header",
  "The empty card stands alone under the filters, with no header row above it.",
  "The full header row is drawn above the empty card, and its twelve labels wrap onto two lines.",
  "Hide the column header when there are no rows, as the design does, so the empty state reads as "
  "an answer rather than a broken table."),

 ("S13", "Screen", "Notifications", "Minor", "Components & States",
  "The filters are not the ones the design specifies",
  "All States/UT and All Districts — the geography the rest of the estate filters by.",
  "All Types and All Channels.",
  "Confirm which set is right. Whichever it is, the design frame and the build should carry the "
  "same filters."),

 ("S14", "Screen", "Beneficiary List", "Major", "Components & States",
  "The screen has no loading state in the design, and the build needs one",
  "The Figma section draws only the populated list — five KPI cards with figures and rows with "
  "colour-coded status pills. There is no frame for what the screen looks like while the data is "
  "on its way.",
  "On the live build the KPI figures and every table row are grey placeholder bars for a "
  "noticeable stretch before the data arrives (timed at up to 25 seconds on a fast connection). "
  "Shelter Occupants behaves the same way. So the state a reader actually sees on arrival is one "
  "nobody designed.",
  "Design the loading state — a skeleton in the shape of the result, so the layout does not jump "
  "when the data lands — and add it to the Figma section for this screen and Shelter Occupants. "
  "How long the wait itself should be is an engineering question, recorded separately, not raised "
  "here."),

 ("S15", "Screen", "Beneficiary List", "Nit", "Content & Iconography",
  "The footer year differs between design and build",
  "The footer reads \u00a9 2025.",
  "The footer reads \u00a9 2026.",
  "Not a defect — the build is current and the design frame is a year behind. Update the Figma "
  "footer so the two stop disagreeing at every review."),
]

DEFERRED = [
 ("D01", "Survey Locations could not be captured",
  "The route lost its session on every attempt including after re-authentication, on both roles. "
  "Its design frame (8664:55325) is in the report as a reference board with no build side."),
 ("D02", "MIS Reports has eight design frames and no reachable route",
  "The sidebar's MIS Reports entry did not expose an href on any role this run. The eight report "
  "frames are recorded as design-only coverage debt, not as missed screens."),
 ("D03", "Three roles in the credentials sheet have no credentials",
  "State Nodal Officer, Nodal Officer and Implementing Agency are listed with empty username and "
  "password columns, so their screens are not in this pass."),
]

# ---------------------------------------------------------------------------
# DS-adoption was REMOVED on 2026-09-10 at the reviewer's instruction: these portals are not
# built on the design system, so scoring their CSS against published tokens measured a contract
# nobody signed. What survives from that pass is the one item that is a genuine DESIGN-vs-BUILD
# visual discrepancy — the sidebar's type — verified by comparing the design frame's own text
# nodes against the build's computed CSS, not against a token list.
#
# Dropped with the metric, and why each is not a design-vs-build finding:
#   pure black / a second colour palette — only meaningful against a token set; where a colour
#     genuinely differs from the design it is already written up as G02 and S11.
#   type down to 9px — the DESIGN does this too (its BETA tag is 10px and its masthead strapline
#     7px), so it is not a build deviation. Worth raising with the designers as a shared
#     accessibility concern; it is not a fidelity defect.
#   radius 9999 vs 999 — visually identical; a token-bookkeeping point with no DS in play.
# ---------------------------------------------------------------------------
MACHINE = []

# ---------------------------------------------------------------------------
# Sign-in surface. Compared against the five designed auth frames: Sign In (8383:55268),
# Choose Portal (8383:55528) and the three Implementing Agency states (8383:54485, 8383:54743,
# 9387:139420). Every size/weight/colour below was measured on both sides.
# ---------------------------------------------------------------------------
LOGIN = [
 ("L01", "Screen", "Sign In", "Major", "Typography",
  "A third typeface appears on the sign-in screen",
  "Every string on the designed sign-in frames is Noto Sans.",
  "Six elements render in Plus Jakarta Sans: the 'Log in to your account' heading, the Log In "
  "button, 'Implementing Agency?' and 'Sign in with OTP', the 'Forgot Password' heading on that "
  "screen, 'Implementing Agency sign-in', and 'Send OTP'. Everything around them is Noto Sans, so "
  "the panel is set in two typefaces at once.",
  "Set all six to Noto Sans. The estate mandates it on every government property, and this is the "
  "first screen anyone sees."),

 ("L02", "Screen", "Sign In", "Major", "Typography",
  "The SAMAVESH wordmark is little over half the size the design draws",
  "56px Bold.",
  "30px. The lock-up is the largest thing on the designed screen and is no longer.",
  "Set the wordmark to 56px Bold."),

 ("L03", "Screen", "Sign In", "Major", "Typography",
  "Forgot Password is a third smaller and a different colour",
  "18px Medium in the ink colour #1f2937.",
  "13px Medium in the primary navy #003366.",
  "Set it to 18px. If it should read as a link rather than as text, that is a design decision to "
  "make in the frame — the build should not decide it alone."),

 ("L04", "Screen", "Sign In", "Minor", "Typography",
  "The hero tagline and strapline are both a size down",
  "'Justice. Equality. Dignity.' 28px Medium; the strapline beneath it 16px Regular.",
  "24px Bold and 14px Regular.",
  "Restore 28px Medium and 16px Regular."),

 ("L05", "Screen", "Sign In", "Minor", "Typography",
  "Every line of the Signing into block is smaller than drawn",
  "SIGNING INTO 12px Medium, 'SMILE Beggary' 20px Bold, the description 14px Regular.",
  "10px, 16px and 11px. The label also reads 'Signing into' rather than the design's uppercase "
  "SIGNING INTO.",
  "Restore 12 / 20 / 14 and settle the capitalisation in the frame."),

 ("L06", "Screen", "Sign In", "Minor", "Typography",
  "Both field labels are smaller, heavier and a different grey",
  "'Email or Mobile Number' and 'Password' are 14px Medium in #1f2937.",
  "13px SemiBold in #334155.",
  "Set both to 14px Medium #1f2937."),

 ("L07", "Screen", "Sign In", "Minor", "Content & Iconography",
  "The password placeholder is worded differently",
  "'Enter your password'.",
  "'Enter password'. The field above it matches the design exactly, so this one reads as an "
  "oversight rather than a decision.",
  "Use 'Enter your password', or change both in the frame."),

 ("L08", "Screen", "Sign In", "Minor", "Components & States",
  "Two controls are in the build that the design does not draw",
  "The form is: two fields, Forgot Password, Log In, then the Implementing Agency link.",
  "The build adds a 'Remember me' checkbox and an 'OR' divider above the Implementing Agency "
  "link, plus a version and build stamp in the bottom corner.",
  "Confirm all three are intended. If they are, add them to the frame — a checkbox that stores a "
  "sign-in preference is a design decision, not an implementation detail."),

 ("L09", "Screen", "Choose Portal", "Major", "Components & States",
  "Choose Portal is a different pattern from the one designed",
  "The design keeps the reader on the sign-in panel: a 'Your role' selector set to Super Admin, "
  "and four portals listed inline — SCW, SMILE-Transgender, NOS, NMBA.",
  "The build opens a right-hand slide-over drawer listing nine portals as cards (the four above "
  "plus SMILE-Beggary, E-Utthaan, E-Anudaan, PM-AJAY, NHAPOA), with a green tick on the current "
  "one. There is no role selector at all.",
  "Decide which pattern is right and make both match. The missing role selector is the part to "
  "settle first — the design uses it to choose what you sign in AS, and the build has no "
  "equivalent."),

 ("L10", "Screen", "Choose Portal", "Minor", "Color & Token",
  "Portal names in the drawer are orange",
  "Portal names are ink-coloured text, #1f2428.",
  "Each portal name is orange. Orange is the estate's accent, and here it is doing the job of a "
  "heading on nine cards at once.",
  "Set the portal names to the ink colour and let the logo and the tick carry the colour."),
]

# ---------------------------------------------------------------------------
# Found by the element-level diff: every piece of text that appears in BOTH the design frame
# and the live capture, compared on size, weight, colour and position. Each of these repeated
# on every screen diffed, so they are global. Counts are of screens where it was measured.
# ---------------------------------------------------------------------------
DIFF = [
 ("G12", "Global", "All screens", "Major", "Typography",
  "Every page title is smaller, heavier and a different colour than the design",
  "The page heading is 28px Medium in the ink colour #1f2937.",
  "24px Bold in #111827 — measured identically on Users, Roles, Permissions, Notifications, "
  "Fund Monitoring, Consent Forms, Audit Log, Swashraya and IA List. Bold at a smaller size "
  "reads as a different level in the hierarchy from the one the design set.",
  "Set the page heading to 28px Medium #1f2937 in the shared page-header component, which fixes "
  "it everywhere at once."),

 ("G13", "Global", "All screens", "Minor", "Typography",
  "The line under every page title is a size down and a lighter grey",
  "The description under the heading is 16px Regular in #374151.",
  "14px Regular in #6b7280, on every screen measured.",
  "Set it to 16px #374151 in the same page-header component."),

 ("G14", "Global", "All screens", "Minor", "Typography",
  "Breadcrumbs are 12px where the design says 14px",
  "The breadcrumb is 14px — its trail in #374151, the current page in #1f2937.",
  "12px, with the trail in #6b7280 and the current page in #374151. Two steps lighter and a size "
  "down, on every screen that has a breadcrumb.",
  "Set the breadcrumb to 14px and restore the two colours."),

 ("G15", "Global", "All screens with a footer", "Minor", "Typography",
  "Footer links are smaller and lighter than drawn",
  "Terms & Conditions and Privacy Policy are 14px Medium.",
  "12px Regular, on every screen.",
  "Set the footer links to 14px Medium."),

 ("G16", "Global", "All screens with status chips", "Minor", "Color & Token",
  "Status chips are a size up, a weight heavier, and different colours",
  "A status chip is 11px Medium — green #27682a for a positive state, amber #8c571f for a "
  "waiting one.",
  "12px SemiBold in #047857 and #b45309. Measured on Consent Forms (Uploaded / Awaited), "
  "Swashraya (Active) and the Audit Log's action chips.",
  "Set chips to 11px Medium and bind the two states to the greens and ambers the design uses, "
  "so a chip means the same thing and looks the same on every screen."),
]

DIFF2 = [
 ("G17", "Global", "All screens", "Major", "Content & Iconography",
  "The breadcrumb names a different section from the design on nearly every screen",
  "The breadcrumb's first step names the section the design files the screen under: Home (Users, "
  "Roles, Permissions), Others (Consent Forms), System (Audit Log), Field Operations (IA List, "
  "Survey Locations, Surveyor Mappings), Reports & Analytics (Fund Monitoring).",
  "Nine of the ten disagree. Users says 'Access Control'; Roles and Permissions say 'RBAC'; "
  "Consent Forms says 'Access Control'; Audit Log says 'Compliance'; IA List says 'IA Lifecycle'; "
  "Survey Locations and Surveyor Mappings say 'Survey Operations'; Fund Monitoring says 'Fund "
  "Monitoring'. Several also disagree with the build's OWN sidebar headings — the sidebar files "
  "Consent Forms under Others, and the breadcrumb says Access Control.",
  "Agree one section vocabulary and use it in the sidebar, the breadcrumb and the design. 'RBAC' "
  "is developer shorthand and should not be on a citizen-facing government screen at all."),

 ("G18", "Global", "All list screens", "Minor", "Components & States",
  "The data-version selector lost its label",
  "A labelled control reading 'Data: Consolidate (All)' at 14px Medium in the primary navy, on "
  "the header row of IA List, Beneficiary List, Survey Locations, Surveyor Mappings and "
  "Notifications.",
  "A bare 'Data:' at 12px SemiBold in grey with an unlabelled dropdown beside it. The reader is "
  "told the word 'Data' and left to open the menu to find out what it does.",
  "Restore the full label at 14px Medium in the primary navy."),

 ("G19", "Global", "All list screens", "Major", "Components & States",
  "The filters the design specifies are not in the build",
  "Each list screen carries a named filter row: All States/UT, All Districts, All IAs/NGOs, All "
  "Statuses, and where relevant All Genders and All Ages.",
  "Measured on IA List, Beneficiary List, Survey Locations and Surveyor Mappings: the designed "
  "filters are absent. The build offers a search box and, on some screens, one or two unlabelled "
  "dropdowns instead — so a reader cannot narrow a 1,248-row list by state or by status at all.",
  "Add the designed filter set. This is the largest functional gap between the design and the "
  "build on the list screens, and it is the same gap on all four."),

 ("S16", "Screen", "Beneficiary List", "Major", "Color & Token",
  "Every status chip is the same blue, where the design colour-codes them",
  "Status is colour-coded so the column can be scanned: Identified, Submitted, Rehabilitation, "
  "Under Mobilization and Mobilized each carry their own colour.",
  "Every chip renders in the same blue #1d4ed8 — IDENTIFIED, APPROVED_BY_IA, MOBILIZED and "
  "REHABILITATED are visually identical. The chips are also uppercase and carry raw status codes "
  "(APPROVED_BY_IA) rather than the readable labels the design uses.",
  "Colour-code the statuses as the design does, and show the readable label rather than the "
  "database value."),

 ("S17", "Screen", "Surveyor Mappings", "Nit", "Content & Iconography",
  "Two KPI labels are cut off in the DESIGN, not the build",
  "The design frame reads 'Total Mapping' and 'Distinct Survey'.",
  "The build reads 'Total Mappings' and 'Distinct Surveyors' — the complete words.",
  "The build is right and the design frame is truncated. Fix the Figma labels so this does not "
  "get reported as a build defect at the next review."),
]
