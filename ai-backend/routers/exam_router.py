from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
import crud, models, schemas
from database import SessionLocal

router = APIRouter()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.post("/exams", response_model=schemas.ExamResponse)
def create_new_exam(exam: schemas.ExamCreate, admin_id: str, db: Session = Depends(get_db)):
    # Check if exam code already exists
    existing = crud.get_exam_by_code(db, exam.exam_code)
    if existing:
        # If it exists, just return it (or update it, but for now return existing)
        return existing
    return crud.create_exam(db, exam, admin_id)

@router.post("/exams/{exam_id}/questions", response_model=schemas.QuestionResponse)
def add_question_to_exam(exam_id: int, question: schemas.QuestionCreate, db: Session = Depends(get_db)):
    return crud.create_question(db, question, exam_id)

@router.get("/exams/code/{exam_code}", response_model=schemas.ExamResponse)
def get_exam_info(exam_code: str, db: Session = Depends(get_db)):
    exam = crud.get_exam_by_code(db, exam_code)
    if not exam:
        raise HTTPException(status_code=404, detail="Exam not found")
    return exam

@router.get("/exams/{exam_id}/questions", response_model=List[schemas.QuestionResponse])
def get_exam_questions(exam_id: int, db: Session = Depends(get_db)):
    return crud.get_questions_by_exam(db, exam_id)

@router.post("/results", response_model=schemas.ResultResponse)
def submit_exam_result(result: schemas.ResultCreate, student_id: str, db: Session = Depends(get_db)):
    return crud.create_result(db, result, student_id)

@router.get("/results/exam/{exam_id}", response_model=List[schemas.ResultResponse])
def get_exam_results(exam_id: int, db: Session = Depends(get_db)):
    return crud.get_results_by_exam(db, exam_id)

@router.get("/results/all", response_model=List[schemas.ResultResponse])
def get_all_student_results(db: Session = Depends(get_db)):
    return crud.get_all_results(db)
