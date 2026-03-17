from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
import random
import schemas
import crud

from database import SessionLocal
from face_service import save_student_face
from email_service import send_student_email

router = APIRouter()

def get_db():

    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def generate_student_id():

    return "STU-" + str(random.randint(10000, 99999))


@router.post("/signup")

def signup(student: schemas.StudentSignup, db: Session = Depends(get_db)):

    existing = crud.get_student_by_email(db, student.email)

    if existing:

        raise HTTPException(
            status_code=400,
            detail="Email already registered"
        )

    student_id = generate_student_id()

    image_path = save_student_face(student_id, student.image)

    crud.create_student(db, student, student_id, image_path)

    send_student_email(student.email, student_id)

    return {
        "message": "Signup successful",
        "student_id": student_id
    }