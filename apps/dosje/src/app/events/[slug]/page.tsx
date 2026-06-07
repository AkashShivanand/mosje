import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CalendarDays, MapPin, Users } from "lucide-react";
import { ContentPage } from "@/components/templates/ContentPage";

interface EventDetail {
  title: string;
  short: string;
  date: string;
  venue: string;
  organiser: string;
  about: string[];
  highlights: string[];
}

const EVENTS: Record<string, EventDetail> = {
  "chintan-shivir-2026": {
    title: "Chintan Shivir 2026 on Social Justice & Empowerment",
    short: "Chintan Shivir 2026",
    date: "18–19 May 2026",
    venue: "Dr. Ambedkar International Centre, New Delhi",
    organiser: "Department of Social Justice & Empowerment, Government of India",
    about: [
      "The Chintan Shivir 2026 brought together Union and State officials, domain experts and civil-society partners to deliberate on the next phase of social-justice programmes under the Department.",
      "Over two days, working groups reviewed the implementation of flagship schemes, identified field-level challenges and framed actionable recommendations to strengthen last-mile delivery for the most marginalised communities.",
    ],
    highlights: [
      "Inaugural address by the Hon'ble Union Minister for Social Justice & Empowerment",
      "Thematic sessions on scholarships, financial empowerment and de-addiction",
      "Release of the consolidated implementation dashboard for PM-AJAY",
      "Adoption of a joint State–Centre action plan for 2026–27",
    ],
  },
  "national-de-addiction-conclave-2026": {
    title: "National De-Addiction Conclave 2026 under NMBA",
    short: "De-Addiction Conclave",
    date: "26 June 2026",
    venue: "Vigyan Bhawan, New Delhi",
    organiser: "Nasha Mukt Bharat Abhiyaan (NMBA), DoSJE",
    about: [
      "Held to mark the International Day Against Drug Abuse and Illicit Trafficking, the National De-Addiction Conclave 2026 showcased the achievements of the Nasha Mukt Bharat Abhiyaan and the network of de-addiction centres across the country.",
      "The conclave provided a platform for de-addiction professionals, volunteers and beneficiaries to share best practices in prevention, treatment and rehabilitation.",
    ],
    highlights: [
      "Felicitation of district administrations excelling under NMBA",
      "Panel discussions with rehabilitation experts and recovered beneficiaries",
      "Launch of community-outreach toolkits for Maanas helpline volunteers",
      "Pledge ceremony for a drug-free India by participating institutions",
    ],
  },
  "ambedkar-jayanti-samaroh-2026": {
    title: "Ambedkar Jayanti Samaroh 2026",
    short: "Ambedkar Jayanti 2026",
    date: "14 April 2026",
    venue: "Dr. Ambedkar National Memorial, 26 Alipur Road, New Delhi",
    organiser: "Dr. Ambedkar Foundation, DoSJE",
    about: [
      "The Ambedkar Jayanti Samaroh 2026 commemorated the birth anniversary of Bharat Ratna Dr. B. R. Ambedkar with floral tributes, cultural programmes and the conferment of the Dr. Ambedkar National Awards.",
      "Dignitaries, scholars and citizens gathered to reaffirm their commitment to the constitutional values of liberty, equality and fraternity championed by Dr. Ambedkar.",
    ],
    highlights: [
      "Floral tributes at the Dr. Ambedkar National Memorial",
      "Conferment of the Dr. Ambedkar National Award for Social Understanding & Upliftment of Weaker Sections",
      "Cultural performances depicting Dr. Ambedkar's life and ideals",
      "Exhibition on the making of the Constitution of India",
    ],
  },
  "scholarship-outreach-camp-2026": {
    title: "National Scholarship Outreach Camp 2026",
    short: "Scholarship Outreach Camp",
    date: "08 March 2026",
    venue: "Select districts across India",
    organiser: "Department of Social Justice & Empowerment, Government of India",
    about: [
      "The National Scholarship Outreach Camp 2026 took the Department's scholarship schemes to the doorstep of students through district-level camps across the country.",
      "Volunteers and officials helped SC, OBC and DNT students register on the National Scholarship Portal, verify documents and complete their applications for pre-matric, post-matric and top-class scholarships.",
    ],
    highlights: [
      "On-the-spot registration assistance on the National Scholarship Portal",
      "Document verification and grievance-redressal desks",
      "Awareness sessions on eligibility and timelines",
      "Special focus on first-generation learners",
    ],
  },
  "smile-skill-mela-2026": {
    title: "SMILE Skilling & Livelihood Mela 2026",
    short: "SMILE Skilling Mela",
    date: "21 February 2026",
    venue: "NISD Campus, New Delhi",
    organiser: "Social Defence Division (SMILE), DoSJE",
    about: [
      "The SMILE Skilling & Livelihood Mela 2026 connected beneficiaries under the SMILE scheme with skill-development providers and prospective employers.",
      "The event focused on dignified livelihoods for transgender persons and people engaged in begging, offering counselling, skilling and placement support under one roof.",
    ],
    highlights: [
      "Skill-development counselling and enrolment",
      "On-site placement and self-employment guidance",
      "Health, identity-document and welfare-linkage camps",
      "Showcase of beneficiary success stories",
    ],
  },
  "constitution-day-observance-2025": {
    title: "Constitution Day Observance 2025",
    short: "Constitution Day 2025",
    date: "26 November 2025",
    venue: "Dr. Ambedkar International Centre, New Delhi",
    organiser: "Dr. Ambedkar Foundation, DoSJE",
    about: [
      "Constitution Day (Samvidhan Divas) 2025 was observed to commemorate the adoption of the Constitution of India on 26 November 1949.",
      "The observance reaffirmed the Department's commitment to the constitutional values of justice, liberty, equality and fraternity through a reading of the Preamble and related programmes.",
    ],
    highlights: [
      "Collective reading of the Preamble to the Constitution",
      "Exhibition on the framing of the Constitution",
      "Lectures on constitutional safeguards for weaker sections",
      "Participation by students and officials",
    ],
  },
};

