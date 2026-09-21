import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ContentPage } from "@/components/website-next/templates/ContentPage";
import { Collapsible, TableWrap } from "@/components/website-next/templates/content/TableWrap";
import { localiseDocumentUrl } from "@/lib/website/sample-documents";
import { ABOUT_TABLES, type RefTable } from "./reference-tables";

const TITLE = "About the Department";
const DESCRIPTION =
  "The Department of Social Justice & Empowerment is entrusted with the empowerment of the disadvantaged and marginalised sections of society.";

export const metadata: Metadata = {
  title: `${TITLE} | Department of Social Justice & Empowerment`,
  description: DESCRIPTION,
};

/*
 * ABOUT US — the Department's own text from dosje.gov.in/about-us/, read 21 Sep 2026.
 *
 * Issues: LAY-12 (15,000px page, three table styles, history as paragraphs), CON-17
 * (objectives and functions as a paragraph), ACC-03, TYP-06/07/09.
 *
 * WHAT CHANGED FROM THE PREVIOUS VERSION OF THIS FILE, AND WHY
 *  - A "Senior Administration & Bureaus" accordion named four officers who do not
 *    appear on dosje.gov.in (they are seed names from the e-Anudaan prototype) with
 *    duties written for them. Removed. The Department's real allocation of work by
 *    bureau head is published below, as the Department publishes it.
 *  - The target-group list, the "1995 & 2005" disability date and the history text
 *    had been rewritten. They are the Department's words and dates again ("1992 &
 *    2008": the Beijing Proclamation of December 1992 and the UNCRPD of May 2008).
 *  - The Sector-Wise Detailed Information tables and the Former Secretaries table had
 *    been dropped. Restored from the live page by a parser, never retyped
 *    (./reference-tables.ts), each collapsed behind its title.
 *  - The page was a client component for no reason; it is a server page now.
 *
 * EDITS TO THE DEPARTMENT'S TEXT: "various types on disabilities" → "of"; "specialise
 * nature" → "specialised"; "UNCRPT" → "UNCRPD"; "Schedulecaste" → "Scheduled Caste";
 * "Semi-Namadic" → "Semi-Nomadic"; "Karmacharis" → "Karamcharis" (as the Commission
 * writes its name). The Allocation of Business Rules note, printed before the list it
 * refers to ("(i) to (iv) above"), is printed after it.
 *
 * NOT PUBLISHED HERE, DELIBERATELY: the name of the Secretary. dosje.gov.in's Overview
 * names Shri Sudhansh Pant; the site's own organisation text and officials registry
 * name Shri Amit Yadav, whose tenure the Former Secretaries table closes on 30.11.2025.
 * The Who's Who page is the single place officials are named.
 */

const TARGET_GROUPS = [
  "Scheduled Castes",
  "Other Backward Classes",
  "Senior Citizens",
  "Victims of Substance Abuse",
  "Denotified, Nomadic and Semi-Nomadic Tribes",
  "Beggars",
  "Transgender",
  "Manual Scavengers",
  "Sewer & Septic Tank workers",
  "Waste Pickers",
];

interface Milestone {
  id: string;
  date: string;
  /** ISO date for <time> where the Department gives an exact day. */
  iso?: string;
  title: string;
  /** The first sentence of the Department's text: the two-line summary. */
  summary: string;
  /** The rest of the Department's text, behind "Read More". */
  more?: React.ReactNode;
}

