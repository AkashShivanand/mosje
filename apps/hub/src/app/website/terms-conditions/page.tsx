import type { Metadata } from "next";
import { ContentPage } from "@/components/website-next/templates/ContentPage";
import { PolicySidebar } from "@/components/website-next/templates/content/policies";

const TITLE = "Terms & Conditions";
const DESCRIPTION = "The terms on which this website of the Department of Social Justice & Empowerment may be used.";

export const metadata: Metadata = {
  title: `${TITLE} | Department of Social Justice & Empowerment`,
  description: DESCRIPTION,
};

/*
 * The Department's own Terms & Conditions, dosje.gov.in/home-page/terms-conditions/,
 * read 21 Sep 2026, replacing a paraphrase that carried clauses the Department never
 * published (an "Amendments" section, "Content Ownership and Usage"). Edits: "Incase" →
 * "In case", "Departmentand" → "Department and", "organisation" → "organisations"; the
 * text is grouped under three headings so a reader can find the clause they need.
 * The wording of every clause is unchanged.
 */
export default function Page() {
  return (
    <ContentPage
      title={TITLE}
      breadcrumb={[{ label: "Website Policies", href: "/website/website-policies" }, { label: TITLE }]}
      description={DESCRIPTION}
      lastUpdated="06 Jun 2026"
      sidebar={<PolicySidebar current="/website/terms-conditions" />}
    >
      <p>
        This website is designed, developed and maintained by Ministry of Social Justice and Empowerment,
        Government of India.
      </p>

      <h2 id="accuracy">Accuracy and Liability</h2>
      <p>
        Though all efforts have been made to ensure the accuracy and currency of the content on this website, the
        same should not be construed as a statement of law or used for any legal purposes. In case of any ambiguity
        or doubts, users are advised to verify / check with the Department and / or other source, and to obtain
        appropriate professional advice.
      </p>
      <p>
        Under no circumstances will this Department be liable for any expense, loss or damage including, without
        limitation, indirect or consequential loss or damage, or any expense, loss or damage whatsoever arising from
        use, or loss of use, of data, arising out of or in connection with the use of this website.
      </p>

      <h2 id="law">Governing Law</h2>
      <p>
        These terms and conditions shall be governed by and construed in accordance with the Indian Laws. Any
        dispute arising under these terms and conditions shall be subject to the jurisdiction of the courts of
        India.
      </p>

      <h2 id="links">Links to Other Websites</h2>
      <p>
        The information posted on this website could include hypertext links or pointers to information created
        and maintained by non-Government / private organisations. Ministry of Social Justice and Empowerment is
        providing these links and pointers solely for your information and convenience. When you select a link to
        an outside website, you are leaving the Ministry of Social Justice and Empowerment website and are subject
        to the privacy and security policies of the owners / sponsors of the outside website.
      </p>
      <p>Ministry of Social Justice and Empowerment does not guarantee the availability of such linked pages at all times.</p>
    </ContentPage>
  );
}
