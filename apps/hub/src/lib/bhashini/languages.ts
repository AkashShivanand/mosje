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
  /**
   * Does this language actually translate IN THE PROTOTYPE?
   *
   * The prototype has no Bhashini credentials and is not getting any — the real
   * integration happens on the live site. So only the languages with a bundled
   * dictionary translate here, and the picker has to say so rather than offer
   * thirteen choices where twelve silently do nothing. Selecting one of those
   * still switches `lang` and `dir`, which is a real part of the behaviour worth
   * demonstrating; what it cannot do is change the words.
   */
  prototype: boolean;
}

/**
 * English is first and is not a translation target — it is the source every other
 * entry is translated FROM, so it has no Bhashini call behind it.
 */
export const LANGUAGES: readonly EstateLanguage[] = [
  { code: "en", native: "English", english: "English", dir: "ltr", prototype: true },
  { code: "hi", native: "हिन्दी", english: "Hindi", dir: "ltr", prototype: true },
  { code: "bn", native: "বাংলা", english: "Bengali", dir: "ltr", prototype: false },
  { code: "mr", native: "मराठी", english: "Marathi", dir: "ltr", prototype: false },
  { code: "te", native: "తెలుగు", english: "Telugu", dir: "ltr", prototype: false },
  { code: "ta", native: "தமிழ்", english: "Tamil", dir: "ltr", prototype: false },
  { code: "gu", native: "ગુજરાતી", english: "Gujarati", dir: "ltr", prototype: false },
  { code: "kn", native: "ಕನ್ನಡ", english: "Kannada", dir: "ltr", prototype: false },
  { code: "ml", native: "മലയാളം", english: "Malayalam", dir: "ltr", prototype: false },
  { code: "pa", native: "ਪੰਜਾਬੀ", english: "Punjabi", dir: "ltr", prototype: false },
  { code: "or", native: "ଓଡ଼ିଆ", english: "Odia", dir: "ltr", prototype: false },
  { code: "as", native: "অসমীয়া", english: "Assamese", dir: "ltr", prototype: false },
  { code: "ur", native: "اردو", english: "Urdu", dir: "rtl", prototype: false },
] as const;

/**
 * Flip this the day the deployment carries Bhashini credentials and every entry
 * translates for real. It is read by the picker, and by nothing else.
 */
export const PROTOTYPE_MODE = true;

export const SOURCE_LANGUAGE = "en";

export function findLanguage(code: string): EstateLanguage | undefined {
  return LANGUAGES.find((l) => l.code === code);
}

/** The label the masthead's language control shows — the native name, always. */
export function languageLabel(code: string): string {
  return findLanguage(code)?.native ?? "English";
}
