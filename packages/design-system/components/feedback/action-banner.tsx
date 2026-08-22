import * as React from "react";
import { cn } from "../../utils/cn";
import "./action-banner.css";

export type ActionBannerVariant = "banner" | "card";

export interface ActionBannerProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "title"> {
  title: React.ReactNode;
  description?: React.ReactNode;
  /** The call to action. One control — see the note on the component. */
  action: React.ReactNode;
  /**
   * `banner` (default) — full width, text left, action right. One per section.
   * `card` — the same content in a column for a grid of several, action pinned
   * to the bottom so a row of cards lines its buttons up.
   */
  variant?: ActionBannerVariant;
  /**
   * Heading level for the title. The default `h3` suits a banner inside a
   * section that already has an `h2`; raise or lower it so the page's outline
   * does not skip a level.
   * @default "h3"
   */
  as?: "h2" | "h3" | "h4";
}

/**
 * ActionBanner — a call to action: a title, an optional sentence, one control.
 *
 * TWO VARIANTS, ONE CONTENT MODEL. `banner` is the full-width strip that ends
 * a page section; `card` is the same thing in a column, for a grid of two or
 * three parallel offers. They are variants rather than separate components
 * because the content is identical and only the axis changes — a second
 * component would be a second thing to keep in step, and the first symptom of
 * that is two CTAs on one estate with different padding.
 *
 * **The `card` variant stretches and pins its action to the bottom.** In a grid
 * that means every card is the same height and every button sits on one line,
 * whatever length the descriptions run to. It is the single rule that makes a
 * card grid look composed rather than assembled.
 *
 * COLOUR resolves through `--sa-color-primaryScale-*`, so the panel follows
 * `data-brand` across all eight modes. See the contract in `action-banner.css`
 * for what it replaced and why.
 *
 * ONE ACTION. `action` is a slot, so it will hold whatever it is given, but a
 * banner with two equal buttons has no call to action — it has a decision. If
 * a secondary path is genuinely needed, make it a text link beside the button,
 * not a second button.
 *
 * ACCESSIBILITY: the title renders as a real heading so the CTA appears in the
 * document outline; pass `as` to fit the surrounding hierarchy. The panel is
 * NOT a landmark and NOT a region — it is a paragraph and a button, and naming
 * it as a region adds a stop to the landmark list that leads nowhere.
 *
 * @example
 * <ActionBanner
 *   title="Need help with a scheme or an application?"
 *   description="Write to the department and an officer will respond."
 *   action={<Link href="/contact" className={buttonClasses("primary","filled","md")}>Get in Touch</Link>}
 * />
 *
 * @example
 * // A grid of three — equal height, buttons aligned
 * <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 24 }}>
 *   {offers.map((o) => <ActionBanner key={o.id} variant="card" {...o} />)}
 * </div>
 */
export const ActionBanner = React.forwardRef<HTMLDivElement, ActionBannerProps>(
  function ActionBanner(
    { title, description, action, variant = "banner", as: Heading = "h3", className, ...props },
    ref,
  ) {
    return (
      <div
        ref={ref}
        className={cn("sa-action-banner", `sa-action-banner--${variant}`, className)}
        {...props}
      >
        <div className="sa-action-banner__content">
          <Heading className="sa-action-banner__title">{title}</Heading>
          {description && <p className="sa-action-banner__description">{description}</p>}
        </div>
        <div className="sa-action-banner__action">{action}</div>
      </div>
    );
  },
);
