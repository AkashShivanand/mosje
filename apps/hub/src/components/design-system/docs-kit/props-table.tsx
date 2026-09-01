import * as React from "react";
// docs-kit.css is imported app-wide via globals.css.

import { GENERATED_PROPS, type GeneratedPropsKey } from "@/lib/design-system/props.generated";

export interface PropDef {
  name: string;
  type: string;
  default?: string;
  required?: boolean;
  description: string;
  /** Carries the `@deprecated` tag's text, or `true` when the tag had none. */
  deprecated?: string | true;
  /** For a union props type, the arm or arms that accept this prop. */
  onlyIn?: string;
}

/**
 * The API of a component, and the ONE way to render it.
 *
 * `from` is the way this should be used. It reads the props out of
 * `props.generated.ts`, which `tools/props-extract/extract.mjs` produces from
 * the TypeScript type checker — so a row cannot describe a prop that does not
 * exist, and a prop cannot exist without a row. An audit of twelve components
 * against their implementations found exactly one hand-written table that
 * matched its source; the rest invented a prop, inverted requiredness, or
 * omitted most of the API.
 *
 * `props` remains for the cases the extractor cannot reach — a hook's argument
 * list, a render-prop callback's shape, a documented sub-object. Where both are
 * given, the generated rows come first and the hand-written ones are appended,
 * which is how a component with a real interface plus a companion hook is
 * documented without lying about either.
 */
export function PropsTable({
  from,
  props = [],
}: {
  /** Key in `GENERATED_PROPS` — e.g. `"ButtonProps"`. Prefer this. */
  from?: GeneratedPropsKey;
  /** Hand-written rows, for what the extractor cannot see. */
  props?: PropDef[];
}): React.JSX.Element {
  const generated = from ? GENERATED_PROPS[from] : undefined;
  const rows: PropDef[] = [
    ...(generated
      ? generated.props.map((p) => ({
          name: p.name,
          type: p.type,
          required: p.required,
          default: "default" in p ? (p as { default?: string }).default : undefined,
          description: p.description,
          deprecated: "deprecated" in p ? (p as { deprecated?: string | true }).deprecated : undefined,
          onlyIn: "onlyIn" in p ? (p as { onlyIn?: string }).onlyIn : undefined,
        }))
      : []),
    ...props,
  ];

  return (
    <div className="props-table__scroll">
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
          {rows.map((p) => (
            <tr key={p.name} className={p.deprecated ? "props-table__row--deprecated" : undefined}>
              <td>
                <span className="props-table__name">{p.name}</span>
                {p.required && <span className="props-table__required"> *required</span>}
                {/* Which arm of a union props type accepts this — see GeneratedProp.onlyIn. */}
                {p.onlyIn && <span className="props-table__only"> {p.onlyIn} only</span>}
                {p.deprecated && <span className="props-table__deprecated"> deprecated</span>}
              </td>
              <td>
                <code className="props-table__type">{p.type}</code>
              </td>
              <td>
                {p.default ? (
                  <code className="props-table__type">{p.default}</code>
                ) : (
                  <span className="props-table__none">—</span>
                )}
              </td>
              <td>
                {/* An undescribed prop renders the same mark as an undefaulted
                    one. A blank cell reads as a rendering fault; a dash reads as
                    "nothing here", which is what it is. */}
                {p.description || <span className="props-table__none">—</span>}
                {typeof p.deprecated === "string" ? (
                  <span className="props-table__deprecated-note"> {p.deprecated}</span>
                ) : null}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {generated?.inheritsNative ? (
        <p className="props-table__native">
          {/*
            NO EXAMPLES. This sentence used to name `name`, `required` and
            `aria-describedby` — and forty-eight interfaces carry this flag,
            including ones extending `HTMLAttributes<HTMLDivElement>`, where
            `name` and `required` are not valid attributes at all. A generated
            table that invents a prop is the defect the generator exists to end,
            and naming examples reproduced it at scale.
          */}
          Every native attribute of the underlying element passes through, so it is available
          without being listed here.
        </p>
      ) : null}
    </div>
  );
}
