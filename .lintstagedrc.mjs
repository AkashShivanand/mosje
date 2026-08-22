// lint-staged config as ESM.
import path from "path";
import { fileURLToPath } from "url";

const ROOT = path.dirname(fileURLToPath(import.meta.url));

function appLint(appDir) {
  const abs = path.join(ROOT, appDir);
  const bin = path.join(ROOT, "node_modules", ".bin", "eslint");
  return (filenames) => {
    const files = filenames
      .map((f) => path.relative(abs, f))
      .filter((f) => !f.startsWith(".."));
    if (files.length === 0) return [];
    const fileArgs = files.map((f) => `'${f}'`).join(" ");
    return [`bash -c 'cd ${abs} && ${bin} --fix --max-warnings 0 ${fileArgs}'`];
  };
}

export default {
  "apps/hub/**/*.{ts,tsx,js,jsx}": appLint("apps/hub"),
  "apps/dosje/**/*.{ts,tsx,js,jsx}": appLint("apps/dosje"),
  "apps/portals/smile-admin/**/*.{ts,tsx,js,jsx}": appLint("apps/portals/smile-admin"),
  "apps/portals/pm-ajay/**/*.{ts,tsx,js,jsx}": appLint("apps/portals/pm-ajay"),
  "**/*.css": "stylelint"
};
