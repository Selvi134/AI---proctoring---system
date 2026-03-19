from sqlalchemy import text
from database import engine

def fix_mysql_results_table():
    try:
        with engine.connect() as conn:
            # Check if trust_score column exists
            result = conn.execute(text("SHOW COLUMNS FROM results LIKE 'trust_score'"))
            if not result.fetchone():
                print("Adding trust_score column to results table in MySQL...")
                conn.execute(text("ALTER TABLE results ADD COLUMN trust_score INT DEFAULT 100"))
                conn.commit()
                print("Successfully added trust_score column.")
            else:
                print("trust_score column already exists.")
    except Exception as e:
        print(f"Error updating MySQL database: {e}")

if __name__ == "__main__":
    fix_mysql_results_table()
