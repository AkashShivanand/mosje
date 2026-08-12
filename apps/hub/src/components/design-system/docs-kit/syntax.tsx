import * as React from "react";

/**
 * Syntax parts for code specimens.
 *
 * These exist so a docs page never colours a token of code by hand. Before them, the
 * same six hexes were written out independently in two pages — the drift the linkage
 * rule exists to stop, on the very pages that document the rule.
 *
 * Each part binds to one `--sa-code-*` role, so retuning the palette is one edit to
 * the token source and nothing else. Purely presentational: no semantics are implied
 * to assistive tech, because the surrounding `<pre><code>` already carries them.
 */
type PartProps = { children: React.ReactNode };

const part = (role: string) => {
  const C = ({ children }: PartProps): React.JSX.Element => (
    <span style={{ color: `var(--sa-code-${role})` }}>{children}</span>
  );
  C.displayName = `Syn.${role}`;
  return C;
};

export const Syn = {
  /** Comments and shell prompt annotations — the `#` lines. */
  Comment: part("comment"),
  /** Language keywords: import, from, const, export. */
  Keyword: part("keyword"),
  /** String literals and module specifiers. */
  Str: part("string"),
  /** The executable or callee in a command: npm, node, git. */
  Builtin: part("builtin"),
};

/**
 * A plain (non-terminal) code block. `TerminalCode` is the windowed variant with a
 * titlebar and a copy button; this is the same body with no chrome, for the cases that
 * were previously an inline `style` object repeated per page.
 */
export function CodeBlock({
  children,
  style,
}: {
  children: React.ReactNode;
  style?: React.CSSProperties;
}): React.JSX.Element {
  return (
    <pre
      style={{
        background: "var(--sa-code-bg)",
        color: "var(--sa-code-text)",
        borderRadius: "var(--sa-shape-md)",
        padding: "var(--sa-padding-l)",
        fontFamily: "var(--sa-font-mono)",
        fontSize: "var(--sa-type-body-3-size)",
        lineHeight: "var(--sa-type-body-2-lh)",
        marginTop: "var(--sa-stack-m)",
        overflowX: "auto",
        ...style,
      }}
    >
      <code>{children}</code>
    </pre>
  );
}
