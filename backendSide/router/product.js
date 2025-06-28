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
    getMyProduct,
    updateProductController,
    updateThingInProductController,
    updateImageProduct
} = require('../controller/productController');


    router
        .param('id', validateId);
    
    
router.route('/')
    .post(auth, admin,upload.single("image"), catchError(addProductController))
    .get(catchError(getAllProductsController));
    


router.get("/myProduct",auth,catchError(getMyProduct));


router.route("/:id")
    .get(catchError(getProductController))
    .put(auth,admin,upload.single("image"),catchError(updateProductController))
    .patch(auth,admin,catchError(updateThingInProductController))
    .delete(auth,admin, catchError(deleteProductController));

router.patch("/:id/update_image",auth,admin,upload.single("image"),catchError(updateImageProduct))


module.exports = router;

