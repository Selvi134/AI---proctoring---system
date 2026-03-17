from pydantic import BaseModel


class StudentSignup(BaseModel):

    name: str
    email: str
    password: str
    image: str


class StudentLogin(BaseModel):

    student_id: str
    password: str