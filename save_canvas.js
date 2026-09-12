const puppeteer = require('puppeteer');
const fs = require('fs');
(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto('http://localhost:3000');
  await new Promise(r => setTimeout(r, 5000));
  
  const data = await page.evaluate(() => {
    const canvas = document.querySelector('canvas');
    if (!canvas) return null;
    return canvas.toDataURL().split(',')[1];
  });
  if (data) {
    fs.writeFileSync('test_canvas.png', Buffer.from(data, 'base64'));
    console.log("Saved test_canvas.png");
  }
  await browser.close();
})();
