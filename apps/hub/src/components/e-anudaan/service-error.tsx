"use client";

/**
 * The ONE way an E-Anudaan screen shows a failed request.
 *
 * DS Audit: Alert ✅ · Button ✅ · ErrorSummary ✅ · FieldMessage ✅ · StatusScreen ✅ · useToast ✅ —
 * nothing new. Every word comes from `lib/e-anudaan/error-catalogue.ts`; a screen passes the entry
 * and what its buttons do, and never writes its own copy for these failures.
 *
 * A screen uses it in three moves:
 *
 *   const errors = useServiceErrors();
 *   const failed = errors.attempt("submit");      // the simulated request layer's check
 *   if (failed) return;                           // toast already shown, or `errors.failure` set
 *   …
 *   <ServiceErrorNotice failure={errors.failure} onRetry={…} homeHref={…} />
 *
 * `attempt` shows a toast itself (nothing to place), and otherwise holds the failure for the notice,
 * which draws it as the entry's render target for that place: an Alert banner, the StatusScreen
 * page, an ErrorSummary, or an inline message.
 */

import * as React from "react";
import { useRouter } from "next/navigation";
import { Alert, Button, ErrorSummary, FieldMessage, StatusScreen, useToast, type StatusKind } from "@mosje/design-system";
import {
  bodyOf,
  referenceNumber,
  takeFailure,
  type CatalogueEntry,
  type ErrorOccasion,
  type RenderTarget,
} from "@/lib/e-anudaan/error-catalogue";

const LOGIN = "/portals/e-anudaan/login";

export interface ServiceFailure {
  entry: CatalogueEntry;
  occasion: ErrorOccasion;
  target: RenderTarget;
  /** Quoted to the helpdesk. Shown only where the action is to contact it. */
  reference: string;
}

export function failureOf(entry: CatalogueEntry, occasion: ErrorOccasion): ServiceFailure {
  return { entry, occasion, target: entry.renderIn[occasion] ?? "banner", reference: referenceNumber() };
}

/** One sentence, for a slot that takes a string (the login template's error, a document row's reason). */
export function serviceErrorText(failure: ServiceFailure): string {
  const ref = failure.entry.action === "helpdesk" ? ` Reference ${failure.reference}.` : "";
  return `${failure.entry.title}. ${bodyOf(failure.entry)} ${failure.entry.preservedNote}${ref}`;
}

export function useServiceErrors() {
  const { toast } = useToast();
  const [failure, setFailure] = React.useState<ServiceFailure | null>(null);

  /** Hold a failure — shown as a toast at once where that is its target, otherwise kept for the notice. */
  const fail = React.useCallback(
    (f: ServiceFailure) => {
      if (f.target === "toast") {
        toast(`${f.entry.title}. ${bodyOf(f.entry)} ${f.entry.preservedNote}`, "error");
        setFailure(null);
        return;
      }
      setFailure(f);
    },
    [toast],
  );

  /** The simulated request layer: returns the failure if this request fails, and shows or holds it. */
  const attempt = React.useCallback(
    (occasion: ErrorOccasion): ServiceFailure | null => {
      const entry = takeFailure(occasion);
      if (!entry) return null;
      const f = failureOf(entry, occasion);
      fail(f);
      return f;
    },
    [fail],
  );

  const clear = React.useCallback(() => setFailure(null), []);
  return { failure, fail, attempt, clear };
}

/**
 * A failure checked for when a page loads rather than when a button is pressed (payment status,
 * DARPAN prefill, the session behind every signed-in page). `loadKey` names the load — the address,
 * for a shell that stays mounted across pages — so each page load is one request. Arming from the
 * dock does not fail the page already open: the NEXT load does, as a real request would.
 */
export function useFailureOnLoad(occasion: ErrorOccasion, loadKey: string = ""): [ServiceFailure | null, () => void] {
  const [failure, setFailure] = React.useState<ServiceFailure | null>(null);
  const lastKey = React.useRef<string | null>(null);
  React.useEffect(() => {
    const entry = takeFailure(occasion);
    // Set from the effect on purpose: the flag lives in sessionStorage, which the server render cannot
    // read. A second run for the SAME load (React's development double effect) finds the flag already
    // taken and must not clear what the first run set; only a new load clears it.
    if (entry) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setFailure(failureOf(entry, occasion));
    } else if (lastKey.current !== null && lastKey.current !== loadKey) {
      setFailure(null);
    }
    lastKey.current = loadKey;
  }, [occasion, loadKey]);
  const clear = React.useCallback(() => setFailure(null), []);
  return [failure, clear];
}

