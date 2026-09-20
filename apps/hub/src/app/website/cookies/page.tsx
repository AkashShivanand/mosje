import type { Metadata } from "next";
import { Link } from "@mosje/design-system";
import { ContentPage } from "@/components/website/templates/ContentPage";
import { CookiePreferences } from "./cookie-preferences";
import { socialCard } from "@/lib/seo/social";

const TITLE = "Cookies";
const DESCRIPTION =
  "The cookies this website sets, what each one is for, and how to withdraw the acknowledgement stored in your browser.";

export const metadata: Metadata = {
  title: `${TITLE} | Department of Social Justice & Empowerment`,
  description: DESCRIPTION,
  ...socialCard({ title: TITLE, description: DESCRIPTION, url: "/website/cookies" }),
};

/**
 * ── WHERE THIS DIVERGES FROM THE LIVE PAGE, AND WHY ──────────────────────────
 *
 * dosje.gov.in's Cookies page offers three switches: Session and Persistent
 * cookies, both locked on, and Social cookies, which the reader may turn off.
 *
 * This site sets no social cookies. It embeds no Facebook, X or LinkedIn
 * script, so there is nothing for that switch to govern. Rendering it anyway
 * would be a consent control that consents to nothing — the same reason
 * `cookie-notice.tsx` shows an acknowledgement rather than an accept-or-reject
 * choice. The page therefore states what is actually set and offers the one
 * control that does something: withdrawing the stored acknowledgement.
 *
 * If a social embed is ever added, the switch is added with it, not before.
 */
export default function Page() {
  return (
    <ContentPage
      title={TITLE}
      breadcrumb={[{ label: "Policies" }, { label: TITLE }]}
      description={DESCRIPTION}
      lastUpdated="18 Sep 2026"
    >
      <p>
        A cookie is a small file this website asks your browser to keep. This site uses cookies only
        where they are necessary for it to work. No cookie set by this site identifies you, and none is
        used for advertising.
      </p>

      <CookiePreferences />

      <h2>Cookies Set by Other Departments</h2>
      <p>
        Pages on this site link to documents and services hosted by other Government of India
        departments and by their content delivery networks. Those sites set their own cookies under
        their own policies, over which this Department has no control.
      </p>

      <h2>Managing Cookies</h2>
      <p>
        You can block or delete cookies in your browser settings. If you block the cookies this
        website needs, some parts of it may not work as intended.
      </p>
      <p>
        How the Department handles information collected through this website is set out in the{" "}
        <Link href="/website/privacy-policy">Privacy Policy</Link>.
      </p>
    </ContentPage>
  );
}
