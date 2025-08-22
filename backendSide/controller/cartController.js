const db=require("../module/db");
const joi=require("joi");

async function createCard(req,res){
        
    let [result]=await db.query("SELECT * FROM Cart WHERE user_id=? ",[req.user.id]);
    if(result.length)return res.status(400).json({message:"not can create card"});
    
    [result]=await db.query("INSERT INTO Cart(user_id) VALUES (?);",[req.user.id]);
    

    if(result.affectedRows===0)return res.status(500).json({message:"Not can create card"});


    res.status(201).json({message:"create card"});
}


//كل مهنضيف عنصر فى الcart هنحسب الsum بتاع الcart_item ونضيفه فى الCart لان هو دة الtotal ألجديد
async function addProductInCard(req,res) {
    let {quantity,productid}=req.body;

    //validate data
    const {error}=joi.object({
      quantity:joi.number().integer().min(0).max(1000).required(),
      productid:joi.number().integer().min(1).required()
    }).validate(req.body);

    if(error)return res.status(400).json({message:error.details[0].message});

    let [result]=await db.query(`SELECT * FROM Cart WHERE user_id = ? AND is_paid=0`,[req.user.id]);

    //create card if not found then store it in card varibales
    if(result.length===0){
      //not done delete card and add product 
      await db.execute(`
        INSERT INTO  Cart(user_id)
            VALUES (?);
            `,[req.user.id]);
          
        [result]=await db.query("SELECT * FROM Cart WHERE user_id=?",[req.user.id]);
    }

    const card=result[0];

    //check product is found or not and 
    [result]=await db.query("SELECT * FROM Product WHERE id = ?",[productid]);
    
    if(result.length===0)return res.status(404).json({message:"not found this product"});
    
    const product=result[0];

    //get card_product have the same product id and card id
    //check if product id add it in  cart againe will mack product in cart add quantity only
    //other wise will add new product in cart by Cart_item table's 
    [result] =await db.query(`SELECT * FROM Cart_item WHERE product_id=? AND cart_id=?`,[productid,card.id]);

    if(result.length===1){
    //will get product and update stock then update product in quantity

    const cartproduct_In_card=result[0];


      //change product stock's in table and update it base on quantity
    if(product.stock<quantity){
      [result]=await db.query("UPDATE Product SET stock=? WHERE id = ?",[0,productid]);
      quantity=product.stock;
    }
    else
        [result]=await db.query("UPDATE Product SET stock=? WHERE id = ?",[(product.stock-quantity),productid]);    


        //now change quantity in card_product
        cartproduct_In_card.quantity+=quantity;

      await db.query(`
        UPDATE Cart_item 
        SET quantity=? 
        WHERE id=?`,[cartproduct_In_card.quantity,cartproduct_In_card.id]);

    }else{

      // change product stock's base on quantity
    if(product.stock<quantity){
      [result]=await db.query("UPDATE Product SET stock=? WHERE id = ?",[0,productid]);
      quantity=product.stock;
    }
    else
        [result]=await db.query("UPDATE Product SET stock=? WHERE id = ?",[(product.stock-quantity),productid]);    
      
      //create product_item entity and add card id in here and product too and add in it quantity
      [result]=await db.execute(`INSERT INTO Cart_item(cart_id,product_id,quantity) VALUES (?,?,?)`,[card.id,product.id,quantity])
    }
    //can calculation total price now or in create order endpoint
    // db.query(`SELECT sum() FROM `)


  res.status(201).json({message:"add product in card"});
};



async function getProductsInCard(req,res){

//will return server internal error because system database
  const [result]=await db.query(`
    SELECT Cart.id,Cart_item.product_id,Product.name,Product.price,Product.image_url,Cart_item.quantity
    FROM Cart_item
    JOIN Cart ON Cart.id=Cart_item.cart_id
    JOIN Product ON Product.id=Cart_item.product_id
    WHERE Cart.user_id=? AND Cart.is_paid=0
    `,[req.user.id]);

  if(result.length===0)return res.status(404).json({message:"card is empty"});

  res.status(200).json(result);
};



async function updatequantity(req,res){
 let {quantity,productid}=req.body;

    //validate data
    const {error}=joi.object({
      quantity:joi.number().integer().min(-10).max(100).required(),
      productid:joi.number().integer().min(1).required()
    }).validate(req.body);

    if(error)return res.status(400).json({message:error.details[0].message});

  let [result]=await db.query(`
    SELECT * FROM Cart_item
    WHERE product_id=?;
    
    SELECT * FROM Product
    WHERE id=?;
    `,[productid,productid]);


    if(result[0].length===0||result[1].length===0)return res.status(404).json({message:"not found this product in card"});

    //stock 
    let stock=result[1][0].stock;
    stock-=quantity;
    
    //add quantity quantity maby be example +3 or -3
    quantity+=result[0][0].quantity;
    
    if(quantity<0||stock<0)return res.status(400).json({message:"you limit quantity or stock "});

    //no chang
    [result]=await db.query(`
      UPDATE Cart_item
      SET quantity=?
      WHERE product_id=?;

      UPDATE Product
      SET stock =?
      WHERE id=?;
    
    `,[quantity,productid,stock,productid]);
      
    [result]=await db.query(`
      SELECT Product.stock,Cart_item.quantity FROM Cart_item 
      JOIN Product ON Product.id=Cart_item.product_id
      and Product.id=?`,[productid]);
    
      //لو المنتج الكمية بتعته صفر هنمسحه
      [result]=await db.query(`SELECT * FROM Cart_item WHERE product_id=?`,[productid]);
      if(result[0].quantity===0){
        db.query(`DELETE FROM Cart_item WHERE product_id=?`,[productid])
      }

      res.status(200).json({message:"done updated"});
};

async function deleteProductFromCard(req,res){
 const {productid}=req.body;

 let [result]=await db.query(`SELECT * FROM Cart_item
  WHERE product_id=?;
  `,[productid]);

    if(result.length===0)return res.status(400).json({message:"not can delete product is not in card"});

  //retreve quantitiy for stock again

    const productCard=result[0];
   
    [result]=await db.query(`SELECT * FROM Product WHERE id=?`,[productid]);
   
    await db.execute(`UPDATE Product SET stock=? WHERE id=?`,[(productCard.quantity+result[0].stock),productid]);
   
    await db.execute("DELETE FROM Cart_item WHERE product_id=?",[productid]);

    res.status(200).json({message:"delete this item is sucessfuly"});
};



module.exports = {
  addProductInCard,
  createCard,
  deleteProductFromCard,
  getProductsInCard,
  updatequantity
};


