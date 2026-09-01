#!/usr/bin/env node
/**
 * A PROPS TABLE THAT CANNOT LIE.
 *
 * Every props table in this estate was hand-typed. An audit of twelve
 * components against their implementations on 2026-09-02 found exactly ONE
 * table (Tabs) that matched its source. The rest carried:
 *
 *   - an invented prop      `ChartCard` documented `action`; the prop is `actions`
 *   - inverted requiredness `AppShell` marked `sidebar` and `footer` required;
 *                           both are optional, and the TSDoc says so
 *   - absent props          `BarChart` documented 2 of 11 — the entire
 *                           multi-series arm was undiscoverable
 *   - wrong measurements    `Modal` published 400/600/800px against a CSS of
 *                           24rem/28rem/40rem
 *
 * None of that is carelessness. It is what hand-maintaining sixty API tables
 * against a moving library produces, and the ds-pages gate could not see any of
 * it because it tested that a `<PropsTable>` was RENDERED, never that it was
 * TRUE.
 *
 * So the tables stop being written. This reads the TypeScript source with the
 * compiler's own type checker — not a regex — and emits one generated module the
 * documentation pages import.
 *
 *   npm run build:props     regenerate
 *   npm run check:props     fail if the committed output is stale
 *
 * WHAT IT EXTRACTS, and why by type checker rather than by parsing:
 * a props interface here routinely extends `React.InputHTMLAttributes<…>` or
 * unions two arms (`BarChartProps = BarSingle | BarMulti`). Only the checker
 * resolves those. Inherited DOM attributes are deliberately EXCLUDED — a table
 * listing 250 native attributes documents nothing — but their presence is
 * recorded so a page can say "every native input attribute passes through".
 */
import ts from "typescript";
import { readFileSync, writeFileSync, existsSync, mkdirSync } from "node:fs";
import { join, dirname, relative } from "node:path";
import { fileURLToPath } from "node:url";

const HERE = dirname(fileURLToPath(import.meta.url));
const ROOT = join(HERE, "..", "..");
const PKG = join(ROOT, "packages/design-system");
const OUT = join(ROOT, "apps/hub/src/lib/design-system/props.generated.ts");

/** Declaration files whose members are inherited DOM plumbing, not our API. */
const FOREIGN = /node_modules|lib\.dom\.d\.ts|@types[\\/]react/;

