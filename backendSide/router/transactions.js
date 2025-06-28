const router=require("express").Router();
const auth=require("../middleware/auth");
const admin=require("../middleware/admin");
const validationId=require("../middleware/validationId");
const catchError=require("../utils/catchError");


router.param("id",validationId);


router.use(auth);

// router.get("/myTransactions",catchError(getMyTransactions));
//GET get my Transactions +
//admin GET all Transactions 
//GET spcific Transactions 


// router.post('/confirm',catchError(confirmCard));
// router.post("/create-order") send id order
// router.post("/capture-order") return id order



module.exports=router;