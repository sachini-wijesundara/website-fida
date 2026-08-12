from PIL import Image

img = Image.open("public/images/robot_hand_right.png").convert("RGBA")
width, height = img.size
pixels = img.load()

corners = [(0,0), (width-1,0), (0,height-1), (width-1,height-1)]
for c in corners:
    print(f"Corner {c}: {pixels[c[0], c[1]]}")
