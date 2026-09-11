import { StatutoryPage } from "@/components/smile-admin/shell/statutory-page";

/** Transcribed from the live portal. Not rewritten — see `StatutoryPage`. */
export default function Page() {
  return (
    <StatutoryPage
      section="Other"
      issuedFor="SMILE — Department of Social Justice & Empowerment, Government of India"
      title="Terms & Conditions"
      paragraphs={[
        "This portal is owned and operated by the Department of Social Justice & Empowerment, Ministry of Social Justice & Empowerment, Government of India.",
        "Access to and use of this portal is restricted to authorised officials and implementing agencies. Users are responsible for maintaining the confidentiality of their credentials and for all activity under their account.",
        "The data captured through this portal is governed by applicable Government of India data-protection norms and is to be used solely for the rehabilitation of persons engaged in begging under the SMILE scheme.",
      ]}
      provisional="Placeholder content pending the ministry's final legal copy."
    />
  );
}
