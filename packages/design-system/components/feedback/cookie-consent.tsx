"use client";

import * as React from "react";
import { cn } from "../../utils/cn";
import { Button } from "../actions/button";
import "./cookie-consent.css";

export interface CookieCategory {
  id: string;
  label: string;
  /** What this category is used for, in one sentence. */
  description: string;
  /**
   * Strictly necessary. It cannot be switched off, and the control says so
   * rather than rendering a toggle that does nothing.
   */
  required?: boolean;
}

export interface CookieConsentProps {
  /**
   * The categories this site actually sets. If the only entry is a required
   * one, do not render this component at all — see the note on the component.
   */
  categories: CookieCategory[];
  /** The ids the reader has already accepted. */
  accepted: string[];
  /** Called with the accepted ids. Required categories are always included. */
  onDecide: (accepted: string[]) => void;
  /** @default "Cookies on this site" */
  title?: string;
  /** The paragraph above the choices, in the department's words. Required. */
  description: string;
  /** Address of the full cookie or privacy statement. Required. */
  policyHref: string;
  /** @default "Read the cookie statement" */
  policyLabel?: string;
  /** @default "Accept all" */
  acceptAllLabel?: string;
  /** @default "Reject optional cookies" */
  rejectLabel?: string;
  /** @default "Save my choices" */
  saveLabel?: string;
  /**
   * Shown instead of the choices when EVERY category is required — there is
   * nothing to consent to, so the reader acknowledges a notice rather than being
   * offered a decision they do not have.
   * @default "Continue"
   */
  acknowledgeLabel?: string;
  /**
   * `"fixed"` pins it to the foot of the viewport, which is what a real banner
   * does; `"inline"` renders it in the flow, which is what a specimen or a
   * settings page wants. Fixed marks itself as a corner occupant so the
   * accessibility widget and the chat launcher lift clear of it.
   * @default "fixed"
   */
  placement?: "fixed" | "inline";
  className?: string;
}

/**
 * The choice a citizen makes about non-essential cookies.
 *
 * **Do not mount this where the site sets no non-essential cookie.** A consent
 * banner that asks about nothing is a modal in front of a government page for no
 * reason, and it teaches people to dismiss consent controls without reading
 * them. This estate currently sets one cookie — the site gate's, which is
 * strictly necessary and therefore exempt — so nothing renders it today. It is
 * here so that the portal which introduces analytics has the control it needs,
 * with the rules already decided.
 *
 * The rules, and each of them is the answer to a dark pattern:
 *
 * 1. **Rejecting is as easy as accepting.** Both are buttons of equal weight,
 *    side by side, in the first view. A banner where "Accept all" is a button and
 *    rejecting takes two clicks through a settings panel is not consent.
 * 2. **Optional categories are OFF until chosen.** Pre-ticked boxes are not
 *    consent, and the component has no prop to pre-tick them.
 * 3. **A required category shows as required, not as a dead toggle.** A switch
 *    that cannot move is a control that lies about what the reader can do.
 * 4. **The page behind stays readable and operable.** It is a region at the foot
 *    of the page, not a modal: a citizen looking for a scheme deadline should not
 *    have to answer a cookie question first.
 * 5. **The full statement is one link away**, always, and its address is a
 *    required prop.
 */
export function CookieConsent({
  categories,
  accepted,
  onDecide,
  title = "Cookies on this site",
  description,
  policyHref,
  policyLabel = "Read the cookie statement",
  acceptAllLabel = "Accept all",
  rejectLabel = "Reject optional cookies",
  saveLabel = "Save my choices",
  acknowledgeLabel = "Continue",
  placement = "fixed",
  className,
}: CookieConsentProps): React.JSX.Element {
  const id = React.useId();
  // It carries `data-sa-corner-occupant` but does NOT read the rail: consent
  // comes before a chat launcher on a government site, so the bar stays put and
  // the widgets in that corner lift clear of it.
  const required = categories.filter((category) => category.required).map((category) => category.id);
  const optional = categories.filter((category) => !category.required);
  // Optional categories start OFF. There is no prop to pre-tick them, because a
  // pre-ticked box is not consent.
  const [chosen, setChosen] = React.useState<Set<string>>(
    () => new Set(accepted.filter((entry) => !required.includes(entry))),
  );
  const [open, setOpen] = React.useState(false);
  // Nothing optional means nothing to consent to. The reader acknowledges a
  // notice; offering "Accept all" and "Reject optional" against an empty set is
  // a choice that is not one, and it is how consent controls lose their meaning.
  const noticeOnly = optional.length === 0;

  return (
    <section
      className={cn("ds-cookies", placement === "fixed" && "ds-cookies--fixed", className)}
      aria-labelledby={`${id}-title`}
      {...(placement === "fixed" ? { "data-sa-corner-occupant": "" } : {})}
    >
      <h2 id={`${id}-title`} className="ds-cookies__title">
        {title}
      </h2>
      <p className="ds-cookies__body">{description}</p>
      <p className="ds-cookies__body">
        <a className="ds-cookies__link" href={policyHref}>
          {policyLabel}
        </a>
      </p>

      {open && !noticeOnly ? (
        <ul className="ds-cookies__list">
          {categories.map((category) => (
            <li key={category.id} className="ds-cookies__row">
              <div className="ds-cookies__rowHead">
                <span className="ds-cookies__rowLabel">{category.label}</span>
                {category.required ? (
                  // A required category says so. A switch that cannot move is a
                  // control that lies about what the reader can do.
                  <span className="ds-cookies__required">Always on — needed for the site to work</span>
                ) : (
                  <label className="ds-cookies__toggle">
                    <input
                      type="checkbox"
                      checked={chosen.has(category.id)}
                      onChange={(event) => {
                        setChosen((current) => {
                          const next = new Set(current);
                          if (event.target.checked) next.add(category.id);
                          else next.delete(category.id);
                          return next;
                        });
                      }}
                    />
                    <span>Allow {category.label}</span>
                  </label>
                )}
              </div>
              <p className="ds-cookies__rowText">{category.description}</p>
            </li>
          ))}
        </ul>
      ) : null}

      <div className="ds-cookies__actions">
        {noticeOnly ? (
          <Button size="sm" onClick={() => onDecide(required)}>
            {acknowledgeLabel}
          </Button>
        ) : (
          <>
            {/* Rejecting is a button of equal weight, beside accepting, in the
                first view — not two clicks away through a settings panel. */}
            <Button size="sm" onClick={() => onDecide([...required, ...optional.map((c) => c.id)])}>
              {acceptAllLabel}
            </Button>
            <Button size="sm" appearance="outlined" onClick={() => onDecide(required)}>
              {rejectLabel}
            </Button>
            {open ? (
              <Button size="sm" appearance="outlined" onClick={() => onDecide([...required, ...chosen])}>
                {saveLabel}
              </Button>
            ) : (
              <Button size="sm" appearance="text" onClick={() => setOpen(true)} aria-expanded={false}>
                Choose which cookies
              </Button>
            )}
          </>
        )}
      </div>
    </section>
  );
}
