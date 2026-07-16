import type { Metadata } from "next";
import Link from "next/link";
import { ContentPage } from "@/components/website/templates/ContentPage";

export const metadata: Metadata = {
  title: "Accessibility Statement — Department of Social Justice & Empowerment",
  description:
    "Accessibility Statement for the website of the Department of Social Justice & Empowerment (DoSJE), Government of India — built to WCAG 2.1 Level AA and GIGW 3.0.",
};

export default function AccessibilityPage() {
  return (
    <ContentPage
      title="Accessibility Statement"
      breadcrumb={[{ label: "Policies" }, { label: "Accessibility Statement" }]}
      description="Our commitment to making this website usable by the widest possible audience, including people with disabilities."
      lastUpdated="06 Jun 2026"
    >
      <p>
        The Department of Social Justice &amp; Empowerment (DoSJE), Government of India, is committed to
        ensuring that this website is accessible to all users, including persons with disabilities. We have
        built this website to conform to the Web Content Accessibility Guidelines (WCAG) 2.1 Level AA and to
        the Guidelines for Indian Government Websites and Apps (GIGW) 3.0, so that the maximum number of
        people can use it regardless of ability, device or technology.
      </p>

      <h2>Accessibility Features</h2>
      <p>
        We have incorporated the following features to make the content of this website accessible:
      </p>
      <ul>
        <li>
          <strong>Keyboard navigation:</strong> All functionality and interactive elements can be operated
          using a keyboard, without requiring a mouse.
        </li>
        <li>
          <strong>Visible focus:</strong> Interactive elements display a clearly visible focus indicator so
          that keyboard users can always tell where they are on the page.
        </li>
        <li>
          <strong>Alternative text:</strong> Meaningful images carry descriptive alternative (alt) text so
          that screen-reader users receive equivalent information; decorative images are hidden from assistive
          technologies.
        </li>
        <li>
          <strong>Semantic structure:</strong> Pages use proper headings, landmarks, lists and tables so that
          their structure can be understood and navigated with assistive technologies.
        </li>
        <li>
          <strong>Resizable text:</strong> Text can be resized using the browser&apos;s zoom controls up to
          200% without loss of content or functionality, and the layout reflows responsively.
        </li>
        <li>
          <strong>Colour and contrast:</strong> Text and interactive elements are designed to meet the WCAG
          2.1 AA minimum contrast ratios, and information is not conveyed by colour alone.
        </li>
        <li>
          <strong>Descriptive links:</strong> Links are written to make sense when read out of context.
        </li>
      </ul>

      <h2>Accessibility Widget</h2>
      <p>
        This website provides an accessibility widget (powered by the UX4G accessibility toolkit) that lets
        you tailor the presentation of the website to your needs. The widget offers controls to:
      </p>
      <ul>
        <li>Increase or decrease the text size;</li>
        <li>Adjust contrast and invert the colour scheme;</li>
        <li>Switch to a dyslexia-friendly font;</li>
        <li>Highlight links to make them easier to locate;</li>
        <li>Reset all accessibility adjustments to the default presentation.</li>
      </ul>

      <h2>Standard Document Formats and Viewers</h2>
      <p>
        Most of the content on this website is available in HTML, which is accessible to assistive
        technologies. Some documents are provided in Portable Document Format (PDF), Word, Excel or PowerPoint.
        To view or work with these documents you may need additional, freely available software:
      </p>
      <ul>
        <li>
          <strong>PDF files</strong> can be viewed with{" "}
          <a href="https://get.adobe.com/reader/" rel="noopener noreferrer" target="_blank">
            Adobe Acrobat Reader
          </a>
          .
        </li>
        <li>
          <strong>Word, Excel and PowerPoint files</strong> can be viewed with their respective viewers or
          with free office software.
        </li>
      </ul>

      <h2>Known Limitations</h2>
      <p>
        Despite our best efforts to ensure that all pages and content conform to WCAG 2.1 Level AA, some
        content — particularly certain legacy documents and third-party material — may not yet be fully
        accessible. We are working to remediate such content and to bring it into conformance progressively.
        Where an accessible version of a document is not yet available, please contact us and we will provide
        the information in an alternative format.
      </p>

      <h2>Feedback and Contact</h2>
      <p>
        We welcome your feedback on the accessibility of this website. If you encounter any accessibility
        barrier, or require any information on this website in an alternative format, please reach us through
        the details on our <Link href="/website/contact-us">Contact Us</Link> page, describing the page concerned and the
        difficulty you experienced. We will make every reasonable effort to address the issue and to provide
        the information you need.
      </p>
    </ContentPage>
  );
}
