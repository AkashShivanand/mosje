import type { Metadata } from "next";
import NextLink from "next/link";
import { ContentPage } from "@/components/website-next/templates/ContentPage";
import { PolicySidebar } from "@/components/website-next/templates/content/policies";
import { TableWrap } from "@/components/website-next/templates/content/TableWrap";
import { CookiePreferences } from "./cookie-preferences";
import { socialCard } from "@/lib/seo/social";

const TITLE = "Cookie Policy";
const DESCRIPTION = "What this website stores in your browser, why, and for how long.";

export const metadata: Metadata = {
  title: `${TITLE} | Department of Social Justice & Empowerment`,
  description: DESCRIPTION,
  ...socialCard({ title: TITLE, description: DESCRIPTION, url: "/website/cookies" }),
};

/**
 * ── WHAT THIS PAGE LISTS, AND WHY (issues SEC-01, SEC-02) ─────────────────────
 *
 * dosje.gov.in's banner sets Google Analytics cookies (_ga, 400 days) before any
 * choice, and its Privacy Policy claims only session cookies. This page lists what
 * THIS website actually keeps, item by item, with purpose and retention — read from
 * the code on 21 Sep 2026:
 *   mosje_cookie_consent   localStorage    components/website/cookie-notice.tsx
 *   mosje.lang             localStorage    components/i18n/translation-provider.tsx
 *   mosje.translations.*   sessionStorage  components/i18n/translation-provider.tsx
 *   accessibilitySettings  cookie, 30 days  the UX4G accessibility widget (v3.36 source)
 *   ux4g_trigger_position  localStorage    the UX4G widget
 *   ux4g_session_id        sessionStorage  the UX4G widget; its telemetry is disabled by
 *                                          ux4g-accessibility-widget.tsx
 * Vercel Web Analytics is cookieless. The site sets no social-media script, so the
 * live page's "Social cookies" switch would consent to nothing and is not offered.
 * Cookies set only by the prototype's demo tooling and access gate are not part of
 * the Department's website and are not listed.
 *
 * Previously titled "Cookies"; the footer and the Website Policies hub call it
 * "Cookie Policy", and one name is used everywhere.
 */
const STORED: { name: string; purpose: string; where: string; kept: string }[] = [
  {
    name: "mosje_cookie_consent",
    purpose: "Remembers that you have seen the cookie notice, so that it is not shown on every page.",
    where: "Your browser (local storage)",
    kept: "Until you withdraw it below or clear this website's data",
  },
  {
    name: "mosje.lang",
    purpose: "Remembers the language you chose from the language button.",
    where: "Your browser (local storage)",
    kept: "Until you choose another language or clear this website's data",
  },
  {
    name: "mosje.translations",
    purpose: "Keeps pages already translated into your chosen language, so that they open faster.",
    where: "Your browser (session storage)",
    kept: "Until you close the browser tab",
  },
  {
    name: "accessibilitySettings",
    purpose: "Remembers the text size, contrast and other display settings you choose from the accessibility button.",
    where: "Your browser (cookie)",
    kept: "30 days",
  },
  {
    name: "ux4g_trigger_position",
    purpose: "Remembers where on the screen you have moved the accessibility button.",
    where: "Your browser (local storage)",
    kept: "Until you clear this website's data",
  },
  {
    name: "ux4g_session_id",
    purpose: "A random identifier the accessibility controls create for the current visit. Their usage reporting is switched off on this website, so it is not sent anywhere.",
    where: "Your browser (session storage)",
    kept: "Until you close the browser tab",
  },
];

export default function Page() {
  return (
    <ContentPage
      title={TITLE}
      breadcrumb={[{ label: "Website Policies", href: "/website/website-policies" }, { label: TITLE }]}
      description={DESCRIPTION}
      lastUpdated="18 Sep 2026"
      sidebar={<PolicySidebar current="/website/cookies" />}
    >
      <p>
        A cookie is a small file a website asks your browser to keep. This website keeps only what it needs to
        remember the choices you make on it. Nothing it keeps identifies you, and none of it is used for advertising
        or for tracking your visits.
      </p>

      <h2 id="stored">What This Website Stores</h2>
      <TableWrap label="What this website stores in your browser">
        <table>
          <caption className="sr-only">What this website stores in your browser, why, and for how long</caption>
          <thead>
            <tr>
              <th scope="col">Name</th>
              <th scope="col">Purpose</th>
              <th scope="col">Where It Is Kept</th>
              <th scope="col">How Long It Is Kept</th>
            </tr>
          </thead>
          <tbody>
            {STORED.map((s) => (
              <tr key={s.name}>
                <th scope="row">{s.name}</th>
                <td>{s.purpose}</td>
                <td>{s.where}</td>
                <td>{s.kept}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </TableWrap>
      <p>
        All of these are needed for the choices you make on this website to work, so they cannot be switched off
        here. This website sets no analytics, advertising or social-media cookie, so there are no optional cookies
        to turn off.
      </p>

      <h2 id="acknowledgement">Your Acknowledgement</h2>
      <CookiePreferences />

      <h2 id="other-websites">Cookies Set by Other Websites</h2>
      <p>
        Pages on this website link to documents and services hosted by other Government of India departments and by
        their content delivery networks. Those websites set their own cookies under their own policies, over which
        the Department has no control.
      </p>

      <h2 id="managing">Managing Cookies</h2>
      <p>
        You can block or delete cookies and stored website data in your browser settings. If you do, the choices
        you have made on this website will be forgotten.
      </p>
      <p>
        How the Department handles information collected through this website is set out in the{" "}
        <NextLink href="/website/privacy-policy">Privacy Policy</NextLink>.
      </p>
    </ContentPage>
  );
}
