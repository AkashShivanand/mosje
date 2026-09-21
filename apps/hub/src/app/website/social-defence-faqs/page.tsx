import type { Metadata } from "next";
import NextLink from "next/link";
import { Link } from "@mosje/design-system";
import { ContentPage } from "@/components/website-next/templates/ContentPage";
import { TableWrap } from "@/components/website-next/templates/content/TableWrap";

const TITLE = "Social Defence — FAQs";
const DESCRIPTION =
  "Frequently asked questions about the Nasha Mukt Bharat Abhiyaan, the Department's nationwide campaign against substance abuse.";

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
        <NextLink href="/website/about-the-division-social-defence">Social Defence Division</NextLink>
      </li>
    </ul>
  </nav>
);

/* Body text: dosje.gov.in/social-defence-faqs/ as published, read 21 Sep 2026.
   Typos corrected: "andimplementation" -> "and implementation"; "100meters" -> "100 meters"
   (two occurrences); "t h e sale" -> "the sale"; "(2)NGOs" -> "(2) NGOs"; "thiscause" ->
   "this cause"; "Empowerment,implementation" spacing normalised. The two Nasha Mukt campaign
   committee tables had a member's designation wrap onto its own table row in the source
   (a blank Role cell following a "Member" row) — the two halves are rejoined into one row
   each so the table does not appear to list two half-empty members. The "functions of the
   District Nasha Mukt Campaign Committee" answer was published as two separate ordered
   lists (the first holding a single item); flattened into one continuously numbered list,
   no items removed or reordered. */
