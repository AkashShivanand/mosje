/**
 * The DBIM design's Ministry pages: About Us, Our Team, Our Division, Our
 * Organisation and Our Performance.
 *
 * Every word here is the Department's, read from the estate's own modules; this
 * file only arranges it into the DBIM reference build's page shapes
 * (master-socialjustice.digifootprint.gov.in, captured 25 Sep 2026). Mapping and
 * reasoning: docs/research/dbim-reference/components/ministry.spec.md.
 *
 * Server-only in practice: it reads the officials register and the ingested
 * organisation pages. Pages pass the trimmed rows below to client lists.
 */
import { DIVISIONS, ORGANISATIONS, getDepartmentSecretary, type OrganisationCategory } from "@/data/website";
import { getDocument, getOfficialsByOrganisation, getOrganisation } from "@/lib/website/content";
import { localiseDocumentUrl } from "@/lib/website/sample-documents";
import { phoneGroups } from "@/components/website-next/templates/people-format";
import { cleanHtml, firstSentence, kindOf, stripTags } from "@/components/website-next/templates/organisation-content";
import { DBIM_CAMPAIGNS } from "./assets";
import { DBIM_REGISTERS, registerPath } from "./division-registers";

/* ── About Us ──────────────────────────────────────────────────────────────── */

/**
 * SOURCE: dosje.gov.in/about-us/, as the redesign transcribed and corrected it in
 * `app/website/about-us/page.tsx` (read 21–22 Sep 2026; its header lists every edit
 * made to the Department's text). The reference's section names are kept, set in
 * Title Case; the reference's order of sections is kept.
 */
