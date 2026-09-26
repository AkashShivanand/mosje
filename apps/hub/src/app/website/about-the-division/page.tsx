import type { Metadata } from "next";
import { ContentPage } from "@/components/website-next/templates/ContentPage";
import type { DocumentRow } from "@/components/website-next/templates/content/DocumentTable";
import { DocumentTable } from "@/components/website-next/templates/content/DocumentTable";

const TITLE = "Scheduled Caste Welfare Division";
const DESCRIPTION =
  "The Scheduled Castes Development (SCD) Bureau aims to promote the welfare of Scheduled Castes through their educational, economic and social empowerment.";

export const metadata: Metadata = {
  title: `${TITLE} | Department of Social Justice & Empowerment`,
  description: DESCRIPTION,
};

const DOCS: DocumentRow[] = [
  {
    title:
      "New Guidelines 01.04.2021 – 31.03.2026 for Venture Capital Fund for Scheduled Castes (VCF-SC)",
    published: "21 Dec 2022",
    size: "1.45 MB",
    href: "https://durwo6bhtjtqt.cloudfront.net/wp-content/uploads/2025/11/18521758543759.pdf",
  },
];

/* Body text: dosje.gov.in/about-the-division/ as published, read 21 Sep 2026.
   Edits: "qualitativeeducation" → "qualitative education"; "Grantin-Aid" →
   "Grant-in-Aid"; "to compete their education" → "to complete their education";
   "Minsitry of Welfare" → "Ministry of Welfare"; "195.74crore" → "195.74 crore".
   The lettered/numbered "a./b./1./2." prefixes the live page types inside <p>
   tags are converted to real <ol> lists; the typed prefixes are dropped. */
