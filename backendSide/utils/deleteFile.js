const fs=require("fs");
const path=require("path");
const logger=require("../startup/logging.js");

async function deleteFile(filename){
    try{
    const url=path.join(__dirname.split("\\utils")[0],"upload",filename);
    fs.unlink(url,(err)=>{
        if(err)
            throw new Error(err);
    });
    logger.info("done deleted file name"+filename);
    }catch(ex){
    logger.error(ex);
    }
}


module.exports=deleteFile;