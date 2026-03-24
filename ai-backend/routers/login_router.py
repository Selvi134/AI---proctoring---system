import base64
import os
import uuid
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from database import SessionLocal
from models import Student, Exam
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
    exam_code = data["exam_code"]

    student = db.query(Student).filter(
        Student.student_id == student_id
    ).first()

    if not student:

        return {"status": "student_not_found"}

    if student.password != password:
        return {"status": "wrong_password"}

    # --- NEW: VALIDATE EXAM CODE ---
    exam = db.query(Exam).filter(Exam.exam_code == exam_code).first()
    if not exam:
        return {"status": "invalid_exam_code"}

    student.exam_code = exam_code
    db.commit()

    return {"status": "success"}