export const DBIM_ABOUT = {
  summary:
    "The Department of Social Justice & Empowerment is entrusted with the empowerment of the disadvantaged and marginalised sections of society.",
  overview: {
    lead: "Sector Overview at a Glance",
    intro:
      "The Department of Social Justice & Empowerment is entrusted with the empowerment of the disadvantaged and marginalized sections of the society.",
    groupsLead: "The target groups of the Ministry are:",
    groups: [
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
    ],
    after:
      "The Ministry has been implementing various programmes/schemes for social, educational and economic development of the target groups. As a result there has been considerable improvement in the welfare of these groups. Due to discontinuance of caste census after 1931, disaggregated demographic data for OBCs is not available. The Mandal Commission had estimated OBC population at 52% of the total population. Similarly, authentic data for Victims of Substance Abuse is not available. At least 1% of the population is understood to be addicted.",
  },
  history: [
    "In the year 1985-86, the erstwhile Ministry of Welfare was bifurcated into the Department of Women and Child Development and the Department of Welfare. Simultaneously, the Scheduled Castes Development Division, Tribal Development Division and the Minorities and Backward Classes Welfare Division were moved from the Ministry of Home Affairs and also the Wakf Division from the Ministry of Law to form the then Ministry of Welfare.",
    "Subsequently, the name of the Ministry was changed to the Ministry of Social Justice & Empowerment in May, 1998. Further, in October, 1999, the Tribal Development Division had moved out to form a separate Ministry of Tribal Affairs. In January, 2007, the Minorities Division along with Wakf Unit have been moved out of the Ministry and formed as a separate Ministry and the Child Development Division has gone to the Ministry of Women & Child Development.",
    "Though the subject of “Disability” figures in the State List in the Seventh Schedule of the Constitution, the Government of India has always been proactive in the disability sector. It is not only running seven National Institutes (NIs) dealing with various types of disabilities and seven Composite Regional Centers (CRCs), which provide rehabilitation services to PwDs and run courses for rehabilitation professional but also funds a large number of NGOs for similar services and also a National Handicapped Finance & Development Corporation (NHFDC) which provides loans at concession rates of interest to PwDs for self-employment. Besides, the Union Government is a party to",
  ],
  /** Rendered as the reference renders them: a numeral, then the instrument in bold. */
  instruments: [
    { n: "(i)", name: "Proclamation on the Full Participation and Equality of People with Disabilities in the Asian and the Pacific Region", rest: " – adopted at Beijing in December, 1992, and" },
    { n: "(ii)", name: "The UN Convention on the Rights of Persons with Disabilities (UNCRPD),", rest: " which came into effect in May, 2008." },
  ],
  disability: {
    before:
      "The subject has received attention in various States Governments in varying degrees. At the Central level also disability being one of the several responsibilities of the M/o SJ&E, and being looked after by just one bureau, has resulted in inadequate attention, as most of its time and energy is spent only on implementing Ministry’s own schemes, meeting their expenditure and physical targets, and organize annual time-bound activities like the National Awards for empowerment of PwDs. In the above background, it was stated in the 11th Five Year Plan that ",
    quote:
      "“The ‘Disability Division’ of the Ministry of Social Justice & Empowerment will be strengthened by converting it into a separate Department, so that it can liaise effectively with all the other concerned Ministries/Departments and fulfill its responsibilities towards the disabled.”",
    after:
      " Looking to the specialised nature of the subject on “Disability”, the wide ranging work to be done in the light of the UNCRPD, and the inadequacy of existing implementation structure, the time has now come to upgrade the existing Disability Bureau in the M/o SJ&E. The decision to create a separate Department of Disability Affairs within the M/o SJ&E was taken up by the Government, in principle on 3rd January, 2012. This was also announced by the President before both houses of Parliament on 12th March, 2012.",
  },
  departmentsLead: "Now the two departments have been created under the Ministry of Social Justice & Empowerment vide notification dated 12.5.2012, namely:",
  departments: [
    "Department of Social Justice and Empowerment (Samajik Nyaya and Adhikarita Vibhag)",
    "Department of Disability Affairs (Nishaktata Karya Vibhag), since renamed as Department of Empowerment of Persons with Disabilities (Divyangjan)",
  ],
  subjects: {
    rules: "Allocation of Business Rules, 1961",
    department: "Department of Social Justice and Empowerment (Samajik Nyaya aur Adhikarita Vibhag)",
    note:
      "Note: The Department of Social Justice and Empowerment shall be the nodal Department for the overall policy, planning and coordination of programmes for the development of the groups mentioned at (i) to (iv) above, and the welfare of the group at (v) above. However, overall management and monitoring etc. of the sectoral programmes in respect of these groups shall be the responsibility of the concerned Central Ministries, State Governments and Union Territory Administrations. Each Central Ministry or Department shall discharge nodal responsibility concerning its sector.",
    first: "The following subject which fall within List III, Concurrent List of the Seventh Schedule to the Constitution: Nomadic and Migratory Tribes.",
    nodalLead: "To act as the nodal Department for matters pertaining to the following groups, namely:",
    nodal: [
      "Scheduled Castes;",
      "Socially and Educationally Backward Classes;",
      "Denotified Tribes;",
      "Economically Backward Classes; and",
      "Senior Citizens;",
    ],
    rest: [
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
    ],
  },
  setUp: [
    "The Ministry of Social Justice & Empowerment is entrusted with the welfare, social justice and empowerment of disadvantaged and marginalized section of the society viz. Scheduled Caste, Backward Classes, Persons with Disabilities, Senior Citizens, and Victims of Drug Abuse etc.",
    "Basic objective of the policies, programmes, law and institution of the Indian welfare system is to bring the target groups into the mainstream of development by making them self-reliant.",
  ],
  headedBy: {
    before: "The Ministry is headed by ",
    bold: "Dr. Virendra Kumar, Cabinet Minister and ably assisted by two Ministers-of-State namely Shri Ramdas Athawale and Shri B L Verma.",
  },
  twoDepartments:
    "There are two departments viz. Department of Social Justice and Empowerment and Department of Empowerment of Persons with Disabilities under the Ministry of Social Justice and Empowerment.",
  /** The Secretary is read from the officials register, the one place the post is named. */
  secretary: getDepartmentSecretary().name,
  bureauLead: "The Bureau Head wise Allocation of work in Department of Social Justice and Empowerment is as follows:",
} as const;

