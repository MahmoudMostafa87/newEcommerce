const router=require("express").Router();
const {SignIN,
    SignUp,
    getProduct,
}=require("../controller/homeController");

const catchError= require("../utils/catchError");


router.get("/",catchError(getProduct));//done*
router.post("/signin",catchError(SignIN));//done
router.post("/signup",catchError(SignUp));//done*



module.exports=router;
