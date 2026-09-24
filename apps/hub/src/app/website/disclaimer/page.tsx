import type { Metadata } from "next";
import Link from "next/link";
import { ContentPage } from "@/components/website-next/templates/ContentPage";
import { PolicySidebar } from "@/components/website-next/templates/content/policies";

const TITLE = "Disclaimer";
const DESCRIPTION =
  "The limits of the Department's responsibility for the content of this website and of the websites it links to.";

export const metadata: Metadata = {
  title: `${TITLE} | Department of Social Justice & Empowerment`,
  description: DESCRIPTION,
};

/*
 * GIGW 3.0 page (issue MAN-04). NEWLY AUTHORED on 21 Sep 2026 — dosje.gov.in has no
 * Disclaimer (/disclaimer/ returns 404) — so `lastUpdated` is the authoring date.
 *
 * SOURCE OF THE WORDING: the disclaimer clauses of the GIGW Compliance & Certification
 * Handbook's Terms & Conditions template (§5.4.3f, docs/guidelines/GIGW-3.0/supplementary/
 * Compliance-and-Certification-Handbook.pdf, pp. 25–26), with "<Name of Department>"
 * replaced by the Department's name. The first four clauses are also what the
 * Department's own Terms & Conditions page publishes. Nothing here is newly written
 * except the one sentence pointing to the policies that govern reproduction and linking.
 * The Department's Web Information Manager should approve it before launch (GIGW 5.4.3).
 */
export default function Page() {
  return (
    <ContentPage
      title={TITLE}
      breadcrumb={[{ label: "Website Policies", href: "/website/website-policies" }, { label: TITLE }]}
      description={DESCRIPTION}
      lastUpdated="21 Sep 2026"
      sidebar={<PolicySidebar current="/website/disclaimer" />}
    >
      <p>
        This website is designed, developed and maintained by the Department of Social Justice &amp; Empowerment,
        Ministry of Social Justice &amp; Empowerment, Government of India.
      </p>

      <h2 id="content">Content of This Website</h2>
      <p>
        Though all efforts have been made to ensure the accuracy and currency of the content on this website, the
        same should not be construed as a statement of law or used for any legal purposes. In case of any ambiguity
        or doubts, users are advised to verify or check with the Department and other sources, and to obtain
        appropriate professional advice.
      </p>
      <p>
        Under no circumstances will the Department be liable for any expense, loss or damage including, without
        limitation, indirect or consequential loss or damage, or any expense, loss or damage whatsoever arising
        from use, or loss of use, of data, arising out of or in connection with the use of this website.
      </p>

      <h2 id="links">Links to Other Websites</h2>
      <p>
        The information posted on this website could include hypertext links or pointers to information created
        and maintained by non-Government or private organisations. The Department is providing these links and
        pointers solely for your information and convenience. When you select a link to an external website, you
        are leaving the Department&rsquo;s website and are subject to the privacy and security policies of the
        owners or sponsors of the external website.
      </p>
      <ul>
        <li>The Department does not guarantee the availability of linked pages at all times.</li>
        <li>
          The Department cannot authorise the use of copyrighted material contained in a linked website. Users are
          advised to request such authorisation from the owners of the linked website.
        </li>
        <li>
          The Department does not guarantee that linked websites comply with the Guidelines for Indian Government
          Websites.
        </li>
      </ul>

      <h2 id="law">Governing Law</h2>
      <p>
        This disclaimer shall be governed by and construed in accordance with the laws of India. Any dispute
        arising under it shall be subject to the jurisdiction of the courts of India.
      </p>
      <p>
        The terms on which material from this website may be reproduced, and on which other websites may link to
        it, are set out in the <Link href="/website/copyright">Copyright Policy</Link> and the{" "}
        <Link href="/website/hyperlinking-policy">Hyperlinking Policy</Link>.
      </p>
    </ContentPage>
  );
}
