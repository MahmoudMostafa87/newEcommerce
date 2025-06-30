//get product saved it
//save product by create entity in table saved_product
//delete product saved it
//when click on product will go to endpoint /product

const router=require("express").Router();
const catchError=require("../utils/catchError");
const auth=require("../middleware/auth");
const validationId=require("../middleware/validationId");
const {
deleteProductSaved,
getProductSaved,
savedProduct
}=require("../controller/saved_productController");

router.param("id",validationId);
router.use(auth);

router.route("/")
.post(catchError(savedProduct))//*
.get(catchError(getProductSaved));//*

router.delete('/:id',catchError(deleteProductSaved))//*


//the endpoint in product or spcific product on any page
// POST /saved_product 

//the endpoints in profile
// GET /saved_product
// DELETE /saved_product/:id 


module.exports=router;