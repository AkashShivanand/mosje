#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""NMBA - Nasha Mukt Bharat Abhiyaan (DEV): the audited findings.

Every entry here was measured on 2026-09-11 against the CURRENT design page
("NMBA (Dev Synced - August)", 2136:20193) and the CURRENT dev build, and each carries the
two anchors the claim gates need: the element in the design frame and the element in the live
capture, so the report can draw a 1:1 crop of both sides.

Nothing was carried forward from the July 2026 pass on trust. Three of its claims did not
survive re-checking and are recorded in WITHDRAWN below rather than deleted, so a reviewer who
saw them learns they were wrong.

Fields per finding:
  key      working id
  scope    "Global" (applies to every screen with this element) or "Screen"
  screen   the human name that appears on the board
  slug     the capture the evidence is cropped from
  sev/cat  rubric.md severity + one of the canonical six categories
  d_anchor (text, dx, dy, w, h) in the DESIGN frame  - offsets in design px from the text box
  b_anchor (text, dx, dy, w, h) in the BUILD capture
"""

# (key, scope, screen, slug, sev, cat, title, design, build, fix, d_anchor, b_anchor)
FINDINGS = [
 ("G01","Global","Sidebar navigation (every screen)","ADMIN-USER-MANAGEMENT","Blocker","Color & Token",
  "Sidebar navigation labels fail AA contrast",
  "Every navigation label is #1F2937 on white - about 14.7:1 - and the selected item is #003366 on a "
  "#E5EFF9 pill. Measured on the admin sidebar's own text nodes.",
  "Every unselected navigation label is #9CA3AF on #FFFFFF. That is 2.54:1, where WCAG 2.2 AA requires "
  "4.5:1 for text this size. It reads as a disabled control, and it is the same in the citizen shell "
  "and in all three admin roles.",
  "Set the unselected label to the design's #1F2937. If a quieter resting state is wanted, #4B5563 is "
  "the lightest neutral in the token set that still clears 4.5:1 on white; #9CA3AF cannot be used for "
  "text on white at any size.",
  ("All Pledge Reports",-32,-6,220,26), ("All Pledge Reports",-20,-8,230,30)),

 ("G02","Global","Government masthead (every screen)","ADMIN-USER-MANAGEMENT","Blocker","Components & States",
  "The GIGW accessibility toolset is missing from the masthead",
  "The blue government bar carries the mandated inline set: A- / A / A+ text-size controls with the "
  "current size shown selected, a contrast toggle, an accessibility icon, and a globe with the "
  "language named in words ('English').",
  "The bar carries only an accessibility glyph, which opens a third-party panel, and a bare two-script "
  "glyph for language. The text-size controls and the contrast toggle are not present anywhere on the "
  "page.",
  "Restore the inline A- / A / A+ and contrast controls in the government bar, and label the language "
  "control with the language name as the design does. GIGW 3.0 treats this set as a masthead "
  "requirement, so its absence is a compliance gap on every screen, not a styling preference.",
  ("Skip to Main Content",150,-10,330,34), ("Skip to Main Content",180,-10,150,34)),

 ("G03","Global","Admin sidebar (all admin roles)","ADMIN-USER-MANAGEMENT","Major","Content & Iconography",
  "Admin sidebar navigation icons are absent",
  "Every admin navigation item pairs a 24px Material Symbols icon at #003366 with its label - widgets, "
  "event, group_add, article_shortcut, task and so on - and the icon sits 32px from the panel edge.",
  "The admin sidebar draws label-only rows with a thin tree-branch connector line in the icon's place. "
  "No item has an icon. The citizen shell DOES carry its icons, so the two shells disagree with each "
  "other as well as with the design.",
  "Add the navigation icon to each admin sidebar item, using the same Material Symbols set and #003366 "
  "the citizen shell already uses, and drop the connector line the design does not have.",
  ("Important Documents",-34,-6,250,26), ("Important Documents",-22,-8,240,30)),

 ("G04","Global","Government masthead (authenticated screens)","ADMIN-USER-MANAGEMENT","Major","Typography",
  "The ministry lockup drops its third line and changes colour",
  "Three lines, all #1F2937: 'Government of India' at 12px Medium, 'Ministry of Social Justice & "
  "Empowerment' at 14px Medium, and 'Department of Social Justice & Empowerment' at 20px Bold as the "
  "emphasised line.",
  "Two lines at #374151: 'Government of India' at 12px Medium, and 'Ministry of Social Justice & "
  "Empowerment' promoted to 20px Bold. The Department line is not rendered. The sign-in page does draw "
  "all three, so the authenticated shell also disagrees with the portal's own login screen.",
  "Render the third line and set the lockup to #1F2937, matching the sign-in page and the design. The "
  "emphasised line is the Department, not the Ministry.",
  ("Department of Social Justice & Empowerment",-2,-4,460,26),
  ("Ministry of Social Justice & Empowerment",-2,-4,430,34)),

 ("G05","Global","Data tables (every list screen)","ADMIN-USER-MANAGEMENT","Major","Components & States",
  "Row action controls lose their button and change colour",
  "Row actions are bordered icon-buttons - a light 1px outline, radius 6, the edit glyph at #003366 and "
  "the delete glyph at #EC5042 - sized as real click targets.",
  "The actions are bare glyphs with no button around them, and the edit glyph is drawn at #E08020, an "
  "amber that appears nowhere in the NMBA token set. On the four NAPDDR committee screens the same "
  "actions become three outlined TEXT buttons instead (View / Edit / Delete).",
  "Restore the bordered icon-button and set the edit glyph to #003366. Use one row-action component "
  "across the portal rather than icon-buttons on some screens and text buttons on others.",
  ("Actions",-8,44,120,34), ("Actions",100,40,60,30)),

 ("G06","Global","Pagination (every paged screen)","ADMIN-NAPDDR-STATE-COMMITTEE","Major","Content & Iconography",
  "Previous and next are a hyphen and a plus sign",
  "The pager runs a left chevron, the page numbers with the current one in a rounded outlined chip, an "
  "ellipsis, the last page, and a right chevron.",
  "The two step controls render as '-' and '+'. A minus and a plus read as decrease and increase, not "
  "as previous and next page, and there is no ellipsis or last-page number.",
  "Use the chevrons the design specifies for the step controls, and show the ellipsis and last page so "
  "a reader can tell how long the list is.",
  ("@box",325,818,312,46), ("@box",318,558,96,46)),

 ("G07","Global","Selects and filters (every screen with one)","ADMIN-NAPDDR-STATE-COMMITTEE","Minor","Components & States",
  "Dropdowns are the browser's own select, not the design system's",
  "Every dropdown is the design-system select: a rounded bordered field with its own chevron and the "
  "label at 14px #1F2937.",
  "The rows-per-page control, the facility filter and the three activity filters render as an unstyled "
  "native <select> with the operating system's chevron and its own border radius, so they look "
  "different on every browser and different from every other control on the page.",
  "Skin these with the design-system select so their border, radius, type and chevron match the rest of "
  "the interface.",
  ("Showing",70,-10,90,36), ("@box",1265,562,76,42)),

 ("G08","Global","Search fields (every list screen)","ADMIN-IMPORTANT-DOCUMENTS","Minor","Content & Iconography",
  "The search magnifier is missing, or sits on the wrong side",
  "Every search field carries a magnifier inside its left edge, ahead of the placeholder.",
  "The magnifier is absent on User Management, the Ministries dashboard, all four NAPDDR screens and "
  "Facilities, and on Important Documents it is drawn inside the RIGHT edge instead. So the same "
  "control differs from screen to screen as well as from the design.",
  "Put the magnifier inside the left edge of every search field, as the design does.",
  ("Search by Name, State,DIstrict, Activity...",-26,-8,40,32),
  ("Search for Document Name",560,-8,44,32)),

 ("G09","Global","Data tables (every list screen)","ADMIN-MINISTRIES-DASHBOARD","Major","Layout & Spacing",
  "Table row height is inconsistent across the portal",
  "Table rows are a steady 45-55px throughout, so a list reads the same on every screen.",
  "Measured row heights run 41px on User Management, 53px on most lists, 57px on Important Documents, "
  "65px on the NAPDDR screens, 85px on Best Practices and 153px on the Ministries dashboard - the same "
  "component at more than three times the height from one screen to the next. Header rows vary too, "
  "from 38px to 85px.",
  "Set one row height for the table component and let it apply everywhere; where a cell wraps to two "
  "lines, let the row grow from that one value rather than redefining it per screen.",
  ("Organization/Ministry",-24,44,300,50), ("Organisation / Ministry",-40,44,300,150)),

 ("G10","Global","Data tables (every list screen)","ADMIN-USER-MANAGEMENT","Minor","Color & Token",
  "Table cell text is lighter than the design",
  "Cell values are #1F2937, the same near-black the rest of the body copy uses.",
  "Cell values are #4B5563. It still clears AA, but it makes the data quieter than its own column "
  "headers, which the design does not do.",
  "Set cell values to #1F2937 and leave #4B5563 for secondary lines inside a cell.",
  ("James Cameron",-4,-6,200,26), ("Hare Krishna Movement",-4,-8,220,30)),

 ("G11","Global","Page header (every screen)","ADMIN-USER-MANAGEMENT","Minor","Color & Token",
  "The page title is a lighter grey than the design",
  "The page title is 24px SemiBold #1F2937.",
  "The page title is 24px 600 #374151 - the right size and weight, a lighter colour.",
  "Set the page title to #1F2937.",
  ("User Management",-4,-6,240,34), ("User Management",-4,-8,230,36)),

 ("G12","Global","KPI cards (every dashboard)","STATE-NODAL-OFFICER-DASHBOARD","Minor","Color & Token",
  "KPI icon tiles use a pink tint that is not a token",
  "Every KPI icon sits on a 32px tile filled #E5EFF9 - Primary/50 - at radius 10, so the row of cards "
  "reads as one set.",
  "The tiles are tinted per card, and the tint used for 'Important Documents' measures #FDE8EF, a pink "
  "that is in no NMBA token. On the district dashboard the same row mixes pink, blue and amber tiles "
  "for metrics that carry no status meaning.",
  "Fill every KPI icon tile with #E5EFF9. Reserve a coloured tint for a metric that genuinely signals "
  "a state, and take the tint from the token set when you do.",
  ("Important Documents",270,-6,40,40), ("Important Documents",255,-8,44,44)),

 ("G13","Global","KPI cards (every dashboard)","STATE-NODAL-OFFICER-DASHBOARD","Minor","Typography",
  "The KPI value is 30px, which is not on the type scale",
  "The KPI value is 32px SemiBold #003366 - the top step of the published scale.",
  "The KPI value is 30px. The scale runs 24, 28, 32; 30 is not a step on it, so this number is the only "
  "type size in the portal that no token can express.",
  "Set the KPI value to 32px.",
  ("252",-4,-6,150,36), ("6",-4,-8,150,40)),

 ("G14","Global","KPI cards (every dashboard)","STATE-NODAL-OFFICER-DASHBOARD","Nit","Color & Token",
  "The KPI label is a lighter grey than the design",
  "The KPI label is 14px SemiBold #374151.",
  "The KPI label is 14px 600 #6B7280.",
  "Set the KPI label to #374151.",
  ("Important Documents",-4,-6,200,24), ("Important Documents",-4,-8,200,26)),

 ("G15","Global","Sidebar navigation (every screen)","ADMIN-USER-MANAGEMENT","Nit","Components & States",
  "The selected navigation item is a tighter pill in a heavier weight",
  "The selected item is a 48px-tall pill at radius 16 filled #E5EFF9, its label at 14px Regular #003366 "
  "- the same weight as every other item, distinguished by the fill alone.",
  "The selected item is a 36px-tall pill at radius 10, and its label is set Bold. Weight and shape both "
  "change where the design changes only the fill.",
  "Match the pill to radius 16 and the item height to the design, and keep the selected label at the "
  "same weight as the rest.",
  ("User Management",-34,-8,250,30), ("@box",30,258,248,40)),

 ("S01","Screen","Citizen - Home","PUBLIC-HOME","Major","Components & States",
  "The pledge banner has lost its call to action",
  "The green banner carries a white pill button reading 'Take the Pledge' with a right arrow, its label "
  "14px Medium #003366, sitting at the right end of the banner.",
  "The banner has the heading and the supporting line but no button at all, so the landing page's "
  "primary action is not on it.",
  "Restore the button at the right of the banner, white fill with the label in #003366, as the design "
  "draws it.",
  ("Take the Pledge",-24,-14,170,46), ("Take the NMBA e-pledge today and commit to a Nasha Mukt Bharat!",700,-40,200,56)),

 ("S02","Screen","Citizen - Home","PUBLIC-HOME","Major","Layout & Spacing",
  "The 'Number of Programmes' section is not built",
  "Below the metric cards the design carries a titled section of four grouped cards - Education & Youth, "
  "Community Outreach, Governance & Local Bodies, Targeted Interventions - each with an icon and its "
  "figures colour-coded to the group (#1558B0, #2E7D32, #BB772B, #EC5042) at 28px SemiBold.",
  "The section is absent. The page goes from the metric cards straight to a state-wise bar chart that "
  "the design does not carry.",
  "Build the four programme-group cards as designed. If the bar chart is meant to replace them, that is "
  "a decision to take back to the design rather than a substitution to leave in place.",
  ("NUMBER OF PROGRAMMES",-6,-8,260,30), ("State-wise Overview",-14,-16,320,44)),

 ("S03","Screen","Citizen - Activity Snapshots","PUBLIC-ACTIVITIES","Major","Components & States",
  "The activity card has no title and no description",
  "Each card carries five things: the type chip at 11px, the activity title at 16px Medium #1F2937, a "
  "two-to-three line description at 12px, then the location and the date.",
  "Each card carries three: the type as a chip, the location and the date. The activity's own title and "
  "its description are not rendered, so the card's only heading is the category it belongs to.",
  "Render the activity title and its description between the chip and the location line, at the sizes "
  "the design specifies.",
  ("Alandi Student Awareness Drive",-8,-8,260,60), ("Community Awareness Session",-10,34,240,50)),

 ("S04","Screen","Citizen - Help Centres & Facilities","PUBLIC-FACILITIES","Major","Components & States",
  "The facility card has lost its 'Call Now' action and its service tags",
  "Each facility card ends with two buttons side by side - 'Get Directions' filled #003366 and 'Call "
  "Now' white with a #003366 outline - above which sit the service tags as small pills (Inpatient "
  "Treatment, Outpatient Counseling, Detoxification, Rehabilitation).",
  "'Call Now' is not present and 'Get Directions' stretches the full width of the card in its place. "
  "The service tag pills are not rendered either, so a reader cannot see what a centre offers without "
  "opening it.",
  "Restore the second action beside 'Get Directions' and the service tag pills above the buttons.",
  ("Call Now",-90,-16,300,50), ("Get Directions",-60,-16,560,50)),

 ("S05","Screen","Citizen - Help Centres & Facilities","PUBLIC-FACILITIES","Minor","Typography",
  "Facility names are set in capitals",
  "The facility name is Title Case at 16px SemiBold #1F2937.",
  "The facility name is uppercased. At this length a name in capitals is measurably slower to read, and "
  "no other name in the portal is set this way.",
  "Remove the uppercase transform and set the name Title Case as the design does.",
  ("National Institute of Mental Health and Neuro Sciences",-6,-6,300,44),
  ("@box",886,446,392,50)),

 ("S13","Screen","Citizen - Help Centres & Facilities","PUBLIC-FACILITIES","Minor","Color & Token",
  "The facility-type chip is filled with a colour that is not a token",
  "The type chip is filled #C8E6C9 with an #81C784 border and its label in #27682A at 11px - the "
  "green the token set publishes - and the type is what the colour encodes, so a hospital chip is "
  "blue and a de-addiction centre chip is green.",
  "Every type chip is filled #EDE7F6, a lavender that appears in no NMBA token, and the same fill is "
  "used for every facility type, so the colour no longer tells a reader what kind of centre it is.",
  "Fill the chip from the token set and keep one colour per facility type as the design does.",
  ("De Addiction Center",-8,-8,140,26), ("@box",886,408,240,30)),

 ("S06","Screen","NAPDDR committee screens (all four)","ADMIN-NAPDDR-STATE-COMMITTEE","Major","Layout & Spacing",
  "The breadcrumb is not rendered",
  "Above the page title sits a breadcrumb - 'NAPDDR Three-Tier Committee > State-Level Committee' - at "
  "12px, the trail a reader uses to get back up out of a nested section.",
  "There is no breadcrumb on any of the four committee screens. The page title is the first thing under "
  "the masthead, so a reader three levels into the section has nothing to climb back with.",
  "Render the breadcrumb above the title on all four committee screens.",
  ("State-Level Steering and Monitoring Committee",-4,-30,340,24),
  ("State-Level Steering and Monitoring Committee",-4,-16,340,24)),

 ("S07","Screen","Officer dashboards (State and District)","STATE-NODAL-OFFICER-DASHBOARD","Blocker","Layout & Spacing",
  "The whole 'My Submissions' section is not built",
  "Below the metric cards the dashboard carries its main working area: a 'My Submissions' heading, an "
  "Export control and an 'Add Event' primary button, a search field, four filters including a date "
  "range, a table of submissions with view / edit / delete on every row, and pagination.",
  "The page ends after the metric cards. None of the section is present, on either the State Nodal "
  "Officer or the District Nodal Officer dashboard, so neither officer can see or add a submission "
  "from the screen the design makes their home.",
  "Build the section as designed on both dashboards.",
  ("My Submissions",-8,-10,300,44), ("Total People Reached",-24,120,400,60)),

 ("S08","Screen","Sign in","SIGNIN-LOGIN","Major","Color & Token",
  "White text sits on an untinted photograph",
  "The left panel's photograph carries a navy tint, and the SAMAVESH lockup, the 'Justice. Equality. "
  "Dignity.' line and the paragraph beneath it read as white on that tint.",
  "The photograph is drawn at full contrast with no tint, and the same white text sits directly on it. "
  "Over the lighter areas of the crowd the paragraph is close to unreadable, and the contrast a reader "
  "gets depends on which part of the picture a line happens to fall over.",
  "Restore the navy tint over the photograph so the white text has a predictable ground, as the design "
  "specifies.",
  ("Single Access Mechanism for All Verticals of",-8,-8,420,70),
  ("Single Access Mechanism for All Verticals of Empowerment",-8,-8,420,70)),

 ("S09","Screen","Sign in","SIGNIN-LOGIN","Major","Components & States",
  "The sign-in fields have no visible labels",
  "Every field in the design's sign-in panel carries a visible label above it - 'Project Id', 'Enter "
  "OTP' - with the placeholder used only for an example value.",
  "The username and password fields carry no label at all; the only naming is the placeholder, which "
  "disappears the moment a reader types. The design has no frame for this tab, so it is audited against "
  "the pattern the design uses on every other field.",
  "Add a visible label above each field and keep the placeholder for the example.",
  ("Project Id",-4,-6,200,24), ("Username",-14,-10,260,44)),

 ("S10","Screen","Admin, State and District shells","ADMIN-USER-MANAGEMENT","Major","Components & States",
  "Two footer links land on the dashboard instead of their own page",
  "The design has no 'About Us' or 'Contact Us' page inside the authenticated shell; these are citizen-"
  "site destinations.",
  "In the admin shell /about-us and /contact-us both render a page that is byte-for-byte identical to "
  "the dashboard - verified by checksum on all three admin roles. A reader who follows either link is "
  "silently returned to the dashboard with no indication that the page they asked for does not exist.",
  "Point these links at the citizen site's pages, or give the shell a not-found state. A route with no "
  "page should say so rather than substituting the landing screen.",
  ("Dashboard",-4,-6,200,34), ("User Management",-4,-8,230,36)),

 ("S14","Screen","Citizen - masthead (every citizen screen)","PUBLIC-HOME","Minor","Components & States",
  "The citizen masthead is a different component from the one designed",
  "The right of the citizen masthead holds a signed-in user block: the name at 16px SemiBold "
  "#1F2937, the email beneath it at 13px #374151, and a 48px initials avatar filled #C8DBF0.",
  "The build shows a green National Deaddiction Helpline badge carrying the 14446 number, and a "
  "'Nasha Mukti Mitr Login' button. There is no user block, because the citizen site has no signed-in "
  "state. So the design assumes a citizen session the build does not have.",
  "Decide which is right and make both sides agree: either the citizen site gains the signed-in block "
  "the design draws, or the design is updated to the helpline-and-login masthead the build ships. "
  "Raised because the two disagree, not because the build is necessarily wrong.",
  ("Sachin Malhotra",-8,-10,200,50), ("@box",1478,58,320,64)),

 ("S15","Screen","Citizen - Help Centres & Facilities","PUBLIC-FACILITIES","Nit","Layout & Spacing",
  "The facility map opens on a whole-subcontinent view",
  "The map opens framed on the area the facilities are in, close enough to read street names, with the "
  "three results pinned in view.",
  "The map opens zoomed out far enough to show Kabul, Colombo and Chengdu, with 722 pins clustered over "
  "India, so a reader has to zoom before the map tells them anything about their own district.",
  "Frame the map on the results being listed - the reader's district, or the search area - rather than "
  "on the whole set. Raised as a confirm-if-intended: if a national overview is the deliberate default, "
  "say so and the design should show it that way.",
  ("Facilities (3)",-620,60,600,400), ("@box",300,300,620,400)),

 ("S11","Screen","Important Documents (all roles)","ADMIN-IMPORTANT-DOCUMENTS","Nit","Typography",
  "Status chips are not set in capitals",
  "The status chip is uppercase at 11px - DRAFT, PUBLISHED - which is what separates it from ordinary "
  "cell text at a glance.",
  "The chips read 'Draft' and 'Published' in sentence case, so they carry the same case as the data "
  "around them.",
  "Apply the uppercase transform to the status chip.",
  ("PUBLISHED",-6,-6,90,26), ("Published",-6,-8,90,26)),

 ("S12","Screen","Important Documents (all roles)","ADMIN-IMPORTANT-DOCUMENTS","Nit","Layout & Spacing",
  "The row actions are in a different order",
  "The row actions run download, then edit, then delete.",
  "They run edit, then download, then delete. The download control is the one a reader uses most on "
  "this screen and the design puts it first.",
  "Order the row actions download, edit, delete as the design does.",
  ("Action",-8,44,120,34), ("Action",-6,40,90,30)),
]

# Raised once, deliberately, instead of per screen.
GLOBAL_NOTES = [
 ("G16","Global","Filters (every screen with them)","Nit","Components & States",
  "Use the relevant filter options and follow the design",
  "Several screens draw more filters than the build offers - the citizen dashboard's State and District "
  "selects, the admin list screens' 'All States/UTs', the officer dashboard's four-filter row.",
  "This is raised once, as a note: show the filters each screen actually needs and style them as the "
  "design does. It is not repeated as a finding on each screen."),
]

# Raised by the reviewer in an earlier round and NOT carried into this report, each with the
# reason. A finding a reviewer has seen must be published as removed rather than quietly dropped.
NOT_RAISED = [
 ("Admin screens are missing the footer strip",
  "Checked on both sides: NO admin, State Nodal Officer or District Nodal Officer DESIGN frame "
  "carries a footer either - 0 footer elements across all 31 of them, against 3 on every citizen "
  "frame. The build matches the design exactly. Not a discrepancy."),
 ("The sidebar expand/collapse icon does not match the design",
  "Cropped both sides at 1:1: the control is the same collapse glyph in the same place at the same "
  "size. Any difference is in how it behaves, which a static design QC cannot evidence - it belongs "
  "in a functional pass."),
 ("The facility filter is too wide",
  "Width and height vary with content and viewport, so they are not audited as defects here."),
 ("The side navigation lists different items from the design",
  "Which items a menu carries is information architecture and content, which this run was scoped to "
  "leave out. Recorded for the content pass."),
 ("The filter label reads 'All Facilities' where the design says 'All Facility Types'",
  "Wording. Out of scope for this run by instruction."),
]

# Re-checked on 2026-09-11 against the current design and build, and NOT carried forward.
# Kept visible so a reviewer who saw them in the July report learns the outcome.
WITHDRAWN = [
 ("NMB-SNODASH-004","KPI grid reflows to unequal card widths",
  "Measured on the capture: the three cards on the officer dashboard span 308-662, 688-1040 and "
  "1066-1418 - 354, 352 and 352px with even 26px gaps, and the second row starts at the same two x "
  "positions. The grid is even. Withdrawn."),
 ("NMB-GLOBAL-003 (July wording)","Sidebar navigation icons absent PORTAL-WIDE",
  "The citizen shell does carry its navigation icons; only the admin shell has none. The finding is "
  "kept but narrowed to the admin shell - see G03."),
 ("NMB-GLOBAL-004 (July wording)","Page title is off the type scale",
  "The build's page title measures 24px at weight 600, which is exactly what the design specifies. Only "
  "the colour differs. Narrowed to a colour finding - see G11."),
]

# Observations about the DESIGN FILE, reported as observations rather than build findings.
DESIGN_FILE_NOTES = [
 ("Seven frames draw content outside their own canvas",
  "Measured during the Phase-0 read: 44 text nodes sit outside the frame bounds on each of the Admin "
  "State/UT-District Events, State Nodal Officer Dashboard and District Nodal Officer Dashboard frames, "
  "66 on Admin General Feedback, 9 on District Nodal Officer Important Documents, and 4 on each of the "
  "three NAPDDR committee frames. Content outside the frame renders nowhere - not in an export, not in "
  "Dev Mode - so it is invisible to anyone reading the handoff."),
 ("Twelve loose artboards sit at the section root",
  "Frames named 'Table', 'Table Container', 'Contianer', 'CardHeader', 'Body' and 'arrow-wrapper' sit "
  "beside the screen frames at 1090-3067px wide. They are the wide tables and fragments the screens "
  "reference, but at the root they read as screens."),
 ("The admin sign-in form has no design",
  "Both login frames draw the Patient Monitoring tab - one showing the Project Id field, one showing "
  "the OTP step. The Admin tab, which is what the build shows by default and what every officer in "
  "this audit signs in through, is drawn only as an inactive tab. Its form is undesigned."),
]
