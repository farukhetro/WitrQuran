from PIL import Image
import os

def remove_white_background(input_path, output_path):
    try:
        img = Image.open(input_path).convert("RGBA")
        data = img.getdata()
        
        newData = []
        for item in data:
            r, g, b, a = item
            
            # Calculate Euclidean distance from pure white (255, 255, 255)
            dist_from_white = ((255 - r)**2 + (255 - g)**2 + (255 - b)**2)**0.5
            
            # Threshold defines how far from white a pixel needs to be to remain fully opaque
            threshold = 60 
            
            if dist_from_white == 0:
                newData.append((255, 255, 255, 0))
            elif dist_from_white < threshold:
                # Create a smooth alpha transition for anti-aliasing
                alpha = int(255 * (dist_from_white / threshold))
                newData.append((r, g, b, alpha))
            else:
                newData.append(item)
                
        img.putdata(newData)
        img.save(output_path, "PNG")
        print("Background removed successfully! The image is now transparent.")
    except Exception as e:
        print(f"Error: {e}")

image_path = os.path.join("public", "floral-corner.png")
if os.path.exists(image_path):
    remove_white_background(image_path, image_path)
else:
    print(f"Could not find {image_path}. Please make sure it exists.")
