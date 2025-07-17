const {
    // client, // هذا هو PayPalHttpClient المهيأ
    // generateAccessToken,
    // OrdersCreateRequest, // نستورد دالة البناء مباشرة
    // OrdersCaptureRequest // نستورد دالة البناء مباشرة
} = require("../utils/paymentMethod");
const db=require("../module/db");
const axios = require('axios');



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


//1 create order where is_paid false and it userid==req.user.id
//2 get all 


async function createOrder(req, res){
//   const { cartId } = req.body;

  let [result]=await db.query(`SELECT * FROM Cart WHERE is_paid=0 AND user_id=?`,[req.user.id]);

  if(result.length===0)return res.status(404).send("not can found any items");

  const [cartItems] = await db.query(`
    SELECT SUM(p.price * c.quantity) AS TotalPrice
    FROM Cart_item c
    JOIN Product p ON p.id = c.product_id
    WHERE c.cart_id = ?
  `, [result[0].id]);

  if (cartItems.length === 0) return res.status(400).json({ message: "Cart is empty" });
 const accessToken = await generateAccessToken();

  const response = await axios.post(
    `${baseURL}/v2/checkout/orders`,
    {
      intent: "CAPTURE",
      purchase_units: [
        {
          amount: {
            currency_code: "USD",
            value: cartItems[0].TotalPrice,
          },
        },
      ],
      application_context: {
        return_url: "http://localhost:4000/transactions/success",
        cancel_url: "http://localhost:4000/transactions/cancel",
      },
    },
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
    }
  );

  // const response = await client.execute(request);
    const approvalUrl = response.data.links.find((link) => link.rel === "approve").href;
    if (!approvalUrl) 
        return res.status(500).json({ message: "Failed to get PayPal approval URL." });
    
  db.execute(`UPDATE Cart SET totalPrice=? WHERE id=?`,[cartItems[0].TotalPrice,result[0].id])
    res.redirect(approvalUrl);
};



async function successPayMent(req,res) {
  const token = req.query.token;
  const accessToken = await generateAccessToken();

  const response = await axios.post(
    `${baseURL}/v2/checkout/orders/${token}/capture`,
    {},
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
    }
  );

  res.render("success", { details: response.data });
}

//do loop on price and quantity for each product in cart to send balance for user but with reduce the commection *
//do join between cart_item and card and product *
//get from cart_item quantity and product get from it price and commition rating *
//mack is_paid true and create Transmation by cart and user id *
//update loop for each user have balance *
//operate commision_rate for website is const presient *
//commision_rate in data base is discount on product *
// price * (1 - (commission rating / 100)) *

async function captureOrder(req, res){
  const {orderId,cartId} = req.body;


    // const [[{cartId}]]=await db.query(`SELECT max(id) as id FROM Cart WHERE user_id=?`,[req.user.id])

    const request = new OrdersCaptureRequest(orderId);
    request.requestBody({});
    console.log(request);
    const capture = await client.execute(request);
    const captureStatus = capture.result.status;

  if (captureStatus !== "COMPLETED") {
    return res.status(400).json({ message: "Payment not completed" });
  }

  const [cartItems] = await db.query(`
    SELECT 
    ci.quantity * p.price AS amount ,
    p.user_id AS sellerId,
    p.commission_rate as commission  
    FROM Cart_item ci
    JOIN Product p ON p.id=ci.product_id
    JOIN Cart c ON c.id=ci.cart_id
    WHERE c.id=?
  `, [cartId]);

  
  if (!cartItems.length) return res.status(400).json({ message: "Cart is empty" });

  console.log(cartItems[0]);

    //1. add balance for each seller
    cartItems.forEach(async (cartItem) => {
        const sellerAmount = cartItem.amount * (1 - cartItem.commission/100);

        await db.execute(`UPDATE Users SET balance=balance + ? WHERE id=?`,[sellerAmount,cartItem.sellerId]);
    });

  // 2. Update cart as paid
  await db.query(`UPDATE Cart SET is_paid = 1 WHERE id = ?`, [cartId]);

    const [card]=await db.query(`SELECT * FROM Cart WHERE id=?`,[cartId]);
  
    // 3. Create transaction
  
    await db.query(`
    INSERT INTO Transactions (user_id, cart_id, type, amount, currency, status, paypal_order_id)
    VALUES (?, ?, 'PAYMENT', ?, 'USD', 'COMPLETED', ?)
  `, [req.user.id, cartId, card[0].totalPrice, orderId]);

  res.status(200).json({ message: "Payment captured and sellers credited" });
};





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


//get paypal_email for send monye
async function withdraw (req, res){
  const {paypal_email} = req.body;

  const [[user]] = await db.query(`SELECT balance, paypal_email FROM Users WHERE id = ?`, [req.user.id]);

  if (!user || user.balance <= 0) {
    return res.status(400).json({ message: "Insufficient balance" });
  }

  if (!user.paypal_email) {
    return res.status(400).json({ message: "No PayPal email associated with this account" });
  }

  console.log(typeof user.balance,user.balance);
//   const amountToSend = user.balance.toFixed(2);

//payout to send for user
  const accessToken = await generateAccessToken();

    const payoutData = {
      sender_batch_header: {
        sender_batch_id: `PAYOUT_${Date.now()}`,
        email_subject: "You have a payout!",
        email_message: "You have received a payout from our marketplace.",
      },
      items: [
        {
          recipient_type: "EMAIL",
          amount: {
            value: user.balance,
            currency: "USD",
          },
          receiver: paypal_email,
          note: "Thank you for using our platform!",
          sender_item_id: `USER_${user.id}`,
        },
      ],
    };

    const payoutResponse = await axios.post(
      'https://api-m.sandbox.paypal.com/v1/payments/payouts',
      payoutData,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      }
    );

    const payoutBatchId = payoutResponse.data.batch_header.payout_batch_id;

  // Reset balance
  await db.query(`UPDATE Users SET balance = 0 WHERE id = ?`, [req.user.id]);

  // Save transaction
  await db.query(`
    INSERT INTO Transactions (user_id, type, amount, currency, status, payout_batch_id)
    VALUES (?, 'WITHDRAWAL', ?, 'USD', 'COMPLETED', ?)
  `, [req.user.id, user.balance, payoutBatchId]);

  res.status(200).json({
    message: `Withdraw of $${user.balance} completed to PayPal email: ${user.paypal_email}`,
  });
};




module.exports={
    getAllTransactions,
    getMyTransactions,
    getSpcificTransaction,
    captureOrder,
    createOrder,
    withdraw,
    successPayMent
}



//وانا بأكد عمليه الدفع اغير عمليه الis_paid ل true فى Card وكمان بعمل entity جديد اسمه من جدول المعاملات
// برقم الكارت ورقم الuser ونوع العمليه والكمية الى هحسبها من الcard بس هنا فى مشكلة
// وهي اني لم اودي الفلوس للى باع اوديها ازاي ما ممكن يكون فى اكتر من بائع باع منتج والمتسخدم ضافه فى الكارت
// كل دول فلوسهم هترجع لهم بلووب هتلف على جدول الuser بس عشان تعدل قيمه الblance هنا فى مشكلة 
// ازاي اجيب المستخدم المنتج والكميه من جدول الcartItem وبعد كدة اضيف الكميه فى المتغير واحسب نسبتي الى فى جدول المنتجات واعدل قيمه المستخد الى رفع المنتج من جدول المنتجات نفس المنتج الى جبت النسبه منه