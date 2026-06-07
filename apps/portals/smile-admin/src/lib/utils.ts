import { type ClassValue, clsx } from "clsx";
import { extendTailwindMerge } from "tailwind-merge";

// Teach tailwind-merge about our custom font-size scale so it doesn't
// confuse `text-body-2`, `text-headline-3`, etc. with `text-white` /
// `text-foreground` color utilities (they all share the `text-*` prefix).
const FONT_SIZES = [
  "display-1",
  "display-2",
  "display-5",
  "headline-1",
  "headline-2",
  "headline-3",
  "headline-4",
  "headline-5",
  "headline-6",
  "title-1",
  "title-2",
  "body-1",
  "body-2",
  "body-3",
  "label-1",
  "label-2",
  "label-3",
  "num-xl",
  "num-lg",
];

const customTwMerge = extendTailwindMerge({
  override: {
    classGroups: {
      "font-size": [{ text: FONT_SIZES }],
    },
  },
});

export function cn(...inputs: ClassValue[]) {
  return customTwMerge(clsx(inputs));
}

export function formatNumber(n: number | null | undefined, opts?: Intl.NumberFormatOptions) {
  if (n === null || n === undefined) return "—";
  return new Intl.NumberFormat("en-IN", opts).format(n);
}

export function formatINR(n: number | null | undefined, compact = false) {
  if (n === null || n === undefined || Number.isNaN(n)) return "—";
  if (compact) {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 1,
      notation: "compact",
    }).format(n);
  }
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(n);
}

export function initials(name: string) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((s) => s[0]?.toUpperCase() ?? "")
    .join("");
}
