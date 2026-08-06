"""NMBA design-QC findings — the curated, evidence-backed source of truth.

Every finding below was verified against the CURRENT design frame and the CURRENT capture:
  * token/type/colour claims quote computed CSS from captures/live/*.json and the Figma text specs
    pulled via MCP (never hand-typed);
  * "missing element" claims were re-checked before being written (an "Export missing" draft finding
    was DROPPED after the extraction showed Export Excel / Export PDF present on those screens);
  * repeated issues are consolidated into GLOBAL findings tagged Scope: Global, per the ledger.

Severity is a rubric function (references/rubric.md + GIGW / WCAG 2.1 AA), not a keyword guess.
Categories are the canonical six.
"""

GLOBAL = [
    dict(
        id="NMB-GLOBAL-001", severity="Blocker", axis="Responsive & A11y",
        element="Sidebar navigation — inactive item colour fails AA contrast",
        figma="Inactive nav items are Neutral/Source #1f2937 on white (15.9:1). The active item is "
              "Primary/Source #003366.",
        live="Inactive nav items compute to #9ca3af on #ffffff — a contrast ratio of 2.54:1, below "
             "the WCAG 2.1 AA minimum of 4.5:1 for body text. Measured on 488 nav links across every "
             "authenticated screen; opacity is 1 and pointer-events are auto, so this is the intended "
             "resting style, not a disabled state.",
        fix="Set inactive sidebar links to Neutral/Source #1f2937 (or Neutral/600 #4b5563 at minimum, "
            "7.0:1). Reserve #9ca3af for genuinely disabled items, which must also carry aria-disabled.",
        anchor="User Management", screens=["ADMIN-NAPDDR-STATE-COMMITTEE"],
    ),
    dict(
        id="NMB-GLOBAL-002", severity="Blocker", axis="Responsive & A11y",
        element="GIGW masthead accessibility toolset reduced and relocated to a floating widget",
        figma="The government masthead carries the mandated inline toolset: A− / A / A+ text sizing, a "
              "contrast toggle, an accessibility (person) icon, and a labelled 'English ▾' language "
              "selector with a globe icon.",
        live="The masthead keeps A− / A / A+ and the contrast toggle but drops the accessibility icon, "
             "and the language selector is reduced to an unlabelled glyph. The accessibility options are "
             "moved into a floating circular widget pinned bottom-right (#9161ff, radius 70px).",
        fix="Restore the full inline toolset in the masthead per GIGW, and trigger the accessibility "
            "panel from the masthead's accessibility icon rather than a floating button. Give the "
            "language selector a visible label.",
        anchor="Skip to Main Content", screens=["ADMIN-NAPDDR-STATE-COMMITTEE"],
    ),
    dict(
        id="NMB-GLOBAL-003", severity="Major", axis="Content & Iconography",
        element="Sidebar navigation icons absent portal-wide",
        figma="Every sidebar item is preceded by a Material Symbols Rounded icon at 24px, weight Light, "
              "Primary/Source #003366 (e.g. account_balance on the NAPDDR group).",
        live="No icon is rendered against any sidebar item; items are text-only with a tree-line "
             "connector. The extraction finds zero Material Symbols elements anywhere in the build.",
        fix="Render the Material Symbols Rounded icon for each nav item at 24px / weight 300–Light, and "
            "load the icon font once in the root layout.",
        anchor="Important Documents", screens=["ADMIN-NAPDDR-STATE-COMMITTEE"],
    ),
    dict(
        id="NMB-GLOBAL-004", severity="Major", axis="Typography",
        element="Page title (H1) is off the type scale and inconsistent between screens",
        figma="One page-title role: Headline/headline-3 — 24px, SemiBold (600), Neutral/Source #1f2937. "
              "The NAPDDR screens use Display/display-5 — 28px, Medium.",
        live="Four different treatments across the build: 24px/600/#111827, 24px/700/#374151, "
             "24px/600/#1f2937 and 32px/600/#374151. Neither #111827 nor #374151 is a token in the "
             "NMBA palette.",
        fix="Bind every page title to one token — font-size 24px, weight 600, colour #1f2937 — and use "
            "28px Medium only where the design specifies Display/display-5.",
        anchor="All Pledge Report", screens=["ADMIN-PLEDGE-REPORTS"],
    ),
    dict(
        id="NMB-GLOBAL-005", severity="Major", axis="Typography",
        element="Non-brand typefaces rendering instead of Noto Sans",
        figma="font-family/body and font-family/heading are both Noto Sans — the mandated DBIM typeface "
              "for all government properties.",
        live="Poppins renders on 63 elements across 23 screens (search fields and filter controls), "
             "-apple-system on 25 elements across 9 screens, and Lucida Console on 8 across 3.",
        fix="Remove the Poppins and system-font declarations so every control inherits Noto Sans; "
            "confirm the Noto Sans webfont is preloaded so no fallback is ever painted.",
        anchor="Search", screens=["ADMIN-PLEDGE-REPORTS"],
    ),
    dict(
        id="NMB-GLOBAL-006", severity="Major", axis="Content & Iconography",
        element="Government masthead lockup drops its third line and inverts the emphasis",
        figma="A three-line lockup beside the National Emblem: 'Government of India' (12px), 'Ministry of "
              "Social Justice & Empowerment' (12px), then 'Department of Social Justice & Empowerment' "
              "as the emphasised bold navy line.",
        live="A two-line lockup: 'Government of India' (12px) then 'Ministry of Social Justice & "
             "Empowerment' set as the emphasised line at 20px/700/#374151. The Department line is absent "
             "and the emblem is rendered noticeably larger.",
        fix="Restore the three-line lockup with the Department name as the emphasised line, and match "
            "the emblem size and baseline alignment to the design.",
        anchor="Ministry of Social Justice", screens=["ADMIN-PLEDGE-REPORTS"],
    ),
    dict(
        id="NMB-GLOBAL-007", severity="Minor", axis="Typography",
        element="Sidebar navigation label size larger than the design",
        figma="Nav labels are Label/label-1 — 14px, Regular.",
        live="Nav labels compute to 16px, weight 400 (488 elements), and the active item is weight 700 "
             "where the design distinguishes the active state by colour alone.",
        fix="Set sidebar labels to 14px Regular; express the active state with Primary/Source #003366 "
            "and the selected background, not a weight jump to 700.",
        anchor="List of SNO", screens=["ADMIN-NAPDDR-STATE-COMMITTEE"],
    ),
    dict(
        id="NMB-GLOBAL-008", severity="Minor", axis="Layout & Spacing",
        element="Corner-radius drift across buttons and controls",
        figma="button-corner = 8px; the radius ramp is 2 / 4 / 6 / 8 / 12 / 16 / 20 / 24 / 999.",
        live="Alongside the 8px token (1,745 controls) the build also renders radius 12 (924), 0 (839), "
             "10 (47), 6 (11) and 70 (66). Radius 10 alone appears on 310 elements across all 36 screens; "
             "10 and 70 are not on the ramp at all.",
        fix="Bind control radii to the token ramp — 8px for buttons and inputs, 12px for cards — and "
            "replace the 10px and 70px values with radius-md/radius-lg or radius-full.",
        anchor="Export Excel", screens=["ADMIN-PLEDGE-REPORTS"],
    ),
    dict(
        id="NMB-GLOBAL-009", severity="Minor", axis="Color & Token",
        element="Off-token neutral greys, including pure black",
        figma="The neutral ramp is #f9fafb / #f3f4f6 / #e5e7eb / #d1d5db / #6b7280 / #4b5563 / #374151 / "
              "#1f2937. Pure black is not in the palette.",
        live="#000000 renders on 696 elements across all 36 screens and #9ca3af on 635. #212121 appears "
             "on 612 (accessibility-bar chrome).",
        fix="Replace #000000 with Neutral/Source #1f2937 and #9ca3af with Neutral/500 #6b7280, and bring "
            "the accessibility-bar chrome onto the neutral ramp.",
        anchor="Total Pledges", screens=["ADMIN-PLEDGE-REPORTS"],
    ),
    dict(
        id="NMB-GLOBAL-010", severity="Minor", axis="Typography",
        element="Table column headers use two different weights",
        figma="Column headers are a single role — 14px Medium, Neutral/500 #6b7280.",
        live="Headers render 14px/600 on 174 cells and 14px/500 on 114, so weight varies between list "
             "screens. Colour (#6b7280) and the transparent header background are correct.",
        fix="Set every table column header to 14px weight 500, colour #6b7280.",
        anchor="Chairperson / Chief Secretary", screens=["ADMIN-NAPDDR-STATE-COMMITTEE"],
    ),
    dict(
        id="NMB-GLOBAL-011", severity="Nit", axis="Typography",
        element="BETA badge set below the smallest step of the type scale",
        figma="The smallest role is Label/label-3 — 11px.",
        live="The BETA badge renders at 10px on 47 screens.",
        fix="Raise the BETA badge to 11px (Label/label-3).",
        anchor="BETA", screens=["ADMIN-PLEDGE-REPORTS"],
    ),
]

