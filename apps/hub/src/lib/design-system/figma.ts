/**
 * Canonical SAMAVESH Figma library + the node IDs of its pages, captured via
 * /sync-figma (Figma plugin read of figma.root.children — the authoritative
 * 72-page list; the read-only get_metadata endpoint truncates it). Single source
 * so links never drift, and component/foundation docs deep-link to their frame.
 *
 * Last synced: 2026-06-16 · file 3FF5l0SMNIwdpZrKkeyPTm
 * (file key updated 2026-07-21; the former key qyzTEy8dlb3ssYctlkMX5o resolves to
 * the same document and is kept only in dated audit/handoff records.)
 */
export const FIGMA_FILE_URL =
  "https://www.figma.com/design/3FF5l0SMNIwdpZrKkeyPTm/SAMAVESH-Design-System";

/** Page/frame node IDs in the SAMAVESH Figma file (docs-relevant subset). */
export const FIGMA_NODES = {
  // ── Foundations ──
  color: "2140:295913", // "Color Styles"
  typography: "2140:295912", // "Text Styles"
  spacing: "55596:695", // "Spacing" — its own page since 2026-08-18; linked here from 2026-09-05
  layout: "2140:295915", // "Layout Grid"
  shape: "55623:695", // the Radius page. Was the Documentation frame's id (55623:696), which
  //                          stopped resolving when the frame was rebuilt on 2026-09-04 — a page
  //                          id survives a rebuild, a frame id does not (found 2026-09-05)
  elevation: "2140:295914", // "Effects"
  iconography: "2316:246", // "Iconography" — the Icon component, bespoke marks,
  //                              emblems, org logos and the documentation, all on one page
  accessibility: "2382:295905", // "Accessibility Bar and Widget"
  brand: "56507:971", // "Brand" — the page, added 2026-08-31 between Iconography and
  //                          the COMPONENTS divider. A departmental crest is a brand
  //                          asset, not an icon, so the org marks moved off Iconography.
  orgLogo: "4273:720", // the `org-logo` component set on that page — 17 variants, one
  //                          per Org, matching ORG_LOGOS in the code registry one for one.
  // `logosIcons` removed 2026-08-12: the "Logos and Misc Icons" and "Org Logos" pages were
  // merged into Iconography above and deleted, so the id no longer resolves. It had no callers.
  motion: "4162:695", // "Motion" (authored from @mosje/tokens)
  density: "4170:695", // "Density" (authored from @mosje/tokens)

  // ── Components ──
  /* "Charts & Graphs" — the data-visualisation page, rebuilt 2026-09-05 in the
     house style. `chartsDoc` is its `— Documentation` frame; the masters
     (Metric Card, Chart Card, Ranked Bar Row, Chart, Legend, Tooltip) sit in
     numbered sections beneath it, and the UX4G Chart.js import that used to be
     the whole page is kept as a renamed legacy set until its instances are
     migrated. `mapOfIndia` is the sibling page the choropleth lives on. */
  charts: "2840:10801",
  chartsDoc: "57411:15871",
  chartsMetricCard: "57414:15871", // `Metric Card` set — Reading 5 × Tone 3
  chartsChartCard: "57418:15985", // `Chart Card` set — State 6
  chartsChart: "57417:15992", // `Chart` set — Type 15, the foundational chart types at 480×280
  chartsRankedList: "57420:15961", // `Ranked Bar List` — five `Ranked Bar Row` (57420:15960) instances
  chartsLegend: "57420:16040", // `Legend` set — Swatch 3
  chartsTooltip: "57420:16041",
  mapOfIndia: "6803:290942", // the page
  mapOfIndiaDoc: "57437:750", // "Map of India — Documentation", authored 2026-09-05; the `IndiaMap` set (6803:291103) beneath it carries Kind = Choropleth | Choropleth · hover | Bubble | Point
  buttons: "2141:296705",
  /* "Button Group" — authored 2026-09-03, page inserted between Buttons and Close
     Button. The component had existed in code with no Figma counterpart at all, so a
     designer had no way to draw a grouped or segmented control and reached for a plain
     auto-layout frame — which is the touching-targets defect it exists to prevent.
     Attached x Orientation, 4 variants, each built from real Button instances. */
  buttonGroup: "56793:1214",
  /* "Link" — the set has lived on the Buttons page since the library was imported from
     UX4G, and had NO code counterpart until 2026-09-03. It was published, findable, and
     unbuildable: 194 hand-rolled brand-coloured anchors across the hub are what a
     designed-but-unbuilt component produces. */
  link: "2723:1598",
  buttonDoc: "56160:1773", // "Button — Documentation" on the Buttons page, authored
  //                          2026-08-25 to the house style. It replaced a 1400px template
  //                          with 16 text nodes, ZERO on a published style, describing a
  //                          component that does not exist ("Primary · Secondary · Outlined
  //                          · Ghost"). The set has Type x Sub-type, not those words.
  buttonRecord: "56164:1805", // "Button — Component record" — the maintainer frame. The
  //                          FIRST one in the library; figma-code-sync.md records that no
  //                          page had one, which is why open work kept being rediscovered.
  // THE INPUT FAMILY IS FIVE PAGES, not one. Until 2026-09-04 a single "Inputs" page
  // carried eight components behind one label, while Checkbox, Radio, Toggle and Search
  // each had their own — so Select was the only form control a designer could not find by
  // name. The split follows one test: does a designer ever place this WITHOUT placing a
  // field? Input Field, Input Area, Select, OTP Input and Bot Check answer yes and have a
  // page each. Character Count, Required Fields Legend, Password Strength Meter and the
  // OTP Box answer no and stay as numbered sections under the component they serve.
  //
  // Node ids survive a page move, which is why none of the ids below changed.
  inputs: "2141:296720", // the page itself, renamed "Input Field" in the split
  inputsDoc: "56793:50560", // "Input Field — Documentation", authored 2026-09-03 to the
  //                          house style and re-scoped on 2026-09-04 when the family split.
  //                          Its six hero statistics are COUNTED from the page, not typed,
  //                          so a wrong number here means the file is wrong.
  inputsRecord: "56793:50803", // "Input Field — Component record" — open items only,
  //                          forward looking. Items belonging to the four components that
  //                          moved went with them to their own records.
  inputField: "85:837", // the Input Field set itself — 4 sizes x 9 states = 36 variants
  botCheck: "56824:1294", // the BotCheck set — 9 variants (Invisible draws only its failed
  //                         state, so the matrix is 4 + 4 + 1 rather than 12). It replaced
  //                         Captcha Field, which was deleted on 2026-09-03.
  inputArea: "87:4945", // the Input Area set (Textarea in code) — 4 sizes x 9 states
  select: "55430:34472", // the Select set, on its own page since the split. Not `dropdown`
  //                        below, which is the separate Dropdown page — pointing Select's
  //                        documentation there sent a designer to a different component.
  otpInput: "55427:34365", // the OTP Input set — 2 lengths x 4 states
  otpBox: "55427:704", // its single-digit sub-part, published so a longer code can be built
  passwordStrengthMeter: "55432:795", // the Password Strength Meter set — 5 strengths
  characterCount: "56792:50500", // the Character Count set, authored 2026-09-03
  requiredFieldsLegend: "56792:50506", // the Required Fields Legend set, authored 2026-09-03
  card: "2141:296707",
  // "Description List" — created 2026-09-06 between Comment and List, holding the
  // ROW master (8 variants), its documentation frame and its component record.
  // The grid that arranges rows is code-only and is recorded as open item 01.
  descriptionList: "57518:737",
  // "Figure" — created 2026-09-06 after Description List. Ten variants (Ratio ×
  // Fit); the image itself is a slot the caller fills, which is why the master
  // draws an empty framed rectangle.
  figure: "57524:789",
  // "Time Slot" — created 2026-09-06 after Toggle. The master is one bookable
  // window; the fieldset and the auto-filling grid are code-only.
  timeSlot: "57526:737",
  // "Biometric Capture" — created 2026-09-06 after Time Slot. Fifteen variants
  // (State × Modality), each drawing the alternative route.
  biometricCapture: "57530:737",
  // Rebuilt 2026-09-06 to match the code, with the UX4G/Material imports they
  // superseded renamed "⛔ … (deprecated)" and left in place, because instances
  // may exist. The department chose the code's model in each case.
  // Built 6 September 2026, alongside the code. Each id is the page's
  // — Documentation frame, which is where a designer should land.
  numberInput: "57605:772",
  dateRangePicker: "57613:799",
  signaturePad: "57621:774",
  splitButton: "57606:764",
  backToTop: "57608:747",
  bulkActionsBar: "57609:761",
  fileList: "57611:777",
  tree: "57614:785",
  transferList: "57616:832",
  scheduleGrid: "57618:800",
  videoTile: "57620:781",
  cookieConsent: "57622:780",
  languageSwitcher: "57597:737",
  inlineEdit: "57599:772",
  eventList: "57600:48772",
  popover: "2141:323874",
  // The page was called "Dropdown" until 2026-09-06. "Dropdown" means both a
  // select and a menu across the industry, and this estate needs the
  // distinction: one edits a field's value, the other performs an action.
  menu: "2141:296718",
  listGroup: "2141:323867",
  feedbackWidget: "3989:33663",
  // Rebuilt 2026-09-06, same pass. The page was "Range Slider" until then and
  // held only the two-thumb master; the library had no single-thumb Slider at
  // all. Both are published here now.
  slider: "2179:67252",
  // The UX4G three-column scroller showing 00:00:00 is deprecated in place; the
  // typed 24-hour field is section 2 of the Date-Time Picker page.
  timePicker: "2141:296716",
  // Was five hardcoded "Slide N/Desktop" frames — a mockup of one carousel.
  // Slides are consumer content; the design system owns the control row.
  carousel: "2141:296708",
  badges: "2141:296703",
  checkbox: "15:664", // the Checkbox set. The entry pointed at the PAGE (2141:296710) until 2026-09-04
  chips: "2141:296709",
  radio: "18:791", // the Radio set. The entry pointed at the PAGE (2141:323876) until 2026-09-04
  search: "2141:323878",
  toggle: "2141:323883",
  dropdown: "2141:296718", // Select
  alerts: "2141:296701",
  chatbot: "55827:730", // "Chatbot — Documentation" on the Chatbot page (55813:941),
  //                          authored 2026-08-23 under Feedback & Status
  chatbotMascot: "55830:731", // "2 · Chatbot Mascot" section on the same page
  chatbotPrototype: "55846:731", // "01 · Closed", the flow's starting point in
  //                          "3 · Prototype" (55846:730). Opens straight into Present.
  chatbotMotion: "55940:872", // "09 Motion specimen" — the three loops, running on live
  //                          instances INSIDE the documentation frame. It used to be a
  //                          standalone frame beside the prototype flow (55852:893), which
  //                          gave all three loops one borrowed 10s duration; the loops now
  //                          live on the masters and the section demonstrates them.
  /* Section Templates — authored 2026-08-30, page "SAMAVESH Banner" between
     Navbar and Footer. Tone (Light|Dark|Tint) x State (Closed|Open), six
     variants, zero unbound values. */
  samaveshBanner: "56479:42386",
  /* Navigation — page "Portal Card" between Pagination and Stepper, matching
     where the component lives in code. Status (Live|Planned). */
  portalCard: "56486:832",
  /* "Stepper" — the PAGE id, rebuilt in the house style on 2026-09-06. The page
     had been carried unchanged from the UX4G 2.0 fork since the library was
     created: two component sets, four loose example components and three stray
     frames, with no Documentation frame, no Component record and no numbered
     sections — and no entry here at all, so the docs page had been declaring the
     component "Not yet published in the Figma library" while it sat in it.
     The page id is recorded rather than a frame id, because a page id survives a
     rebuild and a frame id does not — the lesson `shape` above was taught. */
  stepper: "2106:2",
  loader: "2141:323879",
  avatars: "2141:296702",
  emptyState: "2141:296719",

  // ── Misc ──
  cover: "214:68343",

  // ── Component frames recovered from the Code Connect templates, 2026-09-02 ──
  //
  // Every `*.figma.ts` in packages/design-system carries the node it maps, in a
  // `// url=<SAMAVESH>?node-id=…` header the CLI reads. Twenty-five of them did,
  // and this registry held none — which is why 53 documentation pages called
  // `figmaUrl()` with no argument and shipped a link labelled "Figma Component
  // Spec" that landed on the file root, and why the census kept reporting the
  // Figma link as the single most-missing element on a component page.
  //
  // These are not new lookups: each is the id the Code Connect mapping already
  // publishes for that component, so a page linking here and a designer opening
  // Dev Mode arrive at the same frame. Anything still absent below is genuinely
  // absent from the library, and its page says so rather than linking to nothing.
  accessibilityBar: "55065-33766",
  accountMenu: "56046-4113",
  accountMenuItem: "56040-4083",
  authParts: "57464-12739", // the SigningIntoBar Device set (2026-09-05); its Tone set (55439-749) was dissolved 2026-09-04
  brandLockup: "4235-3652",
  divider: "55061-700",
  dropdownItem: "4299-1940",
  iconButton: "3-3497",
  megaMenu: "4268-914",
  megaMenuItem: "4258-33604",
  menuToggle: "55783-4565",
  navDropdown: "4300-1950",
  navItemLink: "2065-292757",
  navSheet: "55327-3503",
  portalLoginTemplate: "55397-1364",
  // Promoted out of its own variant set on 2026-09-06: it was Auth Method
  // (Password/OTP/PIN/DARPAN) and is now one component with a Credential
  // fields instance-swap slot, so the node is a COMPONENT, not a set.
  authFormCard: "55445-778",
  portalList: "55444-709",
  credentialFieldsPassword: "57574-14697",
  credentialFieldsPin: "57574-14737",
  credentialFieldsDarpan: "57575-14794",
  credentialFieldsOtpRequest: "57575-14833",
  credentialFieldsOtpVerify: "57575-14856",
  sheetToggle: "55798-4566",
  siteHeader: "4235-3169",
  tab: "2316-353",
  tabs: "55489-870",
  tabsMore: "55514-848",
  ticker: "56159-903",
  // Sidebar page — rebuilt 2026-09-05. The three pre-existing sets were mutated in
  // place, so 4286-* ids are the originals; the rest are new that day.
  portalSidebar: "4286-428",
  sidebarItem: "4286-285",
  sidebarSubItem: "4286-361",
  sidebarLeaf: "57129-1097",
  sidebarGroupLabel: "57137-1189",
  sidebarCollapseControl: "57137-1199",
  sidebarFlyout: "57137-1200",
  sidebarIdentity: "57262-1829",
} as const;

export type FigmaNode = keyof typeof FIGMA_NODES;

/**
 * Build a Figma URL. Pass a node ID (or one of FIGMA_NODES) to deep-link a
 * specific frame; omit it to open the file root.
 */
export function figmaUrl(nodeId?: string): string {
  // Figma's canonical deep-link uses the dash form (node-id=2141-296705).
  return nodeId
    ? `${FIGMA_FILE_URL}?node-id=${nodeId.replace(":", "-")}`
    : FIGMA_FILE_URL;
}
