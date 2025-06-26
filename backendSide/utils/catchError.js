const status=require("../utils/statuscode");
const logger=require("../startup/logging")

module.exports=(handler)=>{
    return async(req,res)=>{
        try{
            await handler(req,res);
        }catch(ex){
            console.log(ex);
            logger.info(ex);
            res.status(500).json({message:status(500)});
        }
    }
}