/** A row of the reference's document list. */
export interface DbimDocRow {
  title: string;
  href: string;
  /** YYYY.MM.DD, the reference's notation. */
  date?: string;
  size?: string;
  type?: string;
}

/** "2024-01-26" → "2024.01.26". */
function refDate(iso: string | undefined): string | undefined {
  const m = iso?.match(/^(\d{4})-(\d{2})-(\d{2})/);
  return m ? `${m[1]}.${m[2]}.${m[3]}` : undefined;
}

/**
 * The two files the reference lists under About Us. The Organisation Chart is the one
 * the redesign's About page links (dosje.gov.in, as on 16 Sep 2026); the Citizen
 * Charter is the Department's record in the documents register.
 */
export function aboutDocuments(): { organisationChart: DbimDocRow; citizenCharter?: DbimDocRow } {
  const charter = getDocument("citizen-charter");
  return {
    organisationChart: {
      title: "Organisation Chart",
      href: localiseDocumentUrl(
        "https://durwo6bhtjtqt.cloudfront.net/wp-content/uploads/2026/09/Org-chart-as-on-16-09-2026.pdf",
        "Organisation Chart",
      ),
      date: "2026.09.16",
      type: "PDF",
    },
    citizenCharter: charter?.fileUrl
      ? {
          title: charter.title,
          href: localiseDocumentUrl(charter.fileUrl, charter.title),
          date: refDate(charter.publishStart ?? charter.date),
          size: charter.fileSize,
          type: charter.fileType,
        }
      : undefined,
  };
}

/* ── Our Team ──────────────────────────────────────────────────────────────── */

export interface DbimTeamMember {
  name: string;
  designation: string;
  /** Telephone and mobile numbers as published, each with the number to dial. */
  phones: { text: string; tel?: string }[];
  faxes: string[];
  /** As the register writes them — `name[at]gov[dot]in` — which is the reference's notation. */
  emails: string[];
  intercom?: string;
  address?: string;
}

export interface DbimTeamOffice {
  id: string;
  /** Title Case; the page uppercases it as the reference does. */
  label: string;
  members: DbimTeamMember[];
}

/**
 * The reference's office order, keyed by the register's `group`, with each office's
 * name in Title Case. The register's names differ from the reference's in three places
 * (Additional Secretary, AS & FA, Pr. CCA) — the register's post is the one named.
 */
const OFFICE_ORDER: [group: string, label: string][] = [
  ["UNION CABINET MINISTER OF SOCIAL JUSTICE & EMPOWERMENT", "Union Cabinet Minister of Social Justice & Empowerment"],
  ["MINISTER OF STATE OF SOCIAL JUSTICE & EMPOWERMENT (RA)", "Minister of State of Social Justice & Empowerment (RA)"],
  ["MINISTER OF STATE OF SOCIAL JUSTICE & EMPOWERMENT (BLV)", "Minister of State of Social Justice & Empowerment (BLV)"],
  ["SECRETARY (DEPARTMENT OF SOCIAL JUSTICE & EMPOWERMENT)", "Secretary (Department of Social Justice & Empowerment)"],
  ["ADDITIONAL SECRETARY (DEPARTMENT OF SOCIAL JUSTICE & EMPOWERMENT)", "Additional Secretary (Department of Social Justice & Empowerment)"],
  ["SENIOR ECONOMIC ADVISER", "Senior Economic Adviser"],
  ["JOINT SECRETARY", "Joint Secretary"],
  ["ADDITIONAL SECRETARY & FINANCIAL ADVISOR", "Additional Secretary & Financial Advisor"],
  ["ECONOMIC ADVISER / DEPUTY DIRECTOR GENERAL STATISTICS", "Economic Adviser / Deputy Director General Statistics"],
  ["DIRECTOR", "Director"],
  ["DEPUTY SECRETARIES", "Deputy Secretaries"],
  ["UNDER SECRETARY", "Under Secretary"],
  ["DEPUTY DIRECTOR", "Deputy Director"],
  ["ASSISTANT DIRECTOR", "Assistant Director"],
  ["SECTION OFFICERS", "Section Officers"],
  ["HINDI SECTION", "Hindi Section"],
  ["PARLIAMENT SECTION", "Parliament Section"],
  ["PAY AND ACCOUNTS OFFICE", "Pay and Accounts Office"],
  ["PRINCIPAL CHIEF CONTROLLER OF ACCOUNTS (PR.CCA)", "Principal Chief Controller of Accounts (Pr. CCA)"],
  ["NATIONAL INFORMATICS CENTRE (NIC)", "National Informatics Centre (NIC)"],
  ["CASH SECTION", "Cash Section"],
  ["MEDIA UNIT", "Media Unit"],
  ["JUSTICE BALAKRISHNAN COMMISSION OF INQUIRY", "Justice Balakrishnan Commission of Inquiry"],
  ["DR. AMBEDKAR FOUNDATION / DR. AMBEDKAR INTERNATIONAL CENTRE / DR. AMBEDKAR NATIONAL MEMORIAL", "Dr. Ambedkar Foundation / Dr. Ambedkar International Centre / Dr. Ambedkar National Memorial"],
  ["BABU JAGJIVAN RAM NATIONAL FOUNDATION", "Babu Jagjivan Ram National Foundation"],
];

