/**
 * The Department's own published registers, transcribed from the pages that
 * carry them rather than from the documents REST type.
 *
 * ── WHY THESE ARE NOT IN THE INGEST ──────────────────────────────────────────
 * `apps/hub/scripts/ingest/COLLECTIONS.md` records that WordPress pages are the
 * site's PROSE and are not a record collection. These four pages publish their
 * content as a hand-built table inside the page body — it is not in the REST
 * API and not in `documents`, so there is nothing to read it from. The rows and
 * the file URLs below are the department's own, taken verbatim from the live
 * pages on 18 September 2026; nothing here is authored.
 *
 * Every URL points at the department's own CDN, as the live pages do. Files are
 * linked, never mirrored — the product decision recorded in COLLECTIONS.md.
 */

const CDN = "https://durwo6bhtjtqt.cloudfront.net/wp-content/uploads";

export interface RegisterEntry {
  /** As the department prints it. */
  label: string;
  href: string;
  date?: string;
  fileSize?: string;
}

/**
 * State- and UT-wise lists of Scheduled Castes, as published up to 15-02-2024.
 *
 * The spellings are the department's — "Gujrat", "Maharastra", "Pondicherri/
 * Puducherry", "Laddakh" — and are left alone. `ui-restraint-and-copy.md`:
 * never rewrite what the department published to suit our layout.
 */
export const SCHEDULED_CASTE_LISTS: RegisterEntry[] = [
  { label: "Andhra Pradesh", href: `${CDN}/2025/12/andhra.jpg` },
  { label: "Assam", href: `${CDN}/2025/12/assam.jpg` },
  { label: "Bihar", href: `${CDN}/2025/12/bihar.jpg` },
  { label: "Gujrat", href: `${CDN}/2026/09/Scan-0004.jpg` },
  { label: "Haryana", href: `${CDN}/2025/12/haryana-scaled.jpg` },
  { label: "Himachal Pradesh", href: `${CDN}/2025/12/himachalpradesh.jpg` },
  { label: "Jharkhand", href: `${CDN}/2026/09/22061686895727-1.pdf` },
  { label: "Karnataka", href: `${CDN}/2025/12/karnataka.pdf` },
  { label: "Kerala", href: `${CDN}/2025/12/kerela.pdf` },
  { label: "Madhya Pradesh", href: `${CDN}/2025/12/madhyapradesh.pdf` },
  { label: "Maharastra", href: `${CDN}/2025/12/maharashtra.jpg` },
  { label: "Manipur", href: `${CDN}/2025/12/manipur.jpg` },
  { label: "Meghalaya", href: `${CDN}/2025/12/meghalaya.jpg` },
  { label: "Odisha", href: `${CDN}/2025/12/odisha.pdf` },
  { label: "Punjab", href: `${CDN}/2025/12/punjab.jpg` },
  { label: "Rajasthan", href: `${CDN}/2025/12/rajasthan.jpg` },
  { label: "Tamil Nadu", href: `${CDN}/2025/12/tamilnadu.pdf` },
  { label: "Tripura", href: `${CDN}/2025/12/tripura.jpg` },
  { label: "Uttar Pradesh", href: `${CDN}/2025/12/uttarpradesh.pdf` },
  { label: "West Bengal", href: `${CDN}/2025/12/westbengal-scaled.jpg` },
  { label: "Mizoram", href: `${CDN}/2025/12/mizoram.jpg` },
  { label: "Goa", href: `${CDN}/2025/12/goa.jpg` },
  { label: "Chhattisgarh", href: `${CDN}/2025/12/chattisgarh.pdf` },
  { label: "Uttarakhand", href: `${CDN}/2025/12/uttarakhand.jpg` },
  { label: "Telangana", href: `${CDN}/2025/12/telengana.jpg` },
  { label: "Delhi", href: `${CDN}/2025/12/delhi.pdf` },
  { label: "Chandigarh", href: `${CDN}/2026/09/Scan-0028.jpg` },
  { label: "Daman and Diu", href: `${CDN}/2025/12/damandiu.jpg` },
  { label: "Jammu and Kashmir", href: `${CDN}/2025/12/jammukashmir.pdf` },
  { label: "Dadra and Nagar Haveli", href: `${CDN}/2025/12/dadranagarhaveli.pdf` },
  { label: "Pondicherri/Puducherry", href: `${CDN}/2025/12/puducherry.jpg` },
  { label: "Sikkim", href: `${CDN}/2025/12/sikkim.jpg` },
  { label: "Laddakh", href: `${CDN}/2025/12/ladakh.pdf` },
];

