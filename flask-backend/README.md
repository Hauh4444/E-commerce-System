# Flask E-commerce Backend

This service provides a minimal Flask REST API for an e-commerce platform backed by MongoDB.

## Setup

1. Create and activate a virtual environment:
   ```bash
   python3 -m venv .venv
   source .venv/bin/activate
   ```
2. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
3. Configure environment variables (`MONGO_URI`, `MONGO_DB`, `JWT_SECRET_KEY`, optional Flask settings).
- `POST /auth/register` – Register and receive an access token.
- `POST /auth/login` – Authenticate and receive an access token.
4. Start the development server:
   ```bash
   flask --app app run --debug
   ```

## Available Routes

- `GET /health` – Service health check.
- `GET /products` – List products.
- `POST /products` – Create a product.
- `GET /products/<product_id>` – Retrieve a product.
- `PUT /products/<product_id>` – Update a product.
- `DELETE /products/<product_id>` – Delete a product.
- `GET /cart/<user_id>` – Retrieve a user's cart.
- `POST /cart/<user_id>/items` – Add an item to a cart.
- `PUT /cart/<user_id>/items/<item_id>` – Update a cart item.
- `DELETE /cart/<user_id>/items/<item_id>` – Remove a cart item.
- `DELETE /cart/<user_id>` – Clear a cart.
- `GET /orders` – List orders.
- `GET /orders/<order_id>` – Retrieve an order.
- `POST /orders` – Create an order.
- `PATCH /orders/<order_id>` – Update order status/metadata.
- `GET /users` – List users.
- `POST /users` – Register a user.
- `GET /users/<user_id>` – Retrieve a user.

