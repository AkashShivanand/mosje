"use client";
import * as React from "react";

interface PlaygroundToolbarProps {
  density: string;
  onDensityChange: (d: string) => void;
  lang?: "en" | "hi";
  onLangChange?: (l: "en" | "hi") => void;
  codeMode?: "jsx" | "html";
  onCodeModeChange?: (m: "jsx" | "html") => void;
}

export function PlaygroundToolbar({
  density,
  onDensityChange,
  lang = "en",
  onLangChange,
  codeMode = "jsx",
  onCodeModeChange,
}: PlaygroundToolbarProps): React.JSX.Element {
  return (
    <div className="playground-toolbar">
      <div className="playground-toolbar__left">
        <span className="playground-toolbar__label">Interactive Playground</span>
      </div>

      <div className="playground-toolbar__controls">
        {/* Density Toggle */}
        <div className="pg-toggle-group" role="group" aria-label="Density">
          {(["comfortable", "compact"] as const).map((d) => (
            <button
              key={d}
              className={`pg-toggle${density === d ? " is-active" : ""}`}
              onClick={() => onDensityChange(d)}
              type="button"
            >
              {d === "comfortable" ? "Comfortable" : "Compact"}
            </button>
          ))}
        </div>

        {/* Bilingual Language Switcher */}
        {onLangChange && (
          <div className="pg-toggle-group" role="group" aria-label="Language Preview">
            <button
              type="button"
              className={`pg-toggle${lang === "en" ? " is-active" : ""}`}
              onClick={() => onLangChange("en")}
              title="English specimen"
            >
              EN
            </button>
            <button
              type="button"
              className={`pg-toggle${lang === "hi" ? " is-active" : ""}`}
              onClick={() => onLangChange("hi")}
              title="हिन्दी (Devanagari specimen)"
            >
              हिन्दी
            </button>
          </div>
        )}

        {/* Code Format Switcher */}
        {onCodeModeChange && (
          <div className="pg-toggle-group" role="group" aria-label="Code format">
            <button
              type="button"
              className={`pg-toggle${codeMode === "jsx" ? " is-active" : ""}`}
              onClick={() => onCodeModeChange("jsx")}
            >
              JSX
            </button>
            <button
              type="button"
              className={`pg-toggle${codeMode === "html" ? " is-active" : ""}`}
              onClick={() => onCodeModeChange("html")}
            >
              HTML
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
