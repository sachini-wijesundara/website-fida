const { Jimp } = require('jimp');
const fs = require('fs');

async function generate() {
  console.log("Downloading image...");
  // Use a reliable equirectangular earth image
  const image = await Jimp.read('https://unpkg.com/three-globe@2.45.2/example/img/earth-water.png');
  
  const width = image.bitmap.width; // 320
  const height = image.bitmap.height; // 160

  const dots = [];
  const gridSize = 45; // 45x45 grid for the circle
  
  for (let r = 0; r < gridSize; r++) {
    for (let c = 0; c < gridSize; c++) {
      // Map grid [0, gridSize-1] to [-1, 1]
      const nx = (c / (gridSize - 1)) * 2 - 1;
      const ny = (r / (gridSize - 1)) * 2 - 1;
      const r2 = nx * nx + ny * ny;
      
      if (r2 >= 0.98) continue; // Only dots strictly inside the circular mask
      
      // Calculate 3D sphere point
      const nz = Math.sqrt(1 - r2);
      
      // Longitude: -PI/2 (left edge) to +PI/2 (right edge)
      const lon = Math.atan2(nx, nz);
      // Latitude: +PI/2 (top) to -PI/2 (bottom)
      const lat = Math.asin(-ny); 
      
      // Let's focus on Europe/Africa/Americas. 
      // We'll add an offset to longitude to rotate the earth.
      // Center longitude around 10 degrees East (0.17 radians)
      let adjustedLon = lon + 0.17; 
      
      // Normalize to 0-1 for the full earth (-PI to PI)
      let u = (adjustedLon + Math.PI) / (2 * Math.PI);
      if (u < 0) u += 1;
      if (u > 1) u -= 1;
      
      let v = (-lat + Math.PI/2) / Math.PI;
      
      const px = Math.floor(u * width);
      const py = Math.floor(v * height);
      
      if (px >= 0 && px < width && py >= 0 && py < height) {
        const color = image.getPixelColor(px, py);
        const r = (color >> 24) & 255;
        const g = (color >> 16) & 255;
        const b = (color >> 8) & 255;
        const a = color & 255;
        // In earth-water.png, water is white/transparent, land is dark.
        // Actually, earth-water.png from three-globe might be a water mask (water is white, land is black).
        // If land is dark:
        if (r < 128) {
          dots.push({
            left: (c / (gridSize - 1)) * 100,
            top: (r / (gridSize - 1)) * 100,
          });
        }
      }
    }
  }

  fs.writeFileSync('dots.json', JSON.stringify(dots));
  console.log(`Generated ${dots.length} dots.`);
}

generate().catch(console.error);
