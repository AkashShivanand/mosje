/**
 * PARTNER LOGOS — the carousel above the live home page's footer, shared by all
 * three designs of the website. Rule: home.ts.
 *
 * SOURCE: the logo carousel of https://dosje.gov.in/, read on PARTNERS_AS_ON — 42
 * slides in the live order: the Department's own bodies first, then the
 * Government of India platforms and the helplines it links to. The files are the
 * live site's, fetched that day; two were cut down on the way — the BJRNF
 * photograph from 1254px and 1.7MB to 300px, and the NHAPOA mark, a 632KB CMYK
 * JPEG most browsers draw in the wrong colours, to RGB. Department of Empowerment
 * of Persons with Disabilities appears twice, as it does on the live carousel.
 *
 * `label` is ours: every live image carries an empty alt, so each mark is named
 * after the site it opens (WCAG 1.1.1). A mark for one of the Department's own
 * bodies names its registry entry, and each design links it to that body's page;
 * any other mark carries the live link.
 */

export const PARTNERS_AS_ON = "2026-09-28";

export interface PartnerLogo {
  src: string;
  /** The accessible name — the site the mark opens. */
  label: string;
  /** One of the Department's own bodies (data/website/organisations.ts). */
  organisationId?: string;
  /** Any other destination, as the live carousel links it. */
  href?: string;
  /** The file's own size, so the page reserves its space. */
  width: number;
  height: number;
}

