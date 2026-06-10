export interface PortalEntry {
  slug: string;
  name: string;
  org: string;
  description: string;
  status: "built" | "planned";
  path: string;
}

export const portals: PortalEntry[] = [
  {
    slug: "pm-ajay",
    name: "PM-AJAY",
    org: "Ministry of Social Justice & Empowerment",
    description:
      "Pradhan Mantri Anusuchit Jaati Abhyuday Yojana — MIS dashboard with financial, scheme, and governance views.",
    status: "built",
    path: "/portals/pm-ajay",
  },
  {
    slug: "smile-admin",
    name: "SMILE Beggary Rehabilitation",
    org: "Ministry of Social Justice & Empowerment",
    description:
      "Single Access Mechanism for Identification, Mobilisation, Shelter & Rehabilitation admin portal.",
    status: "built",
    path: "/portals/smile-admin",
  },
  {
    slug: "eutthan-admin",
    name: "E-Utthan Admin",
    org: "Ministry of Social Justice & Empowerment",
    description:
      "E-Utthan administrative portal for scheme management and oversight.",
    status: "built",
    path: "/portals/eutthan-admin",
  },
  {
    slug: "nsfdc",
    name: "NSFDC",
    org: "National Scheduled Castes Finance & Development Corporation",
    description:
      "Finance and development corporation portal for scheduled castes.",
    status: "planned",
    path: "/portals/nsfdc",
  },
  {
    slug: "nskfdc",
    name: "NSKFDC",
    org: "National Safai Karamcharis Finance & Development Corporation",
    description: "Finance and development portal for safai karamcharis.",
    status: "planned",
    path: "/portals/nskfdc",
  },
  {
    slug: "nbcfdc",
    name: "NBCFDC",
    org: "National Backward Classes Finance & Development Corporation",
    description: "Finance and development portal for backward classes.",
    status: "planned",
    path: "/portals/nbcfdc",
  },
  {
    slug: "nos",
    name: "National Overseas Scholarship",
    org: "Ministry of Social Justice & Empowerment",
    description: "National Overseas Scholarship scheme portal.",
    status: "planned",
    path: "/portals/nos",
  },
  {
    slug: "pm-yasasvi",
    name: "PM YASASVI",
    org: "Ministry of Social Justice & Empowerment",
    description: "PM Young Achievers Scholarship Award Scheme for OBC/EBC/DNT students.",
    status: "planned",
    path: "/portals/pm-yasasvi",
  },
];
