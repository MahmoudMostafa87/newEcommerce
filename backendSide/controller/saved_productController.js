const db=require("../module/db");
const joi=require("joi");

async function savedProduct(req,res){
    
    const {error}=joi.number().integer().required().validate(req.body.productId);
    if(error)return res.status(400).send(error.details[0].message);

    const [result]=await db.query(`SELECT * FROM Save_product
        WHERE user_id=? AND product_id=?`,[req.user.id,req.body.productId]);

    if(result.length!==0)return res.status(400).json({message:"thid product is added it already"});
    
    await db.execute(`INSERT INTO Save_product(user_id,product_id)
        VALUES (?,?);`,[req.user.id,req.body.productId]);

    res.status(201).json({message:"successful saved it"});
}

async function getProductSaved(req,res){
    const [result]=await db.query(`SELECT * FROM Save_product
        WHERE user_id=?;`,[req.user.id]);
    
        if(result.length===0)return res.status(404).json({message:"not found products"});
        
        res.status(200).json(result);
} 

async function deleteProductSaved(req,res){
    const [result]=await db.query(`SELECT * FROM Save_product
        WHERE user_id=? AND id=?;`,[req.user.id,+req.params.id]);
    
        if(result.length===0)return res.status(404).json({message:"not found product"});
        
    await db.query(`DELETE FROM Save_product 
        WHERE id=?`,[+req.params.id]);
    
    res.status(200).json({message:"deleted it"});
} 



module.exports={
    savedProduct,
    getProductSaved,
    deleteProductSaved
}