export default function Page() {
  return (
    <ContentPage
      title={TITLE}
      breadcrumb={[
        { label: "About" },
        { label: "Divisions", href: "/website/about-the-division" },
        { label: TITLE },
      ]}
      description={DESCRIPTION}
      lastUpdated="06 Jun 2026"
      sidebar={related}
    >
      <h2>Social Defence — Frequently Asked Questions</h2>

      <h3>When was Nasha Mukt Bharat Abhiyaan (NMBA) launched?</h3>
      <p>
        Nasha Mukt Bharat Abhiyaan was launched on 15th August 2020 by the Ministry of Social Justice
        &amp; Empowerment in 272 identified districts.
      </p>

      <h3>How many districts of the country is NMBA currently implemented?</h3>
      <p>
        NMBA was launched on 15th August 2020 by the Ministry of Social Justice &amp; Empowerment in
        272 most vulnerable districts of the country based on the inputs received from NCB from the
        supply side and based on the findings of the National Survey on Drugs. During August 2022, NMBA
        was expanded to 372 districts and Nasha Mukt Bharat Abhiyaan is now being implemented in all the
        districts of the country since 15th August 2023.
      </p>

      <h3>What are the components that are included in the Action Plan of NMBA?</h3>
      <p>
        The Nasha Mukt Bharat Abhiyaan is a three-pronged attack combining the supply curb by the
        Narcotics Control Bureau, Outreach and Awareness and Demand Reduction effort by Social Justice
        and Empowerment and treatment through the Health Department. The Action Plan has the following
        components:
      </p>
      <ol>
        <li>Awareness generation programmes</li>
        <li>Focus on higher educational Institutions, university campuses and schools</li>
        <li>Reaching out into the Community and identifying dependent populations,</li>
        <li>Focus on counselling and treatment facilities in hospitals and</li>
        <li>rehabilitation centres</li>
        <li>Capacity building programmes for service providers</li>
      </ol>

      <h3>What is the constitution of State Level Nasha Mukt Campaign Committee?</h3>
      <TableWrap label="Constitution of the State Level Nasha Mukt Campaign Committee">
        <table>
          <caption className="sr-only">Constitution of the State Level Nasha Mukt Campaign Committee</caption>
          <thead>
            <tr>
              <th scope="col">Designation</th>
              <th scope="col">Role</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Principal Secretary Social Welfare/Drugs</td>
              <td>Chairperson</td>
            </tr>
            <tr>
              <td>Representative of DG Police</td>
              <td>Member</td>
            </tr>
            <tr>
              <td>Representative of Spl Cs/Prl Secretary/Secy Health Department</td>
              <td>Member</td>
            </tr>
            <tr>
              <td>Representative of the Narcotics Control Bureau</td>
              <td>Member</td>
            </tr>
            <tr>
              <td>Department of Higher Education</td>
              <td>Member</td>
            </tr>
            <tr>
              <td>Department of School Education</td>
              <td>Member</td>
            </tr>
            <tr>
              <td>Department of Women and Child Welfare</td>
              <td>Member</td>
            </tr>
            <tr>
              <td>Department of Information and Public Relations/Media</td>
              <td>Member</td>
            </tr>
            <tr>
              <td>(4) NGOs working in the field of drugs (nominated by Principal Secretary of Social Welfare/Drugs)</td>
              <td>Members</td>
            </tr>
            <tr>
              <td>(3) Retired Senior Civil Servants who contributed to this cause nominated by the Principal Secretary</td>
              <td>Members</td>
            </tr>
            <tr>
              <td>State Level Coordinating Agency of Ministry of Social Justice Govt of India</td>
              <td>Member</td>
            </tr>
            <tr>
              <td>State Coordinator of PMU of Social Justice Govt of India</td>
              <td>Member</td>
            </tr>
            <tr>
              <td>Director Social Welfare Secretary</td>
              <td>Member</td>
            </tr>
          </tbody>
        </table>
      </TableWrap>

      <h3>What are the functions of the State-Level Nasha Mukt Campaign Committee?</h3>
      <p>The functions of the State Level Nasha Mukt campaign committee are as follows:</p>
      <ol>
        <li>Formulating a State Campaign Activity under the Nasha Mukt Bharat Campaign</li>
        <li>
          Ensuring formulation and implementation of the District Level Nasha Mukt campaigns in
          identified vulnerable districts in the State.
        </li>
        <li>Guiding and overseeing the implementation of district-level Nasha Mukt Campaigns</li>
        <li>To increase community participation and public cooperation.</li>
        <li>Conducting training programmes for the service providers at State level, district level, and below district level</li>
        <li>Having a social media strategy for the State campaign and implementation of the same.</li>
        <li>Visit to the Institutions, and hospitals for assessment of preparedness and implementation</li>
        <li>Ensuring strict implementation of the ban on the sale of cigarettes within 100 meters of any educational institution (Rule refers).</li>
        <li>Obtaining information on the availability/sale of drugs and reviewing the action taken on such information.</li>
      </ol>

      <h3>What is the constitution of District Level Nasha Mukt Bharat Campaign Committee?</h3>
      <TableWrap label="Constitution of the District Level Nasha Mukt Bharat Campaign Committee">
        <table>
          <caption className="sr-only">Constitution of the District Level Nasha Mukt Bharat Campaign Committee</caption>
          <thead>
            <tr>
              <th scope="col">Designation</th>
              <th scope="col">Role</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>District Collector</td>
              <td>Chairperson</td>
            </tr>
            <tr>
              <td>District Superintendent of Police</td>
              <td>Member</td>
            </tr>
            <tr>
              <td>District Legal Services Authority – Representative</td>
              <td>Member</td>
            </tr>
            <tr>
              <td>District Judge</td>
              <td>–</td>
            </tr>
            <tr>
              <td>District Medical Supdt./Officer</td>
              <td>Member</td>
            </tr>
            <tr>
              <td>District Education Officer – Representing higher education and school education</td>
              <td>Member</td>
            </tr>
            <tr>
              <td>Regional Joint Director (Education)</td>
              <td>Member</td>
            </tr>
            <tr>
              <td>CDPO/Senior Representative of Women and Child Development</td>
              <td>Member</td>
            </tr>
            <tr>
              <td>(2) NGOs working in the field of drugs and Alcohol (to be nominated by District magistrate/Collector)</td>
              <td>Member</td>
            </tr>
            <tr>
              <td>(2) Retired Senior Civil Servants who contributed to this cause nominated by District Magistrate/Collector</td>
              <td>Member</td>
            </tr>
            <tr>
              <td>
                Integrated Rehabilitation Centre for Addicts (IRCA) (Where there is no IRCA in the
                District, the State Level Coordinating Agency of the Ministry of Social Justice and
                Empowerment, Govt of India)
              </td>
              <td>Member</td>
            </tr>
            <tr>
              <td>State Coordinator of PMU of Ministry of Social Justice and Empowerment, Government of India</td>
              <td>Member</td>
            </tr>
            <tr>
              <td>District Social welfare officer</td>
              <td>Member</td>
            </tr>
          </tbody>
        </table>
      </TableWrap>

      <h3>What are the functions of the District Nasha Mukt Campaign Committee?</h3>
      <p>The functions of the District Nasha Mukt Campaign Committee are as follows:</p>
      <ol>
        <li>Ensuring formulation and implementation of the District Nasha Mukt campaign.</li>
        <li>Conducting awareness generation programmes in all schools and colleges in the districts for students, teachers and parents.</li>
        <li>Formulation of student clubs in colleges to discuss and spread awareness</li>
        <li>Identification of victims and users and taking them to Rehabilitation Centres/Hospitals for counselling and treatment.</li>
        <li>Monitoring of counselling and treatment facilities in the districts.</li>
        <li>Ensuring strict implementation of the ban on the sale of cigarettes within 100 meters of any educational institution (Rule refers).</li>
        <li>Obtaining information on the availability/sale of drugs and reviewing the action taken on such information.</li>
        <li>Visit Institutions and hospitals who are providing services.</li>
        <li>Conducting training programmes for the service providers at the district level and below the district level.</li>
        <li>To increase community participation and public cooperation.</li>
        <li>Having a social media strategy for the district campaign and implementation of the same.</li>
        <li>Feedback on the progress to the State Level Campaign Committee and the Ministry.</li>
        <li>
          Identifying volunteers in the community, giving them ID cards/badges, and training them as a
          community peer to spread awareness in the Community (an online training module would be
          supplied by the Ministry).
        </li>
      </ol>

      <h3>What activities have been done under Nasha Mukt Bharat Abhiyaan (NMBA) so far till September 2024?</h3>
      <ul>
        <li>
          Till now, through the various activities undertaken on-ground, 12.78+ crore people have been
          sensitized on substance use including 4.08+ crore Youth and 2.59+ crore Women.
        </li>
        <li>
          Participation of 3.70+ Lakh educational institutions has ensured that the message of the
          Abhiyaan reaches children and youth of the country.
        </li>
        <li>A strong force of 5,000+ Master Volunteers (MVs) have been identified and trained.</li>
        <li>Awareness through official Social Media accounts of the Abhiyaan on Twitter, Facebook &amp; Instagram.</li>
        <li>
          NMBA Mobile Application developed to gather and collect the data of NMBA activities and
          represent them on the NMBA Dashboard at district, state and national levels.
        </li>
        <li>
          NMBA Website (
          <Link href="https://www.dosje.gov.in/organisation/nasha-mukt-bharat-abhiyaan" external>
            dosje.gov.in/organisation/nasha-mukt-bharat-abhiyaan
          </Link>
          ) provides detailed information and insights to the user/viewer about the Abhiyaan, an online
          discussion forum, NMBA dashboard, and e-pledge.
        </li>
        <li>
          A National Online Pledge to be Drug-Free had 1.67+ Crore students from 99,595 educational
          institutions pledging to be drug-free.
        </li>
        <li>
          Events like &lsquo;Nashe se Azaadi- National Youth and Students Interaction Programme&rsquo;,
          &lsquo;Naya Bharat, Nasha Mukt Bharat&rsquo;, and &lsquo;NMBA Interaction with NCC&rsquo; are
          regularly organized to engage and connect with youth and other stakeholders.
        </li>
        <li>
          MoUs have been signed with six Spiritual/Social Service organizations like The Art of Living,
          Brahma Kumaris, Sant Nirankari Mission, All World Gayatri Parivar, ISKCON and Shri Ram Chandra
          Mission to support NMBA and conduct mass awareness activities.
        </li>
        <li>
          A Toll-free Helpline for de-addiction, 14446, is set up to provide primary counselling and
          immediate referral services to the persons seeking help through this helpline. Till now,
          4.05+ lakh calls have been received on the Helpline.
        </li>
        <li>
          Commemoration of International Day against Drug Abuse and Illicit Trafficking 2024, wherein
          all the States/Districts conducted several activities reaching out to 7.5+ lakh people.
        </li>
        <li>NMBA Interaction with NCC cadets (700 cadets present physically; 40,000 cadets present online across the country).</li>
        <li>A National Youth and Students Interaction Program was conducted with participation from 500 educational institutions and 1000 students.</li>
        <li>
          There has been an increase in the number of de-addiction centres from 490 (2019-20) to 648
          centres (2023-24). All these centres have been geo-tagged for ease of access to persons in
          need.
        </li>
        <li>There has been an increase in beneficiaries from around 2 lakhs (2019-20) to 6 lakhs (2023-24) since the NMBA launch.</li>
        <li>
          Launch of Navchetna Modules: School-based learning modules in 300 districts (100 schools per
          district; 30000 schools; 30,000*30 teachers=9 lakh teachers; Funds released to 15 States i.e.
          Chandigarh, Assam, Delhi, Gujarat, Haryana, Himachal Pradesh, Jharkhand, Meghalaya, Manipur,
          Uttar Pradesh, Rajasthan and Union Territory of Jammu &amp; Kashmir for first level training).
        </li>
        <li>To date, more than 82,000 recovered substance users have taken the Nasha Mukt pledge online through the NMBA portal.</li>
        <li>Implementation of NMBA in Border Areas by training Border guarding forces with specialized modules and establishing de-addiction centres in these areas.</li>
        <li>
          Sportspersons like Olympic Medalist Ravi Kumar Dahiya, Suresh Raina, Ajinkhya Rahane, Sandeep
          Singh, and Savita Poonia have shared messages in support of NMBA to promote Sports as life
          skills to ensure a healthy and drug-free lifestyle among youth
        </li>
        <li>
          To enhance the avenues for treatment of substance use disorders in the Country, MoSJE has
          decided to entrust Lokopriya Gopinath Bordoloi Regional Institute of Mental Health, Tezpur,
          Assam with the responsibility of setting up one Addiction Treatment Facility (ATF) in each
          identified state of North East Region under NAPDDR. In this direction, on 22.7.2024 at 12.30
          PM, this ministry signed an MoU with LGBRIMH, Tezpur, Assam for setting up of ATFs in NER
        </li>
      </ul>

      <h3>
        Whether the Ministry has signed MoUs with spiritual organizations for spreading the message of
        NMBA among the youth, women, students etc.?
      </h3>
      <p>
        MoUs have been signed with Six Spiritual/Social Service organizations like The Art of Living,
        Brahma Kumaris, Sant Nirankari Mission, All World Gayatri Parivar, ISKCON and Shri Ram Chandra
        Mission to support NMBA and conduct mass awareness activities.
      </p>

      <h3>How Social Media is being utilized to spread the message for NMBA?</h3>
      <ul>
        <li>
          The Ministry has tried to take over the online space and engage with the various stakeholders
          through a range of activities and online events. The Social Media accounts of the Abhiyaan on
          Twitter, Facebook &amp; Instagram have acted as effective mediums for the online presence &amp;
          events which regularly post not only about the happening of the Abhiyaan in the state and
          districts but also inspiring &amp; motivating information on substance abuse and its recovery.
        </li>
        <li>
          A host of online events have also been organized with the involvement and participation of the
          highest authorities from the Ministry as well as the States &amp; Districts, subject matter
          &amp; domain experts from different fields, professionals working in the area of substance
          abuse and the youth at large. Panel Discussions with the District Collectors/Magistrates
          implementing NMBA have been very popular among the viewers as they provide insights into the
          innovative &amp; unique activities taken up by the district for the Abhiyaan and are also a
          good platform for experiential sharing and learning. Various competitions have been conducted
          on the online pages of the Abhiyaan with a lot of youth participating and engaging with the
          online activities. All these events are live-streamed on the pages of the Abhiyaan to expand
          and extend the reach of the Abhiyaan.
        </li>
      </ul>
    </ContentPage>
  );
}
