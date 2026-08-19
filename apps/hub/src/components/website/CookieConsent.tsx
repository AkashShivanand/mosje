"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Icon } from "@mosje/design-system";

export function CookieConsent() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem("mosje_cookie_consent");
    if (!consent) {
      const handle = requestAnimationFrame(() => setShow(true));
      return () => cancelAnimationFrame(handle);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem("mosje_cookie_consent", "accepted");
    setShow(false);
  };

  if (!show) return null;

  return (
    <div
      role="region"
      aria-label="Cookie Privacy Consent"
      className="fixed bottom-0 inset-x-0 z-[1050] border-t border-border bg-surface p-4 shadow-lg sm:p-5"
    >
      <div className="sa-container flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-start gap-3 text-sm text-ink">
          <Icon name="cookie" size={20} className="mt-0.5 shrink-0 text-primary" aria-hidden="true" />
          <p className="leading-relaxed">
            This website uses essential cookies to ensure security, performance, and compliance with Government of India web guidelines (GIGW 3.0 &amp; DBIM). Read our{" "}
            <Link href="/website/privacy-policy" className="font-semibold text-primary underline hover:text-primary-dark">
              Privacy Policy
            </Link>{" "}
            to learn more.
          </p>
        </div>
        <div className="flex shrink-0 items-center gap-3">
          <button
            type="button"
            onClick={handleAccept}
            className="rounded-lg bg-primary px-5 py-2 text-sm font-semibold text-white shadow-xs transition hover:bg-primary-dark focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
          >
            Accept &amp; Continue
          </button>
        </div>
      </div>
    </div>
  );
}
