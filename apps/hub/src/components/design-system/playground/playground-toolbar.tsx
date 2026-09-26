"use client";
import * as React from "react";
import { Button, ButtonGroup } from "@mosje/design-system";

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
        {/* Each switch is the design system's segmented control: an attached
            ButtonGroup whose Buttons carry aria-pressed. */}
        <ButtonGroup attached aria-label="Density">
          {(["comfortable", "compact"] as const).map((d) => (
            <Button key={d} appearance="outlined" size="sm" aria-pressed={density === d} onClick={() => onDensityChange(d)}>
              {d === "comfortable" ? "Comfortable" : "Compact"}
            </Button>
          ))}
        </ButtonGroup>

        {/* Bilingual Language Switcher */}
        {onLangChange && (
          <ButtonGroup attached aria-label="Language Preview">
            <Button appearance="outlined" size="sm" aria-pressed={lang === "en"} title="English specimen" onClick={() => onLangChange("en")}>
              EN
            </Button>
            <Button appearance="outlined" size="sm" aria-pressed={lang === "hi"} title="हिन्दी (Devanagari specimen)" lang="hi" onClick={() => onLangChange("hi")}>
              हिन्दी
            </Button>
          </ButtonGroup>
        )}

        {/* Code Format Switcher */}
        {onCodeModeChange && (
          <ButtonGroup attached aria-label="Code format">
            <Button appearance="outlined" size="sm" aria-pressed={codeMode === "jsx"} onClick={() => onCodeModeChange("jsx")}>
              JSX
            </Button>
            <Button appearance="outlined" size="sm" aria-pressed={codeMode === "html"} onClick={() => onCodeModeChange("html")}>
              HTML
            </Button>
          </ButtonGroup>
        )}
      </div>
    </div>
  );
}
