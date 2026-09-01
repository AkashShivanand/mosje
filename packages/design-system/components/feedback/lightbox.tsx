"use client";

import * as React from "react";
import { createPortal } from "react-dom";
import { cn } from "../../utils/cn";
import "./lightbox.css";

export type LightboxMediaType = "image" | "video";

export interface LightboxItem {
  /** What kind of media this is. */
  type: LightboxMediaType;
  /** Image src or video src (data-URL, path, or absolute URL). */
  src: string;
  /** Caption shown in the footer bar. */
  caption?: string;
  /** Poster frame for videos (and thumbnail fallback). */
  poster?: string;
  /** Alt text for images (defaults to the caption). */
  alt?: string;
}

export interface LightboxProps {
  /** Whether the lightbox is mounted/visible. */
  open: boolean;
  /** Ordered media to page through. */
  items: LightboxItem[];
  /** Starting item index (0-based). @default 0 */
  index?: number;
  /** Close handler (backdrop, ✕, or Escape). */
  onClose: () => void;
  /** Notified whenever the active item changes. */
  onIndexChange?: (index: number) => void;
  className?: string;
}

const IcClose = () => (
  <svg viewBox="0 0 24 24" width="22" height="22" fill="none" aria-hidden="true">
    <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
  </svg>
);

