

✅ ملخص عام:
قاعدة البيانات مصممة للعمل كسوق إلكتروني يحتوي على بائعين ومنتجات ومشترين.

كل سلة يمكن أن تحتوي منتجات من بائعين مختلفين.

الدفع يتم دفعة واحدة للموقع، ثم يتم توزيع الأرباح داخليًا على البائعين.

أرباح كل بائع تُسجل في balance ويمكنه سحبها عن طريق Payouts API.


## 👤 جدول: `users`

| اسم الحقل      | النوع                | الوصف الفني                 | وظيفة الحقل بالعربي                                   |
| -------------- | -------------------- | --------------------------- | ----------------------------------------------------- |
| `id`           | INT (PK)             | معرف فريد للمستخدم          | رقم تعريفي لكل مستخدم لا يتكرر                        |
| `name`         | VARCHAR(30)          | اسم المستخدم (فريد)         | اسم المستخدم الذي يظهر للآخرين                        |
| `email`        | VARCHAR(40)          | البريد الإلكتروني (فريد)    | البريد الذي يستخدمه المستخدم لتسجيل الدخول            |
| `paypal_email` | VARCHAR(100)         | بريد PayPal الخاص بالمستخدم | يستخدم لتحويل الأرباح من الموقع للمستخدم              |
| `password`     | TEXT                 | كلمة مرور مشفرة             | يتم استخدامها لتسجيل الدخول والتحقق من الهوية         |
| `role`         | ENUM('admin','user') | نوع المستخدم                | يحدد ما إذا كان المستخدم مسؤول (admin) أو مستخدم عادي |
| `blanace`      | DECIMAL(10,2)        | الرصيد المتاح للمستخدم      | أرباح المستخدم من بيع المنتجات                        |
| `image_url`    | TEXT                 | رابط صورة المستخدم          | صورة الملف الشخصي للمستخدم                            |
| `create_at`    | TIMESTAMP            | تاريخ إنشاء الحساب          | متى تم تسجيل هذا المستخدم في الموقع                   |

---

## 📂 جدول: `category`

| اسم الحقل   | النوع       | الوصف الفني         | وظيفة الحقل بالعربي                    |
| ----------- | ----------- | ------------------- | -------------------------------------- |
| `id`        | INT (PK)    | معرف فريد للتصنيف   | رقم تعريفي لكل تصنيف منتجات            |
| `name`      | VARCHAR(30) | اسم التصنيف (فريد)  | مثل: إلكترونيات، ملابس، أدوات منزلية   |
| `create_at` | TIMESTAMP   | تاريخ إنشاء التصنيف | تاريخ إضافة التصنيف إلى قاعدة البيانات |

---

## 📦 جدول: `product`

| اسم الحقل         | النوع         | الوصف الفني                      | وظيفة الحقل بالعربي                          |
| ----------------- | ------------- | -------------------------------- | -------------------------------------------- |
| `id`              | INT (PK)      | معرف فريد للمنتج                 | رقم تعريفي لا يتكرر لكل منتج                 |
| `user_id`         | INT (FK)      | معرف البائع                      | يربط المنتج بالمستخدم (البائع) الذي أضافه    |
| `category_id`     | INT (FK)      | التصنيف التابع له المنتج         | لتحديد نوع المنتج                            |
| `name`            | VARCHAR(255)  | اسم المنتج (فريد)                | الاسم الظاهر للمنتج                          |
| `stock`           | INT           | الكمية المتاحة في المخزون        | عدد الوحدات المتوفرة للبيع                   |
| `price`           | DECIMAL(10,2) | السعر لكل وحدة من المنتج         | السعر المعروض للشراء                         |
| `description`     | TEXT          | وصف مفصل للمنتج                  | لتوضيح التفاصيل والمميزات                    |
| `image_url`       | TEXT          | رابط صورة المنتج                 | يستخدم لعرض صورة المنتج في الواجهة           |
| `rating`          | INT           | التقييم العام للمنتج (افتراضي 0) | يُظهر تقييم المشترين للمنتج                  |
| `commission_rate` | DECIMAL(10,2) | نسبة العمولة المقتطعة من الموقع  | مثلاً 10 تعني 10% يذهب للموقع والباقي للبائع |
| `create_at`       | TIMESTAMP     | تاريخ إضافة المنتج               | متى تم إدراج المنتج في قاعدة البيانات        |

---

## 💾 جدول: `save_product`

| اسم الحقل    | النوع     | الوصف الفني              | وظيفة الحقل بالعربي                        |
| ------------ | --------- | ------------------------ | ------------------------------------------ |
| `id`         | INT (PK)  | معرف فريد لحفظ المنتج    | كل مرة يتم فيها حفظ منتج من قبل مستخدم     |
| `user_id`    | INT (FK)  | المستخدم الذي حفظ المنتج | يربط بين المستخدم والمنتج المحفوظ          |
| `product_id` | INT (FK)  | المنتج الذي تم حفظه      | يدل على المنتج المحفوظ                     |
| `create_at`  | TIMESTAMP | تاريخ الحفظ              | متى قام المستخدم بحفظ هذا المنتج في قائمته |

---

## 🛒 جدول: `cart`

