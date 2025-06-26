const db=require('../module/db.js');
const code= require('../utils/statuscode.js');
const deleteFile= require('../utils/deleteFile.js');

const {productValidation,productUpdateThingValidation} = require('../utils/validation.js');



async function addProductController(req, res) {
    const { name, description, price, stock, Categoryname} = req.body;

    const { error } = productValidation(req.body);
    if (error) return res.status(400).json({ message: code(400), error: error.details[0].message });

    let [result]=await db.execute(`
        SELECT * FROM Category WHERE name = ?;
    `, [Categoryname]);

    if(result.length === 0) return res.status(404).json({ message: code(404) });

    const image_url=req.protocol+"://"+req.header("host")+"/"+req.file.path;

    [result] = await db.execute(`
        INSERT INTO Product (name, description, price, stock, category_id, image_url)
        VALUES (?, ?, ?, ?, ?, ?);
    `, [name, description, price, stock, result[0].id, image_url]);

    if (result.affectedRows === 0) return res.status(500).json({ message: code(500) });

    res.status(201).json({ message: code(201)});

}

async function getAllProductsController(req, res) {
    const {sorting=true,page=1,pagesize=12,minprice=20,maxprice=600000000/*200*/,search,categoryId}=req.query;
    const limit=(page-1)*pagesize;//offset limit  limit pagesize
    let sort='DESC';
    if(sorting)
        sort='ASC';

    let result;

const newsearch=`%${search}%`;

if(search) {
    [result]=await db.query(`
    SELECT * FROM Product
    WHERE (name LIKE ?
    OR stock LIKE ?
    OR description LIKE ?)
    AND price BETWEEN ? AND ?
    ORDER BY price ${sort}
    LIMIT ? OFFSET ?;
    `,[newsearch,newsearch,newsearch,minprice,maxprice,+pagesize,limit]);
}else if(categoryId){
  [result]=await db.query(`
    SELECT * FROM Product
    WHERE category_id=?
    ORDER BY price ${sort}
    LIMIT ? OFFSET ?;
    `,[categoryId,+pagesize,limit]);
} else {
    [result]=await db.query(`
    SELECT * FROM Product
    WHERE price BETWEEN ? AND ?
    ORDER BY price ${sort}
    LIMIT ? OFFSET ?;
    `,[minprice,maxprice,+pagesize,limit]);
}


    if(result.length===0)return res.status(404).json({message:"not found there products"});
    

    return res.status(200).json(result);
}




async function getProductController(req, res) {
        const {id}=req.params;
        
        const [result]=await db.execute("SELECT * FROM Product WHERE id = ?",[+id]);

        if(result.length===0)return res.status(404).json({message:"not found this product"})

        return res.status(200).json({product:result[0]});
}



async function updateProductController(req, res) {    
    const {name, description, price, stock, Categoryname } = req.body;

    const { error } = productValidation(req.body);
    if (error) return res.status(400).json({ message: code(400), error: error.details[0].message });

    let [result]=await db.execute(`
        SELECT * FROM Category WHERE name = ?;
    `, [Categoryname]);

    if(result.length === 0) return res.status(404).json({ message: code(404) });
    
    [result]=await db.execute(`
        SELECT * FROM Product WHERE id=?`,[req.params.id]);
        
    if(result.length === 0) return res.status(404).json({ message: code(404) });
    
    deleteFile(result[0].image_url.split("\\")[1]);

    const image_url=req.protocol+"://"+req.header("host")+"/"+req.file.path;

    [result] = await db.execute(`
        UPDATE Product SET name=? , description=? ,  price = ? , stock= ? ,category_id = ?, image_url=?
        WHERE id=?;
    `, [name, description, price, stock, result[0].id, image_url,+req.params.id]);

    if (result.affectedRows === 0) return res.status(500).json({ message: code(500) });

    res.status(201).json({ message: code(201)});
}



async function updateThingInProductController(req,res){
        const { name, description, price, stock, Categoryname } = req.body;

    const { error } = productUpdateThingValidation(req.body);
    if (error) return res.status(400).json({ message: code(400), error: error.details[0].message });

    let result;
    let newFeild;
    let value;

    if(Categoryname){
        [result]=await db.execute(`
            SELECT * FROM Category WHERE name = ?;
            `, [Categoryname]);
    
        if(result.length === 0) return res.status(404).json({ message: code(404) });
    }

        if(name){
                newFeild="name= ?";
                value=name;
        }else if (description){
                newFeild="description= ?";
                value=description;
        }else if(price){
            newFeild="price= ?";
            value=price;
        }else if(stock){
            newFeild="stock= ?";
            value=stock;
        } 
        else if(Categoryname){
            newFeild="category_id= ?";
            value=result[0].id;
        }

        const QUERE=`UPDATE Product SET 
        ${newFeild}
        WHERE id=?;
        `;

    [result] = await db.execute(QUERE, [value,+req.params.id]);

    if (result.affectedRows === 0) return res.status(500).json({ message: code(500) });

    res.status(201).json({ message: code(201)});
}


async function updateImageProduct(req,res){
    if(!req.file)return res.status(400).json({message:"send file please"});

    const [result]=await db.query(`
       SELECT * FROM Product WHERE id=?`,[req.params.id]);

    if(result.length===0)return res.status(404).json({message:"not found this product"});

    deleteFile(result[0].image_url.split("\\")[1]);

    const image_url=req.protocol+"://"+req.header("host")+"/"+req.file.path;
    
    await db.query(`
        UPDATE Product SET image_url=? WHERE id=?`,[image_url,req.params.id])
    
    res.status(200).json({message:"done update it"});
}

async function deleteProductController(req, res) {

    let [result]=await db.query("SELECT * FROM Product WHERE id=?",[req.params.id]);
    
    if(result.length===0)return res.status(404).json({message:"not can delete this product is not here"});

    deleteFile(result[0].image_url.split("\\")[1]);
    
    [result]=await db.query("DELETE FROM Product WHERE id = ? ",[+req.params.id]);
    
    if(result.affectedRows===0)return res.status(500).json({message:code(500)});

    res.status(200).json({message:"product deleted"});
}



module.exports = {
    addProductController,
    getAllProductsController,
    getProductController,
    updateProductController,
    deleteProductController,
    updateThingInProductController,
    updateImageProduct
};


