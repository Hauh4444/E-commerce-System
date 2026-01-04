import stripe
from app.config import Config
from app.orders import OrdersRepository

orders_repo = OrdersRepository()

stripe.api_key = Config.STRIPE_SECRET_KEY
FRONTEND_URL = Config.FRONTEND_URL


def create_stripe_session_with_rollback(user_id: str, order_id: str, items: list) -> str:
    try:
        session = stripe.checkout.Session.create(
            payment_method_types=["card"],
            line_items=[
                {
                    "price_data": {
                        "currency": item.currency.lower(),
                        "product_data": {"name": item.product_name},
                        "unit_amount": int(item.amount * 100),
                    },
                    "quantity": item.quantity,
                }
                for item in items
            ],
            mode="payment",
            success_url=f"{FRONTEND_URL}/?checkout_complete=true",
            cancel_url=f"{FRONTEND_URL}/cart",
            locale="en",
        )
        if not session.url:
            orders_repo.delete_order(user_id=user_id, order_id=order_id)
            raise Exception("Stripe session creation failed: no URL returned.")

        return session.url

    except stripe.error.StripeError as e:
        orders_repo.delete_order(user_id=user_id, order_id=order_id)
        raise Exception(f"Stripe error: {str(e)}")