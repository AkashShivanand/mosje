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
  /** Prop controls definition */
  controls?: ControlDef[];
  /** Derive new code from current control values */
  buildCode?: (values: Record<string, string | boolean>) => string;
}

export function Playground({ code: initialCode, controls = [], buildCode }: PlaygroundProps): React.JSX.Element {
  const [density, setDensity] = React.useState("comfortable");
  const [rtl, setRtl] = React.useState(false);
  const [copied, setCopied] = React.useState(false);

  const [values, setValues] = React.useState<Record<string, string | boolean>>(() =>
    Object.fromEntries(controls.map((c) => [c.name, c.defaultValue]))
  );

  const code = buildCode ? buildCode(values) : initialCode;

  const onChange = (name: string, value: string | boolean) => {
    setValues((prev) => ({ ...prev, [name]: value }));
  };

  const copy = () => {
    navigator.clipboard.writeText(code).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    });
  };
  const dataDensity = density === "compact" ? "compact" : undefined;

  return (
    <div className="playground">
      <PlaygroundToolbar
        density={density} onDensityChange={setDensity}
        rtl={rtl} onRtlChange={setRtl}
      />
      <LiveProvider code={code} scope={LIVE_SCOPE} noInline={false}>
        <div
          className="playground-canvas"
          data-density={dataDensity}
          dir={rtl ? "rtl" : undefined}
        >
          <LivePreview />
          <LiveError style={{ color: "var(--sa-text-status-error-base)", fontSize: "13px", marginTop: "var(--sa-padding-xs)" }} />
        </div>
        {controls.length > 0 && (
          <PlaygroundControls controls={controls} values={values} onChange={onChange} />
        )}
        <div className="playground-code">
          <div className="playground-code__header">
            <span>JSX</span>
            <button className="playground-code__copy" onClick={copy} type="button">
              {copied ? "Copied!" : "Copy"}
            </button>
          </div>
          <LiveEditor />
        </div>
      </LiveProvider>
    </div>
  );
}
