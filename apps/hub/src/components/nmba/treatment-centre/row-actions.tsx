"use client";

import * as React from "react";
import { Divider, Icon, IconButton } from "@mosje/design-system";

/**
 * Shared row-action primitives for treatment-centre list tables.
 *
 * Dense data tables read best when per-row actions are compact icon buttons
 * rather than a wrapping row of text chips. Each one is the design system's
 * IconButton, so the focus ring, target size, disabled treatment and tooltip are
 * the estate's own rather than a local copy of them.
 *
 * TONE. Until 2026-09-22 this drew three local tones — neutral views, AMBER edit,
 * red delete. The design system has no amber button on purpose: amber is the
 * estate's warning signal, and an edit is not a warning. `warning` is kept in the
 * type so no caller breaks, and renders neutral; only `danger` carries a colour.
 */
export type RowActionTone = "neutral" | "warning" | "danger";

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
    <IconButton
      icon={<Icon name={iconName} size={16} />}
      aria-label={label}
      tooltip
      variant={tone === "danger" ? "danger" : "neutral"}
      appearance="text"
      size="sm"
      disabled={disabled}
      onClick={onClick}
    />
  );
}

/** Horizontal container that aligns IconActions and renders dividers between groups. */
export function RowActions({ children }: { children: React.ReactNode }) {
  return <div className="flex items-center gap-0.5">{children}</div>;
}

/** Thin vertical separator to split action groups (e.g. views | edit · delete). */
export function RowActionDivider() {
  return <Divider orientation="vertical" length={20} className="mx-1" />;
}
