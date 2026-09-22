"use client";

import { useTranslation } from "@/components/i18n/translation-provider";

/** The hero search field — a client leaf only so its placeholder can be translated. */
export function HeroSearchInput() {
  const { t } = useTranslation();
  return (
    <input
      id="hero-q"
      name="q"
      type="search"
      autoComplete="off"
      spellCheck={false}
      placeholder={t("Search schemes and services")}
    />
  );
}
