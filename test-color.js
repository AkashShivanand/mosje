const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto('http://localhost:3007/design-system');
  
  const color = await page.evaluate(() => {
    const btn = Array.from(document.querySelectorAll('a.ds-btn')).find(a => a.textContent.includes('Explore Foundations'));
    return btn ? window.getComputedStyle(btn).color : null;
  });
  console.log("Button text color:", color);

  const matchedRules = await page.evaluate(() => {
    const btn = Array.from(document.querySelectorAll('a.ds-btn')).find(a => a.textContent.includes('Explore Foundations'));
    if (!btn) return [];
    
    // Just a quick way to find which rule gives color
    // This is hard to do precisely in pure JS without devtools protocol, but let's check
    return btn.className;
  });
  console.log("Button className:", matchedRules);

  await browser.close();
})();