/** Circulars issued by the National Commission for Scheduled Castes. */
export const NCSC_FUNCTION_CIRCULARS: RegisterEntry[] = [
  {
    label: "Acceptance of caste/ community cerfiicates produced by Scheduled Caste candidates",
    href: `${CDN}/2025/11/94911672891518.pdf`,
  },
  {
    label: "Caste status of offspring of separated/ diverced/ single woman",
    href: `${CDN}/2025/11/98661672891374.pdf`,
  },
  {
    label:
      "Verification of caste cerfiicates and punishment for holding false SC certificates and issuing authority",
    href: `${CDN}/2025/11/80241672891268.pdf`,
  },
  {
    label: "Avoid nomenclature Dalit/Harijan/Girijanfor the members of Scheduled Castes",
    href: `${CDN}/2025/11/93511733804554.pdf`,
  },
  {
    label: "Issue of Scheduled Caste Certificate to migrants from other States/UTs",
    href: `${CDN}/2025/11/Letter-dated-15112016.pdf`,
  },
  {
    label: "Issue of Scheduled Caste Certificate to the members of Buddhism Religion",
    href: `${CDN}/2025/11/Letter-dated-15112016.pdf`,
  },
  {
    label: "Issue of caste/ tribe certificate consequent upon reorganization of States- clarification",
    href: `${CDN}/2025/11/68181749551382.pdf`,
  },
  {
    label:
      "Modalities for deciding claims for inclusion in, exclusion from and other modifications",
    href: `${CDN}/2025/11/Mod-incl-excl-SC636017833100514524.pdf`,
  },
];

/**
 * Detailed Demand for Grant, by financial year.
 *
 * 2021-22 and 2023-24 link the same file as 2019-20, and 2024-25 the same file
 * as 2022-23, on the department's own page. Those duplicates are reproduced as
 * published: correcting them here would mean guessing which document the
 * department meant, and the wrong Demand for Grant is worse than a repeated one.
 */
export const DETAILED_DEMAND_FOR_GRANT: RegisterEntry[] = [
  { label: "Demand For Grant 2012-2013", href: `${CDN}/2025/11/2012-2013.pdf` },
  { label: "Demand For Grant 2013-2014", href: `${CDN}/2025/11/2013-2014.pdf` },
  { label: "Demand For Grant 2014-2015", href: `${CDN}/2025/11/2014-2015.pdf` },
  { label: "Demand For Grant 2015-2016", href: `${CDN}/2025/11/2015-2016.pdf` },
  { label: "Demand For Grant 2016-2017", href: `${CDN}/2025/11/2016-2017.pdf` },
  { label: "Demand For Grant 2017-2018", href: `${CDN}/2025/11/2017-2018.pdf` },
  { label: "Demand For Grant 2019-2020", href: `${CDN}/2025/11/grants_2019-2020.pdf` },
  { label: "Demand For Grant 2020-2021", href: `${CDN}/2025/11/50451686641079.pdf` },
  { label: "Demand For Grant 2021-2022", href: `${CDN}/2025/11/grants_2019-2020.pdf` },
  { label: "Demand For Grant 2022-2023", href: `${CDN}/2025/11/33321686648281.pdf` },
  { label: "Demand For Grant 2023-2024", href: `${CDN}/2025/11/grants_2019-2020.pdf` },
  { label: "Demand For Grant 2024-2025", href: `${CDN}/2025/11/33321686648281.pdf` },
];

/** Handbook on Social Welfare Statistics, by edition. */
export const SOCIAL_WELFARE_STATISTICS: RegisterEntry[] = [
  {
    label: "Handbook on Social Welfare Statistics 2024",
    href: `${CDN}/2025/12/2024.pdf`,
    date: "14 Aug 2024",
    fileSize: "5.81 MB",
  },
  {
    label: "Handbook on Social Welfare Statistics 2021",
    href: `${CDN}/2025/12/2021-HANDBOOKSocialWelfareStatistice2021.pdf`,
    date: "26 Jan 2024",
    fileSize: "4.42 MB",
  },
  {
    label: "Handbook on Social Welfare Statistics 2018",
    href: `${CDN}/2025/12/2018-HANDBOOKSocialWelfareStatistice2018.pdf`,
    date: "26 Jan 2024",
    fileSize: "3.03 MB",
  },
  {
    label: "Handbook on Social Welfare Statistics 2016",
    href: `${CDN}/2025/12/2016-HANDBOOK-Social-Welfare-Statistice-2016.pdf`,
    date: "26 Jan 2024",
    fileSize: "3.99 MB",
  },
];

/** Special Mentions in the Rajya Sabha and matters raised under Rule 377. */
export const SPECIAL_MENTION_MATTERS: RegisterEntry[] = [
  {
    label: "Special Mention in Rajya Sabha",
    href: `${CDN}/2025/12/Splmen10012017.pdf`,
    date: "26 Jan 2024",
    fileSize: "437.16 KB",
  },
  {
    label: "Rule 377 in Lok Sabha",
    href: `${CDN}/2025/12/Rule37710012017.pdf`,
    date: "26 Jan 2024",
    fileSize: "966.45 KB",
  },
  {
    label: "Monitoring Replies to Special Mentions and Rule 377 Issues",
    href: `${CDN}/2025/12/parlia8.pdf`,
    date: "26 Jan 2024",
    fileSize: "23.46 KB",
  },
];
