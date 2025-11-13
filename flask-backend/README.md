# Flask E-commerce Backend

REST API service for the Ecommerce System. The application is written in Flask, persists data in MongoDB, and issues JWT access tokens for secure client authentication.

## Requirements
- Python 3.11+
- MongoDB instance (local or managed)
- `pip` for dependency management

## Installation
```bash
cd flask-backend
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
```

## Configuration
Environment variables can be exported manually, stored in a `.env` file, or injected by your process manager.

| Variable | Description | Default |
|----------|-------------|---------|
| `MONGO_URI` | MongoDB connection string | `mongodb://localhost:27017` |
| `MONGO_DB` | Database name | `ecommerce` |
| `JWT_SECRET_KEY` | Secret used to sign JWT tokens | falls back to `FLASK_SECRET_KEY` |
| `JWT_ALGORITHM` | Signing algorithm | `HS256` |
| `JWT_ACCESS_EXPIRES_MINUTES` | Access token lifetime | `60` |
| `FLASK_DEBUG` | Enable/disable debug mode | `0` |
| `FLASK_SECRET_KEY` | Flask session secret | `change-me` |

Example local setup:
```bash
export MONGO_URI="mongodb://localhost:27017"
export MONGO_DB="ecommerce"
export JWT_SECRET_KEY="local-dev-secret"
export FLASK_DEBUG=1
```

## Running the Server
```bash
flask --app app run --debug
```
The app is served from `http://127.0.0.1:5000`. For hosted deployments, run `gunicorn "app:create_app()"` or `python app.py`.

## Project Structure
```
app/
  routes/          # Blueprint modules for products, cart, orders, users, auth
  services/        # JWT helpers
  extensions.py    # Mongo client wrapper
  config.py        # Dataclass-based configuration
app.py             # WSGI entry point
requirements.txt   # Runtime dependencies
```

## Health Check
- `GET /health` – returns `{"status": "ok"}` when the service is ready.

## Authentication
- `POST /auth/register` – Create a new user and receive a signed access token.
- `POST /auth/login` – Authenticate with email/password credentials.
Tokens are signed JWTs using the secret and expiry settings defined above. Include them as `Authorization: Bearer <token>` when extending the API with protected routes.

## Products
- `GET /products` – List products, accepts `?query=` and `?limit=` filters.
- `POST /products` – Create a product; requires `name`, `price`, `currency`.
- `GET /products/<product_id>` – Retrieve a specific product.
- `PUT /products/<product_id>` – Update product attributes.
- `DELETE /products/<product_id>` – Remove a product.

## Cart
- `GET /cart/<user_id>` – Retrieve or initialise the cart for a user.
- `POST /cart/<user_id>/items` – Add an item (requires `product_id`, `quantity`).
- `PUT /cart/<user_id>/items/<item_id>` – Update quantity or product reference.
- `DELETE /cart/<user_id>/items/<item_id>` – Remove a specific cart item.
- `DELETE /cart/<user_id>` – Clear the cart for a user.

## Orders
- `GET /orders` – Paginated list of orders (sorted by `created_at` descending).
- `GET /orders/<order_id>` – Fetch an order by identifier.
- `POST /orders` – Create an order; requires `user_id`, `items`, and `total`.
- `PATCH /orders/<order_id>` – Update `status`, `tracking_number`, or `updated_at`.

## Users
- `GET /users` – List registered users (email and role).
- `POST /users` – Create a user record with hashed password.
- `GET /users/<user_id>` – Retrieve user metadata by id.

## Local Development Tips
- Use the MongoDB shell or MongoDB Compass to inspect collections (`users`, `products`, `carts`, `orders`).
- Adjust `CORS` origins in `app/__init__.py` if serving the frontend from another domain.
- Add request validation, authentication guards, and logging hooks as you extend the API.

## Testing
Formal test suites are not included yet. Consider adding pytest with factories and MongoDB fixtures to cover critical routes (auth, products CRUD, cart lifecycle) as the service evolves.

