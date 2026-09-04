/**
 * Side-effect CSS imports, declared for TypeScript.
 *
 * Every component here does `import "./thing.css"` for its own stylesheet.
 * TypeScript 7 raises TS2882 for that unless the module is declared; 5.x let it
 * pass in silence. This package's tsconfig sets `"types": ["react", "react-dom"]`,
 * so — unlike the hub — it loads none of Next's globals and has no declaration
 * of its own to fall back on.
 *
 * Bare on purpose. These imports exist for their side effect: the bundler emits
 * the stylesheet and nothing reads a value back. Giving them a shape would
 * invent an export that does not exist.
 */
declare module "*.css";
