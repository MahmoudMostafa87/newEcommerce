const multer=require("multer");
const storage=multer.diskStorage({
    destination:(req,file,cb)=>{    
    if(file.mimetype.split("/")[0]==="image")cb(null,'./upload')
    else cb(new Error("this file not valid"));

    // if(file.mimetype==="svg"||file.mimetype==="png"||file.mimetype==="jpg")cb(null,'./upload/images')
    // else if(file.mimetype==="mp3")cb(null,'./upload/voices')
    // else if(file.mimetype==="mp4")cb(null,"./upload/vedios");
    // else cb(new Error("this file not valid"));

},filename:(req,file,cb)=>{
    cb(null,`${Date.now()}-${file.originalname}`);
}})


module.exports=multer({storage
    ,limits:{fileSize:1024*1024*1024*2}
    ,fileFilter:(req,file,cb)=>{
        // cb(null,true); 
        
        // if(file.size>2000000)cb(new Error("this file is greater than 2GB"))
        // const regexfile=/svg|png|jpg|mp4|mp3/i
        const regexfile=/image/i
        
        if(!regexfile.test(file.mimetype.split("/")[0].toLowerCase()))return cb(new Error("this file is not valid"))
            
            cb(null,true);
}});


//all comments are my mistakes before update it