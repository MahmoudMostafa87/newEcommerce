require("dotenv").config();
const express=require("express");
const logger=require("./startup/logging");
const path = require("path");
const cookies=require("cookie-parser");
const cors=require("cors");

const port=process.env.PORT||3000;

const app=express();
app.use("/upload",express.static('upload'));
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(cors({
    credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(cookies());

require("./startup/router")(app);


app.listen(port,()=>{
    console.log("http://localhost:4000/")
    logger.info("run on port");
});