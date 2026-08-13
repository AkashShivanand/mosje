import * as React from "react";
import { cn } from "../../utils/cn";
import "./layout.css";

export interface SiteLayoutProps {
  /** The masthead. Pass `<SiteHeader variant="website" />`. */
  header: React.ReactNode;
  /** Full-bleed strip directly under the header — the SAMAVESH banner. */
  banner?: React.ReactNode;
  /** Page hero or title band, above the content stack. */
  hero?: React.ReactNode;
  /** The page content: a stack of `<Band>`s. */
  children: React.ReactNode;
  /** Site footer. */
  footer?: React.ReactNode;
  /** Overlays that sit outside the content flow — floating links, widgets. */
  overlays?: React.ReactNode;
  /** `id` for the `<main>`, used as the skip-link target. @default "main" */
  mainId?: string;
  className?: string;
}

/**
 * SiteLayout — the website page skeleton: chrome, then a stack of Bands.
 *
 * The main region grows, so a short page still pins its footer to the bottom
 * of the viewport rather than leaving it floating mid-screen.
 *
 * Everything inside `children` should be a `<Band>`: the band paints its tone
 * edge to edge and holds the content column in a `Container`. Putting a bare
 * `<Container>` here instead is the common mistake — it produces a tinted
 * section that stops short of the viewport edge.
 *
 * Use it for public website pages. A signed-in portal page is `AppShell`.
 */
export function SiteLayout({
  header,
  banner,
  hero,
  children,
  footer,
  overlays,
  mainId = "main",
  className,
}: SiteLayoutProps): React.JSX.Element {
  return (
    <div className={cn("sa-site-layout", className)}>
      {header}
      <main id={mainId} className="sa-site-layout__main" tabIndex={-1}>
        {banner}
        {hero}
        {children}
      </main>
      {footer}
      {overlays}
    </div>
  );
}
