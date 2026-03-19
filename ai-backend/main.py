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
from sqlalchemy import text

# Create tables
Base.metadata.create_all(bind=engine)

# Programmatic fix for missing columns
with engine.connect() as conn:
    try:
        # Check if exam_code exists in students
        result = conn.execute(text("SHOW COLUMNS FROM students LIKE 'exam_code'"))
        if not result.fetchone():
            print("Adding missing 'exam_code' column to 'students' table...")
            conn.execute(text("ALTER TABLE students ADD COLUMN exam_code VARCHAR(50)"))
            conn.commit()

        # Check if trust_score exists in results
        result = conn.execute(text("SHOW COLUMNS FROM results LIKE 'trust_score'"))
        if not result.fetchone():
            print("Adding missing 'trust_score' column to 'results' table...")
            conn.execute(text("ALTER TABLE results ADD COLUMN trust_score INT DEFAULT 100"))
            conn.commit()
            print("Successfully updated database schema.")
    except Exception as e:
        print(f"Schema update notice: {e}")

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # More permissive for debugging
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
        raise HTTPException(status_code=400, detail="Email already registered")
    student_id = generate_student_id()
    image_path = save_student_face(student_id, student.image)
    crud.create_student(db, student, student_id, image_path)
    send_student_email(student.email, student_id)
    return {"message": "Signup successful", "student_id": student_id}

@app.post("/student-login")
def login(data: schemas.StudentLogin, db: Session = Depends(get_db)):
    student = crud.get_student_by_id(db, data.student_id)
    if not student:
        raise HTTPException(status_code=404, detail="Student not found")
    if student.password != data.password:
        raise HTTPException(status_code=401, detail="Wrong password")
    return {"message": "Login successful"}

def generate_admin_id():
    return "ADM-" + str(random.randint(1000, 9999))

@app.post("/admin-signup")
def admin_signup(admin: schemas.AdminSignup, db: Session = Depends(get_db)):
    existing = crud.get_admin_by_email(db, admin.email)
    if existing:
        raise HTTPException(status_code=400, detail="Admin email already registered")
    admin_id = generate_admin_id()
    crud.create_admin(db, admin, admin_id)
    return {"message": "Admin signup successful", "admin_id": admin_id}

@app.post("/admin-login")
def admin_login(data: schemas.AdminLogin, db: Session = Depends(get_db)):
    admin = crud.get_admin_by_id(db, data.admin_id)
    if not admin:
        raise HTTPException(status_code=404, detail="Admin not found")
    if admin.password != data.password:
        raise HTTPException(status_code=401, detail="Wrong password")
    return {"message": "Admin login successful"}

# Include Routers
from routers import login_router, signup_router, exam_router, proctoring_router

app.include_router(login_router.router)
app.include_router(signup_router.router)
app.include_router(exam_router.router)
app.include_router(proctoring_router.router)