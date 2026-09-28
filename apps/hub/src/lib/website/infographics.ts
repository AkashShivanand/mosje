/**
 * The home page's infographics (DBIM 3.0 §7.3 xiii: "visually presents
 * Ministry/Department-specific important data"; issue BRD-24).
 *
 * WHERE THEY GO, decided 28 Sep 2026: in the posts row — two CCPS central posts,
 * then the infographic — and for now on the DBIM design only
 * (components/website-dbim/home/Campaigns.tsx). Any other design that takes
 * them takes them in the same row.
 *
 * Each image is rendered from `tools/infographics/<id>.html` by
 * `node tools/infographics/render.mjs`. THE FIGURES BELOW ARE THE IMAGE'S TEXT
 * VERSION and must say exactly what the image says: a picture of numbers cannot
 * be read aloud, so `infographicText` turns them into the viewer's alt text.
 * Change one, change both, and re-render.
 */

export interface InfographicFigure {
  /** The scheme, as the source names it. */
  scheme: string;
  /** Who it serves or what it covers, where the source says. */
  audience?: string;
  /** The figures, each already formatted as the image shows it. */
  values: string[];
}

export interface Infographic {
  id: string;
  title: string;
  /** Programme and period, one line. */
  subtitle: string;
  src: string;
  width: number;
  height: number;
  source: { label: string; href: string };
  figures: InfographicFigure[];
}

/** Everything the picture says, as one passage — the full-size image's alt text. */
export function infographicText(info: Infographic): string {
  const rows = info.figures.map(
    (f) => `${f.scheme}${f.audience ? ` (${f.audience})` : ""}: ${f.values.join(", ")}.`,
  );
  return [`Infographic: ${info.title}. ${info.subtitle}.`, ...rows, `Source: ${info.source.label}.`].join(" ");
}

export const INFOGRAPHICS: Infographic[] = [
  {
    id: "setu-scholarships",
    title: "Scholarships and Fellowships",
    subtitle:
      "SETU – Scholarship for Educational Transformation & Upliftment, 2014–15 to 2025–26",
    src: "/website/images/infographics/setu-scholarships.png",
    width: 2160,
    height: 2160,
    // Read 28 Sep 2026. Three totals are sums of the dashboard's own parts for
    // the same period: 4,896 + 46,676; 2,163 + 12,118; 117 + 810.
    source: {
      label: "Beneficiary Dashboard",
      href: "https://www.dosje.gov.in/dashboard/",
    },
    figures: [
      {
        scheme: "Scholarships for SC Students",
        audience: "Pre-Matric and Post-Matric",
        values: ["9 Crore student beneficiaries", "₹51,572 Crore"],
      },
      {
        scheme: "PM-YASASVI Scholarships",
        audience: "OBC, EBC and DNT students",
        values: ["11 Crore student beneficiaries", "₹14,281 Crore"],
      },
      {
        scheme: "SHREYAS National Fellowship for OBCs",
        values: ["14,757 scholars funded", "₹640 Crore released"],
      },
      {
        scheme: "Hostels for OBC Boys and Girls",
        values: ["28,865 seats sanctioned", "₹347 Crore disbursed"],
      },
      {
        scheme: "Top Class Education for OBC, EBC and DNT",
        values: ["45,228 schools", "37,937 colleges", "₹927 Crore released"],
      },
      {
        scheme: "Interest Subsidy for Overseas Studies",
        audience: "OBC and EBC students",
        values: ["29,015 beneficiaries", "₹210 Crore disbursed"],
      },
    ],
  },
];
