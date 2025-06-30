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
.post(auth, admin, catchError(createCategory))//*
.get(catchError(getAllCategories));//*

router.get("/:id/products",catchError(getProductsFromSpcificCategory));//*

router.route("/:id")
    .get(catchError(getCategoryById))//*
    .put(auth,admin,catchError(updateCategory))//*
    .delete(auth,admin, catchError(deleteCategory));//*
    


module.exports = router;