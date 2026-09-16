"use client";

/**
 * One uploaded document, opened from the officer review screen.
 *
 * The review screen listed twenty documents by file name with no way to open any of them, while
 * the officer certified that the documents "have been examined" (UX audit UX-02, 14 Sep 2026).
 * The sheet opens beside the decision, so the verdict and the file are read together.
 *
 * DS Audit: SideSheet ✅ existing · DescriptionList ✅ · ListGroup / ListRow ✅ · Alert ✅ ·
 * Button ✅ · Icon ✅ · SectionTitle ✅ — nothing new.
 *
 * Maintainer note, kept off the screen: the register holds a document's name, size and dates but
 * not its bytes, so `previewUrl` is never set today. When uploads keep a data URL or blob, pass it
 * and the file renders in the frame.
 */

import * as React from "react";
import { Alert, Button, DescriptionList, Icon, ListGroup, ListRow, SectionTitle, SideSheet } from "@mosje/design-system";
import { formatDate } from "@/lib/e-anudaan/format";
import type { MockDoc } from "@/lib/e-anudaan/types";

export function DocumentPreviewSheet({
  doc,
  verdict,
  verdictControl,
  previewUrl,
  onClose,
}: {
  doc: MockDoc | null;
  /** The verdict as the review screen words it. */
  verdict?: string;
  /**
   * The officer's verdict control, for an officer who may still change it. The verdict is given
   * WHERE the document is read, so opening a file and recording what it showed is one movement
   * (design-director audit R-01).
   */
  verdictControl?: React.ReactNode;
  previewUrl?: string;
  onClose: () => void;
}) {
  const download = React.useCallback(() => {
    if (!doc) return;
    if (previewUrl) {
      const a = document.createElement("a");
      a.href = previewUrl;
      a.download = doc.fileName ?? doc.title;
      a.click();
      return;
    }
    // No bytes are held for this file: the download is the register's record of it.
    const lines = [
      `Document: ${doc.slot}. ${doc.title}`,
      `File name: ${doc.fileName ?? "Not uploaded"}`,
      `Type: ${fileType(doc.fileName)}`,
      `Size: ${fileSize(doc.sizeKb)}`,
      `Uploaded on: ${doc.uploadedAt ? formatDate(doc.uploadedAt) : "Not recorded"}`,
      ...(doc.versions ?? []).map(
        (v, i) => `Earlier version ${i + 1}: ${v.fileName}, ${fileSize(v.sizeKb)}, replaced on ${formatDate(v.replacedAt)}`,
      ),
    ];
    const url = URL.createObjectURL(new Blob([lines.join("\n")], { type: "text/plain" }));
    const a = document.createElement("a");
    a.href = url;
    a.download = `${(doc.fileName ?? doc.title).replace(/\.[^.]+$/, "")}-record.txt`;
    a.click();
    URL.revokeObjectURL(url);
  }, [doc, previewUrl]);

  return (
    <SideSheet
      open={doc !== null}
      onClose={onClose}
      size="lg"
      title={doc ? `${doc.slot}. ${doc.title}` : ""}
      footer={
        doc?.fileName ? (
          <div className="flex flex-wrap justify-end gap-3">
            <Button appearance="outlined" onClick={onClose}>
              Close
            </Button>
            <Button onClick={download}>
              <Icon name="download" size={16} aria-hidden /> {previewUrl ? "Download" : "Download Record"}
            </Button>
          </div>
        ) : undefined
      }
    >
      {doc && (
        <div className="space-y-5">
          {verdictControl && (
            <div className="space-y-2">
              <SectionTitle as={3} title="Your Verdict" />
              {verdictControl}
            </div>
          )}
          <DescriptionList
            columns={2}
            size="sm"
            items={[
              { term: "File Name", value: doc.fileName ?? "No file uploaded" },
              { term: "Type", value: fileType(doc.fileName) },
              { term: "Size", value: fileSize(doc.sizeKb) },
              { term: "Uploaded On", value: doc.uploadedAt ? formatDate(doc.uploadedAt) : "Not recorded" },
              { term: "Document Group", value: doc.group === "annual" ? "Annual — verified each year" : "Permanent" },
              ...(verdict && !verdictControl ? [{ term: "Verdict", value: verdict }] : []),
            ]}
          />

          {!doc.fileName ? (
            <Alert status="warning" title="No File Uploaded">
              The NGO has not uploaded a file for this document.
            </Alert>
          ) : previewUrl ? (
            <iframe title={`Preview of ${doc.title}`} src={previewUrl} className="h-[32rem] w-full rounded-md border border-line" />
          ) : (
            <Alert status="info" title="Preview Not Available in This Demonstration">
              The file itself is not held here. Download the record of the upload instead.
            </Alert>
          )}

          <div className="space-y-2">
            <SectionTitle as={3} title="Version History" />
            <ListGroup size="sm" aria-label={`Versions of ${doc.title}`}>
              {doc.fileName && (
                <ListRow
                  title={`${doc.fileName} · current`}
                  description={`${fileSize(doc.sizeKb)} · uploaded ${doc.uploadedAt ? formatDate(doc.uploadedAt) : "on a date not recorded"}`}
                />
              )}
              {[...(doc.versions ?? [])].reverse().map((v, i) => (
                <ListRow
                  key={`${v.fileName}-${v.replacedAt}-${i}`}
                  title={v.fileName}
                  description={`${fileSize(v.sizeKb)} · uploaded ${v.uploadedAt ? formatDate(v.uploadedAt) : "on a date not recorded"} · replaced ${formatDate(v.replacedAt)}`}
                />
              ))}
            </ListGroup>
            {!doc.versions?.length && <p className="text-body-3 text-ink-muted">No earlier version is on record.</p>}
          </div>
        </div>
      )}
    </SideSheet>
  );
}

function fileType(name: string | undefined): string {
  const ext = name?.split(".").pop()?.toLowerCase();
  if (!name || !ext || ext === name.toLowerCase()) return "Not recorded";
  if (ext === "pdf") return "PDF document";
  if (ext === "jpg" || ext === "jpeg") return "JPEG image";
  if (ext === "png") return "PNG image";
  return `${ext.toUpperCase()} file`;
}

function fileSize(kb: number | undefined): string {
  if (kb === undefined) return "Not recorded";
  return kb >= 1024 ? `${(kb / 1024).toFixed(2)} MB` : `${kb} KB`;
}
