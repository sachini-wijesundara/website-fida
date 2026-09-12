const { Jimp } = require('jimp');
const fs = require('fs');

async function generate() {
  console.log("Downloading earth mask...");
  const image = await Jimp.read('https://unpkg.com/three-globe@2.45.2/example/img/earth-water.png');
  
  const width = image.bitmap.width; 
  const height = image.bitmap.height;

  const dots = [];
  const latStep = Math.PI / 100; // 100 rows
  
  for (let lat = -Math.PI / 2 + latStep/2; lat < Math.PI / 2; lat += latStep) {
    const r = Math.cos(lat);
    const circumference = 2 * Math.PI * r;
    const numLon = Math.floor(circumference / latStep);
    if (numLon === 0) continue;
    
    const lonStep = (2 * Math.PI) / numLon;
    for (let lon = -Math.PI; lon < Math.PI; lon += lonStep) {
      
      const x = Math.cos(lat) * Math.sin(lon);
      const y = Math.sin(lat);
      const z = Math.cos(lat) * Math.cos(lon);

      let u = (lon + Math.PI) / (2 * Math.PI);
      let v = (-lat + Math.PI/2) / Math.PI;

      const px = Math.floor(u * width);
      const py = Math.floor(v * height);
      
      if (px >= 0 && px < width && py >= 0 && py < height) {
        const color = image.getPixelColor(px, py);
        const red = (color >> 24) & 255;
        if (red < 128) { // Land
          dots.push([
            Math.round(x*1000)/1000,
            Math.round(y*1000)/1000,
            Math.round(z*1000)/1000
          ]);
        }
      }
    }
  }

  const dest = 'src/components/home/globe-dots.json';
  fs.writeFileSync(dest, JSON.stringify(dots));
  console.log(`Generated ${dots.length} grid dots and saved to ${dest}.`);
}

generate().catch(console.error);
