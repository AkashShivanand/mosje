# NMBA — withdrawn claims, covered reviewer notes, and design-file observations

These were carried as a **Deferred — by decision** section in the published QC report until
2026-09-12, when the reviewer asked for the report to end with the findings. The record lives
here instead, and it is not otherwise lost: `findings_final.json` keeps `dropped[]` and
`designFileNotes[]`, and the QC tracker keeps a `Withdrawn` row, with its reason, for every
withdrawn finding.

Nothing here is an open finding. Read it as the audit showing its work.

## 1 · Withdrawn or superseded claims (5)

A claim withdrawn because it was **wrong** stays visible with its reason. That is the point:
an audit that quietly deletes its mistakes cannot be trusted about the ones it keeps.

**NMB-SCREEN-029 — Status chips are not set in capitals**

Dropped on the reviewer's instruction, 2026-09-11. The measurement stands - the design sets the
status chip uppercase at 11px and the build renders 'Draft' and 'Published' in sentence case -
but the reviewer has decided it is not worth raising. Recorded rather than deleted so the id
resolves for anyone who saw it.

**NMB-SCREEN-016 — The pledge banner has lost its call to action**

WRONG, and withdrawn on the reviewer's challenge. The button IS built. Checked on the live page
at a 1440 viewport on 2026-09-11: a <button> reading 'Take the Pledge', 176x36 at x1171 y230,
white fill, label #003366, radius 6 - which is what the design draws. It was missed because the
capture was taken with the UX4G accessibility panel open, which widened the document and pushed
the button to x1841, outside the 1440-wide export. 'Not in the picture' was read as 'not built'.
The capture is the evidence for what a screen LOOKS like; it is not evidence that something is
absent. An absence is now confirmed against the live DOM before it is written up.

**NMB-SNODASH-004 — KPI grid reflows to unequal card widths**

Measured on the capture: the three cards on the officer dashboard span 308-662, 688-1040 and
1066-1418 - 354, 352 and 352px with even 26px gaps, and the second row starts at the same two x
positions. The grid is even. Withdrawn.

**NMB-GLOBAL-003 (July wording) — Sidebar navigation icons absent PORTAL-WIDE**

The citizen shell does carry its navigation icons; only the admin shell has none. The finding is
kept but narrowed to the admin shell - see G03.

**NMB-GLOBAL-004 (July wording) — Page title is off the type scale**

The build's page title measures 24px at weight 600, which is exactly what the design specifies.
Only the colour differs. Narrowed to a colour finding - see G11.

## 2 · Reviewer notes already covered by a finding (5)

Raised by the reviewer on the review sheet, and answered by findings that were already in the
set. Listed so the reviewer can see each note was read, not dropped.

**Admin screens are missing the footer strip**

Checked on both sides: NO admin, State Nodal Officer or District Nodal Officer DESIGN frame
carries a footer either - 0 footer elements across all 31 of them, against 3 on every citizen
frame. The build matches the design exactly. Not a discrepancy.

**The sidebar expand/collapse icon does not match the design**

Cropped both sides at 1:1: the control is the same collapse glyph in the same place at the same
size. Any difference is in how it behaves, which a static design QC cannot evidence - it belongs
in a functional pass.

**The facility filter is too wide**

Width and height vary with content and viewport, so they are not audited as defects here.

**The side navigation lists different items from the design**

Which items a menu carries is information architecture and content, which this run was scoped to
leave out. Recorded for the content pass.

**The filter label reads 'All Facilities' where the design says 'All Facility Types'**

Wording. Out of scope for this run by instruction.

## 3 · Observations about the DESIGN file (3)

Not build defects — these are things wrong in the handoff itself, found during the Phase-0
read. They belong to whoever maintains the Figma file.

**Seven frames draw content outside their own canvas**

Measured during the Phase-0 read: 44 text nodes sit outside the frame bounds on each of the
Admin State/UT-District Events, State Nodal Officer Dashboard and District Nodal Officer
Dashboard frames, 66 on Admin General Feedback, 9 on District Nodal Officer Important Documents,
and 4 on each of the three NAPDDR committee frames. Content outside the frame renders nowhere -
not in an export, not in Dev Mode - so it is invisible to anyone reading the handoff.

**Twelve loose artboards sit at the section root**

Frames named 'Table', 'Table Container', 'Contianer', 'CardHeader', 'Body' and 'arrow-wrapper'
sit beside the screen frames at 1090-3067px wide. They are the wide tables and fragments the
screens reference, but at the root they read as screens.

**The admin sign-in form has no design**

Both login frames draw the Patient Monitoring tab - one showing the Project Id field, one
showing the OTP step. The Admin tab, which is what the build shows by default and what every
officer in this audit signs in through, is drawn only as an inactive tab. Its form is
undesigned.

