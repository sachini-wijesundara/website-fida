from PIL import Image
import sys

def remove_bg_floodfill(input_path, output_path):
    img = Image.open(input_path).convert("RGBA")
    width, height = img.size
    pixels = img.load()
    
    queue = []
    visited = set()
    
    corners = [(0,0), (width-1,0), (0,height-1), (width-1,height-1)]
    for c in corners:
        queue.append(c)
        visited.add(c)
        
    def is_white_ish(color):
        return color[0] > 220 and color[1] > 220 and color[2] > 220
        
    while queue:
        x, y = queue.pop(0)
        
        current_color = pixels[x, y]
        if is_white_ish(current_color):
            pixels[x, y] = (255, 255, 255, 0)
            
            for dx, dy in [(0,1), (1,0), (0,-1), (-1,0)]:
                nx, ny = x + dx, y + dy
                if 0 <= nx < width and 0 <= ny < height:
                    if (nx, ny) not in visited:
                        visited.add((nx, ny))
                        queue.append((nx, ny))

    img.save(output_path, "PNG")

remove_bg_floodfill("public/images/stylus_left_raw.png", "public/images/stylus_left.png")
print("Done flood fill for left arm")
remove_bg_floodfill("public/images/stylus_right_raw.png", "public/images/stylus_right.png")
print("Done flood fill for right arm")
