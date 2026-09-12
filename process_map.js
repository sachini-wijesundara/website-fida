const { Jimp } = require('jimp');

async function processImage() {
  const inputPath = '/Users/sachiniwijesundara/.gemini/antigravity-ide/brain/a13d53ad-71c8-4d2c-91c0-1d1c86be39d0/dotted_earth_map_1789019113573.jpg';
  const outputPath = '/Users/sachiniwijesundara/fida-website /FIDA-global-site/public/spinning_earth_map.png';

  console.log("Loading image...");
  const image = await Jimp.read(inputPath);
  
  const w = image.bitmap.width;
  const h = image.bitmap.height;
  
  let minX = w, minY = h, maxX = 0, maxY = 0;
  
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const idx = (w * y + x) << 2;
      const r = image.bitmap.data[idx];
      const g = image.bitmap.data[idx + 1];
      const b = image.bitmap.data[idx + 2];
      
      if (r < 240 && g < 240 && b < 240) {
        if (x < minX) minX = x;
        if (x > maxX) maxX = x;
        if (y < minY) minY = y;
        if (y > maxY) maxY = y;
      }
    }
  }
  
  const cropW = maxX - minX + 1;
  const cropH = maxY - minY + 1;
  const gap = Math.floor(cropW * 0.1); 
  const tileW = cropW + gap;
  const outW = tileW * 2;
  const outH = cropH;
  
  const outImage = new Jimp({ width: outW, height: outH });
  
  for (let y = 0; y < cropH; y++) {
    for (let x = 0; x < cropW; x++) {
      const idxIn = (w * (minY + y) + (minX + x)) << 2;
      const r = image.bitmap.data[idxIn];
      const g = image.bitmap.data[idxIn + 1];
      const b = image.bitmap.data[idxIn + 2];
      
      let alpha = 0;
      if (r < 240 && g < 240 && b < 240) {
        alpha = 255; 
      }
      
      const idxOut1 = (outW * y + x) << 2;
      outImage.bitmap.data[idxOut1] = 150;
      outImage.bitmap.data[idxOut1 + 1] = 150;
      outImage.bitmap.data[idxOut1 + 2] = 150;
      outImage.bitmap.data[idxOut1 + 3] = alpha;
      
      const idxOut2 = (outW * y + (x + tileW)) << 2;
      outImage.bitmap.data[idxOut2] = 150;
      outImage.bitmap.data[idxOut2 + 1] = 150;
      outImage.bitmap.data[idxOut2 + 2] = 150;
      outImage.bitmap.data[idxOut2 + 3] = alpha;
    }
  }
  
  await outImage.write(outputPath);
  console.log("Processed image saved to " + outputPath);
}

processImage().catch(console.error);
