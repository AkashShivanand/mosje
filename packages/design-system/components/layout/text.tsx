import * as React from "react";
import { cn } from "../../utils/cn";
import "./text.css";

/** The 21 type roles of the SAMAVESH scale, by tier. */
export type DisplayRole = "display-1" | "display-2" | "display-3" | "display-4" | "display-5" | "display-6";
export type HeadlineRole = "headline-1" | "headline-2" | "headline-3" | "headline-4" | "headline-5" | "headline-6";
export type TitleRole = "title-1" | "title-2" | "title-3";
export type BodyRole = "body-1" | "body-2" | "body-3";
export type LabelRole = "label-1" | "label-2" | "label-3";
export type TypeRole = DisplayRole | HeadlineRole | TitleRole | BodyRole | LabelRole;

/** Ink for a text run. `subtler` is deliberately absent — it is a placeholder ink, not a text one. */
export type TextTone = "base" | "subtle" | "inverse" | "brand" | "inherit";

export type HeadingLevel = 1 | 2 | 3 | 4 | 5 | 6;

/**
 * The element → role map. A heading's LEVEL is its place in the document outline and
 * never changes to make it bigger or smaller; its ROLE is the size, and defaults from
 * the level so a page that writes `<Heading level={2}>` gets the estate's section size
 * without naming it. Pass `variant` to depart from the default — a hero `<h1>` at
 * `display-3`, a card's `<h3>` at `title-1`.
 */
export const HEADING_DEFAULT_ROLE: Record<HeadingLevel, HeadlineRole> = {
  1: "headline-1",
  2: "headline-2",
  3: "headline-3",
  4: "headline-4",
  5: "headline-5",
  6: "headline-6",
};

export interface HeadingProps extends Omit<React.HTMLAttributes<HTMLHeadingElement>, "role"> {
  /** The heading ELEMENT (h1–h6) — the document outline, never a size. Required. */
  level: HeadingLevel;
  /** The type role. Defaults from `level` (h1 → headline-1 … h6 → headline-6). */
  variant?: DisplayRole | HeadlineRole | TitleRole;
  /** Ink. @default "base" */
  tone?: TextTone;
  /** Cap the line length at the measure (≈68 characters). */
  measure?: boolean;
  children: React.ReactNode;
}

/**
 * MoSJE / SAMAVESH Heading.
 *
 * A heading element bound to one type role. The level is semantic and required; the
 * role is visual and defaults from the level, so the common case is one prop. Every
 * role is fluid and surface-aware: the same `<Heading level={2}>` is 32px on the
 * website and 28px in a portal, from the tokens.
 *
 * For a SECTION heading with an eyebrow, a count pill and actions, use `SectionTitle`,
 * which composes this.
 */
export const Heading = React.forwardRef<HTMLHeadingElement, HeadingProps>(function Heading(
  { level, variant, tone = "base", measure, className, children, ...rest },
  ref,
) {
  const Tag = `h${level}` as const;
  const role = variant ?? HEADING_DEFAULT_ROLE[level];
  return (
    <Tag
      ref={ref}
      className={cn(
        "ds-type ds-heading",
        `ds-type--${role}`,
        tone !== "base" && `ds-type--tone-${tone}`,
        measure && "ds-type--measure",
        className,
      )}
      {...rest}
    >
      {children}
    </Tag>
  );
});

export type TextElement = "p" | "span" | "div" | "small" | "strong" | "em" | "li" | "dd" | "dt" | "figcaption" | "label" | "legend" | "caption" | "time";

export interface TextProps extends Omit<React.HTMLAttributes<HTMLElement>, "role"> {
  /** The element. @default "p" */
  as?: TextElement;
  /** The type role. @default "body-1" */
  variant?: BodyRole | LabelRole | TitleRole;
  /** Ink. @default "base" */
  tone?: TextTone;
  /** Cap the line length at the measure (≈68 characters). */
  measure?: boolean;
  /** Tabular numerals, for figures that line up in a column. */
  numeric?: boolean;
  /**
   * Paragraph rhythm: consecutive `flow` Text blocks are separated by the role's
   * paragraph-spacing token. Opt in, so a Text inside a flex or grid gap does not
   * double up.
   */
  flow?: boolean;
  /** Passed straight to the element. Set `"hi"` on every Devanagari run — it switches the face and the leading. */
  lang?: string;
  children?: React.ReactNode;
}

/**
 * MoSJE / SAMAVESH Text.
 *
 * A run of text bound to one type role — body for reading, label for controls and
 * captions, title for the name of a thing. Never sets a size, leading, tracking or
 * weight of its own: all four come from the role's tokens, so a Text is the same on
 * every surface and follows the scale when the scale changes.
 */
export const Text = React.forwardRef<HTMLElement, TextProps>(function Text(
  { as = "p", variant = "body-1", tone = "base", measure, numeric, flow, className, children, ...rest },
  ref,
) {
  const Tag = as as React.ElementType;
  return (
    <Tag
      ref={ref}
      className={cn(
        "ds-type ds-text",
        `ds-type--${variant}`,
        tone !== "base" && `ds-type--tone-${tone}`,
        measure && "ds-type--measure",
        numeric && "ds-type--numeric",
        flow && "ds-text--flow",
        className,
      )}
      {...rest}
    >
      {children}
    </Tag>
  );
});
