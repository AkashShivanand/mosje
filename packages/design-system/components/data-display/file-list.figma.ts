// url=<SAMAVESH>?node-id=57611-775
// source=packages/design-system/components/data-display/file-list.tsx
// component=FileList
import figma from "figma";

const instance = figma.selectedInstance;

/**
 * Figma publishes the ROW; code publishes the LIST, and `label` names it. The
 * axis is the file's own state, which lives on the file rather than on the list.
 *
 * The per-file accessible names — "Remove income-certificate.pdf" — are built by
 * the component from `name`. Do not add a prop for them.
 */
const state = instance.getEnum("State", {
  Attached: "ready",
  Scanning: "scanning",
  Uploading: "uploading",
  Failed: "failed",
});

const extra =
  state === "uploading"
    ? ", progress: 62"
    : state === "failed"
      ? ', error: "The file is larger than 5 MB. Reduce it and upload again."'
      : "";

export default {
  example: figma.code`
    <FileList
      label="Documents attached to this application"
      onRemove={remove}
      onRetry={retry}
      files={[
        {
          id: "1",
          name: "income-certificate-2026-signed-by-tehsildar.pdf",
          kind: "Income certificate",
          size: 860160,
          state: "${state}"${extra},
        },
      ]}
    />
  `,
  imports: ['import { FileList } from "@mosje/design-system"'],
  id: "file-list",
  metadata: { nestable: false },
};
