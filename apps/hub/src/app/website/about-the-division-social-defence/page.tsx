import type { Metadata } from "next";
import { Link } from "@mosje/design-system";
import { ContentPage } from "@/components/website-next/templates/ContentPage";
import type { DocumentRow } from "@/components/website-next/templates/content/DocumentTable";
import { DocumentTable } from "@/components/website-next/templates/content/DocumentTable";

const TITLE = "Social Defence Division";
const DESCRIPTION =
  "The Social Defence Division of the Department mainly caters to the requirements of senior citizens, victims of alcoholism and substance abuse, transgender persons, and persons engaged in beggary or destitution.";

export const metadata: Metadata = {
  title: `${TITLE} | Department of Social Justice & Empowerment`,
  description: DESCRIPTION,
};

const DOCS: DocumentRow[] = [
  {
    title: "NAPDDR (National Action Plan for Drug Demand Reduction) Scheme 5th Revised Guidelines w.e.f. 27-02-2023",
    published: "27 Feb 2023",
    size: "1.78 MB",
    href: "https://durwo6bhtjtqt.cloudfront.net/wp-content/uploads/2025/12/napddr.pdf",
  },
  {
    title: "SMILE Scheme Guidelines for Welfare of Transgendres",
    published: "12 Feb 2022",
    size: "301.03 KB",
    href: "https://durwo6bhtjtqt.cloudfront.net/wp-content/uploads/2025/12/SMILE.pdf",
  },
  {
    title: "Equal Opportunities Policies for Transgender Persons",
    published: "14 Feb 2024",
    size: "2.08 MB",
    href: "https://durwo6bhtjtqt.cloudfront.net/wp-content/uploads/2025/12/equalopp.pdf",
  },
  {
    title: "Reconstitution of National Council for Transgender Persons",
    published: "16 Nov 2023",
    size: "758.44 KB",
    href: "https://durwo6bhtjtqt.cloudfront.net/wp-content/uploads/2025/12/rec.pdf",
  },
  {
    title: "Transgender Persons (Protection of Rights) Act, 2019",
    published: "5 Dec 2019",
    size: "88.71 KB",
    href: "https://durwo6bhtjtqt.cloudfront.net/wp-content/uploads/2025/12/trans2019.pdf",
  },
  {
    title: "Transgender Persons (Protection of Rights) Rules, 2020",
    published: "25 Sep 2020",
    size: "351.45 KB",
    href: "https://durwo6bhtjtqt.cloudfront.net/wp-content/uploads/2025/12/73381728291088.pdf",
  },
];

/* Body text: dosje.gov.in/about-the-division-social-defence/ as published, read
   21 Sep 2026. Edits: "Ministry of Social Justice and empowerment" →
   "...Empowerment"; "Govternment" → "Government"; "Reducation" → "Reduction";
   "lRCAs" → "IRCAs"; "lntervention" → "Intervention"; "for the purpose for the
   purpose of" → "for the purpose of" (duplicated phrase); "15 th August 2020" →
   "15th August 2020"; a missing space before "of the Constitution" in the
   beggary section. The live page types its numbered lists for Senior Citizens'
   policies and its target-group items as one <ol>/<p> each; converted to real
   lists. The eleven separate single-item numbered lists under Transgender
   Persons (each restarting at "1." in the live markup) are combined into one
   list so the page does not repeat "1." thirteen times; nothing in that list is
   reordered, summarised or dropped. */