const HISTORY: Milestone[] = [
  {
    id: "ministry-of-welfare",
    date: "1985–1986",
    title: "Formation of the Ministry of Welfare",
    summary:
      "In the year 1985-86, the erstwhile Ministry of Welfare was bifurcated into the Department of Women and Child Development and the Department of Welfare.",
    more: (
      <p>
        Simultaneously, the Scheduled Castes Development Division, Tribal Development Division and the Minorities and
        Backward Classes Welfare Division were moved from the Ministry of Home Affairs and also the Wakf Division from
        the Ministry of Law to form the then Ministry of Welfare.
      </p>
    ),
  },
  {
    id: "renamed",
    date: "May 1998",
    iso: "1998-05",
    title: "Renamed as Ministry of Social Justice & Empowerment",
    summary: "Subsequently, the name of the Ministry was changed to the Ministry of Social Justice & Empowerment in May, 1998.",
  },
  {
    id: "tribal-affairs",
    date: "October 1999",
    iso: "1999-10",
    title: "Formation of the Ministry of Tribal Affairs",
    summary: "Further, in October, 1999, the Tribal Development Division had moved out to form a separate Ministry of Tribal Affairs.",
  },
  {
    id: "minorities-wcd",
    date: "January 2007",
    iso: "2007-01",
    title: "Formation of Separate Ministries for Minorities and Women & Child Development",
    summary:
      "In January, 2007, the Minorities Division along with Wakf Unit have been moved out of the Ministry and formed as a separate Ministry and the Child Development Division has gone to the Ministry of Women & Child Development.",
  },
  {
    id: "disability-commitment",
    date: "1992 and 2008",
    title: "Government’s Commitment to the Disability Sector",
    summary:
      "Though the subject of “Disability” figures in the State List in the Seventh Schedule of the Constitution, the Government of India has always been proactive in the disability sector.",
    more: (
      <>
        <p>
          It is not only running seven National Institutes (NIs) dealing with various types of disabilities and seven
          Composite Regional Centers (CRCs), which provide rehabilitation services to PwDs and run courses for
          rehabilitation professional but also funds a large number of NGOs for similar services and also a National
          Handicapped Finance &amp; Development Corporation (NHFDC) which provides loans at concession rates of interest
          to PwDs for self-employment.
        </p>
        <p>Besides, the Union Government is a party to:</p>
        <ul>
          <li>
            Proclamation on the Full Participation and Equality of People with Disabilities in the Asian and the
            Pacific Region, adopted at Beijing in December, 1992, and
          </li>
          <li>
            The UN Convention on the Rights of Persons with Disabilities (UNCRPD), which came into effect in May, 2008.
          </li>
        </ul>
      </>
    ),
  },
  {
    id: "dedicated-department",
    date: "11th Five Year Plan Period",
    title: "Recognition of the Need for a Dedicated Disability Department",
    summary:
      "The subject has received attention in various States Governments in varying degrees.",
    more: (
      <>
        <p>
          At the Central level also disability being one of the several responsibilities of the M/o SJ&amp;E, and being
          looked after by just one bureau, has resulted in inadequate attention, as most of its time and energy is
          spent only on implementing Ministry’s own schemes, meeting their expenditure and physical targets, and
          organize annual time-bound activities like the National Awards for empowerment of PwDs.
        </p>
        <p>
          In the above background, it was stated in the 11th Five Year Plan that “The ‘Disability Division’ of the
          Ministry of Social Justice &amp; Empowerment will be strengthened by converting it into a separate Department,
          so that it can liaise effectively with all the other concerned Ministries/Departments and fulfill its
          responsibilities towards the disabled.”
        </p>
        <p>
          Looking to the specialised nature of the subject on “Disability”, the wide ranging work to be done in the
          light of the UNCRPD, and the inadequacy of existing implementation structure, the time has now come to
          upgrade the existing Disability Bureau in the M/o SJ&amp;E.
        </p>
      </>
    ),
  },
  {
    id: "decision-2012",
    date: "3 January 2012",
    iso: "2012-01-03",
    title: "Decision to Create a Separate Department of Disability Affairs",
    summary:
      "The decision to create a separate Department of Disability Affairs within the M/o SJ&E was taken up by the Government, in principle on 3rd January, 2012.",
    more: <p>This was also announced by the President before both houses of Parliament on 12th March, 2012.</p>,
  },
  {
    id: "two-departments",
    date: "12 May 2012",
    iso: "2012-05-12",
    title: "Creation of Two Departments under the Ministry of Social Justice & Empowerment",
    summary:
      "Now the two departments have been created under the Ministry of Social Justice & Empowerment vide notification dated 12.5.2012.",
    more: (
      <ul>
        <li>Department of Social Justice and Empowerment (Samajik Nyaya and Adhikarita Vibhag)</li>
        <li>
          Department of Disability Affairs (Nishaktata Karya Vibhag), since renamed as Department of Empowerment of
          Persons with Disabilities (Divyangjan).
        </li>
      </ul>
    ),
  },
];

