// Download all homepage assets for the dosje.gov.in clone.
// Origins: D = www.dosje.gov.in, C = CloudFront CDN, B = Bhashini plugin
import { mkdir, writeFile } from 'node:fs/promises';
import { dirname, basename, join } from 'node:path';

const ORIGINS = {
  D: 'https://www.dosje.gov.in',
  C: 'https://durwo6bhtjtqt.cloudfront.net',
  B: 'https://translation-plugin.bhashini.co.in',
};

// "<origin>|<path>" -> downloaded to public/images/<basename> (favicon to public/seo/)
const ASSETS = [
  'D|/wp-content/uploads/2025/10/Indian-Flag.svg',
  'D|/wp-content/uploads/2025/10/open_in_new_icon.svg',
  'D|/wp-content/uploads/2025/10/National-Emblem-logo.svg',
  'D|/wp-content/uploads/2025/10/digital-india-logo.svg',
  'D|/wp-content/uploads/2025/11/National_Emblem_logo_white.svg',
  'D|/wp-content/uploads/2025/11/Digital-India-White.svg',
  'D|/wp-content/themes/mosje/assets/images/important-links.svg',
  'D|/wp-content/themes/mosje/assets/images/close-icon-white.svg',
  'D|/wp-content/themes/mosje/assets/images/open_in_new.svg',
  'B|/v3/feedback.svg',
  'B|/v3/bhashini-logo.png',
  'C|/wp-content/uploads/2026/05/samavesh.png',
  'C|/wp-content/uploads/2026/04/Samavesh-Banner-Mobile.png',
  'C|/wp-content/uploads/2026/04/Banner-10.png',
  'C|/wp-content/uploads/2025/11/Banner-6.png',
  'C|/wp-content/uploads/2026/04/Banner-7.png',
  'C|/wp-content/uploads/2026/04/Banner-8.png',
  'C|/wp-content/uploads/2026/04/Banner-9.png',
  'C|/wp-content/uploads/2025/11/updates.png',
  'C|/wp-content/uploads/2026/04/Dr.-Virendra-Kumar.png',
  'C|/wp-content/uploads/2026/04/Shri-Ramdas-Athawale.png',
  'C|/wp-content/uploads/2026/04/sri-l-b-verma.png',
  'C|/wp-content/uploads/2025/11/schemes-768x768.jpg',
  'C|/wp-content/uploads/2026/04/portal-banner-images.png',
  'C|/wp-content/uploads/2026/04/Beneficiary.png',
  'C|/wp-content/uploads/2025/11/Government-Official.png',
  'C|/wp-content/uploads/2026/04/5-234x300.jpg',
  'C|/wp-content/uploads/2026/04/4-1-300x133.jpg',
  'C|/wp-content/uploads/2026/04/3-300x251.jpg',
  'C|/wp-content/uploads/2026/04/65811748325059-300x291.jpg',
  'C|/wp-content/uploads/2025/11/data-gov.png',
  'C|/wp-content/uploads/2025/11/india-gov.png',
  'C|/wp-content/uploads/2025/11/make-in-india.png',
  'C|/wp-content/uploads/2025/11/my-gov.png',
  'C|/wp-content/uploads/2025/11/NeGD-Logo.svg',
  'C|/wp-content/uploads/2025/11/DAIC-LOGO-.png',
  'C|/wp-content/uploads/2025/11/nsfdc-1.png',
  'C|/wp-content/uploads/2025/11/Logo-NSKFDC.png',
  'C|/wp-content/uploads/2025/11/NBCFDC.png',
  'C|/wp-content/uploads/2025/11/NISD-.png',
  'C|/wp-content/uploads/2026/03/PM-AJAY-logo.png',
  'C|/wp-content/uploads/2026/02/Logo-Transgender-Portal-1.png',
  'C|/wp-content/uploads/2026/02/NOS-Logo.png',
  'C|/wp-content/uploads/2026/03/NMBA-1.png',
  'C|/wp-content/uploads/2025/11/icon-v2.png',
  'C|/wp-content/uploads/2025/11/favicon.png',
];

const ROOT = new URL('..', import.meta.url).pathname;
const dest = (rel) => join(ROOT, 'public', rel);

async function download(entry) {
  const [code, path] = entry.split('|');
  const url = ORIGINS[code] + path;
  const name = basename(path);
  const outRel = name === 'favicon.png' ? join('seo', name) : join('images', name);
  const outPath = dest(outRel);
  try {
    const res = await fetch(url, { headers: { 'User-Agent': 'Mozilla/5.0 (clone-asset-fetch)' } });
    if (!res.ok) return { url, ok: false, status: res.status };
    const buf = Buffer.from(await res.arrayBuffer());
    await mkdir(dirname(outPath), { recursive: true });
    await writeFile(outPath, buf);
    return { out: outRel, ok: true, bytes: buf.length };
  } catch (e) {
    return { url, ok: false, error: String(e.message || e) };
  }
}

// batched parallel (4 at a time)
const results = [];
for (let i = 0; i < ASSETS.length; i += 4) {
  const batch = await Promise.all(ASSETS.slice(i, i + 4).map(download));
  results.push(...batch);
  for (const r of batch) {
    console.log(r.ok ? `  ok  ${r.out} (${r.bytes}b)` : `  FAIL ${r.url} ${r.status || r.error}`);
  }
}
const ok = results.filter((r) => r.ok).length;
console.log(`\nDownloaded ${ok}/${results.length} assets.`);
const fails = results.filter((r) => !r.ok);
if (fails.length) console.log('Failures:', JSON.stringify(fails, null, 2));
