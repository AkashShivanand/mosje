"""Tier-B judgment findings for SMILE — Beggary (admin, DEV), authored 2026-09-10.

Every entry was read off the DESIGN frame and the BUILD capture side by side and re-verified
against the fresh images; none is carried from memory or from another portal's pass.
Rules applied: `~/.claude/skills/design-qc/references/audit-rules.md` — token-level style only,
no width/height, no copy rewrites, repeats consolidated into Global, severity from rubric.md.

(id, scope, screen, severity, category, title, design, build, fix)
"""

GLOBAL = [
 ("G01", "Global", "All screens", "Blocker", "Components & States",
  "A page refresh signs the officer out on most screens",
  "The design assumes a session that persists; every screen is drawn signed in.",
  "Reloading the page ends the session on 15 of the 20 routes measured, including the landing "
  "Dashboard. The smile_admin_token cookie is dropped when the session-validation call "
  "(/auth/admin/session/hmac-secret) returns 401 before the page's own data calls resolve, so the "
  "heavier the screen the more reliably it happens.",
  "Hold the session independently of the page's data calls: resolve session validation before, or "
  "independently of, the screen's own requests, and treat a failed validation as retry-then-prompt "
  "rather than an immediate sign-out. Until then an officer loses unsaved work on any refresh, "
  "second tab, or bookmarked deep link."),

 ("G02", "Global", "All list screens", "Major", "Color & Token",
  "The active page number is saffron, not the primary navy",
  "Pagination's current page is a navy chip on white — Primary/500 #003366, the palette the rest "
  "of the interface is built from.",
  "The current page is an orange chip. Orange is the estate's accent, not its primary, and it is "
  "not among the colours the SMILE Figma variables publish for an active control.",
  "Bind the active page chip to Primary/500 #003366 with white text, matching every other selected "
  "control on the screen."),

 ("G03", "Global", "All list screens", "Major", "Layout & Spacing",
  "The two halves of the pagination row are swapped",
  "Page numbers sit on the left, the record count and per-page selector on the right.",
  "The record count is on the left and the page numbers plus per-page selector are on the right — "
  "the mirror image, on every list screen.",
  "Return to the design's order: page numbers left, count and per-page right, so the control a "
  "reader reaches for is in the same place on every list in the estate."),

 ("G04", "Global", "All screens with a data table", "Minor", "Typography",
  "Table headers are set in uppercase micro-type",
  "Column headers are Title Case at the body size in the primary navy, semibold.",
  "Column headers are uppercase, smaller, and letterspaced. On Notifications the 12 headers wrap "
  "onto two lines to fit.",
  "Set column headers in Title Case at font-size 14 / weight 600, per the label-1 style the SMILE "
  "variables publish. Uppercase micro-type costs legibility and forces the two-line wrap."),

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

 ("G07", "Global", "All screens", "Minor", "Components & States",
  "The page-level export moved out of the header and became two buttons",
  "One 'Export' button sits on the header row, aligned with the page title.",
  "Two buttons, 'CSV' and 'PDF', sit above the title row at the top-right of the content area, out "
  "of line with the heading. On the Beneficiary List there are three export controls.",
  "Return a single Export control to the header row aligned with the H1, and put the format choice "
  "inside it, so the header's action slot reads the same on every screen."),

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
  "The View Catalog action is not in the build",
  "Two header actions: a secondary 'View Catalog' and the primary 'Onboard New User'.",
  "'View Catalog' is absent; its place is taken by the CSV and PDF export buttons.",
  "Confirm whether View Catalog is still in scope. If it is, restore it as the secondary action "
  "beside the primary button."),

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
  "The list shows nothing but grey bars for the first 12 to 25 seconds",
  "The design shows the populated list: five KPI cards carrying figures, and rows with colour-coded "
  "status pills (Identified, Submitted, Rehabilitation, Under Mobilization, Mobilized).",
  "Timed on a fast wired connection: at 5s and at 12s the page had no column headers, no rows and "
  "no KPI figures — only grey placeholder bars. The first row appeared between 12s and 25s. The "
  "page does load; it takes long enough that a reader will conclude it is broken. Same behaviour on "
  "Shelter Occupants.",
  "Bring first paint of the table under a few seconds — page the request, or return the KPI totals "
  "and the first page of rows before the rest. Whatever the timing, the wait itself has to be "
  "designed: the Figma section has no loading frame, so what a reader sees for those 25 seconds is "
  "undesigned (.claude/rules/data-state-completeness.md § the four states that get skipped)."),

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
# Machine-verified globals (the engine measured these across all 51 captures; each was then
# re-checked by hand on a named screen before being written up).
# ---------------------------------------------------------------------------
MACHINE = [
 ("M01", "Global", "All screens", "Major", "Typography",
  "The whole sidebar is set in the system font, not Noto Sans",
  "Every label is Noto Sans, which the estate mandates on all government properties and which the "
  "SMILE Figma variables publish as both font-family/body and font-family/heading.",
  "2,128 elements across all 51 captures compute to -apple-system. On Users, 48 of the 181 "
  "on-canvas elements are in that stack, and they are the navigation: Dashboard, City Profiling, "
  "Performance Statistics, Users, Roles — the whole sidebar, on every screen.",
  "Give the sidebar the same font-family as the rest of the shell. The likely cause is a component "
  "left on the framework's default sans stack rather than the app's."),

 ("M02", "Global", "All screens", "Major", "Typography",
  "The sidebar is set at 15px, which is not on the type scale",
  "The published scale runs 11, 12, 13, 14, 16, 18, 20, 24, 28, 32 — there is no 15.",
  "2,207 elements across all 51 captures render at 15px, and on Users every one of them is a "
  "sidebar item.",
  "Move the navigation label to 14px (label-1) or 16px (body-1). 15px is a value the design system "
  "cannot theme, resize or reason about."),

 ("M03", "Global", "All screens", "Minor", "Color & Token",
  "Pure black is used as a text colour",
  "The darkest published text colour is Text/Dark #1f2937.",
  "499 elements across all 51 captures render #000000, and a further 234 render #111827 — neither "
  "is in the SMILE variable set.",
  "Bind text to Text/Dark #1f2937. Pure black on white is both off-token and harsher than the "
  "palette intends."),

 ("M04", "Global", "All screens", "Minor", "Color & Token",
  "A second, unpublished palette runs alongside the design system's",
  "The variables publish one neutral ramp, one primary ramp, an info pair and a single error red.",
  "Alongside them the build renders #15803d, #047857, #64748b, #475569, #b45309, #0a3a74 and "
  "#2563eb — greens, slates and ambers with no counterpart in the SMILE variables, most visibly in "
  "the status chips and the dashboard charts.",
  "Either bind these to published tokens or publish them. A colour that only exists in the CSS "
  "cannot be themed, contrast-checked or reused, and today just over half the interface "
  "(55% of 9,343 elements) sits on the token set."),

 ("M05", "Global", "All screens", "Minor", "Typography",
  "Type runs down to 9px",
  "The smallest published size is label-3 at 11px.",
  "290 elements render at 10px and 108 at 9px, across all 51 captures — the BETA tag in the "
  "masthead and the plus and minus marks on the text-size controls among them.",
  "Raise anything below 11px to label-3. Text this small is difficult on a low-resolution display "
  "and is the kind of thing an accessibility review will stop."),

 ("M06", "Global", "All screens with a pill", "Nit", "Color & Token",
  "Fully-rounded corners are drawn as 9999px, not the radius token",
  "radius-full is published as 999.",
  "361 elements across 17 screens use 9999.",
  "Bind to radius-full. It looks identical; it just is not the token, so it does not move when the "
  "token does."),
]
