const puppeteer = require('puppeteer');
(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  page.on('console', msg => console.log('LOG:', msg.text()));
  await page.goto('http://localhost:3000');
  await new Promise(r => setTimeout(r, 5000));
  
  const data = await page.evaluate(() => {
    const canvas = document.querySelector('canvas');
    if (!canvas) return 'NO CANVAS';
    return canvas.toDataURL();
  });
  console.log("Canvas data starts with:", data.substring(0, 100));
  await browser.close();
})();
