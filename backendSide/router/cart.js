

const router=require("express").Router();
const catchError=require("../utils/catchError");
const auth=require("../middleware/auth");
const {
addProductInCard,
confirmCard,
createCard,
deleteProductFromCard,
getProductsInCard,
updatequantity
}=require("../controller/cartController");


router.use(auth);


router.route('/')
.get(catchError(getProductsInCard))//done*
.post(catchError(createCard))//done*
.delete(catchError(deleteProductFromCard))//done*
.patch(catchError(updatequantity));//done*

router.post('/addproduct',catchError(addProductInCard));//done*
router.post('/confirm',catchError(confirmCard));//done*



module.exports=router;

