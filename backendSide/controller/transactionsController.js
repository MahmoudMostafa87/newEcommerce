const stripe= require('stripe')(process.env.SECURTY_KEY);
const db=require("../module/db");
const axios = require('axios');
const logger = require('../startup/logging');

//بعدها اعمل الwebhook
//وظبط الصفحات الfront
async function addPayment(req, res){
  const {cardId}=req.body;

  
  let [result]=await db.query(`SELECT * FROM Cart WHERE is_paid=0 AND user_id=?`,[req.user.id]);

  if(result.length===0)return res.status(404).send("not can found any items");

  const [cartItems] = await db.query(`
    SELECT SUM(p.price * c.quantity) AS TotalPrice
    FROM Cart_item c
    JOIN Product p ON p.id = c.product_id
    WHERE c.cart_id = ?
  `, [result[0].id]);

  if (cartItems.length === 0) return res.status(400).json({ message: "Cart is empty" });

    const [cardProductsForPayPal]=await db.query(`
      SELECT CI.quantity,P.name,P.price FROM Cart_item CI 
      JOIN Cart C ON C.id=CI.cart_id AND CI.card_id=?
      JOIN Product P ON CI.product_id=P.id
      WHERE C.user_id=? AND C.is_paid=0;`,[cardId,req.user.id]);

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    line_items: cardProductsForPayPal.map(item => ({
      price_data: {
        currency: 'sar',
        product_data: { name: item.name },
        unit_amount: item.price * 100,
      },
      quantity: item.quantity,
    })),
    mode: 'payment',
    success_url: 'https://yourdomain.com/success',
    cancel_url: 'https://yourdomain.com/cart',
  });
  
  await db.execute(`UPDATE Cart SET totalPrice=? WHERE id=?`,[cartItems[0].TotalPrice,result[0].id])

  res.status(200).json({ sessionId: session.id });
};


async function webhook(req,res){
  const sig = req.headers['stripe-signature'];
  const endpointSecret = 'WEBHOOK_SECRET_FROM_STRIPE'; // موجود في Stripe Dashboard

    let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
  } catch (err) {
    logger.error('❌ Webhook signature verification failed.', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
}

    if (event.type === 'checkout.session.completed') {
    const session = event.data.object;

    console.log("✅ الدفع ناجح لجلسة: ", session.id);
  }

    res.status(200).json({message:'Received'});
}


//do loop on price and quantity for each product in cart to send balance for user but with reduce the commection *
//do join between cart_item and card and product *
//get from cart_item quantity and product get from it price and commition rating *
//mack is_paid true and create Transmation by cart and user id *
//update loop for each user have balance *
//operate commision_rate for website is const presient *
//commision_rate in data base is discount on product *
// price * (1 - (commission rating / 100)) *

async function confirmPayment(req, res){
  const {cartId} = req.body;


    
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
    VALUES (?, ?, 'PAYMENT', ?, 'sar', 'COMPLETED', ?)
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
const {pagesize=12,page=1}=req.query;
    const limit=(page-1)*pagesize;
    let result;
    
      [result]=await db.query(`SELECT description,amount,created_at FROM Transactions
            WHERE user_id=?
            ORDER BY id
            LIMIT ? OFFSET ? `,[req.user.id,+pagesize,+limit]);

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
    withdraw,
    addPayment,
    confirmPayment,
    webhook
}



//وانا بأكد عمليه الدفع اغير عمليه الis_paid ل true فى Card وكمان بعمل entity جديد اسمه من جدول المعاملات
// برقم الكارت ورقم الuser ونوع العمليه والكمية الى هحسبها من الcard بس هنا فى مشكلة
// وهي اني لم اودي الفلوس للى باع اوديها ازاي ما ممكن يكون فى اكتر من بائع باع منتج والمتسخدم ضافه فى الكارت
// كل دول فلوسهم هترجع لهم بلووب هتلف على جدول الuser بس عشان تعدل قيمه الblance هنا فى مشكلة 
// ازاي اجيب المستخدم المنتج والكميه من جدول الcartItem وبعد كدة اضيف الكميه فى المتغير واحسب نسبتي الى فى جدول المنتجات واعدل قيمه المستخد الى رفع المنتج من جدول المنتجات نفس المنتج الى جبت النسبه منه