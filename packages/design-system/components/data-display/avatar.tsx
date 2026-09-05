import * as React from "react";
import { cn } from "../../utils/cn";
import "../feedback/feedback.css";

export type AvatarSize = 24 | 32 | 40 | 48;

/** Maps the numeric size to its `cmp/avatar/size/*` token name. */
const AVATAR_SIZE_TOKEN: Record<AvatarSize, string> = {
  24: "var(--sa-cmp-avatar-size-xs)",
  32: "var(--sa-cmp-avatar-size-sm)",
  40: "var(--sa-cmp-avatar-size-md)",
  48: "var(--sa-cmp-avatar-size-lg)",
};
export type AvatarShape = "circular" | "rounded";

export interface AvatarProps
  extends Omit<React.HTMLAttributes<HTMLSpanElement>, "children"> {
  /** Pixel size. @default 40 */
  size?: AvatarSize;
  /** Outline shape. @default "circular" */
  shape?: AvatarShape;
  /** Image source — takes priority when set. */
  src?: string;
  /** Image alt / accessible name. */
  alt?: string;
  /** Initials fallback (used when no `src`). */
  initials?: string;
  /** Icon fallback (used when no `src`/`initials`). */
  icon?: React.ReactNode;
}

const DEFAULT_ICON = (
  <svg viewBox="0 0 24 24" width="60%" height="60%" fill="none" aria-hidden="true">
    <path
      d="M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8Zm0 2c-3.6 0-8 1.8-8 5v1h16v-1c0-3.2-4.4-5-8-5Z"
      fill="currentColor"
    />
  </svg>
);

/**
 * MoSJE / UX4G Avatar atom.
 *
 * Renders, in priority order: image (`src`) → `initials` → `icon` → default
 * user glyph. Token surface bg + ink text for the fallback. Styled via
 * `.ds-avatar*` semantic classes.
 */
export const Avatar = React.forwardRef<HTMLSpanElement, AvatarProps>(
  function Avatar(
    {
      size = 40,
      shape = "circular",
      src,
      alt = "",
      initials,
      icon,
      className,
      style,
      ...rest
    },
    ref,
  ) {
    // Sizes bind the cmp/avatar/size tokens; the numeric prop stays the API and is the
    // fallback for a stylesheet that has not loaded the token sheet.
    const sizeVar = AVATAR_SIZE_TOKEN[size].replace(")", `, ${size}px)`);
    const sizeStyle: React.CSSProperties = {
      width: sizeVar,
      height: sizeVar,
      ...style,
    };

    let inner: React.ReactNode;
    if (src) {
      inner = <img className="ds-avatar__img" src={src} alt={alt} />;
    } else if (initials) {
      inner = (
        <span className="ds-avatar__initials" aria-hidden="true">
          {initials}
        </span>
      );
    } else if (icon != null) {
      inner = (
        <span className="ds-avatar__icon" aria-hidden="true">
          {icon}
        </span>
      );
    } else {
      inner = (
        <span className="ds-avatar__icon" aria-hidden="true">
          {DEFAULT_ICON}
        </span>
      );
    }

    return (
      <span
        ref={ref}
        className={cn("ds-avatar", `ds-avatar--${shape}`, className)}
        style={sizeStyle}
        role={src ? undefined : "img"}
        aria-label={src ? undefined : alt || initials || undefined}
        {...rest}
      >
        {inner}
      </span>
    );
  },
);
