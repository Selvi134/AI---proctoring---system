import models, schemas


def get_student_by_email(db, email):

    return db.query(models.Student).filter(
        models.Student.email == email
    ).first()


def get_student_by_id(db, student_id):

    return db.query(models.Student).filter(
        models.Student.student_id == student_id
    ).first()


def create_student(db, student, student_id, image_path):

    db_student = models.Student(

        student_id=student_id,
        name=student.name,
        email=student.email,
        password=student.password,
        image_path=image_path,
        exam_code=student.exam_code
    )

    db.add(db_student)

    db.commit()

    db.refresh(db_student)
    return db_student


def get_admin_by_email(db, email):
    return db.query(models.Admin).filter(
        models.Admin.email == email
    ).first()

def get_admin_by_id(db, admin_id):
    return db.query(models.Admin).filter(
        models.Admin.admin_id == admin_id
    ).first()

def create_admin(db, admin, admin_id):
    db_admin = models.Admin(
        admin_id=admin_id,
        name=admin.name,
        email=admin.email,
        password=admin.password
    )
    db.add(db_admin)
    db.commit()
    db.refresh(db_admin)
    return db_admin

# --- EXAM CRUD ---
def create_exam(db, exam: schemas.ExamCreate, admin_id: str):
    db_exam = models.Exam(
        exam_code=exam.exam_code,
        admin_id=admin_id,
        total_time=exam.total_time
    )
    db.add(db_exam)
    db.commit()
    db.refresh(db_exam)
    return db_exam

def get_exam_by_code(db, exam_code: str):
    return db.query(models.Exam).filter(models.Exam.exam_code == exam_code).first()

def get_exam_by_id(db, exam_id: int):
    return db.query(models.Exam).filter(models.Exam.id == exam_id).first()

# --- QUESTION CRUD ---
def create_question(db, question: schemas.QuestionCreate, exam_id: int):
    db_question = models.Question(
        exam_id=exam_id,
        question_text=question.question_text,
        option1=question.option1,
        option2=question.option2,
        option3=question.option3,
        option4=question.option4,
        correct_option=question.correct_option,
        marks=question.marks
    )
    db.add(db_question)
    db.commit()
    db.refresh(db_question)
    return db_question

def get_questions_by_exam(db, exam_id: int):
    return db.query(models.Question).filter(models.Question.exam_id == exam_id).all()

# --- RESULT CRUD ---
def create_result(db, result: schemas.ResultCreate, student_id: str):
    db_result = models.Result(
        student_id=student_id,
        exam_id=result.exam_id,
        score=result.score,
        total_marks=result.total_marks,
        trust_score=result.trust_score
    )
    db.add(db_result)
    db.commit()
    db.refresh(db_result)
    return db_result

def get_results_by_exam(db, exam_id: int):
    return db.query(models.Result).filter(models.Result.exam_id == exam_id).all()

def get_all_results(db):
    return db.query(models.Result).all()