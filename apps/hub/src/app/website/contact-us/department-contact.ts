import type { ContactPageProps } from "@/components/website-next/templates/ContactPage";
import { getOfficial } from "@/lib/website/content";

/**
 * The Department's contact details, read from its own register — shared by
 * Contact Us and MoSJE Contact so the two pages cannot drift apart.
 *
 * - ADDRESS: the one the footer, MoSJE Contact and every officer's record in the
 *   register give (8th Floor, GPOA-3, Netaji Nagar, New Delhi-110023).
 * - TELEPHONE AND EMAIL: the register publishes no switchboard and no general
 *   departmental mailbox. The numbers and address it does publish for the whole
 *   Department's front office are those of the Office of the Union Minister
 *   (`dr-virendra-kumar-hmsje`: 011-24105009, 24105011, 26110251 ·
 *   min-sje[at]nic[dot]in), and they are labelled as that office, not as a
 *   switchboard. A switchboard number and office hours are content gaps for the
 *   Department to supply.
 * - OFFICER: the Department's own contact page names one officer, Ms. Kajal
 *   Singh, Director (`kajal-singh`).
 * - HELPLINES: the three national helplines on the home page, each from the
 *   Department's scheme master: 14446 AR §3.15; 14567 AR §3.14; 14566 PIB
 *   1780979 and the NHAA organisation page.
 * - MAP: searched by the address, never a hand-placed pin (issue CON-08).
 */
const ADDRESS = "8th Floor, GPOA-3, Netaji Nagar, New Delhi-110023";
const MAP_QUERY = "GPOA-3, Netaji Nagar, New Delhi 110023";

const ministerOffice = getOfficial("dr-virendra-kumar-hmsje");
const director = getOfficial("kajal-singh");

export const DEPARTMENT_CONTACT: Pick<ContactPageProps, "office" | "mapSrc" | "mapHref" | "officers" | "helplines"> = {
  office: {
    name: "Department of Social Justice & Empowerment",
    address: ADDRESS,
    phone: ministerOffice?.phoneOffice,
    email: ministerOffice?.email,
    phoneLabel: "Office of the Union Minister of Social Justice and Empowerment",
  },
  mapSrc: `https://www.google.com/maps?q=${encodeURIComponent(MAP_QUERY)}&output=embed`,
  mapHref: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(MAP_QUERY)}`,
  officers: director
    ? [
        {
          role: "Director",
          name: director.title,
          slug: director.slug,
          phone: director.phoneOffice,
          email: director.email,
          address: director.address,
        },
      ]
    : [],
  helplines: [
    { number: "14446", name: "Nasha Mukt Bharat Abhiyaan", sub: "Drug de-addiction counselling and referral", icon: "self_improvement" },
    { number: "14567", name: "Elderline", sub: "National helpline for senior citizens", icon: "elderly" },
    { number: "14566", name: "National Helpline Against Atrocities", sub: "For Scheduled Castes and Scheduled Tribes", icon: "shield_person" },
  ],
};
