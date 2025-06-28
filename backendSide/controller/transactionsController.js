  // confirmCard,

  
// //الشغل الدفع وكل الpayment على api دة وتعديل الcard أنه is_paid فى الapi ألى بعده
// //لو اكدنا الدفع هيروح id الدفع للfrontend عشان يرجعه تاني واكد عمليه الدفع
// async function confirmCard(req,res){
//   const {country,postcode,address,phoneNumber}=req.body;

//   const {error} =validationConfirm(req.body);
  
//   if(error)return res.status(400).json({message:error.details[0].message})
//   let [result]=await db.query(`SELECT * FROM Cart WHERE user_id=? AND state_card="pending";`,[req.user.id]);
  
//   if(result.length===0)return res.status(404).json({message:"not found this card"});
//   const card=result[0];
  
//   [result]=await db.query(`SELECT SUM(Product.price*Cart_item.quantity) AS TotalPrice FROM Product 
//     JOIN Cart_item ON Cart_item.product_id=Product.id
//     JOIN Cart ON Cart.id=Cart_item.cart_id
//     AND Cart.user_id=?
//     `,[req.user.id]);

  
  
//   await db.query(`INSERT INTO  Orders(
//     totalPrice,
//     phoneNumber,
//     address,
//     postcode,
//     country,
//     user_id) VALUES (?,?,?,?,?,?) `,[result[0].TotalPrice,phoneNumber,address,postcode,country,req.user.id]);
    
//     await db.query(`DELETE FROM Cart_item WHERE cart_id=?;
//       UPDATE Cart SET state_card="completed" WHERE user_id= ?;
//       `,[card.id,req.user.id]);


//   res.status(200).json({message:"done create order"});
//   };







async function getAllTransactions(req,res){
    const {pagesize=12,page=1,type}=req.query;
    const limit=(page-1)*pagesize;
    let result;

    if(type){
        [result]=await db.query(`SELECT * FROM Transactions
            WHERE type = ?
            ORDER BY id
            LIMIT ? OFFSET ? `,[type,+pagesize,+limit]);
    
    }else{
        [result]=await db.query(`SELECT * FROM Transactions
            ORDER BY id
            LIMIT ? OFFSET ? `,[+pagesize,+limit]);
        }
    if(result.length===0)return res.status(404).json({message:"not found"});
    
    res.status(200).json(result);
}

async function getSpcificTransaction(req,res){

        const [result]=await db.query(`SELECT * FROM Transactions
            WHERE id=?;
            `,[+req.params.id]);

            if(result.length===0)return res.status(404).json({message:"not found"});
    
    res.status(200).json(result);
}


async function getMyTransactions(req,res){
const {pagesize=12,page=1,type}=req.query;
    const limit=(page-1)*pagesize;
    let result;

    if(type){
        [result]=await db.query(`SELECT * FROM Transactions
            WHERE type = ? AND user_id=?
            ORDER BY id
            LIMIT ? OFFSET ? `,[type,req.user.id,+pagesize,+limit]);
    
    }else{
        [result]=await db.query(`SELECT * FROM Transactions
            WHERE user_id=?
            ORDER BY id
            LIMIT ? OFFSET ? `,[req.user.id,+pagesize,+limit]);
        }
    if(result.length===0)return res.status(404).json({message:"not found"});
    
    res.status(200).json(result);
}







//وانا بأكد عمليه الدفع اغير عمليه الis_paid ل true فى Card وكمان بعمل entity جديد اسمه من جدول المعاملات
// برقم الكارت ورقم الuser ونوع العمليه والكمية الى هحسبها من الcard بس هنا فى مشكلة
// وهي اني لم اودي الفلوس للى باع اوديها ازاي ما ممكن يكون فى اكتر من بائع باع منتج والمتسخدم ضافه فى الكارت
// كل دول فلوسهم هترجع لهم بلووب هتلف على جدول الuser بس عشان تعدل قيمه الblance هنا فى مشكلة 
// ازاي اجيب المستخدم المنتج والكميه من جدول الcartItem وبعد كدة اضيف الكميه فى المتغير واحسب نسبتي الى فى جدول المنتجات واعدل قيمه المستخد الى رفع المنتج من جدول المنتجات نفس المنتج الى جبت النسبه منه