const IcPrev = () => (
  <svg viewBox="0 0 24 24" width="26" height="26" fill="none" aria-hidden="true">
    <path d="M15 5l-7 7 7 7" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const IcNext = () => (
  <svg viewBox="0 0 24 24" width="26" height="26" fill="none" aria-hidden="true">
    <path d="M9 5l7 7-7 7" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const IcPlay = () => (
  <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor" aria-hidden="true">
    <path d="M8 5v14l11-7z" />
  </svg>
);

/**
 * MoSJE / SAMAVESH Lightbox — full-screen viewer for a gallery of mixed
 * images and videos. Modelled on the UIkit lightbox pattern: grouped items,
 * prev/next slidenav, an item counter, a caption bar, and a thumbnail strip.
 *
 * - Keyboard: ← / → page, Esc closes, Tab cycles within the dialog, and focus
 *   returns to whatever opened it. The trap and the restore were added 2026-09-02;
 *   this line claimed both for months while neither was implemented, which with
 *   `aria-modal="true"` is worse than claiming neither.
 * - Videos render with native controls; images are object-fit contained.
 * - Renders through a portal so the table's `overflow-hidden` never clips it.
 *
 * Use for any "click a thumbnail → view the full gallery" flow across portals.
 */
export function Lightbox({
  open,
  items,
  index = 0,
  onClose,
  onIndexChange,
  className,
}: LightboxProps) {
  const [current, setCurrent] = React.useState(index);
  const stageRef = React.useRef<HTMLDivElement>(null);
  const titleId = React.useId();
  const count = items.length;

  // Re-sync to the requested start index each time the lightbox is (re)opened.
  React.useEffect(() => {
    if (open) setCurrent(Math.min(Math.max(index, 0), Math.max(count - 1, 0)));
  }, [open, index, count]);

  const go = React.useCallback(
    (next: number) => {
      if (count === 0) return;
      const wrapped = (next + count) % count;
      setCurrent(wrapped);
      onIndexChange?.(wrapped);
    },
    [count, onIndexChange],
  );

  const rootRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (!open) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    /*
     * FOCUS RESTORE. Remembered before focus moves into the dialog, because
     * after that `document.activeElement` is the stage. Without this a reader
     * who opens the viewer from the ninth thumbnail in a gallery is returned to
     * the top of the document when they close it, and has to find their place
     * again — which on a long page means they will not.
     */
    const opener = document.activeElement as HTMLElement | null;
    stageRef.current?.focus();

    /*
     * FOCUS TRAP. This component's own docstring claimed focus was trapped
     * while open, and it was not: `aria-modal="true"` told assistive technology
     * the rest of the page was inert while Tab walked straight out of the
     * dialog into it. The two together are worse than neither, because the
     * reader is told they cannot reach the page behind and then finds
     * themselves in it with no way back.
     */
    const focusables = () =>
      Array.from(
        rootRef.current?.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), input, select, textarea, [tabindex]:not([tabindex="-1"])',
        ) ?? [],
      ).filter((el) => el.offsetParent !== null || el === document.activeElement);

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
        return;
      }
      if (e.key === "ArrowRight") {
        go(current + 1);
        return;
      }
      if (e.key === "ArrowLeft") {
        go(current - 1);
        return;
      }
      if (e.key !== "Tab") return;

      const nodes = focusables();
      if (nodes.length === 0) {
        // Nothing to move to, so the only correct place for focus is the stage.
        e.preventDefault();
        stageRef.current?.focus();
        return;
      }
      const first = nodes[0]!;
      const last = nodes[nodes.length - 1]!;
      const activeEl = document.activeElement;

      // The stage is `tabIndex={-1}` and holds focus on open, so it is not in
      // `nodes` — a forward Tab from it must land on the first control rather
      // than escaping, which is what the naive first/last check would allow.
      if (!rootRef.current?.contains(activeEl) || activeEl === stageRef.current) {
        e.preventDefault();
        (e.shiftKey ? last : first).focus();
        return;
      }
      if (e.shiftKey && activeEl === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && activeEl === last) {
        e.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
      // Restore only if focus is still inside the dialog — if the consumer moved
      // it somewhere deliberate on close, stealing it back is the worse bug.
      if (!rootRef.current || rootRef.current.contains(document.activeElement)) {
        opener?.focus?.();
      }
    };
  }, [open, current, go, onClose]);

  const active = items[current];
  if (!open || count === 0 || !active || typeof document === "undefined") return null;

  const hasMany = count > 1;

  return createPortal(
    <div
      ref={rootRef}
      className={cn("ds-lightbox", className)}
      role="dialog"
      aria-modal="true"
      aria-labelledby={titleId}
    >
      <div className="ds-lightbox__backdrop" onClick={onClose} aria-hidden="true" />

      <div className="ds-lightbox__bar">
        {hasMany && (
          <span className="ds-lightbox__counter" aria-live="polite">
            {current + 1} <span className="ds-lightbox__counter-sep">/</span> {count}
          </span>
        )}
        <button type="button" className="ds-lightbox__close" aria-label="Close viewer" onClick={onClose}>
          <IcClose />
        </button>
      </div>

      {hasMany && (
        <button
          type="button"
          className="ds-lightbox__nav ds-lightbox__nav--prev"
          aria-label="Previous item"
          onClick={() => go(current - 1)}
        >
          <IcPrev />
        </button>
      )}

      <div className="ds-lightbox__stage" ref={stageRef} tabIndex={-1}>
        {active.type === "video" ? (
          <video
            key={active.src}
            className="ds-lightbox__media"
            src={active.src}
            poster={active.poster}
            controls
            autoPlay
            playsInline
          />
        ) : (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            key={active.src}
            className="ds-lightbox__media"
            src={active.src}
            alt={active.alt ?? active.caption ?? `Item ${current + 1}`}
          />
        )}
      </div>

      {hasMany && (
        <button
          type="button"
          className="ds-lightbox__nav ds-lightbox__nav--next"
          aria-label="Next item"
          onClick={() => go(current + 1)}
        >
          <IcNext />
        </button>
      )}

      <div className="ds-lightbox__footer">
        {active.caption && (
          <p id={titleId} className="ds-lightbox__caption">
            {active.caption}
          </p>
        )}

        {hasMany && (
          <div className="ds-lightbox__thumbs" role="tablist" aria-label="Gallery thumbnails">
            {items.map((item, i) => (
              <button
                key={`${item.src}-${i}`}
                type="button"
                role="tab"
                aria-selected={i === current}
                aria-label={`View item ${i + 1}${item.type === "video" ? " (video)" : ""}`}
                className={cn("ds-lightbox__thumb", i === current && "is-active")}
                onClick={() => go(i)}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={item.poster ?? item.src} alt="" className="ds-lightbox__thumb-img" />
                {item.type === "video" && (
                  <span className="ds-lightbox__thumb-badge" aria-hidden="true">
                    <IcPlay />
                  </span>
                )}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>,
    document.body,
  );
}
