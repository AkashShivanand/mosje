import fs from 'fs';
const html = await (await fetch('http://localhost:3007/design-system')).text();
const cssLinks = html.match(/href="([^"]+\.css[^"]*)"/g).map(s => s.slice(6, -1));

for (const link of cssLinks) {
  const url = link.startsWith('http') ? link : `http://localhost:3007${link.startsWith('/') ? '' : '/'}${link}`;
  const css = await (await fetch(url)).text();
  
  if (css.includes('var(--sa-text-link-brand-default)')) {
     console.log(`\n\n--- Found link color in ${link} ---`);
     const idx = css.indexOf('var(--sa-text-link-brand-default)');
     console.log(css.slice(Math.max(0, idx - 100), idx + 100));
  }
}
