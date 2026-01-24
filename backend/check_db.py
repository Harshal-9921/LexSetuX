import sqlite3

conn = sqlite3.connect('legal_ai.db')
cursor = conn.cursor()

print("=== Lawyers in Database ===")
cursor.execute("SELECT COUNT(*) FROM lawyers")
count = cursor.fetchone()[0]
print(f"Total lawyers: {count}")

cursor.execute("SELECT id, user_id, specialization, experience_years, location, rating FROM lawyers")
rows = cursor.fetchall()
for row in rows:
    print(f"ID: {row[0]}, User ID: {row[1]}, Spec: {row[2]}, Exp: {row[3]}, Location: {row[4]}, Rating: {row[5]}")

print("\n=== Users (Lawyers) ===")
cursor.execute("SELECT id, full_name, role FROM users WHERE role='lawyer'")
rows = cursor.fetchall()
for row in rows:
    print(f"ID: {row[0]}, Name: {row[1]}, Role: {row[2]}")

conn.close()
