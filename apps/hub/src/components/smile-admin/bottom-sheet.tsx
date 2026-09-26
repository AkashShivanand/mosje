"use client";

import * as React from "react";
import { SideSheet } from "@mosje/design-system";

/**
 * The phone filter sheet — the design system's SideSheet, anchored to the
 * bottom edge. Until 2026-09-22 this was hand-built: a raw backdrop button and a
 * raw close button, its own scroll lock and Escape handler, and no focus trap,
 * so Tab walked out of an open dialog into the page behind it.
 */
export function BottomSheet({
  open,
  onClose,
  title,
  children,
  footer,
}: {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
}) {
  return (
    <SideSheet open={open} onClose={onClose} title={title ?? "Filters"} footer={footer} side="bottom">
      {children}
    </SideSheet>
  );
}
