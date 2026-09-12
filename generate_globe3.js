const fs = require('fs');

// A highly stylized, hand-tuned ASCII world map designed specifically to look 
// beautiful and recognizable at low dot densities.
const worldMap = [
  "                                                                ",
  "         ##        ##               ##### ##                    ",
  "       #####     ######            ##########                   ",
  "      ########  ########         ##############       #         ",
  "     ####################       #################    ###        ",
  "     ####################       ##################  #####       ",
  "      ###################       #########################       ",
  "       #################         #######################        ",
  "        ###############          ######################         ",
  "         #############             ###################          ",
  "          ###########              ##################           ",
  "           #########               #################            ",
  "            #######                 ###############             ",
  "             #####                  ##############              ",
  "              ###                    ############               ",
  "              ###                     ##########                ",
  "               ##                     #########                 ",
  "               ##                      #######          ##      ",
  "               ##                       #####          ####     ",
  "                #                       ####           ####     ",
  "                #                        ##             ##      ",
  "                                         #                      ",
  "                                                                ",
  "                                                                ",
  "                                                                ",
  "                                                                ",
  "                                                                ",
  "                                                                ",
  "                                                                ",
  "                                                                ",
  "                                                                ",
  "                                                                "
];

const mapWidth = 64;
const mapHeight = 32;

const dots = [];
const gridSize = 45;

for (let r = 0; r < gridSize; r++) {
  for (let c = 0; c < gridSize; c++) {
    const nx = (c / (gridSize - 1)) * 2 - 1;
    const ny = (r / (gridSize - 1)) * 2 - 1;
    const r2 = nx * nx + ny * ny;
    
    if (r2 >= 0.98) continue;
    
    const nz = Math.sqrt(1 - r2);
    
    const lon = Math.atan2(nx, nz);
    const lat = Math.asin(-ny); 
    
    // Scale longitude to fit the ASCII map's visible hemisphere nicely
    let u = (lon / (Math.PI / 1.8)) * 0.5 + 0.5;
    let v = (-lat / (Math.PI / 2)) * 0.5 + 0.5;
    
    const mapX = Math.floor(u * mapWidth);
    const mapY = Math.floor(v * mapHeight);
    
    if (mapY >= 0 && mapY < mapHeight && mapX >= 0 && mapX < mapWidth) {
      if (worldMap[mapY][mapX] === '#') {
        dots.push({
          left: (c / (gridSize - 1)) * 100,
          top: (r / (gridSize - 1)) * 100,
        });
      }
    }
  }
}

fs.writeFileSync('dots.json', JSON.stringify(dots));
console.log(`Generated ${dots.length} stylized continent dots.`);
