from fastapi import FastAPI, Depends, HTTPException
from sqlalchemy.orm import Session
from fastapi.middleware.cors import CORSMiddleware

import random

import models
import schemas
import crud

from database import engine, SessionLocal, Base
from face_service import save_student_face
from email_service import send_student_email


Base.metadata.create_all(bind=engine)

app = FastAPI()


app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


def get_db():

    db = SessionLocal()

    try:
        yield db
    finally:
        db.close()


def generate_student_id():

    return "STU-" + str(random.randint(10000, 99999))


@app.post("/signup")

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


@app.post("/student-login")

def login(data: schemas.StudentLogin, db: Session = Depends(get_db)):

    student = crud.get_student_by_id(db, data.student_id)

    if not student:

        raise HTTPException(
            status_code=404,
            detail="Student not found"
        )

    if student.password != data.password:

        raise HTTPException(
            status_code=401,
            detail="Wrong password"
        )

    return {
        "message": "Login successful"
    }

from routers import login_router
from routers import signup_router

app.include_router(login_router.router)
app.include_router(signup_router.router)