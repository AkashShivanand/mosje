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
