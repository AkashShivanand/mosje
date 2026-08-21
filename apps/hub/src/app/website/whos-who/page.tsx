import type { Metadata } from "next";
import Image from "next/image";
import { Card, Icon } from "@mosje/design-system";
import { PageLayout } from "@/components/website/layout/PageLayout";

export const metadata: Metadata = {
  title: "Who's Who | Ministry of Social Justice & Empowerment",
  description:
    "Who's Who of the Ministry of Social Justice & Empowerment, Government of India — senior leadership including the Union Minister, Ministers of State, and Secretaries.",
};

const MINISTERS = [
  {
    name: "Dr. Virendra Kumar",
    designation: "Union Minister of Social Justice and Empowerment",
    photo: "/website/images/Dr.-Virendra-Kumar.png",
    room: "Room No. 8605, 8th Floor, Zone-6, GPOA-3, Netaji Nagar, New Delhi",
    phone: "011-24105009, 24105011",
    email: "min-sje@nic.in",
  },
  {
    name: "Shri Ramdas Athawale",
    designation: "Minister of State for Social Justice and Empowerment",
    photo: "/website/images/Shri-Ramdas-Athawale.png",
    room: "Room No. 251, A-Wing, Shastri Bhawan, New Delhi",
    phone: "011-23381390",
    email: "mos1-sje@nic.in",
  },
  {
    name: "Shri B. L. Verma",
    designation: "Minister of State for Social Justice and Empowerment",
    photo: "/website/images/sri-l-b-verma.png",
    room: "Room No. 254, A-Wing, Shastri Bhawan, New Delhi",
    phone: "011-23381405",
    email: "mos2-sje@nic.in",
  },
];

const OFFICERS = [
  {
    name: "Shri Amit Yadav, IAS",
    designation: "Secretary",
    room: "Room No. 615, A-Wing, Shastri Bhawan",
    intercom: "121",
    phone: "011-23381001, 23386946",
    email: "secy-sje@nic.in",
  },
  {
    name: "Shri Surendra Singh, IAS",
    designation: "Additional Secretary",
    room: "Room No. 605, A-Wing, Shastri Bhawan",
    intercom: "134",
    phone: "011-23070315",
    email: "as-sje@nic.in",
  },
  {
    name: "Shri Rajiv Sharma, IAS",
    designation: "Joint Secretary (SCD)",
    room: "Room No. 729, A-Wing, Shastri Bhawan",
    intercom: "145",
    phone: "011-23381322",
    email: "js-scd@nic.in",
  },
  {
    name: "Smt. Meenakshi Iyer, IAS",
    designation: "Joint Secretary (BC & DNT)",
    room: "Room No. 733, A-Wing, Shastri Bhawan",
    intercom: "149",
    phone: "011-23381340",
    email: "js-bc@nic.in",
  },
  {
    name: "Shri Arun Kumar Mishra, IAS",
    designation: "Joint Secretary (Social Defence)",
    room: "Room No. 521, B-Wing, Shastri Bhawan",
    intercom: "152",
    phone: "011-23381355",
    email: "js-da@nic.in",
  },
  {
    name: "Dr. Prabodh Seth, IRS",
    designation: "Joint Secretary & Financial Advisor",
    room: "Room No. 518, B-Wing, Shastri Bhawan",
    intercom: "156",
    phone: "011-23381420",
    email: "fa-sje@nic.in",
  },
];

export default function WhosWhoPage() {
  return (
    <PageLayout
      title="Who's Who"
      description="Senior leadership and administrative officers of the Department of Social Justice & Empowerment, Government of India."
      breadcrumb={[{ label: "Department", href: "/website/about-us" }, { label: "Who's Who" }]}
      lastUpdated="06 Jun 2026"
    >
      <section className="py-10 md:py-14 bg-white">
        <div className="sa-container space-y-12">
          {/* Section 1: Political Leadership */}
          <div>
            <div className="border-b border-gray-200 pb-3 mb-6">
              <h2 className="text-[22px] sm:text-[26px] font-bold text-primary-dark">
                Political Leadership
              </h2>
              <p className="text-xs sm:text-sm text-ink-muted">
                Union Minister and Ministers of State
              </p>
            </div>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {MINISTERS.map((m) => (
                <Card
                  key={m.name}
                  className="flex flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white p-6 shadow-xs hover:shadow-md transition"
                >
                  <div className="flex flex-col items-center text-center">
                    <div className="relative h-28 w-28 overflow-hidden rounded-full border-2 border-primary/20 bg-surface-muted shadow-xs">
                      <Image
                        src={m.photo}
                        alt={m.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <h3 className="mt-4 text-[18px] font-bold text-ink">
                      {m.name}
                    </h3>
                    <p className="mt-1 text-xs font-semibold text-primary">
                      {m.designation}
                    </p>
                  </div>

                  <div className="mt-6 pt-4 border-t border-gray-150 space-y-2.5 text-xs text-ink-muted">
                    <div className="flex items-start gap-2">
                      <Icon name="location_on" size={15} className="text-primary shrink-0 mt-0.5" />
                      <span>{m.room}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Icon name="call" size={15} className="text-primary shrink-0" />
                      <span>{m.phone}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Icon name="mail" size={15} className="text-primary shrink-0" />
                      <span>{m.email}</span>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>

          {/* Section 2: Senior Administrative Officers */}
          <div>
            <div className="border-b border-gray-200 pb-3 mb-6">
              <h2 className="text-[22px] sm:text-[26px] font-bold text-primary-dark">
                Senior Administration
              </h2>
              <p className="text-xs sm:text-sm text-ink-muted">
                Secretary, Additional Secretary, and Joint Secretaries
              </p>
            </div>

            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {OFFICERS.map((officer) => (
                <Card
                  key={officer.name}
                  className="flex flex-col justify-between rounded-xl border border-gray-200 bg-white p-5 shadow-xs hover:shadow-md transition"
                >
                  <div>
                    <span className="rounded bg-primary/10 px-2 py-0.5 text-[10px] font-bold text-primary uppercase tracking-wider">
                      {officer.designation}
                    </span>
                    <h3 className="mt-3 text-[16px] font-bold text-ink">
                      {officer.name}
                    </h3>
                    <p className="mt-1 text-xs text-ink-muted flex items-center gap-1.5">
                      <Icon name="apartment" size={14} className="text-gray-400" />
                      {officer.room}
                    </p>
                  </div>

                  <div className="mt-5 pt-3 border-t border-gray-150 flex flex-col gap-1.5 text-xs text-ink-muted">
                    <span className="flex items-center gap-2">
                      <Icon name="call" size={14} className="text-primary" />
                      {officer.phone} (Ext: {officer.intercom})
                    </span>
                    <span className="flex items-center gap-2">
                      <Icon name="mail" size={14} className="text-primary" />
                      {officer.email}
                    </span>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>
    </PageLayout>
  );
}