/** Free-mail domains are a person's own account, not an office's (CON-09). */
const FREE_MAIL = /(gmail|googlemail|yahoo|ymail|hotmail|outlook|live|rediffmail|rediff|aol|icloud|proton(mail)?)(\[dot\]|\.)/i;

/** Head of the office first, then the office's staff by seniority. */
function rank(designation: string): number {
  const d = designation.toLowerCase();
  const staff = /\b(pps|ps|aps|pa|private secretary|personal assistant)\b|\bto\b/.test(d);
  if (/minister/.test(d) && !staff) return 0;
  if (!staff) return 1;
  if (/^(sr\.?\s*)?pps|principal private|^private secretary|^ps\b/.test(d)) return 2;
  if (/additional private/.test(d)) return 3;
  if (/assistant private|^aps\b/.test(d)) return 4;
  if (/\bpa\b|personal assistant/.test(d)) return 5;
  return 6;
}

/** "Dr. Virendra Kumar, HMSJE" and "Shri B L Verma" match their duplicates. */
function personKey(name: string): string {
  return name
    .split(",")[0]!
    .toLowerCase()
    .replace(/\b(shri|smt|ms|mrs|mr|dr)\b\.?/g, "")
    .replace(/[^a-z]/g, "");
}

function splitList(raw: string | undefined): string[] {
  return (raw ?? "").split(/\s*,\s*/).map((s) => s.trim()).filter(Boolean);
}

/**
 * The Department's officers, by office, in the reference's order.
 * SOURCE: the officials register (`content/website/official.json`, 162 MoSJE records
 * ingested from dosje.gov.in on 18 Sep 2026). Records without an office — the three
 * Ministers' leadership records — are drawn in the chart above the tables.
 */
export function teamOffices(): DbimTeamOffice[] {
  const byGroup = new Map<string, DbimTeamMember[]>();
  const seen = new Set<string>();
  for (const o of getOfficialsByOrganisation("MoSJE")) {
    const group = o.group?.trim().toUpperCase();
    if (!group) continue;
    const key = `${group}|${personKey(o.title)}`;
    if (seen.has(key)) continue;
    seen.add(key);
    const phones = phoneGroups(o.phoneOffice);
    const member: DbimTeamMember = {
      name: o.title.trim(),
      designation: (o.designation ?? "").trim(),
      phones: phones.filter((g) => g.kind !== "fax").flatMap((g) => g.numbers.map((n) => ({ text: n.text, tel: n.tel }))),
      faxes: phones.filter((g) => g.kind === "fax").flatMap((g) => g.numbers.map((n) => n.text)),
      emails: splitList(o.email).filter((e) => !FREE_MAIL.test(e)),
      intercom: o.intercom?.trim() || undefined,
      address: o.address?.trim() || undefined,
    };
    byGroup.set(group, [...(byGroup.get(group) ?? []), member]);
  }

  const known = new Map(OFFICE_ORDER);
  const order = [
    ...OFFICE_ORDER.map(([g]) => g).filter((g) => byGroup.has(g)),
    ...[...byGroup.keys()].filter((g) => !known.has(g)).sort(),
  ];
  return order.map((group) => ({
    id: group.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, ""),
    label: known.get(group) ?? group,
    members: [...byGroup.get(group)!].sort(
      (a, b) => rank(a.designation) - rank(b.designation) || a.name.localeCompare(b.name),
    ),
  }));
}

