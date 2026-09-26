"use client";

import { useState, useSyncExternalStore } from "react";
import { CookieConsent as DsCookieConsent, type CookieCategory } from "@mosje/design-system";

/**
 * The redesign's cookie notice: the design system's `CookieConsent`, configured.
 * Replaces the classic `components/website/cookie-notice.tsx` on the new pages.
 *
 * ── ONE SENTENCE (issue CON-22) ─────────────────────────────────────────────
 * dosje.gov.in's banner says "This website uses cookies…" twice. This says what
 * the website keeps and that it identifies nobody, once, and links the Cookie
 * Policy, which lists every item with its purpose and retention (SEC-02).
 *
 * ── AN ACKNOWLEDGEMENT, NOT A CHOICE (issue SEC-01) ─────────────────────────
 * Everything this website keeps is needed for a choice the reader made (the
 * notice itself, the language, the accessibility settings), so the only category
 * is required and the component renders a notice to acknowledge rather than an
 * accept-or-reject decision about nothing. The day an analytics or social script
 * is added, it gets its own non-required category here, and the script must not
 * load until that id is in the accepted list.
 *
 * ── STORAGE ─────────────────────────────────────────────────────────────────
 * Same key as the classic notice, so a reader who acknowledged one is not asked
 * again by the other, and the Cookie Policy page's "Withdraw Acknowledgement"
 * works for both. Read through `useSyncExternalStore` with a server snapshot of
 * "stored", so nothing renders on the server or in the first paint and the
 * notice cannot flash for a reader who has already acknowledged it. Storage that
 * throws (a private window) means nothing can be remembered, and the notice
 * shows; acknowledging it still dismisses it for the page's lifetime.
 */
const STORAGE_KEY = "mosje_cookie_consent";

const CATEGORIES: CookieCategory[] = [
  {
    id: "essential",
    label: "Essential",
    required: true,
    description: "Remember the choices you make on this website. They cannot be switched off.",
  },
];

function read(): boolean {
  try {
    return localStorage.getItem(STORAGE_KEY) !== null;
  } catch {
    return false;
  }
}

function subscribe(onChange: () => void): () => void {
  window.addEventListener("storage", onChange);
  return () => window.removeEventListener("storage", onChange);
}

export function WebsiteCookieConsent() {
  const stored = useSyncExternalStore(subscribe, read, () => true);
  const [dismissed, setDismissed] = useState(false);
  if (stored || dismissed) return null;

  return (
    <DsCookieConsent
      categories={CATEGORIES}
      accepted={[]}
      onDecide={() => {
        try {
          localStorage.setItem(STORAGE_KEY, "accepted");
        } catch {
          /* Nothing can be stored; the notice still closes for this page. */
        }
        setDismissed(true);
      }}
      title="Cookies on This Website"
      description="This website keeps only the choices you make on it, such as your language and display settings, and nothing it keeps identifies you."
      policyHref="/website/cookies"
      policyLabel="Read the Cookie Policy"
      acknowledgeLabel="Continue"
    />
  );
}
