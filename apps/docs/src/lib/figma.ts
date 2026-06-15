/**
 * Canonical SAMAVESH Figma library URL — single source so links can never drift
 * or 404. Pass a `node-id` (from Figma → right-click frame → Copy link) to deep-
 * link a specific page/frame; omit it to open the file root.
 */
export const FIGMA_FILE_URL =
  "https://www.figma.com/design/qyzTEy8dlb3ssYctlkMX5o/SAMAVESH-Design-System";

export function figmaUrl(nodeId?: string): string {
  return nodeId
    ? `${FIGMA_FILE_URL}?node-id=${encodeURIComponent(nodeId)}`
    : FIGMA_FILE_URL;
}
