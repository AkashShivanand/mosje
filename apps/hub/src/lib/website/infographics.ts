/**
 * The home page's infographics (DBIM 3.0 §7.3 xiii: "visually presents
 * Ministry/Department-specific important data"; issue BRD-24).
 *
 * WHERE THEY GO, decided 28 Sep 2026: in the posts row — two CCPS central posts,
 * then the infographic, which opens the Beneficiary Dashboard — and for now on the DBIM
 * design only
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
    id: "beneficiary-dashboard",
    title: "Beneficiary Dashboard",
    subtitle: "At a Glance, All India — Department of Social Justice and Empowerment, as on 05.10.2026",
    src: "/website/images/infographics/beneficiary-dashboard.png",
    width: 2160,
    height: 2160,
    // Redrawn 8 Oct 2026 after the proposed Beneficiary Dashboard, from the Department's
    // own figures only (lib/website-shared/dashboard.ts, origin "received") — nothing
    // illustrative, nothing live. The SETU picture it replaces carried the same source.
    // Computed from that source, same period: ₹67,977 Cr is the nine FUND_SHARE slices;
    // 74.23 = 26.70 + 47.53 and 56.47 = 25.21 + 31.26 lakh (2025-26, provisional); each
    // share is its slice ÷ 67,977; 45,228 and 37,937 are the students placed by year.
    source: {
      label: "Beneficiary Dashboard",
      href: "https://www.dosje.gov.in/dashboard/",
    },
    figures: [
      {
        scheme: "Total spend across 9 schemes",
        audience: "scholarships, fellowships and hostels, 2014–15 to 2025–26",
        values: ["₹67,977 Crore"],
      },
      { scheme: "Scholarships for SC Students", values: ["9 Crore students beneficiary"] },
      { scheme: "PM-YASASVI Scholarships", values: ["11 Crore students beneficiary"] },
      { scheme: "SHREYAS National Fellowship", values: ["14,757 scholars funded"] },
      {
        scheme: "Beneficiary students",
        audience: "2025–26, provisional",
        values: ["SC 74.23 lakh", "OBC, EBC and DNT 56.47 lakh"],
      },
      {
        scheme: "Share of fund release",
        values: ["Post-Matric SC 68.7%", "Post-Matric OBC 17.8%", "Pre-Matric SC 7.2%", "other 6 schemes 6.3%"],
      },
      { scheme: "Hostels for OBC Boys and Girls", values: ["28,865 seats sanctioned"] },
      {
        scheme: "Top Class Education for OBC, EBC and DNT",
        values: ["45,228 students in schools", "37,937 students in colleges"],
      },
      {
        scheme: "Interest Subsidy on Educational Loans for Overseas Studies",
        audience: "OBC and EBC students",
        values: ["29,015 beneficiaries"],
      },
    ],
  },
];
