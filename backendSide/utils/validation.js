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
        permission:joi.string().valid("admin","user").default("user").optional(),
    })
    .validate(body);
}

exports.updateProfile=(body)=>{
    return joi.object({
        name:joi.string().min(3).max(15).optional().trim(),
        address:joi.string().regex(/^([a-zA-Z\u0600-\u06FF0-9\s\-\/\\,.'()#&]{1,50})(\s[a-zA-Z\u0600-\u06FF0-9\s\-\/\\,.'()#&]{1,50}){2,10}$/).optional().trim(),
        email:joi.string().email().optional(),
        phone:joi.string().regex(/^01[0125]\d{8}$/).optional().trim(),
        age:joi.number().min(6).max(70).optional(),
        Type:joi.string().valid("Student","Doctor").default("Student").optional(),
        level:joi.string().valid('first','secound','third','forth').trim().when("Type",{
            is:"Student",
            then:joi.required(),
            otherwise:joi.forbidden()
        }),
    }).validate(body);
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
        Categoryname:joi.string().min(5).max(100).required(),
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
        image_url:joi.string().uri().optional()
    }).xor("name","description","price","stock","Categoryname","image_url")
    .validate(body);
}



exports.validationConfirm=(schema)=>{
    return joi.object({
  country:joi.string().required().min(3).max(50),
  postcode:joi.string().required().min(8).max(10),
  address:joi.string().required().min(3).max(100),
  phoneNumber:joi.string().required().min(8).max(15),
  pick_up_time:joi.date().required()
    }).validate(schema);
}


exports.blogValidation=(body)=>{
    return joi.object({
        title:joi.string().min(3).max(20).required().trim(),
        categoryName:joi.string().min(3).max(100).required().trim(),
        content:joi.string().min(10).max(100000).required().trim()
    }).validate(body);
}

exports.updateBlogValidation=(body)=>{
    return joi.object({
        title:joi.string().min(3).max(50).required().trim(),
        categoryName:joi.string().min(3).max(100).required().trim(),
        content:joi.string().min(10).max(100000).required().trim()
    }).validate(body);
}
