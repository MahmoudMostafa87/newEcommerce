const error=require("../middleware/error");
const home=require("../router/home");
const category=require("../router/category");
const product=require("../router/product");
const cart=require("../router/cart");
const saved_product=require("../router/saved_product");

module.exports=(app)=>{
    app.use("/",home);
    app.use("/category",category);
    app.use("/product",product);
    app.use("/cart",cart);
    app.use("/saved_product",saved_product);
    
    app.use(error);
}

