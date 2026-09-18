"use client";

import { useEffect, useState } from "react";
import { Alert, Button, DescriptionList } from "@mosje/design-system";

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
 * load. It reads storage in an effect and says nothing until it has.
 *
 * Storage can throw — a private window, blocked site data — and that is not an
 * error to report. It means this browser stores nothing, which is the most
 * private outcome available and needs no remedy.
 */
type Consent = "unknown" | "stored" | "none";

const ESSENTIAL = [
  {
    term: "Session cookies",
    value:
      "Keep your session on the site consistent while you move between pages. They are removed when the browser is closed. Always active.",
    wide: true,
  },
  {
    term: "Preference storage",
    value:
      "Remembers that you have seen the cookie notice, and any display settings you choose from the accessibility controls. Stored in this browser only; nothing about it is sent to the Department. Always active.",
    wide: true,
  },
];

export function CookiePreferences() {
  const [consent, setConsent] = useState<Consent>("unknown");
  const [withdrawn, setWithdrawn] = useState(false);

  useEffect(() => {
    try {
      setConsent(localStorage.getItem(STORAGE_KEY) ? "stored" : "none");
    } catch {
      setConsent("none");
    }
  }, []);

  const withdraw = () => {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      /* Nothing was stored to remove. The outcome the reader asked for is met. */
    }
    setConsent("none");
    setWithdrawn(true);
  };

  return (
    <>
      <h2>Essential Cookies</h2>
      <p>
        These are required for the site to function and cannot be switched off. They store no personal
        information.
      </p>
      <DescriptionList items={ESSENTIAL} columns={1} divided />

      <h2>Optional Cookies</h2>
      <p>
        This site sets none. It carries no advertising, no analytics profile and no social-media
        tracking script, so there is nothing here for you to turn off.
      </p>

      <h2>Your Acknowledgement</h2>
      {withdrawn ? (
        <Alert status="success" title="Acknowledgement Withdrawn">
          The cookie notice will be shown again the next time you open this site.
        </Alert>
      ) : (
        <p>
          {consent === "stored"
            ? "This browser has acknowledged the cookie notice. You can withdraw that acknowledgement below; the notice will then be shown again."
            : consent === "none"
              ? "This browser has not acknowledged the cookie notice, so the notice will be shown the next time you open the site."
              : "Checking what this browser has stored…"}
        </p>
      )}
      {consent === "stored" && !withdrawn && (
        <Button variant="primary" appearance="outlined" onClick={withdraw}>
          Withdraw Acknowledgement
        </Button>
      )}
    </>
  );
}
