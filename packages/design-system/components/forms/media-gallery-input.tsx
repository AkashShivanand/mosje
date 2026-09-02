"use client";

import * as React from "react";
import { cn } from "../../utils/cn";
import "./media-gallery-input.css";

export type GalleryMediaType = "image" | "video";

export interface GalleryMediaItem {
  /** Data-URL (no network) for newly added files, or a path/URL for seeded items. */
  url: string;
  type: GalleryMediaType;
  /** Original file name — surfaced as the caption/alt downstream. */
  name: string;
  /** Poster frame for videos (data-URL), captured on add. */
  poster?: string;
}

export interface MediaGalleryInputProps {
  /** Current gallery items (controlled). */
  value: GalleryMediaItem[];
  /** Called with the next gallery array on add/remove. */
  onChange: (items: GalleryMediaItem[]) => void;
  /** Accepted types. @default "image/*,video/*" */
  accept?: string;
  /** Maximum number of items. @default 12 */
  maxItems?: number;
  /** Max size per file in MB. @default 25 */
  maxSizeMb?: number;
  invalid?: boolean;
  disabled?: boolean;
  /** Control id (from FormField) — applied to the add tile. */
  id?: string;
  /** Accepted from FormField wiring; not forwarded. */
  required?: boolean;
  "aria-describedby"?: string;
  className?: string;
}

const UploadGlyph = () => (
  <svg viewBox="0 0 24 24" width="22" height="22" fill="none" aria-hidden="true">
    <path d="M12 16V4m0 0L7 9m5-5l5 5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const PlayGlyph = () => (
  <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor" aria-hidden="true">
    <path d="M8 5v14l11-7z" />
  </svg>
);

const XGlyph = () => (
  <svg viewBox="0 0 24 24" width="14" height="14" fill="none" aria-hidden="true">
    <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
  </svg>
);

const FilmGlyph = () => (
  <svg viewBox="0 0 24 24" width="26" height="26" fill="none" aria-hidden="true">
    <rect x="3" y="4" width="18" height="16" rx="2" stroke="currentColor" strokeWidth="1.6" />
    <path d="M7 4v16M17 4v16M3 9h4M3 15h4M17 9h4M17 15h4" stroke="currentColor" strokeWidth="1.6" />
  </svg>
);

const readAsDataUrl = (file: File) =>
  new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });

/** Grab a poster frame from a video data-URL so thumbnails aren't blank. */
const captureVideoPoster = (dataUrl: string) =>
  new Promise<string | undefined>((resolve) => {
    const video = document.createElement("video");
    video.preload = "metadata";
    video.muted = true;
    video.src = dataUrl;
    const done = (poster?: string) => resolve(poster);
    video.onloadeddata = () => {
      video.currentTime = Math.min(0.1, video.duration || 0.1);
    };
    video.onseeked = () => {
      try {
        const canvas = document.createElement("canvas");
        canvas.width = video.videoWidth || 320;
        canvas.height = video.videoHeight || 240;
        const ctx = canvas.getContext("2d");
        if (!ctx) return done();
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        done(canvas.toDataURL("image/jpeg", 0.7));
      } catch {
        done();
      }
    };
    video.onerror = () => done();
  });

/**
 * MoSJE / SAMAVESH MediaGalleryInput.
 *
 * Multi-file image **and** video uploader with a thumbnail grid, per-item
 * remove, video play badges, an item counter, and client-side type/size
 * validation. Reads each file to a data-URL (no network) and auto-captures a
 * poster frame for videos. Pair with `FormField` for label/hint/error.
 *
 * Use whenever a record can hold several photos/clips (event galleries,
 * inspection evidence, etc.). For a single image use `MediaUpload`.
 */
