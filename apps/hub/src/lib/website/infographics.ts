/**
 * The home page's infographics (DBIM 3.0 §7.3 xiii: "visually presents
 * Ministry/Department-specific important data"; issue BRD-24).
 *
 * Each image is rendered from `tools/infographics/<id>.html` by
 * `node tools/infographics/render.mjs`. THE FIGURES BELOW ARE THE IMAGE'S TEXT
 * VERSION and must say exactly what the image says: a picture of numbers is an
 * image of text (WCAG 1.4.5), so the page carries the same figures as text.
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
  /** Short: the figures are on the page beside it, so the alt only names it. */
  alt: string;
  source: { label: string; href: string };
  figures: InfographicFigure[];
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
    alt: "Infographic: Scholarships and Fellowships, 2014–15 to 2025–26. Its figures are listed as text with it.",
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
