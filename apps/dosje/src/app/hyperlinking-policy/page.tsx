import type { Metadata } from "next";
import { ContentPage } from "@/components/templates/ContentPage";

export const metadata: Metadata = {
  title: "Hyperlinking Policy — Department of Social Justice & Empowerment",
  description:
    "Hyperlinking Policy covering links from this website to external sites and permission to link to this website of the Department of Social Justice & Empowerment (DoSJE), Government of India.",
};

export default function HyperlinkingPolicyPage() {
  return (
    <ContentPage
      title="Hyperlinking Policy"
      breadcrumb={[{ label: "Policies" }, { label: "Hyperlinking Policy" }]}
      description="Our policy on links from this website to external sites, and on linking to this website of the Department of Social Justice & Empowerment."
      lastUpdated="06 Jun 2026"
    >
      <h2>Links to External Websites / Portals</h2>
      <p>
        At many places on this website of the Department of Social Justice &amp; Empowerment (DoSJE),
        Government of India, you shall find links to other websites and portals. These links have been placed
        for your convenience. The Department is not responsible for the contents and reliability of the
        linked websites and does not necessarily endorse the views expressed in them. Mere presence of the
        link or its listing on this website should not be assumed as endorsement of any kind. We cannot
        guarantee that these links will work all the time and we have no control over the availability of the
        linked pages.
      </p>

      <h2>Links to This Website from Other Websites</h2>
      <p>
        We do not object to you linking directly to the information that is hosted on this website and no
        prior permission is required for the same. However, we would like you to inform us about any links
        provided to this website so that you can be informed of any changes or updates to it. Also, we do not
        permit our pages to be loaded into frames on your site. The pages belonging to this website must load
        into a newly opened browser window of the user.
      </p>

      <h2>No Endorsement Implied</h2>
      <p>
        The fact that a website is linked to this portal, or links to this portal, does not imply any
        endorsement, sponsorship, approval or affiliation by or with the Department of Social Justice &amp;
        Empowerment. Links to or from external websites are provided solely for the convenience of users and
        do not constitute a recommendation of the products, services or information offered by those sites.
      </p>

      <h2>Conditions for Linking</h2>
      <ul>
        <li>The website linking to this portal must not present the content of this website in a misleading,
          false or derogatory context.</li>
        <li>This website must not be framed within, or otherwise made to appear as a part of, any other
          website.</li>
        <li>The linking website must not misrepresent its relationship with the Department, or imply that the
          Department approves or endorses it.</li>
        <li>The linking website must not use the official emblems, logos or crests of the Department or the
          Government of India without prior written authorisation.</li>
      </ul>
    </ContentPage>
  );
}