SCREENS = [
    ("STATE-NODAL-OFFICER-DASHBOARD", [
        dict(id="NMB-SNODASH-001", severity="Major", axis="Components & States",
             element="'My Submissions' table section not built on the dashboard",
             figma="Below the KPI row the dashboard carries a full 'My Submissions' panel — search field, "
                   "All Location and All Activity filter pills, a six-column table (Activity, Activity Date, "
                   "Participants, Male, Female, View) and pagination showing 5 of 1500 items.",
             live="The dashboard ends after the KPI cards; no submissions panel is rendered. The equivalent "
                  "list exists on a separate route (State/UT/District Dashboard).",
             fix="Add the My Submissions panel to the dashboard per the design, or confirm the decision to "
                 "move it to State/UT/District Activity and update the design.",
             anchor="Activities Completed"),
        dict(id="NMB-SNODASH-002", severity="Major", axis="Components & States",
             element="Primary 'Submit Activity' action absent from the dashboard header",
             figma="A navy primary button 'Submit Activity' sits top-right, aligned with the page title.",
             live="No primary action is rendered in the dashboard header; the page title row is empty on "
                  "the right.",
             fix="Add the primary 'Submit Activity' button to the dashboard header, or confirm the action "
                 "now lives only on State/UT/District Activity.",
             anchor="Dashboard"),
        dict(id="NMB-SNODASH-003", severity="Major", axis="Components & States",
             element="KPI cards lost their trend indicator",
             figma="Each KPI card carries a value and a trend line beneath it — an up/down arrow with "
                   "'+14.5% vs last month' in Success or Danger.",
             live="KPI cards render the label, icon and value only; no trend line appears on any card.",
             fix="Restore the trend row on each KPI card using Text/Success #2e7d32 and Text/Error #ec5042 "
                 "for positive and negative deltas.",
             anchor="Total Pledge State/UT"),
        dict(id="NMB-SNODASH-004", severity="Minor", axis="Layout & Spacing",
             element="KPI grid reflows to unequal card widths",
             figma="Three equal-width KPI cards in a single row, with equal gaps.",
             live="Five cards wrap across two rows (3 + 2) and the cards do not share a common width — the "
                  "second card in row one is visibly wider than its neighbours.",
             fix="Lay the KPI row out on a uniform grid so every card shares one column width and the last "
                 "row aligns to the same tracks.",
             anchor="Total People Reached"),
    ]),
    ("ADMIN-NAPDDR-STATE-COMMITTEE", [
        dict(id="NMB-NAPDDR-001", severity="Major", axis="Components & States",
             element="Breadcrumb trail not rendered",
             figma="A breadcrumb sits above the page title: 'Home › State-Level Steering and Monitoring "
                   "Committee', with the trailing crumb in Primary/Source.",
             live="No breadcrumb is rendered; the page title is the first element in the content column.",
             fix="Add the breadcrumb above the page title on the committee screens, matching the design's "
                 "separator and active-crumb colour.",
             anchor="State-Level Steering and Monitoring Committee"),
        dict(id="NMB-NAPDDR-002", severity="Minor", axis="Components & States",
             element="'All States' filter missing beside the search field",
             figma="The toolbar row carries the search field plus an 'All States ▾' filter control aligned "
                   "right.",
             live="Only the search field is rendered; the filter control is absent, so the list cannot be "
                  "narrowed by state.",
             fix="Show all the relevant filters — add the States filter to the toolbar row per the design.",
             anchor="Search by District, Chairperson / Chief Secretary"),
    ]),
    ("ADMIN-PLEDGE-REPORTS", [
        dict(id="NMB-PLEDGE-001", severity="Major", axis="Components & States",
             element="Filter controls built as rectangular selects instead of the designed filter pills",
             figma="Filters are pill-shaped buttons with a leading chevron and a rounded 8px radius — "
                   "'All District ▾', 'Uttar Pradesh ▾' and a 'Date Range' button with a calendar icon.",
             live="Filters render as rectangular native-style select boxes plus a separate date-range input, "
                  "in a different control family from the design.",
             fix="Rebuild the filter row with the designed pill control (8px radius, chevron affordance, "
                 "Noto Sans 14px) so filters read as one component family across list screens.",
             anchor="All States"),
        dict(id="NMB-PLEDGE-002", severity="Major", axis="Color & Token",
             element="Danger red used for the non-destructive Clear-Filters control",
             figma="No danger-coloured control appears in the filter row; clearing filters is a neutral, "
                   "low-emphasis action.",
             live="The clear-filters control is rendered in Danger red (#d64539 family, 50 elements across "
                  "5 screens), which signals a destructive action to the user.",
             fix="Restyle clear-filters as a neutral tertiary control; reserve Danger/Source for genuinely "
                 "destructive actions such as delete.",
             anchor="Search"),
        dict(id="NMB-PLEDGE-003", severity="Minor", axis="Components & States",
             element="Pagination loses its previous/next affordance",
             figma="Pagination reads '‹ 1 2 3 4 5 6 … 150 ›' with chevron previous and next controls at "
                   "each end.",
             live="Pagination renders '1 2 3 … 3,19,399 +' — the chevrons are replaced by a '+' glyph and "
                  "there is no previous control.",
             fix="Restore the chevron previous/next controls and the truncated page range per the design.",
             anchor="3,19,399"),
    ]),
]

# Build-only additions — NOT audit findings (ledger: build extras go to the Suggestions doc).
SUGGESTIONS = [
    "Export Excel / Export PDF actions exist on every admin list screen but appear in no design frame — "
    "confirm the intended placement and style, then add them to the handoff.",
    "The citizen sidebar ships 'Nasha Mukti Mitr' and 'Feedback / Grievances' where the design shows a "
    "'Helpline' screen; the designed Helpline screen has no route on the build.",
    "The e-Pledge screen adds 'General Pledge' / 'Recovered Drug User' tabs that the design does not show — "
    "confirm if intended, and add the tab component to the design system if so.",
    "Admin list screens add State / District / Pledge Date columns beyond the designed column set — "
    "confirm if intended.",
]
