/**
 * Side-effect CSS imports, declared for TypeScript.
 *
 * TypeScript 7 raises TS2882 for `import "./thing.css"` unless the module is
 * declared — earlier versions let it pass silently. The hub never needed this
 * because Next ships the declaration in `next-env.d.ts`; Storybook's tsconfig
 * sets `"types": ["react", "react-dom"]` and so loads none of Next's globals,
 * which is why the two apps disagreed the moment the compiler got stricter.
 *
 * The declaration is deliberately bare. These imports exist for their side
 * effect — the bundler emits the stylesheet — and nothing reads a value from
 * them, so giving them a shape would invent an export that does not exist.
 */
declare module "*.css";
