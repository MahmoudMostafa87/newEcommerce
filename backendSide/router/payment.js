const router=require("express").Router();
const auth=require("../middleware/auth");
const admin=require("../middleware/admin");
const validationId=require("../middleware/validationId");
const catchError=require("../utils/catchError");

const {deleteOrder,
    getMeOrders,
    getOrders,
    getSpcificOrder
}=require("../controller/orderController");

router.param("id",validationId);


router.use(auth);

router.get("/",admin,catchError(getOrders));//done*

router.get("/myOrders",catchError(getMeOrders));//done*

router.route("/:id")
.get(catchError(getSpcificOrder))//done*
.delete(admin,catchError(deleteOrder));//done*

module.exports=router;