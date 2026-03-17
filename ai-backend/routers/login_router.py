import base64
import os
import uuid
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from database import SessionLocal
from models import Student
from deepface import DeepFace

router = APIRouter()

IMAGE_FOLDER = "student_images"


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@router.post("/login")

def login(data: dict, db: Session = Depends(get_db)):

    student_id = data["student_id"]
    password = data["password"]
    image = data["image"]

    student = db.query(Student).filter(
        Student.student_id == student_id
    ).first()

    if not student:

        return {"status": "student_not_found"}

    if student.password != password:

        return {"status": "wrong_password"}

    login_image_path = f"{IMAGE_FOLDER}/login_{uuid.uuid4()}.jpg"

    img_data = base64.b64decode(image.split(",")[1])

    with open(login_image_path, "wb") as f:
        f.write(img_data)

    try:

        result = DeepFace.verify(
            img1_path=student.image_path,
            img2_path=login_image_path,
            enforce_detection=False
        )

        os.remove(login_image_path)

        if result["verified"]:

            return {"status": "success"}

        else:

            return {"status": "face_not_match"}

    except:

        os.remove(login_image_path)

        return {"status": "face_error"}