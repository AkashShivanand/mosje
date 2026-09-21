import type { Metadata } from "next";
import Link from "next/link";
import { ContentPage } from "@/components/website-next/templates/ContentPage";

const TITLE = "Activities of the Ministry: Official Language";
const DESCRIPTION =
  "The status of implementation of the Official Language Policy in the Department of Social Justice & Empowerment.";

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
        <Link href="/website/official-language-act">The Official Languages Act, 1963</Link>
      </li>
      <li>
        <Link href="/website/official-language-background">Official Language: Background</Link>
      </li>
    </ul>
  </nav>
);

/*
 * Body text: dosje.gov.in/activities-of-the-ministry-official-language/ as
 * published, read 21 Sep 2026. The live page sets its sub-topics as bold
 * paragraphs (and, from "2." onward, bold numeral-prefixed paragraphs) rather
 * than real headings; converted here to h3, numeral prefixes dropped since the
 * numbering served no cross-reference on the page. Lists faked with "(i)",
 * "(ii)", "(iii)" inside a <p> converted to a real <ol type="i">. No typos
 * corrected — none provable against a published reference for this text.
 */
export default function Page() {
  return (
    <ContentPage
      title={TITLE}
      breadcrumb={[{ label: "About" }, { label: "Official Language", href: "/website/official-language-act" }, { label: TITLE }]}
      description={DESCRIPTION}
      lastUpdated="06 Jun 2026"
      sidebar={related}
    >
      <h2>Activities of the Ministry</h2>

      <h3>Status of Implementation</h3>
      <p>
        Overall position of implementation of the Official Language Policy in the Department of
        Social Justice &amp; Empowerment.
      </p>

      <h3>Compliance of Section 3(3) of the Official Language Act</h3>
      <p>The following documents are being issued in both Hindi &amp; English:</p>
      <ol type="i">
        <li>
          Resolutions, general orders, Rules, Notifications, Administrative, Reports or other
          Reports or Press communiques.
        </li>
        <li>Administrative and other Reports and Official Papers laid before a House or the Houses of the Parliament.</li>
        <li>
          Contacts and agreements executed and licenses, permits, notices and forms of tender
          issued. If any of the above documents is issued only in English during any quarter by
          any office under the Department, the same is asked to be rectified during the review of
          the quarterly progress reports of that office.
        </li>
      </ol>
      <p>
        The schemes meant for the welfare of the common man are prepared both in Hindi and English
        so that the information may reach to the grass-root level. The instructions have been
        issued to the concerned sections to correspond in Hindi with the non-governmental
        organizations/voluntary organizations/other organizations working under the Department.
      </p>

      <h3>Use of Hindi in Correspondence</h3>
      <p>
        The correspondence is being made in Hindi with the various offices of the State
        Governments/Union Territory Administrations and the Central Govt. located in region A and
        B as well as with the individuals approaching the Department to get their personal
        grievances redressed. The standard proforma drafts of various communications have been
        translated in Hindi and circulated among the concerned sections. Orders have been issued
        to the employees trained in Hindi to do their work in Hindi only.
      </p>

      <h3>Loading Hindi Software on Computers</h3>
      <p>
        Hindi Software has been loaded on all the computers in the Department. In order to
        provide bilingual facility on all the computers, and in order to make the bilingual
        facility useful, the typists and stenographers are being nominated for Hindi typing and
        Hindi stenography as per the prescribed training schedule of the Department of Official
        Language. Recently more than 50% of the computers reinstalled in the Department have been
        loaded with Hindi Software and training is being imparted to officers/employees in order
        to make them capable of working on the Computers in Hindi.
      </p>

      <h3>Compliance of Rule 5 of the Official Language Rules, 1976</h3>
      <p>
        As per the rules, all the letters received in Hindi are being responded to in Hindi only.
        The issue of Hindi correspondence is reviewed in the quarterly meetings of the Official
        Language Implementation Committee of the Department. The officers have been given
        instructions to ensure that the letters received in Hindi are replied to in Hindi only.
      </p>

      <h3>Training in Hindi, Hindi Typing and Hindi Stenography</h3>
      <p>
        All the officers/employees of the Department have got working knowledge of Hindi. As far
        as the training in Hindi Typing is concerned, the officials are being nominated by the
        administration for training in Hindi typing/Hindi Stenography.
      </p>

      <h3>Apex Meetings</h3>
      <p>
        Discussions are held in Hindi and English at all high level meetings. Material to be
        placed before the committees is being prepared in Hindi along with in English. The
        minutes of all important meetings like Standing Committee and Consultative Committee are
        also circulated in Hindi.
      </p>

      <h3>Inspections of Subordinate Offices as Well as Sections in the Department</h3>
      <p>
        With a view to see the status of implementation of Official Language policy inspections
        are being done by Hindi Officers of the Department periodically.
      </p>
    </ContentPage>
  );
}
