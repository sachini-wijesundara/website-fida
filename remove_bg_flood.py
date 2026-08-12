from PIL import Image
import sys

def remove_bg_floodfill(input_path, output_path):
    img = Image.open(input_path).convert("RGBA")
    width, height = img.size
    pixels = img.load()
    
    # Target color to replace (white background)
    # We allow a small tolerance in case it's not perfectly 255,255,255 everywhere
    # But usually generated images with pure white prompt are exactly 255
    
    # We will use a BFS queue to find all contiguous white pixels from the corners
    queue = []
    visited = set()
    
    # Add corners to queue
    corners = [(0,0), (width-1,0), (0,height-1), (width-1,height-1)]
    for c in corners:
        queue.append(c)
        visited.add(c)
        
    def is_white_ish(color):
        return color[0] > 245 and color[1] > 245 and color[2] > 245
        
    while queue:
        x, y = queue.pop(0)
        
        current_color = pixels[x, y]
        if is_white_ish(current_color):
            pixels[x, y] = (255, 255, 255, 0) # Make transparent
            
            # Check neighbors
            for dx, dy in [(0,1), (1,0), (0,-1), (-1,0)]:
                nx, ny = x + dx, y + dy
                if 0 <= nx < width and 0 <= ny < height:
                    if (nx, ny) not in visited:
                        visited.add((nx, ny))
                        queue.append((nx, ny))

    img.save(output_path, "PNG")

remove_bg_floodfill("public/images/robot_hand_left.png", "public/images/robot_hand_left_trans.png")
remove_bg_floodfill("public/images/robot_hand_right.png", "public/images/robot_hand_right_trans.png")
print("Done flood fill")
