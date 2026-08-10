"use client";
import * as React from "react";

interface PlaygroundToolbarProps {
  density: string;
  onDensityChange: (d: string) => void;
  rtl: boolean;
  onRtlChange: (r: boolean) => void;
}

export function PlaygroundToolbar({
  density, onDensityChange,
  rtl, onRtlChange,
}: PlaygroundToolbarProps): React.JSX.Element {
  return (
    <div className="playground-toolbar">
      <span className="playground-toolbar__label">Playground</span>

      <div className="pg-toggle-group" role="group" aria-label="Density">
        {(["comfortable", "compact"] as const).map((d) => (
          <button key={d} className={`pg-toggle${density === d ? " is-active" : ""}`} onClick={() => onDensityChange(d)} type="button">
            {d === "comfortable" ? "Default" : "Compact"}
          </button>
        ))}
      </div>

      <button className={`pg-toggle${rtl ? " is-active" : ""}`} onClick={() => onRtlChange(!rtl)} type="button" aria-pressed={rtl}>
        RTL
      </button>
    </div>
  );
}
