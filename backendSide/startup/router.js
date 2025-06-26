const error=require("../middleware/error");
const home=require("../router/home");
const category=require("../router/category");
const product=require("../router/product");
const cart=require("../router/cart");

module.exports=(app)=>{
    app.use("/",home);//done
    app.use("/category",category);//done
    app.use("/product",product);//done
    app.use("/cart",cart);//done
    
    app.use(error);
}

