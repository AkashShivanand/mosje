import * as React from "react";
import { cn } from "../../utils/cn";
import { Container, type ContainerSize } from "./container";
import "./layout.css";

/** Background tone the band paints edge to edge. */
export type BandTone = "default" | "muted" | "brand" | "inverse";
/** Vertical rhythm, from the section spacing scale. */
export type BandSpacing = "none" | "s" | "m" | "l";

export interface BandProps extends React.HTMLAttributes<HTMLElement> {
  /** @default "default" */
  tone?: BandTone;
  /** @default "m" — `section/m`, the standard gap between website sections. */
  spacing?: BandSpacing;
  /**
   * Cap for the inner Container. Pass `false` for a band whose content must
   * span the full viewport — a hero image or a map, not a text section.
   * @default "page"
   */
  container?: ContainerSize | false;
  /** Element to render. @default "section" */
  as?: "section" | "div" | "header" | "footer";
  children: React.ReactNode;
}

/**
 * Band — a full-bleed horizontal section.
 *
 * The website page is a stack of these: the tone paints edge to edge while the
 * Container inside holds the content column. Composition is always
 * Band → Container → content, which is what stops a tinted section from
 * stopping short of the viewport edge.
 *
 * Use it for website page sections. A portal page does not need it — portal
 * content is fluid inside the shell and has no bands.
 */
export function Band({
  tone = "default",
  spacing = "m",
  container = "page",
  as: Tag = "section",
  className,
  children,
  ...rest
}: BandProps): React.JSX.Element {
  return (
    <Tag className={cn("sa-band", `sa-band--${tone}`, `sa-band--${spacing}`, className)} {...rest}>
      {container === false ? children : <Container size={container}>{children}</Container>}
    </Tag>
  );
}
