"use client";

import * as React from "react";
import { cn } from "../../utils/cn";
import {
  downscaleImage,
  formatCoordinates,
  readDeviceLocation,
  readExifGps,
} from "../../utils/geo-image";
import "./geo-photo-input.css";

/** Where a photo's coordinates came from. */
export type GeoPhotoSource = "EXIF" | "DEVICE" | "UNAVAILABLE";

/** A single geo-tagged evidence photo, ready to persist. */
export interface GeoPhoto {
  id: string;
  /** ~320px longest edge — used in tables, galleries and counters. */
  thumbDataUrl: string;
  /** ~1600px longest edge — used in the lightbox. */
  viewDataUrl: string;
  originalName: string;
  originalBytes: number;
  mime: string;
  lat: number | null;
  lng: number | null;
  accuracyM: number | null;
  source: GeoPhotoSource;
  /** ISO timestamp of when the photo was attached. */
  capturedAt: string;
}

export interface GeoPhotoInputProps {
  /** Current photos (controlled). */
  value: GeoPhoto[];
  /** Called with the next photo array on add/remove. */
  onChange: (photos: GeoPhoto[]) => void;
  /** Maximum photos. @default 4 */
  maxItems?: number;
  /** Minimum photos, surfaced in the hint text only. @default 1 */
  minItems?: number;
  /** Max size per original file, in MB. @default 10 */
  maxSizeMb?: number;
  /** Longest edge of the persisted view copy. @default 1600 */
  viewMaxEdge?: number;
  /** Longest edge of the persisted thumbnail. @default 320 */
  thumbMaxEdge?: number;
  /** JPEG quality for both derived copies. @default 0.72 */
  quality?: number;
  invalid?: boolean;
  disabled?: boolean;
  /** Control id (from FormField) — applied to the add control. */
  id?: string;
  /** Accepted from FormField wiring; not forwarded to the DOM. */
  required?: boolean;
  "aria-describedby"?: string;
  className?: string;
}

const ACCEPTED_MIME = ["image/jpeg", "image/png"];
const ACCEPT_ATTR = ACCEPTED_MIME.join(",");

const CameraGlyph = () => (
  <svg viewBox="0 0 24 24" width="22" height="22" fill="none" aria-hidden="true">
    <path
      d="M3 8.5A1.5 1.5 0 014.5 7h2.2l1.1-1.8A1 1 0 018.7 4.7h6.6a1 1 0 01.9.5L17.3 7h2.2A1.5 1.5 0 0121 8.5v9A1.5 1.5 0 0119.5 19h-15A1.5 1.5 0 013 17.5v-9z"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinejoin="round"
    />
    <circle cx="12" cy="12.8" r="3.4" stroke="currentColor" strokeWidth="1.7" />
  </svg>
);

const PinGlyph = () => (
  <svg viewBox="0 0 24 24" width="13" height="13" fill="none" aria-hidden="true">
    <path
      d="M12 21s7-5.6 7-11a7 7 0 10-14 0c0 5.4 7 11 7 11z"
      stroke="currentColor"
      strokeWidth="1.9"
      strokeLinejoin="round"
    />
    <circle cx="12" cy="10" r="2.4" stroke="currentColor" strokeWidth="1.9" />
  </svg>
);

const PinOffGlyph = () => (
  <svg viewBox="0 0 24 24" width="13" height="13" fill="none" aria-hidden="true">
    <path
      d="M12 21s7-5.6 7-11a7 7 0 00-11.6-5.3M5.4 7.6A7 7 0 005 10c0 5.4 7 11 7 11z"
      stroke="currentColor"
      strokeWidth="1.9"
      strokeLinejoin="round"
    />
    <path d="M4 4l16 16" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" />
  </svg>
);

const XGlyph = () => (
  <svg viewBox="0 0 24 24" width="14" height="14" fill="none" aria-hidden="true">
    <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
  </svg>
);

const formatMb = (bytes: number) => `${(bytes / (1024 * 1024)).toFixed(1)} MB`;

const newId = () =>
  typeof crypto !== "undefined" && typeof crypto.randomUUID === "function"
    ? crypto.randomUUID()
    : `photo-${Date.now()}-${Math.round(Math.random() * 1e9)}`;

/**
 * MoSJE / SAMAVESH GeoPhotoInput.
 *
 * Evidence-photo uploader that records **where** each photo was taken, for
 * field reporting where the location is part of the record.
 *
 * Coordinates are resolved per photo: the image's own EXIF GPS tag when it
 * survives, otherwise the device's location at the moment of upload. Photos
 * that yield neither are still accepted and marked `UNAVAILABLE`, because
 * forwarded photos routinely lose EXIF and blocking on it would strand
 * legitimate reporters. The caller decides what an unlocated photo means.
 *
 * Every accepted file is re-encoded into a ~1600px view copy and a ~320px
 * thumbnail; originals are never retained, so a submission stays a few hundred
 * KB rather than tens of MB. Pair with `FormField` for label/hint/error.
 */