const NODAL_GROUPS = [
  "Scheduled Castes;",
  "Socially and Educationally Backward Classes;",
  "Denotified Tribes;",
  "Economically Backward Classes; and",
  "Senior Citizens;",
];

const SUBJECTS_AFTER_2 = [
  "Special schemes aimed at social, educational and economic empowerment of the groups mentioned at (i) to (iv) under entry 2 above, e.g. scholarships, hostels, residential schools, skill training, concession loans and subsidy for self-employment, etc.",
  "Monitoring of Scheduled Caste sub plan.",
  "Rehabilitation of Manual Scavengers in alternative occupations.",
  "Programmes of care and support to senior citizens.",
  "Prohibition.",
  "Rehabilitation of victims of alcoholism and substance abuse, and their families.",
  "Beggary.",
  "International Conventions and Agreements on matters dealt within the Department.",
  "Awareness generation, research, evaluation and training in regard to subjects allocated to the Department.",
  "Charitable and Religious Endowments and promotion and development of Voluntary Effort pertaining to subjects allocated to the Department.",
  "The Protection of Civil Rights Act, 1955 (22 of 1955).",
  "The Scheduled Castes and the Scheduled Tribes (Prevention of Atrocities) Act, 1989 (33 of 1989), (in so far as it relates to the Scheduled Castes, excluding administration of criminal justice in regard to offences under the Act).",
  "National Commission for Backward Classes Act, 1993 (27 of 1993).",
  "The Maintenance and Welfare of Parents and Senior Citizens Act, 2007 (56 of 2007).",
  "National Commission for Scheduled Castes.",
  "National Commission for Safai Karamcharis.",
  "National Commission for Backward Classes.",
  "National Scheduled Castes Finance and Development Corporation.",
  "National Safai Karamcharis Finance and Development Corporation.",
  "National Backward Classes Finance and Development Corporation.",
  "National Institute of Social Defence.",
  "Dr. Ambedkar Foundation.",
  "Babu Jagjivan Ram National Foundation.",
  "National Commission for Denotified and Semi-Nomadic Tribes.",
];

const MINISTERS = [
  { name: "Dr. Virendra Kumar", role: "Union Minister of Social Justice and Empowerment", image: "/website/images/Dr.-Virendra-Kumar.png" },
  { name: "Shri Ramdas Athawale", role: "Minister of State", image: "/website/images/Shri-Ramdas-Athawale.png" },
  { name: "Shri B. L. Verma", role: "Minister of State", image: "/website/images/sri-l-b-verma.png" },
];

const CONTENTS = [
  { id: "overview", label: "Overview" },
  { id: "history", label: "Our History" },
  { id: "subjects", label: "Subjects Allocated" },
  { id: "organisation", label: "Organisational Set-Up" },
  { id: "sector-information", label: "Sector-Wise Detailed Information" },
  { id: "former-secretaries", label: "Former Secretaries" },
];

const NUMERIC = /^[\d.,\s*%-]+$/;

