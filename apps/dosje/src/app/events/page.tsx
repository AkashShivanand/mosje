import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, CalendarDays } from "lucide-react";
import { PageLayout } from "@/components/layout/PageLayout";

export const metadata: Metadata = {
  title: "Events — DoSJE",
  description:
    "Conclaves, conferences and commemorative events organised by the Department of Social Justice & Empowerment, Government of India.",
};

interface EventCard {
  slug: string;
  title: string;
  date: string;
  excerpt: string;
  image: string;
}

const EVENTS: EventCard[] = [
  {
    slug: "chintan-shivir-2026",
    title: "Chintan Shivir 2026 on Social Justice & Empowerment",
    date: "18–19 May 2026",
    excerpt: "Centre–State deliberations to strengthen last-mile delivery of social-justice schemes.",
    image: "/images/5-234x300.jpg",
  },
  {
    slug: "national-de-addiction-conclave-2026",
    title: "National De-Addiction Conclave 2026 under NMBA",
    date: "26 June 2026",
    excerpt: "Marking the International Day Against Drug Abuse with the Nasha Mukt Bharat Abhiyaan.",
    image: "/images/4-1-300x133.jpg",
  },
  {
    slug: "ambedkar-jayanti-samaroh-2026",
    title: "Ambedkar Jayanti Samaroh 2026",
    date: "14 April 2026",
    excerpt: "Tributes and the Dr. Ambedkar National Awards at the Dr. Ambedkar National Memorial.",
    image: "/images/3-300x251.jpg",
  },
  {
    slug: "scholarship-outreach-camp-2026",
    title: "National Scholarship Outreach Camp 2026",
    date: "08 March 2026",
    excerpt: "District-level camps assisting SC, OBC and DNT students with scholarship applications.",
    image: "/images/65811748325059-300x291.jpg",
  },
  {
    slug: "smile-skill-mela-2026",
    title: "SMILE Skilling & Livelihood Mela 2026",
    date: "21 February 2026",
    excerpt: "Skill-development and placement drive for beneficiaries under the SMILE scheme.",
    image: "/images/Banner-7.png",
  },
  {
    slug: "constitution-day-observance-2025",
    title: "Constitution Day Observance 2025",
    date: "26 November 2025",
    excerpt: "Reading of the Preamble and exhibitions celebrating the values of the Constitution.",
    image: "/images/Banner-8.png",
  },
];

export default function EventsPage() {
  return (
    <PageLayout
      title="Events"
      breadcrumb={[{ label: "Events & Gallery" }, { label: "Events" }]}
      description="Conclaves, conferences and commemorative events organised by the Department of Social Justice & Empowerment."
    >
      <section>
        <div className="mx-auto max-w-[1280px] px-4 py-10">
          <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {EVENTS.map((event) => (
              <li
                key={event.slug}
                className="group flex flex-col overflow-hidden rounded-xl border border-gray-200 bg-white transition-shadow hover:shadow-md"
              >
                <div className="relative">
                  <Image
                    src={event.image}
                    alt={event.title}
                    width={400}
                    height={240}
                    className="h-48 w-full object-cover"
                  />
                  <span className="absolute left-3 top-3 inline-flex items-center gap-1.5 rounded-md bg-gov-blue px-2.5 py-1 text-[12px] font-semibold text-white">
                    <CalendarDays className="h-3.5 w-3.5" aria-hidden="true" />
                    {event.date}
                  </span>
                </div>
                <div className="flex flex-1 flex-col p-5">
                  <h2 className="text-[17px] font-semibold leading-snug text-gov-blue-dark">
                    {event.title}
                  </h2>
                  <p className="mt-2 flex-1 text-[14px] leading-relaxed text-ink-muted">
                    {event.excerpt}
                  </p>
                  <Link
                    href={`/events/${event.slug}`}
                    className="mt-4 inline-flex items-center gap-1.5 text-[14px] font-semibold text-saffron hover:underline"
                  >
                    Read More
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
                  </Link>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </PageLayout>
  );
}
