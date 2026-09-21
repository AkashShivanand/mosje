import type { Metadata } from "next";
import Link from "next/link";
import { ContentPage } from "@/components/website-next/templates/ContentPage";
import { PolicySidebar } from "@/components/website-next/templates/content/policies";

const TITLE = "Privacy Policy";
const DESCRIPTION = "What information this website collects when you visit it, and how the Department uses it.";

export const metadata: Metadata = {
  title: `${TITLE} | Department of Social Justice & Empowerment`,
  description: DESCRIPTION,
};

/*
 * The Department's own Privacy Policy, dosje.gov.in/home-page/privacy-policy/, read
 * 21 Sep 2026. The previous version of this file was a paraphrase with clauses the
 * Department never published ("We do not sell, trade or rent…"); it is replaced by the
 * Department's text. Edits, each deliberate:
 *  - its first two paragraphs are printed twice on the live page; once here;
 *  - "it's only used to -fulfill" → "it is only used to fulfil"; the dangling "and" at
 *    the end of the list is removed; headings set in Title Case (TYP-06);
 *  - the "MUST" and "NOT" set in capitals are set in ordinary case (TYP-07);
 *  - COOKIES (issue SEC-02). The live policy says only per-session cookies are used,
 *    while dosje.gov.in sets 400-day analytics cookies. This website sets no analytics
 *    or advertising cookie (Vercel Web Analytics is cookieless) and keeps the reader's
 *    preferences in the browser; that is what the section now says, with the detail on
 *    the Cookie Policy page. The Department should confirm the section before launch.
 *  - The Department states no lawful basis for processing and names no grievance
 *    officer for privacy. Neither is invented here; the contact routes are the
 *    Feedback and Contact Us pages. Recorded as a content gap.
 */
export default function Page() {
  return (
    <ContentPage
      title={TITLE}
      breadcrumb={[{ label: "Website Policies", href: "/website/website-policies" }, { label: TITLE }]}
      description={DESCRIPTION}
      lastUpdated="06 Jun 2026"
      sidebar={<PolicySidebar current="/website/privacy-policy" />}
    >
      <p>
        We do not collect personal information, like names or addresses, when you visit our website. If you
        choose to provide that information to us, it is only used to fulfil your request for information.
      </p>
      <p>
        We do collect some technical information when you visit to make your visit seamless. The section below
        explains how we handle and collect technical information when you visit our website.
      </p>

      <h2 id="automatic">Information Collected and Stored Automatically</h2>
      <p>
        When you browse, read pages, or download information on the website of the Department of Social Justice
        &amp; Empowerment, we automatically gather and store certain technical information about your visit. This
        information never identifies who you are. The information we collect and store about your visit is listed
        below:
      </p>
      <ul>
        <li>
          The IP address (a number that is automatically assigned to your computer whenever you are surfing the
          web) from which you access our website;
        </li>
        <li>The type of browser and operating system used to access our site;</li>
        <li>The date and time you accessed our site;</li>
        <li>The pages you have visited.</li>
      </ul>
      <p>
        This information is only used to help us make the site more useful for you. With this data, we learn about
        the number of visitors to our site and the types of technology our visitors use. We never track or record
        information about individuals and their visits.
      </p>

      <h2 id="cookies">Cookies</h2>
      <p>
        This website sets no cookie that identifies you, and none for advertising or for tracking your visits. It
        keeps the choices you make in your own browser: that you have seen the cookie notice, the language you
        have chosen, and the display settings you choose from the accessibility button. What each one is and how long it is kept is set out in the{" "}
        <Link href="/website/cookies">Cookie Policy</Link>.
      </p>

      <h2 id="personal-information">If You Send Us Personal Information</h2>
      <p>
        We do not collect personal information for any purpose other than to respond to you (for example, to
        respond to your questions or provide subscriptions you have chosen). If you choose to provide us with
        personal information, like filling out a Contact Us form with an e-mail address and pin code and
        submitting it to us through the website, we use that information to respond to your message, and to help
        get you the information you have requested. We only share the information you give us with another
        government agency if your question relates to that agency, or as otherwise required by law.
      </p>
      <p>
        Our website never collects information or creates individual profiles for commercial marketing. While you
        must provide an e-mail address for a localised response to any incoming questions or comments to us, we
        recommend that you do not include any other personal information.
      </p>

      <h2 id="contact">Questions About This Policy</h2>
      <p>
        Questions about this policy, or about information you have provided through this website, can be sent
        through the <Link href="/website/feedback">Feedback</Link> page. The Department&rsquo;s postal address and
        telephone numbers are on the <Link href="/website/contact-us">Contact Us</Link> page.
      </p>
    </ContentPage>
  );
}
