from sqlalchemy import Column, String
from database import Base

class Student(Base):

    __tablename__ = "students"

    student_id = Column(String(50), primary_key=True, index=True)

    name = Column(String(100))

    email = Column(String(150), unique=True)

    password = Column(String(100))

    image_path = Column(String(255))