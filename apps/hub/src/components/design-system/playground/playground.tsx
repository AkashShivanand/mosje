"use client";
import * as React from "react";
import { LiveProvider, LivePreview, LiveEditor, LiveError } from "react-live";
import * as DS from "@mosje/design-system";
import { PlaygroundToolbar } from "./playground-toolbar";
import { PlaygroundControls, type ControlDef } from "./playground-controls";
import "./playground.css";

const LIVE_SCOPE = {
  ...DS,
  React,
};

interface PlaygroundProps {
  /** Default code to render. Use JSX. Wrap in () for multi-line. */
  code: string;
  /** Optional static HTML code representation */
  htmlCode?: string;
  /** Prop controls definition */
  controls?: ControlDef[];
  /** Derive new code from current control values and language */
  buildCode?: (values: Record<string, string | boolean>, lang?: "en" | "hi") => string;
}

export function Playground({
  code: initialCode,
  htmlCode,
  controls = [],
  buildCode,
}: PlaygroundProps): React.JSX.Element {
  const [density, setDensity] = React.useState("comfortable");
  const [lang, setLang] = React.useState<"en" | "hi">("en");
  const [codeMode, setCodeMode] = React.useState<"jsx" | "html">("jsx");
  const [copied, setCopied] = React.useState(false);

  const [values, setValues] = React.useState<Record<string, string | boolean>>(() =>
    Object.fromEntries(controls.map((c) => [c.name, c.defaultValue]))
  );

  const code = buildCode ? buildCode(values, lang) : initialCode;
  const activeCodeDisplay = codeMode === "html" && htmlCode ? htmlCode : code;

  const onChange = (name: string, value: string | boolean) => {
    setValues((prev) => ({ ...prev, [name]: value }));
  };

  const copy = () => {
    navigator.clipboard.writeText(activeCodeDisplay).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    });
  };
  const dataDensity = density === "compact" ? "compact" : undefined;

  return (
    <div className="playground">
      <PlaygroundToolbar
        density={density}
        onDensityChange={setDensity}
        lang={lang}
        onLangChange={setLang}
        codeMode={htmlCode ? codeMode : undefined}
        onCodeModeChange={htmlCode ? setCodeMode : undefined}
      />
      <LiveProvider code={code} scope={LIVE_SCOPE} noInline={false}>
        <div
          className="playground-canvas"
          data-density={dataDensity}
          lang={lang === "hi" ? "hi" : undefined}
        >
          <LivePreview />
          <LiveError
            style={{
              color: "var(--sa-text-status-error-base)",
              fontSize: "var(--sa-type-body-3-size)",
              marginTop: "var(--sa-padding-8)",
              fontFamily: "var(--sa-font-mono)",
            }}
          />
        </div>
        {controls.length > 0 && (
          <PlaygroundControls controls={controls} values={values} onChange={onChange} />
        )}
        <div className="playground-code">
          <div className="playground-code__header">
            <span>{codeMode === "html" ? "HTML (Vanilla)" : "JSX (React)"}</span>
            <button className="playground-code__copy" onClick={copy} type="button">
              {copied ? "Copied!" : "Copy code"}
            </button>
          </div>
          {codeMode === "jsx" ? (
            <LiveEditor />
          ) : (
            <pre className="playground-code__html" style={{ padding: "var(--sa-padding-16)", margin: 0, overflowX: "auto" }}>
              <code>{htmlCode}</code>
            </pre>
          )}
        </div>
      </LiveProvider>
    </div>
  );
}