const PAGE_KIND: Partial<Record<string, StatusKind>> = {
  "network-offline": "offline",
  "forbidden-role": "403",
  "not-found-withdrawn": "404",
  maintenance: "maintenance",
};

export interface ServiceErrorNoticeProps {
  failure: ServiceFailure | null;
  /** Try the request again: retry, wait-retry, helpdesk, choose-file. */
  onRetry?: () => void;
  /** Where "go home" goes — the reader's list or dashboard. */
  homeHref?: string;
  /** The control a `fix-field` failure concerns, and its message. */
  field?: { id: string; label: string };
  /** Dismiss once the reader has acted. */
  onDismiss?: () => void;
  /** Restrict to these targets — a screen that draws inline messages itself passes the others. */
  only?: readonly RenderTarget[];
  className?: string;
}

export function ServiceErrorNotice({ failure, onRetry, homeHref, field, onDismiss, only, className }: ServiceErrorNoticeProps) {
  const router = useRouter();
  const box = React.useRef<HTMLDivElement>(null);
  // A failure appears where the reader is looking, and is announced: a save that fails from the foot of
  // a long step would otherwise put its banner at the top, out of sight.
  React.useEffect(() => {
    if (!failure || failure.target === "toast" || failure.target === "page") return;
    box.current?.scrollIntoView({ block: "center", behavior: "smooth" });
    box.current?.focus({ preventScroll: true });
  }, [failure]);
  if (!failure || failure.target === "toast" || (only && !only.includes(failure.target))) return null;
  const { entry } = failure;

  const act = () => {
    onDismiss?.();
    switch (entry.action) {
      case "sign-in":
        router.push(LOGIN);
        return;
      case "reload":
        window.location.reload();
        return;
      case "go-home":
        if (homeHref) router.push(homeHref);
        return;
      case "fix-field":
        if (field) document.getElementById(field.id)?.focus();
        return;
      default:
        onRetry?.();
    }
  };
  const canAct = !(entry.action === "go-home" && !homeHref) && !(entry.action === "fix-field" && !field);
  const reference =
    entry.action === "helpdesk" ? (
      <span className="block text-body-3">
        Reference number: <span className="font-semibold tabular-nums">{failure.reference}</span>
      </span>
    ) : null;

  // A summary links to the answer it concerns; with no answer to link to, it is a banner.
  const target = failure.target === "summary" && !field ? "banner" : failure.target;
  switch (target) {
    case "page":
      return (
        <StatusScreen
          className={className}
          kind={PAGE_KIND[entry.id] ?? "500"}
          title={entry.title}
          description={`${bodyOf(entry)} ${entry.preservedNote}${entry.action === "helpdesk" ? ` Reference number ${failure.reference}.` : ""}`}
          primaryAction={canAct ? { label: entry.actionLabel, onClick: act } : undefined}
          searchUrl={null}
        />
      );
    case "summary":
      return (
        <ErrorSummary
          className={className}
          title={entry.title}
          errors={[{ fieldId: field!.id, message: `${field!.label}: ${bodyOf(entry)} ${entry.preservedNote}` }]}
        />
      );
    case "inline":
      return (
        <div ref={box} tabIndex={-1} className="outline-none">
          <FieldMessage status="error" className={className} role="alert">
            {entry.title}. {bodyOf(entry)} {entry.preservedNote}
          </FieldMessage>
        </div>
      );
    default:
      return (
        <div ref={box} tabIndex={-1} className="outline-none">
        <Alert
          className={className}
          status={entry.action === "wait-retry" || entry.id === "deadline-closed" ? "warning" : "error"}
          title={entry.title}
          action={
            canAct ? (
              <Button size="sm" appearance="outlined" onClick={act}>
                {entry.actionLabel}
              </Button>
            ) : undefined
          }
        >
          <span className="block">{bodyOf(entry)}</span>
          <span className="block">{entry.preservedNote}</span>
          {reference}
        </Alert>
        </div>
      );
  }
}