export function generateStaticParams() {
  return Object.keys(EVENTS).map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const event = EVENTS[slug];
  if (!event) return { title: "Event — DoSJE" };
  return { title: `${event.title} — DoSJE`, description: event.about[0] };
}

export default async function EventDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const event = EVENTS[slug];
  if (!event) notFound();

  return (
    <ContentPage
      title={event.title}
      breadcrumb={[
        { label: "Events & Gallery" },
        { label: "Events", href: "/events" },
        { label: event.short },
      ]}
      description={event.about[0]}
      lastUpdated="06 Jun 2026"
      sidebar={
        <div className="rounded-xl border border-gray-200 bg-surface-muted p-5 text-[14px]">
          <h2 className="mb-4 text-[15px] font-semibold text-gov-blue-dark">Event Details</h2>
          <dl className="space-y-4">
            <div className="flex items-start gap-3">
              <CalendarDays className="mt-0.5 h-5 w-5 shrink-0 text-gov-blue" aria-hidden="true" />
              <div>
                <dt className="font-semibold text-ink">Date</dt>
                <dd className="text-ink-muted">{event.date}</dd>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-gov-blue" aria-hidden="true" />
              <div>
                <dt className="font-semibold text-ink">Venue</dt>
                <dd className="text-ink-muted">{event.venue}</dd>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Users className="mt-0.5 h-5 w-5 shrink-0 text-gov-blue" aria-hidden="true" />
              <div>
                <dt className="font-semibold text-ink">Organiser</dt>
                <dd className="text-ink-muted">{event.organiser}</dd>
              </div>
            </div>
          </dl>
        </div>
      }
    >
      <h2>About the Event</h2>
      {event.about.map((p, i) => (
        <p key={i}>{p}</p>
      ))}
      <h2>Highlights</h2>
      <ul>
        {event.highlights.map((h) => (
          <li key={h}>{h}</li>
        ))}
      </ul>
    </ContentPage>
  );
}
