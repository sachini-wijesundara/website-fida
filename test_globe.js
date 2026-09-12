const { Jimp } = require('jimp');

async function test() {
  const image = await Jimp.read('https://unpkg.com/three-globe@2.45.2/example/img/earth-water.png');
  const width = image.bitmap.width; 
  const height = image.bitmap.height; 

  const gridSize = 45; 
  
  let grid = Array(gridSize).fill().map(() => Array(gridSize).fill(' '));

  for (let r = 0; r < gridSize; r++) {
    for (let c = 0; c < gridSize; c++) {
      const nx = (c / (gridSize - 1)) * 2 - 1;
      const ny = (r / (gridSize - 1)) * 2 - 1;
      const r2 = nx * nx + ny * ny;
      
      if (r2 >= 0.98) continue; 
      
      const nz = Math.sqrt(1 - r2);
      const lon = Math.atan2(nx, nz);
      const lat = Math.asin(-ny); 
      
      let adjustedLon = lon + 0.17; 
      
      let u = (adjustedLon + Math.PI) / (2 * Math.PI);
      if (u < 0) u += 1;
      if (u > 1) u -= 1;
      
      let v = (-lat + Math.PI/2) / Math.PI;
      
      const px = Math.floor(u * width);
      const py = Math.floor(v * height);
      
      if (px >= 0 && px < width && py >= 0 && py < height) {
        const color = image.getPixelColor(px, py);
        const red = (color >> 24) & 255;
        if (red > 128) {
           grid[r][c] = '#';
        }
      }
    }
  }

  for (let r = 0; r < gridSize; r++) {
    console.log(grid[r].join(''));
  }
}
test().catch(console.error);
