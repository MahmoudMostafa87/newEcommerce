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

router.use(auth);
router.param("id",validationId);


router.route("/")
.get(admin,catchError(getAllProfils))//*
.put(upload.single("image"),catchError(updateMyprofile))//*

router.get("/myProfile",catchError(getMyprofile));//*
router.patch("/uploadImage",upload.single("image"),catchError(updateProfileImage));//*
router.patch("/resetPassword",catchError(updatePassword));//*



router.route("/:id")
.get(admin,catchError(getSpcificProfile))//*
.patch(admin,catchError(updatePermission))//*
.delete(admin,catchError(deleteSpcificProfile));//*




//GET MyProfile +
//admin GET SpcificProfile +
//admin GET all Profiles +
//PUT update my profile+
//admin PATCH update permission
//PATCH update profile image
//PATCH update password get current password and change new password
//admin DELETE SpcificProfile

module.exports=router;