const router=require("express").Router();
const {SignIN,
    SignUp,
    getProduct,
}=require("../controller/homeController");

const catchError= require("../utils/catchError");


router.get("/",catchError(getProduct));//*
router.post("/signin",catchError(SignIN));//*
router.post("/signup",catchError(SignUp));//*
// router.post("/varify",catchError());


module.exports=router;
