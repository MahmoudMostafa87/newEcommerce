const joi=require("joi");


exports.signIn=(body)=>{
     return joi.object({
        email:joi.string().email().optional(),
        password:joi.string().min(8).max(20).required().trim()
    }).xor('phone','email').validate(body);   
}



    

exports.signUp=(body)=>{
     return joi.object({
        name:joi.string().required().min(3).max(15).trim(),
        email:joi.string().email().required().trim(),
        password:joi.string().min(8).max(20).required().trim(),
        role:joi.string().valid("admin","user").default("user").optional(),
        phone_number:joi.string().min(8).max(15).required()
    })
    .validate(body);
}

exports.updateProfile=(body)=>{
      return joi.object({
        name:joi.string().required().min(3).max(15).trim(),
        email:joi.string().email().required().trim(),
        phone_number:joi.string().min(8).max(15).required(),
        address:joi.string().min(5).max(60).optional(),
    })
    .validate(body);   
}
exports.updateThingInProfile=(body)=>{
      return joi.object({
        name:joi.string().optional().min(3).max(15).trim(),
        email:joi.string().email().optional().trim(),
        password:joi.string().min(8).max(20).optional().trim(),
        role:joi.string().valid("admin","user").optional(),
        phone_number:joi.string().min(8).max(15).optional()
    })
    .xor("name","email","password","role","phone_number")
    .validate(body);
}


exports.contactUsValidation=(body)=>{
    return joi.object({
        name:joi.string().min(3).max(15).required().trim(),
        email:joi.string().email().required().trim(),
        phone:joi.string().min(6).max(14).required().trim(),
        message:joi.string().min(10).max(500).required().trim()
    }).validate(body);
}


exports.productValidation=(body)=>{
    return joi.object({
        name:joi.string().min(3).max(50).required().trim(),
        description:joi.string().min(10).max(500).required().trim(),
        price:joi.number().min(20).max(60000).required(),
        stock:joi.number().min(0).max(1000).required(),
        Categoryname:joi.string().min(3).max(100).required(),
        rating:joi.number().max(10).min(0).optional(),
        commission_rate:joi.number().max(20).min(0).optional(),
        image_url:joi.string().uri().optional()
    }).validate(body);
}

exports.productUpdateThingValidation=(body)=>{
    return joi.object({
        name:joi.string().min(3).max(50).optional().trim(),
        description:joi.string().min(10).max(500).optional().trim(),
        price:joi.number().min(20).max(60000).optional(),
        stock:joi.number().min(0).max(1000).optional(),
        Categoryname:joi.string().min(5).max(100).optional(),
        image_url:joi.string().uri().optional(),
        rating:joi.number().optional().min(0).max(10),
        commission_rate:joi.number().min(0).max(20).optional()
    }).xor("name","description","price","stock","Categoryname","image_url","rating","commission_rate")
    .validate(body);
}



exports.validationConfirm=(schema)=>{
    return joi.object({
  country:joi.string().required().min(3).max(50),
  postcode:joi.string().required().min(8).max(10),
  address:joi.string().required().min(3).max(100),
  phoneNumber:joi.string().required().min(8).max(15)
    }).validate(schema);
}