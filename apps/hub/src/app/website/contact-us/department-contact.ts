import type { ContactPageProps } from "@/components/website-next/templates/ContactPage";
import { getOfficial } from "@/lib/website/content";

/**
 * The Department's contact details, read from its own register — shared by
 * Contact Us and MoSJE Contact so the two pages cannot drift apart.
 *
 * - LEAD CONTACT: the Department's own Contact Us page (dosje.gov.in/contact-us/,
 *   read 22 Sep 2026) names one contact, "Ms. Kajal Singh, Director, 8th Floor,
 *   GPOA-3, Netaji Nagar, New Delhi-110023". Her telephone and email are her
 *   register record (`kajal-singh`: 011-26871001 · dir-src-dosje[at]gov[dot]in).
 *   The register publishes no switchboard and no general mailbox; both, and office
 *   hours, are content gaps for the Department to supply.
 * - OFFICE OF THE UNION MINISTER: this page once led with it, which sent a citizen
 *   to the Minister's office for a question the Department answers. It stays,
 *   further down and labelled as that office (`dr-virendra-kumar-hmsje`).
 * - HELPLINES: the three national helplines on the home page, each from the
 *   Department's scheme master: 14446 AR §3.15; 14567 AR §3.14; 14566 PIB
 *   1780979 and the NHAA organisation page.
 * - MAP: a link that opens the address in Google Maps, not an embed. The embed
 *   drew an empty grey box and loaded a third-party frame before cookie consent.
 */
const ADDRESS = "8th Floor, GPOA-3, Netaji Nagar, New Delhi-110023";
const MAP_QUERY = "GPOA-3, Netaji Nagar, New Delhi 110023";

const ministerOffice = getOfficial("dr-virendra-kumar-hmsje");
const director = getOfficial("kajal-singh");

export const DEPARTMENT_CONTACT: Pick<
  ContactPageProps,
  "office" | "mapHref" | "officers" | "officersTitle" | "helplines"
> = {
  office: {
    name: "Department of Social Justice & Empowerment",
    address: ADDRESS,
    phone: director?.phoneOffice,
    email: director?.email,
    // As dosje.gov.in/contact-us/ writes it; the register's title omits the "Ms.".
    phoneLabel: director ? "Ms. Kajal Singh, Director" : undefined,
    contactSlug: director?.slug,
  },
  mapHref: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(MAP_QUERY)}`,
  officersTitle: "Office of the Union Minister",
  officers: ministerOffice
    ? [
        {
          role: ministerOffice.designation ?? "Union Minister of Social Justice and Empowerment",
          name: "Dr. Virendra Kumar",
          slug: ministerOffice.slug,
          phone: ministerOffice.phoneOffice,
          email: ministerOffice.email,
          address: ministerOffice.address,
        },
      ]
    : [],
  helplines: [
    { number: "14446", name: "Nasha Mukt Bharat Abhiyaan", sub: "Drug de-addiction counselling and referral", icon: "self_improvement" },
    { number: "14567", name: "Elderline", sub: "National helpline for senior citizens", icon: "elderly" },
    { number: "14566", name: "National Helpline Against Atrocities", sub: "For Scheduled Castes and Scheduled Tribes", icon: "shield_person" },
  ],
};
