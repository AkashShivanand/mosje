import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Icon, buttonClasses } from "@mosje/design-system";
import { PageLayout } from "@/components/website/layout/PageLayout";

export const metadata: Metadata = {
  title: "Who's Who — Department of Social Justice & Empowerment",
  description:
    "Directory of Ministers, Commissions, and Senior Administrative Officers under the Ministry of Social Justice & Empowerment.",
};

interface OfficialProfile {
  name: string;
  role: string;
  image?: string;
  room?: string;
  phone?: string;
  email?: string;
  location?: string;
}

interface OrganizationGroup {
  title: string;
  viewAllHref: string;
  officials: OfficialProfile[];
}

const ORG_GROUPS: OrganizationGroup[] = [
  {
    title: "Ministry of Social Justice and Empowerment (MoSJE) Officials",
    viewAllHref: "/website/mosje-directory",
    officials: [
      {
        name: "Dr. Virendra Kumar",
        role: "Union Minister of Social Justice and Empowerment",
        image: "/website/images/Dr.-Virendra-Kumar.png",
        room: "110",
        phone: "011-23381001, 23381390, 23381902(Fax)",
        email: "min-sje@nic.in",
        location: "201 C-Wing, Shastri Bhawan, New Delhi",
      },
      {
        name: "Shri Ramdas Athawale",
        role: "Minister of State for Social Justice & Empowerment",
        image: "/website/images/Shri-Ramdas-Athawale.png",
        room: "125",
        phone: "011-23381656, 011-23381657, 011-23018978(Fax)",
        email: "mos3-msje@gov.in",
        location: "101C-Wing, Shastri Bhawan, New Delhi",
      },
      {
        name: "Shri B. L. Verma",
        role: "Minister of State for Social Justice & Empowerment",
        image: "/website/images/sri-l-b-verma.png",
        room: "141, 142",
        phone: "011-23072192, 23072193",
        email: "mosoffice-sje@gov.in",
        location: "Room No. 623, A-Wing, Shastri Bhawan, New Delhi",
      },
    ],
  },
  {
    title: "Dr. Ambedkar International Centre (DAIC) Officials",
    viewAllHref: "/website/organisation/dr-ambedkar-international-centre",
    officials: [
      {
        name: "Shri V. Appa Rao",
        role: "Member Secretary",
        phone: "011-23477499",
        email: "dir-daic-mosje@gov.in",
        location: "2nd Floor, DAIC, 15 Janpath, New Delhi",
      },
      {
        name: "Shri Vikas Trivedi",
        role: "Director",
        phone: "011-23477493",
        email: "dir-daic-mosje@gov.in",
        location: "2nd Floor, DAIC, 15 Janpath, New Delhi",
      },
      {
        name: "Hemant Kumar Srivastava",
        role: "Financial Advisor",
        phone: "011-23477499",
        email: "dir-daic-mosje@gov.in",
        location: "2nd Floor, DAIC, 15 Janpath, New Delhi",
      },
      {
        name: "Mr. Nandu Shaw",
        role: "Sr. Accounts Officer",
        phone: "011-23477499",
        email: "dir-daic-mosje@gov.in",
        location: "2nd Floor, DAIC, 15 Janpath, New Delhi",
      },
    ],
  },
  {
    title: "National Commission for Backward Classes (NCBC) Officials",
    viewAllHref: "/website/organisation/national-commission-for-backward-classes-ncbc",
    officials: [
      {
        name: "Shri Hansraj Gangaram Ahir",
        role: "Hon'ble Chairperson",
        room: "101",
        phone: "011-26183152, 011-26182388",
        email: "chairman-office@ncbc.nic.in",
      },
      {
        name: "Shri Bhuvan Bhushan Kamal",
        role: "Hon'ble Member",
        room: "103",
        phone: "011-26185478",
        email: "member-office@ncbc.nic.in",
      },
      {
        name: "Ms. Meeta Rajivlochan, I.A.S.",
        role: "Secretary",
        room: "102",
        phone: "011-26183190",
        email: "secy-ncbc@nic.in",
      },
      {
        name: "Shri Rajesh Kumar",
        role: "Advisor to the Commission",
        room: "212",
        phone: "011-26714874",
      },
    ],
  },
  {
    title: "National Commission for Scheduled Castes (NCSC) Officials",
    viewAllHref: "/website/organisation/national-commission-for-scheduled-castes",
    officials: [
      {
        name: "Shri Kishor Makwana",
        role: "Chairperson",
        phone: "011-24620435",
        email: "chairman-ncsc@nic.in",
      },
      {
        name: "Shri Love Kush Kumar",
        role: "Hon'ble Member",
        phone: "011-24623296",
        email: "lovekush.ncsc@gov.in",
      },
      {
        name: "Shri Vaddepalli Ramchander",
        role: "Hon'ble Member",
        phone: "011-24624801",
        email: "vaddepalli.ncsc@gov.in",
      },
    ],
  },
];

