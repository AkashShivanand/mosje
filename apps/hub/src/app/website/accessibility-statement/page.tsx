import type { Metadata } from "next";
import Link from "next/link";
import { ContentPage } from "@/components/website-next/templates/ContentPage";
import { PolicySidebar } from "@/components/website-next/templates/content/policies";

const TITLE = "Accessibility Statement";
const DESCRIPTION =
  "The accessibility standard this website is built to, how it is checked, its known limitations and how to report a barrier.";

export const metadata: Metadata = {
  title: `${TITLE} | Department of Social Justice & Empowerment`,
  description: DESCRIPTION,
  alternates: { canonical: "/website/accessibility-statement" },
};

/*
 * GIGW 3.0 mandatory page (issue MAN-01). The canonical address; /website/accessibility
 * redirects here permanently.
 *
 * NEWLY AUTHORED on 21 Sep 2026 — dosje.gov.in publishes no accessibility statement
 * (/accessibility-statement/ returns 404), so `lastUpdated` is this page's authoring
 * date, not an ingested one.
 *
 * WHAT IS CLAIMED, AND ON WHAT BASIS
 *  - The target (WCAG 2.2 AA) is the estate's stated target (standards-precedence.md);
 *    GIGW 3.0 binds government sites to WCAG 2.1 AA, which 2.2 contains.
 *  - The status is "partially conformant", because the known limitations below are real
 *    and open in the website issue register: DOC-01 (inaccessible PDFs), X-CON-04 (content
 *    published only as scans), LNG-01 / X-LNG-01 (no maintained Hindi edition).
 *  - "How the website is checked" describes the redesign's own definition of done
 *    (docs/website-redesign/DESIGN-SPEC.md, PLAN.md Phase 5). The Department must confirm
 *    it before launch.
 *  - No target dates are given for the limitations: none has been set, and a date on a
 *    government page is a commitment.
 */
export default function Page() {
  return (
    <ContentPage
      title={TITLE}
      breadcrumb={[{ label: "Website Policies", href: "/website/website-policies" }, { label: TITLE }]}
      description={DESCRIPTION}
      lastUpdated="21 Sep 2026"
      sidebar={<PolicySidebar current="/website/accessibility-statement" />}
    >
      <p>
        The Department of Social Justice &amp; Empowerment is committed to making this website usable by
        everyone, including persons with disabilities, whatever device, browser or assistive technology they
        use.
      </p>

      <h2 id="standard">Conformance Standard</h2>
      <p>
        This website is built to conform to the Web Content Accessibility Guidelines (WCAG) 2.2 at Level AA.
        WCAG 2.2 contains every success criterion of WCAG 2.1, which the Guidelines for Indian Government
        Websites and Apps (GIGW) 3.0 require, so a page that meets WCAG 2.2 Level AA also meets the
        accessibility requirement of GIGW 3.0.
      </p>
      <p>
        <strong>Conformance status:</strong> partially conformant. The pages of this website are built to the
        standard, but some published content does not yet meet it. That content is listed under{" "}
        <a href="#limitations">Known Limitations</a>.
      </p>

      <h2 id="features">How the Website Is Built</h2>
      <ul>
        <li>Every function can be used with a keyboard alone, and the item in focus is always visibly marked.</li>
        <li>A link that skips straight to the main content is the first item on every page.</li>
        <li>
          Each page has one main heading, and its sections are marked with headings in order, so that a screen
          reader user can move through a page by its headings.
        </li>
        <li>Pages are divided into landmark regions: the header, the navigation, the main content and the footer.</li>
        <li>Images that carry information have a text description; decorative images are hidden from screen readers.</li>
        <li>Links within text are underlined, and each link&rsquo;s text says where it leads.</li>
        <li>
          Text and controls meet the WCAG colour contrast ratios, and no information is given by colour alone.
        </li>
        <li>
          Text can be enlarged to 200% without loss of content, and pages reflow to a width of 320 pixels without
          scrolling sideways.
        </li>
        <li>Tables have header cells, and a wide table scrolls within its own region on a small screen.</li>
        <li>Nothing on a page moves, scrolls or changes by itself.</li>
        <li>Buttons and links are large enough to be selected easily on a touch screen.</li>
        <li>Links that open a new window say so.</li>
      </ul>

      <h2 id="controls">Display and Language Options</h2>
      <p>
        The accessibility button on every page opens options to change the text size, the contrast and other
        display settings. The language button in the header offers the website in Indian languages other than
        English.
      </p>
      <p>
        A list of screen readers that can be used with this website is on the{" "}
        <Link href="/website/screen-reader-access">Screen Reader Access</Link> page, and the software needed to
        open documents in each file format is on the <Link href="/website/help">Help</Link> page.
      </p>

      <h2 id="testing">How the Website Is Checked</h2>
      <p>Each page template of this website is checked before it is published:</p>
      <ul>
        <li>with automated accessibility testing tools;</li>
        <li>by operating every control with the keyboard alone;</li>
        <li>at 200% zoom and at a screen width of 320 pixels;</li>
        <li>against the WCAG 2.2 colour contrast ratios; and</li>
        <li>for the order and structure of its headings and landmarks.</li>
      </ul>

      <h2 id="limitations">Known Limitations</h2>
      <p>The following content on this website does not yet fully meet the standard.</p>
      <ul>
        <li>
          <strong>Documents in PDF format.</strong> Many documents were published as scanned images or without the
          structure a screen reader needs, so their text may not be read out, searched or enlarged. Where the text
          of such a document is available, it is being published as a web page, with the PDF as a secondary
          download.
        </li>
        <li>
          <strong>Hindi edition.</strong> A separately maintained Hindi edition of this website is not yet
          available. Pages in Hindi and other Indian languages are machine translations of the English pages, and
          may render names, scheme titles and technical terms inaccurately.
        </li>
        <li>
          <strong>Other websites.</strong> This website links to portals and websites maintained by other
          organisations. Their accessibility is the responsibility of the organisations that maintain them.
        </li>
      </ul>

      <h2 id="report">Report an Accessibility Problem</h2>
      <p>
        If you find part of this website that you cannot use, or you need a document in an accessible format,
        please tell the Department through the <Link href="/website/feedback">Feedback</Link> page. Name the page
        and describe the problem. The link &ldquo;Report a problem with this page&rdquo;, at the foot of every
        page, opens the same form with the page already named.
      </p>
      <p>
        The Department&rsquo;s postal address and telephone numbers are on the{" "}
        <Link href="/website/contact-us">Contact Us</Link> page.
      </p>
    </ContentPage>
  );
}