export const PARTNER_LOGOS: readonly PartnerLogo[] = [
  { src: "/website/images/partners/ncbc.png", label: "National Commission for Backward Classes", organisationId: "national-commission-for-backward-classes-ncbc", width: 300, height: 300 },
  { src: "/website/images/partners/ncsc.png", label: "National Commission for Scheduled Castes", organisationId: "national-commission-for-scheduled-castes", width: 300, height: 304 },
  { src: "/website/images/partners/nsfdc.png", label: "National Scheduled Castes Finance and Development Corporation", organisationId: "national-scheduled-castes-finance-and-development-corporation", width: 200, height: 200 },
  { src: "/website/images/partners/nskfdc.png", label: "National Safai Karamcharis Finance and Development Corporation", organisationId: "national-safai-karamcharis-finance-development-corporation", width: 200, height: 200 },
  { src: "/website/images/partners/nbcfdc.png", label: "National Backward Classes Finance and Development Corporation", organisationId: "national-backward-classes-financeand-development-corporationnbcfdc", width: 200, height: 123 },
  { src: "/website/images/partners/daic-mark.png", label: "Dr. Ambedkar International Centre", organisationId: "dr-ambedkar-international-centre", width: 146, height: 146 },
  { src: "/website/images/partners/bjrnf.png", label: "Babu Jagjivan Ram National Foundation", organisationId: "babu-jagjivan-ram-national-foundation-bjrnf", width: 300, height: 300 },
  { src: "/website/images/partners/nisd.png", label: "National Institute of Social Defence", organisationId: "national-institute-of-social-defence", width: 250, height: 250 },
  { src: "/website/images/partners/pm-ajay.png", label: "Pradhan Mantri Anusuchit Jaati Abhyuday Yojana (PM-AJAY)", organisationId: "pradhan-mantri-anusuchit-jaati-abhyuday-yojnapm-ajay", width: 193, height: 147 },
  { src: "/website/images/partners/smile.png", label: "National Portal for Transgender Persons (SMILE)", organisationId: "national-portal-for-transgender-persons", width: 300, height: 300 },
  { src: "/website/images/partners/nos.png", label: "National Overseas Scholarship", organisationId: "national-overseas-scholarship", width: 300, height: 300 },
  { src: "/website/images/partners/nmba.png", label: "Nasha Mukt Bharat Abhiyaan", organisationId: "nasha-mukt-bharat-abhiyaan", width: 300, height: 300 },
  { src: "/website/images/partners/sambal.png", label: "National Helpline Against Atrocities (SAMBAL)", organisationId: "national-helpline-against-atrocities", width: 100, height: 100 },
  { src: "/website/images/partners/mygov.png", label: "MyGov", href: "https://www.mygov.in/", width: 200, height: 123 },
  { src: "/website/images/partners/cpgrams.png", label: "CPGRAMS — Centralised Public Grievance Redress and Monitoring System", href: "https://pgportal.gov.in/", width: 224, height: 222 },
  { src: "/website/images/partners/makeinindia.png", label: "Make in India", href: "https://www.makeinindia.com/", width: 200, height: 123 },
  { src: "/website/images/partners/india-gov.png", label: "National Portal of India", href: "https://india.gov.in/", width: 200, height: 123 },
  { src: "/website/images/partners/data-gov.png", label: "Open Government Data Platform India", href: "https://data.gov.in/", width: 200, height: 150 },
  { src: "/website/images/partners/digital-india.png", label: "Digital India", href: "https://www.digitalindia.gov.in/", width: 200, height: 123 },
  { src: "/website/images/partners/acsis.png", label: "ACSIS — Interest Subsidy on Education Loans for OBCs and EBCs", href: "https://canarabankcsis.in/ACSIS/", width: 200, height: 123 },
  { src: "/website/images/partners/daic-website.jpg", label: "Dr. Ambedkar International Centre website", href: "https://daic.gov.in/", width: 398, height: 130 },
  { src: "/website/images/partners/secc-2011.png", label: "Socio Economic and Caste Census 2011", href: "https://secc.gov.in/", width: 199, height: 123 },
  { src: "/website/images/partners/e-anudaan.jpg", label: "e-Anudaan — Grant-in-Aid to Voluntary Organisations", href: "https://grants-msje.gov.in/", width: 169, height: 71 },
  { src: "/website/images/partners/depwd.png", label: "Department of Empowerment of Persons with Disabilities", href: "https://disabilityaffairs.gov.in/", width: 200, height: 123 },
  { src: "/website/images/partners/ifci.png", label: "IFCI — Credit Enhancement Guarantee Scheme for Scheduled Castes", href: "https://www.ifcicegssc.in/", width: 200, height: 117 },
  { src: "/website/images/partners/vcfsc.png", label: "Venture Capital Fund for Scheduled Castes", href: "https://www.vcfsc.in/", width: 200, height: 123 },
  { src: "/website/images/partners/ncw-helpline.jpg", label: "National Commission for Women Helpline, 7827170170", href: "https://ncwwomenhelpline.in/", width: 257, height: 153 },
  { src: "/website/images/partners/esamiksha.png", label: "e-Samiksha", href: "https://esamiksha.gov.in/", width: 390, height: 95 },
  { src: "/website/images/partners/rti.png", label: "Right to Information Online", href: "https://rtionline.gov.in/", width: 382, height: 207 },
  { src: "/website/images/partners/she-box.jpg", label: "SHe-Box — Sexual Harassment Electronic Box", href: "https://shebox.wcd.gov.in/", width: 228, height: 64 },
  { src: "/website/images/partners/child-marriage-free-bharat.jpg", label: "Child Marriage Free Bharat", href: "https://stopchildmarriage.wcd.gov.in/", width: 656, height: 231 },
  { src: "/website/images/partners/pmmvy.jpg", label: "Pradhan Mantri Matru Vandana Yojana", href: "https://pmmvy.wcd.gov.in/", width: 319, height: 312 },
  { src: "/website/images/partners/sakhi-niwas.jpg", label: "Mission Shakti — Sakhi Niwas", href: "https://missionshakti.wcd.gov.in/statisticsNiwas", width: 105, height: 106 },
  { src: "/website/images/partners/shakti-sadan.jpg", label: "Mission Shakti — Shakti Sadan", href: "https://missionshakti.wcd.gov.in/statisticsSadan", width: 207, height: 101 },
  { src: "/website/images/partners/erss-112.jpg", label: "Emergency Response Support System, 112", href: "https://112.gov.in/", width: 420, height: 405 },
  { src: "/website/images/partners/child-helpline.jpg", label: "Child Helpline, 1098", href: "https://www.wcd.gov.in/child/child-helpline", width: 180, height: 180 },
  { src: "/website/images/partners/women-helpline-181.jpg", label: "Women Helpline, 181", href: "https://wcdhry.gov.in/women-helpline-number-181/", width: 191, height: 217 },
  { src: "/website/images/partners/one-stop-centre.jpg", label: "One Stop Centre (Sakhi)", href: "https://wcdhry.gov.in/schemes-for-women/onestop-centre/", width: 547, height: 568 },
  { src: "/website/images/partners/depwd.png", label: "Department of Empowerment of Persons with Disabilities", href: "https://disabilityaffairs.gov.in/", width: 200, height: 123 },
  { src: "/website/images/partners/seed.png", label: "SEED — Scheme for Economic Empowerment of DNTs", href: "https://dwbdnc.dosje.gov.in/", width: 205, height: 190 },
  { src: "/website/images/partners/elderline.png", label: "Elderline — National Helpline for Senior Citizens, 14567", href: "https://scw.dosje.gov.in/elderline", width: 195, height: 79 },
  { src: "/website/images/partners/nhapoa.jpg", label: "National Helpline for Prevention of Atrocities, 14566", href: "https://nhapoa.gov.in/", width: 680, height: 210 },
];
