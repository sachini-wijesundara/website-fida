const { createCanvas } = require('canvas');
const fs = require('fs');

const width = 4096;
const height = 2048;
const canvas = createCanvas(width, height);
const ctx = canvas.getContext('2d');

// Transparent background
ctx.clearRect(0, 0, width, height);

// Draw grid of tiny dots
const rows = 120;
const cols = 240;

// To make the world map, we just need a rough approximation, or we can use a perlin noise / simple image data approach.
// Even better, I can just load the AI map and redraw it with tiny dots!
