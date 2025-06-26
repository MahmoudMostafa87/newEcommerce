const joi=require("joi");

module.exports=(req,res,next,id)=>{
    id=parseInt(id);
    const {error}=joi.number().integer().min(1).required().validate(req.params.id, { abortEarly: false })
    if(error)return res.status(400).json({message:"enter good id"});
    next();
}