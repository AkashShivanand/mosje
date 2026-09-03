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
  spacing: "2140:295915", // "Layout Grid"
  shape: "55623:696", // "Radius — Documentation" on the Radius page (55623:695), added
  //                          2026-08-18 between Spacing and Motion in the FOUNDATION run
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
  buttons: "2141:296705",
  buttonDoc: "56160:1773", // "Button — Documentation" on the Buttons page, authored
  //                          2026-08-25 to the house style. It replaced a 1400px template
  //                          with 16 text nodes, ZERO on a published style, describing a
  //                          component that does not exist ("Primary · Secondary · Outlined
  //                          · Ghost"). The set has Type x Sub-type, not those words.
  buttonRecord: "56164:1805", // "Button — Component record" — the maintainer frame. The
  //                          FIRST one in the library; figma-code-sync.md records that no
  //                          page had one, which is why open work kept being rediscovered.
  inputs: "2141:296720",
  inputsDoc: "56793:50560", // "Inputs — Documentation" on the Inputs page, authored
  //                          2026-09-03 to the house style. It replaced the retired 1400px
  //                          "DS template", whose six headings described a component with
  //                          three sizes and five states; that template sat in a Scratch
  //                          section which has since been deleted along with it.
  //                          Its six hero statistics are COUNTED from the file at build time,
  //                          not typed, so a wrong number here means the file is wrong.
  inputsRecord: "56793:50803", // "Inputs — Component record" — open items only, forward
  //                          looking, with the provenance of every number on the doc frame.
  inputField: "85:837", // the Input Field set itself — 4 sizes x 9 states = 36 variants
  botCheck: "56824:1294", // the BotCheck set — 9 variants (Invisible draws only its failed
  //                         state, so the matrix is 4 + 4 + 1 rather than 12). It replaced
  //                         Captcha Field, which was deleted from the page on 2026-09-03.
  characterCount: "56792:50500", // the Character Count set, authored 2026-09-03
  requiredFieldsLegend: "56792:50506", // the Required Fields Legend set, authored 2026-09-03
  card: "2141:296707",
  badges: "2141:296703",
  checkbox: "2141:296710",
  chips: "2141:296709",
  radio: "2141:323876",
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
  authParts: "55439-749",
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
  sheetToggle: "55798-4566",
  siteHeader: "4235-3169",
  tab: "2316-353",
  tabs: "55489-870",
  tabsMore: "55514-848",
  ticker: "56159-903",
  // Named on the Sidebar page itself, which said the node existed and that this
  // estate had not registered it — an absence statement that told the reader
  // where to go and then refused to take them.
  portalSidebar: "4208-740",
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
