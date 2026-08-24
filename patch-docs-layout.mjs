import fs from 'fs';
const file = 'apps/hub/src/components/design-system/docs-layout/docs-layout.tsx';
let code = fs.readFileSync(file, 'utf8');

// Replace the <span className="docs-sidebar__logo">SA</span> with an image
code = code.replace(
  '<span className="docs-sidebar__logo" aria-hidden="true">SA</span>',
  '<img src="/design-system/samavesh-logo.svg" alt="" className="docs-sidebar__logo-img" />'
);

fs.writeFileSync(file, code);
