// Two-surface typography data — mirrors the SAMAVESH Figma library and @mosje/tokens
// font.role.* / font.tracking.*. Values are [min @360px, max @1280px]; the runtime
// ships fluid clamp() between them. Website = expressive; Portal = dense.

export type Surface = "website" | "portal";
export type Tier = "display" | "headline" | "title" | "body" | "label";

export interface RoleSpec {
  role: string;
  tier: Tier;
  weight: string; // fontWeight name
  weightVal: number;
  size: Record<Surface, [number, number]>; // [min, max] px
  lh: Record<Surface, [number, number]>;
  tracking: Record<Surface, [number, number]>; // px (letter-spacing)
  para: [number, number]; // paragraph-spacing (shared across surfaces)
  en: string;
  hi: string;
}

const W = (min: number, max: number): [number, number] => [min, max];

// Samples chosen per tier — real MoSJE content, bilingual (Noto Sans + Devanagari).
const S: Record<string, [string, string]> = {
  "display-1": ["Digital India, Inclusive India", "डिजिटल भारत, समावेशी भारत"],
  "display-2": ["Justice for every citizen", "हर नागरिक के लिए न्याय"],
  "display-3": ["Empowerment through schemes", "योजनाओं से सशक्तिकरण"],
  "display-4": ["Dignity, access, opportunity", "गरिमा, पहुँच, अवसर"],
  "display-5": ["Serving the last mile", "अंतिम छोर तक सेवा"],
  "display-6": ["A portal for every scheme", "हर योजना का पोर्टल"],
  "headline-1": ["Ministry of Social Justice & Empowerment", "सामाजिक न्याय और अधिकारिता मंत्रालय"],
  "headline-2": ["PM-AJAY Scheme Dashboard", "पीएम-अजय योजना डैशबोर्ड"],
  "headline-3": ["Scholarship applications this quarter", "इस तिमाही की छात्रवृत्ति आवेदन"],
  "headline-4": ["Beneficiary verification status", "लाभार्थी सत्यापन स्थिति"],
  "headline-5": ["Recent grievances", "हाल की शिकायतें"],
  "headline-6": ["Documents required", "आवश्यक दस्तावेज़"],
  "title-1": ["Section heading and panel title", "अनुभाग शीर्षक और पैनल शीर्षक"],
  "title-2": ["List headers and compact titles", "सूची शीर्षक और संक्षिप्त शीर्षक"],
  "title-3": ["Sidebar and tertiary labels", "साइडबार और तृतीयक लेबल"],
  "body-1": ["Submit your application along with all required documents.", "सभी आवश्यक दस्तावेज़ों के साथ अपना आवेदन जमा करें।"],
  "body-2": ["Secondary information, helper text, and table cell content.", "द्वितीयक जानकारी, सहायक पाठ और तालिका सामग्री।"],
  "body-3": ["Captions, timestamps, and fine print.", "कैप्शन, समय-चिह्न और बारीक अक्षर।"],
  "label-1": ["Form label · Applicant name", "फ़ॉर्म लेबल · आवेदक का नाम"],
  "label-2": ["Badge · Verified", "बैज · सत्यापित"],
  "label-3": ["STATUS · UPLOADED", "स्थिति · अपलोड"],
};

const TIER_WEIGHT: Record<Tier, [string, number]> = {
  display: ["Medium", 500],
  headline: ["SemiBold", 600],
  title: ["Medium", 500],
  body: ["Regular", 400],
  label: ["Medium", 500],
};

