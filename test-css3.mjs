import fs from 'fs';
const html = await (await fetch('http://localhost:3007/design-system')).text();
const cssLinks = html.match(/href="([^"]+\.css[^"]*)"/g).map(s => s.slice(6, -1));

const css = await (await fetch(`http://localhost:3007/_next/static/chunks/apps_hub_src_0at6ekl._.css`)).text();
console.log(css.includes('@layer base'));
