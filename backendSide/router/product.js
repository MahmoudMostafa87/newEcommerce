const router = require('express').Router();
const auth=require("../middleware/auth");
const admin=require("../middleware/admin");
const validateId=require("../middleware/validationId");
const catchError=require("../utils/catchError");
const upload=require("../middleware/upload");

const {addProductController,
    deleteProductController,
    getAllProductsController,
    getProductController,
    updateProductController,
    updateThingInProductController,
    updateImageProduct
} = require('../controller/productController');


    router
        .param('id', validateId);
    
    
router.route('/')
    .post(auth, admin,upload.single("image"), catchError(addProductController))//done*
    .get(catchError(getAllProductsController));//done*
    

router.route("/:id")
    .get(catchError(getProductController))//done*
    .put(auth,admin,upload.single("image"),catchError(updateProductController))//done*
    .patch(auth,admin,catchError(updateThingInProductController))//done*
    .delete(auth,admin, catchError(deleteProductController));//done*

router.patch("/:id/update_image",auth,admin,upload.single("image"),catchError(updateImageProduct))//done*

module.exports = router;

