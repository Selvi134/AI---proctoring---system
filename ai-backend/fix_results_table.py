import sqlite3
import os

db_path = "ai-backend/students.db"

def fix_results_table():
    if not os.path.exists(db_path):
        print(f"Database {db_path} not found.")
        return

    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()

    try:
        # Check if trust_score already exists
        cursor.execute("PRAGMA table_info(results)")
        columns = [column[1] for column in cursor.fetchall()]
        
        if "trust_score" not in columns:
            print("Adding trust_score column to results table...")
            cursor.execute("ALTER TABLE results ADD COLUMN trust_score INTEGER DEFAULT 100")
            conn.commit()
            print("Successfully added trust_score column.")
        else:
            print("trust_score column already exists.")

    except Exception as e:
        print(f"Error: {e}")
    finally:
        conn.close()

if __name__ == "__main__":
    fix_results_table()
