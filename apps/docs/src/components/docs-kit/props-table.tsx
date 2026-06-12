import * as React from "react";
import "./docs-kit.css";

export interface PropDef {
  name: string;
  type: string;
  default?: string;
  required?: boolean;
  description: string;
}

export function PropsTable({ props }: { props: PropDef[] }): React.JSX.Element {
  return (
    <div style={{ overflowX: "auto" }}>
      <table className="props-table">
        <thead>
          <tr>
            <th scope="col">Prop</th>
            <th scope="col">Type</th>
            <th scope="col">Default</th>
            <th scope="col">Description</th>
          </tr>
        </thead>
        <tbody>
          {props.map((p) => (
            <tr key={p.name}>
              <td>
                <span className="props-table__name">{p.name}</span>
                {p.required && <span className="props-table__required"> *required</span>}
              </td>
              <td><code className="props-table__type">{p.type}</code></td>
              <td>{p.default ? <code className="props-table__type">{p.default}</code> : <span style={{ color: "var(--ds-ink-muted)" }}>—</span>}</td>
              <td>{p.description}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
