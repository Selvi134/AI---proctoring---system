import smtplib
from email.mime.text import MIMEText

EMAIL_ADDRESS = "abcd.hello1911@gmail.com"
EMAIL_PASSWORD = "ttenklgaqnmrogvp"


def send_student_email(student_email, student_id):

    subject = "Your Student ID"

    body = f"""
Hello Student,

Your registration was successful.

Your Student ID is:

{student_id}

Use this ID for login.

Regards,
AI Exam System
"""

    msg = MIMEText(body)
    msg["Subject"] = subject
    msg["From"] = EMAIL_ADDRESS
    msg["To"] = student_email

    server = smtplib.SMTP("smtp.gmail.com", 587)
    server.starttls()
    server.login(EMAIL_ADDRESS, EMAIL_PASSWORD)
    server.send_message(msg)
    server.quit()