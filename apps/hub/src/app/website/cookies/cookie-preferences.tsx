"use client";

import { useState, useSyncExternalStore } from "react";
import { Alert, Button } from "@mosje/design-system";

const STORAGE_KEY = "mosje_cookie_consent";

/**
 * The one control on this page that does something: withdrawing the
 * acknowledgement this browser has stored.
 *
 * ── THE STATES ───────────────────────────────────────────────────────────────
 * Three, and they are genuinely different: the browser has not been asked yet
 * (nothing stored), it has acknowledged, and the acknowledgement has just been
 * withdrawn. `idle` is also distinct from all of them — on the server and on
 * the first client paint there is no way to know which, and rendering
 * "not acknowledged" during that moment would flash the wrong answer on every
 * load. It reads storage through `useSyncExternalStore`, whose server snapshot
 * is "unknown", and says nothing until the client snapshot has been taken.
 *
 * Storage can throw — a private window, blocked site data — and that is not an
 * error to report. It means this browser stores nothing, which is the most
 * private outcome available and needs no remedy.
 */
type Consent = "unknown" | "stored" | "none";

function readConsent(): Consent {
  try {
    return localStorage.getItem(STORAGE_KEY) ? "stored" : "none";
  } catch {
    return "none";
  }
}

function subscribe(onChange: () => void): () => void {
  window.addEventListener("storage", onChange);
  return () => window.removeEventListener("storage", onChange);
}

export function CookiePreferences() {
  const stored = useSyncExternalStore<Consent>(subscribe, readConsent, () => "unknown");
  const [withdrawn, setWithdrawn] = useState(false);
  const consent: Consent = withdrawn ? "none" : stored;

  const withdraw = () => {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      /* Nothing was stored to remove. The outcome the reader asked for is met. */
    }
    setWithdrawn(true);
  };

  return (
    <div role="status" aria-live="polite">
      {withdrawn ? (
        <Alert status="success" title="Acknowledgement Withdrawn">
          The cookie notice will be shown again the next time you open this website.
        </Alert>
      ) : (
        <p>
          {consent === "stored"
            ? "This browser has acknowledged the cookie notice. You can withdraw that acknowledgement; the notice will then be shown again."
            : consent === "none"
              ? "This browser has not acknowledged the cookie notice, so the notice will be shown the next time you open this website."
              : "Checking what this browser has stored…"}
        </p>
      )}
      {consent === "stored" && !withdrawn && (
        <Button variant="primary" appearance="outlined" onClick={withdraw}>
          Withdraw Acknowledgement
        </Button>
      )}
    </div>
  );
}
