from datetime import datetime
from typing import List as TList

from app.extensions.mongo import get_mongo_db, parse_object_id


class ProductsRepository:
    def __init__(self):
        pass

    @property
    def db(self):
        return get_mongo_db()

    @property
    def products(self):
        return self.db.products

    def list_products(self, query: str = "", ids: TList[str] = None, limit: int = 50):
        mongo_query = {}
        if ids:
            ids_list = [parse_object_id(pid) for pid in ids]
            ids_list = [i for i in ids_list if i]
            if not ids_list:
                return []
            mongo_query["_id"] = {"$in": ids_list}
        elif query:
            mongo_query["name"] = {"$regex": query, "$options": "i"}

        return list(self.products.find(mongo_query).sort("created_at", -1).limit(limit))

    def create_product(self, product_data: dict):
        product_data.update({
            "created_at": datetime.now(),
            "updated_at": datetime.now(),
            "average_review": 0,
            "reviews": 0,
        })
        inserted_id = self.products.insert_one(product_data).inserted_id
        return self.products.find_one({"_id": inserted_id})

    def get_product_by_id(self, product_id: str):
        lookup_id = parse_object_id(product_id)
        if not lookup_id:
            return None
        return self.products.find_one({"_id": lookup_id})

    def update_product(self, product_id: str, updates: dict):
        lookup_id = parse_object_id(product_id)
        if not lookup_id:
            return None
        updates["updated_at"] = datetime.now()
        self.products.update_one({"_id": lookup_id}, {"$set": updates})
        return self.products.find_one({"_id": lookup_id})

    def delete_product(self, product_id: str):
        lookup_id = parse_object_id(product_id)
        if not lookup_id:
            return False
        result = self.products.delete_one({"_id": lookup_id})
        return result.deleted_count > 0