// [role, tier, sizeWeb, sizePortal, lhWeb, lhPortal, trackPortal(min,max), para(min,max)]
const RAW: [string, Tier, [number, number], [number, number], [number, number], [number, number], [number, number], [number, number]][] = [
  ["display-1", "display", W(40, 80), W(40, 56), W(44, 88), W(48, 64), W(-0.8, -1.12), W(24, 32)],
  ["display-2", "display", W(36, 72), W(32, 48), W(40, 80), W(40, 56), W(-0.64, -0.96), W(20, 32)],
  ["display-3", "display", W(32, 64), W(28, 40), W(36, 72), W(36, 48), W(-0.42, -0.6), W(16, 24)],
  ["display-4", "display", W(28, 56), W(24, 32), W(32, 64), W(32, 40), W(-0.24, -0.32), W(16, 24)],
  ["display-5", "display", W(26, 48), W(22, 28), W(28, 56), W(28, 36), W(-0.22, -0.28), W(16, 20)],
  ["display-6", "display", W(24, 40), W(20, 24), W(28, 48), W(28, 32), W(0, 0), W(16, 20)],
  ["headline-1", "headline", W(28, 40), W(24, 32), W(32, 48), W(32, 40), W(0, 0), W(20, 24)],
  ["headline-2", "headline", W(24, 32), W(20, 28), W(28, 40), W(28, 36), W(0, 0), W(16, 24)],
  ["headline-3", "headline", W(22, 28), W(18, 24), W(28, 32), W(24, 32), W(0, 0), W(16, 20)],
  ["headline-4", "headline", W(20, 24), W(16, 20), W(24, 28), W(24, 28), W(0, 0), W(16, 20)],
  ["headline-5", "headline", W(18, 20), W(15, 18), W(24, 24), W(20, 24), W(0, 0), W(12, 16)],
  ["headline-6", "headline", W(16, 16), W(14, 16), W(20, 20), W(20, 24), W(0, 0), W(12, 16)],
  ["title-1", "title", W(18, 22), W(16, 20), W(24, 28), W(24, 28), W(0, 0), W(16, 20)],
  ["title-2", "title", W(16, 16), W(15, 18), W(24, 24), W(20, 24), W(0, 0), W(12, 16)],
  ["title-3", "title", W(14, 14), W(14, 16), W(20, 20), W(20, 24), W(0, 0), W(12, 16)],
  ["body-1", "body", W(16, 16), W(14, 16), W(24, 24), W(20, 24), W(0, 0), W(12, 16)],
  ["body-2", "body", W(14, 14), W(13, 14), W(20, 20), W(20, 20), W(0, 0), W(12, 12)],
  ["body-3", "body", W(12, 12), W(12, 13), W(16, 16), W(20, 20), W(0, 0), W(12, 12)],
  ["label-1", "label", W(14, 14), W(14, 14), W(20, 20), W(20, 20), W(0, 0), W(12, 12)],
  ["label-2", "label", W(12, 12), W(12, 12), W(16, 16), W(16, 16), W(0, 0), W(8, 8)],
  ["label-3", "label", W(11, 11), W(11, 11), W(16, 16), W(16, 16), W(0, 0), W(8, 8)],
];

export const ROLES: RoleSpec[] = RAW.map(([role, tier, sw, sp, lw, lp, tp, pa]) => ({
  role,
  tier,
  weight: TIER_WEIGHT[tier][0],
  weightVal: TIER_WEIGHT[tier][1],
  size: { website: sw, portal: sp },
  lh: { website: lw, portal: lp },
  tracking: { website: W(0, 0), portal: tp },
  para: pa,
  en: (S[role] ?? ["", ""])[0],
  hi: (S[role] ?? ["", ""])[1],
}));

export const TIERS: { key: Tier; label: string; blurb: string }[] = [
  { key: "display", label: "Display", blurb: "Hero and marketing headings" },
  { key: "headline", label: "Headline", blurb: "Page and section headings (h1–h3)" },
  { key: "title", label: "Title", blurb: "Panel, list and card titles" },
  { key: "body", label: "Body", blurb: "Running text and paragraphs" },
  { key: "label", label: "Label", blurb: "UI controls, badges, captions" },
];

export const SURFACES: { key: Surface; label: string; note: string; sample: string }[] = [
  { key: "website", label: "Website", note: "dosje.gov.in · expressive, editorial", sample: "display-1 = 80px" },
  { key: "portal", label: "Portal", note: "20+ workflow portals · dense, functional", sample: "display-1 = 56px" },
];

/** Round to 3dp for display, drop trailing zeros. */
export const px = (n: number): string => `${Math.round(n * 1000) / 1000}px`;
