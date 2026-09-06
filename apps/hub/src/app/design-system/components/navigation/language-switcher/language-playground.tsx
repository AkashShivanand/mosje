"use client";
import * as React from "react";
import { LanguageSwitcher } from "@mosje/design-system";

const BILINGUAL = [
  { code: "en", label: "English", href: "#en" },
  { code: "hi", label: "हिन्दी", href: "#hi" }, // ds-exempt(hindi-source): the language names ARE the fixture; LanguageSwitcher writes lang={code} on each one, so the attribute lives in the component rather than here
];

const FOUR = [
  { code: "en", label: "English", href: "#en" },
  { code: "hi", label: "हिन्दी", href: "#hi" },
  { code: "bn", label: "বাংলা", href: "#bn" },
  { code: "ta", label: "தமிழ்", href: "#ta" },
];

const CELL: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
  gap: "var(--sa-stack-8)",
  padding: "var(--sa-padding-20)",
  background: "var(--sa-bg-neutral-base)",
  borderRadius: "var(--sa-shape-8)",
};

const CAPTION: React.CSSProperties = {
  fontSize: "var(--sa-type-label-2-size)",
  lineHeight: "var(--sa-type-label-2-lh)",
  color: "var(--sa-text-neutral-subtle)",
};

/** Every arrangement: reading English, reading Hindi, four languages, named in Hindi. */
export function LanguagePlayground(): React.JSX.Element {
  return (
    <div
      style={{
        padding: "var(--sa-padding-40)",
        background: "var(--sa-bg-neutral-subtle)",
        borderRadius: "var(--sa-shape-8)",
        display: "grid",
        gap: "var(--sa-stack-16)",
      }}
    >
      <div style={CELL}>
        <LanguageSwitcher languages={BILINGUAL} current="en" />
        <p style={CAPTION}>Reading English. English is plain text; Hindi is the link.</p>
      </div>
      <div style={CELL}>
        <LanguageSwitcher languages={BILINGUAL} current="hi" label="भाषा" currentLabel="वर्तमान भाषा" />
        <p style={CAPTION}>
          Reading Hindi, with the group and the hidden note named in Hindi — they describe the
          control, so they follow the language being read.
        </p>
      </div>
      <div style={CELL}>
        <LanguageSwitcher languages={FOUR} current="en" />
        <p style={CAPTION}>
          Four languages, each written in its own script. This is the practical ceiling for a row.
        </p>
      </div>
    </div>
  );
}
