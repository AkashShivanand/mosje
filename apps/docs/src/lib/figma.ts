/**
 * Canonical SAMAVESH Figma library + the node IDs of its pages, captured via
 * /sync-figma (Figma MCP `get_metadata`). Single source so links can never drift
 * or 404, and so component docs can deep-link straight to their Figma frame.
 *
 * The library is organised by component; foundations (colour, type, spacing) are
 * Figma *variables*, not frames, so they have no node to deep-link — those open
 * the file root.
 *
 * Last synced: 2026-06-15 · file qyzTEy8dlb3ssYctlkMX5o
 */
export const FIGMA_FILE_URL =
  "https://www.figma.com/design/qyzTEy8dlb3ssYctlkMX5o/SAMAVESH-Design-System";

/** Page/frame node IDs in the SAMAVESH Figma file. */
export const FIGMA_NODES = {
  cover: "214:68343",
  logosIcons: "67:12464",
  buttons: "2141:296705",
  checkbox: "2141:296710",
  chips: "2141:296709",
  radio: "2141:323876",
  search: "2141:323878",
  toggle: "2141:323883",
  alerts: "2141:296701",
  loader: "2141:323879",
  avatars: "2141:296702",
  badges: "2141:296703",
  card: "2141:296707",
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
