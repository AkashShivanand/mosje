import * as React from "react";
import { cn } from "../../utils/cn";
import { Icon } from "../utilities/icon";
import "./link.css";

/**
 * `inline` sits inside a sentence; `standalone` sits on its own — a card's "Read more",
 * a list of downloads, a call to action under a heading.
 *
 * THE DIFFERENCE IS NOT DECORATIVE. An `inline` link is ALWAYS underlined and cannot be
 * talked out of it: WCAG 2.2 §1.4.1 (Use of Color) says a link inside a block of text
 * must not be distinguished from the surrounding text by colour alone, and colour is the
 * only other thing a text link has. `standalone` underlines on hover and focus instead,
 * which is permitted precisely because it is NOT inside a block of text — and the moment
 * it is, it is the wrong variant.
 */
export type LinkVariant = "inline" | "standalone";
export type LinkSize = "sm" | "md" | "lg";
/** The ground the link sits on. `inverse` is for a solid brand surface. */
export type LinkTone = "default" | "inverse";

export interface LinkProps
  extends Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, "href"> {
  /** Where it goes. Omitted or `disabled` renders an inert anchor. */
  href?: string;
  /** @default "inline" */
  variant?: LinkVariant;
  /** @default "md" */
  size?: LinkSize;
  /** @default "default" */
  tone?: LinkTone;
  /**
   * The link leaves this site, so it opens in a new tab.
   *
   * Sets `target="_blank"`, adds `rel="noopener noreferrer"`, draws a trailing
   * open-in-new glyph, AND appends a visually hidden "(opens in a new tab)" to the
   * accessible name. GIGW 3.0 requires telling the reader when a link opens a new
   * window; the glyph tells the people who can see it and the hidden text tells the
   * people who cannot. One without the other serves half the audience.
   */
  external?: boolean;
  /** Glyph before the label. Decorative — the label names the destination. */
  iconLeft?: React.ReactNode;
  /** Glyph after the label. Suppressed when `external` draws its own. */
  iconRight?: React.ReactNode;
  /**
   * Inert, and genuinely so: `href` is dropped, so the browser's own rules make it
   * unfocusable and unactivatable. `aria-disabled` carries the state, since an anchor
   * has no native `disabled` to read. Same mechanism the Button's link form uses.
   */
  disabled?: boolean;
  /** Download rather than navigate. Adds a trailing download glyph. */
  download?: string | boolean;
}

/**
 * Link — text that takes the reader somewhere.
 *
 * A link changes location; a button performs an action. Getting that distinction right is
 * the single most consequential accessibility decision for an interactive element, and it
 * is why this exists as its own component rather than as a Button appearance: 194
 * hand-rolled brand-coloured anchors were counted across the hub before it, each deciding
 * its own colour, underline, focus ring and new-tab handling. Twenty-nine of the fifty-
 * eight `target="_blank"` call sites carried no `rel`.
 */
export const Link = React.forwardRef<HTMLAnchorElement, LinkProps>(function Link(
  {
    href,
    variant = "inline",
    size = "md",
    tone = "default",
    external = false,
    iconLeft,
    iconRight,
    disabled = false,
    download,
    className,
    children,
    target,
    rel,
    ...rest
  },
  ref,
) {
  const classes = cn(
    "ds-link",
    `ds-link--${variant}`,
    `ds-link--${size}`,
    tone === "inverse" && "ds-link--inverse",
    className,
  );

  // An explicit value from the caller always wins — someone who wrote `rel="opener"`
  // meant it, and silently overriding a security-relevant attribute is worse than the
  // default it replaces.
  const resolvedTarget = target ?? (external ? "_blank" : undefined);
  const resolvedRel = rel ?? (resolvedTarget === "_blank" ? "noopener noreferrer" : undefined);

  const trailing = external ? (
    <Icon name="open_in_new" size={16} aria-hidden />
  ) : download != null && download !== false ? (
    <Icon name="download" size={16} aria-hidden />
  ) : (
    iconRight
  );

  const content = (
    <>
      {iconLeft != null && (
        <span className="ds-link__icon" aria-hidden="true">
          {iconLeft}
        </span>
      )}
      <span className="ds-link__label">{children}</span>
      {trailing != null && (
        <span className="ds-link__icon" aria-hidden="true">
          {trailing}
        </span>
      )}
      {/*
        Part of the ACCESSIBLE NAME, not an aside. It sits inside the anchor so a screen
        reader reads "Annual report (opens in a new tab)" as one name; outside it, the
        warning would be a separate node the reader may never reach.
      */}
      {external && <span className="ds-sr-only"> (opens in a new tab)</span>}
    </>
  );

  return (
    <a
      ref={ref}
      className={classes}
      {...rest}
      {...(download != null ? { download: download as string | undefined } : {})}
      {...(disabled
        ? { role: "link" as const, "aria-disabled": "true" as const }
        : {
            href,
            ...(resolvedTarget != null ? { target: resolvedTarget } : {}),
            ...(resolvedRel != null ? { rel: resolvedRel } : {}),
          })}
    >
      {content}
    </a>
  );
});
