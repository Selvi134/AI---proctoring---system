from pydantic import BaseModel
import datetime


class StudentSignup(BaseModel):

    name: str
    email: str
    password: str
    image: str
    exam_code: str


class StudentLogin(BaseModel):

    student_id: str
    password: str
    exam_code: str


class AdminSignup(BaseModel):
    name: str
    email: str
    password: str


class AdminLogin(BaseModel):
    admin_id: str
    password: str

from typing import List, Optional

class QuestionCreate(BaseModel):
    question_text: str
    option1: str
    option2: str
    option3: str
    option4: str
    correct_option: int
    marks: int

class QuestionResponse(QuestionCreate):
    id: int
    exam_id: int

    class Config:
        orm_mode = True

class ExamCreate(BaseModel):
    exam_code: str
    total_time: int

class ExamResponse(BaseModel):
    id: int
    exam_code: str
    total_time: int
    admin_id: str
    
    class Config:
        orm_mode = True

class ResultCreate(BaseModel):
    exam_id: int
    score: int
    total_marks: int
    trust_score: int

class ResultResponse(BaseModel):
    id: int
    student_id: str
    exam_id: int
    score: int
    total_marks: int
    trust_score: int
    submitted_at: datetime.datetime

    class Config:
        orm_mode = True