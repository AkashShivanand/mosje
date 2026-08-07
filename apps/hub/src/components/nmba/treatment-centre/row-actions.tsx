"use client";

import * as React from "react";
import { Icon } from "@mosje/design-system";

/**
 * Shared row-action primitives for treatment-centre list tables.
 *
 * Dense data tables read best when per-row actions are compact icon buttons
 * with a clear tone hierarchy (neutral views → amber edit → red delete) rather
 * than a wrapping row of text chips. Every action carries an accessible label,
 * a native tooltip, and a visible keyboard focus ring (WCAG 2.1 / GIGW).
 */

// Focus rings use the SOLID token (not an alpha tint): a translucent ring on a
// white row falls below the 3:1 non-text-contrast floor (WCAG 1.4.11 / 2.4.11).
const ACTION_TONES = {
  neutral: "text-ink-muted hover:bg-navy/10 hover:text-navy focus-visible:ring-navy",
  warning: "text-await-fg hover:bg-await-bg focus-visible:ring-await-fg",
  danger: "text-danger-fg hover:bg-danger-bg focus-visible:ring-danger-fg",
} as const;

export type RowActionTone = keyof typeof ACTION_TONES;

export interface IconActionProps {
  /** Material Symbols name for the DS <Icon>. */
  icon: string;
  /** Used as both the accessible name and the hover tooltip. */
  label: string;
  onClick: () => void;
  /** Visual emphasis. @default "neutral" */
  tone?: RowActionTone;
  disabled?: boolean;
}

export function IconAction({ icon: iconName, label, onClick, tone = "neutral", disabled }: IconActionProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      title={label}
      disabled={disabled}
      className={`inline-flex h-9 w-9 items-center justify-center rounded-md transition active:scale-95 disabled:pointer-events-none disabled:opacity-40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-1 ${ACTION_TONES[tone]}`}
    >
      <Icon name={iconName} size={16} aria-hidden />
    </button>
  );
}

/** Horizontal container that aligns IconActions and renders dividers between groups. */
export function RowActions({ children }: { children: React.ReactNode }) {
  return <div className="flex items-center gap-0.5">{children}</div>;
}

/** Thin vertical separator to split action groups (e.g. views | edit · delete). */
export function RowActionDivider() {
  return <span className="mx-1 h-5 w-px bg-line" aria-hidden />;
}