export function GeoPhotoInput({
  value,
  onChange,
  maxItems = 4,
  minItems = 1,
  maxSizeMb = 10,
  viewMaxEdge = 1600,
  thumbMaxEdge = 320,
  quality = 0.72,
  invalid = false,
  disabled = false,
  id,
  required: _required,
  "aria-describedby": describedBy,
  className,
}: GeoPhotoInputProps): React.JSX.Element {
  const rootRef = React.useRef<HTMLDivElement>(null);
  const inputRef = React.useRef<HTMLInputElement>(null);
  const [error, setError] = React.useState("");
  const [status, setStatus] = React.useState("");
  const [dragOver, setDragOver] = React.useState(false);
  const [busy, setBusy] = React.useState(false);

  // Ask the browser for location at most once per mount. `null` means we asked
  // and were refused (or timed out); re-prompting per file would be hostile.
  const deviceLocationRef = React.useRef<{
    resolved: boolean;
    value: { lat: number; lng: number; accuracyM: number } | null;
  }>({ resolved: false, value: null });

  const getDeviceLocation = React.useCallback(async () => {
    if (!deviceLocationRef.current.resolved) {
      deviceLocationRef.current = {
        resolved: true,
        value: await readDeviceLocation(),
      };
    }
    return deviceLocationRef.current.value;
  }, []);

  const atCapacity = value.length >= maxItems;

  const addFiles = async (files: FileList | null) => {
    if (!files || files.length === 0 || disabled) return;

    const incoming = Array.from(files);
    const room = maxItems - value.length;
    if (room <= 0) {
      setError(`You can attach up to ${maxItems} photos.`);
      return;
    }

    setError("");
    setBusy(true);

    const accepted: GeoPhoto[] = [];
    const rejections: string[] = [];

    for (const file of incoming.slice(0, room)) {
      // Check the real MIME type, not the filename — a renamed .heic is still
      // a HEIC and will not decode.
      if (!ACCEPTED_MIME.includes(file.type)) {
        rejections.push(`${file.name} is not a JPEG or PNG.`);
        continue;
      }
      if (file.size > maxSizeMb * 1024 * 1024) {
        rejections.push(
          `${file.name} is ${formatMb(file.size)}. Each photo must be ${maxSizeMb} MB or smaller.`,
        );
        continue;
      }

      setStatus(`Reading ${file.name}…`);

      let lat: number | null = null;
      let lng: number | null = null;
      let accuracyM: number | null = null;
      let source: GeoPhotoSource = "UNAVAILABLE";

      const exif = await readExifGps(file);
      if (exif) {
        lat = exif.lat;
        lng = exif.lng;
        source = "EXIF";
      } else {
        const device = await getDeviceLocation();
        if (device) {
          lat = device.lat;
          lng = device.lng;
          accuracyM = device.accuracyM;
          source = "DEVICE";
        }
      }

      try {
        const [view, thumb] = await Promise.all([
          downscaleImage(file, viewMaxEdge, quality),
          downscaleImage(file, thumbMaxEdge, quality),
        ]);
        accepted.push({
          id: newId(),
          thumbDataUrl: thumb.dataUrl,
          viewDataUrl: view.dataUrl,
          originalName: file.name,
          originalBytes: file.size,
          mime: file.type,
          lat,
          lng,
          accuracyM,
          source,
          capturedAt: new Date().toISOString(),
        });
      } catch {
        rejections.push(`${file.name} could not be read as an image.`);
      }
    }

    if (incoming.length > room) {
      rejections.push(`Only ${room} more photo${room === 1 ? "" : "s"} could be added (max ${maxItems}).`);
    }

    setStatus("");
    setBusy(false);
    if (rejections.length > 0) setError(rejections.join(" "));
    if (accepted.length > 0) onChange([...value, ...accepted]);
    if (inputRef.current) inputRef.current.value = "";
  };

  const removeAt = (id: string, index: number) => {
    setError("");
    onChange(value.filter((photo) => photo.id !== id));
    // Removing the button that has focus would drop the user to <body>. Move
    // focus deliberately: the next photo's remove button, or the add control.
    window.requestAnimationFrame(() => {
      const root = rootRef.current;
      if (!root) return;
      const removers = root.querySelectorAll<HTMLElement>("[data-geophoto-remove]");
      const next = removers[Math.min(index, removers.length - 1)];
      (next ?? root.querySelector<HTMLElement>("[data-geophoto-add]"))?.focus();
    });
  };

  const dnd = {
    onDragOver: (e: React.DragEvent) => {
      e.preventDefault();
      if (!disabled) setDragOver(true);
    },
    onDragLeave: () => setDragOver(false),
    onDrop: (e: React.DragEvent) => {
      e.preventDefault();
      setDragOver(false);
      void addFiles(e.dataTransfer.files);
    },
  };

  const unlocatedCount = value.filter((p) => p.source === "UNAVAILABLE").length;

  return (
    <div
      ref={rootRef}
      className={cn("ds-geophoto", invalid && "is-invalid", className)}
      // The dropzone below only exists while the gallery is empty. Binding the
      // group here keeps FormField's label, hint and error associated with the
      // control once photos are attached, and covers the at-capacity case where
      // no button is rendered at all.
      role="group"
      /* NO `aria-invalid` HERE. It is only defined for form controls that hold a
         value; on a `button` dropzone, a `group`, or a bare div it is ignored by
         assistive technology and reported as unsupported. The error itself already
         reaches the reader through `aria-describedby`, which is what actually gets
         announced, and the visual state comes from the `invalid` class. */
      aria-describedby={describedBy}
    >
      <input
        ref={inputRef}
        type="file"
        className="ds-geophoto__input"
        accept={ACCEPT_ATTR}
        multiple
        disabled={disabled || atCapacity}
        onChange={(e) => void addFiles(e.target.files)}
        tabIndex={-1}
        aria-hidden="true"
      />

      {value.length === 0 ? (
        <button
          id={id}
          type="button"
          className={cn("ds-geophoto__dropzone", dragOver && "is-dragover")}
          onClick={() => inputRef.current?.click()}
          disabled={disabled || busy}
          {...dnd}
        >
          <span className="ds-geophoto__dropzone-icon">
            <CameraGlyph />
          </span>
          <span className="ds-geophoto__dropzone-prompt">
            {busy ? "Adding…" : "Click or drag photos of the event"}
          </span>
          <span className="ds-geophoto__dropzone-hint">
            JPEG or PNG · {minItems}–{maxItems} photos · up to {maxSizeMb} MB each · location is
            recorded with each photo
          </span>
        </button>
      ) : (
        <>
          <ul className="ds-geophoto__grid">
            {value.map((photo, index) => {
              const located = photo.lat !== null && photo.lng !== null;
              return (
                <li key={photo.id} className="ds-geophoto__item">
                  <img src={photo.thumbDataUrl} alt={photo.originalName} className="ds-geophoto__thumb" />
                  <span
                    className={cn(
                      "ds-geophoto__chip",
                      located ? "ds-geophoto__chip--located" : "ds-geophoto__chip--missing",
                    )}
                  >
                    {located ? <PinGlyph /> : <PinOffGlyph />}
                    <span className="ds-geophoto__chip-text">
                      {located ? formatCoordinates(photo.lat!, photo.lng!) : "No location"}
                    </span>
                  </span>
                  {!disabled && (
                    <button
                      type="button"
                      data-geophoto-remove=""
                      className="ds-geophoto__remove"
                      onClick={() => removeAt(photo.id, index)}
                      aria-label={`Remove ${photo.originalName}`}
                    >
                      <XGlyph />
                    </button>
                  )}
                </li>
              );
            })}

            {!atCapacity && !disabled && (
              <li className="ds-geophoto__item ds-geophoto__item--add">
                <button
                  type="button"
                  id={id}
                  data-geophoto-add=""
                  className={cn("ds-geophoto__add", dragOver && "is-dragover")}
                  onClick={() => inputRef.current?.click()}
                  disabled={busy}
                  {...dnd}
                >
                  <CameraGlyph />
                  <span>{busy ? "Adding…" : "Add photo"}</span>
                </button>
              </li>
            )}
          </ul>

          <p className="ds-geophoto__count">
            {value.length} of {maxItems} photos attached
          </p>
        </>
      )}

      {/* Announce progress without stealing focus. */}
      <span className="ds-geophoto__sr" role="status" aria-live="polite">
        {status}
      </span>

      {unlocatedCount > 0 && (
        <p className="ds-geophoto__warning">
          {unlocatedCount === 1 ? "1 photo has" : `${unlocatedCount} photos have`} no location. This
          is common when photos are forwarded through messaging apps. You can still submit, and the
          approving officer will see the missing location.
        </p>
      )}

      {error && (
        <p className="ds-geophoto__error" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
