import fs from 'fs';
const css = await (await fetch(`http://localhost:3007/_next/static/chunks/%5Broot-of-the-server%5D__1igs2o3._.css`)).text();
console.log("Has layer components:", css.includes('@layer components'));
console.log("Has layer base:", css.includes('@layer base'));