/** A union member that is a literal value rather than another type. */
const LITERAL = /^["'`]|^\d|^(true|false)\b/;

/** The directories the public barrel re-exports from. */
const SCANNED = ["components", "demo", "foundations"];

function program() {
  const configPath = ts.findConfigFile(PKG, ts.sys.fileExists, "tsconfig.json");
  const host = ts.createCompilerHost(
    {
      target: ts.ScriptTarget.ES2022,
      jsx: ts.JsxEmit.ReactJSX,
      moduleResolution: ts.ModuleResolutionKind.Bundler,
      allowJs: false,
      skipLibCheck: true,
      strict: true,
    },
    true,
  );
  const files = [];
  const walk = (dir) => {
    for (const e of ts.sys.readDirectory(dir, [".tsx", ".ts"], undefined, undefined)) files.push(e);
  };
  // The barrel exports from three directories, not one. Scanning only
  // `components/` meant `DemoDockProps` and the foundation types were missing,
  // which surfaced as a documentation page referencing an interface the
  // generator had never seen.
  walk(join(PKG, "components"));
  walk(join(PKG, "demo"));
  walk(join(PKG, "foundations"));
  void configPath;
  return ts.createProgram(files, host.getCompilationSettings?.() ?? {
    target: ts.ScriptTarget.ES2022,
    jsx: ts.JsxEmit.ReactJSX,
    moduleResolution: ts.ModuleResolutionKind.Bundler,
    skipLibCheck: true,
    strict: true,
  });
}

/**
 * The declared default for a prop — from a `@default` tag, or from the value the
 * component actually destructures.
 *
 * The tag alone covered 207 of 957 props, so 78% of rows rendered an em dash
 * that reads as "no default" beside props that plainly have one:
 * `BarChartProps.orientation` published `—` while `bar-chart.tsx` reads
 * `orientation = "vertical"`. On a generated table whose entire claim is that it
 * cannot lie, the Default column was the one place it did — and wrongly, in the
 * direction that silently changes what a developer's component renders.
 */
function defaultOf(symbol, destructured) {
  const tag = symbol
    .getJsDocTags()
    .find((t) => t.name === "default" || t.name === "defaultValue");
  const tagged = tag ? ts.displayPartsToString(tag.text).trim() : "";
  // The tag wins: it is the author saying what the default MEANS, where the
  // initializer only says what it is.
  return tagged || destructured?.get(symbol.getName()) || undefined;
}

/**
 * Every `{ prop = value }` a component destructures, keyed by prop name.
 *
 * Matched by the parameter whose type annotation names the interface — directly
 * (`props: FooProps`) or through a wrapper (`forwardRef<HTMLElement, FooProps>`).
 * Scoped to that parameter rather than swept file-wide, because two components
 * in one file can default the same prop name differently — `controls.css`'s
 * Checkbox and Radio both take `disabled`.
 */
function destructuredDefaults(sourceFile, interfaceName) {
  const found = new Map();
  const visit = (node) => {
    if (
      (ts.isFunctionDeclaration(node) || ts.isFunctionExpression(node) || ts.isArrowFunction(node)) &&
      node.parameters.length
    ) {
      const p = node.parameters[0];
      const annotated = p.type ? p.type.getText() : "";
      // A forwardRef's props type sits on the CALL's type arguments, not the
      // parameter, so the enclosing call is checked too.
      const call = node.parent && ts.isCallExpression(node.parent) ? node.parent : null;
      const viaCall = call?.typeArguments?.map((t) => t.getText()).join(" ") ?? "";
      const matches = annotated.includes(interfaceName) || viaCall.includes(interfaceName);
      if (matches) {
        const collect = (pattern) => {
          for (const el of pattern.elements) {
            if (!el.initializer || !ts.isIdentifier(el.propertyName ?? el.name)) continue;
            const key = (el.propertyName ?? el.name).getText();
            found.set(key, el.initializer.getText().replace(/\s+/g, " ").trim());
          }
        };
        if (ts.isObjectBindingPattern(p.name)) {
          collect(p.name);
        } else if (ts.isIdentifier(p.name) && node.body) {
          /*
           * A UNION props type cannot be destructured in the parameter position,
           * so those components take `props: FooProps` and unpack it in the body
           * — `const { orientation = "vertical" } = props`. That is every chart
           * in the estate, which is why the first version of this found none of
           * their defaults.
           */
          const paramName = p.name.getText();
          const body = (stmt) => {
            if (
              ts.isVariableDeclaration(stmt) &&
              ts.isObjectBindingPattern(stmt.name) &&
              stmt.initializer &&
              ts.isIdentifier(stmt.initializer) &&
              stmt.initializer.getText() === paramName
            ) {
              collect(stmt.name);
            }
            ts.forEachChild(stmt, body);
          };
          ts.forEachChild(node.body, body);
        }
      }
    }
    ts.forEachChild(node, visit);
  };
  visit(sourceFile);
  return found;
}

function describe(symbol, checker) {
  const doc = ts.displayPartsToString(symbol.getDocumentationComment(checker)).trim();
  if (doc) return doc.replace(/\s+/g, " ");
  return "";
}

/**
 * A member is OURS when at least one of its declarations sits inside this
 * package. React's 250 inherited DOM attributes are real, but listing them is
 * how a props table becomes unreadable.
 */
function isOurs(symbol) {
  const decls = symbol.getDeclarations() ?? [];
  return decls.some((d) => {
    const f = d.getSourceFile().fileName;
    return !FOREIGN.test(f) && f.includes("packages/design-system");
  });
}

function extract() {
  const prog = program();
  const checker = prog.getTypeChecker();
  const out = {};

  for (const src of prog.getSourceFiles()) {
    if (FOREIGN.test(src.fileName)) continue;
    if (!SCANNED.some((d) => src.fileName.includes(`packages/design-system/${d}`))) continue;

    ts.forEachChild(src, (node) => {
      const isInterface = ts.isInterfaceDeclaration(node);
      const isAlias = ts.isTypeAliasDeclaration(node);
      if (!isInterface && !isAlias) return;
      const name = node.name.getText();
      if (!/Props$/.test(name)) return;

      const exported = node.modifiers?.some((m) => m.kind === ts.SyntaxKind.ExportKeyword);
      if (!exported) return;

      const type = checker.getTypeAtLocation(node.name);
      const props = [];
      let inheritsNative = false;

      /*
       * A UNION PROPS TYPE RETURNS ITS INTERSECTION, WHICH IS USUALLY EMPTY.
       *
       * `BarChartProps = BarSingle | BarMulti`, and `getPropertiesOfType` on
       * that union returns only what BOTH arms declare — so the generated table
       * had `title` and none of `data`, `labels` or `series`. A developer could
       * not construct a BarChart from the published API, which is the exact
       * failure the generator was written to end, reproduced by trusting one
       * checker call.
       *
       * So a union is walked ARM BY ARM and the property sets merged by name. A
       * prop that does not appear in every arm is marked with the arms it
       * belongs to, because "you may pass `data` OR `labels`+`series`" is the
       * single most important fact about this component and it is invisible in
       * a flat list.
       */
      const destructured = destructuredDefaults(src, name);
      const arms = type.isUnion() ? type.types : [type];
      const armNames = arms.map((a) => checker.typeToString(a));
      const seen = new Map();
      for (let ai = 0; ai < arms.length; ai++) {
        for (const symbol of checker.getPropertiesOfType(arms[ai])) {
          const entry = seen.get(symbol.getName());
          if (entry) entry.arms.push(ai);
          else seen.set(symbol.getName(), { symbol, arms: [ai] });
        }
      }

      for (const { symbol, arms: inArms } of seen.values()) {
        const onlyIn =
          arms.length > 1 && inArms.length < arms.length
            ? inArms.map((i) => armNames[i]).join(" | ")
            : null;
        if (!isOurs(symbol)) {
          inheritsNative = true;
          continue;
        }
        const decl = symbol.getDeclarations()?.[0];
        if (!decl) continue;
        /*
         * PRINT WHAT THE AUTHOR WROTE, NOT WHAT THE CHECKER RESOLVES.
         *
         * The checker is right and unreadable: `React.ReactNode` expands to a
         * nine-member union mentioning `React.JSXElementConstructor`, and a
         * props table full of those documents nothing. The written type node is
         * what a reader needs — `React.ReactNode`, `ButtonAppearance`.
         *
         * But a bare alias hides its members, and that is exactly how
         * `ButtonAppearance` came to be documented as three values when it has
         * five (two of them deprecated). So where the written type is an alias
         * that resolves to a union of literals, the members are appended.
         */
        const written = ts.isPropertySignature(decl) && decl.type ? decl.type.getText() : null;
        const t = checker.getTypeOfSymbolAtLocation(symbol, decl);
        const resolved = checker
          .typeToString(t, decl, ts.TypeFormatFlags.NoTruncation | ts.TypeFormatFlags.InTypeAlias)
          .replace(/\s*\|\s*undefined$/, "");

        let printed = written ?? resolved;
        if (written && /^[A-Za-z_$][\w$.]*$/.test(written) && ts.isPropertySignature(decl) && decl.type) {
          // The checker prints an alias by NAME, so asking it to expand does not
          // work. Read the alias's own declaration instead — it is the union the
          // author wrote, and it is what belongs in the table.
          let aliasSymbol = checker.getSymbolAtLocation(
            ts.isTypeReferenceNode(decl.type) ? decl.type.typeName : decl.type,
          );
          /*
           * An IMPORTED type resolves to its import specifier, not to the alias
           * declaration — so a union defined in another file printed as a bare
           * name while the same union defined locally printed expanded. The
           * result was `CardStateKind` documented two different ways in one
           * generated file, and `ChartState` — the whole chart state contract —
           * printed bare on all eighteen charts that accept it.
           */
          if (aliasSymbol && aliasSymbol.flags & ts.SymbolFlags.Alias) {
            aliasSymbol = checker.getAliasedSymbol(aliasSymbol);
          }
          const aliasDecl = aliasSymbol?.getDeclarations?.()?.[0];
          if (aliasDecl && ts.isTypeAliasDeclaration(aliasDecl) && ts.isUnionTypeNode(aliasDecl.type)) {
            const aliasText = aliasDecl.getSourceFile().text;

            /*
             * A union member may itself be an alias — `ChartState = "loading" |
             * CardStateKind`. Expanding only flat literal unions left the whole
             * chart state contract printed as a bare name on eighteen
             * components, so a nested literal-union alias is flattened inline.
             */
            const expandNested = (node) => {
              if (!ts.isTypeReferenceNode(node)) return null;
              let sym = checker.getSymbolAtLocation(node.typeName);
              if (sym && sym.flags & ts.SymbolFlags.Alias) sym = checker.getAliasedSymbol(sym);
              const d = sym?.getDeclarations?.()?.[0];
              if (!d || !ts.isTypeAliasDeclaration(d) || !ts.isUnionTypeNode(d.type)) return null;
              const inner = d.type.types.map((t) => t.getText().replace(/\s+/g, " ").trim());
              return inner.every((t) => LITERAL.test(t)) ? inner : null;
            };

            /*
             * A member's JSDoc sits above the `|`, so it is leading trivia of
             * the SEPARATOR rather than of the member — which is why reading the
             * member's own comment ranges finds nothing. Scan the source between
             * the previous member and this one instead. `ButtonAppearance` marks
             * two of its five members deprecated, and the Button page documented
             * three with no mention of the other two.
             */
            let cursor = aliasDecl.type.getStart();
            const members = aliasDecl.type.types.flatMap((m) => {
              const between = aliasText.slice(cursor, m.getStart());
              cursor = m.getEnd();
              const deprecatedHere = /@deprecated/.test(between);
              const nested = expandNested(m);
              const values = nested ?? [m.getText().replace(/\s+/g, " ").trim()];
              return values.map((v) => (deprecatedHere ? `${v} (deprecated)` : v));
            });

            const allLiteral = members.every((m) => LITERAL.test(m));
            if (allLiteral) printed = `${written} = ${members.join(" | ")}`;
        }
        }
        const optional = (symbol.flags & ts.SymbolFlags.Optional) !== 0;
        const deprecated = symbol.getJsDocTags().some((tag) => tag.name === "deprecated");
        const deprecatedNote = symbol
          .getJsDocTags()
          .filter((tag) => tag.name === "deprecated")
          .map((tag) => ts.displayPartsToString(tag.text).trim())
          .filter(Boolean)[0];

        props.push({
          name: symbol.getName(),
          type: printed,
          // A prop present in only some arms of a union is optional overall,
          // whatever it is inside its own arm.
          required: !optional && !onlyIn,
          default: defaultOf(symbol, destructured),
          description: describe(symbol, checker),
          ...(onlyIn ? { onlyIn } : {}),
          ...(deprecated ? { deprecated: deprecatedNote || true } : {}),
        });
      }

      if (!props.length) return;
      props.sort((a, b) =>
        a.required === b.required ? a.name.localeCompare(b.name) : a.required ? -1 : 1,
      );
      out[name] = {
        source: relative(ROOT, src.fileName),
        inheritsNative,
        props,
      };
    });
  }
  return out;
}

/**
 * A prop's TSDoc sometimes names a mark path — `OrgLogo.src` explains the
 * registry's escape hatch by quoting one. `check:org-logos` matches a quoted
 * `/org-logos/` anywhere and looks for its exemption on the line itself or in
 * the comment directly above, so a file-level header does not reach it. The
 * exemption is emitted beside the line instead.
 *
 * Documentation that QUOTES a path is not a consumer of it — which is exactly
 * what that gate's own `prose` category is for.
 */
/** The same four patterns `tools/org-logo/check.mjs` matches. */
const MARK_PATH =
  /["'`][^"'`]*(\/org-logos\/|National-Emblem-logo|National_Emblem_logo|samavesh-logo)[^"'`]*["'`]/;

function markExempt(json) {
  return json
    .split("\n")
    .flatMap((line) =>
      MARK_PATH.test(line)
        ? ["// org-logo-exempt(generated): copied from the component's TSDoc; prose, not a usage.", line]
        : [line],
    )
    .join("\n");
}

function render(data) {
  const names = Object.keys(data).sort();
  return `// GENERATED by tools/props-extract/extract.mjs — do not edit by hand.
// org-logo-exempt(generated): the prop DESCRIPTIONS below are copied verbatim from
// each component's TSDoc, and one of them explains the org-logo registry's escape
// hatch by naming a path. Documentation that quotes a path is not a consumer of it.
// Run \`npm run build:props\`. \`npm run check:props\` fails when this is stale.
//
// Read from the TypeScript type checker, so a prop cannot be documented that
// does not exist and a prop cannot exist that is not documented. Inherited DOM
// attributes are excluded by design; \`inheritsNative\` records that they are
// there so a page can say so in one sentence instead of two hundred rows.

export interface GeneratedProp {
  name: string;
  type: string;
  required: boolean;
  default?: string;
  description: string;
  /** Present when the prop carries an \`@deprecated\` tag; the tag's text if it has any. */
  deprecated?: string | true;
  /**
   * For a props type that is a UNION, the arm or arms this prop belongs to.
   * \`BarChartProps = BarSingle | BarMulti\` accepts \`data\` on one arm and
   * \`labels\` + \`series\` on the other, and a flat list cannot say so — which is
   * how the whole multi-series form came to be undocumented.
   */
  onlyIn?: string;
}

export interface GeneratedPropSet {
  /** Repo-relative path of the file the interface was read from. */
  source: string;
  /** True when the interface extends a React DOM attribute set. */
  inheritsNative: boolean;
  props: GeneratedProp[];
}

export const GENERATED_PROPS = {
${names.map((n) => `  ${JSON.stringify(n)}: ${markExempt(JSON.stringify(data[n], null, 2)).split("\n").map((l, i) => (i === 0 ? l : "  " + l)).join("\n")},`).join("\n")}
} as const satisfies Record<string, GeneratedPropSet>;

export type GeneratedPropsKey = keyof typeof GENERATED_PROPS;
`;
}

const data = extract();
const text = render(data);
const mode = process.argv[2];
const count = Object.keys(data).length;
const total = Object.values(data).reduce((n, d) => n + d.props.length, 0);

if (mode === "--check") {
  if (!existsSync(OUT)) {
    console.error(`\n✖ props: ${relative(ROOT, OUT)} does not exist. Run npm run build:props.\n`);
    process.exit(1);
  }
  if (readFileSync(OUT, "utf8") !== text) {
    console.error(
      `\n✖ props: the generated props are stale — a component's interface changed and the\n` +
        `   documentation did not follow. Run npm run build:props and commit the result.\n`,
    );
    process.exit(1);
  }
  console.log(`✔ props: ${count} interface(s), ${total} prop(s) — generated output is current.`);
  process.exit(0);
}

mkdirSync(dirname(OUT), { recursive: true });
writeFileSync(OUT, text);
console.log(`✔ props: wrote ${count} interface(s), ${total} prop(s) → ${relative(ROOT, OUT)}`);
