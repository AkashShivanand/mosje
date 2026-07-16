"use client";
import * as React from "react";

export interface ControlDef {
  name: string;
  label: string;
  type: "text" | "boolean" | "select" | "color";
  options?: string[];
  defaultValue: string | boolean;
}

interface PlaygroundControlsProps {
  controls: ControlDef[];
  values: Record<string, string | boolean>;
  onChange: (name: string, value: string | boolean) => void;
}

export function PlaygroundControls({ controls, values, onChange }: PlaygroundControlsProps): React.JSX.Element {
  if (controls.length === 0) return <></>;
  return (
    <div className="playground-controls">
      {controls.map((ctrl) => (
        <div key={ctrl.name} className="pg-control">
          <label className="pg-control__label" htmlFor={`ctrl-${ctrl.name}`}>{ctrl.label}</label>
          {ctrl.type === "boolean" ? (
            <input
              id={`ctrl-${ctrl.name}`}
              type="checkbox"
              checked={!!values[ctrl.name]}
              onChange={(e) => onChange(ctrl.name, e.target.checked)}
            />
          ) : ctrl.type === "select" ? (
            <select
              id={`ctrl-${ctrl.name}`}
              className="pg-control__input"
              value={String(values[ctrl.name])}
              onChange={(e) => onChange(ctrl.name, e.target.value)}
            >
              {ctrl.options?.map((o) => <option key={o} value={o}>{o}</option>)}
            </select>
          ) : ctrl.type === "color" ? (
            <input
              id={`ctrl-${ctrl.name}`}
              type="color"
              value={String(values[ctrl.name])}
              onChange={(e) => onChange(ctrl.name, e.target.value)}
              style={{ height: "32px", width: "100%", cursor: "pointer" }}
            />
          ) : (
            <input
              id={`ctrl-${ctrl.name}`}
              className="pg-control__input"
              type="text"
              value={String(values[ctrl.name])}
              onChange={(e) => onChange(ctrl.name, e.target.value)}
            />
          )}
        </div>
      ))}
    </div>
  );
}
