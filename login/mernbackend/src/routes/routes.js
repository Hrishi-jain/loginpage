const express= require("express");
const {about}= require( '../path/paths')
const router=express.Router();
router.route("/about").get(about);
module.exports=router;