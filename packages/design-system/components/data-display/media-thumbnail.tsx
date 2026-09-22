"use client";

import * as React from "react";
import { cn } from "../../utils/cn";
import { Icon } from "../utilities/icon";
import "./media-thumbnail.css";

export type MediaThumbnailSize = "sm" | "md" | "fill";
export type MediaThumbnailKind = "image" | "video";

export interface MediaThumbnailProps
  extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "children" | "type" | "aria-label"> {
  /**
   * REQUIRED. What pressing it does, naming what it opens — "View 3 training
   * photos", "View Camp at Bankura". This is the control's only name: the image
   * inside is decorative, because a thumbnail's alt text and its action are the
   * same sentence and a screen reader should hear it once.
   */
  label: string;
  /** The image, or a video's poster frame. Omit when there is nothing yet: the empty state renders instead, and it is not a button. */
  src?: string;
  /** A video draws a play glyph at all times; an image shows a zoom cue on hover and focus. @default "image" */
  kind?: MediaThumbnailKind;
  /** How many items this opens. Two or more draw a "+N" corner badge, N being the ones not shown. */
  count?: number;
  /**
   * `sm` 64 × 48 for a table cell, `md` 80 × 60 for a list row, `fill` to take
   * the whole of a card's media area — the card sets the shape. @default "sm"
   */
  size?: MediaThumbnailSize;
  /** The empty state's accessible name. @default "No media" */
  emptyLabel?: string;
  /** Opens the item — usually a `Lightbox` at this item's index. Not called for the empty tile, which is not a button. */
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
}

/**
 * A photo or video that opens when pressed — the trigger for a `Lightbox`.
 *
 * Until 2026-09-22 NMBA drew this five times by hand: a training photo in a
 * table, a Saptah attachment, a mass-pledge photo card, and the gallery's grid
 * and list views. Each carried its own focus ring, its own hover zoom and its own
 * count badge, and one hid its only affordance behind hover. This is that
 * control once.
 *
 * Three rules:
 *
 * 1. **It is a button, named for its action.** It opens something, so it is a
 *    `<button>` with `label` as its name, and the image inside it is decorative.
 *    Where the thumbnail leads to another PAGE it is the wrong component — use a
 *    link around a `Figure`.
 * 2. **Empty is drawn, not omitted.** With no `src` it renders a dashed tile
 *    carrying `emptyLabel` — a row with no photo should say so, not leave a hole
 *    the reader has to interpret. The empty tile is not focusable: there is
 *    nothing to open.
 * 3. **The count badge counts what is NOT shown.** Three photos draw "+2" on the
 *    first, because the first is already on screen.
 */
export const MediaThumbnail = React.forwardRef<HTMLButtonElement, MediaThumbnailProps>(
  function MediaThumbnail(
    { label, src, kind = "image", count, size = "sm", emptyLabel = "No media", className, ...rest },
    ref,
  ) {
    if (!src) {
      return (
        <span
          role="img"
          aria-label={emptyLabel}
          className={cn("ds-media-thumb", `ds-media-thumb--${size}`, "ds-media-thumb--empty", className)}
        >
          <Icon name="photo_camera" size={16} />
        </span>
      );
    }
    const more = count != null && count > 1 ? count - 1 : 0;
    return (
      // raw-button-ok(primitive): the thumbnail IS this component — a button whose face is an image
      <button
        ref={ref}
        type="button"
        aria-label={label}
        className={cn(
          "ds-media-thumb",
          `ds-media-thumb--${size}`,
          kind === "video" && "ds-media-thumb--video",
          className,
        )}
        {...rest}
      >
        {/* A plain <img>: sources are often data:/blob: URLs from an upload, which no image loader can optimise. */}
        <img className="ds-media-thumb__img" src={src} alt="" loading="lazy" decoding="async" />
        <span className="ds-media-thumb__cue" aria-hidden>
          {/* At fill size a video's play glyph sits on a solid disc: on a card it is the one
              signal that this picture moves, and a bare glyph on a busy frame is lost. */}
          <span className="ds-media-thumb__glyph">
            <Icon name={kind === "video" ? "play_arrow" : "zoom_in"} size={size === "fill" ? 24 : 16} fill={kind === "video"} />
          </span>
        </span>
        {more > 0 && (
          <span className="ds-media-thumb__count" aria-hidden>
            +{more}
          </span>
        )}
      </button>
    );
  },
);
