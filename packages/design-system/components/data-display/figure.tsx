import * as React from "react";
import { cn } from "../../utils/cn";
import "./figure.css";

/** The shapes a figure may be locked to. `auto` lets the image set its own. */
export type FigureRatio = "auto" | "square" | "video" | "photo" | "portrait";

export interface FigureProps
  extends Omit<React.HTMLAttributes<HTMLElement>, "children"> {
  /**
   * The image itself. Pass a `next/image` element from the app, or a plain
   * `<img>` — this component does not import an image library, so it stays
   * usable in Storybook, in the docs site and in a portal alike.
   */
  children: React.ReactNode;
  /**
   * The visible caption. It is a real `<figcaption>`, so assistive technology
   * associates it with the image rather than reading it as the next paragraph.
   */
  caption?: React.ReactNode;
  /**
   * Where the picture came from — a directorate, a photographer, a scheme
   * report. Rendered under the caption in small print.
   *
   * A departmental photograph with no attribution is a photograph nobody can
   * check, and on a government page the source is part of the content.
   */
  credit?: React.ReactNode;
  /**
   * Lock the frame to a ratio and crop the image to fill it. `auto` (default)
   * lets the image set its own height, which is right for a diagram or a
   * screenshot where cropping would remove information.
   * @default "auto"
   */
  ratio?: FigureRatio;
  /** Round the frame and draw a hairline around it. @default true */
  bordered?: boolean;
  /**
   * How the image sits inside a locked ratio. `cover` crops to fill —
   * correct for a photograph. `contain` fits the whole image and leaves
   * ground around it — correct for a logo, a certificate or a scanned
   * document, where a crop would remove the thing being shown.
   * @default "cover"
   */
  fit?: "cover" | "contain";
}

/**
 * MoSJE / SAMAVESH Figure.
 *
 * An image with its caption, as one thing.
 *
 * **The point is the `<figure>`/`<figcaption>` pairing.** A caption placed in a
 * sibling `<p>` is read as the next paragraph, so a screen-reader user meets a
 * sentence with no idea it describes the picture they have just passed. The
 * markup here makes the association, which costs nothing visually.
 *
 * **This component does not supply alt text and cannot.** The alternative text
 * belongs on the image element the caller passes, because only the caller knows
 * what the picture is doing on the page — the same photograph is decorative
 * beside a heading and load-bearing on an evidence screen. What this does is
 * make the omission visible: an image with no `alt` renders here exactly as
 * badly as it does anywhere else, and the estate's accessibility audit will find
 * it.
 *
 * A caption is not a substitute for alt text either. The caption is read by
 * everyone; the alt text is what stands in for the picture when it cannot be
 * seen. Where they would say the same thing, the image is decorative and its
 * `alt` should be empty.
 */
export function Figure({
  children,
  caption,
  credit,
  ratio = "auto",
  bordered = true,
  fit = "cover",
  className,
  ...rest
}: FigureProps): React.JSX.Element {
  return (
    <figure
      className={cn(
        "ds-figure",
        `ds-figure--${ratio}`,
        `ds-figure--fit-${fit}`,
        bordered && "ds-figure--bordered",
        className,
      )}
      {...rest}
    >
      <div className="ds-figure__frame">{children}</div>
      {caption || credit ? (
        <figcaption className="ds-figure__caption">
          {caption ? <span className="ds-figure__captionText">{caption}</span> : null}
          {credit ? <span className="ds-figure__credit">{credit}</span> : null}
        </figcaption>
      ) : null}
    </figure>
  );
}
