"use client";

import * as React from "react";
import { cn } from "../../utils/cn";
import "./media-upload.css";

const UploadGlyph = () => (
  <svg viewBox="0 0 24 24" width="24" height="24" fill="none" aria-hidden="true">
    <path d="M12 16V4m0 0L7 9m5-5l5 5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const FileGlyph = () => (
  <svg viewBox="0 0 24 24" width="28" height="28" fill="none" aria-hidden="true">
    <path d="M14 3H7a2 2 0 00-2 2v14a2 2 0 002 2h10a2 2 0 002-2V8z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
    <path d="M14 3v5h5" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
  </svg>
);

const XGlyph = () => (
  <svg viewBox="0 0 24 24" width="14" height="14" fill="none" aria-hidden="true">
    <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
  </svg>
);

export interface MediaUploadProps {
  /** Current value — a data-URL or image src. When set, the preview is shown. */
  value?: string;
  /** File name shown in the preview chip. */
  fileName?: string;
  /** Called with the read data-URL and the file name when a valid file is chosen. */
  onChange: (dataUrl: string, fileName: string) => void;
  /** Called when the user removes the current file. */
  onClear: () => void;
  /** Accepted MIME types / extensions. @default "image/*" */
  accept?: string;
  /** Max file size in megabytes. @default 5 */
  maxSizeMb?: number;
  /** Render the error state (sets aria-invalid on the dropzone). @default false */
  invalid?: boolean;
  disabled?: boolean;
  /** Control id (e.g. from FormField) — applied to the operable button. */
  id?: string;
  /** Accepted from FormField wiring; not forwarded to the hidden input (avoids blocking submit). */
  required?: boolean;
  "aria-describedby"?: string;
  /** Prompt shown in the empty drop zone. */
  promptLabel?: string;
  /** Sub-hint under the prompt; defaults to a type/size summary. */
  hintLabel?: string;
  className?: string;
}

/**
 * MoSJE / SAMAVESH MediaUpload.
 *
 * Accessible image/file upload with drag-and-drop, preview, replace/remove, and
 * client-side type + size validation. Reads the file to a data-URL (no network).
 * Pair with `FormField` for a label/hint/error — spread its control props
 * (`id`, `invalid`, `aria-describedby`) onto this component.
 */
export const MediaUpload = React.forwardRef<HTMLButtonElement, MediaUploadProps>(
  function MediaUpload(
    {
      value,
      fileName,
      onChange,
      onClear,
      accept = "image/*",
      maxSizeMb = 5,
      invalid = false,
      disabled = false,
      id,
      required: _required,
      "aria-describedby": describedBy,
      promptLabel = "Click or drag an image to upload",
      hintLabel,
      className,
    },
    ref,
  ) {
    const inputRef = React.useRef<HTMLInputElement>(null);
    const [error, setError] = React.useState("");
    const [dragOver, setDragOver] = React.useState(false);

    const isImage = accept.includes("image");
    const hint = hintLabel ?? `${isImage ? "JPG or PNG" : "File"} · up to ${maxSizeMb} MB`;

    const openPicker = () => inputRef.current?.click();

    const handleFile = (file: File | undefined) => {
      if (!file) return;
      if (isImage && !file.type.startsWith("image/")) {
        setError("Please choose an image file (JPG or PNG).");
        return;
      }
      if (file.size > maxSizeMb * 1024 * 1024) {
        setError(`File must be ${maxSizeMb} MB or smaller.`);
        return;
      }
      setError("");
      const reader = new FileReader();
      reader.onload = () => onChange(String(reader.result), file.name);
      reader.readAsDataURL(file);
    };

    const handleClear = () => {
      setError("");
      if (inputRef.current) inputRef.current.value = "";
      onClear();
    };

    return (
      <div className={cn("ds-media-upload", className)}>
        {value ? (
          <div className="ds-media-upload__preview">
            {isImage ? (
              <img src={value} alt="Selected file preview" className="ds-media-upload__thumb" />
            ) : (
              <span className="ds-media-upload__thumb ds-media-upload__thumb--file" aria-hidden="true">
                <FileGlyph />
              </span>
            )}
            <div className="ds-media-upload__meta">
              <p className="ds-media-upload__name">{fileName || "Selected file"}</p>
              <p className="ds-media-upload__sub">File attached</p>
              <div className="ds-media-upload__actions">
                <button
                  ref={ref}
                  id={id}
                  type="button"
                  className="ds-media-upload__action"
                  onClick={openPicker}
                  disabled={disabled}
                  aria-describedby={describedBy}
                >
                  Replace
                </button>
                <button
                  type="button"
                  className="ds-media-upload__action ds-media-upload__action--danger"
                  onClick={handleClear}
                  disabled={disabled}
                >
                  <XGlyph /> Remove
                </button>
              </div>
            </div>
          </div>
        ) : (
          <button
            ref={ref}
            id={id}
            type="button"
            className={cn("ds-media-upload__dropzone", dragOver && "is-dragover")}
            onClick={openPicker}
            disabled={disabled}
            aria-invalid={invalid || undefined}
            aria-describedby={describedBy}
            onDragOver={(e) => {
              e.preventDefault();
              if (!disabled) setDragOver(true);
            }}
            onDragLeave={() => setDragOver(false)}
            onDrop={(e) => {
              e.preventDefault();
              setDragOver(false);
              if (!disabled) handleFile(e.dataTransfer.files?.[0]);
            }}
          >
            <span className="ds-media-upload__icon">
              <UploadGlyph />
            </span>
            <span className="ds-media-upload__prompt">{promptLabel}</span>
            <span className="ds-media-upload__hint">{hint}</span>
          </button>
        )}

        <input
          ref={inputRef}
          type="file"
          accept={accept}
          className="ds-media-upload__input"
          tabIndex={-1}
          aria-hidden="true"
          disabled={disabled}
          onChange={(e) => handleFile(e.target.files?.[0])}
        />

        {error && (
          <p className="ds-media-upload__error" role="alert">
            {error}
          </p>
        )}
      </div>
    );
  },
);
