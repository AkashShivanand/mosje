"use client";

import * as React from "react";
import { Modal } from "@mosje/design-system";

import { LANGUAGES } from "@/lib/bhashini/languages";
import { useTranslation } from "./translation-provider";

import "./language-dialog.css";

/**
 * The language picker.
 *
 * ── WHY A DIALOG AND NOT A DROPDOWN ───────────────────────────────────────────
 * Bhashini covers the 22 languages of the Eighth Schedule. A dropdown of 22
 * items in a masthead is a scroll trap on a phone and a wall of unfamiliar
 * script on a desktop. A dialog can give each language its own row, in its own
 * script, at a readable size, with the English name underneath for anyone who
 * arrived at the wrong one and needs to get back.
 *
 * It also settles an affordance that was previously false: the masthead's
 * language control has always drawn a caret, which promises something opens.
 * Until now nothing did.
 *
 * ── EACH ROW IS IN ITS OWN LANGUAGE ───────────────────────────────────────────
 * `lang` on the row is not a detail. Without it a screen reader announces
 * "ਪੰਜਾਬੀ" with an English voice and produces noise; with it, the row is read in
 * Punjabi. This is the one screen where every item is in a different language
 * from the page, so it is the one screen where per-item `lang` is essential.
 */
export function LanguageDialog({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}): React.JSX.Element {
  const { lang, setLang, t } = useTranslation();

  return (
    <Modal open={open} onClose={onClose} title={t("Select language")} size="md">
      <p className="lang-dialog__lede">
        {t("Translation is provided by Bhashini, the Government of India's national language platform.")}
      </p>

      <ul className="lang-dialog__list">
        {LANGUAGES.map((l) => {
          const current = l.code === lang;
          return (
            <li key={l.code}>
              <button
                type="button"
                className="lang-dialog__option"
                lang={l.code}
                dir={l.dir}
                aria-current={current ? "true" : undefined}
                onClick={() => {
                  setLang(l.code);
                  onClose();
                }}
              >
                <span className="lang-dialog__native">{l.native}</span>
                {/* The English name stays in English and says so, otherwise a
                    reader who picked the wrong script cannot find their way back. */}
                <span className="lang-dialog__english" lang="en" dir="ltr">
                  {l.english}
                </span>
                {current && (
                  <span className="lang-dialog__current" lang="en" dir="ltr">
                    {t("Current")}
                  </span>
                )}
              </button>
            </li>
          );
        })}
      </ul>
    </Modal>
  );
}
