import type { Metadata } from "next";
import { ContentPage } from "@/components/templates/ContentPage";

export const metadata: Metadata = {
  title: "Terms & Conditions — Department of Social Justice & Empowerment",
  description:
    "Terms of Use governing access to and use of the official website of the Department of Social Justice & Empowerment (DoSJE), Government of India.",
};

export default function TermsPage() {
  return (
    <ContentPage
      title="Terms & Conditions"
      breadcrumb={[{ label: "Policies" }, { label: "Terms & Conditions" }]}
      description="The terms and conditions of use governing access to and use of this website of the Department of Social Justice & Empowerment, Government of India."
      lastUpdated="06 Jun 2026"
    >
      <p>
        This website is owned, designed, developed and maintained by the Department of Social Justice
        &amp; Empowerment (DoSJE), Ministry of Social Justice &amp; Empowerment, Government of India. By
        accessing and using this website, you are agreeing to be bound by the following terms and
        conditions of use. If you do not agree to these terms and conditions, please do not use this
        website.
      </p>

      <h2>Content Ownership and Usage</h2>
      <p>
        The information posted on this website could include hypertext links or pointers to information
        created and maintained by non-Government / private organisations. The Department provides these
        links and pointers solely for your information and convenience. When you select a link to an
        external website, you are leaving the Department&apos;s website and are subject to the privacy and
        security policies of the owners / sponsors of the external website.
      </p>
      <ul>
        <li>
          The documents and information displayed on this website are for reference purposes only and do
          not purport to be a legal document.
        </li>
        <li>
          In case of any variance between what has been stated on this website and the relevant Act,
          Rules, Regulations, Policy Statements, etc., the latter shall prevail.
        </li>
        <li>
          The Department does not warrant the accuracy or completeness of the information, text, graphics,
          links or other items contained within these documents.
        </li>
      </ul>

      <h2>Disclaimer of Warranties and Limitation of Liability</h2>
      <p>
        Though all efforts have been made to ensure the accuracy and currency of the content on this
        website, the same should not be construed as a statement of law or used for any legal purposes. The
        Department accepts no responsibility in relation to the accuracy, completeness, usefulness or
        otherwise, of the contents. In no event will the Department be liable for any expense, loss or
        damage including, without limitation, indirect or consequential loss or damage, or any expense,
        loss or damage whatsoever arising from use, or loss of use, of data, arising out of or in
        connection with the use of this website.
      </p>

      <h2>Links to External Websites / Portals</h2>
      <p>
        At many places on this website, you shall find links to other websites / portals. These links have
        been placed for your convenience. The Department is not responsible for the contents and reliability
        of the linked websites and does not necessarily endorse the views expressed in them. Mere presence
        of the link or its listing on this website should not be assumed as endorsement of any kind. We
        cannot guarantee that these links will work all the time and we have no control over the
        availability of the linked pages.
      </p>

      <h2>Governing Law and Jurisdiction</h2>
      <p>
        These terms and conditions shall be governed by and construed in accordance with the laws of India.
        Any dispute arising under these terms and conditions shall be subject to the exclusive jurisdiction
        of the courts of India.
      </p>

      <h2>Amendments</h2>
      <p>
        The Department reserves the right to revise these terms and conditions at any time without prior
        notice. By continuing to access or use this website after any revisions become effective, you agree
        to be bound by the revised terms.
      </p>
    </ContentPage>
  );
}
