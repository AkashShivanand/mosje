import type { Metadata } from "next";
import { Link } from "@mosje/design-system";
import { ContentPage } from "@/components/website-next/templates/ContentPage";

const TITLE = "Welfare of the Other Backward Classes Division";
const DESCRIPTION =
  "Under the Backward Classes Bureau, the Department is mandated to look after the welfare of Backward Classes by implementing the schemes for Backward Classes.";

export const metadata: Metadata = {
  title: `${TITLE} | Department of Social Justice & Empowerment`,
  description: DESCRIPTION,
};

const related = (
  <nav className="wn-panel" aria-labelledby="related-title">
    <h2 className="wn-panel__title" id="related-title">
      Related Pages
    </h2>
    <ul>
      <li>
        <Link href="/website/welfare-of-the-other-backward-classes">
          Welfare of the Other Backward Classes FAQs
        </Link>
      </li>
      <li>
        <Link href="/website/about-the-division">Scheduled Caste Welfare Division</Link>
      </li>
    </ul>
  </nav>
);

/* Body text: dosje.gov.in/about-the-division-welfare-of-the-other-backward-classes/
   as published, read 21 Sep 2026. Edits: "inclusion in /deletionfrom" →
   "inclusion in / deletion from" (missing space); "1985.The Backward Classes
   Division" → "1985. The Backward Classes Division" (missing space after full
   stop). No other edits. */
export default function Page() {
  return (
    <ContentPage
      title={TITLE}
      breadcrumb={[{ label: "About" }, { label: "Divisions", href: "/website/about-the-division" }, { label: TITLE }]}
      description={DESCRIPTION}
      lastUpdated="06 Jun 2026"
      sidebar={related}
    >
      <p>
        Under the Backward Classes Bureau, the Ministry is mandated to look after the welfare of Backward
        Classes, by implementing the schemes for Backward Classes. The Ministry also deals with the
        National Backward Classes Commission (NCBC) which was set up in 1993. The Commission tenders
        advice to the Ministry in respect of castes, sub-castes, synonyms and communities for inclusion
        in / deletion from the central list of Other Backward Classes.
      </p>
      <p>
        Backward Classes means such backward classes of citizens other than the Scheduled Castes and
        Scheduled Tribes as may be specified by the Central Government in the lists prepared by the
        Government of India from time to time for purposes of making provision for the reservation of
        appointments or posts in favour of backward classes of citizens which, in the opinion of that
        Government, are not adequately represented in the services under the Government of India and
        any local or other authority within the territory of India or under the control of the
        Government of India.
      </p>
      <p>
        The affairs of Backward Classes were looked after by the Backward Classes Cell (BCC) in the
        Ministry of Home Affairs prior to 1985. With the creation of a separate Ministry of Welfare in
        1985 (renamed as Ministry of Social Justice and Empowerment on 25.5.1998), the matters relating
        to Scheduled Castes, Scheduled Tribes, Other Backward Classes (OBCs) and Minorities were
        transferred to the new Ministry. Consequent upon the creation of two separate ministries for
        Scheduled Tribes and Minorities, the subject matter pertaining to these two categories were
        transferred to the respective Ministries. The Backward Classes Division in the Ministry looks
        after the policy, planning and implementation of programmes relating to the social and economic
        empowerment of OBCs. It also looks after matters relating to two institutions set up for the
        welfare of OBCs namely, the National Backward Classes Finance and Development Corporation
        (NBCFDC) and the National Commission for Backward Classes (NCBC).
      </p>
    </ContentPage>
  );
}
