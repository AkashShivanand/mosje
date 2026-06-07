import type { Metadata } from "next";
import { ContentPage } from "@/components/templates/ContentPage";

export const metadata: Metadata = {
  title: "Privacy Policy — Department of Social Justice & Empowerment",
  description:
    "Privacy Policy describing how the Department of Social Justice & Empowerment (DoSJE), Government of India, handles information collected through this website.",
};

export default function PrivacyPage() {
  return (
    <ContentPage
      title="Privacy Policy"
      breadcrumb={[{ label: "Policies" }, { label: "Privacy Policy" }]}
      description="How the Department of Social Justice & Empowerment handles the information you provide while using this website."
      lastUpdated="06 Jun 2026"
    >
      <p>
        The Department of Social Justice &amp; Empowerment (DoSJE), Government of India, does not
        automatically capture any specific personal information from you (such as name, phone number or
        email address) that allows us to identify you individually, when you visit this website. This
        Privacy Policy explains what information may be collected, how it is used, and how it is protected.
      </p>

      <h2>Information Collected Automatically</h2>
      <p>
        If you visit our website to read or download information, certain technical and navigation
        information may be automatically gathered and stored. This information does not identify you
        personally and is used only for statistical and site-improvement purposes. It may include:
      </p>
      <ul>
        <li>The name of the domain and host from which you access the Internet;</li>
        <li>The Internet Protocol (IP) address of the device used to access the website;</li>
        <li>The type and version of browser and operating system used to access the website;</li>
        <li>The date and time of your visit and the pages you accessed;</li>
        <li>The address of the previous website you visited, if you linked to us from another site.</li>
      </ul>

      <h2>Information Collected Voluntarily</h2>
      <p>
        We collect personal information from you only if you specifically and knowingly provide it — for
        example, when you complete a feedback or grievance form, register for a service or scheme, or send
        us an email. Such information may include your name, email address, postal address and telephone
        number. The information so collected is used only for the purpose for which it was provided and is
        not disclosed to any third party, except where required by law.
      </p>

      <h2>Cookies</h2>
      <p>
        A cookie is a small piece of data sent to your browser by a website you visit. This website may use
        cookies and similar technologies to remember your preferences and to gather aggregate, anonymous
        information about how visitors use the site. You may configure your browser to refuse cookies, or
        to alert you when cookies are being sent. If you do so, some parts of the website may not function
        as intended.
      </p>

      <h2>Use and Disclosure of Information</h2>
      <ul>
        <li>We do not sell, trade or rent your personal information to any third party.</li>
        <li>
          We do not share your personal information with any other Government agency or organisation unless
          you have specifically requested a service that requires such sharing, or unless we are required to
          do so by law.
        </li>
        <li>
          Information you provide will be retained only for as long as is necessary to fulfil the purpose
          for which it was collected.
        </li>
      </ul>

      <h2>Security</h2>
      <p>
        This website has reasonable security measures in place to protect against the loss, misuse and
        alteration of the information under our control. All information transmitted through this website is
        handled in line with the security standards applicable to Government of India websites. However, no
        transmission over the Internet can be guaranteed to be completely secure.
      </p>

      <h2>Links to External Websites</h2>
      <p>
        This website contains links to other websites. This Privacy Policy applies solely to this website.
        When you follow a link to an external website, you are subject to the privacy policy of that website,
        for which the Department is not responsible.
      </p>

      <h2>Contact</h2>
      <p>
        If you have any questions regarding this Privacy Policy or the handling of your information, please
        contact us through the details provided on the <a href="/contact-us">Contact Us</a> page.
      </p>
    </ContentPage>
  );
}