/* ── Our Division ──────────────────────────────────────────────────────────── */

/**
 * The Department's own one-line description of a division, where it publishes one.
 * SOURCE: dosje.gov.in's "About the Division" pages as the redesign transcribed them
 * (`app/website/about-the-division*`, `official-language-background`, read 21 Sep 2026).
 * A division the Department describes nowhere gets no description.
 */
const DIVISION_SUMMARY: Record<string, string> = {
  "scheduled-caste-welfare":
    "The Scheduled Castes Development (SCD) Bureau aims to promote the welfare of Scheduled Castes through their educational, economic and social empowerment.",
  "welfare-of-other-backward-classes":
    "Under the Backward Classes Bureau, the Ministry is mandated to look after the welfare of Backward Classes, by implementing the schemes for Backward Classes.",
  "social-defence":
    "The Social Defence Division of the Department mainly caters to the requirements of senior citizens, victims of alcoholism and substance abuse, transgender persons, and persons engaged in beggary or destitution.",
  "statistics-division":
    "The Statistics Division of the Department of Social Justice & Empowerment is primarily responsible for sponsoring evaluation and research studies on the schemes for its target groups.",
  "official-language":
    "Hindi unit is responsible for implementation of Official Language policy and the progressive use of Official Language Hindi in the Department of Social Justice and Empowerment and the Offices under its control.",
};

export interface DbimCardItem {
  slug: string;
  title: string;
  description?: string;
  /** A path inside the DBIM tree, or an absolute URL. */
  href: string;
  external?: boolean;
}

export function divisionCards(): DbimCardItem[] {
  return DIVISIONS.map((d) => ({
    slug: d.id,
    title: d.name,
    description: DIVISION_SUMMARY[d.id],
    href: `/ministry/our-division/${d.id}`,
  }));
}

/**
 * WHERE A DIVISION'S RELATED LINK GOES IN THE DBIM DESIGN. `DIVISIONS[].links` point at
 * pages of the 2026 design, which this design does not have; a DBIM page never links to
 * a page that does not exist in it. Each internal link is mapped here, in this order of
 * preference: an existing DBIM page carrying the same content; a DBIM register page
 * rendering the same data (`./division-registers.ts`); otherwise dropped, with the
 * reason. External links pass through untouched. A link missing from this map is
 * dropped too, so a link added to the shared data later cannot 404 here — add its row.
 * The table, with the reasoning: docs/research/dbim-reference/components/link-map.spec.md.
 */
type LinkTarget = { path: string } | { dropped: string };

const ON_THIS_PAGE = "the reader is on this division's page";
const TEXT_ONLY =
  "its content exists only as text typed into the 2026 design's page file, not as data a DBIM page can read, and no DBIM page carries it";

