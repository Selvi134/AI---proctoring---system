import pymysql

# Database connection details
user = "root"
password = "afnan@123"
host = "localhost"
port = 3306
db_name = "ai_db"

try:
    connection = pymysql.connect(
        host=host,
        user=user,
        password=password,
        database=db_name,
        port=port
    )

    with connection.cursor(pymysql.cursors.DictCursor) as cursor:
        print("\n--- EXAMS ---")
        cursor.execute("SELECT * FROM exams")
        exams = cursor.fetchall()
        for e in exams:
            print(e)
            
        print("\n--- QUESTIONS ---")
        cursor.execute("SELECT * FROM questions")
        questions = cursor.fetchall()
        for q in questions:
            print(q)

except Exception as e:
    print(f"Error checking database: {e}")
finally:
    if 'connection' in locals() and connection.open:
        connection.close()
