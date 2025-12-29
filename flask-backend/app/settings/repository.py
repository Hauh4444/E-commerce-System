from datetime import datetime

from app.extensions.mongo import get_mongo_db, parse_object_id


class SettingsRepository:
    def __init__(self):
        pass

    @property
    def db(self):
        return get_mongo_db()

    @property
    def settings(self):
        return self.db.settings

    def get_settings_for_user(self, user_id: str):
        return self.settings.find_one({"user_id": parse_object_id(user_id)})

    def create_settings(self, user_id: str):
        settings_data = {
            "user_id": parse_object_id(user_id),
            "loginAlerts": True,
            "trustedDevices": True,
            "analyticsTracking": False,
            "personalizedRecommendations": False,
            "darkMode": None,
            "compactProductLayout": False,
            "created_at": datetime.now(),
            "updated_at": datetime.now()
        }
        inserted_id = self.settings.insert_one(settings_data).inserted_id
        return self.settings.find_one({"_id": inserted_id})

    def update_settings_for_user(self, user_id: str, updates: dict):
        updates["updated_at"] = datetime.now()
        result = self.settings.update_one({"user_id": parse_object_id(user_id)}, {"$set": updates})
        if result.matched_count == 0:
            return None
        return self.settings.find_one({"user_id": parse_object_id(user_id)})