export default function Page() {
  return (
    <ContentPage
      title={TITLE}
      breadcrumb={[{ label: "About" }, { label: "Divisions", href: "/website/about-the-division" }, { label: TITLE }]}
      description={DESCRIPTION}
      lastUpdated="06 Jun 2026"
    >
      <h2>Target Groups</h2>
      <p>The Social Defence Division of the Department mainly caters to the requirements of:</p>
      <ul>
        <li>
          <strong>Senior Citizens</strong>
        </li>
        <li>
          <strong>Victims of alcoholism and substance abuse</strong>
        </li>
        <li>
          <strong>Transgender Persons</strong>
        </li>
        <li>
          <strong>Beggars / Destitute</strong>
        </li>
      </ul>

      <h2>Senior Citizens</h2>
      <ol type="1">
        <li>
          The Ministry of Social Justice and Empowerment is the Nodal Ministry for matters relating to
          the Senior Citizens. Constant increase in life expectancy due to improvement in the health
          care facilities over the years is one of the main reasons for rapid increase in proportion of
          population of Senior Citizens. As per Census 2011, the total population of Senior Citizens
          (people aged 60 years and above) is 10.38 crore, of which population of males and females are
          5.11 crore and 5.27 crore respectively. The share of senior citizens in the total population
          as per Census 2011 is 8.57%. As per the May 2006 Report of the &ldquo;Technical Group on
          Population Projections&rdquo; constituted by the National Commission on Population published
          by the Office of the Registrar General of India this share is expected to increase to 10.70%
          in 2021 and to 12.40% in 2026. The Ministry develops and implements Acts, Policies and
          Programmes for welfare of Senior Citizens in collaboration with State Governments/Union
          Territory Administrations to ensure that Senior Citizens may lead a secured, dignified and
          productive life. The following Policies, Act, and Programmes which aim at welfare and
          maintenance of Senior Citizens, especially for indigent senior citizens, are being dealt with
          in the Ageing Division:
        </li>
        <li>
          <strong>National Policy on Older Persons (NPOP)</strong> &ndash; The existing National Policy
          on Older Persons (NPOP) was announced in January 1999 to reaffirm the commitment to ensure the
          well-being of the Older Persons. The Policy envisaged State support to ensure financial and
          food security, health care, shelter and other needs of Older Persons, equitable share in
          development, protection against abuse and exploitation, and availability of services to
          improve the quality of their lives. Keeping in view the changing demographic pattern,
          socio-economic needs of the Senior Citizens, social value system and advancement in the field
          of science and technology over the last decade, a new National Policy for Senior Citizens is
          under finalization to replace the NPOP, 1999.
        </li>
        <li>
          <strong>Maintenance and Welfare of Parents and Senior Citizens Act, 2007 (MWPSC Act)</strong>{" "}
          &ndash; The Maintenance and Welfare of Parents and Senior Citizens (MWPSC) Act, 2007 was
          enacted in December 2007 to ensure need based maintenance for Parents and Senior Citizens and
          their welfare.
        </li>
        <li>
          <strong>Central Sector Scheme of &ldquo;Integrated Programme for Older Persons&rdquo; (IPOP)</strong>{" "}
          &ndash; Under the Scheme, financial assistance is provided to Government/Non-Governmental
          Organizations/Panchayati Raj Institutions/local bodies etc. for running and maintenance of
          various projects for the welfare of indigent Senior Citizens under the Scheme of IPOP.
        </li>
      </ol>

      <h2>Victims of Alcoholism and Substance Abuse</h2>
      <p>
        Drug and Alcohol abuse has become a major concern across the globe including India. The Ministry
        of Social Justice and Empowerment is the nodal Ministry for drug demand reduction. To address
        the problem of Drug Abuse, the Ministry of Social Justice and Empowerment is implementing
        National Action Plan for Drug Demand Reduction (NAPDDR), an umbrella scheme, under which the
        Government is taking a sustained and coordinated action for arresting the problem of substance
        abuse among these people across the country. These includes de-addiction treatment facilities
        like; Integrated Rehabilitation Centres for Addicts (IRCAs), Community based Peer led
        Intervention (CPLI), Outreach and Drop In Centres (ODICs), Addiction Treatment Facilities
        (ATFs), District De-Addiction Centres (DDACs) through voluntary organizations or Government
        body. It also includes awareness initiative like &ndash; Implementation of Nasha Mukt Bharat
        Abhiyaan, Toll-free Helpline for de-addiction i.e. 14446 etc.
      </p>

      <h3>Extent, Pattern and Trend of Drug Abuse</h3>
      <p>
        Ministry of Social Justice and Empowerment has conducted the first National Survey on Extent and
        Pattern of Substance Use in India through National Drug Dependence Treatment Centre (NDDTC) of
        the All India Institute of Medical Sciences (AIIMS), New Delhi during 2018. The report of the
        survey was released in February, 2019. As per the report, Alcohol is the most common
        psychoactive substance used by Indians followed by Cannabis and Opioids. About 16 Crore persons
        consume alcohol in the country, 3.1 Crore individuals use cannabis products and 2.26 Crore use
        opioids. More than 5.7 Crore individuals are affected by harmful or dependent alcohol use and
        need help for their alcohol use problems, about 25 lakh suffer from cannabis dependence and
        approximately 77 lakh individuals are estimated to need help for their opioid use problems. A
        sizeable number of individuals use sedatives and inhalants.
      </p>

      <h3>Approach and Strategy of the Ministry</h3>
      <p>
        The Ministry of Social Justice and Empowerment recognizes drug abuse as a psycho-socio-medical
        problem, which can be best handled by adoption of a family/community-based approach by active
        involvement of NGOs/CBOs. The strategy for demand reduction is three pronged with the following:
      </p>
      <ol type="1">
        <li>Awareness building and educating people about ill effects of drug abuse.</li>
        <li>Community and Government based intervention for motivational counselling, identification, treatment and rehabilitation of drug addicts, and</li>
        <li>Training of volunteers/service providers and other stakeholders with a view to build up a committed and skilled cadre.</li>
      </ol>

      <h3>Scheme for Prevention of Alcoholism and Substance (Drugs) Abuse</h3>
      <p>
        For the purpose of drug demand reduction, the Ministry of Social Justice &amp; Empowerment has
        been implementing the Scheme of Prevention of Alcoholism and Substance (Drug) Abuse since
        1985-86. The Scheme for Prevention of Alcoholism and Substance (Drugs) Abuse was merged with
        National Action Plan for Drug Demand Reduction w.e.f. 01.04.2020.
      </p>

      <h3>National Action Plan for Drug Demand Reduction</h3>
      <p>
        In order to prevent the Substance use and dependence in the Country, the Ministry of Social
        justice and Empowerment has formulated and enacted National Action Plan for Drug Demand
        Reduction (NAPDDR) w.e.f. 01.04.2018. It is a centrally sponsored scheme under which financial
        assistance is provided to:
      </p>
      <ol type="1">
        <li>&lsquo;State Governments/Union Territory (UT) Administrations for Preventive Education and Awareness Generation, Capacity Building, Programmes for Drug Demand Reduction by States/UTs etc.</li>
        <li>&lsquo;NGOs/VOs for running and maintenance of Integrated Rehabilitation Centres for Addicts (IRCAs), Community based peer Led Intervention (CPLI) for early Drug Use Prevention among Adolescents, Outreach and Drop In Centres (ODIC) and District De-Addiction Centres (DDACs)&rsquo;; and</li>
        <li>Government Hospitals for Addiction Treatment Facilities (ATFs)</li>
      </ol>

      <p>
        <strong>The major objectives of NAPDDR scheme are to:</strong>
      </p>
      <ol type="1">
        <li>
          Focus on preventive education, awareness generation, identification, counseling, treatment and
          rehabilitation of individuals with substance dependence, training and capacity building of the
          service providers through collaborative efforts of the Central and State Governments and
          Non-Governmental Organizations
        </li>
        <li>Create awareness and educate people about the ill-effects of substance dependence on the individual, family, workplace and the society at large</li>
        <li>Reduce stigmatization of and discrimination against groups and individuals dependent on substances in order to integrate them back into the society</li>
        <li>
          Develop human resource and build capacity to:
          <ol type="i">
            <li>Provide for a whole range of community based services for identification, motivation, counseling, de-addiction treatment, after care and rehabilitation for Whole Person Recovery (WPR) of dependents.</li>
            <li>Formulate and implement comprehensive guidelines, schemes, and programmes using a multi-agency approach for drug demand reduction.</li>
            <li>Undertake drug demand reduction efforts to address all forms of illicit use of any substances.</li>
            <li>Alleviate the consequences of substance dependence amongst individuals, family and society at large.</li>
            <li>Facilitate research, training, documentation, innovation and collection of relevant information to strengthen the above mentioned objectives.</li>
          </ol>
        </li>
      </ol>

      <p>
        <strong>Nasha Mukt Bharat Abhiyaan (NMBA)</strong> (a component of NAPDDR scheme) was launched on
        the 15th August 2020 by Ministry of Social Justice &amp; Empowerment in 272 identified most
        vulnerable districts and now it has been extended to all districts across the country since
        August 2023. Nasha Mukt Bharat Abhiyaan intends to reach out to the masses and spread awareness
        about substance use with focus on higher educational Institutions, university campuses &amp;
        schools, reaching out &amp; identifying dependent population, focus on counselling &amp;
        treatment facilities in hospitals &amp; rehabilitation centres and Capacity building programmes
        for service providers. More details in this regard is available on the NMBA website i.e.{" "}
        <Link href="https://nmba.dosje.gov.in" external>
          nmba.dosje.gov.in
        </Link>
        .
      </p>
      <p>
        The Ministry has setup a <strong>National Tollfree Drug-de-Addiction Helpline No: 14446</strong>{" "}
        to help the victims of drug abuse, their Family &amp; Society at large. More details in this
        regard is available on the dedicated dashboard for Toll-free number on the NMBA website i.e.{" "}
        <Link href="https://nmba.dosje.gov.in" external>
          nmba.dosje.gov.in
        </Link>
        .
      </p>

      <h2>Transgender Persons</h2>
      <ul>
        <li>Ministry of Social Justice &amp; Empowerment has been dealing with the matters relating to Transgender Persons with effect from July 2012. However, the work relating to Transgender Persons was allocated to this Department under the Allocation of Business Rules in the month of May 2016.</li>
        <li>On 15th April, 2014, the Hon&rsquo;ble Supreme Court has, in a Writ Petition No. 400/2012 filed by National Legal Services Authority (NLSA) delivered its judgment on the issues of Transgender Persons directing the Central and State Governments to take various steps for the welfare of the transgender community and also to examine the recommendations of the Expert Committee based on the Legal declaration made in the above said judgment.</li>
        <li>Ministry of Social Justice &amp; Empowerment has enacted &ldquo;The Transgender Persons (Protection of Rights) Act, 2019&rdquo; on 10.01.2020. The Act provides a clear definition of Transgender persons and recognizes a person&rsquo;s to right to self-perceived gender identity. It mandated the formulation of welfare schemes and programmes that are transgender sensitive and non-stigmatizing ensuring their dignified and respectable place in the society, along with provisions for non-discrimination in educational institutions and employment, providing healthcare services and several welfare measures. The Ministry has enacted &ldquo;The Transgender Persons (Protection of Rights), Rules, 2020&rdquo; on 25.09.2020 for implementation of the provisions of the Act.</li>
        <li>Section 2(k) of the Act defines the Transgender Person as &ndash; &ldquo;a person whose gender does not match with the gender assigned to that person at birth and includes trans-man or trans-woman (whether or not such person has undergone Sex Reassignment Surgery or hormone therapy or laser therapy or such other therapy), person with intersex variations, genderqueer and person having such socio-cultural identities as kinner, hijra, aravani and jogta.&rdquo;</li>
        <li>National Council for Transgender Persons was set up to advise the Central Government on the formulation of policies and legislation with respect to Transgender persons, monitor and evaluate the impact of policies designed for achieving equality and full participation, review and coordinate the activities of all the Departments of the Government and non-Governmental organisations.</li>
        <li>The National Portal for Transgender Persons was launched on 25th November, 2020. The Portal is accessible in multiple languages (English, Hindi, Gujarati, Malayalam and Bengali). The portal was launched to issue Transgender certificates and ID cards to eligible Transgender persons. This is an end-to-end online process where the applicant can apply for the TG certificate and also download the certificate after issue without any requirement to go to any office of issue.</li>
        <li>As per Rule 11(5) of Transgender Persons (Protection of Rights) Rules 2020, every State has to setup Transgender Protection cells to monitor cases of offences against transgender persons and to ensure timely registration, investigation and prosecution of such offences.</li>
        <li>As per Rule 10(1) of Transgender Persons (Protection of Rights) Rules 2020, every state has to setup welfare board for the transgender persons for the purpose of protecting their rights and interests, and facilitating access to schemes and welfare measures.</li>
        <li>A scheme, Support for Marginalized Individual for Livelihood and Enterprise (SMILE) with sub-component &ldquo;Central sector scheme for comprehensive rehabilitation for welfare of transgender persons&rdquo; is being implemented. This scheme has various components for welfare of transgender persons namely Skill Development and Livelihood, Composite Medical Health, Safe shelters in the form of Garima Grehs, National Portal for Transgender persons through which Transgender certificates are issued, Provision of Transgender Protection Cell and other welfare measures.</li>
        <li>MoU with National Health Authority (NHA) for convergence with Ayushman Bharat scheme of NHA has been done for providing health facilities under PMJAY scheme to Transgender persons.</li>
        <li>As on 26.09.2024, total of 16 Garima Grehs as shelter homes for transgender persons are operational in 13 States of Delhi, Odisha, Gujarat, Tamil Nadu, Rajasthan, Bihar, Chhattisgarh, West Bengal (2), Maharashtra (3), Punjab, Andhra Pradesh, Karnataka and Assam.</li>
        <li>On request of this Ministry, Swachh Bharat Mission (Urban) has included dedicated toilets for transgender persons in their policy guidelines.</li>
        <li>Department has issued &ldquo;Equal Opportunities Policy for Transgender Persons&rdquo; to ensure that the Transgender community has equal access to employment opportunities etc.</li>
        <li>Ministry through its autonomous body National Institute of Social Defence (NISD) conducts for regular awareness generation and sensitization sessions for Transgender Persons.</li>
      </ul>

      <h2>Beggary</h2>
      <p>
        The word &lsquo;beggar&rsquo; or &lsquo;beggary&rsquo; is not mentioned in any of the lists of
        the Constitution. However, <strong>as per entry-9 of the State List in the Seventh Schedule</strong>{" "}
        of the Constitution, &ldquo;Relief of the disabled and unemployable&rdquo; is a State subject.{" "}
        <strong>As per entry-15 of the Concurrent List</strong>, &ldquo;Vagrancy&rdquo; is a concurrent
        subject. As per information available at present, 20 States and 2 UTs have either enacted their
        own Anti Beggary Legislation or adopted the legislation enacted by other States. Despite the fact
        that many States/UTs have enacted laws relating to beggary, however, the provisions of these
        legislations differ across the States and their status of implementation, including the measures
        taken for rehabilitation of beggars, are also not uniform.
      </p>
      <p>
        The Ministry&rsquo;s approach towards addressing the problem of beggary is rehabilitative rather
        than punitive. Accordingly, the Ministry is in the process formulating a Model Legislation on
        Destitution which could be suitably adopted/adapted by the States/UTs and also formulating a
        Scheme for Protection, Care and Rehabilitation of Destitutes.
      </p>

      <h2>Documents</h2>
      <DocumentTable caption="Documents Published by the Social Defence Division" rows={DOCS} />
    </ContentPage>
  );
}
