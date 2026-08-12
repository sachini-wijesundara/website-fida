from PIL import Image

def crop_transparent(input_path, output_path):
    img = Image.open(input_path).convert("RGBA")
    bbox = img.getbbox()
    if bbox:
        img_cropped = img.crop(bbox)
        img_cropped.save(output_path, "PNG")
        print(f"Cropped {input_path} to {bbox}")
    else:
        print(f"Image {input_path} is completely empty!")

crop_transparent("public/images/robot_hand_left_isolated.png", "public/images/robot_hand_left_cropped.png")
crop_transparent("public/images/robot_hand_right_isolated2.png", "public/images/robot_hand_right_cropped.png")
