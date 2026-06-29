// Additional Treatment-Centre master data for the US / Under-Secretary role,
// captured verbatim from the live legacy portal (2026-06-29, login USDP1).
// See docs/reference/nmba-us-undersecretary-legacy-capture.md.
// These complement the form option-sets in master-data.ts with the masters that
// only the US role manages (status-bearing lists + content masters + activity
// categories). Synthetic where the live data was test/PII; reference lists verbatim.

import type { SelectOption } from "@mosje/design-system";

/** Status flag shared by the status-bearing masters (Gender, Place of Residence). */
export type MasterStatus = "Active" | "Inactive";

export type StatusMasterItem = { label: string; value: string; status: MasterStatus };

/** Gender master — live shows all three Active. */
export const GENDER_MASTER: StatusMasterItem[] = [
  { label: "Male", value: "1", status: "Active" },
  { label: "Female", value: "2", status: "Active" },
  { label: "Transgender", value: "3", status: "Active" },
];

/** Place of Residence master — live has 4 rows (2 active, 2 inactive). */
export const PLACE_OF_RESIDENCE_MASTER: StatusMasterItem[] = [
  { label: "Rural", value: "1", status: "Active" },
  { label: "Urban", value: "2", status: "Active" },
  { label: "Semi Urban", value: "3", status: "Inactive" },
  { label: "Urban slum", value: "4", status: "Inactive" },
];

/** NMBA activity-category master (34) — powers the Activity List category filter. */
export const ACTIVITY_CATEGORIES: SelectOption[] = [
  { label: "Slogan Writing Competition", value: "1" },
  { label: "Rangoli Making Competition", value: "2" },
  { label: "Drawing competition", value: "3" },
  { label: "Marathon/ Walkathon/Cyclothon", value: "4" },
  { label: "Training and awareness generation activities with children, adolescents, youth and Nasha Mukti Mitr", value: "5" },
  { label: "Sports and physical activities", value: "6" },
  { label: "Seminars, Webinars or Workshops for awareness generation", value: "7" },
  { label: "Nukkad Natak, Skits and Play", value: "8" },
  { label: "Flash mobs, drives and Rallies", value: "9" },
  { label: "NMBA pledge (including e-pledge) in educational institutions, hotspots and public places", value: "10" },
  { label: "Community mapping of nearby areas and identifying hotspots for qualitative analysis", value: "11" },
  { label: "Wall Paintings/Graffiti and art competitions", value: "12" },
  { label: "Video-making or short film making", value: "13" },
  { label: "Activities with NSS/NCC/NYK volunteers and spiritual organizations", value: "14" },
  { label: "Yoga and Meditation Activities", value: "15" },
  { label: "Documentaries/Film Screenings on substance use and discussions", value: "16" },
  { label: "Awareness generation through NMBA vehicles", value: "17" },
  { label: "Sensitizing the general public about the schemes and programs of the Ministry", value: "18" },
  { label: "Distribution of IEC Material available on the NMBA website", value: "19" },
  { label: "Organising Inter/Intra University Debate/ Essay/ Painting/ Drawing Competitions", value: "20" },
  { label: "Formation of Clubs (for substance use prevention) in educational institutions and communities", value: "21" },
  { label: "Identifying influential alumnis from the colleges to advertise the Abhiyaan", value: "22" },
  { label: "Focus Group Discussions with various stakeholders in high risk areas", value: "23" },
  { label: "Social Media Campaigns", value: "24" },
  { label: "Identification and involvement of local brand ambassadors, social media influencers, etc", value: "25" },
  { label: "Surveys and preparatory studies", value: "26" },
  { label: "Celebration of international/national days of importance", value: "27" },
  { label: "Using regional channels, newspapers, radio and other media outlets", value: "28" },
  { label: "Formation of support groups and initiating counselling networks", value: "29" },
  { label: "A sub-campaign to increase awareness about the ban of licit/illicit substances near colleges", value: "30" },
  { label: "Involvement and convergence with various government departments", value: "31" },
  { label: "Networking with self-help groups/local leaders/NGOs to reach out to high-risk groups", value: "32" },
  { label: "Activities in vulnerable areas including border and tribal regions", value: "33" },
  { label: "Health Related Activities/Camps", value: "34" },
];

/** Content-management master row (policy/content pages). */
export type ContentPage = {
  id: string;
  title: string;
  type: "Policy" | "Content";
  description: string;
  isActive: boolean;
};

export const CONTENT_PAGES: ContentPage[] = [
  {
    id: "copyright",
    title: "Copyright Policy",
    type: "Policy",
    description:
      "Data and information available on the web application of the Department of Social Justice and Empowerment may be freely reproduced with due acknowledgement.",
    isActive: true,
  },
  {
    id: "terms",
    title: "Terms & Conditions",
    type: "Policy",
    description:
      "This website is designed, developed and maintained by the Ministry of Social Justice and Empowerment, Government of India.",
    isActive: true,
  },
  {
    id: "about",
    title: "About Us",
    type: "Content",
    description:
      "The Management Information System (MIS) is a comprehensive digital platform for monitoring de-addiction and rehabilitation activities under NMBA/NAPDDR.",
    isActive: true,
  },
];

/** "What's New" master row (notices / downloadable documents). */
export type WhatsNewItem = {
  id: string;
  title: string;
  link?: string;
  pdf?: string;
  size?: string;
  createdDate: string;
  isActive: boolean;
};

export const WHATS_NEW: WhatsNewItem[] = [
  { id: "wn1", title: "NAPDDR Action Plan 6th version", pdf: "NAPDDR-Action-Plan-6th-version.pdf", size: "1.46 MB", createdDate: "2024-06-24", isActive: true },
  { id: "wn2", title: "Senior Citizen Homes (Old Age Homes) under AVYAY Scheme", pdf: "AVYAY-Senior-Citizen-Homes.pdf", size: "7.30 KB", createdDate: "2024-06-24", isActive: false },
  { id: "wn3", title: "NMBA Helpline 14446 — Awareness Notice", link: "https://nmba.dosje.gov.in/", size: "0 bytes", createdDate: "2025-02-24", isActive: true },
  { id: "wn4", title: "NMBA Pledge Undertaking Format", pdf: "Pledge-Undertaking-Format.pdf", size: "1.41 KB", createdDate: "2025-02-24", isActive: true },
];
