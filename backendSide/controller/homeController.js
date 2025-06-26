const db=require("../module/db.js");
const jwt=require("jsonwebtoken");
const bcrypt = require("bcrypt");
const message= require("../utils/statuscode.js");
const {signIn,signUp} = require("../utils/validation.js");


async function getProduct(req,res){
    const [result]=await db.query(`
        SELECT * FROM Category;      
        SELECT * FROM Product
        LIMIT 4;
        SELECT * FROM Blogs
        LIMIT 4;
        `);
    if(result[0].length===0||!result||result[1].length===0)return res.status(404).json({message:message(404)});
    
    res.status(200).json({
        category:result[0],
        product:result[1],
        blog:result[2]
    }
    );
}

async function SignIN(req,res){
    const {email,password}=req.body;
    
    const {error}=signIn(req.body);
    if(error) return res.status(400).json({message:message(400),error:error.details[0].message});
    
    const [rows,fields]=await db.execute(`
        SELECT * FROM Users WHERE email=?;
    `,[email]);
    
    if(rows.length===0) return res.status(404).json({message:message(404)});

    const user=rows[0];
    const isValidPassword=await bcrypt.compare(password,user.password);
    if(!isValidPassword) return res.status(401).json({message:message(401)});
    
    const token=jwt.sign({id:user.id},process.env.JWT_SECRET,{expiresIn:"3d"});
    

    res.status(200).json({
        message:message(200),
        token:token,
        user:{
            id:user.id,
            name:user.name,
            email:user.email
        }
    });
}

async function SignUp(req,res){

    const {name,email,password}=req.body;
    
    const {error}=signUp(req.body);
    if(error) return res.status(400).json({message:message(400),error:error.details[0].message});
    
    // await db.execute(`DELETE FROM Users WHERE email=?`,[email]);

    let permission="user";
    let [result]=await db.query("SELECT * FROM Users");
    
    
    if(result.length===0)permission="admin";

    const [rows,fields]=await db.execute(`
        SELECT * FROM Users WHERE email=?;
    `,[email]);
    
    if(rows.length>0) return res.status(409).json({message:message(409)});
    
    const hashedPassword=await bcrypt.hash(password,10);
    
    [result]=await db.query(`
        INSERT INTO Users (name,email,password,permission) VALUES (?,?,?,?);
        SELECT max(id) "id" FROM Users;
    `,[name,email,hashedPassword,permission]);
    const id=result[1][0].id;

        
    const token=jwt.sign({id},process.env.JWT_SECRET,{expiresIn:"3d"});
    
    res.status(201).json({message:message(201),token});
}


module.exports={
    getProduct,
    SignIN,
    SignUp
}

