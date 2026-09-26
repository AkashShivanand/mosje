import type { Metadata } from "next";
import { ContentPage } from "@/components/website-next/templates/ContentPage";
import { PolicySidebar } from "@/components/website-next/templates/content/policies";

const TITLE = "Hyperlinking Policy";
const DESCRIPTION = "Links from this website to other websites, and from other websites to this one.";

export const metadata: Metadata = {
  title: `${TITLE} | Department of Social Justice & Empowerment`,
  description: DESCRIPTION,
};

/*
 * The Department's own Hyperlinking Policy, dosje.gov.in/home-page/hyperlinking-policy/,
 * read 21 Sep 2026, replacing a paraphrase with sections the Department never published
 * ("No Endorsement Implied", "Conditions for Linking"). Edits: the two h5 run-in
 * headings are h2 in Title Case (ACC-03, TYP-06). Wording otherwise unchanged, including
 * "twitter" and "updations", which are the Department's.
 */
export default function Page() {
  return (
    <ContentPage
      title={TITLE}
      breadcrumb={[{ label: "Website Policies", href: "/website/website-policies" }, { label: TITLE }]}
      description={DESCRIPTION}
      lastUpdated="06 Jun 2026"
      sidebar={<PolicySidebar current="/website/hyperlinking-policy" />}
    >
      <h2 id="external">Links to External Websites and Portals</h2>
      <p>
        At many places in Department of Social Justice and Empowerment (DoSJE) website, you shall find links to
        other Websites / Portals / Web applications / Mobile apps. These links have been placed for your
        convenience. DoSJE is not responsible for the contents and reliability of the linked destinations and does
        not necessarily endorse the views expressed in them. Mere presence of the link or its listing on Department
        of Social Justice and Empowerment website should not be assumed as endorsement of any kind. We cannot
        guarantee that these links will work all the time and we have no control over availability of linked
        destinations.
      </p>
      <p>
        The DoSJE website can have links to various non-government websites also such as Facebook, twitter etc. We
        do not undertake any responsibility for the contents and do not support any views expressed in these
        hyperlinks.
      </p>

      <h2 id="inbound">Links to This Website from Other Websites</h2>
      <p>
        We do not object to you linking directly to the information that is hosted on this site and no prior
        permission is required for the same. However, we would like you to inform us about any links provided to
        this website so that you can be informed of any changes or updations therein. Also, we do not permit our
        pages to be loaded into frames on your site. The pages belonging to this site must load into a newly opened
        browser window of the User.
      </p>
    </ContentPage>
  );
}
