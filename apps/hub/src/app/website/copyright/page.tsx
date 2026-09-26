import type { Metadata } from "next";
import { ContentPage } from "@/components/website-next/templates/ContentPage";
import { PolicySidebar } from "@/components/website-next/templates/content/policies";

const TITLE = "Copyright Policy";
const DESCRIPTION = "The terms on which material on this website may be reproduced.";

export const metadata: Metadata = {
  title: `${TITLE} | Department of Social Justice & Empowerment`,
  description: DESCRIPTION,
};

/*
 * The Department's own Copyright Policy, dosje.gov.in/home-page/copyright-policy/, read
 * 21 Sep 2026, replacing a paraphrase that added sections the Department never
 * published ("Exceptions", "Trademarks"). The wording is unchanged; the three
 * paragraphs are given headings so a reader can find the clause they need.
 */
export default function Page() {
  return (
    <ContentPage
      title={TITLE}
      breadcrumb={[{ label: "Website Policies", href: "/website/website-policies" }, { label: TITLE }]}
      description={DESCRIPTION}
      lastUpdated="06 Jun 2026"
      sidebar={<PolicySidebar current="/website/copyright" />}
    >
      <h2 id="reproduction">Reproduction of Material</h2>
      <p>
        Material featured on Ministry of Social Justice and Empowerment (MSJE) site may be reproduced free of charge
        in any format or media without requiring specific permission. This is subject to the material being
        reproduced accurately and not being used in a derogatory manner or in a misleading context. Where the
        material is being published or issued to others, the source must be prominently acknowledged. However, the
        permission to reproduce this material does not extend to any material on this site, which is identified as
        being the copyright of a third party. Authorization to reproduce such material must be obtained from the
        copyright holders concerned.
      </p>

      <h2 id="law">Governing Law</h2>
      <p>
        These terms and conditions shall be governed by and construed in accordance with the Indian Laws. Any
        dispute arising under these terms and conditions shall be subject to the exclusive jurisdiction of the
        courts of India.
      </p>

      <h2 id="third-party">Content from Third Parties</h2>
      <p>
        While adding the contents by content contributor, there is a mechanism which checks if the content is
        indigenous or taken from a third party source. If the content is indigenous, it automatically gets added and
        published on the website after reviewed by content publisher or administrator. If it is from a third party
        source, a disclaimer has to be provided by the content contributor that the required copyright has been
        obtained from the said third party source for publishing the respective content.
      </p>
    </ContentPage>
  );
}
