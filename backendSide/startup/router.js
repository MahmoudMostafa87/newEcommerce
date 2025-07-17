const error=require("../middleware/error");
const home=require("../router/home");
const category=require("../router/category");
const product=require("../router/product");
const cart=require("../router/cart");
const saved_product=require("../router/saved_product");
const profile=require("../router/profile");
const transactions=require("../router/transactions");


module.exports=(app)=>{
    app.use("/",home);//*
    app.use("/category",category);//*
    app.use("/product",product);//*
    app.use("/cart",cart);//*
    app.use("/saved_product",saved_product);//*
    app.use("/profile",profile);//*
    app.use("/transactions",transactions);
    
    app.use(error);
}


/*
{
  "email":"Mahmouasddsa@gmail.com",
  "password":"reset*password&",
  "name":"mahmoud",
  "phone_number":"0121123423"
}
*/



/*
users
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NSwiaWF0IjoxNzUxMzAwMjkzLCJleHAiOjE3NTE1NTk0OTN9.xonP9xHVd-KChukPS6oHApnibMhOXkHI5n2KSeGGZNE
{
  "name":"mahmsoud",
  "phone_number":"0121123422",
  "email":"Mahmouasddjhvksa@gmail.com",
  "password":"asdnasdkjb"
  
paypal_email:sb-jhpyw40756501@personal.example.com
password_paypal:3CX9X/^t

  }




eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NiwiaWF0IjoxNzUxMzAwMzQ1LCJleHAiOjE3NTE1NTk1NDV9.LbdgD88QsjCcpBJEaOs_KAe65TKTBDEGLHjluYRyfVI
{
  "name":"mohmed",
  "phone_number":"0121123421",
  "email":"Mahmouasddjhvh@gmail.com",
  "password":"asdnasdb"
}

*/