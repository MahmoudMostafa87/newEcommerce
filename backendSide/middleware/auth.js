//generate token and inside it in cookies

const jwt=require("jsonwebtoken");
const logger=require("../startup/logging");
const db=require("../module/db");
const status=require("../utils/statuscode")

module.exports=async(req,res,next)=>{
    const token=req.cookies.token;
    // const token=req.header("Authorization").split(" ")[1];
    if(!token)return res.status(400).json({message:"some thing error in token",error:status(400)});
    try{
        const decode=jwt.verify(token,process.env.JWT_SECRET);
        if(!decode)return res.status(403).send(status(403));
        
        const [result]=await db.query("SELECT * FROM Users WHERE id= ? ",[decode.id]);
        req.user=result[0];
        next();
    }catch(ex){
        logger.info(ex);
        res.status(400).json({status:status(400),error:ex});
    }
}