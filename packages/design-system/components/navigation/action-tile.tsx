import * as React from "react";
import { cn } from "../../utils/cn";
import { navLinkRoutes, type NavTag } from "./header/nav-link-tag";
import { Icon } from "../utilities/icon";
import "./action-tile.css";

export type ActionTileLayout = "row" | "stack" | "block";
export type ActionTileTone = "default" | "tint" | "solid" | "inverse";
export type ActionTileShape = "card" | "pill";
export type ActionTileMediaSize = 40 | 48 | 64 | 88;

export interface ActionTileProps
  extends Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, "title" | "media"> {
  /** Where the tile goes. The whole tile is the one link. */
  href: string;
  /** The tile's name — its accessible name starts here. */
  title: React.ReactNode;
  /** One supporting line. */
  description?: React.ReactNode;
  /**
   * A figure set large above the title — a helpline number. `block` layout
   * only, where it sits beside the media.
   */
  value?: React.ReactNode;
  /**
   * An icon or an image, drawn in a round well. Pass `<Icon>` or an `<img>`
   * with `alt=""`: the title names the tile, and the media is decoration.
   */
  media?: React.ReactNode;
  /** The well's size. @default 40 */
  mediaSize?: ActionTileMediaSize;
  /**
   * A call to action drawn inside the tile — "Call". Not a second control:
   * the tile is one link, so this is text that says what the link does.
   */
  action?: React.ReactNode;
  /**
   * `row` — media, text, trailing arrow in one line (a task, an account).
   * `stack` — centred media over the title (a group of people).
   * `block` — left-aligned column: media and value, then title, description,
   * action (a helpline, a document).
   * @default "row"
   */
  layout?: ActionTileLayout;
  /**
   * The ground the tile sits on, and so its own fill.
   * `default` — white with a hairline, on a white, tint or grey band.
   * `tint` — the brand's lightest fill, on white.
   * `solid` — the key colour's darkest shade, on a light band.
   * `inverse` — a lighter navy with an inverse hairline, on a navy band.
   * @default "default"
   */
  tone?: ActionTileTone;
  /** `pill` rounds the tile fully; `row` layout only. @default "card" */
  shape?: ActionTileShape;
  /**
   * Opens in a new tab: the arrow becomes `open_in_new` and the accessible
   * name gains "(opens in a new window)" (GIGW).
   */
  external?: boolean;
  /** Show the trailing arrow. @default true for `row`, false otherwise */
  trailing?: boolean;
  /** Router-aware link for internal hrefs — pass `next/link`. @default "a" */
  linkAs?: React.ElementType;
}

/**
 * ActionTile — one destination as a tile: a task on a home page, a group of
 * people a scheme serves, an account to follow, a helpline to call, a report
 * to open.
 *
 * ONE LINK, ONE TAB STOP, ONE NAME. The whole tile is the anchor, so its
 * accessible name is its title, then its value and description, then the
 * action text. Nothing inside it is separately interactive — a tile that holds
 * a second link is two controls pretending to be one.
 *
 * THREE LAYOUTS, ONE COMPONENT. The website home page grew six hand-built
 * tiles (tasks, groups, roles, accounts, helplines, documents) that differed
 * in arrangement and nothing else: the same round media well, the same focus
 * ring, the same hover. They are one object at three arrangements.
 *
 * NOT `PortalCard` (a portal, with its saffron rule and code) and not `Card`
 * (content, not a destination). Where the reader is choosing between
 * destinations by name, this is the tile.
 *
 * @example
 * <ActionTile href="/website/schemes-services" title="Find a Scheme"
 *   media={<Icon name="manage_search" size={24} />} tone="inverse" linkAs={Link} />
 */
export const ActionTile = React.forwardRef<HTMLAnchorElement, ActionTileProps>(function ActionTile(
  {
    href,
    title,
    description,
    value,
    media,
    mediaSize = 40,
    action,
    layout = "row",
    tone = "default",
    shape = "card",
    external = false,
    trailing,
    linkAs,
    className,
    ...rest
  },
  ref,
) {
  const Tag: NavTag = navLinkRoutes({ href, external }, linkAs) ? (linkAs as NavTag) : "a";
  const showTrailing = trailing ?? layout === "row";

  return (
    <Tag
      ref={ref}
      href={href}
      className={cn(
        "ds-action-tile",
        `ds-action-tile--${layout}`,
        `ds-action-tile--${tone}`,
        shape === "pill" && layout === "row" && "ds-action-tile--pill",
        className,
      )}
      target={external ? "_blank" : undefined}
      rel={external ? "noopener noreferrer" : undefined}
      {...rest}
    >
      {media != null && (
        <span className={cn("ds-action-tile__media", `ds-action-tile__media--${mediaSize}`)} aria-hidden="true">
          {media}
        </span>
      )}
      {value != null && layout === "block" && <span className="ds-action-tile__value">{value}</span>}
      <span className="ds-action-tile__text">
        <span className="ds-action-tile__title">{title}</span>
        {description != null && <span className="ds-action-tile__description">{description}</span>}
      </span>
      {action != null && (
        <span className="ds-action-tile__action">
          {action}
        </span>
      )}
      {external && <span className="ds-sr-only"> (opens in a new window)</span>}
      {showTrailing && (
        <span className="ds-action-tile__trailing" aria-hidden="true">
          <Icon name={external ? "open_in_new" : "arrow_forward"} size={20} />
        </span>
      )}
    </Tag>
  );
});
