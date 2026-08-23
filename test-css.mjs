import fs from 'fs';
const html = await (await fetch('http://localhost:3007/design-system')).text();
const cssLinks = html.match(/href="([^"]+\.css[^"]*)"/g).map(s => s.slice(6, -1));
console.log("CSS Links:", cssLinks);

for (const link of cssLinks) {
  const url = link.startsWith('http') ? link : `http://localhost:3007${link.startsWith('/') ? '' : '/'}${link}`;
  const css = await (await fetch(url)).text();
  
  if (css.includes('.ds-btn--filled')) {
    console.log(`\n\n--- Found .ds-btn--filled in ${link} ---`);
    const idx = css.indexOf('.ds-btn--filled');
    console.log(css.slice(Math.max(0, idx - 100), idx + 200));
  }
  
  if (css.includes('a {')) {
     console.log(`\n\n--- Found a { ... in ${link} ---`);
     const idx = css.indexOf('a {');
     console.log(css.slice(Math.max(0, idx - 100), idx + 100));
  }
}