export const DBIM_DIVISION_LINK_MAP: Record<string, LinkTarget> = {
  // Scheduled Caste Welfare
  "/website/about-the-division": { dropped: ON_THIS_PAGE },
  "/website/policies-acts-rules-circular": { path: "/documents/publications/acts-rules" },
  // Welfare of the Other Backward Classes
  "/website/about-the-division-welfare-of-the-other-backward-classes": { dropped: ON_THIS_PAGE },
  "/website/policies-acts-rules-codes-circular": { path: "/documents/publications/acts-rules" },
  "/website/welfare-of-the-other-backward-classes": { dropped: TEXT_ONLY },
  // Grants-in-Aid to NGOs
  "/website/prioritization-guidelines-for-funding-projects-by-voluntary-organisations": { dropped: TEXT_ONLY },
  "/website/procedure-for-processing-grant-in-aid-cases-in-respect-of-voluntary-organisations": { dropped: TEXT_ONLY },
  "/website/inspection-and-monitoring-procedure": { dropped: TEXT_ONLY },
  "/website/penalties-in-case-of-misutilisation-of-grants": { dropped: TEXT_ONLY },
  "/website/cessation-of-voluntary-organisation-activities": { dropped: TEXT_ONLY },
  "/website/guidelines-for-assisting-ngos-voluntary-organisations": { dropped: TEXT_ONLY },
  "/website/grants-in-aid-to-ngos-faqs": { dropped: TEXT_ONLY },
  // Budget and Account — the accounts office's contacts are in the Department's directory (PR.CCA).
  "/website/contact-person": { path: "/ministry/directory" },
  // Social Defence
  "/website/about-the-division-social-defence": { dropped: ON_THIS_PAGE },
  "/website/drug-division": { dropped: TEXT_ONLY },
  "/website/organisation-under-division-social-division": { path: "/ministry/our-organisation/national-institute-of-social-defence" },
  "/website/policies-acts-rules-codes-circular-social-defence": { path: "/documents/publications/acts-rules" },
  "/website/social-defence-faqs": { dropped: TEXT_ONLY },
  // Statistics Division
  "/website/about-the-division-statistics-division": { dropped: ON_THIS_PAGE },
  "/website/list-of-research-evaluation-studies": { dropped: TEXT_ONLY },
  // Official Language
  "/website/official-language-background": { dropped: TEXT_ONLY },
  "/website/official-language-act": { dropped: TEXT_ONLY },
  "/website/activities-of-the-ministry-official-language": { dropped: TEXT_ONLY },
  // Parliamentary Matters
  "/website/assurances": { dropped: TEXT_ONLY },
  // Plan Division
  "/website/about-the-division-2": { dropped: ON_THIS_PAGE },
  // The registers the estate holds as data: a DBIM page each.
  ...Object.fromEntries(DBIM_REGISTERS.map((r) => [r.from, { path: registerPath(r) }])),
};

export interface DbimDivisionLink {
  label: string;
  /** A DBIM path (resolve with `dbimHref`) or an absolute URL. */
  href: string;
  external: boolean;
}

function divisionLink(l: { label: string; href: string }): DbimDivisionLink[] {
  if (/^https?:/.test(l.href)) return [{ label: l.label, href: l.href, external: true }];
  const t = DBIM_DIVISION_LINK_MAP[l.href];
  return t && "path" in t ? [{ label: l.label, href: t.path, external: false }] : [];
}

export function divisionDetail(slug: string) {
  const d = DIVISIONS.find((x) => x.id === slug);
  if (!d) return undefined;
  return {
    title: d.name,
    summary: DIVISION_SUMMARY[d.id],
    links: d.links.flatMap(divisionLink),
  };
}

/* ── Our Organisation ──────────────────────────────────────────────────────── */

/** The registry's category names, which the redesign's Organisations page uses too. */
const TYPE_LABEL: Record<OrganisationCategory, string> = {
  commissions: "Commissions",
  corporations: "Corporations",
  foundations: "Foundations & Autonomous Bodies",
  schemes: "Schemes & Portals",
};

const TYPE_ORDER: OrganisationCategory[] = ["commissions", "foundations", "corporations", "schemes"];

export function isOrganisationType(slug: string): slug is OrganisationCategory {
  return (TYPE_ORDER as string[]).includes(slug);
}

export function organisationTypeLabel(type: OrganisationCategory): string {
  return TYPE_LABEL[type];
}

