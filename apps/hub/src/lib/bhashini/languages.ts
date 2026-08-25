/**
 * The languages this estate offers, and how each one is written.
 *
 * Bhashini covers the 22 languages of the Eighth Schedule. This is the subset the
 * prototype offers — the ones with the largest speaker counts among the
 * communities the Department serves — plus Urdu, which is here for a second
 * reason: it is right-to-left, and a language switcher that only ever ships
 * left-to-right scripts never finds out whether the interface can turn around.
 *
 * `code` is the ISO 639-1 code Bhashini expects as sourceLanguage / targetLanguage
 * AND the value that goes on `<html lang>`, which is what assistive technology
 * reads to pick a voice (WCAG 3.1.1). They are the same string on purpose.
 */
export interface EstateLanguage {
  /** ISO 639-1. Sent to Bhashini and written to `<html lang>`. */
  code: string;
  /** The name in the language itself — never a translation of it. */
  native: string;
  /** The English name, for the picker's secondary line and for `aria-label`. */
  english: string;
  /** Writing direction, written to `<html dir>`. */
  dir: "ltr" | "rtl";
}

/**
 * English is first and is not a translation target — it is the source every other
 * entry is translated FROM, so it has no Bhashini call behind it.
 */
export const LANGUAGES: readonly EstateLanguage[] = [
  { code: "en", native: "English", english: "English", dir: "ltr" },
  { code: "hi", native: "हिन्दी", english: "Hindi", dir: "ltr" },
  { code: "bn", native: "বাংলা", english: "Bengali", dir: "ltr" },
  { code: "mr", native: "मराठी", english: "Marathi", dir: "ltr" },
  { code: "te", native: "తెలుగు", english: "Telugu", dir: "ltr" },
  { code: "ta", native: "தமிழ்", english: "Tamil", dir: "ltr" },
  { code: "gu", native: "ગુજરાતી", english: "Gujarati", dir: "ltr" },
  { code: "kn", native: "ಕನ್ನಡ", english: "Kannada", dir: "ltr" },
  { code: "ml", native: "മലയാളം", english: "Malayalam", dir: "ltr" },
  { code: "pa", native: "ਪੰਜਾਬੀ", english: "Punjabi", dir: "ltr" },
  { code: "or", native: "ଓଡ଼ିଆ", english: "Odia", dir: "ltr" },
  { code: "as", native: "অসমীয়া", english: "Assamese", dir: "ltr" },
  { code: "ur", native: "اردو", english: "Urdu", dir: "rtl" },
] as const;

export const SOURCE_LANGUAGE = "en";

export function findLanguage(code: string): EstateLanguage | undefined {
  return LANGUAGES.find((l) => l.code === code);
}

/** The label the masthead's language control shows — the native name, always. */
export function languageLabel(code: string): string {
  return findLanguage(code)?.native ?? "English";
}
