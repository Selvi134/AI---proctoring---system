import models


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
        image_path=image_path
    )

    db.add(db_student)

    db.commit()

    db.refresh(db_student)

    return db_student