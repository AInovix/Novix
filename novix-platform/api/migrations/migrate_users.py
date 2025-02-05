import psycopg2
from datetime import datetime

def migrate():
    conn = psycopg2.connect(os.getenv("DB_URI"))
    with conn.cursor() as cur:
        cur.execute("""
            INSERT INTO users (username)
            VALUES (%s)
        """, ("admin",))
    conn.commit()

def rollback():
    conn = psycopg2.connect(os.getenv("DB_URI"))
    with conn.cursor() as cur:
        cur.execute("DELETE FROM users WHERE username = 'admin'")
    conn.commit()
