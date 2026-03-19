from sqlalchemy import Column, String, Integer, ForeignKey, DateTime
from database import Base
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship

class Student(Base):
    __tablename__ = "students"
    student_id = Column(String(50), primary_key=True, index=True)
    name = Column(String(100))
    email = Column(String(150), unique=True)
    password = Column(String(100))
    image_path = Column(String(255))
    exam_code = Column(String(50))

class Admin(Base):
    __tablename__ = "admins"
    admin_id = Column(String(50), primary_key=True, index=True)
    name = Column(String(100))
    email = Column(String(150), unique=True)
    password = Column(String(100))

class Exam(Base):
    __tablename__ = "exams"
    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    exam_code = Column(String(50), unique=True, index=True)
    admin_id = Column(String(50), ForeignKey("admins.admin_id"))
    total_time = Column(Integer)  # Time in minutes
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    questions = relationship("Question", back_populates="exam")

class Question(Base):
    __tablename__ = "questions"
    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    exam_id = Column(Integer, ForeignKey("exams.id"))
    question_text = Column(String(500))
    option1 = Column(String(200))
    option2 = Column(String(200))
    option3 = Column(String(200))
    option4 = Column(String(200))
    correct_option = Column(Integer)  # 1, 2, 3, or 4
    marks = Column(Integer)
    exam = relationship("Exam", back_populates="questions")

class Result(Base):
    __tablename__ = "results"
    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    student_id = Column(String(50), ForeignKey("students.student_id"))
    exam_id = Column(Integer, ForeignKey("exams.id"))
    score = Column(Integer)
    total_marks = Column(Integer)
    trust_score = Column(Integer, default=100)
    submitted_at = Column(DateTime(timezone=True), server_default=func.now())