export default function Page() {
  return (
    <ContentPage
      title={TITLE}
      breadcrumb={[{ label: "About" }, { label: TITLE }]}
      description={DESCRIPTION}
      lastUpdated="06 Jun 2026"
    >
      <h2>Educational Empowerment</h2>
      <p>
        Various scholarships are provided to the students belonging to the Scheduled Castes (SCs) to
        ensure that education is not denied due to the poor financial condition of their families.
        These scholarships are provided at both pre-matric and post-matric levels. Scholarships are
        also provided to SC students for obtaining higher education in India and abroad, including
        premier educational institutions. The scholarships can broadly be classified into the
        following three types:
      </p>
      <ol type="a">
        <li>
          <strong>Pre-Matric Scholarships:</strong> These are summarised below:
          <ol type="1">
            <li>
              <strong>Pre-Matric Scholarship to SC Student:</strong> The objective of the pre-matric
              scheme is to support the parents of SC children for educating their wards, so that the
              incidence of drop outs at this stage is minimized.
            </li>
            <li>
              <strong>
                Pre-Matric Scholarship to the Children of Those Engaged in Occupations Involving
                Cleaning and Prone to Health Hazards:
              </strong>{" "}
              This is also a centrally sponsored scheme, which is implemented by the State Governments
              and Union Territory Administrations, which receive 100% central assistance from the
              Government of India for the total expenditure under the scheme, over and above their
              respective Committed Liability. The scheme was started in 1977-78.
            </li>
          </ol>
        </li>
        <li>
          <strong>Post Matric Scholarship for Scheduled Caste Students (PMS-SC):</strong> The Scheme is
          the single largest intervention by Government of India for educational empowerment of
          scheduled caste students. The Scheme is in operation since 1944. This is a centrally
          sponsored scheme. 100% central assistance is released to State Governments/UTs for
          expenditure incurred by them under the scheme over and above their respective committed
          liability.
        </li>
        <li>
          <strong>Scholarships for obtaining Higher Education and Coaching Scheme:</strong> These
          include:
          <ol type="1">
            <li>
              <strong>Top Class Education for Scheduled Caste Students:</strong> The objective of the
              Scheme is to promote qualitative education amongst students belonging to Scheduled
              Castes, by providing full financial support for pursuing studies beyond 12th class, in
              notified institutes of excellence like IITs, NITs, IIMs, reputed Medical/Law and other
              institutions. Scholarship is awarded to the eligible SC students on securing admission in
              any of the institutions notified by the Ministry.
            </li>
            <li>
              <strong>National Fellowship:</strong> The Scheme provides financial assistance to SC
              students for pursuing research studies leading to M.Phil, Ph.D and equivalent research
              degrees.
            </li>
            <li>
              <strong>National Overseas Scholarship:</strong> The Scheme provides assistance to
              students belonging to SCs, de-notified, nomadic, semi-nomadic tribes etc for pursuing
              higher studies of Master level courses and PhD programmes abroad.
            </li>
            <li>
              <strong>Free Coaching for SC and OBC Students:</strong> The objective of the Scheme is to
              provide coaching of good quality for economically disadvantaged SC and OBC candidates to
              enable them to appear in competitive examinations and succeed in obtaining an appropriate
              job in Public/Private sector. The Scheme provides central assistance to
              institutions/centres run by the Central/State Governments/UT Administrations, Central/
              State Universities, PSUs, Registered Private Institutions, NGOs, etc. Coaching is provided
              for Group &lsquo;A&rsquo; &amp; &lsquo;B&rsquo; examinations conducted by the UPSC, SSC,
              various Railway Recruitment Boards and State PSCs; Officers&rsquo; Grade examinations
              conducted by Banks, Insurance Companies and PSUs; and Premier Entrance examinations for
              admission in Engineering, Medical and Professional courses like Management, Law etc.
            </li>
            <li>
              <strong>
                Scheme for Residential Education for Students in High Schools in Targeted Areas
                (SHRESHTA) (Earlier known as Grant-in-Aid to Voluntarily Organizations working for SCs):
              </strong>{" "}
              The SHRESHTA scheme is being implemented with the objective to provide access to high
              quality education to the students from Scheduled Caste communities to enhance the reach
              of development Intervention of the Government and to fill the gap in service deficient
              SCs dominant areas, in the sector of education through the efforts of grant-in-aid
              institutions (run by NGOs) and residential high schools offering high quality education
              and also to provide environment for socio economic upliftment and overall development of
              the Scheduled Castes (SCs). The scheme is being implemented in two modes. In mode-I, each
              year a specified number (3000) of meritorious SC students in States/UTs are selected
              through the National Entrance Test for SHRESHTA (NETS) conducted by the National Testing
              Agency (NTA) and admitted in class 9th &amp; 11th in the best private residential schools
              affiliated by CBSE/State Boards to complete their education till class 12th. In mode-2,
              financial assistance is provided to the NGOs for running the schools/hostel projects at
              Primary Level &amp; Secondary to provide educational and residential facilities to
              Scheduled Castes (SCs) students.
            </li>
          </ol>
        </li>
      </ol>

      <h2>Economic Empowerment</h2>
      <ol type="a">
        <li>
          <strong>National Scheduled Castes Finance and Development Corporation (NSFDC):</strong> Set
          up under the Ministry, to finance income generating activities of Scheduled Caste
          beneficiaries living below double the poverty line limits (presently Rs 98,000/- per annum
          for rural areas and Rs 1,20,000/- per annum for urban areas). NSFDC assists the target group
          by way of refinancing loans, skill training, Entrepreneurship Development Programmes and
          providing marketing support through State Channelizing Agencies, RRBs, Public Sector Bank and
          Other Institutions.
        </li>
        <li>
          <strong>National Safai Karamcharis Finance and Development Corporation (NSKFDC):</strong> It
          is another corporation under the Ministry which provides credit facilities to beneficiaries
          amongst Safai Karamcharis, manual scavengers and their dependants for income generating
          activities for socio-economic development through State Channelizing Agencies.
        </li>
        <li>
          <strong>Special Central Assistance (SCA) to Scheduled Castes Sub-Plan (SCSP):</strong> It is a
          policy initiative for development of Scheduled Castes in which 100% assistance is given as an
          additive to SCSP of the States/UTs on the basis of certain criteria such as SC population of
          the States/UTs, relative backwardness of States/UTs, percentage of SC families in the
          States/UTs covered by composite economic development programmes in the State Plan to enable
          them to cross the poverty line, etc. It is an umbrella strategy to ensure flow of targeted
          financial and physical benefits from all the general sectors of development for the benefit
          of Scheduled Castes. Under this Scheme, the States/UTs are required to formulate and implement
          Special Component Plan (SCP) for Scheduled Castes as part of their annual plans by earmarking
          resources.
        </li>
        <li>
          <strong>Scheme of Assistance to Scheduled Castes Development Corporations (SCDCs):</strong>{" "}
          Share Capital contribution is released to the State Scheduled Castes Development Corporations
          (SCDCs) under a Centrally Sponsored Scheme in the ratio of 49:51 between Central Government
          and State Governments. There are in total 27 such State-level Corporations which are working
          for the economic development of Scheduled Castes, although some of these Corporations are
          also catering to the requirements of other weaker sections of the Society, e.g. Scheduled
          Tribes, OBCs, Minorities etc. The main functions of SCDCs include identification of eligible
          SC families and motivating them to undertake economic development schemes, sponsoring the
          schemes to financial institutions for credit support, providing financial assistance in the
          form of the margin money at a low rate of interest, providing subsidy out of the funds made
          available to the States under the Scheme of Special Central Assistance to Scheduled Castes
          Sub Plan of the States to reduce the repayment liability and providing necessary tie up with
          other poverty alleviation programmes. The SCDCs are playing an important role in providing
          credit and missing inputs by way of margin money loans and subsidy to the target group. The
          SCDCs finance the employment oriented schemes covering diverse areas of economic activities
          which inter-alia include (i) agriculture and allied activities including minor irrigation (ii)
          small scale industry (iii) transport and (iv) trade and service sector.
        </li>
        <li>
          <strong>Venture Capital Fund for Scheduled Castes:</strong> The objective of the fund is to
          promote entrepreneurship amongst the Scheduled Castes who are oriented towards innovation and
          growth technologies and to provide concessional finance to the scheduled caste entrepreneurs.
          The fund has been launched on 16.01.2015. During 2014-15, Rs. 200 Crore were released
          initially for the Fund to IFCI Limited, which is a Nodal agency to implement it.
        </li>
        <li>
          <strong>Credit Enhancement Guarantee Scheme for Scheduled Castes:</strong> The objective of
          this Scheme is to provide credit guarantee facility to Young and start-up entrepreneurs,
          belonging to Scheduled Castes, who aspire to be part of neo middle class category, with an
          objective to encourage entrepreneurship in the lower strata of the Society resulting in job
          creation besides creating confidence in Scheduled Castes. The Scheme has been launched on
          06.05.2015. Initially, Rs. 200 Crore has been released under the Scheme to IFCI Limited, which
          is a Nodal agency to implement it.
        </li>
      </ol>

      <h2>Social Empowerment</h2>
      <ol type="a">
        <li>
          <strong>The Protection of Civil Rights Act, 1955:</strong> In pursuance of Article 17 of the
          Constitution of India, the Untouchability (Offences) Act, 1955 was enacted and notified on
          08.05.1955. Subsequently, it was amended and renamed in the year 1976 as the &ldquo;Protection
          of Civil Rights Act, 1955&rdquo;. Rules under this Act, viz &ldquo;The Protection of Civil
          Rights Rules, 1977&rdquo; were notified in 1977. The Act extends to the whole of India and
          provides punishment for the practice of untouchability. It is implemented by the respective
          State Governments and Union Territory Administrations. Assistance is provided to States/UTs
          for implementation of Protection of Civil Rights Act, 1955.
        </li>
        <li>
          <strong>Scheduled Castes and Scheduled Tribes (Prevention of Atrocities) Act, 1989:</strong>{" "}
          Assistance is provided to States/UTs for implementation of Scheduled Castes and Scheduled
          Tribes (Prevention of Atrocities) Act, 1989. Financial assistance is provided to the
          States/UTs for implementation of these Acts, by way of relief to atrocity victims, incentive
          for inter-caste marriages, awareness generation, setting up of exclusive Special courts, etc.
          Scheduled Castes and the Scheduled Tribes (Prevention of Atrocities) Amendment Act, 2015 (No.
          1 of 2016) was notified in the Gazette of India (Extraordinary) on 01.01.2016. The Amended
          Act came into force w.e.f. 26.01.2016.
        </li>
        <li>
          <strong>Scheduled Castes and the Scheduled Tribes (Prevention of Atrocities) Rules, 1995:</strong>{" "}
          PoA Rules were amended in June 2014 for enhancing the relief amount to the victims of
          atrocities to become between Rs. 75,000/- to Rs. 7,50,000/- depending upon the nature of an
          offence. Further Amendment done in the Principal Rules namely the Scheduled Castes and the
          Scheduled Tribes (Prevention of Atrocities) Rules, 1995 by the Scheduled Castes and the
          Scheduled Tribes (Prevention of Atrocities) Amendment Rules, 2016 have been notified in the
          Gazette of India Extraordinary on 14th April, 2016.
        </li>
        <li>
          <strong>
            The &lsquo;Prohibition of Employment as Manual Scavengers and their Rehabilitation Act,
            2013&rsquo; (MS Act, 2013):
          </strong>
          <p>
            Eradication of dry latrines and manual scavenging and rehabilitation of manual scavengers in
            alternative occupation has been an area of high priority for the Government. Towards this
            end, a multi-pronged strategy was followed, consisting of the following legislative as well
            as programmatic interventions:
          </p>
          <ol type="1">
            <li>Enactment of &ldquo;Employment of Manual Scavengers and Construction of Dry Latrines (Prohibition) Act, 1993 (1993 Act);&rdquo;</li>
            <li>Integrated Low Cost Sanitation (ILCS) Scheme for conversion of dry latrines into sanitary latrines in urban areas; and</li>
            <li>Launching of National Scheme for Liberation and Rehabilitation of Scavengers (NSLRS).</li>
            <li>Self Employment Scheme for Rehabilitation of Manual Scavengers.</li>
          </ol>
          <p>
            In spite of the above measures taken by the Government, manual scavenging continued to exist
            which became evident with the release of 2011 the Census data indicating existence of more
            than 26 lakh insanitary latrines in the country. Therefore, Government decided to enact
            another law to cover all types of insanitary latrines and situations which give occasion for
            manual scavenging. The &lsquo;Prohibition of Employment as Manual Scavengers and their
            Rehabilitation Act, 2013&rsquo; (MS Act, 2013) was passed by the Parliament in September,
            2013 and has come into force from 6th December, 2013. This Act intends to, inter alia,
            achieve its objectives to:
          </p>
          <ol type="1">
            <li>Identify and eliminate the insanitary latrines.</li>
            <li>
              Prohibit:
              <ol type="i">
                <li>Employment as Manual Scavengers</li>
                <li>Hazardous manual cleaning of sewer and septic tanks</li>
              </ol>
            </li>
            <li>Identify and rehabilitate the manual scavengers.</li>
          </ol>
        </li>
      </ol>

      <h2>Other Schemes</h2>
      <ol type="a">
        <li>
          <strong>Pradhan Mantri Adarsh Gram Yojana (PMAGY):</strong> The Centrally Sponsored Scheme of
          &lsquo;Pradhan Mantri Adarsh Gram Yojana&rsquo; (PMAGY) is being implemented since 2009-10 for
          integrated development of Scheduled Castes (SC) majority villages having SC Population more
          than 50%. The principal objective of the Scheme is integrated development of SC Majority
          Villages:
          <ol type="1">
            <li>Primarily through convergent implementation of the relevant Central and State Schemes;</li>
            <li>
              To take up identified activities which do not get covered under the existing Central and
              State Government Schemes through &lsquo;Gap-filling&rsquo; funds provided as Central
              Assistance to the extent of Rs. 20.00 lakh per village.
            </li>
          </ol>
          <p>
            Initially, the scheme was launched on &lsquo;Pilot basis&rsquo; in 1000 villages in 05 States
            viz. Assam, Bihar, Himachal Pradesh, Rajasthan and Tamil Nadu. The Scheme was further revised
            w.e.f. 22.01.2015 and extended to 1500 SC majority villages in Punjab, Madhya Pradesh, Andhra
            Pradesh, Karnataka, Uttar Pradesh, Telangana, Haryana, Chhattisgarh, Jharkhand, Assam and
            Odisha. Since 2018-19, the Scheme is being implemented as a continuous Scheme with revised
            implementation guidelines. The details implementation of the Scheme since 2018-19 may be
            viewed at pmagy.gov.in.
          </p>
        </li>
        <li>
          <strong>Babu Jagjivan Ram Chhatrawas Yojna:</strong> The primary objective of the Scheme is to
          attract implementing agencies for undertaking hostel construction programme with a view to
          provide hostel facilities to SC boys and girls studying in middle schools, higher secondary
          schools, colleges and universities. The Scheme provides central assistance to State
          Governments/UT Administrations, Central &amp; State Universities/Institutions for fresh
          construction of hostel buildings and for expansion of the existing hostel facilities. The NGOs
          and Deemed Universities in private sector are eligible for central assistance only for
          expansion of their existing hostels facilities.
        </li>
        <li>
          <strong>Upgradation of Merit of SC Students:</strong> The objective of the Scheme is to
          upgrade the merit of Scheduled Caste students studying in Class IX to XII by providing them
          with facilities for education in residential/non-residential schools. Central assistance is
          released to the State Governments/UT Administrations for arranging remedial and special
          coaching for Scheduled Caste students. While remedial coaching aims at removing deficiencies
          in school subjects, special coaching is provided with a view to prepare students for
          competitive examinations for entry into professional courses like Engineering and Medical.
        </li>
        <li>
          <strong>Dr. Ambedkar Foundation:</strong> Dr. Ambedkar Foundation was set up on 24th March
          1992, as a registered body, under the Registration of Societies Act, 1860, under the aegis of
          the Ministry of Welfare, Government of India. The primary object of setting up of the
          Foundation is to promote Dr. Ambedkar&rsquo;s ideology and philosophy and also to administer
          some of the schemes which emanated from the Centenary Celebration Committee&rsquo;s
          recommendations.
        </li>
        <li>
          <strong>Dr. Ambedkar International Centre at Janpath, New Delhi:</strong> Setting up of
          &lsquo;Dr. Ambedkar National Public Library&rsquo; now renamed as &lsquo;Dr. Ambedkar
          International Centre&rsquo; at Janpath New Delhi was one of the important decisions taken by
          the Centenary Celebrations Committee (CCC) of Babasaheb Dr. B.R. Ambedkar headed by the then
          Hon&rsquo;ble Prime Minister of India. As on date the entire land of Plot &lsquo;A&rsquo; at
          Janpath, New Delhi measuring 3.25 acre is in possession of the M/o SJ&amp;E for setting up of
          the &lsquo;Centre&rsquo;. The responsibility of the construction of the &lsquo;Centre&rsquo;
          has been assigned to National Building Construction Corporation (NBCC) at a cost of Rs. 195.74
          crore. The Hon&rsquo;ble Prime Minister has laid the foundation of Dr. Ambedkar International
          Centre on 20th April, 2015. The National Building Construction Company (NBCC), the executing
          agency has already started the construction work at site and it is at an advance stage.
        </li>
        <li>
          <strong>Dr. Ambedkar National Memorial at 26, Alipur Road, Delhi:</strong> The Dr. Ambedkar
          Mahaparinirvan Sthal at 26, Alipur Road, Delhi, was dedicated to the Nation by the then
          Hon&rsquo;ble Prime Minister of India on 02.12.2003 and he had also inaugurated the development
          work at the Memorial at 26, Alipur Road, Delhi. The responsibility of the construction of Dr.
          Ambedkar National Memorial has been assigned to the Central Public Works Department (CPWD) at
          an approx. cost of Rs. 99.00 Crore. The Hon&rsquo;ble Prime Minister has laid the foundation of
          the Memorial on 21st March, 2016. The CPWD, the executing agency has already started the
          construction work at site.
        </li>
        <li>
          <strong>Babu Jagjivan Ram National Foundation:</strong> The Babu Jagjivan Ram National
          Foundation was established by the Government of India as an autonomous organization under the
          Ministry of Social Justice &amp; Empowerment and registered under The Societies Registration
          Act, 1860 on 14th March 2008. The main aim of the Foundation is to propagate the ideals of the
          late Babu Jagjivan Ram, on social reform as well as his ideology, philosophy of life, mission
          and vision to create a casteless and classless society.
        </li>
      </ol>

      <h2>Documents</h2>
      <DocumentTable caption="Documents Published by the Scheduled Caste Welfare Division" rows={DOCS} />
    </ContentPage>
  );
}
