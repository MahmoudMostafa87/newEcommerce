const db=require("../module/db");
const bcrypt=require("bcrypt");
const deleteFile=require("../utils/deleteFile");
const {updateProfile,
    updateThingInProfile,
}=require("../utils/validation");

async function getMyprofile(req,res){
    const [result]=await db.query(`SELECT * FROM Users
        WHERE id=?`,[req.user.id]);

    if(result.length===0)return res.status(404).json({message:"not found"});
    
    res.status(200).json(result[0]);
}

async function getAllProfils(req,res){
    const {pagesize=12,page=1}=req.query;
    const limit=(page-1)*pagesize;

    const [result]=await db.query(`SELECT * FROM Users
        ORDER BY id
        LIMIT ? OFFSET ? `,[+pagesize,+limit]);

    if(result.length===0)return res.status(404).json({message:"not found"});
    
    res.status(200).json(result);
}

async function getSpcificProfile(req,res){
    const [result]=await db.query(`SELECT * FROM Users
        WHERE id=?`,[+req.params.id]);

    if(result.length===0)return res.status(404).json({message:"not found"});
    
    res.status(200).json(result[0]);
}

async function updateMyprofile(req,res){
    const {name,email,phone_number,address}=req.body;
    
    const {error}=updateProfile(req.body);

    if(error)return res.status(400).json({message:error.details[0].message});

    
    const [result]=await db.query(`
        SELECT * FROM Users
        WHERE email=? AND phone_number=?`,
        [email,phone_number]);
        
    //why 1 if user here not need update his phone
    if(result.length>1)return res.status(409).json({message:"not can update profile"});
    
    let image_url;
    if(req.file){
        image_url=req.protocol+"://"+req.header("host")+"/"+req.file.path;
        deleteFile(result[0].image_url.split("\\")[1]);
    }else{
        
    const [result]=await db.query(`
        SELECT * FROM Users
        WHERE id=?`,
        [req.user.id]);
        image_url=result[0].image_url;
    }

        if(address){
            await db.execute(`
                UPDATE Users
                SET name=?, email=?,phone_number=?,address=?,image_url=?
                WHERE id=?`,[name,email,phone_number,address,image_url,req.user.id]);
        }else{
            await db.execute(`
                UPDATE Users
                SET name=?, email=?,phone_number=?,image_url=?
                WHERE id=?`,[name,email,phone_number,image_url,req.user.id]);
        }
    

    res.status(200).json({message:"done update profile"});
}

async function updatePermission(req,res){

    const {error}=updateThingInProfile(req.body);
    if(error)return res.status(400).json({message:error.details[0].message});

    const [result]=await db.query(`SELECT * FROM Users WHERE id=?`,[+req.params.id]);
    if(result.length===0)return res.status(404).json({message:"not found user"});
    
    await db.execute(`
        UPDATE Users 
        SET role=?
        WHERE id=?`,[req.body.role,+req.params.id]);

    res.status(200).json({message:"done update permission for user"});
}


async function updateProfileImage(req,res){

    if(!req.file)return res.status(400).send("please send file");
    const image_url=req.protocol+"://"+req.header("host")+"/"+req.file.path;
    
    const [result]=await db.query(`
        SELECT * FROM Users WHERE id=?`,[req.user.id]);
    
    if(result.length===0)return res.status(400).send("not found profile");

    deleteFile(result[0].image_url.split("\\")[1]);

    await db.execute(`
        UPDATE Users SET image_url=? WHERE id=?`,[image_url,req.user.id]);

    res.status(200).json({messag:"update image successful"});
}

async function updatePassword(req,res){
    const {newpassword,oldPassword,confirmPassword}=req.body;
    
    const {error}=updateThingInProfile({password:req.body.newpassword});
    if(error)return res.status(400).json({message:error.details[0].message});

    if(newpassword!==confirmPassword)return res.status(400).json({message:"enter confirm password"});
    
    const [result]=await db.query(`SELECT * FROM Users WHERE id=?`,[req.user.id]);
    if(result.length===0)return res.status(404).json({message:"not found user"});

    const match=bcrypt.compare(oldPassword,result[0].password);
    if(!match) return res.status(400).json({message:"enter good password"});
    
    const salt=await bcrypt.genSalt(10);
    const hashedPassword=await bcrypt.hash(newpassword,salt);
    
    await db.execute(`
        UPDATE Users
        SET password=?
        WHERE id=?`,[hashedPassword,req.user.id]);

    res.status(200).json({message:"done changed password"});
}

async function deleteSpcificProfile(req,res){
 
    const [result]=await db.query(`SELECT * FROM Users WHERE id=?`,[+req.params.id]);

    if(result.length===0)return res.status(404).send("not found this user");
    
    deleteFile(result[0].image_url.split("\\")[1]);

    await db.execute("DELETE FROM Users WHERE id=?",[+req.params.id]);

    res.status(200).json({message:"delete user Successfuly"})
};


module.exports={
    getAllProfils,
    getMyprofile,
    getSpcificProfile,
    deleteSpcificProfile,
    updateMyprofile,
    updatePassword,
    updatePermission,
    updateProfileImage,
}

