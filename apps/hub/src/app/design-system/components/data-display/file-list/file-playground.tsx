"use client";
import * as React from "react";
import { FileList, type FileItem } from "@mosje/design-system";

const FILES: FileItem[] = [
  { id: "1", name: "aadhaar-card.pdf", kind: "Aadhaar card", size: 1_258_291, state: "ready", href: "#a" },
  { id: "2", name: "income-certificate-2026-signed-by-tehsildar.pdf", kind: "Income certificate", size: 860_160, state: "scanning" },
  { id: "3", name: "bank-passbook.jpg", kind: "Bank passbook", size: 3_355_443, state: "uploading", progress: 62 },
  {
    id: "4",
    name: "site-photograph.heic",
    kind: "Site photograph",
    size: 8_912_896,
    state: "failed",
    error: "The file is larger than 5 MB. Reduce it and upload again.",
  },
];

const READ_ONLY: FileItem[] = [
  { id: "a", name: "aadhaar-card.pdf", kind: "Aadhaar card", size: 1_258_291, state: "ready", href: "#a" },
  { id: "b", name: "income-certificate.pdf", kind: "Income certificate", size: 860_160, state: "ready", href: "#b" },
];

/** Every state, then the read-only list a citizen sees after submitting. */
export function FilePlayground(): React.JSX.Element {
  const [files, setFiles] = React.useState(FILES);
  return (
    <div
      style={{
        padding: "var(--sa-padding-32)",
        background: "var(--sa-bg-neutral-subtle)",
        borderRadius: "var(--sa-shape-8)",
        display: "flex",
        flexDirection: "column",
        gap: "var(--sa-stack-24)",
      }}
    >
      <FileList
        label="Documents attached to this application"
        files={files}
        onRemove={(id) => setFiles((f) => f.filter((x) => x.id !== id))}
        onRetry={() => {}}
      />
      <FileList label="Documents on the submitted application" files={READ_ONLY} />
    </div>
  );
}
