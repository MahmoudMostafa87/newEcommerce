

const router=require("express").Router();
const catchError=require("../utils/catchError");
const auth=require("../middleware/auth");
const {
addProductInCard,
createCard,
deleteProductFromCard,
getProductsInCard,
updatequantity
}=require("../controller/cartController");


router.use(auth);


router.route('/')
.get(catchError(getProductsInCard))//*
.post(catchError(createCard))//*
.delete(catchError(deleteProductFromCard))//*
.patch(catchError(updatequantity));//*

router.post('/addproduct',catchError(addProductInCard));//*



module.exports=router;

