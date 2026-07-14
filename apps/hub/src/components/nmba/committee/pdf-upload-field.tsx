"use client";

// PDF-only click-or-drag drop zone with a 10 MB cap. Holds the file in-session
// as a blob object URL (no backend). Shared by every file upload in the flow
// (Committee Notification + Meeting Minutes).

import * as React from "react";
import { FileText, X } from "lucide-react";
import { cn } from "@/lib/nmba/utils";
import { ACCEPTED_UPLOAD_MIME, MAX_UPLOAD_BYTES } from "@/lib/nmba/committee/masters";
import type { UploadedFile } from "@/lib/nmba/committee/types";

function formatSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

interface PdfUploadFieldProps {
  id: string;
  value: UploadedFile | null;
  onChange: (file: UploadedFile | null) => void;
  /** Helper line shown inside the drop zone. */
  hint?: string;
}

export function PdfUploadField({
  id,
  value,
  onChange,
  hint = "PDF only, up to 10 MB.",
}: PdfUploadFieldProps) {
  const inputRef = React.useRef<HTMLInputElement>(null);
  const [error, setError] = React.useState("");
  const [dragging, setDragging] = React.useState(false);

  const handleFile = (file: File | undefined) => {
    setError("");
    if (!file) return;
    // Some OS/browser pickers report an empty type for a valid .pdf; fall back
    // to the extension in that case.
    const isPdf =
      file.type === ACCEPTED_UPLOAD_MIME ||
      (file.type === "" && file.name.toLowerCase().endsWith(".pdf"));
    if (!isPdf) {
      setError("Only PDF files are accepted.");
      return;
    }
    if (file.size > MAX_UPLOAD_BYTES) {
      setError(`File is too large (max 10 MB). This file is ${formatSize(file.size)}.`);
      return;
    }
    if (value?.blobUrl) URL.revokeObjectURL(value.blobUrl);
    onChange({
      name: file.name,
      sizeBytes: file.size,
      mime: file.type,
      blobUrl: URL.createObjectURL(file),
    });
  };

  const clear = () => {
    if (value?.blobUrl) URL.revokeObjectURL(value.blobUrl);
    onChange(null);
    setError("");
    if (inputRef.current) inputRef.current.value = "";
  };

  const openPicker = () => inputRef.current?.click();

  return (
    <div>
      <input
        ref={inputRef}
        id={id}
        type="file"
        accept="application/pdf"
        className="sr-only"
        onChange={(e) => handleFile(e.target.files?.[0])}
      />

      {value ? (
        <div className="flex items-center justify-between gap-3 rounded-xl border border-line bg-white px-3.5 py-3">
          <span className="flex min-w-0 items-center gap-3">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-brandwash text-navy">
              <FileText className="h-4 w-4" />
            </span>
            <span className="min-w-0">
              <span className="block truncate text-sm font-medium text-ink">{value.name}</span>
              <span className="block text-xs text-ink-hint">
                {formatSize(value.sizeBytes)}
                {value.blobUrl ? "" : " · re-upload to view"}
              </span>
            </span>
          </span>
          <span className="flex shrink-0 items-center gap-1">
            {value.blobUrl && (
              <a
                href={value.blobUrl}
                target="_blank"
                rel="noreferrer"
                className="rounded-md px-2.5 py-1 text-sm font-semibold text-navy hover:bg-brandwash"
              >
                View
              </a>
            )}
            <button
              type="button"
              onClick={clear}
              aria-label="Remove file"
              className="flex h-8 w-8 items-center justify-center rounded-full text-ink-muted hover:bg-black/5"
            >
              <X className="h-4 w-4" />
            </button>
          </span>
        </div>
      ) : (
        <div
          role="button"
          tabIndex={0}
          aria-describedby={`${id}-hint`}
          onClick={openPicker}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              openPicker();
            }
          }}
          onDragOver={(e) => e.preventDefault()}
          onDragEnter={(e) => {
            e.preventDefault();
            setDragging(true);
          }}
          onDragLeave={() => setDragging(false)}
          onDrop={(e) => {
            e.preventDefault();
            setDragging(false);
            handleFile(e.dataTransfer.files?.[0]);
          }}
          className={cn(
            "flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed px-4 py-8 text-center transition-colors",
            dragging
              ? "border-navy bg-brandwash"
              : "border-line bg-surface-muted hover:border-navy/50 hover:bg-brandwash/40",
          )}
        >
          <span className="flex h-12 w-12 items-center justify-center rounded-full bg-white text-ink-muted shadow-sm">
            <FileText className="h-5 w-5" />
          </span>
          <span className="text-sm font-semibold text-ink">Click or drag PDF to upload</span>
          <span id={`${id}-hint`} className="text-xs text-ink-hint">
            {hint}
          </span>
        </div>
      )}

      {error && (
        <p role="alert" className="mt-1.5 text-xs text-danger">
          {error}
        </p>
      )}
    </div>
  );
}
