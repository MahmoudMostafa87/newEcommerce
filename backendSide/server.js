require("dotenv").config();
const express=require("express");
const logger=require("./startup/logging");
const cors=require("cors");

const port=process.env.PORT||3000;

const app=express();
app.use("/upload",express.static('upload'));
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended:true}));



require("./startup/router")(app);

app.listen(port,()=>{
    logger.info("run on port");
});