export function MediaGalleryInput({
  value,
  onChange,
  accept = "image/*,video/*",
  maxItems = 12,
  maxSizeMb = 25,
  invalid = false,
  disabled = false,
  id,
  required: _required,
  "aria-describedby": describedBy,
  className,
}: MediaGalleryInputProps) {
  const inputRef = React.useRef<HTMLInputElement>(null);
  const [error, setError] = React.useState("");
  const [dragOver, setDragOver] = React.useState(false);
  const [busy, setBusy] = React.useState(false);

  const atCapacity = value.length >= maxItems;

  const openPicker = () => inputRef.current?.click();

  const addFiles = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    const incoming = Array.from(files);
    const room = maxItems - value.length;
    if (room <= 0) {
      setError(`You can attach up to ${maxItems} files.`);
      return;
    }

    setError("");
    setBusy(true);
    const next: GalleryMediaItem[] = [];
    let rejected = "";

    for (const file of incoming.slice(0, room)) {
      const isImage = file.type.startsWith("image/");
      const isVideo = file.type.startsWith("video/");
      if (!isImage && !isVideo) {
        rejected = "Only images and videos are allowed.";
        continue;
      }
      if (file.size > maxSizeMb * 1024 * 1024) {
        rejected = `Each file must be ${maxSizeMb} MB or smaller.`;
        continue;
      }
      const url = await readAsDataUrl(file);
      const type: GalleryMediaType = isVideo ? "video" : "image";
      const poster = isVideo ? await captureVideoPoster(url) : undefined;
      next.push({ url, type, name: file.name, poster });
    }

    if (incoming.length > room) {
      rejected = `Only the first ${room} file${room === 1 ? "" : "s"} were added (max ${maxItems}).`;
    }
    if (rejected) setError(rejected);
    if (next.length) onChange([...value, ...next]);
    setBusy(false);
    if (inputRef.current) inputRef.current.value = "";
  };

  const removeAt = (index: number) => {
    setError("");
    onChange(value.filter((_, i) => i !== index));
  };

  // Shared drag-and-drop handlers for both the empty drop-zone and the add tile.
  const dnd = {
    onDragOver: (e: React.DragEvent) => {
      e.preventDefault();
      if (!disabled) setDragOver(true);
    },
    onDragLeave: () => setDragOver(false),
    onDrop: (e: React.DragEvent) => {
      e.preventDefault();
      setDragOver(false);
      if (!disabled) void addFiles(e.dataTransfer.files);
    },
  };

  const isEmpty = value.length === 0;

  return (
    <div className={cn("ds-gallery", className)}>
      {isEmpty ? (
        /* ---- Empty: full-width drop-zone (unified with MediaUpload) ---- */
        <button
          id={id}
          type="button"
          className={cn("ds-gallery__dropzone", dragOver && "is-dragover")}
          onClick={openPicker}
          disabled={disabled || busy}
          aria-invalid={invalid || undefined}
          aria-describedby={describedBy}
          {...dnd}
        >
          <span className="ds-gallery__dropzone-icon">
            <UploadGlyph />
          </span>
          <span className="ds-gallery__dropzone-prompt">
            {busy ? "Adding…" : "Click or drag images & videos to upload"}
          </span>
          <span className="ds-gallery__dropzone-hint">
            Images &amp; videos · up to {maxSizeMb} MB each · up to {maxItems} files
          </span>
        </button>
      ) : (
        /* ---- Filled: thumbnail grid + add tile ---- */
        <>
          <div className="ds-gallery__grid" aria-invalid={invalid || undefined}>
            {value.map((item, i) => {
              const showPoster = item.type === "image" || !!item.poster;
              return (
                <figure key={`${item.name}-${i}`} className="ds-gallery__item">
                  {showPoster ? (
                    <img
                      src={item.type === "video" ? item.poster : item.url}
                      alt={item.name}
                      className="ds-gallery__thumb"
                    />
                  ) : (
                    <span className="ds-gallery__thumb ds-gallery__thumb--video" aria-hidden="true">
                      <FilmGlyph />
                    </span>
                  )}
                  {item.type === "video" && (
                    <span className="ds-gallery__play" aria-hidden="true">
                      <PlayGlyph />
                    </span>
                  )}
                  <button
                    type="button"
                    className="ds-gallery__remove"
                    aria-label={`Remove ${item.name}`}
                    onClick={() => removeAt(i)}
                    disabled={disabled}
                  >
                    <XGlyph />
                  </button>
                  <figcaption className="ds-gallery__name">{item.name}</figcaption>
                </figure>
              );
            })}

            {!atCapacity && (
              <button
                id={id}
                type="button"
                className={cn("ds-gallery__add", dragOver && "is-dragover")}
                onClick={openPicker}
                disabled={disabled || busy}
                aria-describedby={describedBy}
                {...dnd}
              >
                <span className="ds-gallery__add-icon">
                  <UploadGlyph />
                </span>
                <span className="ds-gallery__add-label">{busy ? "Adding…" : "Add more"}</span>
              </button>
            )}
          </div>

          <div className="ds-gallery__foot">
            <span className="ds-gallery__hint">
              {atCapacity
                ? `Maximum ${maxItems} files reached — remove one to add another.`
                : `Images & videos · up to ${maxSizeMb} MB each`}
            </span>
            <span className="ds-gallery__count">
              {value.length} / {maxItems}
            </span>
          </div>
        </>
      )}

      <input
        ref={inputRef}
        type="file"
        accept={accept}
        multiple
        className="ds-gallery__input"
        tabIndex={-1}
        aria-hidden="true"
        disabled={disabled}
        onChange={(e) => void addFiles(e.target.files)}
      />

      {error && (
        <p className="ds-gallery__error" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
