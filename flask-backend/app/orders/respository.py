from datetime import datetime

from app.extensions.mongo import get_mongo_db, parse_object_id


class OrdersRepository:
    def __init__(self):
        pass

    @property
    def db(self):
        return get_mongo_db()

    @property
    def orders(self):
        return self.db.orders

    def get_orders_for_user(self, user_id: str):
        return list(self.orders.find({"user_id": parse_object_id(user_id)}).sort("created_at", -1))

    def get_order_by_id(self, user_id: str, order_id: str):
        return self.orders.find_one({"_id": parse_object_id(order_id), "user_id": parse_object_id(user_id)})

    def create_order(self, user_id: str, product_ids: list[str], name: str, address: str):
        product_ids = product_ids or []
        list_data = {
            "user_id": parse_object_id(user_id),
            "product_ids": [parse_object_id(pid) for pid in product_ids],
            "name": name,
            "address": address,
            "created_at": datetime.now(),
            "updated_at": datetime.now()
        }
        inserted_id = self.orders.insert_one(list_data).inserted_id
        return self.orders.find_one({"_id": inserted_id})

    def delete_order(self, user_id: str, order_id: str):
        result = self.orders.delete_one({"_id": parse_object_id(order_id), "user_id": parse_object_id(user_id)})
        return result.deleted_count > 0