"use client";

import { useSyncExternalStore } from "react";
import { Button } from "@mosje/design-system";
import { setDbimCookieConsent } from "@/components/website-dbim/chrome/CookieConsent";

/**
 * The Cookie Policy's one working control, in the place the reference gives its "Save
 * Preferences" button. It works on the DBIM cookie notice's own record — the
 * `dbim-cookie-consent` cookie (chrome/CookieConsent.tsx) — and listens for the same
 * event that notice listens for, so saving here dismisses the notice on this page
 * view and withdrawing brings it back.
 *
 * FOUR STATES, after the estate's own control (app/website/cookies/cookie-preferences.tsx):
 * not yet known (the server and the first paint say nothing, so the wrong answer never
 * flashes), no choice recorded, a choice recorded, and the one the reader just made.
 * Nothing optional is set, so "Save Preferences" records the only preference there is.
 */
const COOKIE = "dbim-cookie-consent";
const EVENT = "dbim-cookie-consent";
type Consent = "unknown" | "stored" | "none";

function readConsent(): Consent {
  return new RegExp(`(?:^|;\\s*)${COOKIE}=(accepted|declined|custom)`).test(document.cookie) ? "stored" : "none";
}

function subscribe(onChange: () => void): () => void {
  window.addEventListener(EVENT, onChange);
  return () => window.removeEventListener(EVENT, onChange);
}

function withdraw(): void {
  document.cookie = `${COOKIE}=; path=/; max-age=0; SameSite=Lax`;
  window.dispatchEvent(new Event(EVENT));
}

export function DbimConsentWithdraw() {
  const consent = useSyncExternalStore<Consent>(subscribe, readConsent, () => "unknown");

  if (consent === "unknown") return <div className="db-u-consent" role="status" aria-live="polite" />;

  return (
    <div className="db-u-consent" role="status" aria-live="polite">
      <p>
        {consent === "stored"
          ? "Your cookie preference is saved in this browser. You can withdraw it; the cookie notice will then be shown again."
          : "No cookie preference is saved in this browser, so the cookie notice is shown on every page."}
      </p>
      {consent === "stored" ? (
        <Button type="button" appearance="text" className="db-u-btn db-u-btn--solid" onClick={withdraw}>
          Withdraw Preference
        </Button>
      ) : (
        <Button type="button" appearance="text" className="db-u-btn db-u-btn--solid" onClick={() => setDbimCookieConsent("custom")}>
          Save Preferences
        </Button>
      )}
    </div>
  );
}