export default function WhosWhoPage() {
  return (
    <PageLayout
      title="Who's Who"
      breadcrumb={[{ label: "Department" }, { label: "Who's Who" }]}
      description="Discover the Commissions, Corporations, Institutes and Foundations that work collectively towards social justice, inclusion and empowerment across India."
      lastUpdated="13 Jun 2026"
    >
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 space-y-16">
        {ORG_GROUPS.map((group) => (
          <section key={group.title} className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-neutral-200 pb-3">
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-neutral-900 tracking-tight">
                  {group.title}
                </h2>
                <div className="mt-1.5 h-1 w-12 bg-[#0373DF] rounded-full" />
              </div>

              <Link
                href={group.viewAllHref}
                className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#0373DF] hover:text-[#0256a7] transition-colors self-start sm:self-auto px-3 py-1.5 rounded-lg border border-[#0373DF]/30 bg-blue-50/50 hover:bg-blue-50"
              >
                View All
                <Icon name="chevron_right" size={16} />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {group.officials.map((official) => (
                <div
                  key={official.name}
                  className="bg-white rounded-xl border border-neutral-200 p-5 shadow-sm hover:shadow-md transition-shadow flex flex-col space-y-4"
                >
                  <div className="flex items-start gap-4">
                    {official.image ? (
                      <div className="relative h-16 w-16 rounded-full overflow-hidden border-2 border-[#0373DF]/20 shadow-sm shrink-0 bg-neutral-100">
                        <Image
                          src={official.image}
                          alt={official.name}
                          fill
                          className="object-cover"
                          sizes="64px"
                        />
                      </div>
                    ) : (
                      <div className="h-14 w-14 rounded-full bg-blue-50 border border-blue-200 flex items-center justify-center text-[#0373DF] font-bold text-sm shrink-0">
                        {official.name
                          .replace(/^(Shri|Smt|Dr\.|Mr\.|Ms\.)\s+/i, "")
                          .slice(0, 2)
                          .toUpperCase()}
                      </div>
                    )}
                    <div className="min-w-0 flex-1">
                      <h3 className="text-base font-bold text-neutral-900 leading-snug">
                        {official.name}
                      </h3>
                      <p className="mt-0.5 text-xs font-semibold text-[#0373DF]">
                        {official.role}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-2 pt-2 border-t border-neutral-100 text-xs text-neutral-600">
                    {official.room && (
                      <div className="flex items-center gap-2">
                        <Icon name="home" size={16} className="text-neutral-400 shrink-0" />
                        <span>Room {official.room}</span>
                      </div>
                    )}
                    {official.phone && (
                      <div className="flex items-center gap-2">
                        <Icon name="call" size={16} className="text-neutral-400 shrink-0" />
                        <span className="font-mono text-neutral-700">{official.phone}</span>
                      </div>
                    )}
                    {official.email && (
                      <div className="flex items-center gap-2">
                        <Icon name="mail" size={16} className="text-neutral-400 shrink-0" />
                        <a
                          href={`mailto:${official.email}`}
                          className="text-[#0373DF] hover:underline truncate"
                        >
                          {official.email}
                        </a>
                      </div>
                    )}
                    {official.location && (
                      <div className="flex items-center gap-2">
                        <Icon name="location_on" size={16} className="text-neutral-400 shrink-0" />
                        <span className="truncate">{official.location}</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </section>
        ))}

        {/* Need Support Callout */}
        <section className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-8 border border-blue-100 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-sm">
          <div className="space-y-1 text-center sm:text-left">
            <h3 className="text-xl font-bold text-neutral-900">Need Support?</h3>
            <p className="text-sm text-neutral-600">
              Reach out to us and we will get back to you!
            </p>
          </div>
          <Link
            href="/website/contact-us"
            className={buttonClasses("primary", "filled", "md")}
          >
            Get in Touch
          </Link>
        </section>
      </div>
    </PageLayout>
  );
}
