"use client";

import { useEffect, useState } from "react";
import { CookieConsent as CookieNotice, type CookieCategory } from "@mosje/design-system";

/**
 * The website's cookie notice, now rendered by the design system's
 * `CookieConsent`.
 *
 * Every cookie this site sets is strictly necessary, so there is nothing to
 * consent to: the component detects that every category is required and renders
 * an acknowledgement rather than an accept-or-reject choice. Offering a choice
 * against an empty set of optional cookies is a decision that is not one, and it
 * is how consent controls stop meaning anything.
 *
 * The decision is remembered in this browser only. Nothing about it leaves the
 * device, which is itself why no consent is required for it.
 */
const CATEGORIES: CookieCategory[] = [
  {
    id: "essential",
    label: "Essential cookies",
    required: true,
    description:
      "Keep the site secure, keep you signed in, and remember choices you have already made. The site does not work without them.",
  },
];

export function WebsiteCookieNotice() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem("mosje_cookie_consent");
    if (!consent) {
      const handle = requestAnimationFrame(() => setShow(true));
      return () => cancelAnimationFrame(handle);
    }
  }, []);

  if (!show) return null;

  return (
    <CookieNotice
      categories={CATEGORIES}
      accepted={[]}
      onDecide={() => {
        localStorage.setItem("mosje_cookie_consent", "accepted");
        setShow(false);
      }}
      title="Cookies on this site"
      description="This website uses essential cookies to keep the site secure and performant, and to meet the Government of India's web guidelines (GIGW 3.0 and DBIM). No cookie on this site identifies you."
      policyHref="/website/privacy-policy"
      policyLabel="Read the privacy policy"
      acknowledgeLabel="Accept and continue"
    />
  );
}
