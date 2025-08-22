const db = require("../module/db");
const Joi = require("joi");

async function savedProduct(req, res) {
  const schema = Joi.object({
    productId: Joi.number().integer().required()
  });

  const { error } = schema.validate(req.body);
  if (error) return res.status(400).json({ message: error.details[0].message });

  const [[product]] = await db.query("SELECT * FROM Product WHERE id = ?;", [req.body.productId]);
  if (!product) return res.status(404).json({ message: "لم يتم العثور على المنتج." });

  const [[saved]] = await db.query(
    "SELECT * FROM Save_product WHERE user_id = ? AND product_id = ?",
    [req.user.id, req.body.productId]
  );
  if (saved) return res.status(400).json({ message: "المنتج مضاف بالفعل للمفضلة." });

  await db.execute(
    "INSERT INTO Save_product(user_id, product_id) VALUES (?, ?)",
    [req.user.id, req.body.productId]
  );

  res.status(201).json({ message: "تمت الإضافة إلى المفضلة بنجاح." });
}

async function getProductSaved(req, res) {
  const [result] = await db.query(`
    SELECT sp.id AS saved_id, p.*
    FROM Save_product sp
    JOIN Product p ON sp.product_id = p.id
    WHERE sp.user_id = ?
  `, [req.user.id]);

  if (result.length === 0) return res.status(200).json([]);
  res.status(200).json(result);
}

async function deleteProductSaved(req, res) {
  const [[saved]] = await db.query(
    "SELECT * FROM Save_product WHERE user_id = ? AND product_id = ?",
    [req.user.id, +req.params.id]
  );

  if (!saved) return res.status(404).json({ message: "لم يتم العثور على المنتج المحفوظ." });

  await db.execute("DELETE FROM Save_product WHERE id = ?", [+req.params.id]);

  res.status(200).json({ message: "تم الحذف بنجاح." });
}

module.exports = {
  savedProduct,
  getProductSaved,
  deleteProductSaved
};
