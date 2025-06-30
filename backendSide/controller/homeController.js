const db=require("../module/db.js");
const jwt=require("jsonwebtoken");
const bcrypt = require("bcrypt");
const message= require("../utils/statuscode.js");
const {signIn,signUp} = require("../utils/validation.js");
const Joi = require("joi");


async function getProduct(req,res){
    const [result]=await db.query(`
        SELECT * FROM Category;   
        SELECT * FROM Product
        LIMIT 4;
        `);
    if(result[0].length===0||!result||result[1].length===0)return res.status(404).json({message:message(404)});
    
    res.status(200).json({
        category:result[0],
        product:result[1],
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

    const {name,email,password,phone_number}=req.body;
    
    const {error}=signUp(req.body);
    if(error) return res.status(400).json({message:message(400),error:error.details[0].message});
    

    let permission="user";
    let [result]=await db.query("SELECT * FROM Users");
    
    
    if(result.length===0)permission="admin";

    const [rows,fields]=await db.execute(`
        SELECT * FROM Users WHERE email=? OR phone_number=? OR name=?;
    `,[email,phone_number,name]);
    
    if(rows.length>0) return res.status(409).json({message:message(409)});
    
    const hashedPassword=await bcrypt.hash(password,10);
   
        [result]=await db.query(`
            INSERT INTO Users (name,email,password,role,phone_number) VALUES (?,?,?,?,?);
            SELECT max(id) "id" FROM Users;
            `,[name,email,hashedPassword,permission,phone_number]);

    
        
        const id=result[1][0].id;

        
        //send otp on email and id in body
    const token=jwt.sign({id},process.env.JWT_SECRET,{expiresIn:"3d"});
    
    res.status(201).json({message:message(201),token,userId:id});
}

//check from otp in body with otp in table User
async function varify(req,res){
    const {otp,userId}=req.body;
    
    const {error}=Joi.number().min(6).max(9).required().validate(otp);
    if(error) return res.status(400).json({message:message(400),error:error.details[0].message});
    
    let [result]=await db.query(`SELECT * FROM Users WHERE id=? ;`,[userId])

    if(result.length===0)return res.status(404).send("not found the user");

    if(result[0].otp_code!==otp)return res.status(400).send("wrong otp code");

    //generat token here then send it
    res.status(201).json({message:message(201),token});
}



module.exports={
    getProduct,
    SignIN,
    SignUp
}




//sign token when vrify
//when sign up = sign otp then send mail for user with link otp page and phone_number
//if true sign token
//in login not need do all this

//must create otp field in database User and install library for token and nodmailer