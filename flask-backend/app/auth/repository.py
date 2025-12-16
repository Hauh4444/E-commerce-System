from datetime import datetime
from werkzeug.security import generate_password_hash

from app.extensions.mongo import get_mongo_db


class AuthRepository:
    def __init__(self):
        pass

    @property
    def db(self):
        return get_mongo_db()

    @property
    def users(self):
        return self.db.users

    def find_user_by_email(self, email):
        return self.users.find_one({"email": email.lower()})

    def find_user_by_id(self, user_id):
        return self.users.find_one({"_id": user_id})

    def create_user(self, name, email, password, role="customer"):
        user_data = {
            "name": name,
            "email": email.lower(),
            "password_hash": generate_password_hash(password),
            "role": role,
            "created_at": datetime.now(),
        }
        inserted_id = self.users.insert_one(user_data).inserted_id
        return self.find_user_by_id(inserted_id)

    def delete_user(self, user_id):
        return self.users.delete_one({"_id": user_id})
