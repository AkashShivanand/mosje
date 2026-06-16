/**
 * Canonical SAMAVESH Figma library + the node IDs of its pages, captured via
 * /sync-figma (Figma plugin read of figma.root.children — the authoritative
 * 72-page list; the read-only get_metadata endpoint truncates it). Single source
 * so links never drift, and component/foundation docs deep-link to their frame.
 *
 * Last synced: 2026-06-16 · file qyzTEy8dlb3ssYctlkMX5o
 */
export const FIGMA_FILE_URL =
  "https://www.figma.com/design/qyzTEy8dlb3ssYctlkMX5o/SAMAVESH-Design-System";

/** Page/frame node IDs in the SAMAVESH Figma file (docs-relevant subset). */
export const FIGMA_NODES = {
  // ── Foundations ──
  color: "2140:295913", // "Color Styles"
  typography: "2140:295912", // "Text Styles"
  spacing: "2140:295915", // "Layout Grid"
  elevation: "2140:295914", // "Effects"
  iconography: "2316:246", // "Icons"
  accessibility: "2382:295905", // "Accessibility Bar and Widget"
  logosIcons: "67:12464", // "Logos and Misc Icons"

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
