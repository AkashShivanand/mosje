import type { Metadata } from "next";
import { ContentPage } from "@/components/website-next/templates/ContentPage";
import { DocumentTable, type DocumentRow } from "@/components/website-next/templates/content/DocumentTable";

const TITLE = "List of Research / Evaluation Studies";
const DESCRIPTION = "Executive summaries of evaluation studies conducted during 2017-18, 2018-19, 2019-20 and 2021-22.";

export const metadata: Metadata = {
  title: `${TITLE} | Department of Social Justice & Empowerment`,
  description: DESCRIPTION,
};

/*
 * Body text: dosje.gov.in/list-of-research-evaluation-studies/ as published,
 * read 21 Sep 2026. The live table's "Term" column (the study year, e.g.
 * "2017-18") has no field on the shared DocumentTable, so it is appended to
 * each title in parentheses rather than dropped. Document titles kept
 * verbatim; only trailing spaces/punctuation trimmed. No typos corrected.
 */
const DOCS: DocumentRow[] = [
  { title: "Functioning of Old Age Homes/Day Care Centres and Integrated Rehabilitation Centres for Drug Addicts (IRCAs) Funded by D/O Social Justice & Empowerment (2017-18)", published: "26 Jan 2024", size: "729.48 KB", href: "https://durwo6bhtjtqt.cloudfront.net/wp-content/uploads/2025/12/1.-OAHDCCIRCAs10818_1648025799.pdf" },
  { title: "Self Employment Scheme for Rehabilitation of Manual Scavengers (SRMS) (2017-18)", published: "26 Jan 2024", size: "821.45 KB", href: "https://durwo6bhtjtqt.cloudfront.net/wp-content/uploads/2025/12/2.-SRMS10818_1648025882.pdf" },
  { title: "Babu Jagjivan Ram Chhattravas Yojana for SCs (2017-18)", published: "26 Jan 2024", size: "276.46 KB", href: "https://durwo6bhtjtqt.cloudfront.net/wp-content/uploads/2025/12/3.-aBJRCYSCs10818_1648025919.pdf" },
  { title: "Construction of Hostels for OBC Boys and Girls (2017-18)", published: "26 Jan 2024", size: "361.47 KB", href: "https://durwo6bhtjtqt.cloudfront.net/wp-content/uploads/2025/12/3.-b-ConstructionofHostels10818_1648025960.pdf" },
  { title: "Venture Capital Fund for Scheduled Castes Entrepreneurs (2017-18)", published: "26 Jan 2024", size: "219.02 KB", href: "https://durwo6bhtjtqt.cloudfront.net/wp-content/uploads/2025/12/4.-VentureCapital10818_1648025992.pdf" },
  { title: "Effectiveness and Impact of Activities of NISD in the Field of Drug Abuse Prevention & Old Age Care (2017-18)", published: "26 Jan 2024", size: "790.46 KB", href: "https://durwo6bhtjtqt.cloudfront.net/wp-content/uploads/2025/12/5.-NISD10818_1648026086.pdf" },
  { title: "Post Matric Scholarship Scheme for Scheduled Castes (SCs) (2017-18)", published: "26 Jan 2024", size: "156.08 KB", href: "https://durwo6bhtjtqt.cloudfront.net/wp-content/uploads/2025/12/6.-aPostMatricSC2017-18-2_1648794358.pdf" },
  { title: "Post Matric Scholarship Scheme for Other Backward Classes (OBCs) (2017-18)", published: "26 Jan 2024", size: "178.00 KB", href: "https://durwo6bhtjtqt.cloudfront.net/wp-content/uploads/2025/12/6.-b-PostMatricOBC10818_1648026325.pdf" },
  { title: "Outcome Based Evaluation of Pre-Matric Scholarship Scheme for Scheduled Castes (SCs) (2018-19)", published: "26 Jan 2024", size: "1.71 MB", href: "https://durwo6bhtjtqt.cloudfront.net/wp-content/uploads/2025/12/9.pdf" },
  { title: "Outcome Based Evaluation of Pre-Matric Scholarship Scheme for Other Backward Classes (OBCs) (2018-19)", published: "26 Jan 2024", size: "199.13 KB", href: "https://durwo6bhtjtqt.cloudfront.net/wp-content/uploads/2025/12/10.-SUMMARY-REPORT-Evaluation-of-PMS-OBC_1648793629.pdf" },
  { title: "Functioning of SC/ST Protection Cells as per the Responsibilities Specified Under Rule 8 of the POA Rules (2018-19)", published: "26 Jan 2024", size: "339.78 KB", href: "https://durwo6bhtjtqt.cloudfront.net/wp-content/uploads/2025/12/11.-Summary-Report-Evaluation-of-SCST-Protection-Cells_1648793671.pdf" },
  { title: "Assistance to Voluntary Organizations Working for Scheduled Castes (SCs) (2019-20)", published: "26 Jan 2024", size: "347.74 KB", href: "https://durwo6bhtjtqt.cloudfront.net/wp-content/uploads/2025/12/12.-Executive-Summary-AVO_1648794815.pdf" },
  { title: "Self Employment Scheme for Rehabilitation of Manual Scavengers (SRMS) (2019-20)", published: "26 Jan 2024", size: "442.33 KB", href: "https://durwo6bhtjtqt.cloudfront.net/wp-content/uploads/2025/12/13.-SRMS-Executive-Summary_1648794849.pdf" },
  { title: "Functioning of Dr. Ambedkar Foundation (DAF) (2019-20)", published: "26 Jan 2024", size: "436.82 KB", href: "https://durwo6bhtjtqt.cloudfront.net/wp-content/uploads/2025/12/14.-DAF-1_1648794996.pdf" },
  { title: "Free Coaching Scheme for SC and OBC Students (2019-20)", published: "26 Jan 2024", size: "400.89 KB", href: "https://durwo6bhtjtqt.cloudfront.net/wp-content/uploads/2025/12/15.pdf" },
  { title: "National Backward Classes Finance and Development Corporation (NBCFDC) (2019-20)", published: "26 Jan 2024", size: "655.93 KB", href: "https://durwo6bhtjtqt.cloudfront.net/wp-content/uploads/2025/12/16.-Executive-Summary-Evaluation-of-NBCFDC_1648795070.pdf" },
  { title: "National Scheduled Castes Finance and Development Corporation (NSFDC) (2019-20)", published: "26 Jan 2024", size: "564.84 KB", href: "https://durwo6bhtjtqt.cloudfront.net/wp-content/uploads/2025/12/17.-Summary-Report-Evaluation-of-NSFDC_1648795113.pdf" },
  { title: "National Institute of Social Defence (NISD) (2019-20)", published: "26 Jan 2024", size: "927.67 KB", href: "https://durwo6bhtjtqt.cloudfront.net/wp-content/uploads/2025/12/18.-Summary-Rpt_Evaluation-Report_NISD_1648795165.pdf" },
  { title: "Post Matric Scholarship for Scheduled Caste (SC) Students (2019-20)", published: "26 Jan 2024", size: "1015.60 KB", href: "https://durwo6bhtjtqt.cloudfront.net/wp-content/uploads/2025/12/19.-Summary-Rpt_Evaluation-Study-of-Post-Matric-Scholarship_Ecopie-Services_1648795347.pdf" },
  { title: "Pre-Matric Scholarships to the Children of Those Engaged in Occupations Involving Cleaning and Prone to Health Hazards (2019-20)", published: "26 Jan 2024", size: "276.74 KB", href: "https://durwo6bhtjtqt.cloudfront.net/wp-content/uploads/2025/12/20.-Executive-Summary-Pre-Matric-scholar_1648796935.pdf" },
  { title: "Integrated Programme for Senior Citizens (IPSrC) (2019-20)", published: "26 Jan 2024", size: "549.45 KB", href: "https://durwo6bhtjtqt.cloudfront.net/wp-content/uploads/2025/12/21.-Integrated-Programme-for-Senior-Citizens-Executive-Summary_1648795432.pdf" },
  { title: "National Fellowship for Scheduled Caste (SC) Students (2019-20)", published: "26 Jan 2024", size: "310.79 KB", href: "https://durwo6bhtjtqt.cloudfront.net/wp-content/uploads/2025/12/22.pdf" },
  { title: "National Fellowship for Other Backward Classes (OBC) Students (2019-20)", published: "26 Jan 2024", size: "595.27 KB", href: "https://durwo6bhtjtqt.cloudfront.net/wp-content/uploads/2025/12/23.-National-Fellowship-for-OBC-Students-Executive-Summary_1648795507.pdf" },
  { title: "National Overseas Scholarship (NOS) for SC Students (2019-20)", published: "26 Jan 2024", size: "475.49 KB", href: "https://durwo6bhtjtqt.cloudfront.net/wp-content/uploads/2025/12/24.pdf" },
  { title: "National Overseas Scholarship for OBCs (Dr. Ambedkar Scheme of Interest Subsidy on Educational Loans for Overseas Studies for OBCs/EBCs) (2019-20)", published: "26 Jan 2024", size: "234.39 KB", href: "https://durwo6bhtjtqt.cloudfront.net/wp-content/uploads/2025/12/25.-Dr.-Ambedkar-Scheme-if-Interest-Subsidy-Executive-Summary_1648795596.pdf" },
  { title: "Venture Capital Fund for Scheduled Castes (VCF-SC) (2019-20)", published: "26 Jan 2024", size: "726.60 KB", href: "https://durwo6bhtjtqt.cloudfront.net/wp-content/uploads/2025/12/26.-Venture-Capital-Fund-for-SC-Executive-Summary_1648795641.pdf" },
  { title: "Credit Enhancement Guarantee Scheme for Scheduled Castes (CEGS-SC) (2019-20)", published: "26 Jan 2024", size: "207.07 KB", href: "https://durwo6bhtjtqt.cloudfront.net/wp-content/uploads/2025/12/27.-Executive-Summary-Credit-Enhancement-Guarantee-Scheme-for-SC_1648795665.pdf" },
  { title: "Assistance to Voluntary Organisations for OBCs [Assistance for Skill Development of Other Backward Classes (OBCs) / De-Notified, Nomadic and Semi-Nomadic Tribes (DNTs) / Economically Backward Classes (EBCs)] (2019-20)", published: "26 Jan 2024", size: "590.08 KB", href: "https://durwo6bhtjtqt.cloudfront.net/wp-content/uploads/2025/12/28.-Assistance-to-Skill-Development-Executive-Summary_1648795711.pdf" },
  { title: "Assistance to Voluntary Organisations for Providing Social Defence Services (2019-20)", published: "26 Jan 2024", size: "320.63 KB", href: "https://durwo6bhtjtqt.cloudfront.net/wp-content/uploads/2025/12/29.pdf" },
  { title: "Top Class Education for SC Students (2019-20)", published: "26 Jan 2024", size: "699.93 KB", href: "https://durwo6bhtjtqt.cloudfront.net/wp-content/uploads/2025/12/30.-Top-Class-Education-for-SC-Students_compressed_1648808717.pdf" },
  { title: "National Safai Karamcharis Finance and Development Corporation (NSKFDC) (2019-20)", published: "26 Jan 2024", size: "403.67 KB", href: "https://durwo6bhtjtqt.cloudfront.net/wp-content/uploads/2025/12/31.-Executive-Summary-NSKFDC_1648795991.pdf" },
  { title: "Rashtriya Vayoshri Yojana (RVY) (2019-20)", published: "26 Jan 2024", size: "317.40 KB", href: "https://durwo6bhtjtqt.cloudfront.net/wp-content/uploads/2025/12/32.-SUMMARY-REPORT_1648796026.pdf" },
  { title: "Functioning and Effectiveness of the Maintenance and Welfare of Parents and Senior Citizens Act, 2007 (2019-20)", published: "26 Jan 2024", size: "2.50 MB", href: "https://durwo6bhtjtqt.cloudfront.net/wp-content/uploads/2025/12/33.-Executive-Summary-Functioning_1648808677.pdf" },
  { title: "Vanchit Ikai Samooh Aur Vargon Ki Aarthik Sahayta (VISVAS) Yojana (2021-22)", published: "26 Jan 2024", size: "4.39 MB", href: "https://durwo6bhtjtqt.cloudfront.net/wp-content/uploads/2025/12/34.pdf" },
  { title: "Rashtriya Vayoshri Yojana (RVY) (2023-24)", published: "12 Sep 2024", size: "281.87 KB", href: "https://durwo6bhtjtqt.cloudfront.net/wp-content/uploads/2025/12/35.pdf" },
  { title: "Sample Check Study of Institutions/Beneficiaries Under the Pre-Matric and Post-Matric Scholarship Schemes for OBC and Others Being Implemented Mainly by the States/UTs (2023-24)", published: "21 Apr 2025", size: "355.48 KB", href: "https://durwo6bhtjtqt.cloudfront.net/wp-content/uploads/2025/12/36.pdf" },
  { title: "National Action Plan for Drug Demand Reduction (NAPDDR) (2023-24)", published: "21 Apr 2025", size: "171.07 KB", href: "https://durwo6bhtjtqt.cloudfront.net/wp-content/uploads/2025/12/37.pdf" },
  { title: "Impact Assessment of Dr. Ambedkar Scheme of Interest Subsidy on Educational Loans for Overseas Studies for OBCs/EBCs (2023-24)", published: "21 Apr 2025", size: "251.45 KB", href: "https://durwo6bhtjtqt.cloudfront.net/wp-content/uploads/2025/12/38.pdf" },
  { title: "Impact Assessment of National Overseas Scholarship for SC Students (2023-24)", published: "21 Apr 2025", size: "250.59 KB", href: "https://durwo6bhtjtqt.cloudfront.net/wp-content/uploads/2025/12/39.pdf" },
  { title: "Impact Assessment of Scholarship of Top Class Education for SC Students (2023-24)", published: "21 Apr 2025", size: "277.07 KB", href: "https://durwo6bhtjtqt.cloudfront.net/wp-content/uploads/2025/12/40.pdf" },
];

export default function Page() {
  return (
    <ContentPage
      title={TITLE}
      breadcrumb={[{ label: "Documents" }, { label: TITLE }]}
      description={DESCRIPTION}
      lastUpdated="06 Jun 2026"
    >
      <h2>Executive Summaries of Evaluation Studies</h2>
      <DocumentTable caption="Research and Evaluation Studies" rows={DOCS} />
    </ContentPage>
  );
}
