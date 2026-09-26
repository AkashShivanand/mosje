"use client";

import * as React from "react";
import Link from "next/link";
import { Button } from "@mosje/design-system";

import { dbimHref } from "@/lib/website-dbim/nav";
import "./footer.css";

export type DbimCookieChoice = "accepted" | "declined" | "custom";

const COOKIE = "dbim-cookie-consent";
const EVENT = "dbim-cookie-consent";

function readChoice(): DbimCookieChoice | null {
  const m = document.cookie.match(/(?:^|;\s*)dbim-cookie-consent=(accepted|declined|custom)/);
  return (m?.[1] as DbimCookieChoice | undefined) ?? null;
}

/**
 * Record the reader's cookie choice for a year. Exported so the Cookie Settings page
 * can save `custom` and have this bar step aside on the same page view.
 */
export function setDbimCookieConsent(choice: DbimCookieChoice): void {
  document.cookie = `${COOKIE}=${choice}; path=/; max-age=31536000; SameSite=Lax`;
  window.dispatchEvent(new Event(EVENT));
}

/**
 * The reference's cookie bar, in its words. Nothing renders once a choice is stored
 * (the compare tool stores `declined`), and nothing renders on the server, so a
 * reader who has chosen never sees it flash.
 *
 * STICKY, NOT FIXED. The reference pins it over the page, which hides the footer's last
 * 92px until the reader chooses. Sticky to the foot of the viewport it reads the same
 * while scrolling and then takes its own place after the footer, so nothing is ever
 * covered (WCAG 2.4.11). It is a bottom bar, not a corner occupant; it carries
 * `data-sa-rail-clear` so the transient back-to-top control steps aside rather than
 * sitting on its buttons (floating-element-placement.md). The statutory accessibility
 * door never yields, and the bar sits below its layer.
 */
export function DbimCookieConsent() {
  const [choice, setChoice] = React.useState<DbimCookieChoice | null | "unknown">("unknown");

  React.useEffect(() => {
    const sync = () => setChoice(readChoice());
    sync();
    window.addEventListener(EVENT, sync);
    return () => window.removeEventListener(EVENT, sync);
  }, []);

  if (choice !== null) return null;

  return (
    <section className="db-cookie" aria-label="Cookie consent" data-sa-rail-clear="">
      <div className="db-cookie__text">
        <p className="db-cookie__lead">This website uses cookies to provide a better user experience.</p>
        <p>
          By clicking accept, you agree to the policies outlined in the{" "}
          <Link href={dbimHref("/cookies")}>Cookie Settings</Link>.
        </p>
      </div>
      <div className="db-cookie__actions">
        <Link href={dbimHref("/cookies")} className="db-cookie__btn">
          Customize Cookies
        </Link>
        <Button variant="neutral" appearance="text" className="db-cookie__btn" onClick={() => setDbimCookieConsent("declined")}>
          Decline Optional Cookies
        </Button>
        <Button variant="neutral" appearance="text" className="db-cookie__btn" onClick={() => setDbimCookieConsent("accepted")}>
          Accept All Cookies
        </Button>
      </div>
    </section>
  );
}
