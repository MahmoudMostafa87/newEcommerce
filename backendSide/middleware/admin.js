const status=require("../utils/statuscode")
module.exports=async(req,res,next)=>{
    if(req.user.role!=="admin")return res.status(401).send(status(401));
    next();
}