| اسم الحقل    | النوع         | الوصف الفني                   | وظيفة الحقل بالعربي                       |
| ------------ | ------------- | ----------------------------- | ----------------------------------------- |
| `id`         | INT (PK)      | معرف فريد للسلة               | رقم تعريفي لكل سلة مشتريات                |
| `user_id`    | INT (FK)      | المستخدم صاحب السلة           | يربط السلة بالمستخدم الذي أضاف منتجاتها   |
| `is_paid`    | BOOLEAN       | حالة الدفع للسلة              | true = تم الدفع، false = لم يتم الدفع بعد |
| `totalPrice` | DECIMAL(10,2) | المجموع الكلي لأسعار المنتجات | السعر الإجمالي لكل المنتجات المضافة       |
| `create_at`  | TIMESTAMP     | تاريخ إنشاء السلة             | متى تم إنشاء هذه السلة                    |

---

## 🧾 جدول: `cart_item`

| اسم الحقل    | النوع     | الوصف الفني                      | وظيفة الحقل بالعربي                 |
| ------------ | --------- | -------------------------------- | ----------------------------------- |
| `id`         | INT (PK)  | معرف فريد للبند داخل السلة       | كل منتج في السلة يكون له سطر منفصل  |
| `cart_id`    | INT (FK)  | رقم السلة التي ينتمي إليها البند | يربط العنصر بالسلة الأصلية          |
| `product_id` | INT (FK)  | رقم المنتج                       | المنتج الذي أُضيف إلى السلة         |
| `quantity`   | INT       | الكمية المطلوبة من المنتج        | عدد القطع التي يريد المستخدم شرائها |
| `create_at`  | TIMESTAMP | تاريخ الإضافة                    | متى تم إضافة هذا العنصر للسلة       |

---

## 💰 جدول: `transactions`

| اسم الحقل         | النوع                                | الوصف الفني                                   | وظيفة الحقل بالعربي                                 |
| ----------------- | ------------------------------------ | --------------------------------------------- | --------------------------------------------------- |
| `id`              | INT (PK)                             | معرف فريد للمعاملة المالية                    | رقم لكل عملية مالية فريدة                           |
| `user_id`         | INT (FK)                             | المستخدم الذي قام بالعملية                    | المشتري في حالة الدفع أو البائع في حالة السحب       |
| `card_id`         | INT (FK, Nullable)                   | رقم السلة المرتبطة (إن وجدت)                  | لتحديد أي سلة ترتبط بهذه المعاملة (في حالة الدفع)   |
| `type`            | ENUM('PAYMENT', 'WITHDRAWAL')        | نوع المعاملة: دفع أو سحب                      | تحدد إذا كانت العملية دفع من عميل أو سحب لبائع      |
| `amount`          | DECIMAL(10,2)                        | قيمة المعاملة المالية                         | المبلغ بالدولار (أو العملة المختارة)                |
| `currency`        | VARCHAR(10)                          | العملة المستخدمة (افتراضي USD)                | العملة التي تم الدفع بها                            |
| `status`          | ENUM('PENDING','COMPLETED','FAILED') | حالة المعاملة                                 | لتتبع نجاح أو فشل المعاملة                          |
| `paypal_order_id` | VARCHAR(255) (Nullable)              | رقم العملية في PayPal عند الدفع               | يُستخدم لتتبع العملية مع PayPal                     |
| `payout_batch_id` | VARCHAR(255) (Nullable)              | رقم الدفعة في PayPal عند إرسال الأموال للبائع | يُستخدم لتتبع عملية التحويل عند استخدام Payouts API |
| `created_at`      | TIMESTAMP                            | تاريخ تسجيل المعاملة                          | وقت تنفيذ المعاملة                                  |



-- CREATE TABLE IF NOT EXISTS Payment(
--     id INT PRIMARY KEY AUTO_INCREMENT,
--     user_id INT NOT NULL,
--     cart_id INT NOT NULL,
--     paypal_order_id VARCHAR(255),
--     amount DECIMAL(10, 2),
--     currency VARCHAR(10),
--     status ENUM('COMPLETED','PENDING'),
--     payment_method VARCHAR(50),
--     created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
--     FOREIGN KEY (user_id) REFERENCES Users(id)ON DELETE CASCADE,
--     FOREIGN KEY (cart_id) REFERENCES Cart(id)ON DELETE CASCADE
-- );

-- CREATE TABLE IF NOT EXISTS Withdrawals (
--   id INT PRIMARY KEY AUTO_INCREMENT,
--   user_id INT NOT NULL,
--   amount DECIMAL(10,2) NOT NULL,
--   status ENUM('PENDING', 'COMPLETED', 'FAILED') DEFAULT 'PENDING',
--   paypal_email VARCHAR(100) NOT NULL,
--   payout_batch_id VARCHAR(100),
--   create_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
--   FOREIGN KEY (user_id) REFERENCES Users(id) ON DELETE CASCADE
-- );


1. المستخدم يضيف منتج إلى السلة (Cart & Cart_item)
2. المستخدم يضغط "الدفع"
3. السيرفر ينشئ PayPal order => /create-order
4. الفرونت يستدعي SDK من PayPal لعرض واجهة الدفع
5. المستخدم يؤكد الدفع => orderID يتم إرساله للسيرفر
6. السيرفر يستدعي PayPal Capture API
7. إذا الدفع تم بنجاح:
    - يسجل في جدول Payment
    - يستخرج كل المنتجات من السلة
    - لكل منتج:
        - يحسب العمولة
        - يضيف المبلغ إلى حساب صاحب المنتج
    - يفرغ السلة أو يعلم أنها مدفوعة

POST /api/paypal/create-order
// returns { orderID }

POST /api/paypal/capture-order
// يرسل orderID، ثم يسجل الدفع، ويحدث رصيد البائع

