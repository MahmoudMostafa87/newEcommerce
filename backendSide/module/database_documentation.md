
# 📑 Database Tables Documentation

## 🧑‍💼 Table: `user`
| Attribute     | Type        | Description                         |
|---------------|-------------|-------------------------------------|
| `id`          | INT (PK)    | Unique identifier for each user     |
| `name`        | VARCHAR     | Full name of the user               |
| `email`       | VARCHAR     | Email address (must be unique)      |
| `password`    | VARCHAR     | Hashed password                     |
| `created_at`  | TIMESTAMP   | Account creation timestamp          |

---

## 🛒 Table: `cart`
| Attribute     | Type        | Description                         |
|---------------|-------------|-------------------------------------|
| `id`          | INT (PK)    | Unique identifier for the cart      |
| `user_id`     | INT (FK)    | ID of the user owning the cart      |
| `is_paid`     | BOOLEAN     | Payment status of the cart          |
| `created_at`  | TIMESTAMP   | Time when the cart was created      |

---

## 📦 Table: `cart_items`
| Attribute     | Type        | Description                              |
|---------------|-------------|------------------------------------------|
| `id`          | INT (PK)    | Unique identifier for the cart item      |
| `cart_id`     | INT (FK)    | Associated cart ID                       |
| `product_id`  | INT (FK)    | Associated product ID                    |
| `quantity`    | INT         | Number of units for this product         |
| `price`       | DECIMAL     | Price at the time of adding to cart      |

---

## 🏷️ Table: `category`
| Attribute     | Type        | Description                              |
|---------------|-------------|------------------------------------------|
| `id`          | INT (PK)    | Unique identifier for the category       |
| `name`        | VARCHAR     | Category name (e.g., Electronics, Books) |

---

## 🛍️ Table: `product`
| Attribute         | Type        | Description                                  |
|-------------------|-------------|----------------------------------------------|
| `id`              | INT (PK)    | Unique identifier for the product            |
| `name`            | VARCHAR     | Product name                                 |
| `description`     | TEXT        | Detailed product description                 |
| `price`           | DECIMAL     | Current product price                        |
| `image_url`       | VARCHAR     | URL of the product image                     |
| `category_id`     | INT (FK)    | Linked category ID                           |
| `user_id`         | INT (FK)    | Seller user ID                               |
| `commission_rate` | DECIMAL     | Commission percentage taken by the platform |

---

## ❤️ Table: `save_product`
| Attribute     | Type        | Description                              |
|---------------|-------------|------------------------------------------|
| `id`          | INT (PK)    | Unique identifier                        |
| `user_id`     | INT (FK)    | User who saved the product               |
| `product_id`  | INT (FK)    | Saved product ID                         |

---

## 💳 Table: `payment`
| Attribute         | Type        | Description                               |
|-------------------|-------------|-------------------------------------------|
| `id`              | INT (PK)    | Unique payment identifier                  |
| `user_id`         | INT (FK)    | ID of the user who made the payment        |
| `cart_id`         | INT (FK)    | Associated cart ID                         |
| `amount`          | DECIMAL     | Total amount paid                          |
| `currency`        | VARCHAR     | Currency used (e.g., USD, EGP)             |
| `status`          | VARCHAR     | Payment status (e.g., COMPLETED, FAILED)   |
| `payment_method`  | VARCHAR     | Method used (PayPal, Card, etc.)           |
| `paypal_order_id` | VARCHAR     | PayPal Order ID                            |
| `created_at`      | TIMESTAMP   | Payment creation timestamp                 |
