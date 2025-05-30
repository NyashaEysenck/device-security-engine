# create_admin.py

import getpass
from pymongo import MongoClient
from passlib.context import CryptContext
import os
from dotenv import load_dotenv

# Load environment variables (for MONGODB_URI)
load_dotenv()

MONGODB_URI = os.getenv("MONGODB_URI", "mongodb://localhost:27017/")
DB_NAME = "muchengeti"  # Change if your DB name is different

client = MongoClient(MONGODB_URI)
db = client[DB_NAME]
users_collection = db["users"]

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def get_password_hash(password):
    return pwd_context.hash(password)

def main():
    username = input("Enter admin username: ").strip()
    if users_collection.find_one({"username": username}):
        print("User already exists!")
        return
    password = getpass.getpass("Enter admin password: ")
    password2 = getpass.getpass("Confirm password: ")
    if password != password2:
        print("Passwords do not match.")
        return
    user_doc = {
        "username": username,
        "password_hash": get_password_hash(password),
        "role": "admin"
    }
    users_collection.insert_one(user_doc)
    print(f"Admin user '{username}' created successfully.")

if __name__ == "__main__":
    main()