import Image from "next/image";
import Link from "next/link";
import { Carousel, Icon } from "@mosje/design-system";

import { T } from "@/components/i18n/translation-provider";

/**
 * Explore Specific Benefits — the four roles DBIM asks a departmental home page
 * to address (§A.4.1 ix), one at a time, beside Recent Documents.
 *
 * Figma "Home — Secretary Review", the right column of "Recent Documents and
 * Persona": a brand panel, a line telling the reader what the cards are for,
 * one role card, and the carousel's own controls under it. It was a row of four
 * pills at the foot of "Find Schemes for You" before, where a reader who had
 * already chosen the group they belong to met four job titles with no
 * explanation of why they were being offered.
 *
 * ONE AT A TIME IS THE DESIGN'S CHOICE, and it is safe here for the reason the
 * Carousel's own docstring gives: everything essential must also exist outside
 * a carousel, and each of these four pages is in the masthead's Department menu
 * and in the footer. Nothing is only reachable by rotating this.
 *
 * The illustrations are the Department's own persona art, already used on the
 * pages these cards lead to. They are decorative here — the role's name is
 * beside them in text — so they carry no alt text.
 */
const ROLES = [
  {
    label: "Government Official",
    href: "/website/for-government-official",
    img: "/website/images/Government-Official.png",
  },
  {
    label: "Beneficiary",
    href: "/website/for-beneficiary",
    img: "/website/images/Beneficiary.png",
  },
  {
    label: "Student",
    href: "/website/for-student",
    img: "/website/images/Student.png",
  },
  {
    label: "Researcher",
    href: "/website/for-researcher",
    img: "/website/images/Researcher.png",
  },
] as const;

export function RoleExplorer() {
  return (
    <section className="wn-roles" aria-labelledby="roles-title">
      <h3 id="roles-title" className="wn-roles__title">
        <T>Explore Specific Benefits</T>
      </h3>
      <p className="wn-roles__lede">
        <T>Choose your role to discover services made for you.</T>
      </p>
      <Carousel
        label="Services by role"
        className="wn-roles__carousel"
        showDots
      >
        {ROLES.map((r) => (
          <Link key={r.href} href={r.href} className="wn-role">
            <span className="wn-role__art">
              <Image src={r.img} alt="" width={180} height={180} />
            </span>
            <span className="wn-role__label">
              <T>{r.label}</T>
              <Icon name="arrow_forward" size={20} aria-hidden />
            </span>
          </Link>
        ))}
      </Carousel>
    </section>
  );
}
