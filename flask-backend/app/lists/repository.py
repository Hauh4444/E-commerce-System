from datetime import datetime

from app.extensions.mongo import get_mongo_db, parse_object_id


class ListsRepository:
    def __init__(self):
        pass

    @property
    def db(self):
        return get_mongo_db()

    @property
    def lists(self):
        return self.db.lists

    def get_lists_for_user(self, user_id: str):
        return list(self.lists.find({"user_id": parse_object_id(user_id)}).sort("created_at", -1))

    def create_list(self, user_id: str, name: str, product_ids: list[str] = None):
        product_ids = product_ids or []
        list_data = {
            "user_id": parse_object_id(user_id),
            "name": name,
            "product_ids": [parse_object_id(pid) for pid in product_ids],
            "created_at": datetime.now(),
            "updated_at": datetime.now()
        }
        inserted_id = self.lists.insert_one(list_data).inserted_id
        return self.lists.find_one({"_id": inserted_id})

    def get_list_by_id(self, user_id: str, list_id: str):
        return self.lists.find_one({"_id": parse_object_id(list_id), "user_id": parse_object_id(user_id)})

    def update_list(self, user_id: str, list_id: str, updates: dict):
        updates["updated_at"] = datetime.now()
        result = self.lists.update_one({"_id": parse_object_id(list_id), "user_id": parse_object_id(user_id)}, {"$set": updates})
        if result.matched_count == 0:
            return None
        return self.lists.find_one({"_id": parse_object_id(list_id)})

    def add_product(self, user_id: str, list_id: str, product_id: str):
        result = self.lists.update_one(
            {"_id": parse_object_id(list_id), "user_id": parse_object_id(user_id)},
            {"$addToSet": {"product_ids": parse_object_id(product_id)}, "$set": {"updated_at": datetime.now()}}
        )
        if result.matched_count == 0:
            return None
        return self.lists.find_one({"_id": parse_object_id(list_id)})

    def remove_product(self, user_id: str, list_id: str, product_id: str):
        result = self.lists.update_one(
            {"_id": parse_object_id(list_id), "user_id": parse_object_id(user_id)},
            {"$pull": {"product_ids": parse_object_id(product_id)}, "$set": {"updated_at": datetime.now()}}
        )
        if result.matched_count == 0:
            return None, False
        return self.lists.find_one({"_id": parse_object_id(list_id)}), result.modified_count > 0

    def delete_list(self, user_id: str, list_id: str):
        result = self.lists.delete_one({"_id": parse_object_id(list_id), "user_id": parse_object_id(user_id)})
        return result.deleted_count > 0
