import type { Metadata } from "next";
import Link from "next/link";
import { ContentPage } from "@/components/website/templates/ContentPage";

export const metadata: Metadata = {
  title: "Cookies — Department of Social Justice & Empowerment",
  description: "The cookies this website uses, and how to manage them in your browser.",
};

/*
 * dosje.gov.in/cookies/ is a preferences panel with toggles for session,
 * persistent and social cookies. This website sets ESSENTIAL cookies only —
 * see `components/website/cookie-notice.tsx`, which says the same thing — so a
 * panel of switches would offer a choice that changes nothing. The page states
 * what is used instead.
 */
export default function CookiesPage() {
  return (
    <ContentPage
      title="Cookies"
      breadcrumb={[{ label: "Policies" }, { label: "Cookies" }]}
      description="The cookies this website uses, and how to manage them."
      lastUpdated="17 Sep 2026"
    >
      <p>
        A cookie is a small file that a website stores in your browser. This website uses only the
        cookies it needs to work. It does not use cookies for advertising, for social media sharing, or
        to identify you.
      </p>

      <h2>Cookies This Website Uses</h2>
      <table>
        <thead>
          <tr>
            <th scope="col">Type</th>
            <th scope="col">Purpose</th>
            <th scope="col">Required</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Session cookies</td>
            <td>Keep the website secure and your visit continuous as you move between pages.</td>
            <td>Yes</td>
          </tr>
          <tr>
            <td>Preference cookies</td>
            <td>Remember choices you have already made, such as having read the cookie notice.</td>
            <td>Yes</td>
          </tr>
        </tbody>
      </table>
      <p>
        Because every cookie on this website is essential, there are no optional cookies to switch on
        or off.
      </p>

      <h2>Managing Cookies</h2>
      <p>
        You can block or delete cookies in your browser settings. If you block essential cookies,
        some parts of this website may not work as intended.
      </p>
      <p>
        How the Department handles information collected through this website is set out in the{" "}
        <Link href="/website/privacy-policy">Privacy Policy</Link>.
      </p>
    </ContentPage>
  );
}
