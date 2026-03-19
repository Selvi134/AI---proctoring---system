import base64
import os

def save_student_face(student_id, image_data):

    folder = "student_images"

    if not os.path.exists(folder):
        os.makedirs(folder)

    image_path = f"{folder}/{student_id}.png"

    if "," in image_data:
        image_data = image_data.split(",")[1]
    image_bytes = base64.b64decode(image_data)

    with open(image_path, "wb") as f:
        f.write(image_bytes)

    return image_path