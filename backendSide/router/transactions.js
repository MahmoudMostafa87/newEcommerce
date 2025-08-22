const router=require("express").Router();
const auth=require("../middleware/auth");
const admin=require("../middleware/admin");
const validationId=require("../middleware/validationId");
const catchError=require("../utils/catchError");
const bodyParser = require('body-parser');

const {
    webhook,
    confirmPayment,
    getAllTransactions,
    getMyTransactions,
    getSpcificTransaction,
    withdraw,
    addPayment
}=require("../controller/transactionsController");

router.param("id",validationId);

router.use(auth);


router.get("/",admin,catchError(getAllTransactions));
router.post('/create-checkout-session',catchError(addPayment));
router.post('/webhook',bodyParser.raw({type:'application/json'}),catchError(webhook));
router.post('/confirm-payment',catchError(confirmPayment));
router.get("/my-transaction",catchError(getMyTransactions));

// app.get("/cancel", (req, res) => {
//   res.send("تم إلغاء الدفع.");
// })

router.post("/withdraw",catchError(withdraw));
router.get("/:id",catchError(getSpcificTransaction));

// router.get("/myTransactions",catchError(getMyTransactions));
//GET get my Transactions 
//admin GET all Transactions 
//GET spcific Transactions 
// router.post("/create-order") send id order
// router.post("/capture-order") return id order


module.exports=router;