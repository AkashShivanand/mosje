import * as React from "react";
import { cn } from "../../utils/cn";
import "./footer.css";

export interface FooterLink {
  label: string;
  href?: string;
  onClick?: () => void;
}

export interface FooterProps extends React.HTMLAttributes<HTMLElement> {
  /** Left-aligned copyright/credit line. Defaults to the UX4G/NeGD line. */
  copyright?: React.ReactNode;
  /** Optional right-aligned policy links (Terms, Privacy, …). */
  links?: FooterLink[];
  /** Content max-width in px, kept in sync with the header. @default 1320 */
  maxWidth?: number;
}

/**
 * MoSJE / SAMAVESH Footer — the slim dark-navy app-shell footer.
 *
 * Matches the Figma portal footer: a single navy band with the UX4G / NeGD /
 * MeitY credit line, plus optional policy links. Styled via `.ds-footer*`
 * semantic classes that reference design tokens (--ds-*). No Tailwind.
 */
export const Footer = React.forwardRef<HTMLElement, FooterProps>(function Footer(
  { copyright, links, maxWidth = 1320, className, ...rest },
  ref,
) {
  return (
    <footer ref={ref} className={cn("ds-footer", className)} {...rest}>
      <div className="ds-footer__in" style={{ maxWidth }}>
        <p className="ds-footer__copy">
          {copyright ?? (
            <>
              © {new Date().getFullYear()} Copyright. All rights reserved. Powered by{" "}
              <strong>NeGD</strong> | MeitY, Government of India.
            </>
          )}
        </p>
        {links && links.length > 0 && (
          <ul className="ds-footer__links">
            {links.map((link) =>
              link.href ? (
                <li key={link.label}>
                  <a href={link.href} className="ds-footer__link">
                    {link.label}
                  </a>
                </li>
              ) : (
                <li key={link.label}>
                  <button type="button" className="ds-footer__link" onClick={link.onClick}>
                    {link.label}
                  </button>
                </li>
              ),
            )}
          </ul>
        )}
      </div>
    </footer>
  );
});
