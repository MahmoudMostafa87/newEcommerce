const router=require("express").Router();
const catchError=require("../utils/catchError");
const auth=require("../middleware/auth")
const admin=require("../middleware/admin")
const upload=require("../middleware/upload")
const validationId=require("../middleware/validationId")

const {
    deleteSpcificProfile,
    getAllProfils,
    getMyprofile,
    getSpcificProfile,
    updateMyprofile,
    updatePassword,
    updatePermission,
    updateProfileImage
}=require("../controller/profileController");

router.param("id",validationId);


router.route("/")
.get(auth,admin,catchError(getAllProfils))//*
.put(auth,upload.single("image"),catchError(updateMyprofile))//*
.delete(auth,catchError(deleteSpcificProfile));//*

router.get("/myProfile",auth,catchError(getMyprofile));//*
router.patch("/uploadImage",auth,upload.single("image"),catchError(updateProfileImage));//*
router.patch("/resetPassword",auth,catchError(updatePassword));//*



router.route("/:id")
.get(auth,admin,catchError(getSpcificProfile))//*
.patch(auth,admin,catchError(updatePermission));//*




//GET MyProfile +
//admin GET SpcificProfile +
//admin GET all Profiles +
//PUT update my profile+
//admin PATCH update permission
//PATCH update profile image
//PATCH update password get current password and change new password
//admin DELETE SpcificProfile

module.exports=router;