/** "A, B and C." */
function nameList(names: string[]): string {
  if (names.length <= 1) return names.join("");
  return `${names.slice(0, -1).join(", ")} and ${names.at(-1)}.`;
}

/** One card per type; the description names the bodies it holds, read from the registry. */
export function organisationTypeCards(): DbimCardItem[] {
  return TYPE_ORDER.filter((t) => ORGANISATIONS.some((o) => o.category === t)).map((t) => ({
    slug: t,
    title: TYPE_LABEL[t],
    description: nameList(ORGANISATIONS.filter((o) => o.category === t).map((o) => o.name)),
    href: `/ministry/our-organisation/${t}`,
  }));
}

/** One card per organisation of a type. A body with no ingested page opens its own portal. */
export function organisationCards(type: OrganisationCategory): DbimCardItem[] {
  return ORGANISATIONS.filter((o) => o.category === type).map((o) => {
    const record = getOrganisation(o.id);
    const first = record?.sections.find((s) => kindOf(s) === "prose");
    return {
      slug: o.id,
      title: o.name,
      description: firstSentence(first?.html),
      href: record ? `/ministry/our-organisation/${o.id}` : o.externalUrl ?? o.profileHref,
      external: !record,
    };
  });
}

/** Ids of the organisations that have a detail page here. */
export function organisationIds(): string[] {
  return ORGANISATIONS.filter((o) => getOrganisation(o.id)).map((o) => o.id);
}

export function organisationDetail(id: string) {
  const entry = ORGANISATIONS.find((o) => o.id === id);
  const record = getOrganisation(id);
  if (!entry || !record) return undefined;
  const prose = record.sections.filter((s) => kindOf(s) === "prose").map((s) => ({ ...s }));
  const same = (a?: string | null) => (a ?? "").toLowerCase().replace(/[^a-z]/g, "") === record.title.toLowerCase().replace(/[^a-z]/g, "");
  // The body's lead paragraph becomes the summary box, and leaves the body, so it is said once.
  let summary = firstSentence(prose[0]?.html);
  const lead = prose[0]?.html.match(/<p\b[^>]*>([\s\S]*?)<\/p>/i);
  if (prose[0] && lead && stripTags(lead[1] ?? "")) {
    summary = stripTags(lead[1] ?? "");
    prose[0].html = prose[0].html.replace(lead[0], "");
  }
  return {
    title: entry.name,
    type: entry.category,
    summary,
    externalUrl: entry.externalUrl,
    sections: prose
      .map((s) => ({
        heading: s.heading && !same(s.heading) ? stripTags(s.heading) : undefined,
        html: cleanHtml(s.html, { headingLevel: 3, label: s.heading ?? entry.name }),
      }))
      .filter((s) => stripTags(s.html) !== ""),
  };
}

/* ── Our Performance ───────────────────────────────────────────────────────── */

export interface DbimDashboardTile {
  title: string;
  image: { src: string; alt: string; contain?: boolean };
  href: string;
  external: boolean;
  /** DD.MM.YYYY where the Department publishes a date. */
  date?: string;
}

/**
 * The Department's performance dashboards. The Social Audit tile and its date are the
 * reference's (it is the Department's own portal); the PM-AJAY dashboard is this
 * website's, reading the scheme's MIS feeds.
 */
export const DBIM_DASHBOARDS: DbimDashboardTile[] = [
  {
    title: "Social Audit",
    image: { src: DBIM_CAMPAIGNS.socialAudit.src, alt: DBIM_CAMPAIGNS.socialAudit.alt },
    href: DBIM_CAMPAIGNS.socialAudit.href,
    external: true,
    // SOURCE: the reference's tile, master-socialjustice.digifootprint.gov.in/ministry/our-performance, 25 Sep 2026.
    date: "24.10.2025",
  },
  {
    title: "PM-AJAY Dashboard",
    image: { src: "/website/images/PM-AJAY-logo.png", alt: "Pradhan Mantri Anusuchit Jaati Abhyuday Yojana (PM-AJAY)", contain: true },
    href: "/dashboard",
    external: false,
  },
];
