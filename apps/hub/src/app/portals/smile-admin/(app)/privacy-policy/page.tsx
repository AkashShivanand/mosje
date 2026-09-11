import { StatutoryPage } from "@/components/smile-admin/shell/statutory-page";

/** Transcribed from the live portal. Not rewritten — see `StatutoryPage`. */
export default function Page() {
  return (
    <StatutoryPage
      section="Other"
      issuedFor="SMILE — Department of Social Justice & Empowerment, Government of India"
      title="Privacy Policy"
      paragraphs={[
        "This Privacy Policy describes how the SMILE portal collects, uses, and safeguards personal information of beneficiaries and users.",
        "Personal data is collected only for the legitimate purpose of beneficiary identification, mobilization, shelter assignment, skill training, and rehabilitation tracking under the SMILE scheme, and is accessible strictly on a role- and jurisdiction-scoped basis.",
        "Sensitive identifiers (e.g. Aadhaar) are masked in the interface and handled per Government of India data-protection and IT-security guidelines.",
      ]}
      provisional="Placeholder content pending the ministry's final legal copy."
    />
  );
}
