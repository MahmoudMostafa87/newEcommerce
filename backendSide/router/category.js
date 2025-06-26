const router = require('express').Router();
const auth=require("../middleware/auth");
const admin=require("../middleware/admin");
const validateId=require("../middleware/validationId");
const catchError=require("../utils/catchError");

const {
    createCategory,
    getAllCategories,
    getCategoryById,
    updateCategory,
    deleteCategory,
    getProductsFromSpcificCategory
} = require('../controller/categoryController');


router.param('id', validateId);

router.route('/')
.post(auth, admin, catchError(createCategory))//done*
.get(catchError(getAllCategories));//done*

router.get("/:id/products",catchError(getProductsFromSpcificCategory));//done*

router.route("/:id")
    .get(catchError(getCategoryById))//done*
    .put(auth,admin,catchError(updateCategory))//done*
    .delete(auth,admin, catchError(deleteCategory));//done*
//delete after add product but add when delete category must delete it when product is empty
    


module.exports = router;