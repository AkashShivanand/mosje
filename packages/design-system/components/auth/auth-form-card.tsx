"use client";

import * as React from "react";
import { cn } from "../../utils/cn";
import { Alert } from "../feedback/alert";
import "./auth-form-card.css";

/**
 * The login form column: seven regions in a fixed order, one of which is a slot.
 *
 * ```
 *   ┌─────────────────────────────────┐
 *   │  Header        heading + lede   │  always
 *   │  Error         Alert            │  when the attempt failed
 *   │  SSO           DigiLocker + rule│  slot — the per-role handoff
 *   │  Method tabs   Tabs             │  slot — omitted when there is one mode
 *   │ ▸Credential fields              │  ◀── THE SLOT. Everything else is fixed.
 *   │  Primary action                 │  always
 *   │  Consent       GIGW disclosure  │  always
 *   │  Account prompt                 │  when the portal registers people
 *   │  Footer        Need Help?       │  optional
 *   └─────────────────────────────────┘
 * ```
 *
 * **Why this is one component and not four.** Until 2026-09-06 the Figma master
 * carried an `Auth Method` variant axis — `Password · OTP · PIN · DARPAN` — and
 * this file carried the same shape as a four-armed conditional. Read layer by
 * layer, three of those four drawings were the same drawing: `PIN` differed from
 * `Password` by a label and a link's wording, and `DARPAN` differed by one
 * control being visible instead of hidden. Seven of the eight regions were
 * identical across all four.
 *
 * An axis that only changes one region is not an axis; it is a slot with extra
 * steps. And because the axis was really asking two questions at once — what
 * identifies you, and how you prove it — it grew multiplicatively: five
 * identifiers against four secrets is twenty clones of an eight-region card.
 *
 * So the card is drawn once, and `credentialFields` takes the stack. Adding a
 * credential mode adds one small component (see `credential-fields.tsx`); it
 * does not clone this.
 *
 * **What this component does NOT own.** The role tabs — Citizen / Officer /
 * Organisation — belong to `PortalLoginShell`, which pins them at a breakpoint
 * this card cannot see. The Figma master draws them as region 1 of the card
 * because there they are simply the top of the right-hand column; in code they
 * are the shell's, and that divergence is recorded on the component record
 * rather than resolved by giving the estate two places to draw a tablist.
 *
 * **The slot is a rendered node, not a mode name.** This card holds no auth
 * state and constructs no fields. `PortalLoginTemplate` owns which mode is
 * active, whether a code has been sent, and the shape of the submit payload,
 * because those are the parts a portal must not be able to get wrong.
 */
export interface AuthFormCardProps {
  /**
   * The column's heading. @default "Log in to your account"
   *
   * The citizen's own words for what they are doing. It is deliberately not
   * "Sign In to <portal>", which restates the portal name already standing in
   * the shell's SIGNING INTO strip.
   */
  heading?: React.ReactNode;
  /**
   * Heading level. @default 2
   *
   * A real login page is the whole page, so its heading is the `<h1>` — pass 1
   * there, which is what GIGW 3.0 requires and what `PortalLoginTemplate` does.
   * The default is 2 because a card is more often EMBEDDED — in a documentation
   * page, in a modal inside an authenticated shell — and a second `<h1>` costs
   * a screen-reader user the page outline.
   */
  headingLevel?: 1 | 2 | 3;
  /** A sentence under the heading, usually the active role's own description. */
  description?: React.ReactNode;
  /** The failed attempt, in the department's words. Rendered as an error Alert. */
  error?: React.ReactNode;
  /**
   * The identity-provider handoff and the rule beneath it — an `SSOButton` and
   * an `AuthDivider`, as one node.
   *
   * ABOVE the divider and OUTSIDE the credential fields, because that is what it
   * is: a way past the form, not a mode of it. Carrying DigiLocker as a
   * credential mode is what made the template suppress its own submit button
   * while DigiLocker was "selected".
   */
  sso?: React.ReactNode;
  /**
   * The credential-mode switch, when the role offers more than one way in.
   *
   * Omit it for a single-mode portal — NOS is PIN-only, and a tablist with one
   * tab is chrome pretending to be a choice.
   *
   * **It is the LABEL WIDTH that overflows, not the number of tabs.** Measured
   * 2026-09-06 in a 390px column: "Login with Credentials" (185px) and "Login
   * with DARPAN ID" (183px) are 368px of labels in 340px of room — TWO tabs
   * already clip. An earlier version of this note said "up to three modes are
   * tabs", which was a guess and was wrong.
   *
   * So: keep labels short ("Password", "OTP", "DARPAN ID" — the mode, not a
   * sentence about it), pass `overflow` so the row offers the More menu rather
   * than cutting a tab in half, and past three modes use a `Select` or a
   * `RadioGroup` — which is what `PortalLoginTemplate.authSelectorType` already
   * resolves. Measure at 390, because that is `layout/login/content/width`.
   */
  methodTabs?: React.ReactNode;
  /**
   * ▸ THE SLOT — the stack of fields for the active credential mode.
   *
   * One of the stacks in `credential-fields.tsx`, or a portal's own. Everything
   * around it is fixed, so a new mode is a new stack and nothing else.
   */
  credentialFields: React.ReactNode;
  /**
   * The submit. One per step, never two — on the OTP route the same button is
   * first "Send OTP" and then "Verify and Log In".
   */
  primaryAction: React.ReactNode;
  /**
   * The consent disclosure GIGW requires — a `ConsentLine`.
   *
   * Not optional in practice, and typed optional only so an embedded specimen
   * can leave it off. Never drop it to save vertical space.
   */
  consent?: React.ReactNode;
  /** "Create Account" and friends — an `AccountPrompt`. */
  accountPrompt?: React.ReactNode;
  /** Anything after the account prompt, typically the help route. */
  footer?: React.ReactNode;
  /** Submit handler for the underlying `<form>`. */
  onSubmit?: (event: React.FormEvent<HTMLFormElement>) => void;
  className?: string;
}

export function AuthFormCard({
  heading = "Log in to your account",
  headingLevel = 2,
  description,
  error,
  sso,
  methodTabs,
  credentialFields,
  primaryAction,
  consent,
  accountPrompt,
  footer,
  onSubmit,
  className,
}: AuthFormCardProps): React.JSX.Element {
  // The heading's LEVEL is the caller's; its size is not. Styling stays on the
  // element so an embedded card looks identical to a standalone one.
  const Heading = `h${headingLevel}` as "h1" | "h2" | "h3";

  return (
    /* `noValidate` because the fields carry their own messages through
       `FormField`. The browser's native bubbles cannot be styled, cannot be
       read by a screen reader reliably, and appear in English on a page the
       citizen may be reading in another language. */
    <form className={cn("ds-authcard", className)} onSubmit={onSubmit} noValidate>
      <div className="ds-authcard__header">
        <Heading className="ds-authcard__title">{heading}</Heading>
        {description ? <p className="ds-authcard__lede">{description}</p> : null}
      </div>

      {error ? <Alert status="error">{error}</Alert> : null}

      {sso}
      {methodTabs}

      {credentialFields}

      <div className="ds-authcard__action">{primaryAction}</div>

      {consent}
      {accountPrompt}
      {footer}
    </form>
  );
}
