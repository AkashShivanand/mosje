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
  loader: "2141:323879",
  avatars: "2141:296702",
  emptyState: "2141:296719",

  // ── Misc ──
  cover: "214:68343",
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
