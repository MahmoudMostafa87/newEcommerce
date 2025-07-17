const router=require("express").Router();
const auth=require("../middleware/auth");
const admin=require("../middleware/admin");
const validationId=require("../middleware/validationId");
const catchError=require("../utils/catchError");
const {
    captureOrder,
    createOrder,
    getAllTransactions,
    getMyTransactions,
    getSpcificTransaction,
    withdraw,
    successPayMent
}=require("../controller/transactionsController");

router.param("id",validationId);

router.use(auth);


router.get("/",admin,catchError(getAllTransactions));
router.get("/my-transaction",catchError(getMyTransactions));
router.post("/create-order",catchError(createOrder));
router.get("/success",catchError(successPayMent));
router.post("/capture-order",catchError(captureOrder));////////////

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