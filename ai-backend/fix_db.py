import pymysql
from database import DATABASE_URL

# Parse DATABASE_URL: mysql+pymysql://root:afnan%40123@localhost:3306/ai_db
# Note: %40 is @
user = "root"
password = "afnan@123"
host = "localhost"
port = 3306
db_name = "ai_db"

print(f"Connecting to database {db_name}...")

try:
    connection = pymysql.connect(
        host=host,
        user=user,
        password=password,
        database=db_name,
        port=port
    )

    with connection.cursor() as cursor:
        print("Checking if 'exam_code' exists in 'students' table...")
        cursor.execute("SHOW COLUMNS FROM students LIKE 'exam_code'")
        result = cursor.fetchone()
        
        if not result:
            print("Adding 'exam_code' column to 'students' table...")
            cursor.execute("ALTER TABLE students ADD COLUMN exam_code VARCHAR(50)")
            print("Column 'exam_code' added successfully.")
        else:
            print("Column 'exam_code' already exists.")

        connection.commit()

except Exception as e:
    print(f"Error updating database: {e}")
finally:
    if 'connection' in locals() and connection.open:
        connection.close()
        print("Connection closed.")
