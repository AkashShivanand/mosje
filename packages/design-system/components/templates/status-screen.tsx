"use client";

import * as React from "react";
import { cn } from "../../utils/cn";
import { ErrorView, type WayfindingLink } from "../feedback/error-view";
import "./screen-templates.css";

/**
 * Why there is no record to show.
 *
 * **Five, not one.** `ErrorView` publishes four; `offline` is added here because
 * a citizen on a dropped connection and a citizen on a broken server need
 * different sentences and different next actions, and rendering the 500 for
 * both tells the first one to contact a department that is working fine.
 */
export type StatusKind = "404" | "403" | "500" | "maintenance" | "offline";

/**
 * The five sentences. Each says what happened and what the reader can do —
 * never a status code on its own, which `data-state-completeness.md` §4 bans
 * from a citizen's page.
 */
const OFFLINE_COPY = {
  badge: "No connection",
  title: "You Appear to Be Offline",
  description:
    "This page could not be loaded because the device is not connected. Reconnect and try again; nothing you have entered has been sent.",
  icon: "wifi_off",
};

export interface StatusScreenProps {
  /** @default "404" */
  kind?: StatusKind;
  /** Override the heading where the department words it differently. */
  title?: string;
  /** Override the explanation. One or two sentences, in the citizen's terms. */
  description?: string;
  /** The one thing to do — "Try again", "Return to the dashboard". */
  primaryAction?: { label: string; href?: string; onClick?: () => void; icon?: string };
  secondaryAction?: { label: string; href?: string; onClick?: () => void; icon?: string };
  /** Where else to go. Omit to use the estate's standard destinations. */
  wayfindingLinks?: WayfindingLink[];
  /** Search destination template. Pass `null` on a portal with no public search. */
  searchUrl?: string | null;
  className?: string;
}

/**
 * StatusScreen — no record, because something failed.
 *
 * The five kinds are five different facts about the world and they are not
 * interchangeable:
 *
 * | Kind | What is true | What the reader should do |
 * |---|---|---|
 * | `404` | The address is wrong or the record was withdrawn | Look for it another way |
 * | `403` | The record exists; this role may not see it | Ask for access, or sign in as someone who can |
 * | `500` | The department's service failed | Try again shortly |
 * | `maintenance` | The failure was planned | Come back after the stated window |
 * | `offline` | The device is not connected | Reconnect — nothing was lost |
 *
 * A single "Something went wrong" covers all five and helps with none, which is
 * why this template takes a `kind` and not a message.
 *
 * **It is not an error boundary.** A feed being down is an expected state with a
 * defined rendering inside the screen that reads it — `ScreenBody`'s `error`
 * branch — and routing that through here throws away the page's chrome and the
 * reader's place in it. This template is for a route that has no record to
 * render at all.
 */
export function StatusScreen({
  kind = "404",
  title,
  description,
  primaryAction,
  secondaryAction,
  wayfindingLinks,
  searchUrl,
  className,
}: StatusScreenProps): React.JSX.Element {
  const isOffline = kind === "offline";

  return (
    <div className={cn("sa-screen", "sa-status", className)}>
      <ErrorView
        /* `offline` has no ErrorView preset, so it borrows the 500's shape and
           replaces every word of it. Borrowing the LOOK of a server failure is
           right — the reader is equally stuck — while borrowing its COPY would
           blame the department for the reader's connection. */
        kind={isOffline ? "500" : kind}
        badge={isOffline ? OFFLINE_COPY.badge : undefined}
        title={title ?? (isOffline ? OFFLINE_COPY.title : undefined)}
        description={description ?? (isOffline ? OFFLINE_COPY.description : undefined)}
        icon={isOffline ? OFFLINE_COPY.icon : undefined}
        primaryAction={primaryAction}
        secondaryAction={secondaryAction}
        wayfindingLinks={wayfindingLinks}
        /* An offline reader cannot reach a search page either, so the field is
           withdrawn rather than offered and then failing. */
        searchUrl={isOffline ? null : searchUrl}
      />
    </div>
  );
}
