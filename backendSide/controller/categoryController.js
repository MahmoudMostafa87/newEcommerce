const db=require("../module/db");
const code=require("../utils/statuscode");
const joi=require("joi");

async function createCategory(req, res) {
    const { name } = req.body;
        const {error}=joi.string().min(3).max(30).required().validate(name);
        if(error)return res.status(400).json({status:code(400), error: error.details[0].message });
       
        let [result]=await db.query('SELECT * FROM Category WHERE name = ?', [name])
        if(result.length > 0)return res.status(400).json({ status: code(400), error: 'Category already exists' });

        [result] = await db.query('INSERT INTO Category (name) VALUES (?)', [name]);

        if (result.affectedRows === 0) throw new Error('Failed to create category');

        res.status(201).json({ id: result.insertId, name });
}

async function getAllCategories(req, res) {
        const [rows] = await db.query('SELECT * FROM Category');
        if(rows.length===0)return res.status(404).json({ error:code(404) });
        res.status(200).json(rows);
}

async function getCategoryById(req, res) {
        const [rows] = await db.query('SELECT * FROM Category WHERE id = ?', [req.params.id]);
        if (rows.length === 0) return res.status(404).json({ error: 'Category not found' });
        res.status(200).json(rows[0]);
}

async function getProductsFromSpcificCategory(req, res) {
    const {id}=req.params;//or name
    const [result]=await db.query(`
        SELECT P.* FROM Product P
        JOIN Category C 
        ON C.id=P.category_id and C.id = ?
        `,[id]);

        if(result.length===0||!result)return res.status(404).json({message:"not found any category or not found products"});

        res.status(200).json(result);
}

async function updateCategory(req, res) {
    const { name } = req.body;
    const {error}=joi.string().min(3).max(30).required().validate(name, { abortEarly: false });
    if(error)return res.status(400).json({status:code(400), error: error.details[0].message });

    let [result] = await db.query('SELECT * FROM Category WHERE name = ? AND id <> ?', [name, req.params.id]);
    if (result.length > 0) return res.status(400).json({ status: code(400), error: 'Category name already exists' });
        
    [result] = await db.query('UPDATE Category SET name = ? WHERE id = ?', [name, req.params.id]);
    if (result.affectedRows === 0) return res.status(404).json({ error: 'Category not found' });
        
    res.status(200).json({ id: +req.params.id, name });

}

async function deleteCategory(req, res) {
    const [rows] = await db.query('SELECT * FROM Category WHERE id = ?', [req.params.id]);
    if (rows.length === 0) return res.status(404).json({ error: 'Category not found' });
    
    let [result]=db.query(`SELECT * FROM Products
        WHERE category_id=?`,[rows[0].id]);
    
    if (result.length !== 0) return res.status(409).json({ error: 'this cagtegory have products not can delete it'});
    
    [result] = await db.query('DELETE FROM Category WHERE id = ?', [req.params.id]);
    if (result.affectedRows === 0) return res.status(404).json({ error: 'Category not found' });
        
    res.status(200).json({ message: 'Category deleted' });
}


module.exports={
    createCategory,
    getAllCategories,
    getCategoryById,
    updateCategory,
    deleteCategory,
    getProductsFromSpcificCategory
}