function RefTableView({ table }: { table: RefTable }) {
  return (
    <TableWrap label={table.title}>
      <table>
        <caption className="sr-only">{table.title}</caption>
        <thead>
          {table.head.map((row, r) => (
            <tr key={r}>
              {row.map((c, i) => (
                <th key={i} scope={c.c ? "colgroup" : "col"} rowSpan={c.r} colSpan={c.c}>
                  {c.t}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.body.map((row, r) => (
            <tr key={r}>
              {row.map((c, i) => (
                <td key={i} rowSpan={c.r} colSpan={c.c} className={c.t && NUMERIC.test(c.t) ? "num" : undefined}>
                  {c.t || "–"}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </TableWrap>
  );
}

const byId = (id: string) => ABOUT_TABLES.find((t) => t.id === id)!;
const SECTOR_GROUPS = [...new Set(ABOUT_TABLES.map((t) => t.group).filter((g): g is string => !!g))];

/** "27 Secretaries, 1985 to 2025" — derived from the table, never typed. */
function secretariesMeta(): string {
  const rows = byId("former-secretaries").body;
  const year = (d?: string) => d?.split(".").pop();
  return `${rows.length} Secretaries, ${year(rows[0]?.[2]?.t)} to ${year(rows[rows.length - 1]?.[3]?.t)}`;
}

const related = (
  <nav className="wn-panel" aria-labelledby="about-related">
    <h2 className="wn-panel__title" id="about-related">
      Related Pages
    </h2>
    <ul>
      <li>
        <Link href="/website/whos-who">Who’s Who</Link>
      </li>
      <li>
        <Link href="/website/about-the-division">Divisions</Link>
      </li>
      <li>
        <Link href="/website/citizen-charter">Citizen’s Charter</Link>
      </li>
      <li>
        <a
          href={localiseDocumentUrl(
            "https://durwo6bhtjtqt.cloudfront.net/wp-content/uploads/2026/09/Org-chart-as-on-16-09-2026.pdf",
            "Organisation Chart",
          )}
          target="_blank"
          rel="noopener noreferrer"
        >
          Organisation Chart as on 16 Sep 2026
          <span className="sr-only"> (PDF, opens in a new window)</span>
        </a>
      </li>
      <li>
        <Link href="/website/lok-sabha-question-answer">Parliament Questions</Link>
      </li>
    </ul>
  </nav>
);

export default function Page() {
  return (
    <ContentPage
      title={TITLE}
      breadcrumb={[{ label: "About" }, { label: TITLE }]}
      description={DESCRIPTION}
      lastUpdated="13 Jun 2026"
      sidebar={related}
    >
      <nav className="wn-toc" aria-labelledby="about-contents">
        <h2 className="wn-toc__title" id="about-contents">
          On This Page
        </h2>
        <ol>
          {CONTENTS.map((c) => (
            <li key={c.id}>
              <a href={`#${c.id}`}>{c.label}</a>
            </li>
          ))}
        </ol>
      </nav>

      <h2 id="overview">Overview</h2>
      <p>
        The Department of Social Justice &amp; Empowerment is entrusted with the empowerment of the disadvantaged and
        marginalized sections of the society. The target groups of the Ministry are:
      </p>
      <ul>
        {TARGET_GROUPS.map((g) => (
          <li key={g}>{g}</li>
        ))}
      </ul>
      <p>
        The Ministry has been implementing various programmes/schemes for social, educational and economic development
        of the target groups. As a result there has been considerable improvement in the welfare of these groups.
      </p>
      <p>
        Due to discontinuance of caste census after 1931, disaggregated demographic data for OBCs is not available. The
        Mandal Commission had estimated OBC population at 52% of the total population. Similarly, authentic data for
        Victims of Substance Abuse is not available. At least 1% of the population is understood to be addicted.
      </p>

      <h2 id="history">Our History</h2>
      <ol className="wn-timeline">
        {HISTORY.map((m) => (
          <li key={m.id}>
            <span className="wn-timeline__date">{m.iso ? <time dateTime={m.iso}>{m.date}</time> : m.date}</span>
            <h3 id={`history-${m.id}`}>{m.title}</h3>
            <p>{m.summary}</p>
            {m.more && (
              <details className="wn-timeline__more">
                <summary>
                  Read More<span className="sr-only">: {m.title}</span>
                </summary>
                <div>{m.more}</div>
              </details>
            )}
          </li>
        ))}
      </ol>

      <h2 id="subjects">Subjects Allocated</h2>
      <p>
        The subjects allocated to the Department of Social Justice and Empowerment (Samajik Nyaya aur Adhikarita
        Vibhag) under the Government of India (Allocation of Business) Rules, 1961:
      </p>
      <ol>
        <li>
          The following subject which fall within List III, Concurrent List of the Seventh Schedule to the
          Constitution: Nomadic and Migratory Tribes.
        </li>
        <li>
          To act as the nodal Department for matters pertaining to the following groups, namely:
          <ol type="i">
            {NODAL_GROUPS.map((g) => (
              <li key={g}>{g}</li>
            ))}
          </ol>
        </li>
        {SUBJECTS_AFTER_2.map((s) => (
          <li key={s}>{s}</li>
        ))}
      </ol>
      <p>
        <strong>Note:</strong> The Department of Social Justice and Empowerment shall be the nodal Department for the
        overall policy, planning and coordination of programmes for the development of the groups mentioned at (i) to
        (iv) above, and the welfare of the group at (v) above. However, overall management and monitoring etc. of the
        sectoral programmes in respect of these groups shall be the responsibility of the concerned Central Ministries,
        State Governments and Union Territory Administrations. Each Central Ministry or Department shall discharge
        nodal responsibility concerning its sector.
      </p>

      <h2 id="organisation">Organisational Set-Up</h2>
      <ul className="wn-people" aria-label="Ministers">
        {MINISTERS.map((m) => (
          <li key={m.name}>
            <figure>
              <Image src={m.image} alt="" width={72} height={72} />
              <figcaption>
                <strong>{m.name}</strong>
                <span>{m.role}</span>
              </figcaption>
            </figure>
          </li>
        ))}
      </ul>
      <p>
        The Ministry of Social Justice &amp; Empowerment is entrusted with the welfare, social justice and empowerment of
        disadvantaged and marginalized section of the society viz. Scheduled Caste, Backward Classes, Persons with
        Disabilities, Senior Citizens, and Victims of Drug Abuse etc.
      </p>
      <p>
        Basic objective of the policies, programmes, law and institution of the Indian welfare system is to bring the
        target groups into the mainstream of development by making them self-reliant.
      </p>
      <p>
        The Ministry is headed by Dr. Virendra Kumar, Cabinet Minister and ably assisted by two Ministers-of-State
        namely Shri Ramdas Athawale and Shri B L Verma.
      </p>
      <p>
        There are two departments viz. Department of Social Justice and Empowerment and Department of Empowerment of
        Persons with Disabilities under the Ministry of Social Justice and Empowerment. The officers of the Department
        are listed in <Link href="/website/whos-who">Who’s Who</Link>.
      </p>
      <Collapsible title={byId("bureau-allocation").title} meta="Allocation of work in the Department of Social Justice and Empowerment">
        <RefTableView table={byId("bureau-allocation")} />
      </Collapsible>

      <h2 id="sector-information">Sector-Wise Detailed Information</h2>
      <p>Statistical tables published by the Department on the groups it serves, each with the year to which it relates.</p>
      {SECTOR_GROUPS.map((group) => (
        <section key={group} aria-labelledby={`sector-${group.replace(/\W+/g, "-").toLowerCase()}`}>
          <h3 id={`sector-${group.replace(/\W+/g, "-").toLowerCase()}`}>{group}</h3>
          {ABOUT_TABLES.filter((t) => t.group === group).map((t) => (
            <Collapsible key={t.id} id={t.id} title={t.title}>
              <RefTableView table={t} />
            </Collapsible>
          ))}
        </section>
      ))}

      <h2 id="former-secretaries">Former Secretaries</h2>
      <Collapsible title="Former Secretaries" meta={secretariesMeta()}>
        <RefTableView table={byId("former-secretaries")} />
      </Collapsible>
    </ContentPage>
  );
}
